/**
 * /api/account/providers — какие способы входа привязаны к текущему
 * аккаунту (пароль/Google), чтобы профиль мог показать "Привязать Google"
 * только тем, у кого его ещё нет.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [user, googleAccount] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } }),
    prisma.account.findFirst({ where: { userId, provider: "google" }, select: { id: true } }),
  ]);

  return NextResponse.json({
    hasPassword: !!user?.passwordHash,
    hasGoogle: !!googleAccount,
  });
}
