import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { decryptLmsUrl } from "@/lib/lmsConnection";
import { syncLmsCalendar } from "@/lib/lmsSync";
import { rateLimit } from "@/lib/rateLimit";
import { LMS_PROVIDER } from "@/lib/lmsAccount";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const id = (await auth())?.user?.id;
  if (!id) return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  const [connection, account] = await Promise.all([
    prisma.lmsConnection.findUnique({ where: { userId: id }, select: { lastSyncedAt: true, lastError: true, timezone: true } }),
    prisma.account.findFirst({ where: { userId: id, provider: LMS_PROVIDER }, select: { id: true } }),
  ]);
  return NextResponse.json({ linked: !!account, connected: !!connection, ...connection });
}

export async function POST() {
  const id = (await auth())?.user?.id;
  if (!id) return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  if (!rateLimit(`lms:sync:${id}`, 3, 60_000)) return NextResponse.json({ error: "Подожди минуту перед обновлением" }, { status: 429 });
  const connection = await prisma.lmsConnection.findUnique({ where: { userId: id } });
  if (!connection) return NextResponse.json({ error: "Календарь не подключён. Повтори вход через LMS в настройках." }, { status: 409 });
  try {
    const result = await syncLmsCalendar(id, decryptLmsUrl(connection.encryptedUrl), connection.timezone);
    await prisma.lmsConnection.updateMany({ where: { userId: id, encryptedUrl: connection.encryptedUrl }, data: { lastSyncedAt: new Date(), lastError: null } });
    return NextResponse.json(result);
  } catch {
    const error = "Не удалось обновить календарь LMS. Попробуй позже или подключи его повторно.";
    await prisma.lmsConnection.updateMany({ where: { userId: id, encryptedUrl: connection.encryptedUrl }, data: { lastError: error } });
    return NextResponse.json({ error }, { status: 502 });
  }
}

/** Stops background calendar access; preserves the LMS sign-in identity and existing tasks. */
export async function DELETE() {
  const id = (await auth())?.user?.id;
  if (!id) return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  await prisma.lmsConnection.deleteMany({ where: { userId: id } });
  return NextResponse.json({ ok: true });
}
