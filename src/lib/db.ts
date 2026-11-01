import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma-клиента. В dev Next пересоздаёт модули на каждый
 * hot-reload — без кэша в globalThis это плодило бы десятки коннектов
 * к Postgres и упиралось в лимит соединений.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Keep a small pool even when the container sees all host CPU cores.
const databaseUrl = process.env.DATABASE_URL;
const datasourceUrl = databaseUrl ? new URL(databaseUrl) : undefined;
if (datasourceUrl && !datasourceUrl.searchParams.has("connection_limit")) {
  datasourceUrl.searchParams.set("connection_limit", "5");
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasourceUrl: datasourceUrl.toString() } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Route bundles and instrumentation must share one pool in production too.
globalForPrisma.prisma = prisma;
