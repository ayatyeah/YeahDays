/**
 * In-memory sliding-window rate limiter. Один процесс Railway, без Redis —
 * достаточно для текущего масштаба (личный проект, не отдаётся за несколько
 * инстансов). Лимит не переживает рестарт/деплой и не шарится между
 * инстансами, если они появятся — осознанный компромисс под размер проекта.
 */
const buckets = new Map<string, number[]>();
const MAX_BUCKETS = 5000;

/** true — запрос в пределах лимита, false — лимит превышен. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const fresh = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  fresh.push(now);
  buckets.set(key, fresh);

  if (buckets.size > MAX_BUCKETS) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return fresh.length <= limit;
}

/** IP клиента из заголовков прокси (Railway) — Request единый для route-хендлеров и NextAuth authorize(). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
