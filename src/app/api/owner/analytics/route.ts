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
import { requireAdmin } from "@/lib/owner";
import { activitySummary, aiSummary, challengeSummary, dailyCounts, funnel } from "@/lib/ownerAnalytics";
import { POLICY_VERSION } from "@/lib/personalization";
import { MEMBER } from "@/lib/socialDb";
import { visitSummary } from "@/lib/visits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAY = 86_400_000;

export async function GET() {
  const allowed = await requireAdmin();
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
      usage, eventRows, newReports,
      visits, visitors, profiles, states, social,
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
      prisma.aiUsage.findMany({ where: { day: { gte: since(30).toISOString().slice(0, 10) } } }),
      prisma.eventProgress.findMany({ select: { percent: true, share: true } }),
      prisma.eventReport.count({ where: { status: "new" } }),
      prisma.siteVisit.findMany({ where: { day: { gte: since(30).toISOString().slice(0, 10) } } }),
      prisma.siteVisitor.findMany({ where: { day: { gte: since(30).toISOString().slice(0, 10) } }, select: { day: true, authed: true } }),
      prisma.personalizationProfile.findMany({ select: { data: true } }),
      // Шаги воронки считает сама база: тянуть сюда планы всех людей ради четырёх чисел незачем.
      prisma.$queryRaw<{ onboarded: number; planned: number; completed: number }[]>`
        SELECT
          count(*) FILTER (WHERE data->>'onboarded' = 'true')::int AS onboarded,
          count(*) FILTER (WHERE (CASE WHEN jsonb_typeof(data->'plan') = 'array' THEN jsonb_array_length(data->'plan') ELSE 0 END)
                               + (CASE WHEN jsonb_typeof(data->'todos') = 'array' THEN jsonb_array_length(data->'todos') ELSE 0 END) > 0)::int AS planned,
          count(*) FILTER (WHERE data->'plan' @> '[{"completed": true}]' OR data->'todos' @> '[{"done": true}]')::int AS completed
        FROM "UserState"`,
      Promise.all([
        // Участник сообщества — тот, кто принял действующую политику и не скрыл себя: профилем служит сам аккаунт.
        prisma.user.count({ where: MEMBER }),
        prisma.socialPost.count({ where: { parentId: null } }),
        prisma.socialPost.count({ where: { parentId: null, createdAt: { gte: since(7) } } }),
        prisma.socialPost.count({ where: { parentId: { not: null } } }),
        prisma.socialLike.count(),
        prisma.follow.count(),
        prisma.studyTeam.count(),
        prisma.studyTeam.count({ where: { open: true } }),
        prisma.socialReport.count({ where: { resolved: false } }),
        prisma.socialMedia.count({ where: { postId: { not: null } } }),
        prisma.communityProfile.count({ where: { hidden: true } }),
      ]),
    ]);

    type Consent = { version?: string; enabled?: boolean; ai?: boolean };
    const consents = profiles.map((p) => p.data as Consent);
    const accepted = consents.filter((c) => c?.version === POLICY_VERSION);
    const [published, posts, postsWeek, comments, likes, follows, teamCount, openTeams, socialReports, photos, hidden] = social;

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
          { name: "Ивенты", count: eventRows.length },
        ],
        visits: visitSummary(visits, visitors, 30, now),
        activity: activitySummary(profiles.map((p) => p.data as Parameters<typeof activitySummary>[0][number]), 30, now),
        funnel: funnel([
          { name: "Зарегистрировались", count: total },
          { name: "Прошли онбординг", count: states[0]?.onboarded ?? 0 },
          { name: "Добавили дело или действие", count: states[0]?.planned ?? 0 },
          { name: "Выполнили хотя бы одно", count: states[0]?.completed ?? 0 },
          { name: "Активны за 7 дней", count: week },
        ]),
        consent: {
          accepted: accepted.length,
          activity: accepted.filter((c) => c.enabled).length,
          ai: accepted.filter((c) => c.ai).length,
        },
        community: { published, posts, postsWeek, comments, likes, follows, teams: teamCount, openTeams, reports: socialReports, photos, hidden },
        ai: aiSummary(usage, now),
        events: {
          participants: eventRows.length,
          sharing: eventRows.filter((e) => e.share).length,
          averagePercent: eventRows.length ? Math.round(eventRows.reduce((n, e) => n + e.percent, 0) / eventRows.length) : 0,
          ready: eventRows.filter((e) => e.percent >= 85).length,
          newReports,
        },
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
