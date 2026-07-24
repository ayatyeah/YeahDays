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

import { personalDuration } from "./durations";
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
  /**
   * Замеры реальной длительности в минутах, по действиям.
   * Из них строится личная оценка вместо глазомерной из пула — см. durations.ts.
   */
  durations: Record<string, number[]>;
}

export function emptyHistory(): HistorySignals {
  return {
    accepted: {},
    rejected: {},
    completed: {},
    lastSeen: {},
    statXp: { strength: 0, intelligence: 0, wealth: 0, stability: 0 },
    categoryCompletion: {} as HistorySignals["categoryCompletion"],
    durations: {},
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
  /** состояние лестниц; если не передано — считается на месте */
  progressions?: Map<string, ProgressionState>;
  /** категории, которые пользователь не хочет видеть вообще */
  excludeCategories?: CategoryKey[];
  /** конкретные действия, скрытые вручную */
  disabledActions?: string[];
}

/* ────────────────────────  Прогрессии  ──────────────────────── */

/** Сколько раз нужно закрыть ступень, чтобы открылась следующая. */
export const MASTERY_THRESHOLD = 3;

export interface ProgressionState {
  /** максимальная ступень, доступная сейчас */
  unlocked: number;
  /** последняя освоенная ступень (0 — ни одной) */
  mastered: number;
  /** сколько всего ступеней в лестнице */
  max: number;
}

/**
 * Где пользователь находится в каждой лестнице.
 *
 * Смысл: не показывать «50 отжиманий» тому, кто не осилил 20, и не
 * гонять вечно «10 отжиманий» того, кто закрыл их двадцать раз.
 */
export function progressionStates(
  pool: Action[],
  h: HistorySignals,
): Map<string, ProgressionState> {
  const ladders = new Map<string, Action[]>();
  for (const a of pool) {
    if (!a.progression) continue;
    const list = ladders.get(a.progression.id) ?? [];
    list.push(a);
    ladders.set(a.progression.id, list);
  }

  const out = new Map<string, ProgressionState>();
  for (const [id, steps] of ladders) {
    steps.sort((x, y) => x.progression!.step - y.progression!.step);
    const max = steps[steps.length - 1].progression!.step;
    let mastered = 0;
    for (const s of steps) {
      const done = h.completed[s.id] ?? 0;
      if (done >= MASTERY_THRESHOLD) {
        mastered = Math.max(mastered, s.progression!.step);
      }
    }
    out.set(id, { unlocked: Math.min(mastered + 1, max), mastered, max });
  }
  return out;
}

/**
 * Насколько ступень уместна сейчас. Заблокированные ступени отсекаются
 * фильтром до скоринга, здесь — мягкое понижение давно пройденных.
 */
function progressionFit(
  a: Action,
  states: Map<string, ProgressionState>,
): number {
  if (!a.progression) return 1;
  const st = states.get(a.progression.id);
  if (!st) return 1;
  const delta = st.unlocked - a.progression.step;
  if (delta <= 0) return 1; // текущая рабочая ступень
  if (delta === 1) return 0.55; // предыдущая — сгодится в слабый день
  return 0.15; // давно освоено, скучно
}

/**
 * Адаптивная сложность: планка едет за реальным поведением.
 * Стабильно закрывает взятое → поднимаем; систематически сливает → опускаем.
 * При малой выборке не трогаем ничего — иначе шум вместо адаптации.
 */
export function adaptiveShift(h: HistorySignals): number {
  let taken = 0;
  let done = 0;
  for (const cc of Object.values(h.categoryCompletion)) {
    if (!cc) continue;
    taken += cc.taken;
    done += cc.done;
  }
  if (taken < 5) return 0;
  const rate = done / taken;
  if (rate >= 0.8) return 0.6;
  if (rate <= 0.4) return -0.6;
  return 0;
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
 * Длительность действия для этого человека.
 *
 * Единственная точка, через которую и движок, и интерфейс получают минуты:
 * пока замеров нет — это число из пула, дальше оно плавно уезжает к личной
 * оценке. Держим здесь, чтобы карточка не могла показать одно время, а
 * подбор — считать по другому.
 */
export function effectiveDuration(a: Action, h: HistorySignals): number {
  return personalDuration(a.duration, h.durations?.[a.id]);
}

/**
 * timeMatch — подходит ли действие текущему времени суток
 * И укладывается ли оно в бюджет минут, который человек готов дать.
 */
function timeMatch(
  a: Action,
  mood: DailyMood,
  slot: TimePreference,
  h: HistorySignals,
): number {
  const slotScore =
    a.timePreference === "any" ? 0.75 : a.timePreference === slot ? 1 : 0.25;

  // бюджет меряем ЛИЧНЫМИ минутами, а не глазомерной оценкой из пула:
  // если человек стабильно читает 10 страниц за 8 минут, действие должно
  // влезать в его десять минут, даже когда в пуле написано 15
  const ratio = effectiveDuration(a, h) / Math.max(mood.minutes, 5);
  const budgetScore =
    ratio <= 1 ? 1 : ratio <= 1.5 ? 0.6 : ratio <= 2.5 ? 0.25 : 0.05;

  return clamp01(slotScore * 0.45 + budgetScore * 0.55);
}

/**
 * difficultyMatch — соответствие сложности текущей энергии.
 * Главный принцип продукта: маленькие победы.
 * Если сил мало — тяжёлые задачи почти не показываем.
 */
function difficultyMatch(
  a: Action,
  mood: DailyMood,
  shift: number,
): number {
  const energy = ENERGY_RANK[mood.energy]; // 1..3
  const wantEnergy = ENERGY_RANK[a.energy];

  // штраф за то, что действие требует больше сил, чем есть
  const energyGap = wantEnergy - energy;
  const energyScore =
    energyGap <= 0 ? 1 : energyGap === 1 ? 0.45 : 0.12;

  // целевая сложность растёт с энергией: 2 / 3 / 4,
  // плюс адаптация под то, как человек реально закрывает взятое
  const target = clampRange(energy + 1 + shift, 1, 5);
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
  const states = ctx.progressions ?? progressionStates(ctx.pool, ctx.history);

  const breakdown: ScoreBreakdown = {
    goalMatch: goalMatch(a, ctx.goals, ctx.history),
    timeMatch: timeMatch(a, ctx.mood, slot, ctx.history),
    difficultyMatch: difficultyMatch(a, ctx.mood, adaptiveShift(ctx.history)),
    userHistory: userHistory(a, ctx.history),
    freshness: freshness(a, ctx.history, now),
  };

  const weighted =
    breakdown.goalMatch * WEIGHTS.goalMatch +
    breakdown.timeMatch * WEIGHTS.timeMatch +
    breakdown.difficultyMatch * WEIGHTS.difficultyMatch +
    breakdown.userHistory * WEIGHTS.userHistory +
    breakdown.freshness * WEIGHTS.freshness;

  // ступень лестницы — множитель, а не слагаемое: пройденное не должно
  // конкурировать с актуальным только за счёт остальных сигналов
  const score = weighted * progressionFit(a, states);

  return {
    action: a,
    score,
    breakdown,
    reason: explain(a, breakdown, ctx, states),
  };
}

/**
 * Человекочитаемое объяснение — показываем на карточке.
 * Прозрачность рекомендаций = доверие к продукту.
 */
function explain(
  a: Action,
  b: ScoreBreakdown,
  ctx: RecommendationContext,
  states?: Map<string, ProgressionState>,
): string {
  // новая ступень лестницы — самый сильный повод показать именно это
  if (a.progression && states) {
    const st = states.get(a.progression.id);
    if (st && st.mastered > 0 && a.progression.step === st.unlocked) {
      return "Новая ступень — предыдущую ты освоил";
    }
  }

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
  const states = ctx.progressions ?? progressionStates(ctx.pool, ctx.history);
  const skipCats = new Set(ctx.excludeCategories ?? []);
  const skipIds = new Set(ctx.disabledActions ?? []);
  const scored = { ...ctx, progressions: states };

  return ctx.pool
    .filter((a) => {
      if (exclude.has(a.id)) return false;
      // осознанно отключённые направления не показываем совсем
      if (skipCats.has(a.category)) return false;
      if (skipIds.has(a.id)) return false;
      // ступень выше открытой — ещё не заработана
      if (a.progression) {
        const st = states.get(a.progression.id);
        if (st && a.progression.step > st.unlocked) return false;
      }
      return true;
    })
    .map((a) => {
      const s = scoreAction(a, scored);
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

function clampRange(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}
