"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Segmented from "@/components/ui/Segmented";
import { YgIcon } from "@/components/yg-icons";
import { useUserStore } from "@/store/useUserStore";
import { dateKey } from "@/lib/domain";
import { haptic } from "@/lib/motion";
import { cn } from "@/lib/cn";

const DISMISS_KEY = "yg-classes-setup-dismissed";

/** Пн…Вс в привычном порядке; число — getDay() (0 — воскресенье). */
const WEEKDAYS: { day: number; label: string }[] = [
  { day: 1, label: "Пн" },
  { day: 2, label: "Вт" },
  { day: 3, label: "Ср" },
  { day: 4, label: "Чт" },
  { day: 5, label: "Пт" },
  { day: 6, label: "Сб" },
  { day: 0, label: "Вс" },
];

/**
 * Слово в названии выбрано под categorizeTodo: «лекция» и «практика» дают
 * пару её иконку и цвет, а время учёбы попадает в недельный свод по часам.
 */
const FORMATS = [
  { key: "лекция", label: "Лекция" },
  { key: "практика", label: "Практика" },
  { key: "лаба", label: "Лаба" },
] as const;
type Format = (typeof FORMATS)[number]["key"];

const DURATIONS = [50, 60, 90, 120].map((m) => ({ key: m, label: String(m), sub: "мин" }));

/**
 * Первый день: «Добавь свои пары».
 *
 * Новый человек после регистрации видит колоду, но пустое расписание — и
 * приложение выглядит как ещё один список дел. Отличие YeahGrind в том,
 * что он знает твой день: свободные окна, напоминание перед парой, колода
 * под расписание. Всё это оживает, только когда в плане есть пары, поэтому
 * даём добавить их сразу и на всю неделю одной формой: предмет, дни, время.
 * Каждая пара — повторяющаяся задача «раз в неделю» в свой день.
 *
 * Карточка исчезает сама, как только в плане появилась хоть одна
 * повторяющаяся задача со временем, или по крестику — навсегда.
 */
export default function ClassesSetup() {
  const todos = useUserStore((s) => s.todos);
  const addTodo = useUserStore((s) => s.addTodo);

  const [dismissed, setDismissed] = useState(true);
  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [format, setFormat] = useState<Format>("лекция");
  const [days, setDays] = useState<number[]>([]);
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(90);
  /** что уже добавлено в этом окне — видно, что форма сработала */
  const [added, setAdded] = useState<string[]>([]);

  const hasSchedule = useMemo(
    () => todos.some((t) => t.repeat && t.hour !== undefined && t.source !== "lms"),
    [todos],
  );

  if ((hasSchedule || dismissed) && !open) return null;

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* приватный режим — карточка просто вернётся в следующий раз */
    }
  }

  const [hh, mm] = time.split(":").map(Number);
  const valid = subject.trim().length > 0 && days.length > 0 && Number.isFinite(hh);

  function save() {
    if (!valid) return;
    const title = `${subject.trim()} — ${format}`;
    // Минуты в плане идут шагом 10. Округляем вниз, а не к ближайшему:
    // пара в 10:45 иначе стала бы 10:50, и напоминание «за 5 минут» пришло
    // бы ровно к началу. Вниз — в худшем случае напомнит чуть раньше.
    const minute = Math.floor((mm || 0) / 10) * 10;
    const today = dateKey();
    for (const weekday of days) {
      addTodo({
        title,
        date: today,
        hour: hh,
        minute,
        duration,
        repeat: { kind: "weekly", weekday },
      });
    }
    haptic("success");
    const names = WEEKDAYS.filter((w) => days.includes(w.day)).map((w) => w.label).join(", ");
    setAdded((a) => [...a, `${title} · ${names} · ${time}`]);
    // дни и время чаще всего повторяются у следующего предмета — оставляем
    setSubject("");
  }

  return (
    <>
      <section className="relative mb-5 rounded-3xl surface p-5 lg:mb-0">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Скрыть"
          className="press absolute right-3 top-3 p-2 text-[var(--color-muted)]"
        >
          <YgIcon name="close" className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <YgIcon name="lecture" className="mt-0.5 h-6 w-6 shrink-0" />
          <div className="min-w-0">
            <p className="text-[16px] font-semibold">Добавь свои пары</p>
            <p className="mt-1 text-[14px] leading-snug text-[var(--color-muted)]">
              Я покажу свободные окна между ними и напомню за 5 минут до начала.
            </p>
          </div>
        </div>
        <Button variant="primary" className="mt-4 w-full" onClick={() => setOpen(true)}>
          Добавить расписание
        </Button>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Расписание пар">
        <div className="space-y-4">
          <div>
            <p className="inset-title">Предмет</p>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Например: Матанализ"
              maxLength={60}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] outline-none"
            />
          </div>

          <div>
            <p className="inset-title">Формат</p>
            <Segmented id="class-format" options={[...FORMATS]} value={format} onChange={setFormat} />
          </div>

          <div>
            <p className="inset-title">Дни</p>
            <div className="flex gap-1.5">
              {WEEKDAYS.map((w) => {
                const on = days.includes(w.day);
                return (
                  <button
                    key={w.day}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      setDays((d) => (on ? d.filter((x) => x !== w.day) : [...d, w.day]))
                    }
                    className={cn(
                      "press h-10 flex-1 rounded-xl text-[14px] font-medium",
                      on
                        ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
                        : "bg-[var(--color-surface-2)] text-[var(--color-fg-dim)]",
                    )}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-[38%] shrink-0">
              <p className="inset-title">Начало</p>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value || "09:00")}
                className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[16px] tabular-nums outline-none"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="inset-title">Длится</p>
              <Segmented id="class-duration" options={DURATIONS} value={duration} onChange={setDuration} />
            </div>
          </div>
        </div>

        {added.length > 0 && (
          <ul className="mt-4 space-y-1">
            {added.map((a, i) => (
              <li key={i} className="flex items-center gap-2 text-[13px] text-[var(--color-fg-dim)]">
                <YgIcon name="check" className="h-3.5 w-3.5 shrink-0 text-[var(--color-stability)]" />
                <span className="truncate">{a}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex gap-2.5">
          {added.length > 0 && (
            <Button className="flex-1" onClick={() => setOpen(false)}>
              Готово
            </Button>
          )}
          <Button variant="primary" className="flex-1" disabled={!valid} onClick={save}>
            {added.length > 0 ? "Добавить ещё" : "Добавить"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
