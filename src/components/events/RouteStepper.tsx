"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { StopState } from "@/lib/events/route";

/**
 * «Твой маршрут» — лента остановок: пройденные с галочкой, текущая с
 * ореолом, последняя — кубок. Пройденный путь закрашен до текущей.
 *
 * На телефоне остановок больше, чем помещается в ширину, — лента
 * прокручивается вбок и при открытии сама встаёт на текущую остановку
 * (только по горизонтали: страницу вниз не дёргаем).
 */

export interface StepperStop {
  label: string;
  state: StopState;
  final?: boolean;
}

function Trophy() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H5a3 3 0 0 0 3 3M16 6h3a3 3 0 0 1-3 3M12 13v4M9 20h6M10 17h4" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export default function RouteStepper({
  stops,
  title = "Твой маршрут",
  eyebrow,
  onSelect,
  footer,
}: {
  stops: StepperStop[];
  title?: string;
  eyebrow?: string;
  /** Нажатие на остановку; без него остановки — просто картинка. */
  onSelect?: (index: number) => void;
  footer?: ReactNode;
}) {
  const track = useRef<HTMLOListElement>(null);
  const done = stops.filter((s) => s.state === "done").length;
  const current = stops.findIndex((s) => s.state === "current");

  useEffect(() => {
    const list = track.current;
    const node = list?.children[current] as HTMLElement | undefined;
    if (!list || !node || list.scrollWidth <= list.clientWidth) return;
    list.scrollLeft = node.offsetLeft - list.clientWidth / 2 + node.clientWidth / 2;
  }, [current, stops.length]);

  return (
    // min-w-0: в сетке (хаб «Учёба») карточка иначе растягивается по ширине всех остановок и сдвигает страницу вбок.
    <section className="min-w-0 max-w-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5" aria-label={title}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{eyebrow}</p>}
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="shrink-0 text-sm tabular-nums text-[var(--color-muted)]">{`${done} из ${stops.length} завершено`}</span>
      </div>
      <ol ref={track} className="-mx-1 mt-4 flex w-full min-w-0 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {stops.map((stop, i) => {
          const filled = stop.state !== "todo";
          const circle = cn(
            "relative z-[1] grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition",
            filled ? "border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]" : "border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-[var(--color-muted)]",
            stop.state === "current" && "shadow-[0_0_0_4px_var(--color-surface),0_0_0_7px_color-mix(in_srgb,var(--color-fg)_22%,transparent)]",
          );
          const mark = stop.state === "done" ? <Check /> : stop.final ? <Trophy /> : null;
          return (
            <li key={i} className="relative flex min-w-[78px] flex-1 flex-col items-center px-1" aria-current={stop.state === "current" ? "step" : undefined}>
              {i > 0 && (
                <span
                  aria-hidden
                  className={cn("absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2", stops[i - 1].state === "done" ? "bg-[var(--color-fg)]" : "bg-[var(--color-border-strong)]")}
                />
              )}
              {onSelect ? (
                <button className={circle} onClick={() => onSelect(i)} aria-label={`${i + 1}. ${stop.label}`}>{mark}</button>
              ) : (
                <span className={circle} aria-hidden>{mark}</span>
              )}
              <span className={cn("mt-2 text-xs tabular-nums", stop.state === "current" ? "font-bold" : "text-[var(--color-muted)]")}>{i + 1}</span>
              <span className={cn("line-clamp-2 max-w-[92px] text-center text-xs leading-snug", stop.state === "current" ? "font-bold" : "text-[var(--color-muted)]")}>{stop.label}</span>
            </li>
          );
        })}
      </ol>
      {footer}
    </section>
  );
}
