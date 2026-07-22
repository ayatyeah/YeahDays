"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { getUserId } from "@/lib/userId";
import {
  useUserStore,
  useHydrated,
  pickSync,
  type SyncData,
} from "@/store/useUserStore";

/**
 * Кросс-девайс синхронизация всего прогресса (план/цели/настроение/история).
 *
 * — pull при загрузке и при смене статуса входа (вошёл/вышел);
 * — push с дебаунсом на каждое изменение стора;
 * — разрешение конфликтов last-write-wins по updatedAt.
 *
 * Работает и для анонимного устройства (device-id), и для Google-аккаунта:
 * сервер сам выбирает ключ (сессия → device-id). При входе локальный
 * прогресс уезжает в аккаунт, на другом устройстве — приезжает обратно.
 */
const DEBOUNCE_MS = 1500;

export default function StateSync() {
  const hydrated = useHydrated();
  const { status } = useSession();
  const applyingRemote = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Принять серверный снимок, если он свежее локального. */
  const applyRemote = useCallback((data: SyncData) => {
    if (!data || typeof data.updatedAt !== "number") return;
    if (data.updatedAt <= useUserStore.getState().updatedAt) return;
    applyingRemote.current = true;
    useUserStore.getState().hydrateFromRemote(data);
    // отпускаем флаг после синхронного оповещения подписчиков
    queueMicrotask(() => {
      applyingRemote.current = false;
    });
  }, []);

  const push = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;
    const data = pickSync(useUserStore.getState());
    try {
      const res = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, data }),
        keepalive: true,
      });
      if (!res.ok) return;
      const json = (await res.json()) as {
        applied?: boolean;
        data?: SyncData;
      };
      // сервер оказался свежее (гонка с другим устройством) — принимаем его
      if (json.applied === false && json.data) applyRemote(json.data);
    } catch {
      // офлайн — состояние всё равно в localStorage, синхронизируем позже
    }
  }, [applyRemote]);

  const pull = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const res = await fetch(
        `/api/state?userId=${encodeURIComponent(userId)}`,
        { method: "GET", cache: "no-store" },
      );
      if (!res.ok) return;
      const json = (await res.json()) as { data?: SyncData | null };
      const remote = json.data ?? null;
      if (remote && remote.updatedAt > useUserStore.getState().updatedAt) {
        applyRemote(remote);
      } else {
        // сервер пуст или устарел — заливаем локальный прогресс наверх
        void push();
      }
    } catch {
      // офлайн — попробуем в следующий раз
    }
  }, [applyRemote, push]);

  // push с дебаунсом на каждое реальное изменение (updatedAt меняется)
  useEffect(() => {
    if (!hydrated) return;
    const unsub = useUserStore.subscribe((state, prev) => {
      if (applyingRemote.current) return;
      if (state.updatedAt === prev.updatedAt) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void push(), DEBOUNCE_MS);
    });
    return () => {
      unsub();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [hydrated, push]);

  // pull после гидратации и при каждой смене статуса входа
  useEffect(() => {
    if (!hydrated) return;
    void pull();
  }, [hydrated, status, pull]);

  return null;
}
