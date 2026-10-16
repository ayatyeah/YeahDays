/**
 * Прогресс пользователя по UserState.data для серверных интеграций
 * (/api/integrations/*): XP, уровень, стрик, XP по статам. Те же правила,
 * что и в клиентском сторе (selectTotalXp/selectStats), но без импорта
 * клиентского useUserStore — см. комментарий в externalState.ts.
 *
 * День — это ключ YYYY-MM-DD в локальной зоне пользователя. Сервер её не
 * знает, поэтому «сегодня» передаёт вызывающий (или dateKey() как фолбэк).
 */

import { CATEGORIES, type CategoryKey, type StatKey } from "@/lib/domain";
import { levelForXp } from "@/lib/leveling";
import { categorizeTodo, TODO_PRIORITY_XP } from "@/lib/todoCategory";
import type { PlannedTask, StateShape, Todo } from "@/lib/externalState";

export const STAT_KEYS: StatKey[] = ["strength", "intelligence", "wealth", "stability", "health"];

/** Сколько раз задача засчитана: повторяющаяся — по дням, разовая — 0 или 1. */
export function todoCompletions(t: Todo): number {
  return t.repeat ? t.doneDays.length : t.done ? 1 : 0;
}

export function todoXp(todos: Todo[]): number {
  return todos.reduce((sum, t) => sum + todoCompletions(t) * TODO_PRIORITY_XP[t.priority], 0);
}

/** Дни, в которые что-то реально закрыто — тот же признак, что и у стрика в сторе. */
export function activeDays(plan: PlannedTask[], todos: Todo[]): Set<string> {
  const days = new Set<string>();
  for (const t of plan) if (t.completed) days.add(t.date);
  for (const t of todos) {
    if (t.repeat) for (const d of t.doneDays) days.add(d);
    else if (t.done) days.add(t.date);
  }
  return days;
}

/** Ключ предыдущего дня. Арифметика в UTC: ключ — это просто дата, без времени и DST. */
export function prevDay(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Стрик на `today`: если сегодня ещё ничего не закрыто, считаем от вчера (день ещё не потерян). */
export function streakFrom(days: Set<string>, today: string): number {
  let cursor = days.has(today) ? today : prevDay(today);
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor = prevDay(cursor);
  }
  return streak;
}

export interface Progress {
  totalXp: number;
  level: number;
  streak: number;
  stats: Record<StatKey, number>;
}

export function computeProgress(state: StateShape, today: string): Progress {
  const plan = state.plan ?? [];
  const todos = state.todos ?? [];
  const stats = Object.fromEntries(STAT_KEYS.map((k) => [k, 0])) as Record<StatKey, number>;
  let totalXp = 0;

  for (const t of plan) {
    if (!t.completed) continue;
    totalXp += t.xp;
    const stat = CATEGORIES[t.snapshot.category as CategoryKey]?.stat;
    if (stat) stats[stat] += t.xp;
  }
  for (const t of todos) {
    const xp = todoCompletions(t) * TODO_PRIORITY_XP[t.priority];
    if (!xp) continue;
    totalXp += xp;
    stats[categorizeTodo(t.title).stat] += xp;
  }

  return { totalXp, level: levelForXp(totalXp), streak: streakFrom(activeDays(plan, todos), today), stats };
}
