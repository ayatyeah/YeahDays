/** Bounded sliding windows for a single application process. */
export class SlidingWindowLimiter {
  private buckets = new Map<string, { times: number[]; expiresAt: number }>();
  private nextSweep = 0;
  constructor(private readonly capacity = 5000) {}

  private bucket(key: string, windowMs: number, now: number) {
    if (now >= this.nextSweep) {
      for (const [id, bucket] of this.buckets) {
        if (bucket.expiresAt <= now) this.buckets.delete(id);
      }
      this.nextSweep = now + 1000;
    }
    let bucket = this.buckets.get(key);
    if (!bucket) {
      // Never evict a live limit: rotating keys must not reset another login's limit.
      if (this.buckets.size >= this.capacity) return null;
      bucket = { times: [], expiresAt: now + windowMs };
      this.buckets.set(key, bucket);
    }
    bucket.times = bucket.times.filter(t => now - t < windowMs);
    return bucket;
  }

  allow(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const bucket = this.bucket(key, windowMs, now);
    if (!bucket || bucket.times.length >= limit) return false;
    bucket.times.push(now);
    bucket.expiresAt = now + windowMs;
    return true;
  }

  failures(key: string, limit: number, windowMs: number) {
    const bucket = this.bucket(key, windowMs, Date.now());
    let recorded = false;
    return {
      allowed: !!bucket && bucket.times.length < limit,
      fail: () => {
        if (recorded) return;
        recorded = true;
        // Re-read when an async login finishes; concurrent failures share one bucket.
        this.allow(key, limit, windowMs);
      },
    };
  }
}
const limiter = new SlidingWindowLimiter();
export const rateLimit = (key: string, limit: number, windowMs: number) => limiter.allow(key, limit, windowMs);
export const failureLimit = (key: string, limit: number, windowMs: number) => limiter.failures(key, limit, windowMs);

/** IP клиента из заголовков прокси (Railway) — Request единый для route-хендлеров и NextAuth authorize(). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
