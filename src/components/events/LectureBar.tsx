"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface BarItem {
  /** id секции на странице, к которой ведёт кнопка. */
  target: string;
  /** Короткая метка: «4 · Затраты и группы». */
  label: string;
  /** Пройдено ли (галочка). */
  done?: boolean;
}

/**
 * Лекции ивента — строкой, приклеенной к верху экрана.
 *
 * Маршрут ивента длинный (у PM — восемь экранов), и до лекции 8 приходилось
 * листать мимо всех предыдущих. Строка остаётся наверху, пока листаешь
 * лекции, и одним нажатием раскрывает и показывает нужную (onJump); та,
 * что сейчас на экране, подсвечена.
 */
export default function LectureBar({ items, onJump }: { items: BarItem[]; onJump: (target: string) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const row = useRef<HTMLDivElement>(null);

  // Какая секция сейчас под строкой: верхняя из тех, что пересекают полосу под ней.
  // Наблюдатель пересоздаётся, только когда меняется набор секций, а не на каждую перерисовку.
  const targets = items.map((it) => it.target).join("|");
  useEffect(() => {
    const ids = targets.split("|");
    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const first = ids.find((id) => seen.get(id));
        if (first) setActive(first);
      },
      // Полоса чуть ниже строки: секция «активна», когда её верх ушёл под строку.
      { rootMargin: "-80px 0px -60% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [targets]);

  // Активная кнопка — в зоне видимости строки, если строка уехала вбок.
  useEffect(() => {
    const el = row.current?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!el || !row.current) return;
    const r = row.current;
    if (el.offsetLeft < r.scrollLeft || el.offsetLeft + el.offsetWidth > r.scrollLeft + r.clientWidth) {
      r.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
    }
  }, [active]);

  return (
    <nav
      aria-label="Лекции"
      className="sticky top-0 z-30 -mx-4 bg-[var(--color-bg)]/95 px-4 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur sm:mx-0 sm:px-0"
    >
      <div ref={row} className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
        {items.map((it) => (
          <button
            key={it.target}
            type="button"
            aria-current={active === it.target ? "true" : undefined}
            onClick={() => onJump(it.target)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              active === it.target
                ? "border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg-dim)]",
            )}
          >
            {it.done && <span aria-hidden>✓ </span>}
            {it.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
