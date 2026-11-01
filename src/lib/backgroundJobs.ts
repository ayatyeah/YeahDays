import { prisma } from "@/lib/db";
/** Persist outcomes, not payloads. Three consecutive failures are actionable. */
export async function recordJob(name: string, ok: boolean) {
  const now = new Date();
  const row = await prisma.backgroundJob.upsert({ where: { name },
    create: { name, lastRunAt: now, lastSuccessAt: ok ? now : null, lastFailureAt: ok ? null : now, consecutiveFailures: ok ? 0 : 1 },
    update: { lastRunAt: now, ...(ok ? { lastSuccessAt: now, consecutiveFailures: 0 } : { lastFailureAt: now, consecutiveFailures: { increment: 1 } }) },
  });
  if (row.consecutiveFailures >= 3) console.error(JSON.stringify({ event: "background_job_repeated_failure", job: name, failures: row.consecutiveFailures }));
}
export async function runTrackedJob<T extends { ok: boolean }>(name: string, run: () => Promise<T>): Promise<T> {
  try {
    const result = await run();
    await recordJob(name, result.ok);
    return result;
  } catch (error) {
    await recordJob(name, false).catch(() => console.error("background job status unavailable", name));
    throw error;
  }
}
