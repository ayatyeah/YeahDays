/**
 * GET /api/owner/analytics — сводные показатели для вкладки «Аналитика» в
 * /admin: рост, активность, использование разделов, «Челлендж 30».
 *
 * Отдаём только агрегаты (см. lib/ownerAnalytics.ts): по этому ответу
 * нельзя узнать, что делал конкретный человек. Список людей — отдельная
 * вкладка и отдельный роут.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/owner";
import { challengeSummary, dailyCounts } from "@/lib/ownerAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAY = 86_400_000;

export async function GET() {
  const allowed = await requireOwner();
  if (!allowed) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const now = new Date();
  const since = (days: number) => new Date(now.getTime() - days * DAY);
  // «Активен» = аккаунт синхронизировал состояние: это происходит при любой
  // правке плана, так что открытая без дела вкладка сюда не попадает.
  const active = (days: number) => prisma.userState.count({ where: { updatedAt: { gte: since(days) } } });

  try {
    const [
      total, banned, recent, day, week, month,
      providers, passwords, push, chat, learning, lms, teams, challenges,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { banned: true } }),
      prisma.user.findMany({ where: { createdAt: { gte: since(30) } }, select: { createdAt: true } }),
      active(1), active(7), active(30),
      prisma.account.groupBy({ by: ["provider"], _count: { _all: true } }),
      prisma.user.count({ where: { passwordHash: { not: null } } }),
      prisma.pushSubscription.findMany({ where: { enabled: true }, distinct: ["userId"], select: { userId: true } }),
      prisma.aiChat.count(),
      prisma.learningProfile.count(),
      prisma.lmsConnection.count(),
      prisma.studyMember.findMany({ distinct: ["userId"], select: { userId: true } }),
      prisma.challenge30.findMany({ select: { data: true, aiDay: true, aiCount: true } }),
    ]);

    const registrations = dailyCounts(recent.map((u) => u.createdAt), 30, now);
    return NextResponse.json(
      {
        generatedAt: now.toISOString(),
        users: {
          total,
          banned,
          new7: registrations.slice(-7).reduce((n, d) => n + d.count, 0),
          new30: recent.length,
          registrations,
        },
        active: { day, week, month },
        signIn: [
          { name: "Пароль", count: passwords },
          ...providers.map((p) => ({ name: p.provider, count: p._count._all })),
        ],
        features: [
          { name: "Push-уведомления", count: push.length },
          { name: "ИИ-помощник", count: chat },
          { name: "Прокачка навыков", count: learning },
          { name: "Календарь LMS", count: lms },
          { name: "Команды", count: teams.length },
          { name: "Челлендж 30", count: challenges.filter((c) => c.data).length },
        ],
        challenge30: challengeSummary(challenges, now),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    // Текст ошибки базы наружу не отдаём даже владельцу: консоль открывают
    // и с чужих компьютеров.
    return NextResponse.json({ error: "Не удалось собрать аналитику" }, { status: 503 });
  }
}
