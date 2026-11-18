import { beforeEach, describe, expect, it, vi } from 'vitest';
const m = vi.hoisted(() => ({ auth: vi.fn(), admin: vi.fn(), media: vi.fn(), blocked: vi.fn() }));
vi.mock('@/auth', () => ({ auth: m.auth }));
vi.mock('@/lib/owner', () => ({ requireAdmin: m.admin }));
vi.mock('@/lib/db', () => ({ prisma: { socialMedia: { findUnique: m.media }, communityProfile: { findFirst: m.blocked } } }));
import { GET } from './route';
const get = () => GET(new Request('https://test/api/media/photo'), { params: Promise.resolve({ id: 'photo' }) });
const photo = { userId: 'author', data: new Uint8Array([1,2,3]), mime: 'image/webp', user: { banned: false, communityProfile: { hidden: false } } };
beforeEach(() => { vi.resetAllMocks(); m.auth.mockResolvedValue({ user: { id: 'viewer' } }); m.admin.mockResolvedValue(false); m.media.mockResolvedValue(photo); m.blocked.mockResolvedValue(null); });
describe('private community media access', () => {
  it('rejects unauthenticated access before reading bytes', async () => {
    m.auth.mockResolvedValue(null); expect((await get()).status).toBe(401); expect(m.media).not.toHaveBeenCalled();
  });
  it('checks blocks in both directions for direct URLs', async () => {
    m.blocked.mockResolvedValue({ userId: 'author' });
    expect((await get()).status).toBe(404);
    expect(m.blocked).toHaveBeenCalledWith({ where: { OR: [{ userId: 'viewer', blocked: { has: 'author' } }, { userId: 'author', blocked: { has: 'viewer' } }] }, select: { userId: true } });
  });
  it('does not cache authenticated photos across visibility or account changes', async () => {
    const response = await get(); expect(response.status).toBe(200); expect(response.headers.get('Cache-Control')).toBe('private, no-store'); expect(response.headers.get('Content-Type')).toBe('image/webp');
  });
  it('withholds hidden or banned authors from other ordinary users', async () => {
    m.media.mockResolvedValue({ ...photo, user: { banned: false, communityProfile: { hidden: true } } }); expect((await get()).status).toBe(404);
    m.media.mockResolvedValue({ ...photo, user: { banned: true, communityProfile: { hidden: false } } }); expect((await get()).status).toBe(404);
  });
  it('allows moderation when admin and ordinary sessions coexist', async () => {
    m.admin.mockResolvedValue(true); m.media.mockResolvedValue({ ...photo, user: { banned: true, communityProfile: { hidden: true } } });
    expect((await get()).status).toBe(200); expect(m.blocked).not.toHaveBeenCalled();
  });
  it('allows the author to access their own hidden media', async () => {
    m.auth.mockResolvedValue({ user: { id: 'author' } }); m.media.mockResolvedValue({ ...photo, user: { banned: false, communityProfile: { hidden: true } } });
    expect((await get()).status).toBe(200); expect(m.blocked).not.toHaveBeenCalled();
  });
  it('fails closed when checking a block fails', async () => {
    m.blocked.mockRejectedValue(new Error('unavailable')); expect((await get()).status).toBe(503);
  });
});
