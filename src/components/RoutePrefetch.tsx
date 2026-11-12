"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Warm only the primary destinations, one per idle period. Secondary links
 * retain Next's own viewport/intent prefetch instead of loading ten routes at once. */
const ROUTES = ["/learn", "/events", "/today"];
const AGAIN_AFTER = 10 * 60_000;

export default function RoutePrefetch() {
  const router = useRouter();
  useEffect(() => {
    let last = 0;
    let handle: number | undefined;
    let stopped = false;
    let queue: string[] = [];
    const cancel = () => {
      if (handle === undefined) return;
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(handle);
      else globalThis.clearTimeout(handle);
      handle = undefined;
    };
    const allowed = () => {
      const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      return !stopped && document.visibilityState === "visible" && navigator.onLine && !c?.saveData && !["2g", "slow-2g"].includes(c?.effectiveType ?? "");
    };
    const schedule = () => {
      cancel();
      if (!allowed() || !queue.length) return;
      const run = () => {
        handle = undefined;
        if (!allowed()) return;
        const route = queue.shift();
        if (route) router.prefetch(route);
        schedule();
      };
      handle = "requestIdleCallback" in window ? window.requestIdleCallback(run) : (globalThis.setTimeout(run, 1500) as unknown as number);
    };
    const start = () => {
      if (!allowed()) { cancel(); return; }
      if (Date.now() - last >= AGAIN_AFTER) {
        last = Date.now();
        queue = ROUTES.filter(route => route !== window.location.pathname);
      }
      schedule();
    };
    start();
    document.addEventListener("visibilitychange", start);
    return () => { stopped = true; cancel(); document.removeEventListener("visibilitychange", start); };
  }, [router]);
  return null;
}
