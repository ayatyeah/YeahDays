"use client";

import { useLayoutEffect } from "react";

/** Share the visible PWA height between the shell and bottom navigation.
 * screen.height includes system UI and is not the application's viewport.
 * Ignore keyboard/pinch changes; they must not resize the app behind a form.
 */
export default function StandaloneViewportFix() {
  useLayoutEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    if (!nav.standalone && !matchMedia("(display-mode: standalone)").matches) return;
    const root = document.documentElement.style;
    const viewport = window.visualViewport;
    let frame = 0;
    const apply = () => {
      if (viewport && Math.abs(viewport.scale - 1) > 0.01) return;
      const focused = document.activeElement;
      if (focused instanceof HTMLElement &&
          (focused.matches("input, textarea, select") || focused.isContentEditable)) return;
      const height = viewport?.height ?? window.innerHeight;
      if (!Number.isFinite(height) || height <= 0) return;
      root.setProperty("--app-h", `${height}px`);
      root.setProperty("--app-bottom", `${height + (viewport?.offsetTop ?? 0)}px`);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };
    const visible = () => { if (document.visibilityState === "visible") schedule(); };
    apply();
    schedule();
    const timers = [250, 900].map(delay => window.setTimeout(schedule, delay));
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    window.addEventListener("orientationchange", schedule);
    viewport?.addEventListener("resize", schedule);
    viewport?.addEventListener("scroll", schedule);
    document.addEventListener("visibilitychange", visible);
    document.addEventListener("focusout", schedule);
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      window.removeEventListener("orientationchange", schedule);
      viewport?.removeEventListener("resize", schedule);
      viewport?.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", visible);
      document.removeEventListener("focusout", schedule);
      root.removeProperty("--app-h");
      root.removeProperty("--app-bottom");
    };
  }, []);
  return null;
}
