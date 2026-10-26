"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import ReportQuestion from "@/components/events/ReportQuestion";
import { cn } from "@/lib/cn";
import { answer, loadDrill, nextRound, retryAt, ROUND, saveDrill, stats, STREAK_TO_MASTER, type DrillState, type Scope } from "@/lib/events/drill";
import { shuffle, type QuizQuestion } from "@/lib/events/engine";
import type { Lang, StudyEvent } from "@/lib/events/types";
import { useContentLang } from "@/i18n/locale";
import { useTutorDetail } from "@/lib/tutorFocus";

/**
 * «Учить вопросами» — для тех, кому не хочется читать конспект: раунды по
 * десять вопросов, после ответа — коротко «почему», ошибки возвращаются,
 * пока не запомнятся (правила — в lib/events/drill.ts). Прогресс «освоено N
 * из M» — на устройстве, в готовность не идёт: готовность меряют квизы.
 */

const panel = "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5";

/** Тот же вопрос ещё раз, но с вариантами в другом порядке — чтобы не запоминать «третий ответ». */
function again(item: QuizQuestion): QuizQuestion {
  const order = item.options[0] === "True" && item.options[1] === "False" ? [0, 1] : shuffle(item.options.map((_, i) => i));
  return {
    ...item,
    options: order.map((i) => item.options[i]),
    correct: order.indexOf(item.correct),
    ...(item.wrong ? { wrong: order.map((i) => item.wrong![i]) } : {}),
  };
}

/** id вопроса «pm-l4-p2-7» → id части «pm-l4-p2». */
const partOf = (questionId: string) => questionId.replace(/-\d+$/, "");

export default function Drill({
  event,
  userId,
  lang,
  onLang,
  initialScope = "all",
  onExit,
  onOpenPart,
  onExam,
}: {
  event: StudyEvent;
  userId: string;
  lang: Lang;
  onLang: () => void;
  initialScope?: Scope;
  onExit: () => void;
  onOpenPart: (partId: string) => void;
  onExam?: () => void;
}) {
  const tl = useContentLang();
  const [state, setState] = useState<DrillState>({});
  const [loaded, setLoaded] = useState(false);
  const [scope, setScope] = useState<Scope>(initialScope);
  const [round, setRound] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | undefined>();
  const [returns, setReturns] = useState(false);
  const [extra, setExtra] = useState(0);
  const [traps, setTraps] = useState(false);
  const [summary, setSummary] = useState<{ right: number; total: number; gained: number } | null>(null);
  const tally = useRef({ right: 0, total: 0, before: 0 });
  const feedback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setState(loadDrill(userId, event.id));
    setLoaded(true);
  }, [userId, event.id]);

  const item = round?.[index];
  const answered = picked !== undefined;
  useTutorDetail(item ? { quiz: { question: item.q, options: item.options, picked, correct: answered ? item.correct : undefined, index, total: round!.length } } : null, item ? `drill ${index + 1}/${round!.length}` : "");

  useEffect(() => {
    if (answered) feedback.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [answered, index]);

  const all = stats(event, state);
  const current = stats(event, state, scope);
  const scopeName = scope === "all" ? "Все лекции" : event.lectures[scope].title[tl];

  function start(next: Scope = scope) {
    setScope(next);
    tally.current = { right: 0, total: 0, before: stats(event, state, next).mastered };
    setRound(nextRound(event, state, next, Date.now()));
    setIndex(0);
    setPicked(undefined);
    setReturns(false);
    setExtra(0);
    setTraps(false);
    setSummary(null);
  }

  function choose(i: number) {
    if (!round || !item || answered) return;
    const ok = i === item.correct;
    const next = answer(state, item.id, ok, Date.now());
    setState(next);
    saveDrill(userId, event.id, next);
    setPicked(i);
    tally.current.total++;
    if (ok) tally.current.right++;
    if (!ok) {
      const at = retryAt(index, round.length, extra);
      if (at !== null) {
        setRound([...round.slice(0, at), again(item), ...round.slice(at)]);
        setExtra(extra + 1);
      }
      setReturns(at !== null);
    }
  }

  function advance() {
    if (!round) return;
    if (index + 1 >= round.length) {
      setSummary({ right: tally.current.right, total: tally.current.total, gained: stats(event, state, scope).mastered - tally.current.before });
      setRound(null);
      return;
    }
    setIndex(index + 1);
    setPicked(undefined);
    setReturns(false);
    setTraps(false);
  }

  const bar = (done: number, total: number, learning = 0) => (
    <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]" aria-hidden>
      <div className="h-full bg-emerald-400" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
      <div className="h-full bg-amber-400/70" style={{ width: `${total ? (learning / total) * 100 : 0}%` }} />
    </div>
  );

  /* ───────── Вопрос ───────── */
  if (round && item) {
    const card = state[item.id];
    return (
      <div className="space-y-4">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button className="text-sm underline" onClick={() => { setSummary({ right: tally.current.right, total: tally.current.total, gained: stats(event, state, scope).mastered - tally.current.before }); setRound(null); }}>
              ← Закончить раунд
            </button>
            <span className="text-xs text-[var(--color-muted)]">{`Освоено ${current.mastered} из ${current.total}`}</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{`Учить вопросами · ${scopeName}`}</p>
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]" role="progressbar" aria-valuemin={0} aria-valuemax={round.length} aria-valuenow={index + (answered ? 1 : 0)}>
              <div className="h-full rounded-full bg-emerald-400 transition-[width]" style={{ width: `${((index + (answered ? 1 : 0)) / round.length) * 100}%` }} />
            </div>
            <span className="shrink-0 text-sm tabular-nums">{`Вопрос ${index + 1} из ${round.length}`}</span>
          </div>
        </header>

        <section className={panel}>
          {card?.level === 1 && !answered && <p className="mb-2 text-xs font-semibold text-amber-500">↺ Ты здесь ошибался — попробуй ещё раз</p>}
          <h2 lang="en" className="text-lg font-semibold leading-snug">{item.q}</h2>
          <div className="mt-4 space-y-2">
            {item.options.map((option, i) => {
              const right = answered && i === item.correct;
              const wrong = answered && i === picked && i !== item.correct;
              return (
                <button
                  key={`${index}-${i}`}
                  lang="en"
                  disabled={answered}
                  aria-pressed={picked === i}
                  onClick={() => choose(i)}
                  className={cn(
                    "block w-full rounded-2xl border p-3 text-left text-[15px] transition",
                    right ? "border-emerald-400 bg-emerald-500/15" : wrong ? "border-red-400 bg-red-500/15" : "border-[var(--color-border)]",
                    !answered && "hover:bg-[var(--color-surface-2)]",
                    answered && !right && !wrong && "opacity-60",
                  )}
                >
                  {right && "✓ "}{wrong && "✗ "}{option}
                </button>
              );
            })}
          </div>

          {answered && (
            <div ref={feedback} className="mt-4 scroll-mb-28 space-y-3">
              <div role="status" className="rounded-2xl bg-[var(--color-surface-2)] p-4 text-sm">
                <p className="font-semibold">
                  {picked === item.correct
                    ? card?.level === 2 ? "Верно · освоено ✓" : `Верно · ещё ${STREAK_TO_MASTER - (card?.streak ?? 0)} раз — и освоено`
                    : returns ? "Неверно — вопрос вернётся через пару вопросов" : "Неверно — вернётся в следующем раунде"}
                </p>
                <p className="mt-1" lang={lang}>{item.why[lang]}</p>
                {picked !== item.correct && item.wrong?.[picked!] && (
                  <p className="mt-2 text-[var(--color-fg-dim)]">
                    <span lang="en" className="font-medium">✗ {item.options[picked!]}</span> — <span lang={lang}>{item.wrong[picked!]![lang]}</span>
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {item.wrong && <button className="underline" onClick={() => setTraps(!traps)}>{traps ? "Скрыть разбор вариантов" : "Разбор всех вариантов"}</button>}
                  <button className="underline" onClick={onLang}>{lang === "en" ? "Объяснение на русском" : "Explanation in English"}</button>
                  <button className="underline" onClick={() => onOpenPart(partOf(item.id))}>Открыть конспект этой темы</button>
                </div>
                {traps && item.wrong && (
                  <ul className="mt-3 space-y-1.5 border-t border-[var(--color-border)] pt-3">
                    {item.options.map((option, i) => item.wrong?.[i] && (
                      <li key={i} className={cn("text-[13px]", i === picked ? "text-[var(--color-strength)]" : "text-[var(--color-fg-dim)]")}>
                        <span lang="en" className="font-medium">✗ {option}</span> — <span lang={lang}>{item.wrong[i]![lang]}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <ReportQuestion key={`${item.id}-${index}`} eventId={event.id} questionId={item.id} />
              </div>
              <Button variant="primary" className="w-full" onClick={advance}>
                {index + 1 === round.length ? "Итоги раунда" : "Дальше"}
              </Button>
            </div>
          )}
        </section>
      </div>
    );
  }

  /* ───────── Выбор темы и итоги раунда ───────── */
  const finished = loaded && current.total > 0 && current.mastered === current.total;
  return (
    <div className="space-y-4">
      <header>
        <button className="text-sm underline" onClick={onExit}>← К маршруту</button>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{event.course}</p>
        <h1 className="mt-2 text-2xl font-bold">🎯 Учить вопросами</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Без конспекта: отвечаешь — и сразу видишь, почему верно именно это. Ошибки возвращаются через пару вопросов и в следующих раундах, пока не ответишь верно дважды подряд.
        </p>
      </header>

      {summary && summary.total > 0 && (
        <section role="status" className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-5">
          <p className="text-xs uppercase tracking-widest">Раунд закончен</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">{`${summary.right} из ${summary.total}`}</p>
          <p className="mt-1 text-sm">{summary.gained > 0 ? `Освоено новых вопросов: ${summary.gained}` : "Новых освоенных нет — ошибки вернутся в следующем раунде"}</p>
        </section>
      )}

      <section className={panel}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="text-sm">{`Освоено ${all.mastered} из ${all.total}`}</p>
          <p className="text-xs text-[var(--color-muted)]">{`в работе ${all.learning} · новых ${all.fresh}`}</p>
        </div>
        {bar(all.mastered, all.total, all.learning)}

        <h2 className="mt-5 text-sm font-semibold">Что учим</h2>
        <ul className="mt-2 space-y-1.5" role="radiogroup" aria-label="Что учим">
          {(["all", ...event.lectures.map((_, li) => li)] as Scope[]).map((s) => {
            const st = s === "all" ? all : stats(event, state, s);
            const title = s === "all" ? "Все лекции по порядку" : event.lectures[s].title[tl];
            return (
              <li key={String(s)}>
                <button
                  role="radio"
                  aria-checked={scope === s}
                  onClick={() => setScope(s)}
                  className={cn("w-full rounded-2xl border p-3 text-left transition", scope === s ? "border-emerald-400 bg-emerald-500/10" : "border-[var(--color-border)] hover:bg-[var(--color-surface-2)]")}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="min-w-0 break-words text-sm">{title}</span>
                    <span className="shrink-0 text-xs tabular-nums text-[var(--color-muted)]">{`${st.mastered}/${st.total}`}</span>
                  </span>
                  {bar(st.mastered, st.total, st.learning)}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {finished && (
        <p role="status" className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-3 text-sm">
          {scope === "all" ? "Освоено всё. Проверь себя в условиях теста — или повтори освоенное." : "Эта лекция освоена. Возьми следующую или повтори освоенное."}
        </p>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="primary" className="h-auto min-h-11 whitespace-normal sm:col-span-2" disabled={!loaded || current.total === 0} onClick={() => start()}>
          {finished ? "Повторить освоенное" : summary ? `Ещё ${ROUND} вопросов` : `Начать · ${ROUND} вопросов`}
        </Button>
        {onExam && <Button className="h-auto min-h-11 whitespace-normal" onClick={onExam}>⏱ Пробный тест</Button>}
        <Button variant="ghost" className="h-auto min-h-11 whitespace-normal" onClick={onExit}>К маршруту</Button>
      </div>
    </div>
  );
}
