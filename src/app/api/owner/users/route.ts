/**
 * GET /api/owner/users — список зарегистрированных пользователей для
 * владельческой консоли (/admin), с отметкой «в сети» у тех, кто включил
 * учёт активности. Владелец определяется по email
 * (см. src/lib/owner.ts) — не сессией с ролью, роли в схеме нет.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/owner";
import { presenceOf } from "@/lib/presence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const allowed = await requireAdmin();
  if (!allowed) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const [users, activity] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        birthYear: true,
        createdAt: true,
        passwordHash: true,
        banned: true,
        accounts: { select: { provider: true } },
      },
    }),
    // «В сети» — из учёта активности: два поля из JSON, а не весь профиль с
    // историей дней на каждого (см. lib/presence.ts).
    prisma.$queryRaw<{ userId: string; enabled: boolean | null; lastTick: string | null }[]>`
      SELECT "userId", (data->>'enabled')::boolean AS enabled, data->>'lastTick' AS "lastTick"
      FROM "PersonalizationProfile"`,
  ]);
  const byUser = new Map(activity.map((a) => [a.userId, a]));
  const now = Date.now();

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      username: u.username,
      birthYear: u.birthYear,
      createdAt: u.createdAt,
      hasPassword: !!u.passwordHash,
      banned: u.banned,
      providers: u.accounts.map((a) => a.provider),
      presence: presenceOf(byUser.get(u.id)?.enabled, Number(byUser.get(u.id)?.lastTick ?? 0), now),
    })),
  });
}
