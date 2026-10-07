/**
 * POST /api/study-events/tutor — ИИ-помощник по подготовке (lib/tutor.ts).
 * Отвечает потоком текста (text/plain), чтобы ответ появлялся сразу.
 * GET — подключён ли ИИ.
 *
 * Тело: { eventId, focus, messages: [{ role, text }], lang, consent }.
 * Материал ивента сервер берёт из кода по id из focus. Переписка не хранится.
 * Согласие — как у остальных ИИ-функций: общее разрешение или галочка.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/rateLimit";
import { gradeAvailable } from "@/lib/examGrade";
import { cleanFocus, cleanMessages, findTutorEvent, MAX_HISTORY, MAX_MESSAGE, streamTutor, TUTOR_CONSENT, type TutorLang } from "@/lib/tutor";

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
    if (raw.length > MAX_MESSAGE * MAX_HISTORY * 2 + 20_000) return json({ error: "Слишком большой запрос" }, 400);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Некорректный запрос" }, 400);
  }
  if (body.consent !== TUTOR_CONSENT) return json({ error: "Нужно согласие на отправку вопроса в OpenAI" }, 400);
  const event = findTutorEvent(body.eventId);
  if (!event) return json({ error: "Такого ивента нет" }, 404);
  const messages = cleanMessages(body.messages);
  if (!messages.length) return json({ error: "Напиши вопрос" }, 400);
  if (!gradeAvailable()) return json({ error: "ИИ ещё не подключён" }, 503);

  if (!rateLimit(`tutor:${userId}`, 10, 60_000)) return json({ error: "Слишком часто — подожди минуту" }, 429);
  if (!rateLimit(`tutor-day:${userId}`, 120, 86_400_000)) return json({ error: "На сегодня вопросов больше нет — лимит обновится через сутки" }, 429);
  if (!rateLimit("tutor:global", 4000, 86_400_000)) return json({ error: "Общий дневной лимит ИИ исчерпан" }, 429);

  const lang: TutorLang = body.lang === "en" || body.lang === "kk" ? body.lang : "ru";
  try {
    const stream = await streamTutor(event, cleanFocus(body.focus), messages, lang, req.signal);
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "private, no-store", "X-Accel-Buffering": "no" },
    });
  } catch {
    return json({ error: "Помощник не ответил — попробуй ещё раз" }, 502);
  }
}
