/**
 * POST /api/owner/users/[id]/password — владелец вручную ставит новый
 * пароль пользователю (ручная обработка заявки «забыли пароль», см.
 * /forgot-password и PasswordResetRequest). Работает и для google-only
 * аккаунтов — им это просто заводит первый пароль.
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  const password = String((body as Record<string, unknown> | null)?.password ?? "");
  if (password.length < 8) {
    return NextResponse.json({ error: "Пароль — минимум 8 символов" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
