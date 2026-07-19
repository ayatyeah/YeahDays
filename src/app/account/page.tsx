"use client";

import { useEffect, useMemo, useState } from "react";
import Buddy from "@/components/Buddy";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  useUserStore,
  useHydrated,
  selectTotalXp,
} from "@/store/useUserStore";
import { levelForXp } from "@/lib/leveling";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function AccountPage() {
  const name = useUserStore((s) => s.name);
  const createdAt = useUserStore((s) => s.createdAt);
  const tasks = useUserStore((s) => s.tasks);
  const hydrated = useHydrated();
  const setName = useUserStore((s) => s.setName);
  const resetAll = useUserStore((s) => s.resetAll);

  const level = useMemo(() => levelForXp(selectTotalXp(tasks)), [tasks]);

  const [draft, setDraft] = useState(name);
  const [confirmReset, setConfirmReset] = useState(false);
  const [installEvt, setInstallEvt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => setDraft(name), [name]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const memberSince = useMemo(() => {
    if (!hydrated) return "";
    try {
      return new Date(createdAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }, [createdAt, hydrated]);

  const dirty = draft.trim() !== name && draft.trim().length > 0;

  async function install() {
    if (!installEvt) return;
    await installEvt.prompt();
    await installEvt.userChoice;
    setInstallEvt(null);
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Аккаунт" />

      {/* профиль */}
      <div className="mb-6 flex flex-col items-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <Buddy level={level} size={130} />
        <p className="mt-3 text-lg font-semibold">{name}</p>
        {memberSince && (
          <p className="text-xs text-[var(--color-muted)]">
            с нами с {memberSince}
          </p>
        )}
      </div>

      {/* имя */}
      <section className="mb-6">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--color-muted)]">
          Имя
        </label>
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={24}
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 outline-none focus:border-[var(--color-fg-dim)]"
          />
          <Button
            variant="primary"
            disabled={!dirty}
            onClick={() => setName(draft)}
          >
            Сохранить
          </Button>
        </div>
      </section>

      {/* установка PWA */}
      <section className="mb-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm font-medium">Установить как приложение</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Добавь YeahDays на главный экран и запускай как обычное приложение —
            работает и офлайн.
          </p>
          {installEvt ? (
            <Button variant="surface" size="sm" className="mt-3" onClick={install}>
              Установить
            </Button>
          ) : (
            <p className="mt-3 text-xs text-[var(--color-fg-dim)]">
              В браузере: меню → «Установить приложение» / «На экран “Домой”».
            </p>
          )}
        </div>
      </section>

      {/* сброс */}
      <section className="mt-auto">
        <Button
          variant="danger"
          className="w-full"
          onClick={() => setConfirmReset(true)}
        >
          Сбросить прогресс
        </Button>
      </section>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Сбросить прогресс?"
      >
        <p className="text-sm text-[var(--color-fg-dim)]">
          Все задачи, опыт и уровень будут удалены безвозвратно. Персонаж
          вернётся в самое начало.
        </p>
        <div className="mt-5 flex gap-2">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setConfirmReset(false)}
          >
            Отмена
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              resetAll();
              setConfirmReset(false);
            }}
          >
            Сбросить
          </Button>
        </div>
      </Modal>
    </div>
  );
}
