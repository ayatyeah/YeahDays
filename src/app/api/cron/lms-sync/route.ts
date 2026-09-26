import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptLmsUrl } from "@/lib/lmsConnection";
import { syncLmsCalendar } from "@/lib/lmsSync";
import { DEFAULT_ZONE } from "@/lib/lmsCalendar";
import { LMS_PROVIDER } from "@/lib/lmsAccount";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Every connection is isolated; a broken token must not block the other students. */
export async function POST(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dry = new URL(req.url).searchParams.get("dry") === "1";
  const connections = await prisma.lmsConnection.findMany({ where: { user: { banned: false } } });
  const results: { userId: string; ok: boolean; created?: number; error?: string }[] = [];
  for (const connection of connections) {
    try {
      const result = await syncLmsCalendar(connection.userId, decryptLmsUrl(connection.encryptedUrl), connection.timezone, dry);
      if (!dry) await prisma.lmsConnection.updateMany({ where: { userId: connection.userId, encryptedUrl: connection.encryptedUrl }, data: { lastSyncedAt: new Date(), lastError: null } });
      results.push({ userId: connection.userId, ...result });
    } catch {
      const error = "Не удалось обновить календарь LMS. Подключи его повторно в настройках.";
      if (!dry) await prisma.lmsConnection.updateMany({ where: { userId: connection.userId, encryptedUrl: connection.encryptedUrl }, data: { lastError: error } });
      results.push({ userId: connection.userId, ok: false, error });
    }
  }
  // Preserve the owner's existing env-based connection until they link their LMS account.
  const legacyId = process.env.LMS_SYNC_USER_ID;
  if (legacyId && process.env.LMS_ICAL_URL && !connections.some((c) => c.userId === legacyId)) {
    const owner = await prisma.user.findUnique({ where: { id: legacyId }, select: {
      banned: true, accounts: { where: { provider: LMS_PROVIDER }, select: { id: true }, take: 1 },
    } });
    if (owner && !owner.banned && owner.accounts.length === 0) {
      try { results.push({ userId: legacyId, ...await syncLmsCalendar(legacyId, process.env.LMS_ICAL_URL, process.env.LMS_TIMEZONE || DEFAULT_ZONE, dry) }); }
      catch { results.push({ userId: legacyId, ok: false, error: "Legacy LMS sync failed" }); }
    }
  }
  return NextResponse.json({ ok: results.every((r) => r.ok), dry, users: results.length, results });
}
