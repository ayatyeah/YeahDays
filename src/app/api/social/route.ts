/**
 * /api/social — друзья и их сводки.
 *
 * GET  → { me, friends[] } — своя карточка и карточки друзей.
 * PUT  { name, level, xp, streak } → обновить свою публичную сводку.
 * POST { code } → подружиться по коду (см. /api/keys/pair).
 * POST { invite } → подружиться по ссылке-приглашению (см. /api/social/invite).
 * DELETE { friendId } → развязаться, симметрично.
 *
 * Видно ровно то, что человек и так показал бы сам: имя, уровень, опыт,
 * серия. Ни задач, ни расписания, ни истории свайпов — из чужого блоба
 * сюда не попадает ничего.
 *
 * Только для вошедших: у анонимного устройства нет ни имени, ни того, с
 * кем дружить, а device-id подделывается одной строкой в запросе.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { blockedIds } from "@/lib/communityDb";
import { rateLimit } from "@/lib/rateLimit";

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

export async function GET() {
  const userId = await me();
  if (!userId) return NO_AUTH;

  try {
    const [mine, links] = await Promise.all([
      prisma.publicStats.findUnique({ where: { userId } }),
      prisma.friendship.findMany({
        where: { userId },
        select: { friendId: true, createdAt: true },
      }),
    ]);

    const blocked = await blockedIds(userId);
    const ids = links.map((l) => l.friendId).filter(id => !blocked.includes(id));
    const stats = ids.length
      ? await prisma.publicStats.findMany({ where: { userId: { in: ids } } })
      : [];
    const byId = new Map(stats.map((s) => [s.userId, s]));

    // Друг, который ещё ни разу не синхронизировался, не должен пропадать
    // из списка — показываем его с нулями, а не прячем.
    const friends = ids.map((id) => {
      const s = byId.get(id);
      return {
        userId: id,
        name: s?.name || "Без имени",
        level: s?.level ?? 1,
        xp: s?.xp ?? 0,
        streak: s?.streak ?? 0,
        updatedAt: s?.updatedAt?.getTime() ?? null,
      };
    });
    friends.sort((a, b) => b.streak - a.streak || b.xp - a.xp);

    return NextResponse.json({
      me: mine
        ? { userId, name: mine.name, level: mine.level, xp: mine.xp, streak: mine.streak }
        : null,
      friends,
    });
  } catch (e) {
    console.error("social GET failed:", e);
    return NextResponse.json({ me: null, friends: [] });
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

  const num = (v: unknown, max: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(0, Math.min(max, Math.round(n))) : 0;
  };
  const data = {
    name: String(body.name ?? "").slice(0, 40),
    level: num(body.level, 999),
    xp: num(body.xp, 10_000_000),
    streak: num(body.streak, 100_000),
  };

  try {
    await prisma.publicStats.upsert({ where: { userId }, create: { userId, ...data }, update: data });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("social PUT failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const userId = await me();
  if (!userId) return NO_AUTH;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const invite = String(body.invite ?? "").trim().toUpperCase().slice(0, 16);
  if (invite) return acceptInvite(userId, invite);

  const code = String(body.code ?? "").trim().toUpperCase().slice(0, 16);
  if (!code) return NextResponse.json({ error: "Нужен код" }, { status: 400 });

  try {
    const row = await prisma.pairingCode.findUnique({ where: { code } });
    if (!row || row.consumedAt || row.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "Код не найден или истёк" }, { status: 404 });
    }
    if (row.userId === userId) {
      return NextResponse.json({ error: "Это твой собственный код" }, { status: 400 });
    }

    if ((await blockedIds(userId)).includes(row.userId)) return NextResponse.json({ error: "Приглашение недоступно" }, { status: 403 });
    await prisma.$transaction([
      befriend(userId, row.userId),
      prisma.pairingCode.update({
        where: { code },
        data: { consumedAt: new Date() },
      }),
    ]);

    await ensureStats(userId);
    const stats = await prisma.publicStats.findUnique({ where: { userId: row.userId } });
    return NextResponse.json({ ok: true, name: stats?.name || "Без имени" });
  } catch (e) {
    console.error("social POST failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

/**
 * Две строки: «мои друзья» — выборка по userId без OR, и разрыв связи
 * симметричен. createMany со skipDuplicates — повторный код не падает.
 */
function befriend(a: string, b: string) {
  return prisma.friendship.createMany({
    data: [
      { userId: a, friendId: b },
      { userId: b, friendId: a },
    ],
    skipDuplicates: true,
  });
}

/**
 * Завести публичную карточку, если её ещё нет.
 *
 * Карточка появляется при первой синхронизации из браузера, а список друзей
 * читает имя именно из неё: тот, кто только что принял приглашение, висел у
 * друга как «Без имени» до следующего захода в приложение. Имя берём из
 * аккаунта, остальное останется нулевым и обновится сразу при синхронизации.
 */
async function ensureStats(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    await prisma.publicStats.upsert({
      where: { userId },
      create: { userId, name: user?.name?.slice(0, 40) ?? "" },
      update: {},
    });
  } catch (e) {
    console.error("ensureStats failed:", e);
  }
}

/** Ссылка-приглашение: код постоянный, поэтому не гасим его, а ограничиваем частоту. */
async function acceptInvite(userId: string, invite: string) {
  if (!rateLimit(`invite:uid:${userId}`, 20, 60 * 60_000)) {
    return NextResponse.json({ error: "Слишком часто, попробуй позже" }, { status: 429 });
  }
  try {
    const owner = await prisma.publicStats.findUnique({
      where: { inviteCode: invite },
      select: { userId: true, name: true },
    });
    if (!owner) {
      return NextResponse.json({ error: "Ссылка устарела — попроси новую" }, { status: 404 });
    }
    if (owner.userId === userId) {
      return NextResponse.json({ error: "Это твоя собственная ссылка" }, { status: 400 });
    }
    if ((await blockedIds(userId)).includes(owner.userId)) return NextResponse.json({ error: "Приглашение недоступно" }, { status: 403 });
    await befriend(userId, owner.userId);
    await ensureStats(userId);
    return NextResponse.json({ ok: true, name: owner.name || "Без имени" });
  } catch (e) {
    console.error("invite accept failed:", e);
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
  const friendId = String(body.friendId ?? "").slice(0, 64);
  if (!friendId) return NextResponse.json({ error: "Нужен friendId" }, { status: 400 });

  try {
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("social DELETE failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
