/**
 * Встроенный планировщик уведомлений — таймер внутри самого сервера.
 *
 * Раньше уведомления будил крон GitHub Actions «раз в 5 минут», но GitHub
 * не гарантирует расписание: по истории запусков он приходил раз в 2–5
 * часов. Напоминание «через 5 минут пара» при таком кроне не доходило
 * никогда. Сервер на Railway живёт постоянно, поэтому таймер здесь
 * срабатывает ровно по минутам и не зависит от чужой очереди.
 *
 * Отправка идемпотентна (строка забирается атомарно до отправки, см.
 * pushDispatch.ts и pushDigest.ts), так что внешний крон, если он всё же
 * придёт в ту же минуту, дубля не даст.
 *
 * Выключается переменной PUSH_SCHEDULER=off — например, если сервисов
 * станет несколько и таймер нужен только в одном.
 */

import { pushConfigured } from "@/lib/push";

const MINUTE = 60_000;

declare global {
  // eslint-disable-next-line no-var
  var __ygPushScheduler: boolean | undefined;
}

export function startPushScheduler() {
  if (process.env.PUSH_SCHEDULER === "off" || !pushConfigured) {
    console.log("push scheduler: выключен", pushConfigured ? "(PUSH_SCHEDULER=off)" : "(нет VAPID-ключей)");
    return;
  }
  // горячая перезагрузка в dev исполняет модуль заново — второй таймер
  // слал бы всё вдвое
  if (globalThis.__ygPushScheduler) return;
  globalThis.__ygPushScheduler = true;
  console.log("push scheduler: запущен, прогон раз в минуту");

  let running = false;
  let lastDigestHour = -1;

  const tick = async () => {
    // долгий прогон не должен наслаиваться на следующий
    if (running) return;
    running = true;
    const now = new Date();
    try {
      const { runDispatch } = await import("@/lib/pushDispatch");
      await runDispatch(now);
      // утро/вечер считаются по часам — хватает одного прогона в час
      if (now.getUTCHours() !== lastDigestHour) {
        const { runDigest } = await import("@/lib/pushDigest");
        await runDigest(now);
        lastDigestHour = now.getUTCHours();
      }
    } catch (e) {
      console.error("push scheduler tick failed:", e);
    } finally {
      running = false;
    }
  };

  // первый прогон — к началу следующей минуты, дальше ровно по минутам
  setTimeout(() => {
    void tick();
    setInterval(() => void tick(), MINUTE);
  }, MINUTE - (Date.now() % MINUTE));
}
