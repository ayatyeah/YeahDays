"use client";
import { useEffect } from "react";

/** Session-only, account-scoped positions. Draft text is stored separately. */
export function useReadingPosition(key: string | null, ready: boolean) {
  useEffect(() => {
    if (!key || !ready) return;
    const storageKey = `yg-reading-position:${key}`;
    let restoring = true;
    let frame = 0;
    let saved = 0;
    try { saved = Number(sessionStorage.getItem(storageKey)) || 0; } catch {}
    // Wait for layout and the restored lesson tab before applying the position.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        window.scrollTo({ top: saved, behavior: "instant" });
        restoring = false;
      });
    });
    const save = () => {
      if (restoring) return;
      try { sessionStorage.setItem(storageKey, String(window.scrollY)); } catch {}
    };
    window.addEventListener("scroll", save, { passive:true });
    window.addEventListener("pagehide", save);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", save);
      window.removeEventListener("pagehide", save);
    };
  }, [key, ready]);
}
