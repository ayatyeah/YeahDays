"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { linkAccount } from "@/lib/linkAccount";
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
    const controller = new AbortController();
    let retry: ReturnType<typeof setTimeout>;
    async function transfer() {
      try {
        const moved = await linkAccount(deviceId!, controller.signal);
        if (controller.signal.aborted) return;
        if (moved > 0) useSyncStatus.getState().setMoved(moved);
        localStorage.setItem(key, "1");
        void useSyncStatus.getState().syncNow?.();
      } catch {
        if (!controller.signal.aborted) retry = setTimeout(() => void transfer(), 30_000);
      }
    }
    void transfer();
    return () => { controller.abort(); clearTimeout(retry); };
  }, [status, accountId]);
  return null;
}
