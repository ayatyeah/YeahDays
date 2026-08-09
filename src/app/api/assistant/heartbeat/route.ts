/**
 * /api/assistant/heartbeat — ДиДи стучится сюда раз в ~15с, пока процесс
 * жив. Заодно возвращает enabled — переключатель, который пользователь
 * мог выставить из панели в браузере: так один запрос закрывает и "я
 * жива", и "должна ли я сейчас слушать".
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

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const userId = typeof body.userId === "string" ? body.userId : "";
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  await prisma.user.upsert({ where: { id: userId }, create: { id: userId }, update: {} });
  const status = await prisma.assistantStatus.upsert({
    where: { userId },
    create: { userId, lastSeenAt: new Date() },
    update: { lastSeenAt: new Date() },
  });

  return NextResponse.json({ enabled: status.enabled });
}
