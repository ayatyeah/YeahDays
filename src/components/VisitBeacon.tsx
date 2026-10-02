"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Маячок посещений: сообщает серверу, какой раздел открыт, при каждом
 * переходе. Передаётся только путь раздела — без идентификаторов и cookie
 * (см. lib/visits.ts). Консоль владельца не считаем: это не посетители.
 */
export default function VisitBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const body = JSON.stringify({ path: pathname });
    try {
      // sendBeacon переживает уход со страницы; где его нет — обычный запрос.
      if (!navigator.sendBeacon?.("/api/visit", new Blob([body], { type: "application/json" }))) {
        void fetch("/api/visit", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
      }
    } catch {
      /* счётчик необязателен */
    }
  }, [pathname]);
  return null;
}
