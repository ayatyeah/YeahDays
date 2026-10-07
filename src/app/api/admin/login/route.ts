/**
 * Вход и выход админки по логину и паролю.
 *
 * POST { username, password } → ставит подписанную куку на 12 часов.
 * DELETE                      → гасит её.
 *
 * Считаем ПРОВАЛЫ, а не попытки: подбор упирается в лимит, а свои входы
 * (в том числе повторные с одного адреса) не мешают сами себе. Ответ на
 * неверную пару всегда одинаковый и без подробностей — по тексту ошибки
 * не должно быть видно, угадан ли логин.
 */

import { NextResponse } from "next/server";
import { ADMIN_COOKIE, credentialsValid, issueToken } from "@/lib/adminSession";
import { clientIp, failureLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const username = String(body.username ?? "").slice(0, 64);
  const password = String(body.password ?? "").slice(0, 200);

  const gate = failureLimit(`admin:${clientIp(req)}`, 10, 15 * 60_000);
  if (!gate.allowed) {
    return NextResponse.json({ error: "Слишком много попыток, подожди 15 минут" }, { status: 429 });
  }

  if (!credentialsValid(username, password)) {
    gate.fail();
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  const token = issueToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token.value, {
    httpOnly: true,
    sameSite: "lax",
    // Secure — когда сайт на https, как у куки сессии Auth.js. Раньше флаг
    // зависел от NODE_ENV: боевая сборка на http://localhost (тесты) ставила
    // Secure-куку, WebKit её не сохранял, и консоль не пускала после входа.
    secure: process.env.AUTH_URL
      ? process.env.AUTH_URL.startsWith("https://")
      : process.env.NODE_ENV === "production",
    path: "/",
    maxAge: token.maxAgeSec,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
