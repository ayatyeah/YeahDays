/**
 * Уведомления владельцу в Telegram — сейчас только о новых регистрациях.
 *
 * Нужны две переменные: TELEGRAM_BOT_TOKEN (бот от @BotFather) и
 * TELEGRAM_CHAT_ID (чат владельца с этим ботом). Без них — тишина: локально
 * и в тестах сообщения никуда не уходят.
 *
 * Отправка не должна мешать регистрации: ошибки глотаем, ждём не дольше
 * пяти секунд, а вызывающий код не ждёт вовсе (void notifyNewUser(...)).
 * Что уходит в Telegram — имя, почта или логин и способ входа — описано в
 * политике (раздел 4).
 */

import { prisma } from "@/lib/db";

export type SignupMethod = "password" | "google" | "microsoft-entra-id" | "lms-aitu";

const METHOD_LABEL: Record<SignupMethod, string> = {
  password: "логин и пароль",
  google: "Google",
  "microsoft-entra-id": "Microsoft AITU",
  "lms-aitu": "LMS AITU",
};

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function newUserMessage(
  user: { name?: string | null; email?: string | null; username?: string | null },
  method: string,
  total: number | null,
  base = process.env.AUTH_URL ?? "https://yeahgrind.site",
): string {
  const label = METHOD_LABEL[method as SignupMethod] ?? method;
  return [
    "🆕 <b>Новый пользователь YeahGrind</b>",
    `Имя: ${escape(user.name?.trim() || "—")}`,
    user.email ? `Почта: ${escape(user.email)}` : null,
    user.username ? `Логин: @${escape(user.username)}` : null,
    `Через: ${escape(label)}`,
    total !== null ? `Всего пользователей: ${total}` : null,
    `<a href="${escape(new URL("/admin", base).href)}">Открыть консоль</a>`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendToOwner(html: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("telegram: sendMessage", res.status);
    return res.ok;
  } catch (e) {
    console.error("telegram: sendMessage failed", e instanceof Error ? e.name : e);
    return false;
  }
}

export async function notifyNewUser(
  user: { name?: string | null; email?: string | null; username?: string | null },
  method: string,
): Promise<void> {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) return;
  const total = await prisma.user.count().catch(() => null);
  await sendToOwner(newUserMessage(user, method, total));
}
