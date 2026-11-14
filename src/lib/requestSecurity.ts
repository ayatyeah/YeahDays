/** Browser mutations must originate from this application. Forwarded headers
 * are not an origin allowlist: callers can supply them themselves. */
export function allowedMutationOrigin(req: Request): boolean {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return true;
  const origin = req.headers.get('origin');
  if (!origin) return !['cross-site', 'same-site'].includes(req.headers.get('sec-fetch-site') ?? '');
  const allowed = new Set([new URL(req.url).origin, 'https://yeahgrind.site', 'https://yeahdays-production.up.railway.app']);
  for (const value of [process.env.AUTH_URL, process.env.NEXTAUTH_URL]) {
    if (!value) continue;
    try { const url = new URL(value); if (['http:', 'https:'].includes(url.protocol)) allowed.add(url.origin); } catch { /* Ignore invalid configuration. */ }
  }
  return allowed.has(origin);
}

export class RequestBodyError extends Error {
  constructor(public status: 400 | 413) { super(status === 413 ? 'request_too_large' : 'invalid_request'); }
}

/** Enforce a byte limit while streaming, including requests without Content-Length. */
export async function boundedJson(req: Request, limit = 6000): Promise<Record<string, unknown>> {
  if (Number(req.headers.get('content-length') ?? 0) > limit) throw new RequestBodyError(413);
  const reader = req.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new RequestBodyError(413); }
      chunks.push(value);
    }
    const body: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new RequestBodyError(400);
    return body as Record<string, unknown>;
  } catch (error) {
    if (error instanceof RequestBodyError) throw error;
    throw new RequestBodyError(400);
  } finally { reader?.releaseLock(); }
}
