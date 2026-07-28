/**
 * /api/push/schedule — расписание точечных уведомлений.
 *
 * POST { userId?, upsert: NotifyItem[], cancel: string[] }
 *
 * Одна ручка на всё, потому что клиент присылает не «событие», а ДИФФ
 * расписания: что поставить и что снять. Отдельные endpoint-ы на добавление
 * и удаление означали бы два запроса на каждое действие пользователя.
 *
 * Куда потом уходят эти строки — см. /api/push/dispatch (крон раз в минуту).
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Дальше этого горизонта не планируем: расписание всё равно пересоберётся. */
const MAX_HORIZON_MS = 7 * 24 * 3600_000;
/** Защита от клиента, который решил прислать тысячу строк. */
const MAX_ITEMS = 50;

interface IncomingItem {
  key?: unknown;
  at?: unknown;
  title?: unknown;
  body?: unknown;
  url?: unknown;
  kind?: unknown;
  taskId?: unknown;
}

function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
}

async function resolveUserId(fallback?: unknown): Promise<string> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return typeof fallback === "string" ? fallback.slice(0, 64) : "";
}

export async function POST(req: Request) {
  let body: {
    userId?: unknown;
    upsert?: unknown;
    cancel?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userId = await resolveUserId(body.userId);
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const now = Date.now();
  const rawUpsert = Array.isArray(body.upsert)
    ? (body.upsert as IncomingItem[]).slice(0, MAX_ITEMS)
    : [];
  const cancel = Array.isArray(body.cancel)
    ? (body.cancel as unknown[])
        .filter((k): k is string => typeof k === "string")
        .slice(0, MAX_ITEMS)
    : [];

  const items = rawUpsert
    .map((raw) => {
      const key = str(raw.key, 120);
      const title = str(raw.title, 120);
      const at = typeof raw.at === "number" ? raw.at : NaN;
      if (!key || !title || !Number.isFinite(at)) return null;
      // прошлое и слишком далёкое будущее не храним
      if (at <= now || at - now > MAX_HORIZON_MS) return null;
      return {
        key,
        fireAt: new Date(at),
        title,
        body: str(raw.body, 300) ?? "",
        url: str(raw.url, 200) ?? "/app",
        kind: str(raw.kind, 16) ?? "task",
        taskId: str(raw.taskId, 64),
      };
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

  try {
    // Пользователь может быть анонимным устройством, которое сервер видит
    // впервые: без upsert внешний ключ упал бы на первой же записи.
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    });

    if (cancel.length > 0) {
      await prisma.scheduledNotification.deleteMany({
        where: { userId, key: { in: cancel } },
      });
    }

    for (const item of items) {
      await prisma.scheduledNotification.upsert({
        where: { userId_key: { userId, key: item.key } },
        create: { userId, ...item },
        // sentAt сбрасываем: время сдвинулось — это снова неотправленное
        update: { ...item, sentAt: null },
      });
    }

    // Уборка: доставленное и протухшее не должно копиться вечно.
    await prisma.scheduledNotification.deleteMany({
      where: {
        userId,
        fireAt: { lt: new Date(now - 24 * 3600_000) },
      },
    });

    return NextResponse.json({
      ok: true,
      scheduled: items.length,
      cancelled: cancel.length,
    });
  } catch (e) {
    console.error("schedule failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
