/**
 * /api/push/subscribe
 *
 * POST   { userId?, subscription, tzOffset }  — подписать устройство
 * DELETE { endpoint }                          — отписать
 *
 * Час вечернего напоминания подбирается под человека: если он уже
 * закрывал действия, берём время, в которое он это обычно делает.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { preferredHour } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function resolveUserId(fallback?: unknown): Promise<string> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return typeof fallback === "string" ? fallback.slice(0, 64) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userId = await resolveUserId(body.userId);
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const sub = body.subscription as
    | { endpoint?: string; keys?: { p256dh?: string; auth?: string } }
    | undefined;
  const endpoint = sub?.endpoint;
  const p256dh = sub?.keys?.p256dh;
  const authKey = sub?.keys?.auth;
  if (!endpoint || !p256dh || !authKey) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  const tzOffset =
    typeof body.tzOffset === "number" ? Math.round(body.tzOffset) : 0;

  try {
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    });

    // подбираем вечерний час под реальное поведение
    const completions = await prisma.event.findMany({
      where: { userId, type: "complete" },
      select: { at: true },
      orderBy: { at: "desc" },
      take: 100,
    });
    const hours = completions.map((e) => {
      const localMs = e.at.getTime() - tzOffset * 60_000;
      return new Date(localMs).getUTCHours();
    });
    const eveningHour = preferredHour(hours, 20);

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: {
        userId,
        endpoint,
        p256dh,
        auth: authKey,
        tzOffset,
        eveningHour,
        enabled: true,
      },
      update: {
        userId,
        p256dh,
        auth: authKey,
        tzOffset,
        eveningHour,
        enabled: true,
      },
    });

    return NextResponse.json({ ok: true, eveningHour });
  } catch (e) {
    console.error("push subscribe failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  let body: { endpoint?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const endpoint = typeof body.endpoint === "string" ? body.endpoint : "";
  if (!endpoint) {
    return NextResponse.json({ error: "endpoint required" }, { status: 400 });
  }
  try {
    await prisma.pushSubscription
      .delete({ where: { endpoint } })
      .catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("push unsubscribe failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
