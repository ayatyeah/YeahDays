// Run with node --env-file=.env scripts/research-admin.mjs ...
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
const db = new PrismaClient();
try {
  const [command, userId, condition] = process.argv.slice(2);
  if (command === 'pilot') {
    if (!userId || !['A', 'B'].includes(condition)) throw new Error('Usage: pilot USER_ID A|B (use a dedicated developer account)');
    const data = { version: 'assignment3-v1', aiConsent: true, lastActivity: 0, events: [], interview: null };
    await db.researchParticipant.create({ data: { userId, participantId: randomUUID(), condition, pilot: true, data } });
    console.log('Pilot created; excluded from research exports and allocation.');
  } else if (command === 'purge') {
    // Consent-time retention dates survive later environment changes.
    const rows = await db.researchParticipant.findMany({ select: { userId: true, data: true } });
    const expired = rows.filter(r => r.data.consentInformation?.deleteAt && Date.parse(r.data.consentInformation.deleteAt) <= Date.now());
    console.log(`Expired participant records: ${expired.length}`);
    if (process.argv.includes('--apply')) {
      const result = await db.researchParticipant.deleteMany({ where: { userId: { in: expired.map(r => r.userId) } } });
      console.log(`Deleted: ${result.count}`);
    } else console.log('Preview only. Add --apply to delete. Remove exported copies separately.');
  } else throw new Error('Commands: pilot USER_ID A|B; purge [--apply]');
} finally { await db.$disconnect(); }
