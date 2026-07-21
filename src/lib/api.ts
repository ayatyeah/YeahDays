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
import type { Action, DailyMood, GoalWeights } from "./domain";

export type EngineMode = "local" | "remote";

/**
 * Управляется env-переменной, чтобы включить бэкенд без правок кода.
 * NEXT_PUBLIC_ENGINE=remote npm run build
 */
export const ENGINE_MODE: EngineMode =
  (process.env.NEXT_PUBLIC_ENGINE as EngineMode) ?? "local";

export interface RecommendRequest {
  goals: GoalWeights;
  mood: DailyMood;
  history: HistorySignals;
  excludeIds: string[];
  /** пользовательские действия, которых нет в общем пуле */
  customActions: Action[];
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
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`Engine responded ${res.status}`);
  return (await res.json()) as RecommendResponse;
}

/**
 * Отправка сигналов обратно движку (swipe / complete).
 * Локально это no-op: история уже лежит в сторе.
 * На бэкенде здесь копится обучающая выборка.
 */
export async function trackEvent(event: {
  type: "accept" | "reject" | "complete" | "skip";
  actionId: string;
  at: number;
}): Promise<void> {
  if (ENGINE_MODE !== "remote") return;
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch {
    // телеметрия не должна ломать UX
  }
}
