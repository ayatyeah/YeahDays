/**
 * Утренняя и вечерняя рассылка. Зовётся встроенным планировщиком
 * (pushScheduler.ts) и маршрутом /api/push/send — раз в час достаточно.
 *
 * Логика: для каждой живой подписки считаем ЛОКАЛЬНЫЙ час пользователя
 * и шлём, только если наступило его утро или вечер и сегодня такого ещё
 * не отправляли. Текст собирается из снимка прогресса (UserState), поэтому
 * уведомление конкретное: «осталось 1 из 3», а не «зайди в приложение».
 */

import { prisma } from "@/lib/db";
import {
  sendPush,
  pushConfigured,
  localHour,
  localDateKey,
  morningMessage,
  eveningMessage,
  type DayContext,
  type PushPayload,
} from "@/lib/push";
import { DEFAULT_NOTIFY, inQuietHours } from "@/lib/notifyPlan";
import { nextGoal } from "@/lib/milestone";


/** Форма снимка, которая нас интересует (см. store/useUserStore SyncData). */
interface SnapshotShape {
  plan?: {
    date?: string;
    completed?: boolean;
    xp?: number;
  }[];
  freezes?: { days?: string[] };
  dailyGoal?: number;
  notify?: {
    daily?: boolean;
    quietFrom?: number;
    quietTo?: number;
  };
}

/** Настройки уведомлений живут в снимке состояния, отдельной таблицы нет. */
function prefsOf(data: unknown) {
  const snap = (data ?? {}) as SnapshotShape;
  return { ...DEFAULT_NOTIFY, ...(snap.notify ?? {}) };
}


/** Контекст дня из серверного снимка прогресса. */
function dayContext(data: unknown, today: string): DayContext {
  const snap = (data ?? {}) as SnapshotShape;
  const plan = Array.isArray(snap.plan) ? snap.plan : [];
  const todays = plan.filter((t) => t?.date === today);
  const doneToday = todays.filter((t) => t?.completed).length;

  // стрик: считаем по завершённым дням, включая спасённые заморозкой
  const days = new Set<string>();
  for (const t of plan) if (t?.completed && t.date) days.add(t.date);
  for (const d of snap.freezes?.days ?? []) days.add(d);

  let streak = 0;
  const cursor = new Date(`${today}T00:00:00Z`);
  if (!days.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  // «тянущая вперёд» веха: считаем ту же ближайшую цель, что и на экране, но
  // в пуш берём только дальние типы (эволюция/уровень/стрик) — «день» и
  // «зелёный день» противоречили бы вечернему «день засчитан».
  const totalXp = plan.reduce(
    (s, t) => (t?.completed ? s + (t.xp ?? 0) : s),
    0,
  );
  const goal = nextGoal({
    totalXp,
    takenToday: todays.length,
    dailyGoal: snap.dailyGoal ?? 2,
    streak,
    toGreenDay: null,
  });
  const goalShort =
    goal && (goal.kind === "evolution" || goal.kind === "level" || goal.kind === "streak")
      ? goal.short
      : null;

  return { doneToday, plannedToday: todays.length, streak, goalShort };
}

export async function runDigest(now: Date = new Date()) {
  if (!pushConfigured) return { ok: false as const, reason: "VAPID keys not set" };

  let sent = 0;
  let skipped = 0;
  let expired = 0;

  const subs = await prisma.pushSubscription.findMany({
    where: { enabled: true },
    include: { user: { select: { state: { select: { data: true } } } } },
    take: 5000,
  });

  for (const sub of subs) {
    const hour = localHour(sub.tzOffset, now);
    const today = localDateKey(sub.tzOffset, now);

    const prefs = prefsOf(sub.user?.state?.data);
    // человек выключил ритм дня или спит — ничего не шлём
    if (!prefs.daily || inQuietHours(hour, prefs.quietFrom, prefs.quietTo)) {
      skipped++;
      continue;
    }

    const kind =
      hour === sub.morningHour
        ? "morning"
        : hour === sub.eveningHour
          ? "evening"
          : null;
    if (!kind) {
      skipped++;
      continue;
    }

    // уже слали такое сегодня — не дублируем
    if (sub.lastSentAt && sub.lastKind === kind) {
      const lastDay = localDateKey(sub.tzOffset, sub.lastSentAt);
      if (lastDay === today) {
        skipped++;
        continue;
      }
    }

    const ctx = dayContext(sub.user?.state?.data, today);

    // вечером не дёргаем тех, кто уже закрыл норму дня
    if (kind === "evening" && ctx.doneToday >= 3) {
      skipped++;
      continue;
    }

    // Захватываем отправку ДО отправки и только если с момента чтения никто
    // не успел: встроенный планировщик и внешний крон могут прийти в одну
    // минуту, и без этого утреннее уведомление приходило бы дважды.
    const claimed = await prisma.pushSubscription.updateMany({
      where: { id: sub.id, lastSentAt: sub.lastSentAt, lastKind: sub.lastKind },
      data: { lastSentAt: now, lastKind: kind },
    });
    if (claimed.count === 0) {
      skipped++;
      continue;
    }

    const payload: PushPayload =
      kind === "morning" ? morningMessage(ctx) : eveningMessage(ctx);

    const res = await sendPush(
      { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
      payload,
    );

    if (res === "expired") {
      await prisma.pushSubscription
        .delete({ where: { id: sub.id } })
        .catch(() => {});
      expired++;
      continue;
    }
    if (res === "sent") sent++;
    else skipped++;
  }

  return { ok: true as const, sent, skipped, expired };
}
