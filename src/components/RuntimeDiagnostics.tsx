"use client";
import { useSyncStatus } from "@/store/useSyncStatus";
import { useEffect } from "react";
import { reportDiagnostic, errorCode } from "@/lib/clientDiagnostics";
export default function RuntimeDiagnostics() {
  useEffect(() => {
    const error = (event: ErrorEvent) => reportDiagnostic("browser_error", errorCode(event.error));
    const rejection = (event: PromiseRejectionEvent) => reportDiagnostic("browser_error", errorCode(event.reason));
    const original = window.fetch;
    const wrapped: typeof fetch = async (input, init) => {
      const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url, location.origin);
      const observe = url.origin === location.origin && url.pathname.startsWith("/api/") && url.pathname !== "/api/diagnostics";
      const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
      const write = url.origin === location.origin && ["POST", "PUT", "PATCH", "DELETE"].includes(method) && ["/api/learning", "/api/learning/subjects", "/api/account", "/api/personalization"].includes(url.pathname);
      if (write) useSyncStatus.getState().beginWrite();
      const start = performance.now();
      try {
        const response = await original(input, init);
        if (write) useSyncStatus.getState().endWrite(response.ok);
        const elapsed = performance.now() - start;
        if (observe && response.status >= 500) reportDiagnostic("api_error", "http", url.pathname, response.status, elapsed);
        else if (observe && elapsed >= 2000) reportDiagnostic("api_slow", "http", url.pathname, response.status, elapsed);
        return response;
      } catch (e) { if (write) useSyncStatus.getState().endWrite(false); if (observe && navigator.onLine && errorCode(e) !== "abort") reportDiagnostic("api_error", "network", url.pathname); throw e; }
    };
    window.fetch = wrapped;
    window.addEventListener("error", error); window.addEventListener("unhandledrejection", rejection);
    return () => { if (window.fetch === wrapped) window.fetch = original; window.removeEventListener("error", error); window.removeEventListener("unhandledrejection", rejection); };
  }, []);
  return null;
}
