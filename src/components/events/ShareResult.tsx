"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { StudyEvent } from "@/lib/events/types";
import { useUserStore } from "@/store/useUserStore";

/**
 * «Поделиться результатом» — картинка с процентом готовности.
 * Тот же механизм, что у карточки прогресса: рисует сервер (/api/share/event),
 * телефон открывает системное «Поделиться», компьютер скачивает файл.
 */
export default function ShareResult({ event, percent, done, total }: { event: StudyEvent; percent: number; done: number; total: number }) {
  const name = useUserStore((s) => s.name);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function share() {
    setBusy(true);
    setNote("");
    try {
      const query = new URLSearchParams({ name, title: event.title, course: event.course, percent: String(percent), done: String(done), total: String(total) });
      const response = await fetch(`/api/share/event?${query.toString()}`);
      if (!response.ok) throw new Error("image");
      const blob = await response.blob();
      const file = new File([blob], "yeahgrind-quiz.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "YeahGrind", text: `${event.title}: готов на ${percent}% — yeahgrind.site` });
        return;
      }
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "yeahgrind-quiz.png";
      a.click();
      URL.revokeObjectURL(href);
      setNote("Картинка сохранена");
    } catch (e) {
      // Закрытое окно «Поделиться» — не ошибка.
      if (!(e instanceof DOMException && e.name === "AbortError")) setNote("Не получилось — попробуй ещё раз");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Button className="h-auto min-h-11 w-full whitespace-normal" disabled={busy} onClick={() => void share()}>
        {busy ? "Готовим картинку…" : "Поделиться результатом"}
      </Button>
      {note && <p role="status" className="mt-2 text-xs text-[var(--color-muted)]">{note}</p>}
    </div>
  );
}
