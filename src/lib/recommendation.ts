/**
 * Recommendation engine.
 *
 * Сейчас это чистая локальная функция на mock-данных, но архитектура
 * специально построена так, чтобы её можно было заменить на backend/ML
 * без изменения UI:
 *
 *   UI  →  recommend(ctx)  →  [ScoredAction]
 *                ↑
 *      сейчас: локальный scoring
 *      потом:  fetch("/api/recommendations")  (см. lib/api.ts)
 *
 * Формула:
 *   taskScore = goalMatch + timeMatch + difficultyMatch + userHistory + freshness
 *
 * Каждое слагаемое нормализовано в 0..1 и имеет вес. Веса вынесены
 * в WEIGHTS, чтобы их можно было тюнить (а позже — обучать).
 */

import {
  CATEGORIES,
  ENERGY_RANK,
  currentSlot,
  type Action,
  type CategoryKey,
  type DailyMood,
  type GoalWeights,
  type StatKey,
  type TimePreference,
} from "./domain";

/* ────────────────────────  Контекст и результат  ──────────────────────── */

/** История взаимодействий — то, что движок «знает» о пользователе. */
export interface HistorySignals {
  /** сколько раз действие принято */
  accepted: Record<string, number>;
  /** сколько раз отклонено */
  rejected: Record<string, number>;
  /** сколько раз выполнено */
  completed: Record<string, number>;
  /** timestamp последнего показа, ms */
  lastSeen: Record<string, number>;
  /** накопленный XP по статам — чтобы балансировать перекос */
  statXp: Record<StatKey, number>;
  /** completion rate по категориям: сколько принятых довели до конца */
  categoryCompletion: Record<CategoryKey, { taken: number; done: number }>;
}

export function emptyHistory(): HistorySignals {
  return {
    accepted: {},
    rejected: {},
    completed: {},
    lastSeen: {},
    statXp: { strength: 0, intelligence: 0, wealth: 0, stability: 0 },
    categoryCompletion: {} as HistorySignals["categoryCompletion"],
  };
}

export interface RecommendationContext {
  pool: Action[];
  goals: GoalWeights;
  mood: DailyMood;
  history: HistorySignals;
  /** id действий, уже принятых на сегодня — их не предлагаем повторно */
  excludeIds: string[];
  /** для детерминизма в тестах */
  now?: number;
  slot?: TimePreference;
}

export interface ScoreBreakdown {
  goalMatch: number;
  timeMatch: number;
  difficultyMatch: number;
  userHistory: number;
  freshness: number;
}

export interface ScoredAction {
  action: Action;
  score: number;
  breakdown: ScoreBreakdown;
  /** человекочитаемая причина показа — «почему именно это» */
  reason: string;
}

/* ────────────────────────  Веса  ──────────────────────── */

export const WEIGHTS = {
  goalMatch: 0.3,
  timeMatch: 0.2,
  difficultyMatch: 0.25,
  userHistory: 0.15,
  freshness: 0.1,
} as const;

/* ────────────────────────  Компоненты скоринга  ──────────────────────── */

/**
 * goalMatch — насколько действие бьёт в приоритетный стат.
 * Плюс лёгкая коррекция: если стат сильно отстаёт от остальных,
 * движок мягко подталкивает к балансу.
 */
function goalMatch(a: Action, goals: GoalWeights, h: HistorySignals): number {
  const stat = CATEGORIES[a.category].stat;
  const priority = clamp01(goals[stat] ?? 0.5);

  const values = Object.values(h.statXp);
  const max = Math.max(...values, 1);
  const lag = 1 - clamp01((h.statXp[stat] ?? 0) / max); // 1 = самый отстающий

  const impactWeight = a.impact / 5;

  return clamp01(priority * 0.6 + lag * 0.15 + impactWeight * 0.25);
}

/**
 * timeMatch — подходит ли действие текущему времени суток
 * И укладывается ли оно в бюджет минут, который человек готов дать.
 */
function timeMatch(a: Action, mood: DailyMood, slot: TimePreference): number {
  const slotScore =
    a.timePreference === "any" ? 0.75 : a.timePreference === slot ? 1 : 0.25;

  // бюджет: идеально — влезает; чуть длиннее — штраф; сильно длиннее — почти ноль
  const ratio = a.duration / Math.max(mood.minutes, 5);
  const budgetScore =
    ratio <= 1 ? 1 : ratio <= 1.5 ? 0.6 : ratio <= 2.5 ? 0.25 : 0.05;

  return clamp01(slotScore * 0.45 + budgetScore * 0.55);
}

/**
 * difficultyMatch — соответствие сложности текущей энергии.
 * Главный принцип продукта: маленькие победы.
 * Если сил мало — тяжёлые задачи почти не показываем.
 */
function difficultyMatch(a: Action, mood: DailyMood): number {
  const energy = ENERGY_RANK[mood.energy]; // 1..3
  const wantEnergy = ENERGY_RANK[a.energy];

  // штраф за то, что действие требует больше сил, чем есть
  const energyGap = wantEnergy - energy;
  const energyScore =
    energyGap <= 0 ? 1 : energyGap === 1 ? 0.45 : 0.12;

  // целевая сложность растёт с энергией: 2 / 3 / 4
  const target = energy + 1;
  const diffGap = Math.abs(a.difficulty - target);
  const diffScore = Math.max(0, 1 - diffGap * 0.28);

  return clamp01(energyScore * 0.55 + diffScore * 0.45);
}

/**
 * userHistory — обучение на поведении.
 * Принял и выполнил → показываем похожее чаще.
 * Отклонил несколько раз → отступаем.
 */
function userHistory(a: Action, h: HistorySignals): number {
  const acc = h.accepted[a.id] ?? 0;
  const rej = h.rejected[a.id] ?? 0;
  const done = h.completed[a.id] ?? 0;

  // сигнал по конкретному действию
  const personal = clamp01(0.5 + (acc * 0.12 + done * 0.2 - rej * 0.22));

  // сигнал по категории: доводит ли пользователь такие задачи до конца
  const cc = h.categoryCompletion[a.category];
  const catRate = cc && cc.taken > 0 ? cc.done / cc.taken : 0.5;

  return clamp01(personal * 0.6 + catRate * 0.4);
}

/**
 * freshness — антиповтор. Недавно показанное опускаем,
 * давно не виденное поднимаем. Гарантирует, что колода не застревает.
 */
function freshness(a: Action, h: HistorySignals, now: number): number {
  const last = h.lastSeen[a.id];
  if (!last) return 1;
  const hours = (now - last) / 36e5;
  if (hours < 6) return 0.05;
  if (hours < 24) return 0.3;
  if (hours < 72) return 0.7;
  return 1;
}

/* ────────────────────────  Итоговый скоринг  ──────────────────────── */

export function scoreAction(
  a: Action,
  ctx: RecommendationContext,
): ScoredAction {
  const now = ctx.now ?? Date.now();
  const slot = ctx.slot ?? currentSlot(new Date(now));

  const breakdown: ScoreBreakdown = {
    goalMatch: goalMatch(a, ctx.goals, ctx.history),
    timeMatch: timeMatch(a, ctx.mood, slot),
    difficultyMatch: difficultyMatch(a, ctx.mood),
    userHistory: userHistory(a, ctx.history),
    freshness: freshness(a, ctx.history, now),
  };

  const score =
    breakdown.goalMatch * WEIGHTS.goalMatch +
    breakdown.timeMatch * WEIGHTS.timeMatch +
    breakdown.difficultyMatch * WEIGHTS.difficultyMatch +
    breakdown.userHistory * WEIGHTS.userHistory +
    breakdown.freshness * WEIGHTS.freshness;

  return { action: a, score, breakdown, reason: explain(a, breakdown, ctx) };
}

/**
 * Человекочитаемое объяснение — показываем на карточке.
 * Прозрачность рекомендаций = доверие к продукту.
 */
function explain(
  a: Action,
  b: ScoreBreakdown,
  ctx: RecommendationContext,
): string {
  const entries = Object.entries(b) as [keyof ScoreBreakdown, number][];
  const top = entries.sort((x, y) => y[1] - x[1])[0][0];
  const stat = CATEGORIES[a.category].stat;

  switch (top) {
    case "goalMatch":
      return `Двигает «${statLabel(stat)}» — твой приоритет`;
    case "timeMatch":
      return `Влезает в ${ctx.mood.minutes} минут`;
    case "difficultyMatch":
      return ctx.mood.energy === "low"
        ? "Лёгкий шаг — сил хватит"
        : "По силам прямо сейчас";
    case "userHistory":
      return "Такое ты обычно доводишь до конца";
    case "freshness":
      return "Давно не пробовал";
  }
}

function statLabel(s: StatKey) {
  return { strength: "Сила", intelligence: "Интеллект", wealth: "Капитал", stability: "Стабильность" }[s];
}

/**
 * Главная точка входа.
 *
 * Возвращает отсортированную колоду. UI берёт верхние N карточек.
 * Добавлен лёгкий детерминированный джиттер, чтобы колода не была
 * одинаковой каждый день при одинаковом состоянии.
 */
export function recommend(
  ctx: RecommendationContext,
  limit = 12,
): ScoredAction[] {
  const exclude = new Set(ctx.excludeIds);
  const now = ctx.now ?? Date.now();
  const seed = Math.floor(now / 864e5); // меняется раз в сутки

  return ctx.pool
    .filter((a) => !exclude.has(a.id))
    .map((a) => {
      const s = scoreAction(a, ctx);
      return { ...s, score: s.score + jitter(a.id, seed) * 0.04 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Детерминированный псевдослучайный джиттер 0..1 из строки + сида. */
function jitter(id: string, seed: number): number {
  let h = seed * 2654435761;
  for (let i = 0; i < id.length; i++) {
    h = (h ^ id.charCodeAt(i)) * 16777619;
    h >>>= 0;
  }
  return (h % 1000) / 1000;
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}
