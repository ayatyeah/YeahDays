/**
 * /api/assistant/chat/reply — ДиДи пишет сюда свой ответ на сообщение из
 * чата на странице /didi.
 *
 * POST { userId, content } → создаёт сообщение role="assistant"
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
  if (!userId || !content) {
    return NextResponse.json({ error: "userId and content required" }, { status: 400 });
  }

  await prisma.assistantChat.create({ data: { userId, role: "assistant", content } });
  return NextResponse.json({ ok: true });
}
