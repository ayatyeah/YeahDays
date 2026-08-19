/**
 * POST /api/recommendations
 *
 * Серверный движок. История берётся из событий в Postgres — значит
 * подбор одинаков на всех устройствах пользователя и переживает очистку
 * кэша браузера. Если БД недоступна — считаем по истории из запроса.
 *
 * Тело: RecommendRequest + { userId }.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { ACTION_POOL } from "@/lib/actionPool";
import { recommend, emptyHistory } from "@/lib/recommendation";
import { historyFromEvents, type StoredEvent } from "@/lib/serverHistory";
import { DEFAULT_GOALS, DEFAULT_MOOD, type StatKey } from "@/lib/domain";
import { recentTodoStatXp } from "@/lib/todoCategory";
import type { RecommendRequest, RecommendResponse } from "@/lib/api";
import type { Todo } from "@/store/useUserStore";

/** Задачи календаря учитываются в балансе статов только за недавнее окно —
 *  иначе накопленный за месяцы план задавил бы вклад обычных действий из
 *  колоды, и движок "видел" бы только календарь. */
const TODO_STAT_WINDOW_MS = 21 * 24 * 3600_000;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Partial<RecommendRequest> & { userId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const goals = { ...DEFAULT_GOALS, ...(body.goals ?? {}) };
  const mood = { ...DEFAULT_MOOD, ...(body.mood ?? {}) };
  const excludeIds = Array.isArray(body.excludeIds) ? body.excludeIds : [];
  const custom = Array.isArray(body.customActions) ? body.customActions : [];
  const excludeCategories = Array.isArray(body.excludeCategories)
    ? body.excludeCategories
    : undefined;
  const disabledActions = Array.isArray(body.disabledActions)
    ? body.disabledActions
    : undefined;
  const pool = body.useOwnActionsOnly ? custom : [...ACTION_POOL, ...custom];
  const session = await auth();
  const userId =
    session?.user?.id ?? (typeof body.userId === "string" ? body.userId : "");

  // История: из БД (авторитетно), с фолбэком на присланную клиентом.
  let history = { ...emptyHistory(), ...(body.history ?? {}) };
  let engine = "server-fallback-v1";
  if (userId) {
    try {
      const events = (await prisma.event.findMany({
        where: { userId },
        orderBy: { at: "desc" },
        take: 1000,
        select: { actionId: true, type: true, category: true, xp: true, at: true },
      })) as StoredEvent[];
      const dbHistory = historyFromEvents(events);
      // lastSeen с устройства (что реально показывалось) помогает freshness
      for (const [id, ts] of Object.entries(history.lastSeen)) {
        dbHistory.lastSeen[id] = Math.max(dbHistory.lastSeen[id] ?? 0, ts);
      }
      // Личные замеры длительности сервер не хранит нигде — без этого
      // мёржа они тихо терялись на каждый запрос, хотя клиент их честно
      // копит и присылает (см. history.durations в toggleTask).
      if (body.history?.durations) {
        dbHistory.durations = { ...dbHistory.durations, ...body.history.durations };
      }

      // Задачи календаря — движок их иначе вообще не видит: toggleTodo не
      // трогает history, только план (Action-колода) её пишет. Читаем
      // снимок состояния пользователя напрямую, а не то, что прислал
      // клиент, — тот же принцип "БД авторитетна", что и у events выше.
      const state = await prisma.userState.findUnique({
        where: { userId },
        select: { data: true },
      });
      const todos = (state?.data as { todos?: Todo[] } | null)?.todos ?? [];
      const todoStatXp = recentTodoStatXp(todos, Date.now() - TODO_STAT_WINDOW_MS);
      for (const [stat, xp] of Object.entries(todoStatXp)) {
        dbHistory.statXp[stat as StatKey] += xp ?? 0;
      }

      history = dbHistory;
      engine = "server-db-v1";
    } catch (e) {
      console.error("history load failed, using client history:", e);
    }
  }

  const deck = recommend(
    { pool, goals, mood, history, excludeIds, excludeCategories, disabledActions },
    Math.min(body.limit ?? 12, 40),
  );

  const payload: RecommendResponse = { deck, engine, generatedAt: Date.now() };
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
