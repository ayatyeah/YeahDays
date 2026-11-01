const ROUTES = new Set(["/", "/login", "/register", "/forgot-password", "/today", "/app", "/learn", "/settings", "/account", "/calendar", "/progress", "/community", "/events", "/chat", "/api/state", "/api/link", "/api/learning", "/api/learning/subjects", "/api/media", "/api/social", "/api/personalization", "/api/account", "/api/account/lms", "/api/ai/planner", "/api/ai/chat", "/api/auth/session", "/api/auth/csrf", "/api/auth/callback/credentials"]);
export function diagnosticRoute(input: unknown) {
  if (typeof input !== "string") return "/other";
  const path = input.split(/[?#]/, 1)[0];
  if (ROUTES.has(path)) return path;
  for (const prefix of ["/api/media/", "/api/path/", "/learn/g/", "/learn/s/", "/events/", "/stories/"]) if (path.startsWith(prefix)) return prefix + ":item";
  return "/other";
}
export const SIGNAL_KINDS = ["browser_error", "server_error", "sync_failure", "api_error", "api_slow"] as const;
export type SignalKind = typeof SIGNAL_KINDS[number];
const CODES = new Set(["error", "type", "range", "reference", "syntax", "abort", "http", "network", "render"]);
export type SafeSignal = { kind: SignalKind; route: string; code: string; status: number; duration: string };
export function safeSignal(input: unknown): SafeSignal | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const v = input as Record<string, unknown>;
  if (!SIGNAL_KINDS.includes(v.kind as SignalKind)) return null;
  return { kind: v.kind as SignalKind, route: diagnosticRoute(v.route), code: CODES.has(String(v.code)) ? String(v.code) : "error", status: Number.isInteger(v.status) && Number(v.status) >= 100 && Number(v.status) <= 599 ? Number(v.status) : 0,
    duration: ["under2s", "2-5s", "5-10s", "over10s"].includes(String(v.duration)) ? String(v.duration) : "under2s" };
}
export const durationBucket = (ms: number) => ms < 2000 ? "under2s" : ms < 5000 ? "2-5s" : ms < 10000 ? "5-10s" : "over10s";
