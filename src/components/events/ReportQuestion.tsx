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

  if (state === "sent") return <p role="status" className="mt-2 text-xs text-[var(--color-muted)]">Thank you — your report has been sent.</p>;
  if (!open) {
    return <button className="mt-2 block text-xs underline text-[var(--color-muted)]" onClick={() => setOpen(true)}>Report an issue with this question</button>;
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
      if (!response.ok) throw new Error(body.error || "Could not send your report");
      setState("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send your report");
      setState("idle");
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <label className="block text-xs">
        What is wrong with the question or answer?
        <textarea
          className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-base"
          rows={2}
          maxLength={500}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="For example: another option should be correct because…"
        />
      </label>
      {error && <p role="alert" className="text-xs text-[var(--color-strength)]">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" disabled={state === "sending" || text.trim().length < 5} onClick={() => void send()}>
          {state === "sending" ? "Sending…" : "Send report"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}
