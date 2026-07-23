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

    return () => {
      window.removeEventListener("online", flush);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pagehide", flush);
      clearInterval(id);
    };
  }, []);

  return null;
}
