import { beforeEach, afterEach, expect, it, vi } from 'vitest';
const m = vi.hoisted(() => ({ auth: vi.fn(), find: vi.fn(), mutate: vi.fn(), fetch: vi.fn() }));
vi.mock('@/auth', () => ({ auth: m.auth }));
vi.mock('@/lib/db', () => ({ prisma: { researchParticipant: { findUnique: m.find } } }));
vi.mock('@/lib/rateLimit', () => ({ rateLimit: () => true }));
vi.mock('@/lib/researchDb', () => ({ mutateResearch: m.mutate }));
import { POST } from './route';
import { initialResearch } from '@/lib/research';
beforeEach(() => { vi.resetAllMocks(); vi.stubGlobal('fetch', m.fetch); vi.stubEnv('OPENAI_API_KEY', 'test-key'); m.auth.mockResolvedValue({ user: { id: 'account-secret' } }); });
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
const row = (condition: string) => ({ condition, enrolledAt: new Date(), withdrawnAt: null, data: initialResearch() });
it('requires authentication', async () => { m.auth.mockResolvedValue(null); expect((await POST()).status).toBe(401); expect(m.find).not.toHaveBeenCalled(); });
it('never calls AI for A, ignoring any caller-side condition', async () => { m.find.mockResolvedValue(row('A')); const r = await POST(); expect(r.status).toBe(200); expect((await r.json()).source).toBe('standard'); expect(m.fetch).not.toHaveBeenCalled(); expect(m.find).toHaveBeenCalledWith({ where: { userId: 'account-secret' } }); });
it('rejects withdrawn and expired participants', async () => {
  m.find.mockResolvedValue({ ...row('B'), withdrawnAt: new Date() }); expect((await POST()).status).toBe(403);
  m.find.mockResolvedValue({ ...row('B'), enrolledAt: new Date(Date.now() - 29 * 86400000) }); expect((await POST()).status).toBe(403); expect(m.fetch).not.toHaveBeenCalled();
});
it('projects only permitted events to the pinned model', async () => {
  const p = row('B'); p.data.interview = { answers: ['private interview'], ratings: [], at: '' }; p.data.events.push({ event_type: 'task_start', task_id: 'w1-plan', event_timestamp: new Date().toISOString() });
  m.find.mockResolvedValue(p); m.fetch.mockResolvedValue({ ok: true, json: async () => ({ status: 'completed', output: [{ content: [{ type: 'output_text', text: 'Обратная связь' }] }] }) });
  expect((await POST()).status).toBe(200);
  const payload = JSON.parse(m.fetch.mock.calls[0][1].body); expect(payload.model).toBe('gpt-4o-mini'); expect(payload.store).toBe(false);
  expect(payload.input).not.toContain('private interview'); expect(payload.input).not.toContain('account-secret'); expect(payload.input).toContain('w1-plan');
});
it('records failure without pretending standard feedback is AI', async () => { m.find.mockResolvedValue(row('B')); m.fetch.mockRejectedValue(new Error('provider-secret')); const r = await POST(); expect(r.status).toBe(503); expect(await r.text()).not.toContain('provider-secret'); expect(m.mutate).toHaveBeenCalled(); });
