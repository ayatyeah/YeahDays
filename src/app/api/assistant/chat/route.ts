/**
 * /api/assistant/chat — то, что видит браузер (страница /didi). Авторизация
 * как у /api/assistant/panel: сессия или device-id, НЕ ASSISTANT_SECRET.
 *
 * GET  ?userId=&after=        → история переписки (после id — для поллинга)
 * POST { userId, content }    → отправить сообщение ДиДи (role: "user")
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function resolveUserId(fallback?: unknown): Promise<string> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return typeof fallback === "string" ? fallback.slice(0, 64) : "";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = await resolveUserId(url.searchParams.get("userId"));
  if (!userId) return NextResponse.json({ messages: [] });

  const after = url.searchParams.get("after");
  const messages = await prisma.assistantChat.findMany({
    where: after ? { userId, id: { gt: after } } : { userId },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      at: m.createdAt.getTime(),
    })),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const userId = await resolveUserId(body.userId);
  const content = typeof body.content === "string" ? body.content.trim().slice(0, 2000) : "";
  if (!userId || !content) {
    return NextResponse.json({ error: "userId and content required" }, { status: 400 });
  }

  await prisma.user.upsert({ where: { id: userId }, create: { id: userId }, update: {} });
  const message = await prisma.assistantChat.create({
    data: { userId, role: "user", content },
  });

  return NextResponse.json({
    ok: true,
    message: { id: message.id, role: message.role, content: message.content, at: message.createdAt.getTime() },
  });
}
