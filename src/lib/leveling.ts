/**
 * Прогрессия уровней.
 *
 * Кривая опыта растёт квадратично: каждый следующий уровень требует
 * чуть больше XP, чем предыдущий. Это держит ранние уровни быстрыми
 * (мотивация на старте), а поздние — весомыми.
 */

/** Сколько ВСЕГО накопленного XP нужно, чтобы достичь данного уровня. */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  // 0, 60, 160, 300, 480, ... (60 * (n-1) + 40 * (n-1)^2)
  const n = level - 1;
  return Math.round(60 * n + 40 * n * n);
}

/** Уровень по суммарному XP. */
export function levelForXp(totalXp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXp) level++;
  return level;
}

export interface LevelProgress {
  level: number;
  /** XP, набранный внутри текущего уровня */
  currentInLevel: number;
  /** XP, нужный для перехода на следующий уровень */
  neededForNext: number;
  /** 0..1 — заполненность полоски до следующего уровня */
  ratio: number;
}

export function getLevelProgress(totalXp: number): LevelProgress {
  const level = levelForXp(totalXp);
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const currentInLevel = totalXp - floor;
  const neededForNext = ceil - floor;
  return {
    level,
    currentInLevel,
    neededForNext,
    ratio: neededForNext === 0 ? 1 : currentInLevel / neededForNext,
  };
}

/* ---- Визуальные вехи персонажа ---- */

export type Tier = 1 | 2 | 3 | 4;

/**
 * Форма персонажа определяется вехами уровня:
 *  tier 1  (lvl 1–19)  — маленькое серое тело
 *  tier 2  (lvl 20–49) — шире плечи, чуть светлее
 *  tier 3  (lvl 50–99) — новая форма, оттенок цвета
 *  tier 4  (lvl 100+)  — свет вокруг (аура)
 */
export function tierForLevel(level: number): Tier {
  if (level >= 100) return 4;
  if (level >= 50) return 3;
  if (level >= 20) return 2;
  return 1;
}

export const TIER_MILESTONES: { tier: Tier; level: number; label: string }[] = [
  { tier: 1, level: 1, label: "Слимбой" },
  { tier: 2, level: 20, label: "Эстет" },
  { tier: 3, level: 50, label: "Качок" },
  { tier: 4, level: 100, label: "Сияние" },
];

/** Следующая веха-трансформация после текущего уровня (или null, если максимум). */
export function nextMilestone(level: number) {
  return (
    TIER_MILESTONES.find((m) => m.level > level) ?? null
  );
}
