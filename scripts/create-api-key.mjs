/**
 * Выпустить новый scoped API-ключ для внешнего сервиса.
 *
 * Использование: node scripts/create-api-key.mjs studyloop
 *
 * Печатает СЫРОЙ ключ ровно один раз — в БД хранится только его bcrypt-хэш
 * (src/lib/apiKey.ts). Ключ передаётся сервису вне репозитория (не в .env,
 * не в git) — если потерялся, отзови (revokedAt) и выпусти новый.
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const service = process.argv[2];
if (!service) {
  console.error("Использование: node scripts/create-api-key.mjs <service>");
  process.exit(1);
}

const prisma = new PrismaClient();

const raw = `yg_${service}_${randomUUID().replace(/-/g, "")}${randomUUID().replace(/-/g, "")}`;
const hash = await bcrypt.hash(raw, 12);

try {
  const key = await prisma.apiKey.create({ data: { service, hash } });
  console.log(`Ключ для "${service}" создан (id: ${key.id}).`);
  console.log("Сырой ключ (сохрани сейчас — больше нигде не показывается):\n");
  console.log(raw);
  console.log(`\nЗаголовок для вызовов: Authorization: Bearer ${raw}`);
} finally {
  await prisma.$disconnect();
}
