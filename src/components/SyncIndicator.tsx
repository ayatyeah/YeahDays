"use client";
import { useSyncStatus } from "@/store/useSyncStatus";
import { useCopy } from "@/i18n/useCopy";
export default function SyncIndicator() {
  const tx = useCopy();
  const baseState = useSyncStatus(s => s.state);
  const writes = useSyncStatus(s => s.writes);
  const writeError = useSyncStatus(s => s.writeError);
  const state = writes > 0 ? "syncing" : baseState;
  const online = useSyncStatus(s => s.online);
  const storageError = useSyncStatus(s => s.storageError);
  const retry = useSyncStatus(s => s.syncNow);
  const label = writeError ? "Не удалось сохранить — повтори действие" : storageError ? "Не удалось сохранить на устройстве" : !online ? "Нет сети — изменения на устройстве" : state === "error" ? "Не удалось отправить — повторить" : state === "synced" ? "Сохранено" : state === "idle" ? "Проверяем сохранение" : "Синхронизируем";
  return <div className="sync-indicator" data-ui-i18n data-sync-state={writeError || storageError ? "error" : !online ? "offline" : state}>
    <span role="status" aria-live="polite" aria-atomic="true">{tx(label)}</span>
    {!writeError && state === "error" && online && <button type="button" onClick={() => void retry?.()}>{tx("Повторить")}</button>}
  </div>;
}
