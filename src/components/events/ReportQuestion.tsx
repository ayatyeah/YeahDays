"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

/**
 * «Сообщить об ошибке в вопросе».
 *
 * Вопросы писались по конспекту, и неточность первым заметит тот, кто
 * готовится. Сообщение уходит владельцу в /admin вместе с самим вопросом.
 */
export default function ReportQuestion({ eventId, questionId }: { eventId: string; questionId: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  if (state === "sent") return <p role="status" className="mt-2 text-xs text-[var(--color-muted)]">Спасибо — сообщение отправлено.</p>;
  if (!open) {
    return <button className="mt-2 block text-xs underline text-[var(--color-muted)]" onClick={() => setOpen(true)}>Сообщить об ошибке в вопросе</button>;
  }

  async function send() {
    setState("sending");
    setError("");
    try {
      const response = await fetch(`/api/study-events/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, text }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Не удалось отправить");
      setState("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось отправить");
      setState("idle");
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <label className="block text-xs">
        Что не так с вопросом или ответом?
        <textarea
          className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-base"
          rows={2}
          maxLength={500}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Например: верным должен быть другой вариант, потому что…"
        />
      </label>
      {error && <p role="alert" className="text-xs text-[var(--color-strength)]">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" disabled={state === "sending" || text.trim().length < 5} onClick={() => void send()}>
          {state === "sending" ? "Отправляем…" : "Отправить"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
      </div>
    </div>
  );
}
