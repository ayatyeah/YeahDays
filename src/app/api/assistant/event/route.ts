/**
 * /api/assistant/event — ДиДи логирует сюда каждую услышанную фразу,
 * ответ, вызов инструмента и ошибку. Источник ленты для панели в профиле.
 *
 * Обрезаем до последних EVENT_LIMIT записей на пользователя при каждой
 * вставке — это журнал для UI за последние часы, а не архив на годы.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENT_LIMIT = 200;
const KINDS = new Set(["heard", "reply", "tool", "error"]);

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
  const kind = typeof body.kind === "string" ? body.kind : "";
  const text = typeof body.text === "string" ? body.text.slice(0, 2000) : "";
  if (!userId || !KINDS.has(kind) || !text) {
    return NextResponse.json({ error: "userId, valid kind and text required" }, { status: 400 });
  }

  await prisma.user.upsert({ where: { id: userId }, create: { id: userId }, update: {} });
  await prisma.assistantEvent.create({ data: { userId, kind, text } });

  const toPrune = await prisma.assistantEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip: EVENT_LIMIT,
    select: { id: true },
    take: 500,
  });
  if (toPrune.length > 0) {
    await prisma.assistantEvent.deleteMany({
      where: { id: { in: toPrune.map((e) => e.id) } },
    });
  }

  return NextResponse.json({ ok: true });
}
