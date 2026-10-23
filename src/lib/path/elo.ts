/**
 * Адаптивная оценка знаний по Elo (docs/diploma-en, раздел 7.7).
 *
 * Способность θ хранится на пару «ученик × навык», сложность b — на вопрос;
 * обе обновляются после каждого ответа. Elo близок к модели Раша (1PL), но
 * не требует калибровки на большой выборке: вопросы, которые ИИ только что
 * написал, сразу пригодны, а их сложность уточняется по ответам всех
 * участников цели. Здесь только чистые функции — база и HTTP живут в
 * service.ts, так что формулы проверяются тестами напрямую.
 */

/** K(n) = α / (1 + β·n): ранние ответы весят больше, оценка со временем успокаивается. */
export const ALPHA = 0.8;
export const BETA = 0.05;
/** Вопрос подбирается так, чтобы шанс ответить был ближе всего к 70 %. */
export const TARGET_P = 0.7;
/** Навык освоен при mastery ≥ 0.85 и хотя бы трёх ответах; «точно пока нет» — ≤ 0.30. */
export const MASTERED = 0.85;
export const NOT_YET = 0.3;
export const MIN_ANSWERS = 3;
/** Не больше 10 вопросов в одной проверке и не меньше трёх, если банк позволяет. */
export const MAX_ITEMS = 10;
export const MIN_ITEMS = 3;
/** Общая способность θ_u двигается тем же правилом, но вчетверо медленнее. */
export const PRIOR_SHARE = 0.25;
/** Стартовая сложность, которую ИИ указал при генерации. */
export const LEVEL_DIFFICULTY: Record<string, number> = { easy: -1, medium: 0, hard: 1 };

export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
/** P(верно) = 1 / (1 + e^−(θ − b)). */
export const probability = (theta: number, difficulty: number) => sigmoid(theta - difficulty);
export const k = (answers: number) => ALPHA / (1 + BETA * Math.max(0, answers));

export interface EloInput {
  theta: number;
  thetaAnswers: number;
  difficulty: number;
  itemAnswers: number;
  /** y: 0 или 1 для теста, балл/100 для открытого ответа. */
  score: number;
}

/** θ ← θ + K(n)·(y − P), b ← b − K(n_i)·(y − P). */
export function eloUpdate({ theta, thetaAnswers, difficulty, itemAnswers, score }: EloInput) {
  const y = Math.max(0, Math.min(1, score));
  const p = probability(theta, difficulty);
  return {
    p,
    theta: theta + k(thetaAnswers) * (y - p),
    difficulty: difficulty - k(itemAnswers) * (y - p),
  };
}

/** Сдвиг общей способности: тот же знак, меньший шаг. */
export function priorUpdate(prior: number, priorAnswers: number, score: number, p: number) {
  return prior + PRIOR_SHARE * k(priorAnswers) * (Math.max(0, Math.min(1, score)) - p);
}

export function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** mastery = σ(θ − b̃): шанс решить «типичный» вопрос навыка (b̃ — медиана сложностей). */
export function masteryOf(theta: number, difficulties: number[]) {
  return probability(theta, median(difficulties));
}

export interface SkillStatus {
  mastery: number;
  answers: number;
}

export const isMasteredStatus = (s: SkillStatus) => s.answers >= MIN_ANSWERS && s.mastery >= MASTERED;

/** Навык «классифицирован»: точно освоен или точно ещё нет, и ответов хватает. */
export const classified = (s: SkillStatus) => s.answers >= MIN_ANSWERS && (s.mastery >= MASTERED || s.mastery <= NOT_YET);

export interface Item {
  id: string;
  skillId: string;
  difficulty: number;
}

/**
 * Следующий вопрос: среди ещё не заданных в этой проверке — тот, у кого
 * предсказанный шанс ближе всего к 0.7. Почти равных (±0.02) выбираем
 * случайно, чтобы не выдавать всем один и тот же вопрос.
 */
export function selectItem<T extends Item>(items: T[], thetaBySkill: Record<string, number>, served: Iterable<string>, rng: () => number = Math.random): T | null {
  const seen = new Set(served);
  const pool = items
    .filter((item) => !seen.has(item.id) && item.skillId in thetaBySkill)
    .map((item) => ({ item, gap: Math.abs(probability(thetaBySkill[item.skillId], item.difficulty) - TARGET_P) }));
  if (!pool.length) return null;
  const best = Math.min(...pool.map((c) => c.gap));
  const near = pool.filter((c) => c.gap <= best + 0.02);
  return near[Math.min(near.length - 1, Math.floor(rng() * near.length))].item;
}

/**
 * Правило остановки: все целевые навыки классифицированы, или задано 10
 * вопросов, или банк кончился. Минимум три вопроса за проверку (если банк
 * позволяет) — иначе давно освоенный навык закрывал бы повторение без вопросов.
 */
export function shouldStop(statuses: SkillStatus[], askedInQuiz: number, remaining: number) {
  if (askedInQuiz >= MAX_ITEMS || remaining === 0) return true;
  if (askedInQuiz < MIN_ITEMS) return false;
  return statuses.every(classified);
}
