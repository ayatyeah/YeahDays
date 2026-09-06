/**
 * /api/state — кросс-девайс синхронизация клиентского состояния.
 *
 * GET  ?userId=…   → { data, updatedAt } — снимок пользователя (или null).
 *      &since=<ms> → если на сервере не свежее since, отвечаем
 *                  { unchanged: true } одним лёгким запросом без блоба —
 *                  так фоновый опрос почти ничего не стоит ни базе, ни сети.
 * PUT  { userId, data } → сохранить снимок. Разрешение конфликтов —
 *                  last-write-wins по data.updatedAt (время изменения
 *                  на клиенте). Если на сервере уже свежее — не затираем,
 *                  а возвращаем серверный снимок (клиент его примет).
 *
 * userId: у вошедшего — из сессии (нельзя подделать); иначе device-id из тела.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { upsertUserStateIfNewer } from "@/lib/userState";
import { mergeServerTodos } from "@/lib/mergeServerTodos";

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
    throw new Error("AUTH_UNAVAILABLE");
  }
  if (session?.user?.id) return session.user.id;
  return typeof fallback === "string" ? fallback.slice(0, 64) : "";
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

  const since = Number(url.searchParams.get("since") ?? 0);

  try {
    if (Number.isFinite(since) && since > 0) {
      // Условие прямо в SQL: при «ничего нового» база не читает и не
      // отдаёт 30-килобайтный jsonb, а мы не гоняем его по сети.
      const rows = await prisma.$queryRaw<{ data: unknown; clientAt: Date }[]>`
        SELECT "data", "clientAt" FROM "UserState"
        WHERE "userId" = ${userId} AND "clientAt" > ${new Date(since)}
        LIMIT 1
      `;
      if (rows.length === 0) return NextResponse.json({ unchanged: true, updatedAt: since });
      return NextResponse.json({ data: rows[0].data, updatedAt: rows[0].clientAt.getTime() });
    }

    const row = await prisma.userState.findUnique({ where: { userId } });
    if (!row) return NextResponse.json({ data: null, updatedAt: null });
    return NextResponse.json({
      data: row.data,
      updatedAt: row.clientAt.getTime(),
    });
  } catch (e) {
    console.error("state GET failed:", e);
    return NextResponse.json({ data: null, updatedAt: null });
  }
}

export async function PUT(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
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

  const data = body.data;
  const clientAt =
    data && typeof data === "object"
      ? Number((data as Record<string, unknown>).updatedAt)
      : NaN;
  if (!data || typeof data !== "object" || !Number.isFinite(clientAt)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    // Возвращаем в снимок серверные задачи, которых клиент не мог видеть
    // (созданы позже его updatedAt) — иначе дедлайны из /api/cron/lms-sync
    // и импортированное скриптами исчезают при первом же push из браузера.
    // См. src/lib/mergeServerTodos.ts.
    const existing = await prisma.userState.findUnique({
      where: { userId },
      select: { data: true, clientAt: true },
    });
    // Сервер уже свежее — отвечаем его снимком сразу, без записи и без
    // слияния: экономит поход в базу в самом частом случае гонки.
    if (existing && existing.clientAt.getTime() > clientAt) {
      return NextResponse.json({
        ok: true,
        applied: false,
        data: existing.data,
        updatedAt: existing.clientAt.getTime(),
      });
    }
    const merged = mergeServerTodos(data, existing?.data, clientAt);
    if (merged.restored > 0) {
      console.log(`state PUT: вернули ${merged.restored} серверных задач для ${userId}`);
    }

    const result = await upsertUserStateIfNewer(userId, merged.data, clientAt);
    if (!result.applied) {
      // На сервере уже не старше — не затираем, отдаём серверный снимок.
      return NextResponse.json({
        ok: true,
        applied: false,
        data: result.data,
        updatedAt: result.clientAt,
      });
    }
    return NextResponse.json({ ok: true, applied: true });
  } catch (e) {
    console.error("state PUT failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
