"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import EventNotes, { inline } from "@/components/EventNotes";
import { cn } from "@/lib/cn";
import { draw, steps, type Progress, type QuizQuestion, type Step } from "@/lib/events/engine";
import { lectureNumber } from "@/lib/events/feed";
import { notePages, type NotePage } from "@/lib/events/notePages";
import { loadScroll, saveScroll, type ScrollMemory, type ScrollPlace } from "@/lib/events/scrollMemory";
import type { Lang, StudyEvent } from "@/lib/events/types";

/**
 * Scroll-mode: конспект и тест одной лентой, листаешь вверх.
 *
 * Начинается с выбранной части и идёт дальше по всем частям ивента:
 * обложка части → конспект экранами (notePages) → «Тест по части» → вопросы
 * по одному на экран с разбором → итог → следующая часть. Тест — тот же
 * квиз части, что и обычный: когда отвечены все вопросы, результат идёт в
 * готовность, маршрут и «Учить вопросами» (onQuizDone).
 *
 * Место запоминается (scrollMemory): открыл часть — вернулся на тот экран
 * или вопрос, где ушёл; недоотвеченный тест — с теми же вопросами и ответами.
 *
 * Рисуются только соседние экраны: в ленте всех частей их сотни.
 * Выводится порталом в body — как лента роликов, поверх нижней навигации.
 */

type Item =
  | { kind: "cover"; step: Step }
  | { kind: "page"; step: Step; page: NotePage; index: number; of: number }
  | { kind: "test"; step: Step }
  | { kind: "question"; step: Step; k: number }
  | { kind: "result"; step: Step }
  | { kind: "end" };

const percent = (value: number) => `${Math.round(value * 100)}%`;

/** Тот ли это экран: та же часть, тот же вид, тот же номер экрана конспекта или вопроса. */
function matches(item: Item, place: ScrollPlace): boolean {
  if (!("step" in item) || item.step.id !== place.step || item.kind !== place.kind) return false;
  if (item.kind === "page") return item.index === Math.min(place.n ?? 0, item.of - 1);
  if (item.kind === "question") return item.k === (place.n ?? 0);
  return true;
}

/** Экран из одной мысли (цитата или абзац) — крупно по центру, а не строкой вверху пустого экрана. */
const single = (text: string) => !text.includes("\n") && !/^(- |\||@|= |\?\?|!\[)/.test(text);

export default function ScrollStudy({
  event,
  userId,
  start,
  lang,
  progress,
  onLang,
  onQuizDone,
  onNormal,
  onFinal,
  onExit,
}: {
  event: StudyEvent;
  userId: string;
  /** С какой части начать (с того места в ней, где остановился в прошлый раз). */
  start: Step;
  lang: Lang;
  progress: Progress;
  onLang: () => void;
  onQuizDone: (step: Step, quiz: QuizQuestion[], answers: number[]) => void;
  /** Выключить scroll-mode: обычный конспект части, что сейчас на экране. */
  onNormal: (step: Step) => void;
  onFinal: () => void;
  onExit: () => void;
}) {
  const parts = useMemo(() => {
    const all = steps(event).filter((s) => s.kind === "part");
    return all.slice(Math.max(0, all.findIndex((s) => s.id === start.id)));
  }, [event, start.id]);

  const items = useMemo(() => {
    const out: Item[] = [];
    for (const step of parts) {
      const pages = notePages(event.lectures[step.lecture!].parts[step.part!].notes[lang]);
      out.push({ kind: "cover", step });
      pages.forEach((page, index) => out.push({ kind: "page", step, page, index, of: pages.length }));
      out.push({ kind: "test", step });
      for (let k = 0; k < step.count; k++) out.push({ kind: "question", step, k });
      out.push({ kind: "result", step });
    }
    out.push({ kind: "end" });
    return out;
  }, [event, parts, lang]);

  const memory = useRef<ScrollMemory>({ places: {}, tests: {} });
  const [restored] = useState(() => {
    memory.current = loadScroll(userId, event.id);
    const { at, places, tests } = memory.current;
    const place = at?.step === start.id ? at : places[start.id];
    const index = place ? items.findIndex((it) => matches(it, place)) : -1;
    return { index: Math.max(0, index), tests };
  });
  // Вопросы части тянутся при первом подходе к ней и живут, пока тест не начат заново.
  const [quizzes, setQuizzes] = useState<Record<string, QuizQuestion[]>>(() => Object.fromEntries(Object.entries(restored.tests).map(([id, t]) => [id, t.quiz])));
  const [answers, setAnswers] = useState<Record<string, (number | null)[]>>(() => Object.fromEntries(Object.entries(restored.tests).map(([id, t]) => [id, t.answers])));
  const sent = useRef(new Set<string>());
  // Сразу с сохранённого места: иначе первым делом запомнилась бы обложка части.
  const [active, setActive] = useState(restored.index);
  const [resumed, setResumed] = useState(restored.index > 0);
  const box = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (box.current && restored.index > 0) box.current.scrollTop = restored.index * box.current.clientHeight;
  }, [restored.index]);

  useEffect(() => {
    if (!resumed) return;
    const timer = setTimeout(() => setResumed(false), 4000);
    return () => clearTimeout(timer);
  }, [resumed]);

  function remember(update: (m: ScrollMemory) => void) {
    update(memory.current);
    saveScroll(userId, event.id, memory.current);
  }

  // Где сейчас — общее место и место в этой части.
  useEffect(() => {
    const item = items[active];
    if (!item || !("step" in item)) return;
    const place: ScrollPlace = { step: item.step.id, kind: item.kind, n: item.kind === "page" ? item.index : item.kind === "question" ? item.k : undefined };
    remember((m) => {
      m.at = place;
      m.places[place.step] = place;
    });
    // remember пишет в ref и localStorage — от состояния не зависит
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, items]);
  const current = items[active];
  const currentStep = current && "step" in current ? current.step : parts[parts.length - 1];

  // Сменили язык — экранов конспекта может стать больше или меньше: остаёмся на той же части и том же месте.
  const lastItem = useRef<Item | undefined>(undefined);
  useEffect(() => {
    const was = lastItem.current;
    lastItem.current = items[active];
    if (!was || !("step" in was) || items[active] === was) return;
    const same = (it: Item) => "step" in it && it.step.id === was.step.id && it.kind === was.kind;
    const exact = items.findIndex((it) => same(it) && (it.kind !== "page" || (was.kind === "page" && it.index === Math.min(was.index, it.of - 1))) && (it.kind !== "question" || (was.kind === "question" && it.k === was.k)));
    if (exact < 0 || exact === active) return;
    setActive(exact);
    if (box.current) box.current.scrollTop = exact * box.current.clientHeight;
    // только при смене языка; обычная прокрутка меняет active, а items — нет
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);
  useEffect(() => {
    lastItem.current = items[active];
  }, [items, active]);

  useEffect(() => {
    if (!currentStep || quizzes[currentStep.id]) return;
    setQuizzes((q) => ({ ...q, [currentStep.id]: draw(event, currentStep) }));
  }, [currentStep, quizzes, event]);

  // Страница под лентой не прокручивается, пока scroll-mode открыт.
  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, []);

  // Какой экран открыт: тот, что виден хотя бы на 60%.
  useEffect(() => {
    const root = box.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { root, threshold: 0.6 },
    );
    for (const child of Array.from(root.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [items]);

  function scrollTo(index: number) {
    const root = box.current;
    if (root) root.scrollTo({ top: index * root.clientHeight, behavior: "smooth" });
  }
  const indexOf = (match: (item: Item) => boolean) => items.findIndex(match);

  function choose(step: Step, k: number, option: number) {
    const quiz = quizzes[step.id];
    if (!quiz) return;
    const prev = answers[step.id] ?? Array.from({ length: quiz.length }, () => null);
    if (prev[k] !== null) return;
    const next = prev.map((a, i) => (i === k ? option : a));
    setAnswers((all) => ({ ...all, [step.id]: next }));
    const complete = next.every((a) => a !== null);
    // Недоотвеченный тест — на устройство, чтобы вернуться к нему; засчитанный — уже не нужен.
    remember((m) => {
      if (complete) delete m.tests[step.id];
      else m.tests[step.id] = { quiz, answers: next };
    });
    // Разбор появляется ниже вариантов — подкрутить карточку, чтобы его было видно.
    requestAnimationFrame(() => document.querySelector(`[data-review="${step.id}:${k}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
    // Отвечены все — засчитываем как обычный квиз части (один раз за попытку).
    if (complete && !sent.current.has(step.id)) {
      sent.current.add(step.id);
      onQuizDone(step, quiz, next as number[]);
    }
  }

  function retake(step: Step) {
    sent.current.delete(step.id);
    remember((m) => {
      delete m.tests[step.id];
    });
    setQuizzes((q) => ({ ...q, [step.id]: draw(event, step) }));
    setAnswers((a) => ({ ...a, [step.id]: Array.from({ length: step.count }, () => null) }));
    scrollTo(indexOf((it) => it.kind === "test" && it.step.id === step.id) + 1);
  }

  const where = (step: Step) => `${lectureNumber(event, step.lecture!)} · часть ${step.part! + 1} из ${event.lectures[step.lecture!].parts.length}`;

  function render(item: Item, i: number) {
    if (item.kind === "cover") {
      const step = item.step;
      const pages = items.filter((it) => it.kind === "page" && it.step.id === step.id).length;
      const best = progress[step.id];
      return (
        <div className="absolute inset-0 flex flex-col overflow-y-auto bg-gradient-to-b from-violet-500/20 via-[var(--color-bg)] to-sky-500/10 px-6 pt-16">
          <div className="mx-auto my-auto w-full max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{where(step)}</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight">{step.title[lang]}</h2>
            <p className="mt-3 text-sm text-[var(--color-muted)]">{`Конспект: ${pages} экр. · тест: ${step.count} вопросов`}</p>
            {best && <p className="mt-1 text-sm">{`Лучший результат теста: ${percent(best.best)}`}</p>}
            <p className="mt-8 animate-bounce text-center text-sm text-[var(--color-muted)]" aria-hidden>↑ листай вверх</p>
            <button className="mx-auto mt-4 block text-sm underline" onClick={() => scrollTo(indexOf((it) => it.kind === "test" && it.step.id === step.id))}>Сразу к тесту</button>
          </div>
        </div>
      );
    }
    if (item.kind === "page" && single(item.page.text)) {
      const text = item.page.text.replace(/^> /, "");
      return (
        <div className="absolute inset-0 flex flex-col overflow-y-auto bg-gradient-to-b from-violet-500/10 via-[var(--color-bg)] to-[var(--color-bg)] px-6 pb-14 pt-20">
          <div className="mx-auto my-auto w-full max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{`${item.step.title[lang]} · ${item.index + 1}/${item.of}`}</p>
            {item.page.heading && <p className="mt-1 text-sm font-semibold text-[var(--color-muted)]">{item.page.heading}</p>}
            <p className="mt-6 border-l-4 border-violet-400 pl-4 text-2xl font-semibold leading-snug" lang={lang}>{inline(text)}</p>
          </div>
        </div>
      );
    }
    if (item.kind === "page") {
      return (
        <div className="absolute inset-0 overflow-y-auto px-5 pb-14 pt-20">
          <div className="mx-auto w-full max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{`${item.step.title[lang]} · ${item.index + 1}/${item.of}`}</p>
            {item.page.heading && (
              <h2 className="mt-1 text-2xl font-bold leading-snug">
                {item.page.heading}
                {item.page.piece && <span className="text-base font-normal text-[var(--color-muted)]">{` · ${item.page.piece}`}</span>}
              </h2>
            )}
            <div className="mt-3 text-[15px] leading-relaxed">
              <EventNotes text={item.page.text} lang={lang} />
            </div>
          </div>
        </div>
      );
    }
    if (item.kind === "test") {
      return (
        <div className="absolute inset-0 flex flex-col overflow-y-auto bg-gradient-to-b from-amber-500/20 via-[var(--color-bg)] to-[var(--color-bg)] px-6">
          <div className="mx-auto my-auto w-full max-w-xl text-center">
            <p className="text-5xl" aria-hidden>📝</p>
            <h2 className="mt-3 text-2xl font-bold">Тест по части</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{`${item.step.count} вопросов по «${item.step.title[lang]}», каждый — с разбором. Ответишь на все — результат засчитается в готовность.`}</p>
            <p className="mt-8 animate-bounce text-sm text-[var(--color-muted)]" aria-hidden>↑ первый вопрос</p>
          </div>
        </div>
      );
    }
    if (item.kind === "question") {
      const quiz = quizzes[item.step.id];
      const q = quiz?.[item.k];
      if (!q) return <p className="grid h-full place-items-center text-sm text-[var(--color-muted)]">…</p>;
      const picked = answers[item.step.id]?.[item.k] ?? null;
      const done = (answers[item.step.id] ?? []).filter((a) => a !== null).length;
      return (
        // my-auto, а не justify-center: когда разбор длинный, карточка прокручивается, а не обрезается сверху.
        <div className="absolute inset-0 flex flex-col overflow-y-auto px-5 pb-14 pt-20">
          <div className="mx-auto my-auto w-full max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-300">{`Вопрос ${item.k + 1} из ${quiz.length} · ${item.step.title[lang]}`}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]" aria-hidden>
              <div className="h-full bg-amber-400" style={{ width: `${(done / quiz.length) * 100}%` }} />
            </div>
            <h2 lang="en" className="mt-4 text-xl font-bold leading-snug">{q.q}</h2>
            <div className="mt-5 space-y-2">
              {q.options.map((option, o) => {
                const ok = picked !== null && o === q.correct;
                const bad = picked === o && o !== q.correct;
                return (
                  <button
                    key={o}
                    lang="en"
                    disabled={picked !== null}
                    onClick={() => choose(item.step, item.k, o)}
                    className={cn(
                      "block w-full rounded-2xl border p-3 text-left text-[15px] transition",
                      ok ? "border-emerald-500 bg-emerald-500/15" : bad ? "border-red-500 bg-red-500/15" : "border-[var(--color-border-strong)] bg-[var(--color-surface)]",
                      picked !== null && !ok && !bad && "opacity-50",
                    )}
                  >
                    {ok && "✓ "}{bad && "✗ "}{option}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div role="status" data-review={`${item.step.id}:${item.k}`} className="mt-4 rounded-2xl bg-[var(--color-surface-2)] p-4 text-sm">
                <p className="font-semibold">{picked === q.correct ? "Верно" : "Неверно"}</p>
                <p className="mt-1" lang={lang}>{q.why[lang]}</p>
                {picked !== q.correct && q.wrong?.[picked] && <p className="mt-2 text-[var(--color-muted)]" lang={lang}>{q.wrong[picked]![lang]}</p>}
                <button className="mt-3 rounded-full bg-[var(--color-fg)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)]" onClick={() => scrollTo(i + 1)}>Дальше ↓</button>
              </div>
            )}
          </div>
        </div>
      );
    }
    if (item.kind === "result") {
      const step = item.step;
      const quiz = quizzes[step.id] ?? [];
      const given = answers[step.id] ?? [];
      const left = quiz.length - given.filter((a) => a !== null).length;
      const right = quiz.filter((q, k) => given[k] === q.correct).length;
      const best = progress[step.id];
      const next = parts[parts.findIndex((p) => p.id === step.id) + 1];
      return (
        <div className="absolute inset-0 flex flex-col overflow-y-auto bg-gradient-to-b from-emerald-500/15 via-[var(--color-bg)] to-[var(--color-bg)] px-6">
          <div className="mx-auto my-auto w-full max-w-xl text-center">
            {left > 0 ? (
              <>
                <h2 className="text-2xl font-bold">{`Осталось ответить: ${left}`}</h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Тест засчитается, когда будут отвечены все вопросы.</p>
                <button
                  className="mt-5 rounded-full bg-[var(--color-fg)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)]"
                  onClick={() => scrollTo(indexOf((it) => it.kind === "question" && it.step.id === step.id && (given[it.k] ?? null) === null))}
                >
                  К первому без ответа
                </button>
              </>
            ) : (
              <>
                <p className="text-5xl" aria-hidden>{right / quiz.length >= 0.8 ? "🔥" : right / quiz.length >= 0.6 ? "👍" : "📚"}</p>
                <h2 className="mt-3 text-3xl font-bold tabular-nums">{`${right} из ${quiz.length}`}</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{`${percent(right / quiz.length)} · лучший результат ${best ? percent(best.best) : percent(right / quiz.length)}`}</p>
                {right < quiz.length && <p className="mt-2 text-sm">Ошибки вернутся в «Учить вопросами».</p>}
                <button className="mt-5 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-semibold" onClick={() => retake(step)}>Пройти тест ещё раз</button>
              </>
            )}
            {next && <p className="mt-8 animate-bounce text-sm text-[var(--color-muted)]" aria-hidden>{`↑ дальше: ${next.title[lang]}`}</p>}
          </div>
        </div>
      );
    }
    return (
      <div className="absolute inset-0 flex flex-col overflow-y-auto px-6">
        <div className="mx-auto my-auto w-full max-w-xl text-center">
          <p className="text-5xl" aria-hidden>🏁</p>
          <h2 className="mt-3 text-2xl font-bold">Все части пройдены</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Осталось закрепить: итоговый квиз — вопросы вперемешку со всех лекций, как на настоящем тесте.</p>
          <button className="mt-5 rounded-full bg-[var(--color-fg)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)]" onClick={onFinal}>Итоговый квиз</button>
          <button className="mx-auto mt-3 block text-sm underline" onClick={onExit}>К маршруту</button>
        </div>
      </div>
    );
  }

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[200] bg-[var(--color-bg)] text-[var(--color-fg)]" role="dialog" aria-modal="true" aria-label="Scroll-mode">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-bg)]/90 to-transparent p-3 pb-6">
        <button className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-[var(--color-surface-2)] text-lg" onClick={onExit} aria-label="Закрыть scroll-mode">✕</button>
        <p className="min-w-0 flex-1 truncate text-center text-xs font-semibold text-[var(--color-muted)]">{currentStep ? where(currentStep) : ""}</p>
        <div className="pointer-events-auto flex gap-1.5 text-xs">
          <button className="h-8 rounded-full bg-[var(--color-surface-2)] px-3" onClick={onLang}>{lang === "en" ? "RU" : "EN"}</button>
          <button className="h-8 rounded-full bg-[var(--color-surface-2)] px-3" onClick={() => currentStep && onNormal(currentStep)}>📖 Обычный</button>
        </div>
      </div>
      {resumed && currentStep && (
        <div role="status" className="absolute inset-x-0 top-16 z-30 mx-auto flex w-fit max-w-[92%] items-center gap-3 rounded-full bg-[var(--color-fg)] py-1.5 pl-4 pr-1.5 text-xs font-semibold text-[var(--color-bg)] shadow-lg">
          <span>Продолжаешь с места, где остановился</span>
          <button
            className="rounded-full bg-[var(--color-bg)] px-3 py-1 text-[var(--color-fg)]"
            onClick={() => {
              setResumed(false);
              scrollTo(indexOf((it) => it.kind === "cover" && it.step.id === currentStep.id));
            }}
          >
            С начала части
          </button>
        </div>
      )}
      <div ref={box} className="h-[100dvh] snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none]">
        {items.map((item, i) => (
          <section
            key={`${item.kind}:${"step" in item ? item.step.id : ""}:${item.kind === "page" ? item.index : item.kind === "question" ? item.k : ""}`}
            data-index={i}
            data-kind={item.kind}
            className="relative h-[100dvh] snap-start snap-always overflow-hidden"
          >
            {Math.abs(i - active) <= 2 && render(item, i)}
          </section>
        ))}
      </div>
    </div>,
    document.body,
  );
}
