/**
 * Web Push — серверная часть.
 *
 * Уведомления для трекера привычек — главный механизм возврата. Здесь
 * настройка VAPID, отправка и вежливая уборка мёртвых подписок.
 *
 * Ключи генерируются один раз (`npx web-push generate-vapid-keys`) и
 * живут в env. Без них модуль просто отключается — приложение работает,
 * уведомления молчат.
 */

import webpush from "web-push";

const PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const PRIVATE = process.env.VAPID_PRIVATE_KEY ?? "";
const CONTACT = process.env.VAPID_CONTACT ?? "mailto:noreply@yeahgrind.app";

export const pushConfigured = Boolean(PUBLIC && PRIVATE);

if (pushConfigured) {
  webpush.setVapidDetails(CONTACT, PUBLIC, PRIVATE);
}

export interface PushPayload {
  title: string;
  body: string;
  /** куда вести по клику */
  url?: string;
  tag?: string;
}

export interface PushTarget {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export type SendResult = "sent" | "expired" | "failed";

/**
 * Отправить одно уведомление.
 * 404/410 от push-сервиса означают, что подписка мертва (снесли приложение,
 * почистили данные) — такие надо удалять, а не долбить повторно.
 */
export async function sendPush(
  target: PushTarget,
  payload: PushPayload,
): Promise<SendResult> {
  if (!pushConfigured) return "failed";
  try {
    await webpush.sendNotification(
      {
        endpoint: target.endpoint,
        keys: { p256dh: target.p256dh, auth: target.auth },
      },
      JSON.stringify(payload),
      { TTL: 6 * 3600 },
    );
    return "sent";
  } catch (e) {
    const code = (e as { statusCode?: number })?.statusCode;
    if (code === 404 || code === 410) return "expired";
    console.error("push failed:", code ?? e);
    return "failed";
  }
}

/* ────────────────────────  Когда слать  ──────────────────────── */

/** Локальный час пользователя по сдвигу часового пояса (в минутах). */
export function localHour(tzOffsetMinutes: number, now = new Date()): number {
  // getTimezoneOffset() возвращает минуты, которые надо ПРИБАВИТЬ к локали,
  // чтобы получить UTC, поэтому знак инвертирован.
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const localMs = utcMs - tzOffsetMinutes * 60_000;
  return new Date(localMs).getHours();
}

/** Локальная дата пользователя в формате YYYY-MM-DD. */
export function localDateKey(
  tzOffsetMinutes: number,
  now = new Date(),
): string {
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const d = new Date(utcMs - tzOffsetMinutes * 60_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/**
 * Час, в который человек реально закрывает действия.
 *
 * Смысл: не слать всем одинаково в 20:00, а попадать в то время, когда
 * этот конкретный человек обычно что-то делает. Нужна выборка — иначе
 * подстройка под шум сделает хуже дефолта.
 */
export function preferredHour(
  completionHours: number[],
  fallback: number,
): number {
  if (completionHours.length < 5) return fallback;
  const counts = new Map<number, number>();
  for (const h of completionHours) counts.set(h, (counts.get(h) ?? 0) + 1);
  let best = fallback;
  let bestN = 0;
  for (const [h, n] of counts) {
    if (n > bestN) {
      best = h;
      bestN = n;
    }
  }
  // напоминаем чуть раньше привычного времени, чтобы успел
  return Math.max(6, Math.min(23, best - 1));
}

/* ────────────────────────  Тексты  ──────────────────────── */

export interface DayContext {
  /** сколько действий закрыто сегодня */
  doneToday: number;
  /** сколько взято в план на сегодня */
  plannedToday: number;
  /** текущий стрик */
  streak: number;
  /**
   * Ближайшая «тянущая вперёд» веха для вечернего пуша — уже готовая
   * короткая строка вроде «120 XP до «Собранного»». Заполняется только
   * дальними вехами (эволюция/уровень/стрик), чтобы не спорить с «день
   * засчитан». null — предлагать нечего.
   */
  goalShort?: string | null;
}

/** Утро: зовём выбрать действия. */
export function morningMessage(ctx: DayContext): PushPayload {
  if (ctx.plannedToday > 0) {
    return {
      title: "План на сегодня готов",
      body: `${ctx.plannedToday} ${plural(ctx.plannedToday, "действие", "действия", "действий")} ждут тебя.`,
      url: "/today",
      tag: "yd-morning",
    };
  }
  return {
    title: "Колода на сегодня готова",
    body:
      ctx.streak > 0
        ? `Стрик ${ctx.streak} — выбери, что сделаешь сегодня.`
        : "Выбери одно действие — этого достаточно.",
    url: "/app",
    tag: "yd-morning",
  };
}

/** Вечер: спасаем день, но без вины и давления. */
export function eveningMessage(ctx: DayContext): PushPayload {
  if (ctx.doneToday > 0) {
    // если есть дальняя веха — зовём сделать ещё шаг к ней; иначе про стрик
    const tail = ctx.goalShort
      ? `${ctx.goalShort}.`
      : ctx.streak > 0
        ? `Стрик ${ctx.streak} держится.`
        : "Так держать.";
    return {
      title: "День засчитан",
      body: `Сегодня закрыто: ${ctx.doneToday}. ${tail}`,
      url: "/today",
      tag: "yd-evening",
    };
  }
  if (ctx.streak > 0) {
    return {
      title: `Стрик ${ctx.streak} ещё можно сохранить`,
      body: "Одно небольшое действие — и день закрыт.",
      url: "/app",
      tag: "yd-evening",
    };
  }
  return {
    title: "Ещё есть время на одно действие",
    body: "Даже две минуты считаются.",
    url: "/app",
    tag: "yd-evening",
  };
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
