/**
 * /api/integrations/overview — сводка дня для внешнего ассистента
 * (YeahSoldiers, Telegram-агенты): уровень, XP, стрик, XP по статам,
 * задачи и план на день, чек-ин, просроченное и последняя неделя.
 * Только чтение. Авторизация: scoped ApiKey + userId, привязанный этим же
 * ключом через /api/keys/redeem (см. src/lib/apiKey.ts).
 *
 * GET ?userId=&date=YYYY-MM-DD
 *   date — локальный день пользователя; без него — серверная дата (фолбэк).
 */

import { NextResponse } from "next/server";
import { authorizeServiceKey, userAllowedForKey } from "@/lib/apiKey";
import { isTodoDone, isTodoOnDay, loadState } from "@/lib/externalState";
import { activeDays, computeProgress, prevDay } from "@/lib/integrationProgress";
import { dateKey } from "@/lib/domain";
import { TODO_PRIORITY_XP } from "@/lib/todoCategory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_OVERDUE = 15;

export async function GET(req: Request) {
  const key = await authorizeServiceKey(req);
  if (!key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") ?? "";
  const rawDate = url.searchParams.get("date") ?? "";
  const day = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : dateKey();
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  if (!(await userAllowedForKey(key.id, userId))) {
    return NextResponse.json({ error: "userId not linked to this key" }, { status: 403 });
  }

  const state = await loadState(userId);
  const plan = state.plan ?? [];
  const todos = state.todos ?? [];
  const progress = computeProgress(state, day);

  const todayTodos = todos
    .filter((t) => isTodoOnDay(t, day))
    .map((t) => ({
      id: t.id,
      title: t.title,
      hour: t.hour ?? null,
      minute: t.minute ?? null,
      duration: t.duration ?? null,
      priority: t.priority,
      done: isTodoDone(t, day),
      repeat: t.repeat?.kind ?? null,
      source: t.source ?? null,
      xp: TODO_PRIORITY_XP[t.priority],
    }))
    .sort((a, b) => (a.hour ?? 99) * 60 + (a.minute ?? 0) - ((b.hour ?? 99) * 60 + (b.minute ?? 0)));

  const todayPlan = plan
    .filter((t) => t.date === day)
    .map((t) => ({
      id: t.id,
      title: t.snapshot.title ?? t.actionId,
      category: t.snapshot.category ?? null,
      minutes: t.snapshot.duration ?? null,
      xp: t.xp,
      completed: t.completed,
    }));

  // Разовые задачи с прошедшей датой, которые так и не закрыты.
  const overdue = todos
    .filter((t) => !t.repeat && !t.done && t.date < day)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_OVERDUE)
    .map((t) => ({ id: t.id, title: t.title, date: t.date, priority: t.priority }));

  // Последние 7 дней: сколько закрыто и сколько XP.
  const days = activeDays(plan, todos);
  const week: { date: string; active: boolean; completed: number; xp: number }[] = [];
  for (let d = day, i = 0; i < 7; i++, d = prevDay(d)) {
    let completed = 0;
    let xp = 0;
    for (const t of plan) {
      if (t.completed && t.date === d) {
        completed++;
        xp += t.xp;
      }
    }
    for (const t of todos) {
      if (t.repeat ? t.doneDays.includes(d) : t.done && t.date === d) {
        completed++;
        xp += TODO_PRIORITY_XP[t.priority];
      }
    }
    week.push({ date: d, active: days.has(d), completed, xp });
  }

  return NextResponse.json({
    date: day,
    level: progress.level,
    totalXp: progress.totalXp,
    streak: progress.streak,
    stats: progress.stats,
    mood: state.moods?.[day] ?? null,
    todos: todayTodos,
    plan: todayPlan,
    overdue,
    week,
  });
}
