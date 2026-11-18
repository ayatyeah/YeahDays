import { beforeEach, describe, expect, it, vi } from 'vitest';

const m = vi.hoisted(() => ({
  authorize: vi.fn(), auth: vi.fn(), blocked: vi.fn(),
  prisma: {
    pairingCode: { findUnique: vi.fn(), updateMany: vi.fn() },
    apiKeyUser: { upsert: vi.fn() }, friendship: { createMany: vi.fn() },
    user: { findUnique: vi.fn() }, publicStats: { upsert: vi.fn(), findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}));
vi.mock('@/lib/db', () => ({ prisma: m.prisma }));
vi.mock('@/lib/apiKey', () => ({ authorizeServiceKey: m.authorize }));
vi.mock('@/auth', () => ({ auth: m.auth }));
vi.mock('@/lib/communityDb', () => ({ blockedIds: m.blocked }));
vi.mock('@/lib/rateLimit', () => ({ rateLimit: () => true }));
import { POST as redeem } from './route';
import { POST as acceptFriend, PUT as updateStats, DELETE as removeFriend } from '../../social/route';

const request = (body: unknown, method = 'POST') => new Request('https://test/api', { method, body: JSON.stringify(body) });
let row: { code: string; userId: string; consumedAt: Date | null; expiresAt: Date; apiKeyId: string | null };

beforeEach(() => {
  vi.resetAllMocks();
  row = { code: 'ABC12345', userId: 'owner', consumedAt: null, expiresAt: new Date(Date.now() + 60_000), apiKeyId: null };
  m.authorize.mockResolvedValue({ id: 'service-a' });
  m.auth.mockResolvedValue({ user: { id: 'friend-a' } });
  m.blocked.mockResolvedValue([]);
  m.prisma.$transaction.mockImplementation(async (run: (tx: typeof m.prisma) => unknown) => run(m.prisma));
  m.prisma.pairingCode.findUnique.mockImplementation(async () => ({ ...row }));
  // Model the database's atomic conditional UPDATE, including a recheck after
  // another transaction wins. Both handlers must respect count=0, not grant.
  m.prisma.pairingCode.updateMany.mockImplementation(async ({ where, data }) => {
    if (row.consumedAt || row.expiresAt <= where.expiresAt.gt ||
      ('apiKeyId' in where && row.apiKeyId !== where.apiKeyId) ||
      (where.OR && !where.OR.some((p: {apiKeyId: string | null}) => p.apiKeyId === row.apiKeyId))) return { count: 0 };
    row.consumedAt = data.consumedAt;
    return { count: 1 };
  });
  m.prisma.user.findUnique.mockResolvedValue({ name: 'Friend' });
  m.prisma.publicStats.findUnique.mockResolvedValue({ name: 'Owner' });
});

function simultaneousReads() {
  let release: () => void;
  const bothRead = new Promise<void>(resolve => { release = resolve; });
  let readers = 0;
  m.prisma.pairingCode.findUnique.mockImplementation(async () => {
    const snapshot = { ...row };
    if (++readers === 2) release();
    await bothRead;
    return snapshot;
  });
}

describe('one-time pairing code claims', () => {
  it('rejects reuse after a successful service redemption', async () => {
    expect((await redeem(request({ code: row.code }))).status).toBe(200);
    expect((await redeem(request({ code: row.code }))).status).toBe(400);
    expect(m.prisma.apiKeyUser.upsert).toHaveBeenCalledTimes(1);
  });
  it('grants only one competing service when both read an unused code', async () => {
    simultaneousReads();
    m.authorize.mockResolvedValueOnce({ id: 'service-a' }).mockResolvedValueOnce({ id: 'service-b' });
    const responses = await Promise.all([redeem(request({ code: row.code })), redeem(request({ code: row.code }))]);
    expect(responses.map(r => r.status).sort()).toEqual([200, 400]);
    expect(m.prisma.apiKeyUser.upsert).toHaveBeenCalledTimes(1);
  });
  it('does not let social acceptance and service redemption both consume a code', async () => {
    simultaneousReads();
    const responses = await Promise.all([redeem(request({ code: row.code })), acceptFriend(request({ code: row.code }))]);
    expect(responses.filter(r => r.status === 200)).toHaveLength(1);
    expect(m.prisma.apiKeyUser.upsert.mock.calls.length + m.prisma.friendship.createMany.mock.calls.length).toBe(1);
  });
  it('grants only one friendship when two people accept concurrently', async () => {
    simultaneousReads();
    m.auth.mockResolvedValueOnce({ user: { id: 'friend-a' } }).mockResolvedValueOnce({ user: { id: 'friend-b' } });
    const responses = await Promise.all([acceptFriend(request({ code: row.code })), acceptFriend(request({ code: row.code }))]);
    expect(responses.map(r => r.status).sort()).toEqual([200, 404]);
    expect(m.prisma.friendship.createMany).toHaveBeenCalledTimes(1);
  });
  it('rejects expired codes and expiry between read and claim', async () => {
    row.expiresAt = new Date(0);
    expect((await redeem(request({ code: row.code }))).status).toBe(400);
    expect((await acceptFriend(request({ code: row.code }))).status).toBe(404);
    row.expiresAt = new Date(Date.now() + 60_000);
    m.prisma.pairingCode.findUnique.mockImplementation(async () => { const snapshot = { ...row }; row.expiresAt = new Date(0); return snapshot; });
    expect((await redeem(request({ code: row.code }))).status).toBe(400);
    expect(m.prisma.apiKeyUser.upsert).not.toHaveBeenCalled();
    expect(m.prisma.friendship.createMany).not.toHaveBeenCalled();
  });
  it('preserves service binding and disallows using OAuth codes to add friends', async () => {
    row.apiKeyId = 'service-b';
    expect((await redeem(request({ code: row.code }))).status).toBe(403);
    expect((await acceptFriend(request({ code: row.code }))).status).toBe(404);
    expect(row.consumedAt).toBeNull();
    m.authorize.mockResolvedValue({ id: 'service-b' });
    expect((await redeem(request({ code: row.code }))).status).toBe(200);
  });
  it('does not consume a blocked or self invitation', async () => {
    m.blocked.mockResolvedValue(['owner']);
    expect((await acceptFriend(request({ code: row.code }))).status).toBe(403);
    m.blocked.mockResolvedValue([]); m.auth.mockResolvedValue({ user: { id: 'owner' } });
    expect((await acceptFriend(request({ code: row.code }))).status).toBe(400);
    expect(m.prisma.pairingCode.updateMany).not.toHaveBeenCalled();
  });
  it('rejects null, arrays and oversized bodies before database work', async () => {
    for (const payload of [null, [], 'text']) {
      expect((await redeem(request(payload))).status).toBe(400);
      expect((await acceptFriend(request(payload))).status).toBe(400);
      expect((await updateStats(request(payload, 'PUT'))).status).toBe(400);
      expect((await removeFriend(request(payload, 'DELETE'))).status).toBe(400);
    }
    expect((await redeem(request({ code: 'x'.repeat(6100) }))).status).toBe(413);
    expect(m.prisma.$transaction).not.toHaveBeenCalled();
  });
});
