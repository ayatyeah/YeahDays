/**
 * /api/assistant/devices — список подписанных на push устройств для
 * голосового ответа СалемАй ("сколько у меня устройств"). Тот же источник
 * данных, что и /api/push/devices (профиль на сайте), но авторизация как у
 * остальных assistant-эндпоинтов — ASSISTANT_SECRET, не сессия браузера.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.ASSISTANT_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") ?? "";
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const subs = await prisma.pushSubscription.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { label: true, enabled: true, updatedAt: true },
  });

  return NextResponse.json({
    devices: subs.map((s) => ({
      label: s.label ?? "неизвестное устройство",
      enabled: s.enabled,
      updatedAt: s.updatedAt.getTime(),
    })),
  });
}
