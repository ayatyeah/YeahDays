/**
 * /api/push/send — рассылка напоминаний. Дёргается кроном раз в час.
 *
 * Защищён CRON_SECRET: без него эндпоинт, рассылающий уведомления всем
 * подписчикам, — это открытая кнопка спама.
 *
 * Логика: для каждой живой подписки считаем ЛОКАЛЬНЫЙ час пользователя
 * и шлём, только если наступило его утро или вечер и сегодня такого ещё
 * не отправляли. Текст собирается из снимка прогресса (UserState), поэтому
 * уведомление конкретное: «осталось 1 из 3», а не «зайди в приложение».
 */

import { NextResponse } from "next/server";
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
import { nextGoal } from "@/lib/milestone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Форма снимка, которая нас интересует (см. store/useUserStore SyncData). */
interface SnapshotShape {
  plan?: {
    date?: string;
    completed?: boolean;
    xp?: number;
  }[];
  freezes?: { days?: string[] };
  dailyGoal?: number;
}

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header =
    req.headers.get("authorization") ?? req.headers.get("x-cron-secret") ?? "";
  return header === `Bearer ${secret}` || header === secret;
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

  try {
    const subs = await prisma.pushSubscription.findMany({
      where: { enabled: true },
      include: { user: { select: { state: { select: { data: true } } } } },
      take: 5000,
    });

    for (const sub of subs) {
      const hour = localHour(sub.tzOffset, now);
      const today = localDateKey(sub.tzOffset, now);

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
      if (res === "sent") {
        await prisma.pushSubscription.update({
          where: { id: sub.id },
          data: { lastSentAt: now, lastKind: kind },
        });
        sent++;
      }
    }

    return NextResponse.json({ ok: true, sent, skipped, expired });
  } catch (e) {
    console.error("push send failed:", e);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
