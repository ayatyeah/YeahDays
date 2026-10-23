/**
 * Общая обвязка роутов /api/path/*: вход, лимит запросов, чтение тела и
 * перевод ошибок в ответ. Ошибки провайдеров и базы наружу не уходят —
 * человек видит только понятное сообщение.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CommunityError } from "@/lib/community";
import { rateLimit } from "@/lib/rateLimit";
import { PathAiError } from "./ai";
import { PathError } from "./service";
import { TtsError } from "./tts";

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } });

export async function currentUser() {
  return (await auth())?.user?.id ?? null;
}

/**
 * Тело запроса не больше limit байт (по умолчанию 120 КБ — с запасом на
 * материал в 20 000 символов). Читаем потоком и обрываем на пределе, чтобы
 * огромный запрос не попал в память целиком.
 */
export async function readBody(req: Request, limit = 120_000): Promise<Record<string, unknown>> {
  if (Number(req.headers.get("content-length") ?? 0) > limit) throw new PathError("Слишком большой запрос", 413);
  const reader = req.body?.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (reader) {
    const { value, done } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > limit) {
      await reader.cancel();
      throw new PathError("Слишком большой запрос", 413);
    }
    chunks.push(value);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  try {
    const body = JSON.parse(text || "{}");
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body;
  } catch {
    throw new PathError("Некорректный запрос", 400);
  }
}

/** Запустить обработчик от имени вошедшего; write — ещё и минутный лимит. */
export async function withUser(fn: (userId: string) => Promise<Response>, write = false) {
  const userId = await currentUser();
  if (!userId) return json({ error: "Войди в аккаунт" }, 401);
  if (write && !rateLimit(`path:${userId}`, 60, 60_000)) return json({ error: "Слишком много запросов. Подожди минуту." }, 429);
  try {
    return await fn(userId);
  } catch (error) {
    if (error instanceof PathError || error instanceof CommunityError) return json({ error: error.message }, error.status);
    if (error instanceof PathAiError) return json({ error: error.message }, 502);
    if (error instanceof TtsError) return json({ error: "Озвучка сейчас недоступна. Попробуй позже." }, 502);
    console.error("[path]", error);
    return json({ error: "Не удалось выполнить действие. Попробуй позже." }, 500);
  }
}
