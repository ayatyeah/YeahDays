/**
 * POST /api/link  { deviceId }
 *
 * При входе переносит данные анонимного устройства на аккаунт, чтобы
 * прогресс не терялся. Идемпотентно; переносит только с реально
 * анонимного пользователя (без email/аккаунта).
 *
 * ВАЖНО: раньше переносился только Event (для аналитики/истории), а
 * UserState — единственное место, где реально живут задачи, расписание,
 * XP — нет. UserState висит на User с onDelete: Cascade, так что
 * следующее за этим prisma.user.delete() тихо УНИЧТОЖАЛО весь прогресс
 * анонимного устройства, ничего не перенеся на аккаунт. Порядок здесь
 * принципиален: сначала переносим состояние, потом уже удаляем строку User.
 */

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * У кого данные свежее — того и берём (тот же контракт LWW, что в
 * /api/state): свежий анонимный прогресс не должен затираться пустым
 * новым аккаунтом, а реальный прогресс аккаунта — затираться старым
 * анонимным слепком.
 */
async function mergeUserState(deviceId: string, accountId: string) {
  const [deviceState, accountState] = await Promise.all([
    prisma.userState.findUnique({ where: { userId: deviceId } }),
    prisma.userState.findUnique({ where: { userId: accountId } }),
  ]);
  if (!deviceState) return;

  const deviceIsNewer = !accountState || deviceState.clientAt > accountState.clientAt;
  if (deviceIsNewer) {
    await prisma.userState.upsert({
      where: { userId: accountId },
      create: {
        userId: accountId,
        data: deviceState.data as Prisma.InputJsonValue,
        clientAt: deviceState.clientAt,
      },
      update: {
        data: deviceState.data as Prisma.InputJsonValue,
        clientAt: deviceState.clientAt,
      },
    });
  }
  // строка анонимного устройства в любом случае больше не нужна —
  // либо уже перенесена, либо проиграла более свежему состоянию аккаунта
  await prisma.userState.delete({ where: { userId: deviceId } }).catch(() => {});
}

export async function POST(req: Request) {
  const session = await auth();
  const accountId = session?.user?.id;
  if (!accountId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { deviceId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const deviceId =
    typeof body.deviceId === "string" ? body.deviceId.slice(0, 64) : "";
  if (!deviceId || deviceId === accountId) {
    return NextResponse.json({ ok: true, moved: 0 });
  }

  try {
    const device = await prisma.user.findUnique({
      where: { id: deviceId },
      select: { email: true },
    });
    // переносим только с анонимного пользователя (без аккаунта)
    if (!device || device.email) {
      return NextResponse.json({ ok: true, moved: 0 });
    }

    await mergeUserState(deviceId, accountId);
    // push-подписки — простой перенос, у аккаунта их может быть несколько
    // (телефон + ноутбук), конфликтов по userId не возникает
    await prisma.pushSubscription.updateMany({
      where: { userId: deviceId },
      data: { userId: accountId },
    });
    const moved = await prisma.event.updateMany({
      where: { userId: deviceId },
      data: { userId: accountId },
    });
    await prisma.user.delete({ where: { id: deviceId } }).catch(() => {});
    return NextResponse.json({ ok: true, moved: moved.count });
  } catch (e) {
    console.error("link failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
