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
import { sendPush, pushConfigured, localHour } from "@/lib/push";
import { DEFAULT_NOTIFY, inQuietHours } from "@/lib/notifyPlan";

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

    return NextResponse.json({ ok: true, sent, skipped, expired });
  } catch (e) {
    console.error("dispatch failed:", e);
    return NextResponse.json({ error: "Dispatch failed" }, { status: 500 });
  }
}
