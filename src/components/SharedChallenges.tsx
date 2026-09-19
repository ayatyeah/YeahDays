"use client";

import { useCallback, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { YgIcon } from "@/components/yg-icons";
import { haptic } from "@/lib/motion";
import { dateKey } from "@/lib/domain";
import { cn } from "@/lib/cn";
import { useLiveRefresh } from "@/lib/useLiveRefresh";

interface Member {
  userId: string;
  name: string;
  isMe: boolean;
  count: number;
}

interface SharedChallenge {
  id: string;
  title: string;
  unit: string;
  target: number;
  isOwner: boolean;
  members: Member[];
}

/**
 * Общий челлендж: одна норма на всех, видно, кто сегодня закрыл.
 *
 * Прогресс живёт на сервере, а не в локальном сторе: смысл именно в том,
 * что второй участник видит твой плюс. Локальные челленджи (Challenges)
 * остаются отдельно — они про личную норму и работают офлайн.
 */
export default function SharedChallenges() {
  const [items, setItems] = useState<SharedChallenge[] | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  // Строкой, а не числом: при числе стёртое поле тут же превращалось
  // обратно в «1», и набрать «50» было нельзя — выходило «150».
  const [target, setTarget] = useState("1");
  const [unit, setUnit] = useState("раз");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<SharedChallenge | null>(null);
  /**
   * День считаем при каждой загрузке, а не один раз при рендере: раздел не
   * размонтируется, и после полуночи карточка жила бы во вчерашнем дне.
   */
  const [day, setDay] = useState(dateKey);
  /** Сколько нажатий ещё летит на сервер — пока летят, ответы не перетирают экран. */
  const inflight = useRef(new Map<string, number>());

  const load = useCallback(async () => {
    const day = dateKey();
    setDay(day);
    // пока свои нажатия не доехали, свежий список всё равно устарел бы
    if ([...inflight.current.values()].some((n) => n > 0)) return;
    try {
      const res = await fetch(`/api/social/challenge?day=${day}`, { cache: "no-store" });
      if (!res.ok) return setItems([]);
      const json = (await res.json()) as { challenges?: SharedChallenge[] };
      setItems(json.challenges ?? []);
    } catch {
      setItems([]);
    }
  }, []);

  useLiveRefresh(load);

  const create = useCallback(async () => {
    const value = title.trim();
    const norm = Math.min(999, Math.max(1, Math.round(Number(target)) || 1));
    if (!value) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/social/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value, unit, target: norm }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "Не получилось");
        return;
      }
      haptic("success");
      setTitle("");
      setTarget("1");
      setOpen(false);
      await load();
    } catch {
      setError("Нет связи");
    } finally {
      setBusy(false);
    }
  }, [title, unit, target, load]);

  /**
   * Плюс/минус подход. Цифра меняется сразу, сервер догоняет.
   *
   * Раньше каждое нажатие ждало ответа и полной перезагрузки списка — на
   * мобильной сети это полсекунды тишины после тапа, а быстрые нажатия
   * гонялись между собой. Теперь экран верит нажатию, а ответ сервера
   * (он атомарный и знает правду) применяем, только когда нажатий в пути
   * не осталось — иначе он откатил бы ещё не доехавшие.
   */
  const bump = useCallback(
    async (id: string, delta: number) => {
      haptic(delta > 0 ? "success" : "select");
      const patch = (fn: (count: number) => number) =>
        setItems((prev) =>
          prev?.map((c) =>
            c.id !== id
              ? c
              : { ...c, members: c.members.map((m) => (m.isMe ? { ...m, count: fn(m.count) } : m)) },
          ) ?? prev,
        );
      patch((n) => Math.max(0, n + delta));
      inflight.current.set(id, (inflight.current.get(id) ?? 0) + 1);
      let server: number | null = null;
      try {
        const res = await fetch("/api/social/challenge", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, day, delta }),
        });
        const json = (await res.json()) as { count?: number };
        if (typeof json.count === "number") server = json.count;
      } catch {
        /* офлайн — сверимся при следующем обновлении */
      }
      const left = (inflight.current.get(id) ?? 1) - 1;
      inflight.current.set(id, left);
      if (left === 0) {
        if (server !== null) patch(() => server!);
        else void load();
      }
    },
    [day, load],
  );

  const leave = useCallback(
    async (id: string) => {
      await fetch("/api/social/challenge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }).catch(() => {});
      await load();
    },
    [load],
  );

  return (
    <section className="rounded-3xl surface p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[15px] font-semibold">Общий челлендж</p>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setError(null);
          }}
          className="press text-[14px] text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
        >
          + Новый
        </button>
      </div>

      {items === null ? (
        <p className="mt-2 text-[13px] text-[var(--color-muted)]">Загружаю…</p>
      ) : items.length === 0 ? (
        <p className="mt-2 text-[13px] leading-snug text-[var(--color-muted)]">
          Одна норма на двоих: видно, кто сегодня закрыл, а кто нет.
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {items.map((c) => (
            <div key={c.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="min-w-0 truncate text-[14px] font-medium">{c.title}</p>
                <span className="shrink-0 text-[12px] text-[var(--color-muted)]">
                  норма {c.target} {c.unit}
                </span>
              </div>

              <ul className="mt-2 space-y-1.5">
                {c.members.map((m) => {
                  const done = m.count >= c.target;
                  return (
                    <li
                      key={m.userId}
                      className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface-2)] px-3.5 py-2"
                    >
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-[14px]",
                          m.isMe && "font-semibold",
                        )}
                      >
                        {m.name}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 text-[14px] tabular-nums",
                          done ? "text-[var(--color-stability)]" : "text-[var(--color-muted)]",
                        )}
                      >
                        {m.count} / {c.target}
                      </span>
                      {done && (
                        <YgIcon
                          name="check"
                          className="h-4 w-4 shrink-0 text-[var(--color-stability)]"
                          strokeWidth={2.4}
                        />
                      )}
                      {m.isMe && (
                        <span className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => void bump(c.id, -1)}
                            aria-label="Убрать подход"
                            className="press flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-surface)] text-[16px] leading-none"
                          >
                            −
                          </button>
                          <button
                            type="button"
                            onClick={() => void bump(c.id, 1)}
                            aria-label="Добавить подход"
                            className="press flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-fg)] text-[16px] leading-none text-[var(--color-bg)]"
                          >
                            +
                          </button>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => setLeaving(c)}
                className="press mt-1.5 text-[12px] text-[var(--color-muted)]"
              >
                Выйти из челленджа
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Общий челлендж">
        <p className="text-[15px] leading-snug text-[var(--color-fg-dim)]">
          Одна норма на каждый день для тебя и всех твоих друзей. Видно, кто
          сегодня закрыл.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <p className="inset-title">Что делаем</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: 50 отжиманий"
              maxLength={60}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] outline-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <p className="inset-title">Норма в день</p>
              <input
                type="text"
                inputMode="numeric"
                value={target}
                onChange={(e) => setTarget(e.target.value.replace(/\D/g, "").slice(0, 3))}
                onBlur={() => !target && setTarget("1")}
                className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] tabular-nums outline-none"
              />
            </div>
            <div className="flex-1">
              <p className="inset-title">В чём считаем</p>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="раз"
                maxLength={20}
                className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] outline-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-center text-[13px] text-[var(--color-strength)]">{error}</p>
        )}

        <Button
          variant="primary"
          className="mt-5 w-full"
          disabled={busy || !title.trim() || !Number(target)}
          onClick={() => void create()}
        >
          Позвать друзей
        </Button>
      </Modal>

      {/* Выход — с подтверждением: кнопка стоит прямо под счётчиком, и
          промахнуться мимо «+» было проще простого. */}
      <Modal open={leaving !== null} onClose={() => setLeaving(null)} title="Выйти из челленджа?">
        <p className="text-[15px] leading-snug text-[var(--color-fg-dim)]">
          {leaving && leaving.members.length <= 1
            ? "Ты последний участник — челлендж удалится вместе с прогрессом."
            : "Твой прогресс пропадёт. У остальных челлендж останется."}
        </p>
        <div className="mt-5 flex gap-2.5">
          <Button className="flex-1" onClick={() => setLeaving(null)}>
            Отмена
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              if (leaving) void leave(leaving.id);
              setLeaving(null);
            }}
          >
            Выйти
          </Button>
        </div>
      </Modal>
    </section>
  );
}
