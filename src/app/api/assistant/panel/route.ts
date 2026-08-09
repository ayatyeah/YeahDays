/**
 * /api/assistant/panel — то, что видит браузер (не ДиДи). Авторизация как
 * у /api/state: сессия или device-id, НЕ ASSISTANT_SECRET — тот секрет не
 * должен попадать в клиентский код, иначе любой мог бы дёргать /api/assistant
 * от имени ДиДи.
 *
 * GET  ?userId=   → { enabled, online, lastSeenAt, events }
 * POST { userId, enabled } → переключить "слушает/на паузе"
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Без heartbeat дольше этого — считаем процесс потушенным, а не просто между опросами. */
const ONLINE_WINDOW_MS = 40_000;

async function resolveUserId(fallback?: unknown): Promise<string> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return typeof fallback === "string" ? fallback.slice(0, 64) : "";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = await resolveUserId(url.searchParams.get("userId"));
  if (!userId) {
    return NextResponse.json({ enabled: true, online: false, lastSeenAt: null, events: [] });
  }

  const [status, events] = await Promise.all([
    prisma.assistantStatus.findUnique({ where: { userId } }),
    prisma.assistantEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  const online = !!status?.lastSeenAt && Date.now() - status.lastSeenAt.getTime() < ONLINE_WINDOW_MS;

  return NextResponse.json({
    enabled: status?.enabled ?? true,
    online,
    lastSeenAt: status?.lastSeenAt?.getTime() ?? null,
    events: events.map((e) => ({ id: e.id, kind: e.kind, text: e.text, at: e.createdAt.getTime() })),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const userId = await resolveUserId(body.userId);
  if (!userId || typeof body.enabled !== "boolean") {
    return NextResponse.json({ error: "userId and enabled required" }, { status: 400 });
  }

  await prisma.user.upsert({ where: { id: userId }, create: { id: userId }, update: {} });
  await prisma.assistantStatus.upsert({
    where: { userId },
    create: { userId, enabled: body.enabled },
    update: { enabled: body.enabled },
  });

  return NextResponse.json({ ok: true });
}
