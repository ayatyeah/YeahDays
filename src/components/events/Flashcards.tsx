"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { shuffle } from "@/lib/events/engine";
import type { Lang, Term } from "@/lib/events/types";

/**
 * Карточки «термин → определение».
 *
 * Правило одно: карточку, которую не вспомнил, откладываем в конец колоды и
 * встретим ещё раз; колода кончается, когда каждая карточка получила «Знаю».
 * Ничего не сохраняется — это разминка перед квизом, а не ещё один счётчик.
 */
export default function Flashcards({ glossary, lang, onLang }: { glossary: Term[]; lang: Lang; onLang: () => void }) {
  const [queue, setQueue] = useState<Term[]>(() => shuffle(glossary));
  const [flipped, setFlipped] = useState(false);
  const card = queue[0];
  const known = glossary.length - queue.length;

  if (!card) {
    return (
      <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center">
        <p className="text-2xl font-bold">Все {glossary.length} терминов разобраны</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Можно пройти колоду ещё раз — порядок будет другим.</p>
        <Button variant="primary" className="mt-4" onClick={() => { setQueue(shuffle(glossary)); setFlipped(false); }}>Ещё раз</Button>
      </section>
    );
  }

  function next(remembered: boolean) {
    setQueue(remembered ? queue.slice(1) : [...queue.slice(1), card]);
    setFlipped(false);
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
          <div className="h-full rounded-full bg-violet-400 transition-[width]" style={{ width: `${(known / glossary.length) * 100}%` }} />
        </div>
        <span className="shrink-0 text-sm tabular-nums">Знаю {known} из {glossary.length}</span>
      </div>

      <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Термин</p>
        <h2 lang="en" className="mt-2 text-2xl font-bold">{card.term}</h2>
        {flipped ? (
          <div className="mt-4 rounded-2xl bg-[var(--color-surface-2)] p-4">
            <p lang={lang} className="text-[15px] leading-relaxed">{card.def[lang]}</p>
            <button className="mt-2 text-xs underline" onClick={onLang}>{lang === "en" ? "Определение на русском" : "Definition in English"}</button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--color-muted)]">Вспомни определение, потом открой карточку.</p>
        )}
      </section>

      {flipped ? (
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => next(false)}>Ещё повторить</Button>
          <Button variant="primary" onClick={() => next(true)}>Знаю</Button>
        </div>
      ) : (
        <Button variant="primary" className="w-full" onClick={() => setFlipped(true)}>Показать определение</Button>
      )}
    </>
  );
}
