/**
 * Персональная микро-траектория (docs/diploma-en, раздел 7.6).
 *
 * 1. Юнит доступен, когда все навыки-предпосылки освоены (mastery ≥ 0.85).
 *    Освоенный юнит выпадает, пока не подошло его повторение.
 * 2. Приоритет = 0.35·пробел + 0.25·важность для цели + 0.20·повторение
 *    + 0.20·близость дедлайна.
 * 3. План дня набирается по приоритету в пределах свободных минут; при
 *    низкой энергии вперёд идут повторения и короткие юниты.
 * 4. Причина «почему этот шаг» — по самому весомому фактору.
 * 5. Повторения через 1, 3, 7 и 14 дней; проверка, уронившая освоение ниже
 *    порога, сбрасывает интервал.
 *
 * Всё детерминировано и без базы — веса и пороги можно проверить тестами.
 */

import { MASTERED, MIN_ANSWERS } from "./elo";

export const WEIGHTS = { gap: 0.35, goal: 0.25, review: 0.2, deadline: 0.2 } as const;
export const REVIEW_DAYS = [1, 3, 7, 14] as const;
const DAY = 86_400_000;

export interface SkillNode {
  id: string;
  name: string;
  prerequisites: string[];
}

export interface UnitNode {
  id: string;
  title: string;
  skillIds: string[];
  minutes: number;
  weight: number;
  position: number;
}

export interface MasteryState {
  mastery: number;
  answers: number;
  reviewAt?: Date | string | null;
  masteredAt?: Date | string | null;
}

export interface UnitProgressState {
  completedAt?: Date | string | null;
  postponedOn?: string;
}

export type Factor = keyof typeof WEIGHTS;
export type ReasonKind = "review" | "deadline" | "next" | "new" | "gap" | "goal";

export interface Recommendation {
  unitId: string;
  title: string;
  minutes: number;
  review: boolean;
  priority: number;
  factors: Record<Factor, number>;
  /** вклад каждого фактора с весом — для разбора «почему» по запросу (FR-13) */
  contributions: Record<Factor, number>;
  reason: { kind: ReasonKind; text: string };
}

export const isMastered = (m?: MasteryState | null) => !!m && m.answers >= MIN_ANSWERS && m.mastery >= MASTERED;

const time = (v?: Date | string | null) => (v ? new Date(v).getTime() : NaN);

export function reviewDue(m: MasteryState | undefined | null, now: Date) {
  return !!m?.masteredAt && Number.isFinite(time(m.reviewAt)) && time(m.reviewAt) <= now.getTime();
}

/** Дней до дедлайна (YYYY-MM-DD) от сегодняшнего дня; null — дедлайна нет или он прошёл. */
export function daysUntil(deadline: string, today: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return null;
  const days = Math.round((Date.parse(`${deadline}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY);
  return Number.isFinite(days) && days >= 0 ? days : null;
}

/** 1 — дедлайн через день или раньше, 0 — дальше двух недель, между ними линейно. */
export function deadlineProximity(deadline: string, today: string) {
  const days = daysUntil(deadline, today);
  if (days === null || days > 14) return 0;
  if (days <= 1) return 1;
  return (14 - days) / 13;
}

/** Предпосылки юнита: предпосылки его навыков, кроме самих этих навыков. */
export function prerequisitesOf(unit: UnitNode, skills: Map<string, SkillNode>) {
  const own = new Set(unit.skillIds);
  return [...new Set(unit.skillIds.flatMap((id) => skills.get(id)?.prerequisites ?? []))].filter((id) => !own.has(id));
}

export interface PathwayInput {
  skills: SkillNode[];
  units: UnitNode[];
  mastery: Record<string, MasteryState>;
  progress: Record<string, UnitProgressState>;
  deadline?: string;
  today: string;
  now: Date;
}

/** Ранжированный список доступных юнитов с факторами и причиной. */
export function recommend(input: PathwayInput): Recommendation[] {
  const skills = new Map(input.skills.map((s) => [s.id, s]));
  const proximity = deadlineProximity(input.deadline ?? "", input.today);
  const days = daysUntil(input.deadline ?? "", input.today);
  const out: Recommendation[] = [];
  for (const unit of [...input.units].sort((a, b) => a.position - b.position)) {
    const prereqs = prerequisitesOf(unit, skills);
    if (!prereqs.every((id) => isMastered(input.mastery[id]))) continue;
    const own = unit.skillIds.map((id) => input.mastery[id]);
    const mastered = unit.skillIds.length > 0 && own.every((m) => isMastered(m));
    const due = own.some((m) => reviewDue(m, input.now));
    if (mastered && !due) continue;
    const gap = 1 - own.reduce((sum, m) => sum + (m?.mastery ?? 0), 0) / Math.max(1, own.length);
    const factors: Record<Factor, number> = { gap, goal: Math.max(0, Math.min(1, unit.weight)), review: due ? 1 : 0, deadline: proximity };
    const contributions = Object.fromEntries((Object.keys(WEIGHTS) as Factor[]).map((f) => [f, WEIGHTS[f] * factors[f]])) as Record<Factor, number>;
    let priority = Object.values(contributions).reduce((a, b) => a + b, 0);
    // «Отложить» снижает приоритет только на сегодня (FR-14).
    if (input.progress[unit.id]?.postponedOn === input.today) priority *= 0.5;
    out.push({
      unitId: unit.id,
      title: unit.title,
      minutes: unit.minutes,
      review: due,
      priority,
      factors,
      contributions,
      reason: reasonFor(unit, contributions, { skills, mastery: input.mastery, prereqs, days, now: input.now }),
    });
  }
  return out.sort((a, b) => b.priority - a.priority);
}

/** Самый весомый фактор → шаблон причины. Ничья решается порядком: повторение, дедлайн, пробел, цель. */
export function strongestFactor(contributions: Record<Factor, number>): Factor {
  const order: Factor[] = ["review", "deadline", "gap", "goal"];
  return order.reduce((best, f) => (contributions[f] > contributions[best] + 1e-9 ? f : best), order[0]);
}

function reasonFor(
  unit: UnitNode,
  contributions: Record<Factor, number>,
  ctx: { skills: Map<string, SkillNode>; mastery: Record<string, MasteryState>; prereqs: string[]; days: number | null; now: Date },
): { kind: ReasonKind; text: string } {
  const factor = strongestFactor(contributions);
  const skillName = (id?: string) => (id ? ctx.skills.get(id)?.name : undefined) ?? unit.title;
  if (factor === "review") {
    const due = unit.skillIds.find((id) => reviewDue(ctx.mastery[id], ctx.now));
    return { kind: "review", text: `Пора повторить: ${skillName(due)}` };
  }
  if (factor === "deadline") {
    const d = ctx.days ?? 0;
    return { kind: "deadline", text: d === 0 ? "Дедлайн сегодня" : d === 1 ? "Дедлайн завтра" : `До дедлайна ${d} дн.` };
  }
  if (factor === "gap") {
    const started = unit.skillIds.some((id) => (ctx.mastery[id]?.answers ?? 0) > 0);
    if (started) return { kind: "gap", text: `Пробел в навыке: ${skillName(unit.skillIds[0])}` };
    if (ctx.prereqs.length) return { kind: "next", text: `Следующий шаг после темы «${skillName(ctx.prereqs.at(-1))}»` };
    return { kind: "new", text: `Новая тема: ${skillName(unit.skillIds[0])}` };
  }
  return { kind: "goal", text: "Важно для твоей цели" };
}

export interface CheckIn {
  energy: number;
  minutes: number;
}

/**
 * План на сегодня: жадно по приоритету, пока хватает свободных минут. При
 * энергии 1–2 сначала повторения, потом короткие юниты.
 */
export function planDay(ranked: Recommendation[], checkIn: CheckIn) {
  const lowEnergy = checkIn.energy <= 2;
  const ordered = lowEnergy
    ? [...ranked].sort((a, b) => Number(b.review) - Number(a.review) || a.minutes - b.minutes || b.priority - a.priority)
    : ranked;
  const plan: Recommendation[] = [];
  let left = Math.max(0, checkIn.minutes);
  for (const item of ordered) {
    const cost = item.review ? Math.min(item.minutes, 3) : item.minutes;
    if (cost <= left) {
      plan.push(item);
      left -= cost;
    }
  }
  return plan;
}

/**
 * Расписание повторений после проверки.
 * - Впервые освоен → повторить через день.
 * - Освоен и было назначено повторение, которое уже подошло → следующий интервал.
 * - Был освоен, но проверка уронила ниже порога → интервал сброшен, навык снова в траектории.
 */
export function scheduleReview(
  before: { masteredAt?: Date | string | null; reviewAt?: Date | string | null; reviewStep: number },
  after: MasteryState,
  now: Date,
) {
  if (!isMastered(after)) return { masteredAt: null, reviewAt: null, reviewStep: 0 };
  if (!before.masteredAt) return { masteredAt: now, reviewAt: new Date(now.getTime() + REVIEW_DAYS[0] * DAY), reviewStep: 0 };
  const due = Number.isFinite(time(before.reviewAt)) && time(before.reviewAt) <= now.getTime();
  if (!due) return { masteredAt: new Date(before.masteredAt!), reviewAt: before.reviewAt ? new Date(before.reviewAt) : null, reviewStep: before.reviewStep };
  const step = Math.min(before.reviewStep + 1, REVIEW_DAYS.length - 1);
  return { masteredAt: new Date(before.masteredAt!), reviewAt: new Date(now.getTime() + REVIEW_DAYS[step] * DAY), reviewStep: step };
}
