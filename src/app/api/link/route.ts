/**
 * POST /api/link  { deviceId }
 *
 * При входе переносит события анонимного устройства на аккаунт, чтобы
 * прогресс/история не терялись. Идемпотентно; переносит только с
 * реально анонимного пользователя (без email/аккаунта).
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  const accountId = session?.user?.id;
  if (!accountId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { deviceId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const deviceId =
    typeof body.deviceId === "string" ? body.deviceId.slice(0, 64) : "";
  if (!deviceId || deviceId === accountId) {
    return NextResponse.json({ ok: true, moved: 0 });
  }

  try {
    const device = await prisma.user.findUnique({
      where: { id: deviceId },
      select: { email: true },
    });
    // переносим только с анонимного пользователя (без аккаунта)
    if (!device || device.email) {
      return NextResponse.json({ ok: true, moved: 0 });
    }
    const moved = await prisma.event.updateMany({
      where: { userId: deviceId },
      data: { userId: accountId },
    });
    await prisma.user.delete({ where: { id: deviceId } }).catch(() => {});
    return NextResponse.json({ ok: true, moved: moved.count });
  } catch (e) {
    console.error("link failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
