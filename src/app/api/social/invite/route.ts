/**
 * /api/social/invite — постоянная ссылка-приглашение в друзья.
 *
 * GET  → { code } — свой код ссылки; создаётся при первом запросе.
 * POST → { code } — выпустить новый: старая ссылка перестаёт работать
 *        (если её переслали не тому человеку).
 *
 * Принимается ссылка через POST /api/social { invite }, а открывается
 * страницей /invite/<code>. Одноразовый код из /api/keys/pair остался для
 * диктовки голосом, но делиться им в чате неудобно: живёт 10 минут и гасится
 * первым же вводом.
 */

import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Без похожих друг на друга 0/O и 1/I/L — код могут и продиктовать. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function newCode(): string {
  const bytes = randomBytes(10);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

async function me(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

async function issue(userId: string, rotate: boolean): Promise<string> {
  if (!rotate) {
    const row = await prisma.publicStats.findUnique({
      where: { userId },
      select: { inviteCode: true },
    });
    if (row?.inviteCode) return row.inviteCode;
  }
  // коллизия на 31^10 почти невозможна, но уникальный индекс всё равно
  // может отказать — пробуем ещё раз с другим кодом
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newCode();
    try {
      await prisma.publicStats.upsert({
        where: { userId },
        create: { userId, inviteCode: code },
        update: { inviteCode: code },
      });
      return code;
    } catch (e) {
      if ((e as { code?: string }).code !== "P2002") throw e;
    }
  }
  throw new Error("invite code collision");
}

export async function GET() {
  const userId = await me();
  if (!userId) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  try {
    return NextResponse.json({ code: await issue(userId, false) });
  } catch (e) {
    console.error("invite GET failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST() {
  const userId = await me();
  if (!userId) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  try {
    return NextResponse.json({ code: await issue(userId, true) });
  } catch (e) {
    console.error("invite POST failed:", e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
