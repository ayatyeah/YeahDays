/**
 * Ближайшая цель — «до чего осталось чуть-чуть».
 *
 * Самый сильный крючок возврата — конкретный следующий шаг: «ещё одно
 * действие — и день закрыт», «120 XP до эволюции тела». Вся математика уже
 * лежит в leveling.ts и в порогах челленджей; здесь она сводится к одной
 * мотивирующей строке.
 *
 * Модуль намеренно чистый и не знает про стор: на вход — уже извлечённые
 * числа. Так его легко проверить тестами и переиспользовать в вечернем push.
 *
 * Приоритет выстроен по достижимости СЕГОДНЯ, потому что «близко» мотивирует
 * только когда до цели реально дотянуться:
 *   1. зелёный день челленджа — прямо сейчас, в руках;
 *   2. план дня ещё не закрыт — главная ежедневная победа, держит стрик;
 *   3. эволюция тела, если она уже близко — крупная зримая награда;
 *   4. следующий уровень — ровный повседневный тянущий шаг;
 *   5. круглая веха стрика — когда выше уже некуда.
 */

import {
  getLevelProgress,
  xpForLevel,
  nextMilestone as nextTier,
} from "./leveling";

export type GoalKind = "green" | "day" | "evolution" | "level" | "streak";

export interface Goal {
  kind: GoalKind;
  /** строка для экрана: «до эволюции тела осталось 120 XP» */
  text: string;
  /** короче — для пуша, где место дорого */
  short: string;
  /** сколько осталось: XP, действий или дней */
  remaining: number;
}

export interface GoalInput {
  /** суммарный накопленный XP */
  totalXp: number;
  /** сколько действий из колоды взято сегодня */
  takenToday: number;
  /** норма дня */
  dailyGoal: number;
  /** текущий стрик в днях */
  streak: number;
  /**
   * Для активного сегодня челленджа — сколько ещё до зелёного дня.
   * null/undefined — нет активного челленджа или день уже зелёный.
   * Если активных несколько, сюда передают минимум (ближайший к зелёному).
   */
  toGreenDay?: number | null;
}

/** «Эволюция тела близко», если до неё не больше этого XP. */
const EVOLUTION_NEAR_XP = 150;

/** «Веха стрика близко», если до круглого числа не больше этого дней. */
const STREAK_NEAR_DAYS = 3;

/** Круглые вехи стрика, ради которых стоит тянуться. */
const STREAK_TARGETS = [7, 14, 30, 50, 75, 100, 150, 200, 365];

/**
 * Русская форма числительного: plural(1,'день','дня','дней') → «день».
 * one — 1, 21, 31…; few — 2–4, 22–24…; many — 0, 5–20, 11–14 (исключения).
 */
function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/**
 * Ближайшая достижимая цель, либо null, если предложить нечего
 * (день закрыт и человек на максимуме — крайне редкий случай).
 */
export function nextGoal(input: GoalInput): Goal | null {
  const { totalXp, takenToday, dailyGoal, streak, toGreenDay } = input;

  // 1. Зелёный день челленджа — самое актуальное, делается сегодня.
  if (toGreenDay != null && toGreenDay > 0) {
    const n = toGreenDay;
    const word = plural(n, "задача", "задачи", "задач");
    return {
      kind: "green",
      text: `Ещё ${n} ${word} — и день станет зелёным`,
      short: `${n} ${word} до зелёного дня`,
      remaining: n,
    };
  }

  // 2. План дня ещё не собран — главная ежедневная победа.
  if (takenToday < dailyGoal) {
    const n = dailyGoal - takenToday;
    const word = plural(n, "действие", "действия", "действий");
    return {
      kind: "day",
      text: `Ещё ${n} ${word} — и день закрыт`,
      short: `${n} ${word} до плана дня`,
      remaining: n,
    };
  }

  const { level, currentInLevel, neededForNext } = getLevelProgress(totalXp);
  const toNextLevel = neededForNext - currentInLevel;
  const tier = nextTier(level);
  const toEvolution = tier ? xpForLevel(tier.level) - totalXp : null;

  // 3. Эволюция тела, если она уже близко — крупная зримая веха.
  if (toEvolution != null && toEvolution > 0 && toEvolution <= EVOLUTION_NEAR_XP) {
    return {
      kind: "evolution",
      text: `${toEvolution} XP до эволюции тела — «${tier!.label}»`,
      short: `${toEvolution} XP до «${tier!.label}»`,
      remaining: toEvolution,
    };
  }

  // 4. Круглая веха стрика, если она уже близко — «2 дня до серии 30».
  //    Стоит ПЕРЕД уровнем осознанно: уровни без потолка, toNextLevel > 0
  //    всегда, и без этой проверки ветка стрика была бы недостижима вовсе.
  const streakTarget = STREAK_TARGETS.find((t) => t > streak);
  if (streakTarget && streakTarget - streak <= STREAK_NEAR_DAYS) {
    const n = streakTarget - streak;
    const word = plural(n, "день", "дня", "дней");
    return {
      kind: "streak",
      text: `Ещё ${n} ${word} — и серия ${streakTarget} дней`,
      short: `${n} ${word} до серии ${streakTarget}`,
      remaining: n,
    };
  }

  // 5. Следующий уровень — ровный повседневный шаг (срабатывает всегда,
  //    поэтому null ниже — только страховка на невозможный случай).
  if (toNextLevel > 0) {
    return {
      kind: "level",
      text: `${toNextLevel} XP до ${level + 1} уровня`,
      short: `${toNextLevel} XP до ур. ${level + 1}`,
      remaining: toNextLevel,
    };
  }

  return null;
}
