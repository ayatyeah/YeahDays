/**
 * Цвета статов и выбор доминирующего.
 *
 * Вынесено отдельно от avatar3d.ts намеренно: пока хелперы лежали рядом с
 * `import * as THREE`, вся библиотека three (26 МБ исходников) попадала в
 * общий бандл и грузилась даже на календаре.
 *
 * Значения дублируют --color-* из globals.css: сюда их читать неоткуда,
 * цвет нужен как строка для canvas/градиентов. Держать в согласии руками.
 */

import type { StatKey } from "./domain";

export type AvatarStats = Record<StatKey, number>;

export const STAT_HEX: Record<StatKey, string> = {
  strength: "#cf8578",
  intelligence: "#9a93cc",
  wealth: "#c9ad6f",
  stability: "#6fb39c",
  health: "#c2818f",
};

export function dominantStat(stats: AvatarStats): StatKey {
  let best: StatKey = "strength";
  let max = -1;
  (Object.keys(stats) as StatKey[]).forEach((k) => {
    if (stats[k] > max) {
      max = stats[k];
      best = k;
    }
  });
  return best;
}

/** Нормализованные 0..1 значения — насколько прокачан каждый стат. */
export interface AvatarShape {
  strength: number;
  intelligence: number;
  wealth: number;
  stability: number;
  level: number;
}

/**
 * Логарифмическая нормализация с потолком ~1200 XP: первые задачи
 * дают заметный отклик, но тело меняется и на 40+ уровне.
 */
export function normalizeStats(stats: AvatarStats, level: number): AvatarShape {
  const n = (v: number) =>
    Math.min(1, Math.log10(1 + v / 55) / Math.log10(1 + 1200 / 55));
  return {
    strength: n(stats.strength),
    intelligence: n(stats.intelligence),
    wealth: n(stats.wealth),
    stability: n(stats.stability),
    level,
  };
}
