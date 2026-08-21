/**
 * /api/integrations/complete-action — засчитать закрытую активность
 * стороннего сервиса как выполненное действие YeahGrind: реальный XP,
 * вклад в стрик, прогресс уровня — как если бы карточку закрыли сами, в
 * колоде. Авторизация: scoped ApiKey + userId, привязанный этим же ключом
 * через /api/keys/redeem (см. src/lib/apiKey.ts).
 *
 * POST { userId, source, activityType: "reading"|"writing"|"quiz"|"notes",
 *        title, minutes, date? }
 *   → { ok, xp, totalXp, level }
 *
 * date — локальный день пользователя (YYYY-MM-DD), если он у вызывающего
 * есть; без него используется серверная UTC-дата как фолбэк. resultPct
 * (score/band из ТЗ StudyLoop) пока не влияет на XP — сложность/impact
 * зафиксированы по activityType (ACTIVITY_PRESET ниже), не по результату;
 * это осознанное упрощение MVP, не забытое поле.
 *
 * ВАЖНО: это не то же самое, что POST /api/events — тот пишет сырой сигнал
 * в таблицу Event (топливо для движка рекомендаций) и НЕ трогает XP/уровень.
 * Здесь дописывается реальная закрытая запись в UserState.data.plan — то
 * единственное место, откуда XP/стрик/уровень реально считаются
 * (selectTotalXp/selectStats в src/store/useUserStore.ts читают только
 * plan+todos, не Event).
 */

import { NextResponse } from "next/server";
import { authorizeServiceKey, userAllowedForKey } from "@/lib/apiKey";
import { makeId, loadState, saveState, type PlannedTask, type Todo } from "@/lib/externalState";
import { xpForAction } from "@/lib/domain";
import { levelForXp } from "@/lib/leveling";
import { TODO_PRIORITY_XP } from "@/lib/todoCategory";
import { buildExternalActionSnapshot, type ActivityType } from "@/lib/externalActions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function todoXp(todos: Todo[]): number {
  return todos.reduce((sum, t) => {
    const n = t.repeat ? t.doneDays.length : t.done ? 1 : 0;
    return sum + n * TODO_PRIORITY_XP[t.priority];
  }, 0);
}

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
  const source = typeof body.source === "string" ? body.source.slice(0, 40) : "external";
  const activityType = body.activityType as ActivityType;
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 120) : "";
  const minutes = typeof body.minutes === "number" && body.minutes > 0 ? Math.round(body.minutes) : 0;
  // Локальный день пользователя сервер не угадывает (тот же принцип, что и
  // у /api/assistant) — если вызывающий его не прислал, берём серверную
  // UTC-дату как разумный фолбэк, а не точный расчёт.
  const date =
    typeof body.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
      ? body.date
      : new Date().toISOString().slice(0, 10);
  const validType =
    activityType === "reading" ||
    activityType === "writing" ||
    activityType === "quiz" ||
    activityType === "notes";

  if (!userId || !title || !minutes || !validType) {
    return NextResponse.json(
      { error: "userId, title, minutes and valid activityType required" },
      { status: 400 },
    );
  }

  if (!(await userAllowedForKey(key.id, userId))) {
    return NextResponse.json({ error: "userId not linked to this key" }, { status: 403 });
  }

  const snapshot = buildExternalActionSnapshot(source, activityType, title, minutes);
  const xp = xpForAction(snapshot);
  const now = Date.now();
  const task: PlannedTask = {
    id: makeId(),
    actionId: snapshot.id,
    snapshot,
    xp,
    date,
    completed: true,
    acceptedAt: now,
    completedAt: now,
  };

  const state = await loadState(userId);
  state.plan = [task, ...(state.plan ?? [])];
  await saveState(userId, state);

  const totalXp =
    (state.plan ?? []).filter((t) => t.completed).reduce((sum, t) => sum + t.xp, 0) +
    todoXp(state.todos ?? []);

  return NextResponse.json({ ok: true, xp, totalXp, level: levelForXp(totalXp) });
}
