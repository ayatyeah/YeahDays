/**
 * /api/integrations/complete-todo — отметить задачу из плана выполненной
 * от лица внешнего сервиса (YeahSoldiers: «Таски, лабу сдал»). XP и стрик
 * считаются как при обычной галочке в приложении: разовая задача → done,
 * повторяющаяся → день в doneDays. Авторизация: scoped ApiKey + userId,
 * привязанный этим же ключом через /api/keys/redeem.
 *
 * POST { userId, todoId, date? } → { ok, xp, alreadyDone }
 *   date — локальный день пользователя (важно для повторяющихся задач);
 *   без него — серверная дата.
 */

import { NextResponse } from "next/server";
import { authorizeServiceKey, userAllowedForKey } from "@/lib/apiKey";
import { isTodoDone, isTodoOnDay, loadState, saveState } from "@/lib/externalState";
import { dateKey } from "@/lib/domain";
import { TODO_PRIORITY_XP } from "@/lib/todoCategory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = await authorizeServiceKey(req);
  if (!key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId : "";
  const todoId = typeof body.todoId === "string" ? body.todoId : "";
  const day =
    typeof body.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : dateKey();
  if (!userId || !todoId) {
    return NextResponse.json({ error: "userId and todoId required" }, { status: 400 });
  }

  if (!(await userAllowedForKey(key.id, userId))) {
    return NextResponse.json({ error: "userId not linked to this key" }, { status: 403 });
  }

  const state = await loadState(userId);
  const todo = (state.todos ?? []).find((t) => t.id === todoId);
  if (!todo) {
    return NextResponse.json({ error: "todo not found" }, { status: 404 });
  }
  if (todo.repeat && !isTodoOnDay(todo, day)) {
    return NextResponse.json({ error: "repeating todo is not scheduled on this date" }, { status: 400 });
  }

  const xp = TODO_PRIORITY_XP[todo.priority];
  if (isTodoDone(todo, day)) {
    return NextResponse.json({ ok: true, xp: 0, alreadyDone: true });
  }

  if (todo.repeat) {
    todo.doneDays = [...todo.doneDays, day];
  } else {
    todo.done = true;
    todo.completedAt = Date.now();
  }
  await saveState(userId, state);

  return NextResponse.json({ ok: true, xp, alreadyDone: false });
}
