/**
 * Вход в админку по логину и паролю — вторая дверь рядом с входом по
 * владельческому аккаунту (OWNER_EMAIL).
 *
 * Зачем вторая: владелец не всегда за своим телефоном, а консоль иногда
 * нужна с чужого компьютера, куда не хочется вводить личный аккаунт со
 * всеми задачами. Поэтому здесь отдельная короткая сессия ровно на
 * консоль: она ничего не знает про пользователя приложения и живёт 12
 * часов.
 *
 * Пароль лежит в переменных окружения, а НЕ в коде: пароль в репозитории
 * — это пароль, который знает каждый, кто видел исходники. Пока переменные
 * не заданы, работают запасные admin/admin, и консоль об этом громко
 * говорит: так можно зайти сразу, но нельзя забыть.
 *
 * Кука подписана AUTH_SECRET (HMAC) — подделать её, не зная секрета,
 * нельзя, а хранить сессии в базе ради одной двери незачем.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "yg-admin";
const TTL_MS = 12 * 3600_000;

const DEFAULT_USER = "admin";
const DEFAULT_PASSWORD = "admin";

function secret(): string {
  // AUTH_SECRET обязателен для Auth.js, так что он всегда есть; запасная
  // строка нужна только чтобы модуль не падал в странной среде.
  return process.env.AUTH_SECRET ?? "yeahgrind-dev-secret";
}

/** Заданы ли свои логин и пароль, или всё ещё работают admin/admin. */
export function adminCredentialsAreDefault(): boolean {
  return !process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD;
}

/** Сравнение без утечки времени: длина скрыта хешированием. */
function sameSecret(a: string, b: string): boolean {
  const ha = createHmac("sha256", secret()).update(a).digest();
  const hb = createHmac("sha256", secret()).update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function credentialsValid(username: string, password: string): boolean {
  const user = process.env.ADMIN_USER || DEFAULT_USER;
  const pass = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
  return sameSecret(username.trim(), user) && sameSecret(password, pass);
}

function sign(expiresAt: number): string {
  return createHmac("sha256", secret()).update(`admin:${expiresAt}`).digest("base64url");
}

/** Значение куки: срок жизни плюс подпись. */
export function issueToken(now = Date.now()): { value: string; maxAgeSec: number } {
  const expiresAt = now + TTL_MS;
  return { value: `${expiresAt}.${sign(expiresAt)}`, maxAgeSec: Math.floor(TTL_MS / 1000) };
}

export function tokenValid(token: string | undefined, now = Date.now()): boolean {
  if (!token) return false;
  const [rawExp, signature] = token.split(".");
  const expiresAt = Number(rawExp);
  if (!Number.isFinite(expiresAt) || expiresAt < now) return false;
  const expected = sign(expiresAt);
  if (!signature || signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

/** Есть ли у запроса живая админская кука. */
export async function hasAdminSession(): Promise<boolean> {
  try {
    const jar = await cookies();
    return tokenValid(jar.get(ADMIN_COOKIE)?.value);
  } catch {
    return false;
  }
}
