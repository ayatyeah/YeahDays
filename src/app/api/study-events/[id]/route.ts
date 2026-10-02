/**
 * /api/study-events/<id> — личный прогресс по ивенту и рейтинг друзей.
 *
 * GET  → { progress, share, leaderboard } — свой прогресс и друзья,
 *        которые сами включили участие в рейтинге.
 * PUT  { progress, share } → слить присланное с сохранённым (по каждому
 *        шагу остаётся лучшее) и вернуть результат.
 * POST { questionId, text } → сообщить об ошибке в вопросе.
 * DELETE → стереть свой прогресс по ивенту (и выйти из рейтинга).
 *
 * Содержимое ивента живёт в коде; здесь только то, что принадлежит
 * человеку. Назван study-events, а не events: /api/events — это журнал
 * действий колоды, к ивентам «Учёбы» он отношения не имеет.
 */

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { findEvent } from "@/lib/events";
import { mergeProgress, readiness, sanitizeProgress, type Progress } from "@/lib/events/engine";
import type { StudyEvent } from "@/lib/events/types";
import { friendIds, publicNames } from "@/lib/friends";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

async function resolve(context: Context) {
  const userId = (await auth())?.user?.id;
  if (!userId) return { error: NextResponse.json({ error: "Войди в аккаунт" }, { status: 401 }) };
  const event = findEvent((await context.params).id);
  if (!event) return { error: NextResponse.json({ error: "Такого ивента нет" }, { status: 404 }) };
  return { userId, event };
}

async function payload(userId: string, event: StudyEvent, row: { data: unknown; share: boolean } | null) {
  const progress = sanitizeProgress(event, row?.data);
  const mine = readiness(event, progress);
  const ids = await friendIds(userId);
  // В рейтинг попадают только те, кто сам включил участие, — и только для
  // своих друзей. Чужой прогресс без этого флага не читается вообще.
  const rows = ids.length
    ? await prisma.eventProgress.findMany({ where: { eventId: event.id, share: true, userId: { in: ids } }, select: { userId: true, percent: true } })
    : [];
  const names = await publicNames(rows.map((r) => r.userId));
  const leaderboard = [
    ...rows.map((r) => ({ name: names.get(r.userId) ?? "Без имени", percent: r.percent, me: false })),
    ...(mine.done > 0 ? [{ name: "Ты", percent: mine.percent, me: true }] : []),
  ].sort((a, b) => b.percent - a.percent);
  return { progress, share: row?.share ?? false, leaderboard, friends: ids.length };
}

export async function GET(_req: Request, context: Context) {
  const r = await resolve(context);
  if ("error" in r) return r.error;
  try {
    const row = await prisma.eventProgress.findUnique({ where: { userId_eventId: { userId: r.userId, eventId: r.event.id } } });
    return NextResponse.json(await payload(r.userId, r.event, row), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Не удалось загрузить прогресс" }, { status: 503 });
  }
}

export async function PUT(req: Request, context: Context) {
  const r = await resolve(context);
  if ("error" in r) return r.error;
  if (!rateLimit(`study-event:${r.userId}`, 120, 60_000)) return NextResponse.json({ error: "Слишком часто" }, { status: 429 });
  let body: { progress?: unknown; share?: unknown };
  try {
    const text = await req.text();
    if (text.length > 20_000) throw new Error("too large");
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  try {
    const key = { userId_eventId: { userId: r.userId, eventId: r.event.id } };
    const row = await prisma.$transaction(async (tx) => {
      // Блокировка строки: два устройства, сохраняющие одновременно, иначе
      // слили бы каждое со старой версией и одно затёрло бы другое.
      await tx.$queryRaw`SELECT 1 FROM "EventProgress" WHERE "userId" = ${r.userId} AND "eventId" = ${r.event.id} FOR UPDATE`;
      const stored = await tx.eventProgress.findUnique({ where: key });
      const merged: Progress = mergeProgress(sanitizeProgress(r.event, stored?.data), sanitizeProgress(r.event, body.progress));
      const share = typeof body.share === "boolean" ? body.share : (stored?.share ?? false);
      const data = { data: merged as unknown as Prisma.InputJsonValue, percent: readiness(r.event, merged).percent, share };
      return tx.eventProgress.upsert({ where: key, create: { userId: r.userId, eventId: r.event.id, ...data }, update: data });
    });
    return NextResponse.json(await payload(r.userId, r.event, row));
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить прогресс" }, { status: 503 });
  }
}

export async function POST(req: Request, context: Context) {
  const r = await resolve(context);
  if ("error" in r) return r.error;
  if (!rateLimit(`event-report:${r.userId}`, 10, 3_600_000)) return NextResponse.json({ error: "Слишком много сообщений за час" }, { status: 429 });
  let body: { questionId?: unknown; text?: unknown };
  try {
    body = JSON.parse((await req.text()).slice(0, 4000));
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const known = r.event.lectures.some((l) => l.parts.some((p) => p.questions.some((q) => q.id === body.questionId)));
  if (!known) return NextResponse.json({ error: "Такого вопроса нет" }, { status: 400 });
  if (text.length < 5 || text.length > 500) return NextResponse.json({ error: "Опиши ошибку: от 5 до 500 символов" }, { status: 400 });
  try {
    await prisma.eventReport.create({ data: { userId: r.userId, eventId: r.event.id, questionId: String(body.questionId), text } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось отправить" }, { status: 503 });
  }
}

export async function DELETE(_req: Request, context: Context) {
  const r = await resolve(context);
  if ("error" in r) return r.error;
  try {
    await prisma.eventProgress.deleteMany({ where: { userId: r.userId, eventId: r.event.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось сбросить прогресс" }, { status: 503 });
  }
}
