"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { YgIcon } from "@/components/yg-icons";
import { haptic } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface Friend {
  userId: string;
  name: string;
  level: number;
  xp: number;
  streak: number;
  updatedAt: number | null;
}

/**
 * Друзья: чей стрик длиннее.
 *
 * Знакомство по одноразовому коду, тому же, что и для внешних сервисов
 * (/api/keys/pair): показал код — друг ввёл — связь взаимная. Ни поиска
 * по людям, ни заявок: и то и другое требует публичного каталога
 * аккаунтов, а это совсем другой продукт по части приватности.
 *
 * Видно только имя, уровень и серию — ничего из задач и расписания.
 */
export default function FriendsCard() {
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/social", { cache: "no-store" });
      if (!res.ok) return setFriends([]);
      const json = (await res.json()) as { friends?: Friend[] };
      setFriends(json.friends ?? []);
    } catch {
      setFriends([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** Свой код показываем только по кнопке: он одноразовый и живёт 10 минут. */
  const getCode = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/keys/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const json = (await res.json()) as { code?: string };
      setCode(json.code ?? null);
      if (!json.code) setError("Не получилось создать код");
    } catch {
      setError("Нет связи");
    } finally {
      setBusy(false);
    }
  }, []);

  const add = useCallback(async () => {
    const value = input.trim();
    if (!value) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "Не получилось");
        return;
      }
      haptic("success");
      setInput("");
      await load();
    } catch {
      setError("Нет связи");
    } finally {
      setBusy(false);
    }
  }, [input, load]);

  const remove = useCallback(
    async (friendId: string) => {
      await fetch("/api/social", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId }),
      }).catch(() => {});
      await load();
    },
    [load],
  );

  return (
    <section className="rounded-3xl surface p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[15px] font-semibold">Друзья</p>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setError(null);
          }}
          className="press text-[14px] text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
        >
          + По коду
        </button>
      </div>

      {friends === null ? (
        <p className="mt-2 text-[13px] text-[var(--color-muted)]">Загружаю…</p>
      ) : friends.length === 0 ? (
        <p className="mt-2 text-[13px] leading-snug text-[var(--color-muted)]">
          Обменяйся кодом с другом — увидите серии друг друга.
        </p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {friends.map((f, i) => (
            <li
              key={f.userId}
              className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface-2)] px-3.5 py-2.5"
            >
              <span
                className={cn(
                  "w-4 shrink-0 text-center text-[13px] tabular-nums",
                  i === 0 ? "font-bold text-[var(--color-fg)]" : "text-[var(--color-muted)]",
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{f.name}</span>
                <span className="mt-0.5 block text-[12px] text-[var(--color-muted)]">
                  Уровень {f.level} · {f.xp} XP
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-[14px] font-semibold tabular-nums">
                <YgIcon name="flame" className="h-4 w-4 text-[var(--color-strength)]" />
                {f.streak}
              </span>
              <button
                type="button"
                onClick={() => void remove(f.userId)}
                aria-label={`Убрать ${f.name}`}
                className="press shrink-0 text-[var(--color-muted)]"
              >
                <YgIcon name="close" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Друзья">
        <p className="text-[15px] leading-snug text-[var(--color-fg-dim)]">
          Покажи свой код другу или введи его код. Видно будет только имя,
          уровень и серию.
        </p>

        <div className="mt-5">
          <p className="inset-title">Мой код</p>
          {code ? (
            <p className="rounded-2xl bg-[var(--color-surface-2)] px-4 py-3 text-center font-mono text-[22px] tracking-[0.2em]">
              {code}
            </p>
          ) : (
            <Button className="w-full" disabled={busy} onClick={() => void getCode()}>
              Показать код
            </Button>
          )}
          {code && (
            <p className="mt-2 text-[13px] text-[var(--color-muted)]">
              Живёт 10 минут и срабатывает один раз.
            </p>
          )}
        </div>

        <div className="mt-5">
          <p className="inset-title">Код друга</p>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={16}
              className="h-11 min-w-0 flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 font-mono text-[16px] tracking-widest outline-none"
            />
            <Button variant="primary" disabled={busy || !input.trim()} onClick={() => void add()}>
              Добавить
            </Button>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-center text-[13px] text-[var(--color-strength)]">{error}</p>
        )}
      </Modal>
    </section>
  );
}
