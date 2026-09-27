import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { decryptLmsUrl } from "@/lib/lmsConnection";
import { fetchLmsCalendar } from "@/lib/lmsClient";
import { parseEvents } from "@/lib/ical";
import { subjectsFromEvents } from "@/lib/learningSubjects";
import { LMS_PROVIDER } from "@/lib/lmsAccount";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const userId = (await auth())?.user?.id;
  if (!userId) return NextResponse.json({ error: "Войди в аккаунт" }, { status: 401 });
  if (!rateLimit(`learning:subjects:${userId}`, 5, 60_000)) return NextResponse.json({ error: "Подожди минуту перед обновлением предметов" }, { status: 429 });
  try {
    const connection = await prisma.lmsConnection.findUnique({ where: { userId } });
    let url = connection?.encryptedUrl ? decryptLmsUrl(connection.encryptedUrl) : undefined;
    if (!connection && process.env.LMS_SYNC_USER_ID === userId && process.env.LMS_ICAL_URL) {
      const account = await prisma.account.findFirst({ where: { userId, provider: LMS_PROVIDER }, select: { id: true } });
      if (!account) url = process.env.LMS_ICAL_URL;
    }
    if (!url) return NextResponse.json({ connected: false, subjects: [] });
    const events = parseEvents(await fetchLmsCalendar(url), connection?.timezone ?? "Asia/Almaty");
    return NextResponse.json({ connected: true, subjects: subjectsFromEvents(events) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Не удалось получить предметы из календаря LMS. Можно ввести предмет вручную или повторить загрузку." }, { status: 502 });
  }
}
