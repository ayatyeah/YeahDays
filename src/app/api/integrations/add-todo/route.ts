/**
 * /api/integrations/add-todo — добавить задачу в план от лица внешнего
 * сервиса. Авторизация: scoped ApiKey (см. src/lib/apiKey.ts) + userId
 * должен быть привязан этим же ключом через /api/keys/redeem — валидного
 * ключа одного самого по себе недостаточно.
 *
 * POST { userId, title, date, hour?, duration?, priority? } → { ok, id }
 *
 * Форма тела намеренно совпадает с action:"add_todo" из /api/assistant —
 * та же операция, только другая авторизация.
 */

import { NextResponse } from "next/server";
import { authorizeServiceKey, userAllowedForKey } from "@/lib/apiKey";
import { makeId, loadState, saveState, type Todo } from "@/lib/externalState";

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
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const date = typeof body.date === "string" ? body.date : "";
  if (!userId || !title || !date) {
    return NextResponse.json({ error: "userId, title and date required" }, { status: 400 });
  }

  if (!(await userAllowedForKey(key.id, userId))) {
    return NextResponse.json({ error: "userId not linked to this key" }, { status: 403 });
  }

  const state = await loadState(userId);
  const todo: Todo = {
    id: makeId(),
    title,
    date,
    hour: typeof body.hour === "number" ? body.hour : undefined,
    duration: typeof body.duration === "number" ? body.duration : undefined,
    priority: body.priority === "high" || body.priority === "low" ? body.priority : "normal",
    subtasks: [],
    done: false,
    doneDays: [],
    createdAt: Date.now(),
    completedAt: null,
  };
  state.todos = [todo, ...(state.todos ?? [])];
  await saveState(userId, state);

  return NextResponse.json({ ok: true, id: todo.id });
}
