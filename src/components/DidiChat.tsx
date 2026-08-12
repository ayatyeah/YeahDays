"use client";

import { useEffect, useRef, useState } from "react";
import { getUserId } from "@/lib/userId";
import { cn } from "@/lib/cn";

const POLL_MS = 2000;

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
}

/**
 * Текстовый чат с ДиДи. Сообщения идут через сервер (не напрямую в
 * локальный процесс ДиДи — тот же повод, что у DidiPanel: HTTPS-страница
 * не достучится до локального HTTP-процесса без танцев с mixed content).
 * ДиДи вычитывает очередь через /api/assistant/chat/pull своим циклом
 * (assistant/src/chat.ts) — если процесс сейчас не запущен, сообщение
 * просто ждёт в очереди до следующего его старта.
 */
export default function DidiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const params = new URLSearchParams({ userId });
        const res = await fetch(`/api/assistant/chat?${params}`);
        if (!res.ok) return;
        const data = (await res.json()) as { messages: ChatMessage[] };
        if (!cancelled) setMessages(data.messages);
      } catch {
        // сеть моргнула — попробуем на следующем тике
      }
    };

    void poll();
    const id = window.setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const last = messages.at(-1);
    if (last && last.id !== lastIdRef.current) {
      lastIdRef.current = last.id;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const send = async () => {
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setDraft("");
    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: getUserId(), content }),
      });
      if (res.ok) {
        const data = (await res.json()) as { message: ChatMessage };
        setMessages((prev) => [...prev, data.message]);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="flex flex-1 flex-col rounded-3xl surface p-4">
      <h2 className="mb-3 text-[13px] font-semibold text-[var(--color-fg-dim)]">Чат</h2>

      <div className="flex min-h-[280px] flex-1 flex-col gap-2 overflow-y-auto">
        {messages.length === 0 && (
          <p className="my-auto text-center text-[12.5px] text-[var(--color-muted)]">
            Напиши что-нибудь — СалемАй ответит, как только процесс на ноуте это увидит.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-snug",
                m.role === "user"
                  ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
                  : "bg-[var(--color-surface-2)] text-[var(--color-fg)]",
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder="Написать СалемАй…"
          maxLength={2000}
          className="h-11 min-w-0 flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 text-[13.5px] outline-none focus:border-[var(--color-fg-dim)]"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={!draft.trim() || sending}
          className="h-11 shrink-0 rounded-2xl bg-[var(--color-fg)] px-4 text-[13px] font-medium text-[var(--color-bg)] transition disabled:opacity-40"
        >
          Отправить
        </button>
      </div>
    </section>
  );
}
