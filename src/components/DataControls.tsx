"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

/**
 * Управление своими данными: выгрузить и удалить.
 *
 * Показывается только вошедшим — у анонимного устройства нет ни аккаунта,
 * который можно удалить, ни надёжного способа подтвердить, что данные его.
 */
export default function DataControls() {
  const { data: session } = useSession();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session?.user) return null;

  async function exportData() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "yeahgrind-export.json";
      a.click();
      URL.revokeObjectURL(href);
    } catch {
      setError("Не удалось выгрузить. Попробуй ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteAccount() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) throw new Error();
      // локальные данные тоже стираем, иначе синхронизация вернёт их обратно
      try {
        localStorage.removeItem("yeahdays-store");
        localStorage.removeItem("yd-uid");
        localStorage.removeItem("yd-event-queue");
      } catch {}
      await signOut({ callbackUrl: "/" });
    } catch {
      setError("Не удалось удалить. Попробуй ещё раз.");
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="flex flex-col gap-2.5">
        <button
          onClick={exportData}
          disabled={busy}
          className="h-11 w-full rounded-2xl surface text-[16px] font-medium transition active:scale-[0.99] disabled:opacity-60"
        >
          Выгрузить данные
        </button>
        <button
          onClick={() => setConfirming(true)}
          disabled={busy}
          className="h-11 w-full rounded-2xl border border-[var(--color-border)] text-[16px] font-medium text-[var(--color-strength)] transition active:scale-[0.99] disabled:opacity-60"
        >
          Удалить аккаунт
        </button>
      </div>

      {error && (
        <p className="mt-2 text-center text-[13px] text-[var(--color-strength)]">
          {error}
        </p>
      )}

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Удалить аккаунт?"
      >
        <p className="text-[15px] leading-snug text-[var(--color-fg-dim)]">
          Будут стёрты профиль, весь прогресс, история действий и подписки на
          уведомления — на сервере и на этом устройстве. Это нельзя отменить.
        </p>
        <p className="mt-2 text-[15px] leading-snug text-[var(--color-muted)]">
          Хочешь сохранить копию — сначала выгрузи данные.
        </p>
        <div className="mt-5 flex gap-2.5">
          <Button className="flex-1" onClick={() => setConfirming(false)}>
            Отмена
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={deleteAccount}
          >
            {busy ? "Удаляю…" : "Удалить"}
          </Button>
        </div>
      </Modal>
    </section>
  );
}
