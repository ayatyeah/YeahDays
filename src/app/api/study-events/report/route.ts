/**
 * POST /api/study-events/report — отчёт ИИ по пробному варианту: слабые темы
 * и ссылки на конспект и тренажёр (lib/examReport.ts).
 *
 * Тело: { eventId, examId, items: [{ taskId, score, points, missing, mistakes }],
 * lang, consent }. Ответы человека не нужны и не принимаются — только итоги
 * проверки. Согласие — как у проверки ответов.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/rateLimit";
import { findEvent } from "@/lib/events";
import { gradeAvailable, type GradeLang } from "@/lib/examGrade";
import { buildReport, REPORT_CONSENT, type ReportItem } from "@/lib/examReport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (value: unknown, status = 200) =>
  NextResponse.json(value, { status, headers: { "Cache-Control": "private, no-store" } });

export async function POST(req: Request) {
  const userId = (await auth())?.user?.id;
  if (!userId) return json({ error: "Войди в аккаунт" }, 401);

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 40_000) return json({ error: "Слишком большой запрос" }, 400);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Некорректный запрос" }, 400);
  }
  if (body.consent !== REPORT_CONSENT) return json({ error: "Нужно согласие на отправку итогов проверки в OpenAI" }, 400);
  const event = typeof body.eventId === "string" ? findEvent(body.eventId) : undefined;
  const exam = event?.mocks?.find((m) => m.id === body.examId);
  if (!event || !exam) return json({ error: "Такого варианта нет" }, 404);
  const known = new Set(exam.questions.flatMap((q) => q.tasks.map((t) => t.id)));
  const items: ReportItem[] = (Array.isArray(body.items) ? body.items : [])
    .filter((it): it is ReportItem => !!it && typeof it === "object" && known.has((it as ReportItem).taskId))
    .slice(0, 40)
    .map((it) => ({
      taskId: it.taskId,
      score: Number(it.score) || 0,
      points: Number(it.points) || 0,
      missing: Array.isArray(it.missing) ? it.missing.filter((x) => typeof x === "string").slice(0, 4) : [],
      mistakes: Array.isArray(it.mistakes) ? it.mistakes.filter((x) => typeof x === "string").slice(0, 4) : [],
    }));
  if (items.length < 3) return json({ error: "Сначала проверь хотя бы три ответа" }, 400);
  if (!gradeAvailable()) return json({ error: "ИИ ещё не подключён" }, 503);
  if (!rateLimit(`report:${userId}`, 12, 86_400_000)) return json({ error: "На сегодня отчётов больше нет — лимит обновится через сутки" }, 429);
  const lang: GradeLang = body.lang === "en" || body.lang === "kk" ? body.lang : "ru";

  try {
    return json(await buildReport(event, exam, items, lang));
  } catch {
    return json({ error: "Не удалось собрать отчёт — попробуй ещё раз" }, 502);
  }
}
