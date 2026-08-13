/**
 * /api/assistant/login — вход по email/логину+паролю ИЗ ДЕСКТОП-ПРИЛОЖЕНИЯ
 * (SalemAI), не из браузера. Раньше единственным способом привязать
 * приложение к аккаунту было вручную скопировать userId со страницы
 * профиля сайта в настройки приложения — теперь можно просто "войти",
 * как на сайте, тем же логином/паролем.
 *
 * Не переиспользует next-auth напрямую: Credentials-провайдер в
 * src/auth.ts рассчитан на браузерный flow (CSRF-токен, cookie-сессия),
 * а тут нужен голый JSON {userId} для не-браузерного клиента. Логика
 * проверки — та же (bcrypt.compare по passwordHash), продублирована
 * намеренно, а не вынесена в общую функцию: два разных транспорта с
 * разными требованиями к ответу, шарить особо нечего.
 *
 * Авторизация запроса — тот же общий ASSISTANT_SECRET, что и у
 * остального /api/assistant/* (см. route.ts) — не путать с паролем
 * ПОЛЬЗОВАТЕЛЯ, который проверяется телом запроса.
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.ASSISTANT_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { identifier, password } = (body ?? {}) as Record<string, unknown>;
  const identifierStr = String(identifier ?? "").trim();
  const passwordStr = String(password ?? "");
  if (!identifierStr || !passwordStr) {
    return NextResponse.json({ error: "Укажи логин и пароль" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifierStr.toLowerCase() }, { username: identifierStr }] },
    select: { id: true, name: true, email: true, passwordHash: true, banned: true },
  });
  // google-only аккаунт (без пароля) и бан — тем же сообщением, что и неверный
  // пароль, чтобы не палить наружу, какие аккаунты существуют или забанены
  if (
    !user?.passwordHash ||
    user.banned ||
    !(await bcrypt.compare(passwordStr, user.passwordHash))
  ) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, userId: user.id, name: user.name, email: user.email });
}
