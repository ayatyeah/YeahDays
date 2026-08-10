/**
 * /api/assistant/memory — долговременная память ДиДи о пользователе
 * ("Джарвис, запомни ..."), отдельно от истории одного разговора.
 *
 * GET    ?userId=             → все факты, старые первыми (устойчивый порядок для промпта)
 * POST   { userId, content }  → добавить факт
 * DELETE ?userId=&id=         → удалить факт (панель "Факты" в desktop-приложении)
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

  const facts = await prisma.assistantFact.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    facts: facts.map((f) => ({ id: f.id, content: f.content, at: f.createdAt.getTime() })),
  });
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const userId = typeof body.userId === "string" ? body.userId : "";
  const content = typeof body.content === "string" ? body.content.trim().slice(0, 2000) : "";
  if (!userId || !content) {
    return NextResponse.json({ error: "userId and content required" }, { status: 400 });
  }

  const fact = await prisma.assistantFact.create({ data: { userId, content } });
  return NextResponse.json({ ok: true, id: fact.id });
}

export async function DELETE(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") ?? "";
  const id = url.searchParams.get("id") ?? "";
  if (!userId || !id) {
    return NextResponse.json({ error: "userId and id required" }, { status: 400 });
  }

  await prisma.assistantFact.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}
