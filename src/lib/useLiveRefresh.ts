"use client";

import { useEffect, useRef } from "react";

/**
 * Держать серверные данные карточки свежими, пока экран на виду.
 *
 * Друзья и общие челленджи раньше грузились один раз при монтировании, а
 * разделы в оболочке не размонтируются — серию друга было видно только
 * после перезагрузки страницы, а после полуночи челлендж продолжал
 * показывать вчерашний день. Здесь три повода обновиться: вернулись в
 * приложение (visibilitychange), появилась сеть и простой таймер, который
 * молчит, пока вкладка скрыта, — фоновая вкладка не тратит ни запросов,
 * ни батареи.
 */
export function useLiveRefresh(load: () => unknown, intervalMs = 60_000) {
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    void loadRef.current();
    const tick = () => {
      if (document.visibilityState === "visible") void loadRef.current();
    };
    const timer = window.setInterval(tick, intervalMs);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("online", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("online", tick);
    };
  }, [intervalMs]);
}
