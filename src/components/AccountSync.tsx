"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserId } from "@/lib/userId";
import { useSyncStatus } from "@/store/useSyncStatus";

/**
 * При первом входе привязывает анонимные события устройства к аккаунту
 * (один раз на аккаунт). Дальше сервер сам берёт id из сессии.
 */
export default function AccountSync() {
  const { data: session, status } = useSession();
  const accountId = session?.user?.id;

  useEffect(() => {
    if (status !== "authenticated" || !accountId) return;
    const key = `yd-linked:${accountId}`;
    try {
      if (localStorage.getItem(key)) return;
    } catch {
      return;
    }
    const deviceId = getUserId();
    if (!deviceId || deviceId === accountId) {
      try {
        localStorage.setItem(key, "1");
      } catch {}
      return;
    }
    fetch("/api/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId }),
    })
      .then((r) => r.json())
      .then((json: { moved?: number }) => {
        // показываем в профиле, что вход реально что-то перенёс
        if (typeof json.moved === "number" && json.moved > 0) {
          useSyncStatus.getState().setMoved(json.moved);
        }
        localStorage.setItem(key, "1");
      })
      .catch(() => {});
  }, [status, accountId]);

  return null;
}
