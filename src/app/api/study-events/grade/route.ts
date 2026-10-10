/**
 * POST /api/study-events/grade — проверка открытого ответа пробного экзамена ИИ.
 * GET — подключён ли ИИ (кнопку «Проверить» без него не показываем активной).
 *
 * Тело: { eventId, taskId, answer, lang, consent }. Критерии и эталон сервер
 * берёт из кода ивента по taskId (lib/examGrade.ts). Согласие — как у
 * остальных ИИ-функций: общее разрешение на ИИ или галочка перед отправкой,
 * клиент присылает маркер GRADE_CONSENT. Ответ не сохраняется.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/rateLimit";
import { dailyLimit } from "@/lib/aiLimit";
import { findGradeTarget, GRADE_CONSENT, gradeAnswer, gradeAvailable, MAX_ANSWER, type GradeLang } from "@/lib/examGrade";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (value: unknown, status = 200) =>
  NextResponse.json(value, { status, headers: { "Cache-Control": "private, no-store" } });

export async function GET() {
  return json({ available: gradeAvailable() });
}

export async function POST(req: Request) {
  const userId = (await auth())?.user?.id;
  if (!userId) return json({ error: "Войди в аккаунт" }, 401);

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_ANSWER * 3) return json({ error: "Ответ слишком длинный" }, 400);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Некорректный запрос" }, 400);
  }
  if (body.consent !== GRADE_CONSENT) return json({ error: "Нужно согласие на отправку ответа в OpenAI" }, 400);
  if (typeof body.eventId !== "string" || typeof body.taskId !== "string") return json({ error: "Некорректный запрос" }, 400);
  const answer = typeof body.answer === "string" ? body.answer.trim() : "";
  if (!answer) return json({ error: "Сначала напиши ответ" }, 400);
  if (answer.length > MAX_ANSWER) return json({ error: `Ответ длиннее ${MAX_ANSWER} символов` }, 400);
  const lang: GradeLang = body.lang === "en" || body.lang === "kk" ? body.lang : "ru";

  const target = findGradeTarget(body.eventId, body.taskId);
  if (!target) return json({ error: "Такого задания нет" }, 404);
  if (!gradeAvailable()) return json({ error: "ИИ ещё не подключён" }, 503);

  // Целый вариант — 22 подпункта: в минуту хватает на один вариант с запасом,
  // за день — на несколько вариантов. Общий лимит держит расход в рамках.
  if (!rateLimit(`grade:${userId}`, 25, 60_000)) return json({ error: "Слишком часто — подожди минуту" }, 429);
  if (!(await dailyLimit(`grade-day:${userId}`, 150))) return json({ error: "На сегодня проверок больше нет — лимит обновится через сутки" }, 429);
  if (!(await dailyLimit("grade:global", 4000))) return json({ error: "Общий дневной лимит ИИ исчерпан" }, 429);

  try {
    return json(await gradeAnswer(target, answer, lang));
  } catch {
    return json({ error: "Не удалось проверить — попробуй ещё раз" }, 502);
  }
}
