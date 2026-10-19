import { beforeEach, expect, it, vi } from 'vitest';
const m = vi.hoisted(() => ({ find: vi.fn(), remove: vi.fn() }));
vi.mock('./db', () => ({ prisma: { researchParticipant: { findMany: m.find, deleteMany: m.remove } } }));
import { purgeExpiredResearch, researchExpired } from './researchRetention';
const now = Date.parse('2027-01-17T19:00:00Z');
beforeEach(() => vi.resetAllMocks());
it('requires an explicit valid consent-time deadline and honors its boundary', () => {
  for (const data of [null, {}, { consentInformation: {} }, { consentInformation: { deleteAt: 'invalid' } }]) expect(researchExpired(data, now)).toBe(false);
  expect(researchExpired({ consentInformation: { deleteAt: new Date(now).toISOString() } }, now)).toBe(true);
  expect(researchExpired({ consentInformation: { deleteAt: new Date(now + 1).toISOString() } }, now)).toBe(false);
});
it('deletes only expired pseudonyms, including withdrawal markers', async () => {
  m.find.mockResolvedValue([{ participantId: 'expired', data: { consentInformation: { deleteAt: new Date(now).toISOString() } } }, { participantId: 'active', data: {} }]);
  m.remove.mockResolvedValue({ count: 1 });
  expect(await purgeExpiredResearch(now)).toBe(1);
  expect(m.remove).toHaveBeenCalledWith({ where: { participantId: { in: ['expired'] } } });
});
it('does not delete when no deadline has expired', async () => {
  m.find.mockResolvedValue([{ participantId: 'pilot', data: {} }]);
  expect(await purgeExpiredResearch(now)).toBe(0); expect(m.remove).not.toHaveBeenCalled();
});
