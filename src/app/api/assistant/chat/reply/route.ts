/**
 * /api/assistant/chat/reply — ДиДи пишет сюда и свои ответы, и то, что
 * услышала голосом (role="user" от самой ДиДи, не от браузера) — так
 * голосовые обмены попадают в ту же ленту чата на /didi, а не только в
 * технический лог событий (AssistantEvent). Без этого голос и текст
 * выглядели как два разных места, хотя по смыслу это одна переписка.
 *
 * POST { userId, content, role? } → role: "assistant" (по умолчанию) | "user"
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

  await prisma.assistantChat.create({ data: { userId, role, content } });
  return NextResponse.json({ ok: true });
}
