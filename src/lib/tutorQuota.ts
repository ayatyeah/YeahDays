/** App budgets, not Gemini's project/model quotas. Never multiply by API-key count. */
export const TUTOR_USER_DAILY_LIMIT = 120;
export const TUTOR_GLOBAL_DAILY_LIMIT = 4000;
export type DailyQuota = { limit: number; used: number; remaining: number; resetsAt: string };
export type TutorQuota = { personal: DailyQuota; shared: DailyQuota };
type QuotaDb = { aiLimit: { findMany(args: { where: { day: string; key: { in: string[] } }; select: { key: true; count: true } }): Promise<{ key: string; count: number }[]> } };

export async function tutorQuotaWith(db: QuotaDb, userId: string, now = new Date()): Promise<TutorQuota | null> {
  const day = now.toISOString().slice(0, 10);
  const resetsAt = new Date(Date.parse(`${day}T00:00:00Z`) + 86_400_000).toISOString();
  try {
    const rows = await db.aiLimit.findMany({ where: { day, key: { in: [`tutor-day:${userId}`, "tutor:global"] } }, select: { key: true, count: true } });
    const budget = (key: string, limit: number): DailyQuota => {
      const used = Math.max(0, rows.find(row => row.key === key)?.count ?? 0);
      return { limit, used, remaining: Math.max(0, limit - used), resetsAt };
    };
    return { personal: budget(`tutor-day:${userId}`, TUTOR_USER_DAILY_LIMIT), shared: budget("tutor:global", TUTOR_GLOBAL_DAILY_LIMIT) };
  } catch { return null; } // Missing storage is unknown, never a fresh allowance.
}

export async function tutorQuota(userId: string): Promise<TutorQuota | null> {
  if (process.env.NODE_ENV === "test") return null;
  try {
    const { prisma } = await import("@/lib/db");
    return await tutorQuotaWith(prisma, userId);
  } catch { return null; }
}
