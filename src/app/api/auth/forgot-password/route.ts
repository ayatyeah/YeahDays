/**
 * POST /api/auth/forgot-password — публичная, без авторизации. Сайт не
 * шлёт email/SMS, поэтому это не автосброс: заявка складывается в очередь
 * (PasswordResetRequest), которую владелец разбирает вручную в /admin —
 * связывается через telegram и меняет пароль там же.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CURRENT_YEAR = new Date().getFullYear();

export async function POST(req: Request) {
  if (!rateLimit(`forgot-password:ip:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Слишком много попыток, попробуй позже" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { email, phone, birthYear, telegram } = (body ?? {}) as Record<string, unknown>;

  const emailStr = String(email ?? "").trim().toLowerCase();
  const phoneStr = String(phone ?? "").trim();
  const telegramStr = String(telegram ?? "").trim();
  const birthYearNum = Number(birthYear);

  if (!EMAIL_RE.test(emailStr)) {
    return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
  }
  if (phoneStr.length < 5) {
    return NextResponse.json({ error: "Укажи номер телефона" }, { status: 400 });
  }
  if (!Number.isInteger(birthYearNum) || birthYearNum < 1900 || birthYearNum > CURRENT_YEAR) {
    return NextResponse.json({ error: "Некорректный год рождения" }, { status: 400 });
  }
  if (!telegramStr) {
    return NextResponse.json({ error: "Укажи telegram для связи" }, { status: 400 });
  }

  try {
    await prisma.passwordResetRequest.create({
      data: { email: emailStr, phone: phoneStr, birthYear: birthYearNum, telegram: telegramStr },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("forgot-password failed:", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
