/**
 * Слой доступа к данным.
 *
 * Единственное место, где UI общается с "источником" рекомендаций.
 * Сегодня источник — локальный движок; завтра — HTTP-бэкенд с ML.
 * Переключение делается одной переменной, контракт не меняется.
 *
 *   MODE = "local"  → scoring считается в браузере (offline-friendly, PWA)
 *   MODE = "remote" → POST /api/recommendations, ответ той же формы
 */

import { ACTION_POOL } from "./actionPool";
import {
  recommend,
  type HistorySignals,
  type ScoredAction,
} from "./recommendation";
import type { Action, CategoryKey, DailyMood, GoalWeights } from "./domain";
import { getUserId } from "./userId";
import { enqueue, flushQueue } from "./eventQueue";

export type EngineMode = "local" | "remote";

/**
 * По умолчанию remote (рекомендации и события идут через /api + Postgres).
 * Можно переопределить: NEXT_PUBLIC_ENGINE=local — весь скоринг в браузере.
 * При недоступной сети remote сам откатывается на локальный расчёт.
 */
export const ENGINE_MODE: EngineMode =
  (process.env.NEXT_PUBLIC_ENGINE as EngineMode) ?? "remote";

export interface RecommendRequest {
  goals: GoalWeights;
  mood: DailyMood;
  history: HistorySignals;
  excludeIds: string[];
  /** пользовательские действия, которых нет в общем пуле */
  customActions: Action[];
  /** направления, которые пользователь отключил */
  excludeCategories?: CategoryKey[];
  limit?: number;
}

export interface RecommendResponse {
  deck: ScoredAction[];
  /** какая версия движка ответила — полезно для аналитики и A/B */
  engine: string;
  generatedAt: number;
}

/**
 * Получить колоду на сегодня.
 * UI вызывает только это — он не знает, где считался score.
 */
export async function fetchRecommendations(
  req: RecommendRequest,
): Promise<RecommendResponse> {
  if (ENGINE_MODE === "remote") {
    try {
      return await remoteRecommend(req);
    } catch {
      // graceful degradation: сеть упала — считаем локально,
      // пользователь не остаётся с пустым экраном
      return localRecommend(req);
    }
  }
  return localRecommend(req);
}

function localRecommend(req: RecommendRequest): RecommendResponse {
  const pool = [...ACTION_POOL, ...req.customActions];
  const deck = recommend(
    {
      pool,
      goals: req.goals,
      mood: req.mood,
      history: req.history,
      excludeIds: req.excludeIds,
      excludeCategories: req.excludeCategories,
    },
    req.limit ?? 12,
  );
  return { deck, engine: "local-v1", generatedAt: Date.now() };
}

async function remoteRecommend(
  req: RecommendRequest,
): Promise<RecommendResponse> {
  const res = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...req, userId: getUserId() }),
  });
  if (!res.ok) throw new Error(`Engine responded ${res.status}`);
  return (await res.json()) as RecommendResponse;
}

export interface TrackedEvent {
  type: "accept" | "reject" | "complete" | "skip";
  actionId: string;
  at: number;
  /** для серверных агрегатов без обращения к пулу */
  category?: CategoryKey;
  xp?: number;
}

/**
 * Отправка сигналов движку (swipe / complete). В local — no-op (история
 * в сторе). В remote — событие пишется в Postgres: обучающая выборка и
 * источник серверной истории для рекомендаций.
 *
 * Событие всегда сначала попадает в офлайн-очередь и только потом
 * выгружается: без сети оно дождётся связи, а не исчезнет.
 */
export async function trackEvent(event: TrackedEvent): Promise<void> {
  if (ENGINE_MODE !== "remote") return;
  enqueue(event);
  await flushEvents();
}

/** Отправить накопленную очередь событий. Безопасно вызывать часто. */
export async function flushEvents(): Promise<number> {
  if (ENGINE_MODE !== "remote") return 0;
  return flushQueue(async (events) => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: getUserId(), events }),
      keepalive: true,
    });
    return res.ok;
  });
}
