/**
 * /api/auth/register — регистрация по email+паролю. Не логинит сама по
 * себе — клиент после успешного ответа вызывает signIn("credentials", ...)
 * тем же логином/паролем, чтобы получить сессию.
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const CURRENT_YEAR = new Date().getFullYear();

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { name, email, username, password, birthYear } = (body ?? {}) as Record<string, unknown>;

  const nameStr = String(name ?? "").trim();
  const emailStr = String(email ?? "")
    .trim()
    .toLowerCase();
  const usernameStr = String(username ?? "").trim();
  const passwordStr = String(password ?? "");
  const birthYearNum = Number(birthYear);

  if (!nameStr) {
    return NextResponse.json({ error: "Укажи имя" }, { status: 400 });
  }
  if (!EMAIL_RE.test(emailStr)) {
    return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
  }
  if (!USERNAME_RE.test(usernameStr)) {
    return NextResponse.json(
      { error: "Логин: 3-20 символов, латиница/цифры/подчёркивание" },
      { status: 400 },
    );
  }
  if (passwordStr.length < 8) {
    return NextResponse.json({ error: "Пароль — минимум 8 символов" }, { status: 400 });
  }
  if (!Number.isInteger(birthYearNum) || birthYearNum < 1900 || birthYearNum > CURRENT_YEAR) {
    return NextResponse.json({ error: "Некорректный год рождения" }, { status: 400 });
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: emailStr }, { username: usernameStr }] },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: "Email или логин уже заняты" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(passwordStr, 12);
    await prisma.user.create({
      data: {
        name: nameStr,
        email: emailStr,
        username: usernameStr,
        passwordHash,
        birthYear: birthYearNum,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("register failed:", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
