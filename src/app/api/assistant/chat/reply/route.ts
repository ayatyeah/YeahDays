/**
 * /api/assistant/chat/reply — ДиДи пишет сюда и свои ответы, и то, что
 * услышала голосом (role="user" от самой ДиДи, не от браузера) — так
 * голосовые обмены попадают в ту же ленту чата на /didi, а не только в
 * технический лог событий (AssistantEvent). Без этого голос и текст
 * выглядели как два разных места, хотя по смыслу это одна переписка.
 *
 * POST { userId, content, role? } → role: "assistant" (по умолчанию) | "user"
 *
 * role="user" сюда пишет ИСКЛЮЧИТЕЛЬНО голосовой цикл (logChatMessage в
 * yeahgrind.ts) — команда уже полностью обработана голосом к этому
 * моменту, запись только для отображения в ленте /didi. Браузер шлёт
 * СВОИ сообщения через совсем другой роут (/api/assistant/chat, сессия/
 * device-id, не ASSISTANT_SECRET). Раньше это было неразличимо от
 * непрочитанного сообщения из чата: chat.ts независимо от голосового
 * цикла опрашивает /api/assistant/chat/pull (role="user", pulledAt=null)
 * и подхватывал ЭТУ ЖЕ запись как будто это новое сообщение из браузера —
 * пересчитывал через GPT ещё раз и слал ещё один, другой по тексту ответ.
 * Каждая голосовая команда в итоге стоила ДВА обращения к модели вместо
 * одного. pulledAt=now() сразу при записи убирает её из очереди /pull.
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
  const content = typeof body.content === "string" ? body.content.slice(0, 4000) : "";
  const role = body.role === "user" ? "user" : "assistant";
  if (!userId || !content) {
    return NextResponse.json({ error: "userId and content required" }, { status: 400 });
  }

  await prisma.assistantChat.create({
    data: { userId, role, content, pulledAt: role === "user" ? new Date() : null },
  });
  return NextResponse.json({ ok: true });
}
