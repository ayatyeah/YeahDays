/**
 * Отправка запланированных уведомлений. Зовётся встроенным планировщиком
 * (pushScheduler.ts) раз в минуту и маршрутом /api/push/dispatch.
 *
 * В отличие от утренней и вечерней рассылки (pushDigest.ts), которой хватает
 * часа, здесь нужна минута. Минутная сетка нужна, потому что
 * «время задачи вышло» в 14:37 — это про 14:37, а не «где-то во второй
 * половине дня».
 *
 * Пропущенные окна (крон не сработал, сервер перезапускался) добираются:
 * берём всё, чьё время наступило, но не старше GRACE — старое уведомление
 * бесполезно и выглядит как спам.
 */

import { prisma } from "@/lib/db";
import { sendPush, pushConfigured, localHour, localDateKey } from "@/lib/push";
import {
  DEFAULT_NOTIFY,
  inQuietHours,
  buildSchedule,
  type ActiveTaskInput,
  type TodoInput,
} from "@/lib/notifyPlan";

/** Насколько опоздавшее уведомление ещё имеет смысл показывать. */
const GRACE_MS = 10 * 60_000;
/** Потолок на один прогон — крон должен укладываться в минуту. */
const BATCH = 300;

interface NotifySnapshot {
  notify?: {
    daily?: boolean;
    tasks?: boolean;
    todos?: boolean;
    quietFrom?: number;
    quietTo?: number;
  };
}

/** Настройки уведомлений из снимка состояния — отдельной таблицы не заводим. */
function prefsOf(data: unknown) {
  const snap = (data ?? {}) as NotifySnapshot;
  return { ...DEFAULT_NOTIFY, ...(snap.notify ?? {}) };
}

/* ────────────────────────  Проактивное планирование  ────────────────────────
 *
 * До этого места расписание (ScheduledNotification) заполнял только браузер
 * (NotificationCenter → POST /api/push/schedule) на каждый ререндер. Если
 * вкладка ни разу не открывалась, очередь пуста и кроне нечего слать — ниже
 * тот же самый расчёт (buildSchedule из notifyPlan.ts), но по снимку
 * состояния в БД, без браузера. Только INSERT новых строк (createMany +
 * skipDuplicates): апдейт уже отправленных здесь не делаем намеренно — иначе
 * сброс sentAt на каждый минутный прогон кроном заново отправлял бы то, что
 * уже доставлено. Как только вкладка откроется, клиентский путь досчитает
 * точнее (учтёт правки) и обновит эти же строки по тому же ключу.
 */

interface TodoSnap {
  id: string;
  title: string;
  date: string;
  hour?: number;
  minute?: number;
  duration?: number;
  repeat?: { kind: string; weekday?: number };
  /** дни, в которые повтор отменён («Отменить в этот день») */
  skipDays?: string[];
  done: boolean;
  doneDays: string[];
}

interface PlannedTaskSnap {
  id: string;
  snapshot?: { title?: string; duration?: number };
  date: string;
  completed: boolean;
  acceptedAt: number;
}

interface StateSnap {
  todos?: TodoSnap[];
  plan?: PlannedTaskSnap[];
}

/** Сколько суток между `day` и якорной датой задачи. Разбор в UTC: при
 *  переходе на летнее время сутки бывают 23- или 25-часовыми, и деление
 *  на 86400000 в локальной зоне давало бы сдвиг. */
function daysFromAnchor(anchor: string, day: string): number {
  const a = Date.parse(`${anchor}T00:00:00Z`);
  const d = Date.parse(`${day}T00:00:00Z`);
  return Math.round((d - a) / 86_400_000);
}

function isTodoOnDay(t: TodoSnap, day: string): boolean {
  if (!t.repeat) return t.date === day;
  // отменённая в этот день пара не должна звать на себя
  if (t.skipDays?.includes(day)) return false;
  if (day < t.date) return false;
  const wd = new Date(`${day}T00:00:00`).getDay();
  switch (t.repeat.kind) {
    case "daily":
      return true;
    case "weekdays":
      return wd >= 1 && wd <= 5;
    case "weekends":
      return wd === 0 || wd === 6;
    case "weekly":
      return wd === (t.repeat.weekday ?? new Date(`${t.date}T00:00:00`).getDay());
    // Через день — от date как от якоря, а не по чётности числа: чётность
    // ломается на стыке 31-дневных месяцев.
    case "everyOther":
      return daysFromAnchor(t.date, day) % 2 === 0;
    default:
      return false;
  }
}

function isTodoDone(t: TodoSnap, day: string): boolean {
  return t.repeat ? t.doneDays.includes(day) : t.done;
}

/**
 * Момент начала задачи в зоне пользователя. `tzOffset` — как у
 * Date.getTimezoneOffset() на его устройстве (для UTC+5 это −300), поэтому
 * локальное время = UTC − offset, и обратно: UTC = локальное + offset.
 * Раньше здесь сдвигались поля даты под зону сервера — с потерей минут и с
 * датой в ключе, не совпадавшей с клиентской (одно напоминание уходило в
 * очередь дважды).
 */
function todoStartAt(day: string, hour: number, minute: number, tzOffsetMinutes: number): number {
  const [y, m, d] = day.split("-").map(Number);
  return Date.UTC(y, m - 1, d, hour, minute, 0, 0) + tzOffsetMinutes * 60_000;
}

/** Досчитать и завести в очередь то, что ещё никто не запланировал. */
async function scheduleProactive(now: Date) {
  const users = await prisma.user.findMany({
    where: { pushSubs: { some: { enabled: true } } },
    select: {
      id: true,
      pushSubs: { where: { enabled: true }, select: { tzOffset: true }, take: 1 },
      state: { select: { data: true } },
    },
  });

  const rows: {
    userId: string;
    key: string;
    fireAt: Date;
    title: string;
    body: string;
    url: string;
    kind: string;
    taskId: string | null;
  }[] = [];

  for (const u of users) {
    try {
      const tzOffset = u.pushSubs[0]?.tzOffset ?? 0;
      const day = localDateKey(tzOffset, now);
      const data = (u.state?.data ?? {}) as StateSnap;
      const prefs = prefsOf(u.state?.data);

      const plan = Array.isArray(data.plan) ? data.plan : [];
      const activeTask = plan.find((p) => p.date === day && !p.completed);
      const active: ActiveTaskInput | null = activeTask
        ? {
            id: activeTask.id,
            title: activeTask.snapshot?.title ?? "Задача",
            duration: activeTask.snapshot?.duration ?? 0,
            acceptedAt: activeTask.acceptedAt,
          }
        : null;

      const todosRaw = Array.isArray(data.todos) ? data.todos : [];
      const todos: TodoInput[] = todosRaw
        .filter(
          (t) => typeof t.hour === "number" && isTodoOnDay(t, day) && !isTodoDone(t, day),
        )
        .map((t) => ({
          id: t.id,
          title: t.title,
          day,
          hour: t.hour as number,
          minute: t.minute ?? 0,
          duration: t.duration,
          startAt: todoStartAt(day, t.hour as number, t.minute ?? 0, tzOffset),
        }));

      if (!active && todos.length === 0) continue;

      // Тихие часы здесь не применяем: buildSchedule считает их по часам
      // сервера (UTC), и у человека в UTC+5 «23–7» превращались в 4–12 —
      // напоминание о паре в 9:00 уезжало на полдень. При отправке ниже
      // тихие часы проверяются по времени каждого устройства — этого хватает.
      const items = buildSchedule({
        active,
        todos,
        prefs: { ...prefs, quietFrom: 0, quietTo: 0 },
        now: now.getTime(),
      });
      for (const item of items) {
        rows.push({
          userId: u.id,
          key: item.key,
          fireAt: new Date(item.at),
          title: item.title,
          body: item.body,
          url: item.url,
          kind: item.kind,
          taskId: item.taskId ?? null,
        });
      }
    } catch (e) {
      console.error("scheduleProactive: skip user", u.id, e);
    }
  }

  if (rows.length === 0) return 0;
  const res = await prisma.scheduledNotification.createMany({
    data: rows,
    skipDuplicates: true,
  });
  return res.count;
}

export async function runDispatch(now: Date = new Date()) {
  if (!pushConfigured) return { ok: false as const, reason: "VAPID keys not set" };

  let sent = 0;
  let skipped = 0;
  let expired = 0;
  let scheduled = 0;

  scheduled = await scheduleProactive(now);

  const due = await prisma.scheduledNotification.findMany({
    where: {
      sentAt: null,
      fireAt: { lte: now, gte: new Date(now.getTime() - GRACE_MS) },
    },
    orderBy: { fireAt: "asc" },
    take: BATCH,
    include: {
      user: {
        select: {
          state: { select: { data: true } },
          pushSubs: { where: { enabled: true } },
        },
      },
    },
  });

  for (const item of due) {
    const subs = item.user?.pushSubs ?? [];
    if (subs.length === 0) {
      // подписок нет — строка мертва, держать её незачем
      await prisma.scheduledNotification
        .delete({ where: { id: item.id } })
        .catch(() => {});
      skipped++;
      continue;
    }

    // Забираем строку себе ДО отправки: встроенный планировщик и внешний
    // крон могут выбрать одну и ту же строку в одну минуту, и тогда
    // «через 5 минут пара» приходило бы дважды. Кто первым проставил
    // sentAt, тот и шлёт.
    const claimed = await prisma.scheduledNotification.updateMany({
      where: { id: item.id, sentAt: null },
      data: { sentAt: now },
    });
    if (claimed.count === 0) continue;

    const prefs = prefsOf(item.user?.state?.data);
    // тип уведомления выключен уже после планирования — молчим
    if (
      (item.kind === "task" && !prefs.tasks) ||
      (item.kind === "todo" && !prefs.todos) ||
      (item.kind === "day" && !prefs.daily)
    ) {
      skipped++;
      continue;
    }

    let delivered = false;

    for (const sub of subs) {
      // тихие часы считаем по времени КОНКРЕТНОГО устройства: телефон и
      // ноутбук могут стоять в разных зонах
      if (
        inQuietHours(
          localHour(sub.tzOffset, now),
          prefs.quietFrom,
          prefs.quietTo,
        )
      ) {
        continue;
      }

      const res = await sendPush(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        {
          title: item.title,
          body: item.body,
          url: item.url,
          tag: item.key,
          kind: item.kind,
          taskId: item.taskId ?? undefined,
        },
      );

      if (res === "expired") {
        await prisma.pushSubscription
          .delete({ where: { id: sub.id } })
          .catch(() => {});
        expired++;
        continue;
      }
      if (res === "sent") delivered = true;
    }

    if (delivered) sent++;
    else skipped++;
  }

  // Уборка старого — раз в прогон, дёшево и держит таблицу маленькой.
  await prisma.scheduledNotification.deleteMany({
    where: { fireAt: { lt: new Date(now.getTime() - 24 * 3600_000) } },
  });

  return { ok: true as const, sent, skipped, expired, scheduled };
}
