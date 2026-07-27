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
    const [user, events, state] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
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
    ]);

    const payload = {
      exportedAt: new Date().toISOString(),
      account: user,
      progress: state?.data ?? null,
      progressUpdatedAt: state?.clientAt ?? null,
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
