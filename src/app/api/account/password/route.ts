/**
 * POST /api/account/password — сменить пароль своего же аккаунта (сессия).
 * Не путать с /api/owner/users/[id]/password — там владелец меняет ЧУЖОЙ
 * пароль вручную (заявки с /forgot-password), без знания старого. Здесь —
 * сам пользователь, поэтому: если пароль уже есть, требуем текущий (защита
 * на случай угнанной сессии/чужого браузера); если пароля ещё нет
 * (google-only аккаунт) — просто заводим первый.
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { boundedJson, RequestBodyError } from '@/lib/requestSecurity';
import { validNewPassword } from '@/lib/passwordPolicy';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!rateLimit(`password-change:${userId}`, 6, 15 * 60_000)) return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });

  let body: unknown;
  try {
    body = await boundedJson(req);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: error instanceof RequestBodyError ? error.status : 400 });
  }
  const { currentPassword, newPassword } = (body ?? {}) as Record<string, unknown>;
  const newPasswordStr = String(newPassword ?? "");
  if (!validNewPassword(newPasswordStr)) {
    return NextResponse.json({ error: "Use at least 8 characters and at most 72 UTF-8 bytes." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  if (user.passwordHash) {
    const valid = await bcrypt.compare(String(currentPassword ?? ""), user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Текущий пароль неверный" }, { status: 401 });
    }
  }

  const passwordHash = await bcrypt.hash(newPasswordStr, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return NextResponse.json({ ok: true });
}
