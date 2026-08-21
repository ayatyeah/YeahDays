/**
 * /api/integrations/stats — прогресс по одному стату для отображения во
 * внешнем сервисе. Авторизация: scoped ApiKey + userId, привязанный этим
 * же ключом через /api/keys/redeem.
 *
 * GET ?userId=&stat=intelligence → { stat, xp, level, streak }
 */

import { NextResponse } from "next/server";
import { authorizeServiceKey, userAllowedForKey } from "@/lib/apiKey";
import { loadState, type PlannedTask, type Todo } from "@/lib/externalState";
import { categorizeTodo, TODO_PRIORITY_XP } from "@/lib/todoCategory";
import { levelForXp } from "@/lib/leveling";
import { CATEGORIES, dateKey, type StatKey, type CategoryKey } from "@/lib/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STAT_KEYS: StatKey[] = ["strength", "intelligence", "wealth", "stability", "health"];

function todoCompletions(t: Todo): number {
  return t.repeat ? t.doneDays.length : t.done ? 1 : 0;
}

/** Дни, в которые что-то реально закрыто — тот же признак, что и у стрика в сторе. */
function activeDays(plan: PlannedTask[], todos: Todo[]): Set<string> {
  const days = new Set<string>();
  for (const t of plan) if (t.completed) days.add(t.date);
  for (const t of todos) {
    if (t.repeat) for (const d of t.doneDays) days.add(d);
    else if (t.done) days.add(t.date);
  }
  return days;
}

function streakFrom(days: Set<string>): number {
  if (days.size === 0) return 0;
  const cursor = new Date();
  if (!days.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function GET(req: Request) {
  const key = await authorizeServiceKey(req);
  if (!key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") ?? "";
  const stat = url.searchParams.get("stat") as StatKey | null;
  if (!userId || !stat || !STAT_KEYS.includes(stat)) {
    return NextResponse.json({ error: "userId and valid stat required" }, { status: 400 });
  }

  if (!(await userAllowedForKey(key.id, userId))) {
    return NextResponse.json({ error: "userId not linked to this key" }, { status: 403 });
  }

  const state = await loadState(userId);
  const plan = state.plan ?? [];
  const todos = state.todos ?? [];

  let statXp = 0;
  let totalXp = 0;
  for (const t of plan) {
    if (!t.completed) continue;
    totalXp += t.xp;
    const cat = t.snapshot.category as CategoryKey | undefined;
    if (cat && CATEGORIES[cat]?.stat === stat) statXp += t.xp;
  }
  for (const t of todos) {
    const n = todoCompletions(t);
    if (!n) continue;
    const xp = n * TODO_PRIORITY_XP[t.priority];
    totalXp += xp;
    if (categorizeTodo(t.title).stat === stat) statXp += xp;
  }

  return NextResponse.json({
    stat,
    xp: statXp,
    level: levelForXp(totalXp),
    streak: streakFrom(activeDays(plan, todos)),
  });
}
