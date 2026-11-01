"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserId } from "@/lib/userId";
import { useUserStore, useHydrated, pickSync, hasProgress, selectTotalXp, selectStreak, type SyncData } from "@/store/useUserStore";
import { getLevelProgress } from "@/lib/leveling";
import { useSyncStatus } from "@/store/useSyncStatus";
import { mergeSnapshots, sameSnapshot } from "@/lib/syncMerge";

const ACTIVE_ACCOUNT_KEY = "yd-active-account";
type Checkpoint = { data: SyncData; revision: number };

/** One serialized exchange per account. A durable acknowledged base preserves
 * offline edits across reloads; late responses cannot cross account boundaries. */
export default function StateSync() {
  const hydrated = useHydrated();
  const { data: session, status } = useSession();
  const account = session?.user?.id;
  useEffect(() => {
    if (!hydrated || status === "loading") return;
    const userId = getUserId();
    if (!userId) return;
    const owner = account ?? `device:${userId}`;
    const key = `yg-sync-v2:${owner}`;
    const controller = new AbortController();
    let checkpoint: Checkpoint | null = null;
    try {
      const previous = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
      if (previous && previous !== (account ?? "")) useUserStore.getState().hardResetLocal();
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, account ?? "");
      const saved = JSON.parse(localStorage.getItem(key) ?? "null");
      if (saved?.data && Number.isSafeInteger(saved.revision)) checkpoint = saved;
    } catch { /* local state still works without storage */ }
    let applying = false;
    let pending: Promise<void> | null = null;
    let again = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const syncStatus = useSyncStatus.getState();
    const request = (url: string, init?: RequestInit) => fetch(url, {
      ...init, cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20_000)]),
    });
    function accept(next: Checkpoint, sent: SyncData) {
      if (controller.signal.aborted) return;
      const current = pickSync(useUserStore.getState());
      // Preserve edits made after request dispatch; send them in the next pass.
      const merged = mergeSnapshots(sent, current, next.data);
      checkpoint = next;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* retry next session conservatively */ }
      if (!sameSnapshot(current, merged)) {
        applying = true;
        useUserStore.getState().hydrateFromRemote(merged);
        applying = false;
      }
      again = !sameSnapshot(merged, next.data);
      syncStatus.markPulled();
    }
    async function exchange() {
      syncStatus.begin();
      try {
        let local = pickSync(useUserStore.getState());
        if (!checkpoint) {
          const response = await request(`/api/state?userId=${encodeURIComponent(userId!)}`);
          if (!response.ok) throw new Error("Read failed");
          const remote = await response.json();
          if (controller.signal.aborted) return;
          local = pickSync(useUserStore.getState());
          if (remote.data && !hasProgress(local)) {
            accept(remote, local);
            syncStatus.markSynced();
            return;
          }
          // No base: merge conservatively on the server; never assume a missing task was deleted.
          if (!remote.data && !hasProgress(local)) { syncStatus.markSynced(); return; }
        } else if (sameSnapshot(local, checkpoint.data)) {
          const response = await request(`/api/state?userId=${encodeURIComponent(userId!)}&revision=${checkpoint.revision}`);
          if (!response.ok) throw new Error("Read failed");
          const remote = await response.json();
          if (controller.signal.aborted) return;
          if (remote.unchanged) {
            again = !sameSnapshot(pickSync(useUserStore.getState()), checkpoint.data);
            syncStatus.markSynced(); return;
          }
          if (remote.data) {
            accept(remote, local); syncStatus.markSynced(); return;
          }
          // Server was restored/reset: re-upload the local snapshot.
          checkpoint = null;
        }
        local = pickSync(useUserStore.getState());
        const response = await request("/api/state", { method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ protocol: 2, userId, data: local, base: checkpoint?.data ?? null, baseRevision: checkpoint?.revision ?? 0 }),
        });
        if (!response.ok) throw new Error("Save failed");
        const remote: Checkpoint = await response.json();
        if (!remote.data || !Number.isSafeInteger(remote.revision)) throw new Error("Invalid response");
        if (controller.signal.aborted) return;
        accept(remote, local);
        syncStatus.markSynced();
        const s = useUserStore.getState();
        if (s.onboarded) {
          const xp = selectTotalXp(s.plan, s.todos);
          void request("/api/social", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: s.name, xp, level: getLevelProgress(xp).level, streak: selectStreak(s.plan, s.freezes.days, s.todos) }) }).catch(() => {});
        }
      } catch {
        if (!controller.signal.aborted) syncStatus.fail();
        // No tight retry loop during an outage. Online/focus/poll or edits retry.
        again = false;
      }
    }
    function sync(): Promise<void> {
      if (controller.signal.aborted) return Promise.resolve();
      if (pending) { again = true; return pending; }
      pending = (async () => {
        do { again = false; await exchange(); } while (again && !controller.signal.aborted);
      })().finally(() => { pending = null; });
      return pending;
    }
    const unsubscribe = useUserStore.subscribe((s, prev) => {
      if (applying || s.updatedAt === prev.updatedAt) return;
      clearTimeout(timer);
      timer = setTimeout(() => void sync(), 1500);
    });
    const visible = () => { if (document.visibilityState === "visible") void sync(); };
    const online = () => { void sync(); };
    const poll = setInterval(visible, 45_000);
    window.addEventListener("online", online);
    document.addEventListener("visibilitychange", visible);
    syncStatus.setSyncNow(sync);
    void sync();
    return () => {
      controller.abort(); unsubscribe(); clearTimeout(timer); clearInterval(poll);
      window.removeEventListener("online", online);
      document.removeEventListener("visibilitychange", visible);
      syncStatus.setSyncNow(null);
    };
  }, [hydrated, status, account]);
  return null;
}
