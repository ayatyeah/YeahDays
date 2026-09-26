import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { decryptLmsUrl, encryptLmsUrl, validateLmsUrl, validateLmsTimezone } from "@/lib/lmsConnection";
import { fetchLmsCalendar } from "@/lib/lmsClient";
import { syncLmsCalendar } from "@/lib/lmsSync";
import { rateLimit } from "@/lib/rateLimit";
import { LMS_PROVIDER } from "@/lib/lmsAccount";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const id = (await auth())?.user?.id;
  if (!id) return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  const [connection, account] = await Promise.all([
    prisma.lmsConnection.findUnique({ where: { userId: id }, select: { encryptedUrl: true, lastSyncedAt: true, lastError: true, timezone: true } }),
    prisma.account.findFirst({ where: { userId: id, provider: LMS_PROVIDER }, select: { id: true } }),
  ]);
  return NextResponse.json({ linked: !!account, connected: !!connection?.encryptedUrl,
    lastSyncedAt: connection?.lastSyncedAt ?? null, lastError: connection?.lastError ?? null,
    timezone: connection?.timezone ?? "Asia/Almaty",
  });
}

export async function POST() {
  const id = (await auth())?.user?.id;
  if (!id) return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  if (!rateLimit(`lms:sync:${id}`, 3, 60_000)) return NextResponse.json({ error: "Подожди минуту перед обновлением" }, { status: 429 });
  const connection = await prisma.lmsConnection.findUnique({ where: { userId: id } });
  if (!connection?.encryptedUrl) return NextResponse.json({ error: "Календарь не подключён. Добавь личную ссылку календаря в настройках LMS." }, { status: 409 });
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

/** The export URL delegates calendar access, never identity or account sign-in. */
export async function PUT(req: Request) {
  const id = (await auth())?.user?.id;
  if (!id) return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  if (!rateLimit(`lms:connect:${id}`, 5, 60_000)) return NextResponse.json({ error: "Подожди минуту перед повторной попыткой" }, { status: 429 });
  let url: string;
  let timezone: string;
  try {
    const body = await req.json();
    url = validateLmsUrl(body?.url);
    timezone = validateLmsTimezone(body?.timezone);
  } catch {
    return NextResponse.json({ error: "Вставь ссылку Get calendar URL из календаря LMS AITU" }, { status: 400 });
  }
  try { await fetchLmsCalendar(url); }
  catch { return NextResponse.json({ error: "LMS не отдала календарь. Проверь ссылку экспорта или попробуй позже." }, { status: 502 }); }
  try {
    const encryptedUrl = encryptLmsUrl(url);
    await prisma.lmsConnection.upsert({ where: { userId: id },
      create: { userId: id, encryptedUrl, timezone },
      update: { encryptedUrl, timezone, lastSyncedAt: null, lastError: null },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить подключение. Попробуй позже." }, { status: 503 });
  }
}

/** Stops background calendar access; preserves the LMS sign-in identity and existing tasks. */
export async function DELETE() {
  const id = (await auth())?.user?.id;
  if (!id) return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  // Keep an empty marker so an owner's old env-based calendar does not resume.
  await prisma.lmsConnection.upsert({ where: { userId: id },
    create: { userId: id, encryptedUrl: "" },
    update: { encryptedUrl: "", lastSyncedAt: null, lastError: null },
  });
  return NextResponse.json({ ok: true });
}
