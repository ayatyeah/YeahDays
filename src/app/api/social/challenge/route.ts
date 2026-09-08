/**
 * /api/social/challenge — общий челлендж с друзьями.
 *
 * GET                      → челленджи, где я участник, с прогрессом всех за день.
 * POST { title, unit, target, day } → создать и сразу позвать всех друзей.
 * PUT  { id, day, delta }  → изменить свой счётчик за день.
 * DELETE { id }            → выйти; последний участник забирает челлендж с собой.
 *
 * Приглашать умеет только владелец и только уже добавленных друзей: без
 * этого общий челлендж стал бы способом писать незнакомым людям.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function me(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

const NO_AUTH = NextResponse.json({ error: "Нужен вход" }, { status: 401 });
/** Ровно один день, YYYY-MM-DD: день считает клиент, у него локальное время. */
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: Request) {
  const userId = await me();
  if (!userId) return NO_AUTH;

  const day = new URL(req.url).searchParams.get("day") ?? "";
  if (!DAY_RE.test(day)) return NextResponse.json({ error: "Нужен день" }, { status: 400 });

  try {
    const mine = await prisma.sharedChallengeMember.findMany({
      where: { userId },
      select: { challengeId: true },
    });
    const ids = mine.map((m) => m.challengeId);
    if (ids.length === 0) return NextResponse.json({ challenges: [] });

    const [challenges, members, progress, stats] = await Promise.all([
      prisma.sharedChallenge.findMany({ where: { id: { in: ids } } }),
      prisma.sharedChallengeMember.findMany({ where: { challengeId: { in: ids } } }),
      prisma.sharedChallengeProgress.findMany({ where: { challengeId: { in: ids }, day } }),
      prisma.publicStats.findMany({
        where: {
          userId: {
            in: (
              await prisma.sharedChallengeMember.findMany({
                where: { challengeId: { in: ids } },
                select: { userId: true },
              })
            ).map((m) => m.userId),
          },
        },
        select: { userId: true, name: true },
      }),
    ]);

    const nameOf = new Map(stats.map((s) => [s.userId, s.name]));
    const countOf = new Map(progress.map((p) => [`${p.challengeId}:${p.userId}`, p.count]));

    return NextResponse.json({
      challenges: challenges.map((c) => ({
        id: c.id,
        title: c.title,
        unit: c.unit,
        target: c.target,
        isOwner: c.ownerId === userId,
        members: members
          .filter((m) => m.challengeId === c.id)
          .map((m) => ({
            userId: m.userId,
            name: m.userId === userId ? "Ты" : nameOf.get(m.userId) || "Друг",
            isMe: m.userId === userId,
            count: countOf.get(`${c.id}:${m.userId}`) ?? 0,
          }))
          // свой прогресс первым, дальше по убыванию — маленькая таблица лидеров
          .sort((a, b) => Number(b.isMe) - Number(a.isMe) || b.count - a.count),
      })),
    });
  } catch (e) {
    console.error("challenge GET failed:", e);
    return NextResponse.json({ challenges: [] });
  }
}

export async function POST(req: Request) {
  const userId = await me();
  if (!userId) return NO_AUTH;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim().slice(0, 60);
  const unit = String(body.unit ?? "раз").trim().slice(0, 20) || "раз";
  const target = Math.max(1, Math.min(999, Math.round(Number(body.target) || 1)));
  if (!title) return NextResponse.json({ error: "Нужно название" }, { status: 400 });

  try {
    const friends = await prisma.friendship.findMany({
      where: { userId },
      select: { friendId: true },
    });
    if (friends.length === 0) {
      return NextResponse.json({ error: "Сначала добавь друга" }, { status: 400 });
    }

    const challenge = await prisma.sharedChallenge.create({
      data: { title, unit, target, ownerId: userId },
    });
    await prisma.sharedChallengeMember.createMany({
      data: [userId, ...friends.map((f) => f.friendId)].map((id) => ({
        challengeId: challenge.id,
        userId: id,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ ok: true, id: challenge.id });
  } catch (e) {
    console.error("challenge POST failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const userId = await me();
  if (!userId) return NO_AUTH;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = String(body.id ?? "").slice(0, 40);
  const day = String(body.day ?? "");
  const delta = Math.max(-99, Math.min(99, Math.round(Number(body.delta) || 0)));
  if (!id || !DAY_RE.test(day)) {
    return NextResponse.json({ error: "Нужен челлендж и день" }, { status: 400 });
  }

  try {
    const member = await prisma.sharedChallengeMember.findUnique({
      where: { challengeId_userId: { challengeId: id, userId } },
    });
    if (!member) return NextResponse.json({ error: "Ты не участник" }, { status: 403 });

    const existing = await prisma.sharedChallengeProgress.findUnique({
      where: { challengeId_userId_day: { challengeId: id, userId, day } },
    });
    // ниже нуля не опускаемся: «минус один подход» — это не событие
    const count = Math.max(0, (existing?.count ?? 0) + delta);
    await prisma.sharedChallengeProgress.upsert({
      where: { challengeId_userId_day: { challengeId: id, userId, day } },
      create: { challengeId: id, userId, day, count },
      update: { count },
    });

    return NextResponse.json({ ok: true, count });
  } catch (e) {
    console.error("challenge PUT failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = await me();
  if (!userId) return NO_AUTH;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const id = String(body.id ?? "").slice(0, 40);
  if (!id) return NextResponse.json({ error: "Нужен челлендж" }, { status: 400 });

  try {
    await prisma.sharedChallengeMember.deleteMany({ where: { challengeId: id, userId } });
    // остался без участников — удаляем целиком, вместе с прогрессом (каскад)
    const left = await prisma.sharedChallengeMember.count({ where: { challengeId: id } });
    if (left === 0) await prisma.sharedChallenge.deleteMany({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("challenge DELETE failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
