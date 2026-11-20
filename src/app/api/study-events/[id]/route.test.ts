import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ auth: vi.fn(), rate: vi.fn(), create: vi.fn(), transaction: vi.fn(), friends: vi.fn() }));
vi.mock('@/auth', () => ({ auth: mocks.auth }));
vi.mock('@/lib/db', () => ({ prisma: { eventReport: { create: mocks.create }, $transaction: mocks.transaction } }));
vi.mock('@/lib/rateLimit', () => ({ rateLimit: mocks.rate }));
vi.mock('@/lib/friends', () => ({ friendIds: mocks.friends, publicNames: vi.fn() }));
import { findEvent } from '@/lib/events';
import { steps } from '@/lib/events/engine';
import { POST, PUT } from './route';
const context = (id: string) => ({ params: Promise.resolve({ id }) });
const request = (method: string, body: unknown) => new Request('https://app.test/api/study-events/test', { method, body: JSON.stringify(body) });

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockResolvedValue({ user: { id: 'user-one' } });
  mocks.rate.mockReturnValue(true);
  mocks.create.mockResolvedValue({ id: 'report' });
  mocks.friends.mockResolvedValue([]);
});

describe('question reports', () => {
  it('accepts network archive, topic and VRT questions only in their own final', async () => {
    for (const id of ['module-01-1', 'E029', 'vrt-1-01']) {
      const body = { questionId: id, text: 'Please review the question.' };
      expect((await POST(request('POST', body), context('computer-networks-final'))).status).toBe(200);
      expect((await POST(request('POST', body), context('philosophy-final'))).status).toBe(400);
    }
    expect((await POST(request('POST', {questionId:'wrong-id', text:'Missing question'}), context('computer-networks-final'))).status).toBe(400);
  });
  it('accepts Foundations reports only in Cloud Computing', async () => {
    const body = { questionId: 'aws-found-m10-q10', text: 'Please check this answer.' };
    expect((await POST(request('POST', body), context('cloud-computing-final'))).status).toBe(200);
    expect((await POST(request('POST', body), context('computer-vision-final'))).status).toBe(400);
    expect((await POST(request('POST', { ...body, questionId: 'aws-found-m11-q01' }), context('cloud-computing-final'))).status).toBe(400);
  });
  it('accepts an actual AWS question attached to the final notebook', async () => {
    const body = { questionId: 'aws-dev-m02-q01', text: 'Please check this answer.' };
    const response = await POST(request('POST', body), context('cloud-computing-final'));
    expect(response.status).toBe(200);
    expect(mocks.create).toHaveBeenCalledWith({ data: { ...body, eventId: 'cloud-computing-final', userId: 'user-one' } });
  });
  it('does not accept invented or cross-course AWS question ids', async () => {
    for (const [eventId, questionId] of [['cloud-computing-final', 'aws-dev-m02-q99'], ['computer-vision-final', 'aws-dev-m02-q01'], ['cloud-computing-final', '__proto__']]) {
      expect((await POST(request('POST', { questionId, text: 'Check this answer.' }), context(eventId))).status).toBe(400);
    }
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it('continues accepting legacy event questions and requires authentication', async () => {
    const event = findEvent('cloud-computing-midterm')!;
    const questionId = event.lectures[0].parts[0].questions[0].id;
    expect((await POST(request('POST', { questionId, text: 'Check this answer.' }), context(event.id))).status).toBe(200);
    mocks.auth.mockResolvedValueOnce(null);
    expect((await POST(request('POST', { questionId, text: 'Check this answer.' }), context(event.id))).status).toBe(401);
  });
  it('rejects non-object JSON rather than throwing', async () => {
    for (const body of [null, [], 7]) {
      expect((await POST(request('POST', body), context('cloud-computing-final'))).status).toBe(400);
      expect((await PUT(request('PUT', body), context('cloud-computing-midterm'))).status).toBe(400);
    }
  });
});

it('merges concurrent first saves even when no progress row exists', async () => {
  type Row = { data: unknown; share: boolean; percent: number };
  let stored: Row | null = null;
  let mutex = Promise.resolve();
  mocks.transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
    let release: (() => void) | undefined;
    const tx = {
      $queryRaw: async (sql: TemplateStringsArray) => {
        if (sql.join('').includes('pg_advisory_xact_lock')) {
          const previous = mutex;
          mutex = new Promise<void>(resolve => { release = resolve; });
          await previous;
        }
        // SELECT FOR UPDATE cannot lock the not-yet-created EventProgress row.
        return [];
      },
      eventProgress: {
        findUnique: async () => structuredClone(stored),
        upsert: async ({ create, update }: { create: Row; update: Row }) => {
          stored = structuredClone(stored ? update : create);
          return structuredClone(stored);
        },
      },
    };
    try { return await callback(tx); } finally { release?.(); }
  });
  const event = findEvent('cloud-computing-midterm')!;
  const [first, second] = steps(event);
  const result = { best: 1, last: 1, attempts: 1 };
  const responses = await Promise.all([first, second].map(step => PUT(request('PUT', { progress: { [step.id]: result } }), context(event.id))));
  expect(responses.map(response => response.status)).toEqual([200, 200]);
  expect(stored).toMatchObject({ data: { [first.id]: result, [second.id]: result } });
});
