/**
 * POST /api/owner/users/[id]/ban — забанить/разбанить пользователя.
 * Тело: { banned: boolean }. Бан проверяется на каждый auth() (см.
 * callbacks.jwt в src/auth.ts) — уже открытая сессия обнулится сразу же,
 * не только новые попытки входа.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/owner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.user?.id) {
    return NextResponse.json({ error: "Нельзя забанить себя" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  const banned = (body as Record<string, unknown> | null)?.banned;
  if (typeof banned !== "boolean") {
    return NextResponse.json({ error: "Некорректное значение" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  await prisma.user.update({ where: { id }, data: { banned } });
  return NextResponse.json({ ok: true });
}
