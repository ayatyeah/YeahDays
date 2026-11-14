import { afterEach, expect, it, vi } from 'vitest';
import { allowedMutationOrigin, boundedJson } from './requestSecurity';
afterEach(() => vi.unstubAllEnvs());
const request = (headers: Record<string, string>) => new Request('http://internal:8080/api/account', { method: 'DELETE', headers });
it('rejects cross-site mutation even when forwarded host is spoofed', () => {
  expect(allowedMutationOrigin(request({ origin: 'https://attacker.test', 'x-forwarded-host': 'attacker.test', 'x-forwarded-proto': 'https' }))).toBe(false);
  expect(allowedMutationOrigin(request({ origin: 'null' }))).toBe(false);
  expect(allowedMutationOrigin(request({ 'sec-fetch-site': 'cross-site' }))).toBe(false);
  expect(allowedMutationOrigin(request({ 'sec-fetch-site': 'same-site' }))).toBe(false);
});
it('allows configured TLS origins and non-browser clients without an Origin', () => {
  expect(allowedMutationOrigin(request({ origin: 'https://yeahgrind.site' }))).toBe(true);
  vi.stubEnv('AUTH_URL', 'https://preview.example.test');
  expect(allowedMutationOrigin(request({ origin: 'https://preview.example.test' }))).toBe(true);
  expect(allowedMutationOrigin(request({}))).toBe(true);
});
it('cancels oversized streamed bodies without reading the remainder', async () => {
  let cancelled = false;
  let pulls = 0;
  const stream = new ReadableStream({ pull(controller) { pulls++; controller.enqueue(new Uint8Array(4000)); }, cancel() { cancelled = true; } });
  const req = new Request('https://example.test', { method: 'POST', body: stream, duplex: 'half' } as RequestInit);
  await expect(boundedJson(req, 6000)).rejects.toMatchObject({ status: 413 });
  expect(cancelled).toBe(true); expect(pulls).toBeLessThanOrEqual(3);
});
it('counts UTF-8 bytes and rejects arrays and invalid JSON', async () => {
  const make = (body: string) => new Request('https://example.test', { method: 'POST', body });
  await expect(boundedJson(make(JSON.stringify({ text: 'Я'.repeat(40) })), 60)).rejects.toMatchObject({ status: 413 });
  await expect(boundedJson(make('[]'))).rejects.toMatchObject({ status: 400 });
  await expect(boundedJson(make('{'))).rejects.toMatchObject({ status: 400 });
  await expect(boundedJson(make('{"action":"start"}'))).resolves.toEqual({ action: 'start' });
});
