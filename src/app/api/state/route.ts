/** State protocol 2: server revisions and three-way per-task merges. */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { resolveAnonymousUserId } from "@/lib/anonymousUser";
import { mergeUserState } from "@/lib/userState";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * auth() дёргает jwt()-колбэк (см. auth.ts), а тот на КАЖДЫЙ вызов ходит в
 * базу — проверяет бан. Это отдельный от userState-чтения запрос, и раньше
 * он падал вне try/catch: любая заминка там роняла весь GET/PUT необработанным
 * исключением (500 без тела), а не мягким ответом — StateSync видел !res.ok
 * и красный «Нет связи с сервером» на каждом поллинге, без шанса отвалиться
 * тихо и попробовать через 5 секунд снова.
 */
async function resolveUserId(fallback?: unknown): Promise<string> {
  let session;
  try {
    session = await auth();
  } catch (e) {
    console.error("state: auth() failed:", e);
    throw new Error("AUTH_UNAVAILABLE", { cause: e });
  }
  if (session?.user?.id) return session.user.id;
  return resolveAnonymousUserId(fallback);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  let userId: string;
  try {
    userId = await resolveUserId(url.searchParams.get("userId"));
  } catch {
    return NextResponse.json({ error: "Auth temporarily unavailable" }, { status: 503 });
  }
  if (!userId) return NextResponse.json({ data: null, updatedAt: null });

  try {
    const row = await prisma.userState.findUnique({ where: { userId } });
    if (!row) return NextResponse.json({ data: null, revision: 0 });
    if (url.searchParams.get("revision") === String(row.revision))
      return NextResponse.json({ unchanged: true, revision: row.revision });
    return NextResponse.json({ data: row.data, revision: row.revision });
  } catch (e) {
    console.error("state GET failed:", e);
    return NextResponse.json({ error: "State temporarily unavailable" }, { status: 503 });
  }
}

export async function PUT(req: Request) {
  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 2_000_000) return NextResponse.json({ error: "State too large" }, { status: 413 });
    body = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let userId: string;
  try {
    userId = await resolveUserId(body.userId);
  } catch {
    return NextResponse.json({ error: "Auth temporarily unavailable" }, { status: 503 });
  }
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  if (body.protocol !== 2) return NextResponse.json({ error: "Обнови приложение для безопасной синхронизации" }, { status: 409 });
  const data = body.data;
  const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
  if (!record(data) || !Number.isFinite(data.updatedAt) ||
      !(body.base === null || record(body.base)) ||
      !Number.isSafeInteger(body.baseRevision) || Number(body.baseRevision) < 0 ||
      JSON.stringify(body).length > 2_000_000 ||
      !["todos", "plan", "customActions", "quests", "challenges"].every(k =>
        Array.isArray(data[k]) && (data[k] as unknown[]).every(v => record(v) && typeof v.id === "string"))) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }
  try {
    const result = await mergeUserState(userId, body.base as Record<string, unknown> | null, data);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("state PUT failed:", e);
    return NextResponse.json({ error: "State temporarily unavailable" }, { status: 503 });
  }
}
