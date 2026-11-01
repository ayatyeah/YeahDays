"use client";

import { create } from "zustand";

/**
 * Статус синхронизации с сервером — чтобы вход в аккаунт давал видимый
 * эффект, а не молча менял аватарку. UI показывает: идёт ли обмен, когда
 * последний раз всё сохранилось, что приехало с другого устройства и
 * сколько анонимных действий перенесли в аккаунт.
 *
 * Не персистится: это состояние текущей сессии, а не данные пользователя.
 */
export type SyncState = "idle" | "queued" | "syncing" | "synced" | "error";

interface SyncStatusStore {
  state: SyncState;
  online: boolean;
  writes: number;
  writeError: boolean;
  beginWrite: () => void;
  endWrite: (ok: boolean) => void;
  storageError: boolean;
  setOnline: (online: boolean) => void;
  setStorageError: (error: boolean) => void;
  queue: () => void;
  /** когда последний раз успешно синхронизировались (мс) */
  lastSyncedAt: number | null;
  /** сколько событий перенесено с анонимного устройства при первом входе */
  movedEvents: number | null;
  /** прогресс приехал с другого устройства (значит аккаунт реально помог) */
  pulledRemote: boolean;
  /** принудительная синхронизация — регистрирует StateSync */
  syncNow: (() => Promise<void>) | null;

  begin: () => void;
  markSynced: () => void;
  markPulled: () => void;
  fail: () => void;
  setMoved: (n: number) => void;
  setSyncNow: (fn: (() => Promise<void>) | null) => void;
}

export const useSyncStatus = create<SyncStatusStore>((set) => ({
  state: "idle",
  online: true,
  writes: 0,
  writeError: false,
  beginWrite: () => set(s => ({ writes: s.writes + 1, writeError: s.writes > 0 && s.writeError })),
  endWrite: (ok) => set(s => ({ writes: Math.max(0, s.writes - 1), writeError: s.writeError || !ok })),
  storageError: false,
  setOnline: (online) => set({ online }),
  setStorageError: (storageError) => set({ storageError }),
  queue: () => set({ state: "queued" }),
  lastSyncedAt: null,
  movedEvents: null,
  pulledRemote: false,
  syncNow: null,

  begin: () => set({ state: "syncing" }),
  markSynced: () => set({ state: "synced", lastSyncedAt: Date.now() }),
  markPulled: () => set({ pulledRemote: true }),
  fail: () => set({ state: "error" }),
  setMoved: (n) => set({ movedEvents: n }),
  setSyncNow: (fn) => set({ syncNow: fn }),
}));

/** «только что» / «5 мин назад» — человеческое время последней синхронизации. */
export function timeAgo(ts: number): string {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 10) return "только что";
  if (s < 60) return `${s} сек назад`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} мин назад`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ч назад`;
  return `${Math.round(h / 24)} дн назад`;
}
