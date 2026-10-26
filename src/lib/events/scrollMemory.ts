/**
 * Где остановился в scroll-mode — на устройстве, отдельно для каждой части.
 *
 * - at — последнее место вообще: «📜 Scroll-mode» с маршрута продолжает с него;
 * - places — последнее место в каждой части: открыл часть — вернулся туда же;
 * - tests — недоотвеченный тест части: те же вопросы в том же порядке и уже
 *   данные ответы. Когда тест засчитан, запись удаляется: следующий заход —
 *   новая попытка.
 */

import type { QuizQuestion } from "./engine";

/** Экран ленты scroll-mode: часть, вид экрана и номер (экрана конспекта или вопроса). */
export interface ScrollPlace {
  step: string;
  kind: "cover" | "page" | "test" | "question" | "result";
  n?: number;
}

export interface ScrollMemory {
  at?: ScrollPlace;
  places: Record<string, ScrollPlace>;
  tests: Record<string, { quiz: QuizQuestion[]; answers: (number | null)[] }>;
}

const key = (userId: string, eventId: string) => `yg-event-scroll:${userId}:${eventId}`;
const KINDS = new Set(["cover", "page", "test", "question", "result"]);

function place(value: unknown): ScrollPlace | undefined {
  if (!value || typeof value !== "object") return undefined;
  const r = value as Record<string, unknown>;
  if (typeof r.step !== "string" || typeof r.kind !== "string" || !KINDS.has(r.kind)) return undefined;
  return { step: r.step, kind: r.kind as ScrollPlace["kind"], n: typeof r.n === "number" && r.n >= 0 ? Math.floor(r.n) : undefined };
}

export function loadScroll(userId: string, eventId: string): ScrollMemory {
  const empty: ScrollMemory = { places: {}, tests: {} };
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key(userId, eventId)) ?? "null");
    if (!parsed || typeof parsed !== "object") return empty;
    const r = parsed as Record<string, unknown>;
    const places: Record<string, ScrollPlace> = {};
    for (const [id, p] of Object.entries((r.places as Record<string, unknown>) ?? {})) {
      const ok = place(p);
      if (ok) places[id] = ok;
    }
    const tests: ScrollMemory["tests"] = {};
    for (const [id, t] of Object.entries((r.tests as Record<string, unknown>) ?? {})) {
      const test = t as { quiz?: unknown; answers?: unknown };
      if (Array.isArray(test?.quiz) && Array.isArray(test.answers) && test.quiz.length === test.answers.length) {
        tests[id] = { quiz: test.quiz as QuizQuestion[], answers: test.answers.map((a) => (typeof a === "number" ? a : null)) };
      }
    }
    return { at: place(r.at), places, tests };
  } catch {
    return empty;
  }
}

export function saveScroll(userId: string, eventId: string, memory: ScrollMemory) {
  try {
    localStorage.setItem(key(userId, eventId), JSON.stringify(memory));
  } catch {
    /* без хранилища scroll-mode начнётся с обложки части */
  }
}
