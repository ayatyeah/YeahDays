import { diagnosticRoute, durationBucket, safeSignal, type SignalKind, type SafeSignal } from "./diagnosticsSchema";
const queue: SafeSignal[] = [];
let budget = 20, resetAt = 0, timer: ReturnType<typeof setTimeout> | undefined;
export function reportDiagnostic(kind: SignalKind, code = "error", route = typeof location === "undefined" ? "/other" : location.pathname, status = 0, ms = 0) {
  if (typeof window === "undefined" || !navigator.onLine) return;
  if (Date.now() >= resetAt) { budget = 20; resetAt = Date.now() + 60000; }
  if (budget-- <= 0) return;
  const signal = safeSignal({ kind, code, route: diagnosticRoute(route), status, duration: durationBucket(ms) });
  if (!signal) return;
  queue.push(signal);
  if (!timer) timer = setTimeout(() => {
    timer = undefined;
    const events = queue.splice(0, 10); queue.length = 0;
    void fetch("/api/diagnostics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ build: process.env.NEXT_PUBLIC_BUILD_ID || "dev", events }), keepalive: true }).catch(() => {});
  }, 1000);
}
export function errorCode(error: unknown) {
  const name = error && typeof error === "object" && "name" in error ? String(error.name) : "";
  return ({ TypeError: "type", RangeError: "range", ReferenceError: "reference", SyntaxError: "syntax", AbortError: "abort" } as Record<string, string>)[name] ?? "error";
}
