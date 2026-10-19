import { prisma } from './db';

export function researchExpired(data: unknown, now: number): boolean {
  const deadline = (data as { consentInformation?: { deleteAt?: unknown } } | null)?.consentInformation?.deleteAt;
  return typeof deadline === 'string' && Number.isFinite(Date.parse(deadline)) && Date.parse(deadline) <= now;
}

export async function purgeExpiredResearch(now = Date.now()) {
  const rows = await prisma.researchParticipant.findMany({ select: { participantId: true, data: true } });
  const ids = rows.filter(row => researchExpired(row.data, now)).map(row => row.participantId);
  if (!ids.length) return 0;
  // Pseudonyms cannot be reused by a newly enrolled account during concurrent purges.
  const result = await prisma.researchParticipant.deleteMany({ where: { participantId: { in: ids } } });
  return result.count;
}

declare global { var __ygResearchRetention: boolean | undefined; }
export function startResearchRetention() {
  if (process.env.RESEARCH_RETENTION_ENABLED !== 'true' || globalThis.__ygResearchRetention) return;
  globalThis.__ygResearchRetention = true;
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const deleted = await purgeExpiredResearch();
      if (deleted) console.log(`research retention: deleted ${deleted} expired records`);
    } catch { console.error('research retention: cleanup failed; will retry in one hour'); }
    finally { running = false; }
  };
  console.log('research retention: enabled, checking at startup and hourly');
  void tick();
  setInterval(() => void tick(), 60 * 60_000).unref();
}
