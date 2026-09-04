/**
 * /api/push/dispatch — отправка запланированных уведомлений.
 *
 * Дёргается кроном раз в минуту (в отличие от /api/push/send, который про
 * утро и вечер и достаточно раз в час). Минутная сетка нужна, потому что
 * «время задачи вышло» в 14:37 — это про 14:37, а не «где-то во второй
 * половине дня».
 *
 * Пропущенные окна (крон не сработал, сервер перезапускался) добираются:
 * берём всё, чьё время наступило, но не старше GRACE — старое уведомление
 * бесполезно и выглядит как спам.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPush, pushConfigured, localHour, localDateKey } from "@/lib/push";
import {
  DEFAULT_NOTIFY,
  inQuietHours,
  buildSchedule,
  type ActiveTaskInput,
  type TodoInput,
} from "@/lib/notifyPlan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header =
    req.headers.get("authorization") ?? req.headers.get("x-cron-secret") ?? "";
  return header === `Bearer ${secret}` || header === secret;
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
  duration?: number;
  repeat?: { kind: string; weekday?: number };
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
 * notifyPlan.ts строит время задачи через `new Date(y,m,d,h)` — локальный
 * конструктор, верный на клиенте (клиент = устройство пользователя), но на
 * сервере читающий y/m/d/h в таймзоне контейнера, а не пользователя. Вместо
 * правки чистой функции (используется и клиентом) сдвигаем сами поля перед
 * вызовом, так что результат конструктора под ЛЮБОЙ таймзоной рантайма
 * совпадёт с нужным моментом в таймзоне пользователя.
 */
function todoWallFields(
  day: string,
  hour: number,
  tzOffsetMinutes: number,
): { day: string; hour: number } {
  const [y, m, d] = day.split("-").map(Number);
  const desiredEpoch = Date.UTC(y, m - 1, d, hour, 0, 0, 0) + tzOffsetMinutes * 60_000;
  const serverOffsetMs = new Date(desiredEpoch).getTimezoneOffset() * 60_000;
  const shifted = new Date(desiredEpoch - serverOffsetMs);
  return {
    day: `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}-${String(
      shifted.getUTCDate(),
    ).padStart(2, "0")}`,
    hour: shifted.getUTCHours(),
  };
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
        .map((t) => {
          const wall = todoWallFields(day, t.hour as number, tzOffset);
          return { id: t.id, title: t.title, day: wall.day, hour: wall.hour, duration: t.duration };
        });

      if (!active && todos.length === 0) continue;

      const items = buildSchedule({ active, todos, prefs, now: now.getTime() });
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

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!pushConfigured) {
    return NextResponse.json({ error: "VAPID keys not set" }, { status: 503 });
  }

  const now = new Date();
  let sent = 0;
  let skipped = 0;
  let expired = 0;
  let scheduled = 0;

  try {
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

      const prefs = prefsOf(item.user?.state?.data);
      // тип уведомления выключен уже после планирования — молчим
      if (
        (item.kind === "task" && !prefs.tasks) ||
        (item.kind === "todo" && !prefs.todos) ||
        (item.kind === "day" && !prefs.daily)
      ) {
        await prisma.scheduledNotification.update({
          where: { id: item.id },
          data: { sentAt: now },
        });
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

      await prisma.scheduledNotification.update({
        where: { id: item.id },
        data: { sentAt: now },
      });
      if (delivered) sent++;
      else skipped++;
    }

    // Уборка старого — раз в прогон, дёшево и держит таблицу маленькой.
    await prisma.scheduledNotification.deleteMany({
      where: { fireAt: { lt: new Date(now.getTime() - 24 * 3600_000) } },
    });

    return NextResponse.json({ ok: true, sent, skipped, expired, scheduled });
  } catch (e) {
    console.error("dispatch failed:", e);
    return NextResponse.json({ error: "Dispatch failed" }, { status: 500 });
  }
}
