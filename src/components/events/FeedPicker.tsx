"use client";

import Button from "@/components/ui/Button";
import { useContentLang } from "@/i18n/locale";
import { lectureNumber, videoShelves, type FeedScope, type Shelf } from "@/lib/events/feed";
import { shortTitle } from "@/lib/events/route";
import type { StudyEvent } from "@/lib/events/types";

const panel = "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5";

/** «12 видео · 14 мин» — «видео» не склоняется, и перевод ловит строку одним образцом. */
const amount = ({ count, seconds }: Shelf) => `${count} видео · ${Math.max(1, Math.round(seconds / 60))} мин`;

/**
 * Выбор ленты роликов: все подряд, одна лекция или одна её часть. Лекции и
 * части без роликов не показываются — их темы есть в ленте по конспектам.
 */
export default function FeedPicker({ event, onPick, onExit }: { event: StudyEvent; onPick: (scope: FeedScope) => void; onExit: () => void }) {
  const tl = useContentLang();
  const shelves = videoShelves(event);
  // Ролики есть не у всех частей — тогда отдельно ещё и лента по конспектам, где у остальных частей клипы.
  const partial = shelves.lectures.some((l) => l.parts.some((p) => p.count === 0));
  return (
    <>
      <header>
        <button className="text-sm underline" onClick={onExit}>← К маршруту</button>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{event.course}</p>
        <h1 className="mt-2 text-2xl font-bold">🎬 Ролики</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Листай как в TikTok: после каждого ролика — два вопроса «Проверь себя». Смотри всё подряд или только нужную тему.</p>
      </header>

      <section className="rounded-3xl border border-violet-400/40 bg-gradient-to-br from-violet-500/20 via-[var(--color-surface)] to-sky-500/15 p-5">
        <h2 className="text-lg font-bold">Все ролики</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{amount(shelves)}</p>
        <Button variant="primary" className="mt-3 h-auto min-h-11 w-full whitespace-normal" onClick={() => onPick({ kind: "videos" })}>▶ Смотреть все</Button>
        {partial && (
          <Button className="mt-2 h-auto min-h-11 w-full whitespace-normal" onClick={() => onPick({ kind: "all" })}>Лента по всем лекциям: ролики и клипы по конспекту</Button>
        )}
      </section>

      {event.lectures.map((lecture, li) => {
        const shelf = shelves.lectures[li];
        if (!shelf.count) return null;
        return (
          <section key={lecture.id} className={panel} aria-label={lectureNumber(event, li)}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{lectureNumber(event, li)}</p>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold">{shortTitle(lecture)[tl]}</h2>
                <p className="text-sm text-[var(--color-muted)]">{amount(shelf)}</p>
              </div>
              <Button variant="primary" size="sm" className="h-auto min-h-9 whitespace-normal" onClick={() => onPick({ kind: "lecture", lecture: li })}>▶ Вся лекция</Button>
            </div>
            <ol className="mt-3 space-y-2">
              {lecture.parts.map((part, pi) =>
                shelf.parts[pi].count ? (
                  <li key={part.id}>
                    <button
                      className="flex w-full items-center justify-between gap-3 rounded-2xl bg-[var(--color-bg)] px-4 py-3 text-left transition hover:bg-[var(--color-surface-2)]"
                      onClick={() => onPick({ kind: "part", lecture: li, part: pi })}
                    >
                      <span className="min-w-0">
                        <span className="block text-xs text-[var(--color-muted)]">{`Часть ${pi + 1}`}</span>
                        <span className="block font-semibold leading-snug">{part.title[tl]}</span>
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-[var(--color-muted)]">{amount(shelf.parts[pi])}</span>
                    </button>
                  </li>
                ) : null,
              )}
            </ol>
          </section>
        );
      })}
    </>
  );
}
