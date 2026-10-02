/**
 * /api/owner/event-reports — сообщения «в вопросе ошибка» для /admin.
 *
 * GET   → последние сообщения вместе с самим вопросом и верным ответом,
 *         чтобы решение можно было принять, не открывая код.
 * PATCH { id, status } → отметить разобранным или вернуть в новые.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { EVENTS } from "@/lib/events";
import { requireAdmin } from "@/lib/owner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const reports = await prisma.eventReport.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    const questions = new Map(EVENTS.flatMap((e) => e.lectures.flatMap((l) => l.parts.flatMap((p) => p.questions.map((q) => [q.id, q] as const)))));
    return NextResponse.json({
      reports: reports.map((r) => {
        const q = questions.get(r.questionId);
        return { id: r.id, questionId: r.questionId, question: q?.q ?? "(вопрос удалён)", answer: q ? q.options[q.answer] : "", text: r.text, status: r.status, createdAt: r.createdAt };
      }),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Не удалось загрузить сообщения" }, { status: 503 });
  }
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const body = await req.json();
    if (typeof body.id !== "string" || !["new", "done"].includes(body.status)) throw new Error("bad");
    await prisma.eventReport.update({ where: { id: body.id }, data: { status: body.status } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось обновить" }, { status: 400 });
  }
}
