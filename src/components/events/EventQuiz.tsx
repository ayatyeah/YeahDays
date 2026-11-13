"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import EventMusic from "@/components/EventMusic";
import ReportQuestion from "@/components/events/ReportQuestion";
import { cn } from "@/lib/cn";
import { useContentLang } from "@/i18n/locale";
import { useTutorDetail } from "@/lib/tutorFocus";
import type { Lang } from "@/lib/events/types";
import type { QuizQuestion, Step } from "@/lib/events/engine";
import { matchesAnswer } from "@/lib/events/quizAnswers";

export type EventQuizQuestion = Omit<QuizQuestion, "correct" | "lecture"> & { correct: number[]; labels?: string[]; caution?: string };
const panel = "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5";

export default function EventQuiz({
  eventId, step, quiz, lang, music, onLang, onMusic, onExit, onFinish, onAnswer,
}: {
  eventId: string;
  step: Pick<Step, "title">;
  quiz: EventQuizQuestion[];
  lang: Lang;
  music: boolean;
  onLang?: () => void;
  onMusic: () => void;
  onExit: () => void;
  onFinish: (answers: number[][]) => void;
  onAnswer?: (id: string, answer: number[]) => void;
}) {
  const tl = useContentLang();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[][]>([]);
  const item = quiz[index];
  const picked = answers[index];
  const [selected, setSelected] = useState<number[]>([]);
  const expected = item.correct;
  const multi = expected.length > 1;
  function submit(value: number[]) { setAnswers([...answers, value]); onAnswer?.(item.id, value); }
  const answered = picked !== undefined;
  useTutorDetail({ quiz: { question: item.q, options: item.options, picked: picked?.[0], correct: answered ? expected[0] : undefined, index, total: quiz.length } }, `${index + 1}/${quiz.length}`);
  const feedback = useRef<HTMLDivElement>(null);

  // На телефоне объяснение и кнопка «Дальше» оказываются под длинными
  // вариантами, за краем экрана — подводим их в поле зрения сами.
  useEffect(() => {
    if (answered) feedback.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [answered, index]);

  return (
    <>
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button className="text-sm underline" onClick={onExit}>← Выйти</button>
          <button
            className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm"
            aria-pressed={music}
            onClick={onMusic}
          >
            {music ? "♪ Музыка: вкл" : "♪ Музыка: выкл"}
          </button>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{step.title[tl]}</p>
        <div className="flex items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={quiz.length}
            aria-valuenow={index + (answered ? 1 : 0)}
          >
            <div className="h-full rounded-full bg-violet-400 transition-[width]" style={{ width: `${((index + (answered ? 1 : 0)) / quiz.length) * 100}%` }} />
          </div>
          <span className="shrink-0 text-sm tabular-nums">Вопрос {index + 1} из {quiz.length}</span>
        </div>
      </header>

      <section className={panel}>
        <h2 data-selection-question lang="en" className="text-lg font-semibold leading-snug">{item.q}</h2>
        {multi && <p className="mt-3 text-sm">Выбери {expected.length} варианта.</p>}
        <div className="mt-4 space-y-2">
          {item.options.map((option, i) => {
            const right = answered && expected.includes(i);
            const wrong = answered && picked?.includes(i) && expected.length > 0 && !expected.includes(i);
            return (
              <button
                key={`${item.id}-${i}`}
                data-selection-question lang="en"
                data-answer-state={right ? "correct" : wrong ? "wrong" : undefined}
                aria-disabled={answered}
                aria-pressed={(picked ?? selected).includes(i)}
                onClick={() => { if (!answered) { if (multi) setSelected(selected.includes(i) ? selected.filter(n => n !== i) : [...selected, i]); else submit([i]); } }}
                className={cn(
                  "block w-full rounded-2xl border p-3 text-left text-[15px] transition",
                  right ? "border-emerald-400 bg-emerald-500/15" : wrong ? "border-red-400 bg-red-500/15" : "border-[var(--color-border)]",
                  !answered && "hover:bg-[var(--color-surface-2)]",
                  !answered && selected.includes(i) && "border-violet-400 bg-violet-500/15",
                  answered && !right && !wrong && "opacity-60",
                )}
              >
                {right && "✓ "}{wrong && "✗ "}{item.labels && `${item.labels[i]}. `}{option}
              </button>
            );
          })}
        </div>

        {multi && !answered && <Button variant="primary" className="mt-4 w-full" disabled={selected.length !== expected.length} onClick={() => submit(selected)}>Проверить</Button>}
        {answered && (
          <div ref={feedback} className="yg-rise mt-4 scroll-mb-28 space-y-3">
            <div role="status" className="rounded-2xl bg-[var(--color-surface-2)] p-4 text-sm">
              <p className="font-semibold">{!expected.length ? "Разбор без оценки" : matchesAnswer(picked, expected) ? "Верно" : "Неверно"}</p>
              {item.caution && <p className="mt-2">{item.caution}</p>}
              <p className="mt-1" data-selection-question lang={lang}>{item.why[lang]}</p>
              {item.wrong && (
                <ul className="mt-3 space-y-1.5 border-t border-[var(--color-border)] pt-3">
                  {item.options.map((option, i) => item.wrong?.[i] && (
                    <li key={i} className={cn("text-[13px]", picked?.includes(i) ? "text-[var(--color-strength)]" : "text-[var(--color-fg-dim)]")}>
                      <span data-selection-question lang="en" className="font-medium">✗ {option}</span> — <span data-selection-question lang={lang}>{item.wrong[i]![lang]}</span>
                    </li>
                  ))}
                </ul>
              )}
              {onLang && <button className="mt-2 text-xs underline" onClick={onLang}>
                {lang === "en" ? "Объяснение на русском" : "Explanation in English"}
              </button>}
              <ReportQuestion key={item.id} eventId={eventId} questionId={item.id} />
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => { if (index + 1 === quiz.length) onFinish(answers); else { setSelected([]); setIndex(index + 1); } }}
            >
              {index + 1 === quiz.length ? "Завершить квиз" : "Дальше"}
            </Button>
          </div>
        )}
      </section>
      {/* Плеер — под вопросом, а не над ним. Сверху он занимал на телефоне
          треть экрана (меньше 200×200 правила YouTube делать не дают), и
          варианты ответа уезжали за край. Позиция в дереве не меняется от
          вопроса к вопросу — музыка не перезапускается. */}
      {music && <EventMusic />}
    </>
  );
}

