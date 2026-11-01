/** Import guest progress before transferring events/subscriptions. A failed
 * response is retryable; account data is merged rather than overwritten. */
import { NextResponse } from "next/server";
import { mergeUserState as mergeState } from "@/lib/userState";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Import new guest records without replacing existing account progress. */
async function mergeUserState(deviceId: string, accountId: string) {
  const deviceState = await prisma.userState.findUnique({ where: { userId: deviceId } });
  if (!deviceState) return;
  await mergeState(accountId, null, deviceState.data as Record<string, unknown>);
  // Delete only the exact snapshot transferred; a concurrent guest edit survives.
  await prisma.userState.deleteMany({ where: { userId: deviceId, revision: deviceState.revision } });
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
      select: { email: true, username: true, passwordHash: true, accounts: { select: { id: true }, take: 1 } },
    });
    // переносим только с анонимного пользователя (без аккаунта)
    if (!device || device.email || device.username || device.passwordHash || device.accounts.length) {
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
    // Keep the anonymous identity: a request already in flight may still be
    // writing to it. Deleting it here could cascade-delete untransferred data.
    return NextResponse.json({ ok: true, moved: moved.count });
  } catch (e) {
    console.error("link failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
