"use client";

import { useEffect } from "react";
import { flushEvents } from "@/lib/api";

/**
 * Досылает офлайн-очередь событий, когда для этого появляется повод:
 * вернулась сеть, пользователь вернулся на вкладку, страница закрывается.
 * Плюс редкий фоновый тик — на случай, если ни одно из событий не сработало.
 */
export default function EventFlusher() {
  useEffect(() => {
    const flush = () => void flushEvents();

    flush(); // всё, что осталось с прошлой сессии

    const onVisible = () => {
      if (document.visibilityState === "visible") flush();
    };

    window.addEventListener("online", flush);
    document.addEventListener("visibilitychange", onVisible);
    // pagehide надёжнее beforeunload на мобильных
    window.addEventListener("pagehide", flush);

    const id = setInterval(flush, 60_000);

    // Service worker будит нас, когда сеть вернулась уже после закрытия
    // приложения: Background Sync срабатывает в фоне, а выгрузить очередь
    // может только страница — ключи и хранилище живут здесь.
    const onMessage = (event: MessageEvent) => {
      if ((event.data as { type?: string })?.type === "YD_FLUSH_EVENTS") flush();
    };
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", onMessage);
      navigator.serviceWorker.ready
        .then((reg) => {
          const sync = (reg as ServiceWorkerRegistration & {
            sync?: { register: (tag: string) => Promise<void> };
          }).sync;
          return sync?.register("yd-flush-events");
        })
        .catch(() => {
          /* Background Sync есть не везде — обычные триггеры остаются */
        });
    }

    return () => {
      window.removeEventListener("online", flush);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pagehide", flush);
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", onMessage);
      }
      clearInterval(id);
    };
  }, []);

  return null;
}
