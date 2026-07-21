/**
 * POST /api/events
 *
 * Приёмник поведенческих сигналов (swipe / complete).
 * Это обучающая выборка будущего recommendation engine:
 * без неё персонализация невозможна.
 *
 * Сейчас события валидируются и логируются. Подключение хранилища —
 * одна строка в `persist()`, контракт с фронтом не изменится.
 */

import { NextResponse } from "next/server";

export const runtime = "edge";

const TYPES = new Set(["accept", "reject", "complete", "skip"]);

interface TrackedEvent {
  type: string;
  actionId: string;
  at: number;
}

async function persist(_events: TrackedEvent[]) {
  // TODO: заменить на запись в БД / очередь аналитики
  // await db.insert(events).values(_events)
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw = Array.isArray(body) ? body : [body];
  const events: TrackedEvent[] = [];

  for (const e of raw) {
    if (!e || typeof e !== "object") continue;
    const { type, actionId, at } = e as Record<string, unknown>;
    if (typeof type !== "string" || !TYPES.has(type)) continue;
    if (typeof actionId !== "string" || !actionId) continue;
    events.push({
      type,
      actionId,
      at: typeof at === "number" ? at : Date.now(),
    });
  }

  if (events.length === 0) {
    return NextResponse.json({ error: "No valid events" }, { status: 400 });
  }

  await persist(events);
  return NextResponse.json({ ok: true, accepted: events.length });
}
