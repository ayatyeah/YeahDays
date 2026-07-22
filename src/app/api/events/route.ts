/**
 * POST /api/events
 *
 * Приёмник поведенческих сигналов (свайп / выполнение) → пишем в Postgres.
 * Это обучающая выборка движка и источник серверной истории рекомендаций.
 *
 * Тело: { userId, type, actionId, at?, category?, xp? }
 * (или { userId, events: [...] } для батча).
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES = new Set(["accept", "reject", "complete", "skip"]);

type Row = {
  actionId: string;
  type: "accept" | "reject" | "complete" | "skip";
  category: string | null;
  xp: number | null;
  at: Date;
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId.slice(0, 64) : "";
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const raw = Array.isArray(body.events) ? body.events : [body];
  const rows: Row[] = [];
  for (const e of raw) {
    if (!e || typeof e !== "object") continue;
    const { type, actionId, at, category, xp } = e as Record<string, unknown>;
    if (typeof type !== "string" || !TYPES.has(type)) continue;
    if (typeof actionId !== "string" || !actionId) continue;
    rows.push({
      actionId: actionId.slice(0, 128),
      type: type as Row["type"],
      category: typeof category === "string" ? category : null,
      xp: typeof xp === "number" ? Math.round(xp) : null,
      at: typeof at === "number" ? new Date(at) : new Date(),
    });
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "No valid events" }, { status: 400 });
  }

  try {
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    });
    await prisma.event.createMany({
      data: rows.map((r) => ({ ...r, userId })),
    });
  } catch (e) {
    console.error("events persist failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, accepted: rows.length });
}
