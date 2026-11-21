import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { writtenQuestions } from '@/lib/events/networkFinal/finalWritten';

const mocks = vi.hoisted(() => ({ auth: vi.fn(), keys: vi.fn(), daily: vi.fn(), minute: vi.fn(), fetch: vi.fn() }));
vi.mock('@/auth', () => ({ auth: mocks.auth }));
vi.mock('@/lib/geminiTutor', () => ({ geminiKeys: mocks.keys }));
vi.mock('@/lib/aiLimit', () => ({ dailyLimit: mocks.daily }));
vi.mock('@/lib/rateLimit', () => ({ rateLimit: mocks.minute }));
import { POST } from './route';

const defaults = { id: '4-27', lang: 'en', answer: 'conf t' };
const request = (params = {}, origin = 'https://yeahgrind.site') => new Request('https://yeahgrind.site/api/network-final/grade', {
  method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...defaults, ...params }),
});
function provider(result: unknown, finishReason = 'STOP') {
  return Response.json({ candidates: [{ finishReason, content: { parts: [{ text: JSON.stringify(result) }] } }] });
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue({ user: { id: 'learner' } });
  mocks.keys.mockReturnValue(['test-key']);
  mocks.daily.mockResolvedValue(true);
  mocks.minute.mockReturnValue(true);
  vi.stubGlobal('fetch', mocks.fetch);
});
afterEach(() => vi.unstubAllGlobals());

describe('network final written grading', () => {
  it('checks origin, account and submitted data before calling the provider', async () => {
    expect((await POST(request({}, 'https://other.example'))).status).toBe(403);
    mocks.auth.mockResolvedValueOnce(null);
    expect((await POST(request())).status).toBe(401);
    for (const input of [{ id: 'unknown' }, { answer: ' ' }, { lang: 'xx' }, { answer: 4 }]) {
      expect((await POST(request(input))).status).toBe(400);
    }
    expect((await POST(request({ answer: 'a'.repeat(25_000) }))).status).toBe(413);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it.each([['4-26', 7], ['4-27', 3], ['4-28', 4], ['4-29', 5], ['4-30', 10], ['open-26', 5]])(
    'assigns authoritative points and reference for %s', async (id, points) => {
      const target = writtenQuestions.find(item => item.id === id)!;
      mocks.fetch.mockResolvedValue(provider({ correct: true, feedback: 'Верно.', score: 999, modelAnswer: 'forged' }));
      const response = await POST(request({ id, answer: target.answer, lang: 'ru', maxPoints: 100 }));
      expect(await response.json()).toEqual({ score: points, maxPoints: points, feedback: 'Верно.', modelAnswer: target.answer });
      expect(response.headers.get('Cache-Control')).toContain('no-store');
      const payload = JSON.parse(mocks.fetch.mock.calls[0][1].body);
      expect(payload.systemInstruction.parts[0].text).toContain('Russian');
      expect(payload.contents[0].parts[0].text).toContain('studentAnswer');
    },
  );

  it('gives zero for incomplete answers and withholds scores on provider failures', async () => {
    mocks.fetch.mockResolvedValueOnce(provider({ correct: false, feedback: 'One link broadcast is missing.' }));
    expect((await (await POST(request({ id: '4-30' }))).json()).score).toBe(0);
    for (const result of [provider({ correct: 'yes', feedback: 'x' }), provider({ correct: true, feedback: '' }), provider({}, 'MAX_TOKENS')]) {
      mocks.fetch.mockResolvedValueOnce(result);
      expect((await POST(request())).status).toBe(502);
    }
  });

  it('honors provider availability and existing shared grading budgets', async () => {
    mocks.keys.mockReturnValueOnce([]);
    expect((await POST(request())).status).toBe(503);
    mocks.daily.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    expect((await POST(request())).status).toBe(429);
    expect(mocks.daily).toHaveBeenCalledWith('grade:global', 4000);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });
});
