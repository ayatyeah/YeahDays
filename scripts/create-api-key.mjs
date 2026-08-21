/**
 * Выпустить новый scoped API-ключ для внешнего сервиса.
 *
 * Использование: node scripts/create-api-key.mjs studyloop [redirect_uri...]
 *
 * redirect_uri (можно несколько) — куда /oauth/authorize разрешит
 * возвращать браузер после согласия («Войти через YeahGrind»). Без них
 * ключ всё равно работает для /api/integrations/* и self-service пейринга
 * из профиля (PairingCodeCard) — просто OAuth-редирект будет недоступен,
 * пока redirectUris не заполнены (можно дополнить через Prisma Studio,
 * npm run db:studio, отдельного скрипта на обновление пока нет).
 *
 * Печатает СЫРОЙ ключ ровно один раз — в БД хранится только его bcrypt-хэш
 * (src/lib/apiKey.ts). Ключ передаётся сервису вне репозитория (не в .env,
 * не в git) — если потерялся, отзови (revokedAt) и выпусти новый.
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const [service, ...redirectUris] = process.argv.slice(2);
if (!service) {
  console.error("Использование: node scripts/create-api-key.mjs <service> [redirect_uri...]");
  process.exit(1);
}

const prisma = new PrismaClient();

const raw = `yg_${service}_${randomUUID().replace(/-/g, "")}${randomUUID().replace(/-/g, "")}`;
const hash = await bcrypt.hash(raw, 12);

try {
  const key = await prisma.apiKey.create({ data: { service, hash, redirectUris } });
  console.log(`Ключ для "${service}" создан (id: ${key.id}).`);
  if (redirectUris.length > 0) {
    console.log(`redirect_uri: ${redirectUris.join(", ")}`);
  } else {
    console.log("redirect_uri не задан — /oauth/authorize для этого ключа не заработает,");
    console.log("пока не добавишь хотя бы один (Prisma Studio: npm run db:studio).");
  }
  console.log("\nСырой ключ (сохрани сейчас — больше нигде не показывается):\n");
  console.log(raw);
  console.log(`\nЗаголовок для вызовов: Authorization: Bearer ${raw}`);
  console.log(`client_id для /oauth/authorize: ${key.id}`);
} finally {
  await prisma.$disconnect();
}
