"use client";

import { useId, useState, type FormEvent } from "react";
import { useCopy } from "@/i18n/useCopy";
import { permissionState, requestPermission, showNow } from "@/lib/notify";
import Button from "@/components/ui/Button";

export default function SelfNotification() {
  const tx = useCopy();
  const fieldId = useId();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    setStatus("");
    try {
      let permission = permissionState();
      if (permission === "default") permission = await requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "unsupported"
          ? "Открой установленное приложение YeahGrind на устройстве с поддержкой уведомлений."
          : "Для отправки разреши уведомления YeahGrind в настройках устройства или браузера.");
        return;
      }
      const sent = await showNow({ title: "YeahGrind", body, tag: crypto.randomUUID(), url: "/settings#self-notification" });
      if (sent) {
        setText("");
        setStatus("Уведомление отправлено на это устройство.");
      } else {
        setStatus("Не удалось показать уведомление. Проверь настройки и попробуй ещё раз.");
      }
    } finally {
      setBusy(false);
    }
  }

  return <form id="self-notification" onSubmit={send} className="inset-group mb-3 grid scroll-mt-24 gap-3 p-4">
    <label htmlFor={fieldId} className="font-semibold">{tx("Уведомление себе")}</label>
    <textarea id={fieldId} value={text} disabled={busy} rows={3} maxLength={1000}
      className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-base"
      placeholder={tx("Текст уведомления")} onChange={e => { setText(e.target.value); setStatus(""); }} />
    <Button type="submit" variant="primary" disabled={busy || !text.trim()}>{tx("Отправить на это устройство")}</Button>
    <p role="status" className="empty:hidden text-sm">{status && tx(status)}</p>
  </form>;
}
