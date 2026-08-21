/**
 * /api/keys/pair — код для привязки аккаунта к внешнему сервису.
 *
 * POST { userId? } → { code, expiresAt }
 *
 * Пользователь (залогинен ИЛИ анонимное устройство) генерирует короткий
 * одноразовый код для СЕБЯ, вводит его в настройках стороннего сервиса —
 * тот сразу обменивает код на userId через /api/keys/redeem своим ApiKey.
 * Не SSO: ни редиректа, ни общего логина, только доказательство владения
 * аккаунтом в моменте. Живёт 10 минут, гасится после первого обмена
 * (см. /api/keys/redeem).
 */

import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTL_MS = 10 * 60_000;

async function resolveUserId(fallback?: unknown): Promise<string> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return typeof fallback === "string" ? fallback.slice(0, 64) : "";
}

function generateCode(): string {
  return randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const userId = await resolveUserId(body.userId);
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const ip = clientIp(req);
  if (!rateLimit(`pair:ip:${ip}`, 20, 15 * 60_000) || !rateLimit(`pair:uid:${userId}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    // Анонимное устройство может ещё не иметь строки User — код лежит на
    // FK, без апсерта первая же генерация кода упала бы.
    await prisma.user.upsert({ where: { id: userId }, create: { id: userId }, update: {} });

    // Непогашенный старый код того же пользователя больше не нужен —
    // один активный код за раз проще для UI и не даёт копиться мусору.
    await prisma.pairingCode.deleteMany({ where: { userId, consumedAt: null } });

    const expiresAt = new Date(Date.now() + TTL_MS);
    let code = generateCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        await prisma.pairingCode.create({ data: { code, userId, expiresAt } });
        return NextResponse.json({ code, expiresAt: expiresAt.getTime() });
      } catch {
        code = generateCode(); // коллизия по code (крайне маловероятно) — пробуем другой
      }
    }
    return NextResponse.json({ error: "Could not generate code" }, { status: 500 });
  } catch (e) {
    console.error("pair failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
