/**
 * /api/integrations/profile — всё, что внешнему ассистенту (YeahSoldiers)
 * полезно знать об аккаунте, одной выжимкой: прогресс, приоритеты, ближайшие
 * задачи и почасовой план, чек-ины и итоги дней, цели, привычки-челленджи,
 * челлендж 30 дней, обучение, ивенты по предметам, факты ассистента
 * YeahGrind, профиль сообщества. Только чтение.
 *
 * Не отдаём: email, пароль, сессии и OAuth-аккаунты, LMS-подключение,
 * push-подписки, переписки AI-чата. Авторизация: scoped ApiKey + userId,
 * привязанный этим же ключом через /api/keys/redeem.
 *
 * GET ?userId=&date=YYYY-MM-DD (локальный день пользователя; без него — серверный)
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorizeServiceKey, userAllowedForKey } from "@/lib/apiKey";
import { loadState } from "@/lib/externalState";
import { computeProgress } from "@/lib/integrationProgress";
import {
  activeQuests,
  challenge30Summary,
  habitChallenges,
  hourlySchedule,
  learningSummary,
  plusDay,
  recentDays,
  upcomingTodos,
} from "@/lib/integrationProfile";
import { dateKey } from "@/lib/domain";
import { EVENTS } from "@/lib/events";
import type { Plan30 } from "@/lib/challenge30";
import type { LearningState } from "@/lib/learning";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FACTS = 40;

/** Кривые или старые данные в одном разделе не должны ронять весь ответ. */
function safe<T>(section: string, run: () => T): T | null {
  try {
    return run();
  } catch (e) {
    console.error(`integrations/profile: ${section} failed:`, e);
    return null;
  }
}

export async function GET(req: Request) {
  const key = await authorizeServiceKey(req);
  if (!key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") ?? "";
  const rawDate = url.searchParams.get("date") ?? "";
  const today = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : dateKey();
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  if (!(await userAllowedForKey(key.id, userId))) {
    return NextResponse.json({ error: "userId not linked to this key" }, { status: 403 });
  }

  const [state, user, challenge30, learning, events, facts, community] = await Promise.all([
    loadState(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        username: true,
        createdAt: true,
        _count: { select: { followers: true, following: true, socialPosts: true } },
      },
    }),
    prisma.challenge30.findUnique({ where: { userId }, select: { data: true } }),
    prisma.learningProfile.findUnique({ where: { userId }, select: { data: true } }),
    prisma.eventProgress.findMany({ where: { userId }, select: { eventId: true, percent: true, updatedAt: true } }),
    prisma.assistantFact.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: MAX_FACTS,
      select: { content: true, createdAt: true },
    }),
    prisma.communityProfile.findUnique({
      where: { userId },
      select: { published: true, bio: true, subjects: true, goals: true },
    }),
  ]);

  const progress = computeProgress(state, today);
  const freezes = state.freezes as { left?: number; days?: string[] } | undefined;
  const eventTitles = new Map(EVENTS.map((e) => [e.id, { title: e.title, course: e.course }]));

  return NextResponse.json({
    date: today,
    user: {
      name: (typeof state.name === "string" && state.name) || user?.name || null,
      username: user?.username ?? null,
      since: user?.createdAt.toISOString().slice(0, 10) ?? null,
      followers: user?._count.followers ?? 0,
      following: user?._count.following ?? 0,
      posts: user?._count.socialPosts ?? 0,
    },
    progress,
    priorities: state.goals ?? null,
    settings: {
      dailyGoal: state.dailyGoal ?? null,
      reminderHour: state.reminderHour ?? null,
      energyProfile: state.energyProfile ?? null,
      excludedCategories: state.excludedCategories ?? [],
    },
    freezes: freezes ? { left: freezes.left ?? 0, used: freezes.days?.length ?? 0 } : null,
    upcoming: safe("upcoming", () => upcomingTodos(state.todos ?? [], today)),
    schedule: safe("schedule", () => hourlySchedule(state, [today, plusDay(today, 1)])),
    recentDays: safe("recentDays", () => recentDays(state, today)),
    quests: safe("quests", () => activeQuests(state, today)),
    habits: safe("habits", () => habitChallenges(state, today)),
    challenge30: safe("challenge30", () => challenge30Summary((challenge30?.data ?? null) as Plan30 | null, today)),
    learning: safe("learning", () => learningSummary((learning?.data ?? null) as LearningState | null)),
    events: events
      .map((e) => ({ id: e.eventId, ...(eventTitles.get(e.eventId) ?? { title: e.eventId, course: null }), percent: e.percent, updatedAt: e.updatedAt.toISOString().slice(0, 10) }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    assistantFacts: facts.map((f) => ({ fact: f.content, at: f.createdAt.toISOString().slice(0, 10) })),
    community: community?.published ? { bio: community.bio, subjects: community.subjects, goals: community.goals } : null,
  });
}
