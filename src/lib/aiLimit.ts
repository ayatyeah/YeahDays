/**
 * Суточные лимиты ИИ, которые переживают деплой.
 *
 * lib/rateLimit держит счётчики в памяти процесса: для минутных лимитов это
 * нормально, а суточные обнулялись при каждой выкатке — и вместе с ними
 * потолок расходов OpenAI. Здесь счётчик лежит в Postgres (AiLimit): ключ и
 * сутки по UTC, как у учёта расхода в lib/aiUsage.
 *
 * Если базы нет или таблица ещё не создана — работаем по памяти, как раньше:
 * лучше пустить человека, чем уронить ответ из-за счётчика.
 */

import { rateLimit } from "@/lib/rateLimit";

const DAY = 86_400_000;

/** Ровно то, что нужно от Prisma: поднять счётчик и подчистить старые сутки. */
export interface LimitDb {
  aiLimit: {
    upsert(args: {
      where: { key_day: { key: string; day: string } };
      create: { key: string; day: string; count: number };
      update: { count: { increment: number } };
      select: { count: true };
    }): Promise<{ count: number }>;
    deleteMany(args: { where: { day: { lt: string } } }): Promise<unknown>;
  };
}

const utcDay = (at: Date) => at.toISOString().slice(0, 10);

/** Суточный лимит на конкретной базе — отдельно, чтобы проверить без Postgres. */
export async function dailyLimitWith(db: LimitDb, key: string, limit: number, now = new Date()): Promise<boolean> {
  const day = utcDay(now);
  try {
    const row = await db.aiLimit.upsert({
      where: { key_day: { key, day } },
      create: { key, day, count: 1 },
      update: { count: { increment: 1 } },
      select: { count: true },
    });
    // Изредка убираем позавчерашние и более старые сутки: таблица не растёт.
    if (Math.random() < 0.02) void db.aiLimit.deleteMany({ where: { day: { lt: utcDay(new Date(now.getTime() - DAY)) } } }).catch(() => {});
    return row.count <= limit;
  } catch {
    return rateLimit(key, limit, DAY);
  }
}

/** true — запрос в пределах суточного лимита (по аккаунту или общего). */
export async function dailyLimit(key: string, limit: number): Promise<boolean> {
  // В тестах базы нет, а .env разработчика может смотреть в боевую.
  if (process.env.NODE_ENV === "test") return rateLimit(key, limit, DAY);
  try {
    const { prisma } = await import("@/lib/db");
    return await dailyLimitWith(prisma as unknown as LimitDb, key, limit);
  } catch {
    return rateLimit(key, limit, DAY);
  }
}
