"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { getUserId } from "@/lib/userId";
import {
  useUserStore,
  useHydrated,
  pickSync,
  hasProgress,
  type SyncData,
} from "@/store/useUserStore";
import { useSyncStatus } from "@/store/useSyncStatus";

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
/** чей аккаунт сейчас лежит в локальном сторе этого браузера (см. эффект ниже) */
const ACTIVE_ACCOUNT_KEY = "yd-active-account";

export default function StateSync() {
  const hydrated = useHydrated();
  const { data: session, status } = useSession();
  const applyingRemote = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Принять серверный снимок.
   *
   * По умолчанию — только если он свежее локального (last-write-wins).
   * force обходит это правило: он нужен на свежем устройстве, где локальный
   * updatedAt новее лишь из-за онбординга, а реальной работы нет — тогда
   * аккаунт с историей должен победить, иначе он был бы затёрт пустышкой.
   */
  const applyRemote = useCallback((data: SyncData, force = false) => {
    if (!data || typeof data.updatedAt !== "number") return;
    if (!force && data.updatedAt <= useUserStore.getState().updatedAt) return;
    applyingRemote.current = true;
    useUserStore.getState().hydrateFromRemote(data);
    // прогресс реально приехал с другого устройства — это и есть польза входа
    useSyncStatus.getState().markPulled();
    // отпускаем флаг после синхронного оповещения подписчиков
    queueMicrotask(() => {
      applyingRemote.current = false;
    });
  }, []);

  const push = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;
    const data = pickSync(useUserStore.getState());
    const status = useSyncStatus.getState();
    status.begin();
    try {
      const res = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, data }),
        keepalive: true,
      });
      if (!res.ok) return status.fail();
      const json = (await res.json()) as {
        applied?: boolean;
        data?: SyncData;
      };
      // сервер оказался свежее (гонка с другим устройством) — принимаем его
      if (json.applied === false && json.data) applyRemote(json.data);
      status.markSynced();
    } catch {
      // офлайн — состояние всё равно в localStorage, синхронизируем позже
      status.fail();
    }
  }, [applyRemote]);

  const pull = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;
    const status = useSyncStatus.getState();
    status.begin();
    try {
      const res = await fetch(
        `/api/state?userId=${encodeURIComponent(userId)}`,
        { method: "GET", cache: "no-store" },
      );
      if (!res.ok) return status.fail();
      const json = (await res.json()) as { data?: SyncData | null };
      const remote = json.data ?? null;
      const local = useUserStore.getState();

      // Свежее устройство: аккаунт с историей побеждает пустой локальный стор,
      // даже если тот формально новее (онбординг успел бампнуть updatedAt).
      const adoptAccount =
        !!remote && hasProgress(remote) && !hasProgress(local);

      if (remote && (remote.updatedAt > local.updatedAt || adoptAccount)) {
        applyRemote(remote, adoptAccount);
        status.markSynced();
      } else {
        // сервер пуст или устарел — заливаем локальный прогресс наверх
        await push();
      }
    } catch {
      // офлайн — попробуем в следующий раз
      status.fail();
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

  /*
   * Смена аккаунта в этом браузере (A вышел, вошёл B — или наоборот) не
   * должна тащить за собой то, что осталось от предыдущего юзера в
   * localStorage: иначе pull() ниже сравнит чужие устаревшие данные с
   * реальным состоянием нового юзера и в худшем случае push() их поверх
   * затрёт. Помним, чей аккаунт сейчас в сторе, и при расхождении чистим
   * его перед pull() — пустой стор безопасен (updatedAt: 0 всегда проигрывает
   * LWW), а анонимный след ("" → аккаунт при первом входе) намеренно не
   * трогаем, чтобы не потерять донный перенос через /api/link.
   */
  useEffect(() => {
    if (!hydrated || status === "loading") return;
    const currentKey = session?.user?.id ?? "";
    let lastKey: string | null = null;
    try {
      lastKey = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
    } catch {}
    if (lastKey && lastKey !== currentKey) {
      useUserStore.getState().hardResetLocal();
    }
    try {
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, currentKey);
    } catch {}
    void pull();
  }, [hydrated, status, session?.user?.id, pull]);

  // отдаём наружу принудительную синхронизацию (кнопка в профиле)
  useEffect(() => {
    useSyncStatus.getState().setSyncNow(() => pull());
    return () => useSyncStatus.getState().setSyncNow(null);
  }, [pull]);

  return null;
}
