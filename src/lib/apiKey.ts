/**
 * Авторизация внешних сервисов (StudyLoop и следующие) через отдельные
 * отзываемые ключи вместо общего ASSISTANT_SECRET.
 *
 * Валидный ключ сам по себе не даёт доступа к произвольному userId —
 * см. userAllowedForKey(): сервис действует только от имени тех
 * пользователей, что прошли обмен пейринг-кода (/api/keys/redeem).
 */

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export interface AuthorizedKey {
  id: string;
  service: string;
}

/** Разбирает `Authorization: Bearer <key>` и ищет совпадение среди активных ключей. */
export async function authorizeServiceKey(req: Request): Promise<AuthorizedKey | null> {
  const header = req.headers.get("authorization") ?? "";
  const raw = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!raw) return null;

  // Активных ключей ожидается единицы — перебор с bcrypt.compare стоит
  // не дороже обычного логина и не требует индекса по сырому значению
  // (которое мы намеренно нигде не храним).
  const keys = await prisma.apiKey.findMany({ where: { revokedAt: null } });
  for (const k of keys) {
    if (await bcrypt.compare(raw, k.hash)) {
      await prisma.apiKey
        .update({ where: { id: k.id }, data: { lastUsedAt: new Date() } })
        .catch(() => {});
      return { id: k.id, service: k.service };
    }
  }
  return null;
}

/** Прошёл ли этот userId обмен пейринг-кода для конкретного ключа. */
export async function userAllowedForKey(apiKeyId: string, userId: string): Promise<boolean> {
  const row = await prisma.apiKeyUser.findUnique({
    where: { apiKeyId_userId: { apiKeyId, userId } },
  });
  return !!row;
}
