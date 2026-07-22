import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma-клиента. В dev Next пересоздаёт модули на каждый
 * hot-reload — без кэша в globalThis это плодило бы десятки коннектов
 * к Postgres и упиралось в лимит соединений.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
