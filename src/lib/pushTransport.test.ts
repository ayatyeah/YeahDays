import { afterEach, expect, it, vi } from 'vitest';
const transport = vi.hoisted(() => ({ send: vi.fn(), configure: vi.fn() }));
vi.mock('web-push', () => ({ default: { sendNotification: transport.send, setVapidDetails: transport.configure } }));
vi.mock('./db', () => ({ prisma: {} }));
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); vi.clearAllMocks(); });
it('bounds transport waits and classifies timeout as a retryable failure', async () => {
  vi.stubEnv('NEXT_PUBLIC_VAPID_PUBLIC_KEY', 'test-public');
  vi.stubEnv('VAPID_PRIVATE_KEY', 'test-private');
  const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
  transport.send.mockRejectedValue(new Error('Socket timeout'));
  try {
    const { sendPush } = await import('./push');
    expect(await sendPush({endpoint:'https://push.example.test/sub',p256dh:'test',auth:'test'}, {title:'Test',body:'Test'})).toBe('failed');
    expect(transport.send).toHaveBeenCalledWith(expect.any(Object), expect.any(String), expect.objectContaining({timeout:10_000}));
  } finally { errorLog.mockRestore(); }
});
