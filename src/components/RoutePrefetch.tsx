"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Заранее подгружает страницы, на которые ведёт меню.
 *
 * «Сегодня», «Прогресс», «Профиль» — разделы одной оболочки и переключаются
 * без сети, а «Учёба», «Вместе», ивенты — отдельные маршруты: без предзагрузки
 * каждое нажатие сначала шло на сервер (на телефоне ~0,3–0,5 с) и только
 * потом рисовало экран. Здесь, когда браузер свободен, роутер тянет эти
 * страницы в свой кэш — и переход по меню рисуется сразу. Повторяем, когда
 * приложение возвращается на экран, чтобы кэш не успел устареть.
 */
const ROUTES = ["/learn", "/community", "/events", "/today", "/app", "/progress", "/account", "/calendar", "/challenge30", "/chat"];
const AGAIN_AFTER = 10 * 60_000;

export default function RoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    let last = 0;
    const slow = () => {
      const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      return !!c && (c.saveData || c.effectiveType === "2g" || c.effectiveType === "slow-2g");
    };
    const run = () => {
      if (!navigator.onLine || slow() || Date.now() - last < AGAIN_AFTER) return;
      last = Date.now();
      for (const route of ROUTES) if (route !== window.location.pathname) router.prefetch(route);
    };
    const idle = (cb: () => void) =>
      "requestIdleCallback" in window ? window.requestIdleCallback(cb, { timeout: 3000 }) : globalThis.setTimeout(cb, 1500);
    const handle = idle(run);
    const onVisible = () => {
      if (document.visibilityState === "visible") idle(run);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(handle as number);
      else globalThis.clearTimeout(handle as number);
    };
  }, [router]);

  return null;
}
