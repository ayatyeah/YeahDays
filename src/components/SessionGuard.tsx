"use client";

import { useEffect } from "react";
import { needsLogin } from "@/lib/publicPaths";

/**
 * Проверка входа в браузере.
 *
 * Разделы-оболочки service worker отдаёт из кэша сразу, без сервера (см.
 * INSTANT в sw.js), поэтому переадресация на /login из proxy.ts до них не
 * доходит. Вышедший из аккаунта открыл бы приложение как ни в чём не бывало —
 * здесь его уводим на вход.
 *
 * Сессию спрашиваем сами, а не через useSession: тот без сети тоже говорит
 * «unauthenticated», и человека в метро выкидывало бы на вход, которого
 * офлайн не открыть. Уводим только по ответу сервера «сессии нет».
 */
export default function SessionGuard() {
  useEffect(() => {
    const { pathname, search } = window.location;
    if (!needsLogin(pathname) || pathname === "/offline") return;
    let cancelled = false;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : undefined))
      .then((session) => {
        if (cancelled || session === undefined || session?.user) return;
        window.location.replace(`/login?callbackUrl=${encodeURIComponent(pathname + search)}`);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
