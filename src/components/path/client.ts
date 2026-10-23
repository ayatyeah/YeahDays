"use client";
/** Клиент API траекторий: один fetch с понятной ошибкой и типы экранов. */
import type { goalView, listGoals, unitView } from "@/lib/path/service";
import type { startQuiz, answer } from "@/lib/path/quiz";
import type { videoStatus } from "@/lib/path/video";

type Jsonify<T> = T extends Date ? string : T extends (infer U)[] ? Jsonify<U>[] : T extends object ? { [K in keyof T]: Jsonify<T[K]> } : T;

export type GoalSummary = Jsonify<Awaited<ReturnType<typeof listGoals>>[number]>;
export type GoalView = Jsonify<Awaited<ReturnType<typeof goalView>>>;
export type UnitView = Jsonify<Awaited<ReturnType<typeof unitView>>>;
export type QuizStart = Jsonify<Awaited<ReturnType<typeof startQuiz>>>;
export type QuizItem = QuizStart["item"];
export type AnswerResult = Jsonify<Awaited<ReturnType<typeof answer>>>;
export type VideoView = Jsonify<Awaited<ReturnType<typeof videoStatus>>["view"]>;

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/** GET без тела, POST с телом. Ошибка сервера — ApiError с его текстом. */
export async function call<T>(url: string, body?: object): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : { cache: "no-store" });
  } catch {
    throw new ApiError("Нет связи с сервером. Проверь интернет и повтори.", 0);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok && response.status !== 202) throw new ApiError(data.error || "Не удалось выполнить действие", response.status);
  return data as T;
}

export const percent = (v: number | null | undefined) => (v === null || v === undefined ? "—" : `${Math.round(v * 100)}%`);

/** Ключ идемпотентности для ответа: один на попытку, повтор при сбое сети — с тем же ключом. */
export const answerKey = () => (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40);

/** **жирный** из текста юнита → части для отрисовки без dangerouslySetInnerHTML. */
export function boldParts(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) => (part.startsWith("**") && part.endsWith("**") ? { bold: true, text: part.slice(2, -2) } : { bold: false, text: part }));
}
