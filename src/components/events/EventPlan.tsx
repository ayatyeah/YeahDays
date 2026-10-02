"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { dateKey } from "@/lib/domain";
import { planDays, type Progress } from "@/lib/events/engine";
import { loadPref, savePref } from "@/lib/events/storage";
import type { StudyEvent } from "@/lib/events/types";
import { useUserStore } from "@/store/useUserStore";
import { useSyncStatus } from "@/store/useSyncStatus";
import { useContentLang } from "@/i18n/locale";

const field = "mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-base";
const dayLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "short" });

/**
 * «Квиз такого-то числа» → план по дням в «Сегодня».
 *
 * Ивент без срока откладывается на потом. Здесь человек называет дату квиза,
 * а оставшиеся шаги раскладываются по дням до неё и становятся обычными
 * делами со временем — с ними работают уже существующие напоминания, и
 * отдельной системы уведомлений ивентам не нужно.
 *
 * Дела помечаются в заметке меткой ивента: при пересчёте плана старые
 * невыполненные дела этого ивента заменяются, а не дублируются.
 */
export default function EventPlan({ event, progress }: { event: StudyEvent; progress: Progress }) {
  const tl = useContentLang();
  const today = dateKey();
  const [exam, setExam] = useState("");
  const [time, setTime] = useState("19:00");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setExam(loadPref(`exam:${event.id}`, ""));
    setTime(loadPref(`time:${event.id}`, "19:00"));
  }, [event.id]);

  const valid = /^\d{4}-\d{2}-\d{2}$/.test(exam) && exam >= today;
  const plan = useMemo(() => (valid ? planDays(event, progress, today, exam) : []), [valid, event, progress, today, exam]);
  const daysLeft = valid ? Math.round((Date.parse(`${exam}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86_400_000) : null;
  const marker = `[event:${event.id}:`;

  async function addToToday() {
    const store = useUserStore.getState();
    const [hour, minute] = time.split(":").map(Number);
    // Прежний план этого ивента убираем, но сделанное не трогаем.
    for (const todo of store.todos) {
      if (todo.note?.includes(marker) && !todo.done && todo.date >= today) store.removeTodo(todo.id);
    }
    for (const day of plan) {
      useUserStore.getState().addTodo({
        title: `${event.title}: ${day.steps.length === 1 ? day.steps[0].title[tl] : `${day.steps.length} шага`}`,
        date: day.date,
        hour,
        minute: Math.floor(minute / 10) * 10,
        duration: day.minutes,
        note: `${day.steps.map((s) => `• ${s.title[tl]}`).join("\n")}\nОткрой «Учёба → Ивенты». ${marker}${day.date}]`,
      });
    }
    savePref(`exam:${event.id}`, exam);
    savePref(`time:${event.id}`, time);
    await useSyncStatus.getState().syncNow?.();
    setMessage(`В план добавлено дней: ${plan.length}. Дела появятся в «Сегодня» в свои даты, напоминания придут как для обычных дел со временем.`);
  }

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-lg font-bold">Когда квиз?</h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">Укажи дату — оставшиеся шаги разложатся по дням и попадут в твой план с напоминаниями.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="block text-sm">
          Дата квиза
          <input type="date" className={field} min={today} value={exam} onChange={(e) => { setExam(e.target.value); setMessage(""); }} />
        </label>
        <label className="block text-sm">
          Во сколько заниматься
          <input type="time" step={600} className={field} value={time} onChange={(e) => { setTime(e.target.value); setMessage(""); }} />
        </label>
      </div>

      {exam && !valid && <p role="alert" className="mt-3 text-sm text-[var(--color-strength)]">Дата квиза не может быть в прошлом.</p>}
      {valid && plan.length === 0 && <p className="mt-3 text-sm">Все шаги уже пройдены — план не нужен. Перед квизом повтори итоговый квиз и карточки.</p>}
      {valid && plan.length > 0 && (
        <>
          <p className="mt-4 text-sm">
            {daysLeft === 0 ? "Квиз сегодня" : `До квиза ${daysLeft} дн.`} · осталось шагов: {plan.reduce((n, d) => n + d.steps.length, 0)}
          </p>
          <ol className="mt-3 space-y-2">
            {plan.map((day) => (
              <li key={day.date} className="rounded-2xl border border-[var(--color-border)] p-3 text-sm">
                <div className="flex justify-between gap-3">
                  <strong>{day.date === today ? "Сегодня" : dayLabel(day.date)}</strong>
                  <span className="shrink-0 text-[var(--color-muted)]">≈ {day.minutes} мин</span>
                </div>
                <p className="mt-1 break-words text-[var(--color-muted)]">{day.steps.map((s) => s.title[tl]).join(" · ")}</p>
              </li>
            ))}
          </ol>
          <Button variant="primary" className="mt-4 h-auto min-h-11 w-full whitespace-normal" onClick={() => void addToToday()}>
            Добавить в мой план
          </Button>
        </>
      )}
      {message && <p role="status" className="mt-3 text-sm">{message}</p>}
    </section>
  );
}
