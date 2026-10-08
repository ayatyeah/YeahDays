"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import EventNotes from "@/components/EventNotes";
import { cn } from "@/lib/cn";
import type { Lang, StudyEvent } from "@/lib/events/types";
import { useContentLang } from "@/i18n/locale";
import { useTutorDetail } from "@/lib/tutorFocus";

/**
 * Фаст-мод: подготовка за несколько часов. Блоки идут по порядку от самых
 * «баллоёмких»; открыт один, «Дальше» отмечает его прочитанным и открывает
 * следующий. Отметки — на этом устройстве, в готовность не идут.
 */

const storeKey = (userId: string, eventId: string) => `yg-fast:${userId}:${eventId}`;

function loadRead(key: string): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Сколько блоков фаст-мода уже прочитано — для карточки на карте ивента. */
export function fastProgress(userId: string, event: StudyEvent) {
  const ids = new Set(event.fast?.sections.map((s) => s.id) ?? []);
  return loadRead(storeKey(userId, event.id)).filter((id) => ids.has(id)).length;
}

export default function FastMode({
  event,
  userId,
  lang,
  onLang,
  onExit,
  onFinal,
  onMocks,
  onSheet,
}: {
  event: StudyEvent;
  userId: string;
  lang: Lang;
  onLang: () => void;
  onExit: () => void;
  onFinal: () => void;
  onMocks?: () => void;
  onSheet?: () => void;
}) {
  const fast = event.fast!;
  const tl = useContentLang();
  const key = storeKey(userId, event.id);
  const [read, setRead] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const saved = loadRead(key);
    setRead(saved);
    setOpen(fast.sections.find((s) => !saved.includes(s.id))?.id ?? null);
  }, [key, fast]);

  useEffect(() => {
    if (open) refs.current[open]?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [open]);

  const current = fast.sections.find((s) => s.id === open);
  useTutorDetail(current ? { fastId: current.id } : null, current?.title.en ?? "");

  function save(next: string[]) {
    setRead(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* без хранилища отметки проживут до закрытия страницы */
    }
  }

  function toggle(id: string) {
    save(read.includes(id) ? read.filter((x) => x !== id) : [...read, id]);
  }

  function next(id: string) {
    const done = read.includes(id) ? read : [...read, id];
    save(done);
    const i = fast.sections.findIndex((s) => s.id === id);
    setOpen(fast.sections.slice(i + 1).find((s) => !done.includes(s.id))?.id ?? fast.sections[i + 1]?.id ?? null);
  }

  const doneCount = fast.sections.filter((s) => read.includes(s.id)).length;
  const left = fast.sections.filter((s) => !read.includes(s.id)).reduce((n, s) => n + s.minutes, 0);
  const all = doneCount === fast.sections.length;

  return (
    <div className="space-y-4 pb-10">
      <header className="space-y-2">
        <button className="text-sm underline" onClick={onExit}>← К маршруту</button>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{event.course}</p>
        <h1 className="text-2xl font-bold">⚡ Фаст-мод</h1>
        <p className="text-sm text-[var(--color-muted)]" lang={tl}>{fast.intro[tl]}</p>
      </header>

      <section className="sticky top-2 z-10 rounded-2xl border border-amber-400/40 bg-[var(--color-surface)]/95 p-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span>
            Прочитано <b className="tabular-nums">{doneCount}</b> из {fast.sections.length}
          </span>
          <span className="tabular-nums text-[var(--color-muted)]">{all ? "всё пройдено" : `осталось ≈ ${left} мин`}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
          <div className="h-full rounded-full bg-amber-400 transition-[width]" style={{ width: `${(doneCount / fast.sections.length) * 100}%` }} />
        </div>
        <div className="mt-2 flex justify-end">
          <Button size="sm" variant="ghost" className="h-auto min-h-8 whitespace-normal" onClick={onLang}>
            {lang === "en" ? "Перевести на русский" : "Показать оригинал (English)"}
          </Button>
        </div>
      </section>

      <ol className="space-y-2">
        {fast.sections.map((s, i) => {
          const isOpen = open === s.id;
          const done = read.includes(s.id);
          return (
            <li key={s.id} ref={(el) => { refs.current[s.id] = el; }} className="scroll-mt-28">
              <div className={cn("rounded-3xl border bg-[var(--color-surface)]", isOpen ? "border-amber-400/60" : "border-[var(--color-border)]")}>
                <div className="flex items-center gap-3 p-4">
                  <button
                    aria-label={done ? "Снять отметку «прочитано»" : "Отметить прочитанным"}
                    aria-pressed={done}
                    onClick={() => toggle(s.id)}
                    className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm", done ? "border-emerald-400 bg-emerald-500/20" : "border-[var(--color-border-strong)]")}
                  >
                    {done ? "✓" : i + 1}
                  </button>
                  <button className="min-w-0 flex-1 text-left" onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen}>
                    <span className="block font-semibold leading-snug" lang={lang}>{s.title[lang]}</span>
                    <span className="block text-xs text-[var(--color-muted)]">{s.minutes} мин</span>
                  </button>
                  <span aria-hidden className="text-[var(--color-muted)]">{isOpen ? "▴" : "▾"}</span>
                </div>
                {isOpen && (
                  <div className="space-y-4 border-t border-[var(--color-border)] px-4 pb-4 pt-3">
                    <EventNotes text={s.notes[lang]} lang={lang} />
                    <Button variant="primary" className="h-auto min-h-11 w-full whitespace-normal" onClick={() => next(s.id)}>
                      {i + 1 < fast.sections.length ? "Понятно — дальше →" : "Понятно — готово"}
                    </Button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <section className={cn("space-y-3 rounded-3xl border p-5", all ? "border-emerald-400/50 bg-emerald-500/10" : "border-[var(--color-border)] bg-[var(--color-surface)]")}>
        <h2 className="text-lg font-bold">{all ? "Фаст-мод пройден — теперь проверь себя" : "Когда дочитаешь — проверь себя"}</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          <Button variant={all ? "primary" : "surface"} className="h-auto min-h-11 whitespace-normal" onClick={onFinal}>Итоговый квиз</Button>
          {onMocks && <Button className="h-auto min-h-11 whitespace-normal" onClick={onMocks}>Пробные варианты</Button>}
          {onSheet && <Button className="h-auto min-h-11 whitespace-normal" onClick={onSheet}>Шпаргалка</Button>}
        </div>
      </section>
    </div>
  );
}
