"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserId } from "@/lib/userId";
import { cn } from "@/lib/cn";

const POLL_MS = 5000;

interface PanelEvent {
  id: string;
  kind: "heard" | "reply" | "tool" | "error";
  text: string;
  at: number;
}

interface PanelState {
  enabled: boolean;
  online: boolean;
  lastSeenAt: number | null;
  events: PanelEvent[];
}

const KIND_LABEL: Record<PanelEvent["kind"], string> = {
  heard: "Услышала",
  reply: "Ответила",
  tool: "Сделала",
  error: "Ошибка",
};

function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return "только что";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч назад`;
  return `${Math.floor(h / 24)} дн назад`;
}

/**
 * Живой статус фонового процесса ДиДи прямо в профиле: работает через
 * поллинг /api/assistant/panel, а не WebSocket — ДиДи и браузер могут
 * быть по разные стороны mixed-content границы (страница на HTTPS,
 * процесс локально на HTTP), поэтому оба говорят с одним и тем же
 * сервером, а не друг с другом напрямую.
 */
export default function DidiPanel({ linkToFull = false }: { linkToFull?: boolean }) {
  const [state, setState] = useState<PanelState | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(`/api/assistant/panel?userId=${encodeURIComponent(userId)}`);
        if (!res.ok) return;
        const data = (await res.json()) as PanelState;
        if (!cancelled) setState(data);
      } catch {
        // сеть моргнула — просто попробуем на следующем тике
      }
    };

    void poll();
    const id = window.setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const toggle = async () => {
    if (!state || pending) return;
    const next = !state.enabled;
    setPending(true);
    setState({ ...state, enabled: next }); // оптимистично — не ждём round-trip
    try {
      await fetch("/api/assistant/panel", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: getUserId(), enabled: next }),
      });
    } finally {
      setPending(false);
    }
  };

  if (!state) return null;

  const statusText = !state.online
    ? "ДиДи офлайн"
    : state.enabled
      ? "ДиДи слушает"
      : "ДиДи на паузе";
  const dotClass = !state.online
    ? "bg-[var(--color-muted)]"
    : state.enabled
      ? "bg-emerald-500"
      : "bg-amber-500";

  return (
    <section className="rounded-3xl surface p-4">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5" aria-hidden>
          <span className={cn("absolute inline-flex h-full w-full rounded-full", dotClass)} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold">{statusText}</p>
          <p className="mt-0.5 text-[11px] text-[var(--color-muted)]">
            {state.lastSeenAt ? `Была на связи: ${timeAgo(state.lastSeenAt)}` : "Ещё не запускалась"}
          </p>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          aria-label={state.enabled ? "Поставить на паузу" : "Включить"}
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-40",
            state.enabled ? "bg-emerald-500" : "bg-[var(--color-border)]",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-6 w-6 rounded-full bg-white transition",
              state.enabled ? "left-[22px]" : "left-0.5",
            )}
          />
        </button>
      </div>

      {state.events.length > 0 && (
        <ul className="mt-3.5 space-y-2 border-t border-[var(--color-border)] pt-3">
          {state.events.slice(0, 8).map((e) => (
            <li key={e.id} className="flex items-start gap-2 text-[11.5px] leading-snug">
              <span
                className={cn(
                  "mt-0.5 shrink-0 font-medium",
                  e.kind === "error" ? "text-red-500" : "text-[var(--color-muted)]",
                )}
              >
                {KIND_LABEL[e.kind]}
              </span>
              <span className="min-w-0 flex-1 truncate text-[var(--color-fg-dim)]">{e.text}</span>
              <span className="shrink-0 text-[10.5px] text-[var(--color-muted)]">
                {timeAgo(e.at)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {linkToFull && (
        <Link
          href="/didi"
          className="mt-3.5 block border-t border-[var(--color-border)] pt-3 text-center text-[12px] font-medium text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
        >
          Открыть чат и полную историю →
        </Link>
      )}
    </section>
  );
}
