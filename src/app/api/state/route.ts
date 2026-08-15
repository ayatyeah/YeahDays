/**
 * /api/state — кросс-девайс синхронизация клиентского состояния.
 *
 * GET  ?userId=…   → { data, updatedAt } — снимок пользователя (или null).
 * PUT  { userId, data } → сохранить снимок. Разрешение конфликтов —
 *                  last-write-wins по data.updatedAt (время изменения
 *                  на клиенте). Если на сервере уже свежее — не затираем,
 *                  а возвращаем серверный снимок (клиент его примет).
 *
 * userId: у вошедшего — из сессии (нельзя подделать); иначе device-id из тела.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { upsertUserStateIfNewer } from "@/lib/userState";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function resolveUserId(fallback?: unknown): Promise<string> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return typeof fallback === "string" ? fallback.slice(0, 64) : "";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = await resolveUserId(url.searchParams.get("userId"));
  if (!userId) return NextResponse.json({ data: null, updatedAt: null });

  try {
    const row = await prisma.userState.findUnique({ where: { userId } });
    if (!row) return NextResponse.json({ data: null, updatedAt: null });
    return NextResponse.json({
      data: row.data,
      updatedAt: row.clientAt.getTime(),
    });
  } catch (e) {
    console.error("state GET failed:", e);
    return NextResponse.json({ data: null, updatedAt: null });
  }
}

export async function PUT(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userId = await resolveUserId(body.userId);
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const data = body.data;
  const clientAt =
    data && typeof data === "object"
      ? Number((data as Record<string, unknown>).updatedAt)
      : NaN;
  if (!data || typeof data !== "object" || !Number.isFinite(clientAt)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const result = await upsertUserStateIfNewer(userId, data, clientAt);
    if (!result.applied) {
      // На сервере уже не старше — не затираем, отдаём серверный снимок.
      return NextResponse.json({
        ok: true,
        applied: false,
        data: result.data,
        updatedAt: result.clientAt,
      });
    }
    return NextResponse.json({ ok: true, applied: true });
  } catch (e) {
    console.error("state PUT failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
