import { beforeEach, describe, expect, it, vi } from 'vitest';
const m = vi.hoisted(() => ({
  auth: vi.fn(), anonymous: vi.fn(),
  prisma: {
    user: { upsert: vi.fn() }, event: { findMany: vi.fn() },
    pushSubscription: { upsert: vi.fn(), delete: vi.fn() },
    pairingCode: { deleteMany: vi.fn(), create: vi.fn() },
  },
}));
vi.mock('@/auth', () => ({ auth: m.auth }));
vi.mock('@/lib/db', () => ({ prisma: m.prisma }));
vi.mock('@/lib/anonymousUser', () => ({ resolveAnonymousUserId: m.anonymous }));
vi.mock('@/lib/push', () => ({ preferredHour: () => 20 }));
vi.mock('@/lib/apiKey', () => ({ generatePairingCode: () => 'TESTCODE' }));
vi.mock('@/lib/rateLimit', () => ({ clientIp: () => 'test', rateLimit: () => true }));
import { POST as subscribe, DELETE as unsubscribe } from './route';
import { POST as pair } from '../../keys/pair/route';

const request = (body: string, method = 'POST') => new Request('https://test/api', { method, body, headers: { 'content-type': 'application/json' } });
beforeEach(() => {
  vi.resetAllMocks();
  m.auth.mockResolvedValue({ user: { id: 'signed-in' } });
  m.prisma.event.findMany.mockResolvedValue([]);
  m.prisma.pushSubscription.delete.mockResolvedValue({});
});

describe('pairing and push body validation', () => {
  it.each(['null', '[]', '"text"', '42', '{', ''])('rejects malformed or non-object body %s without auth or writes', async body => {
    expect((await pair(request(body))).status).toBe(400);
    expect((await subscribe(request(body))).status).toBe(400);
    expect((await unsubscribe(request(body, 'DELETE'))).status).toBe(400);
    expect(m.auth).not.toHaveBeenCalled();
    expect(m.prisma.user.upsert).not.toHaveBeenCalled();
    expect(m.prisma.pushSubscription.delete).not.toHaveBeenCalled();
  });
  it('bounds streamed bodies even without a Content-Length header', async () => {
    const oversized = JSON.stringify({ userId: 'x'.repeat(6100) });
    expect((await pair(request(oversized))).status).toBe(413);
    expect((await subscribe(request(oversized))).status).toBe(413);
    expect((await unsubscribe(request(oversized, 'DELETE'))).status).toBe(413);
    expect(m.auth).not.toHaveBeenCalled();
  });
  it('still creates codes for the signed-in account, ignoring a supplied account id', async () => {
    expect((await pair(request(JSON.stringify({ userId: 'other-account' })))).status).toBe(200);
    expect(m.prisma.pairingCode.create).toHaveBeenCalledWith({ data: expect.objectContaining({ userId: 'signed-in', code: 'TESTCODE' }) });
    expect(m.anonymous).not.toHaveBeenCalled();
  });
  it('still subscribes valid payloads and returns validation errors for missing fields', async () => {
    expect((await subscribe(request('{}'))).status).toBe(400);
    const subscription = { endpoint: 'https://push.example/subscription', keys: { p256dh: 'public-key', auth: 'auth-key' } };
    expect((await subscribe(request(JSON.stringify({ subscription, tzOffset: -300 })))).status).toBe(200);
    expect(m.prisma.pushSubscription.upsert).toHaveBeenCalledWith(expect.objectContaining({ create: expect.objectContaining({ userId: 'signed-in', endpoint: subscription.endpoint, tzOffset: -300 }) }));
    expect((await unsubscribe(request('{}', 'DELETE'))).status).toBe(400);
  });
});
