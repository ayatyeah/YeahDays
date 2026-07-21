/**
 * POST /api/recommendations
 *
 * Серверная реализация того же контракта, что и локальный движок.
 * Сейчас переиспользует ту же scoring-функцию — то есть бэкенд уже
 * "настоящий", просто пока без ML и без БД.
 *
 * Точки роста (не меняя контракт с фронтом):
 *   • читать пул из БД вместо статического файла
 *   • подмешивать коллаборативную фильтрацию по похожим пользователям
 *   • A/B-тестировать веса и вернуть их в поле `engine`
 */

import { NextResponse } from "next/server";
import { ACTION_POOL } from "@/lib/actionPool";
import { recommend, emptyHistory } from "@/lib/recommendation";
import { DEFAULT_GOALS, DEFAULT_MOOD } from "@/lib/domain";
import type { RecommendRequest, RecommendResponse } from "@/lib/api";

export const runtime = "edge";

export async function POST(req: Request) {
  let body: Partial<RecommendRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const goals = { ...DEFAULT_GOALS, ...(body.goals ?? {}) };
  const mood = { ...DEFAULT_MOOD, ...(body.mood ?? {}) };
  const history = { ...emptyHistory(), ...(body.history ?? {}) };
  const excludeIds = Array.isArray(body.excludeIds) ? body.excludeIds : [];
  const custom = Array.isArray(body.customActions) ? body.customActions : [];

  const deck = recommend(
    { pool: [...ACTION_POOL, ...custom], goals, mood, history, excludeIds },
    Math.min(body.limit ?? 12, 40),
  );

  const payload: RecommendResponse = {
    deck,
    engine: "server-v1",
    generatedAt: Date.now(),
  };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
