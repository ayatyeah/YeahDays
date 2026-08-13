/**
 * GET /api/owner/users — список зарегистрированных пользователей для
 * владельческой консоли (/admin). Владелец определяется по email
 * (см. src/lib/owner.ts) — не сессией с ролью, роли в схеме нет.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/owner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      birthYear: true,
      createdAt: true,
      passwordHash: true,
      accounts: { select: { provider: true } },
    },
  });

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      username: u.username,
      birthYear: u.birthYear,
      createdAt: u.createdAt,
      hasPassword: !!u.passwordHash,
      providers: u.accounts.map((a) => a.provider),
    })),
  });
}
