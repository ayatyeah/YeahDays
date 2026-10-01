/**
 * /api/account — данные пользователя под его контролем.
 *
 * GET    — выгрузить всё, что о человеке хранится (JSON)
 * DELETE — удалить аккаунт и все данные без следа
 *
 * Это не «фича на будущее»: без экспорта и удаления приложение нельзя
 * подавать в сторы и нельзя честно обещать людям контроль над данными.
 * Оба действия работают только для вошедшего — по анонимному device-id
 * удалять чужое по подсказке клиента нельзя.
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

  try {
    const [user, events, state, personalization, learning, lms, providers] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          username: true,
          birthYear: true,
          email: true,
          image: true,
          createdAt: true,
        },
      }),
      prisma.event.findMany({
        where: { userId },
        orderBy: { at: "asc" },
        select: { actionId: true, type: true, category: true, xp: true, at: true },
      }),
      prisma.userState.findUnique({
        where: { userId },
        select: { data: true, clientAt: true, updatedAt: true },
      }),
      prisma.personalizationProfile.findUnique({ where: { userId }, select: { data: true, updatedAt: true } }),
      prisma.learningProfile.findUnique({ where: { userId }, select: { data: true, updatedAt: true } }),
      prisma.lmsConnection.findUnique({ where: { userId }, select: { lastSyncedAt: true, lastError: true, timezone: true } }),
      prisma.account.findMany({ where: { userId }, select: { provider: true, providerAccountId: true } }),
    ]);

    const [communityProfile, memberships, posts, attendance, reports, chat, chatHistory, challenge30] = await Promise.all([
      prisma.communityProfile.findUnique({ where: { userId } }),
      prisma.studyMember.findMany({ where: { userId }, select: { teamId: true, joinedAt: true, team: { select: { name: true, subject: true } } } }),
      prisma.studyPost.findMany({ where: { userId }, select: { id: true, teamId: true, parentId: true, roomId: true, text: true, kind: true, ai: true, createdAt: true } }),
      prisma.studyAttendance.findMany({ where: { userId } }),
      prisma.communityReport.findMany({ where: { userId } }),
      prisma.aiChat.findUnique({ where: { userId }, select: { messages: true, updatedAt: true } }),
      prisma.aiChatArchive.findMany({ where: { userId }, select: { id: true, title: true, messages: true, savedAt: true } }),
      prisma.challenge30.findUnique({ where: { userId }, select: { data: true, updatedAt: true } }),
    ]);
    const payload = {
      exportedAt: new Date().toISOString(),
      account: user,
      progress: state?.data ?? null,
      progressUpdatedAt: state?.clientAt ?? null,
      personalization, learning, lms, providers,
      community: { profile: communityProfile, memberships, posts, attendance, reports },
      chat, chatHistory, challenge30,
      events,
      eventCount: events.length,
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="yeahgrind-export.json"`,
      },
    });
  } catch (e) {
    console.error("account export failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // всё связанное уходит каскадом: события, снимок, сессии, подписки
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("account delete failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
