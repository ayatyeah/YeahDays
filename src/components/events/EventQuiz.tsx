"use client";
import { QuestionText } from "./QuestionLanguage";
import QuizStage from "./QuizStage";
import ErrorReview from "./ErrorReview";
import { missedQuestions, reviewDelay, readyForReview, creditReview } from "@/lib/events/errorReview";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import EventMusic from "@/components/EventMusic";
import ReportQuestion from "@/components/events/ReportQuestion";
import { cn } from "@/lib/cn";
import { useContentLang } from "@/i18n/locale";
import { openTutor, useTutorDetail } from "@/lib/tutorFocus";
import type { Lang } from "@/lib/events/types";
import type { QuizQuestion, Step } from "@/lib/events/engine";
import { matchesAnswer } from "@/lib/events/quizAnswers";
import styles from "./event-quiz.module.css";

export type EventQuizQuestion = Omit<QuizQuestion, "correct" | "lecture"> & { correct: number[]; labels?: string[]; caution?: string; optionExplanations?: string[]; studyLink?: { href: string; title: string } };
const panel = "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5";

export default function EventQuiz({
  eventId, step, quiz, lang, music, onLang, onMusic, onExit, onFinish, onAnswer, explainOptionsOpen = false,
}: {
  eventId: string;
  step: Pick<Step, "title">;
  quiz: EventQuizQuestion[];
  lang: Lang;
  music: boolean;
  onLang?: () => void;
  explainOptionsOpen?: boolean;
  onMusic: () => void;
  onExit: () => void;
  onFinish: (answers: number[][]) => void;
  onAnswer?: (id: string, answer: number[]) => void;
}) {
  const tl = useContentLang();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[][]>([]);
  const [answeredAt, setAnsweredAt] = useState<Record<string, number>>({});
  const [reviewAt, setReviewAt] = useState<number | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [mastered, setMastered] = useState<string[]>([]);
  const item = quiz[index];
  const picked = answers[index];
  const [drafts, setDrafts] = useState<Record<number, number[]>>({});
  const selected = drafts[index] ?? [];
  function setSelected(value: number[]) { setDrafts(previous => ({ ...previous, [index]: value })); }
  const expected = item.correct;
  const multi = expected.length > 1;
  function submit(value: number[]) {
    setAnswers(previous => { const next = [...previous]; next[index] = value; return next; });
    if (answers[index] === undefined && expected.length && !matchesAnswer(value, expected) && reviewAt === null) setReviewAt(answers.filter(Boolean).length + 1 + reviewDelay());
    if (answers[index] === undefined) setAnsweredAt(previous => ({ ...previous, [item.id]: answers.filter(Boolean).length + 1 }));
    onAnswer?.(item.id, value);
  }
  const answered = picked !== undefined;
  useTutorDetail({ quiz: { id: item.id, question: item.q, options: item.options, pickedMany: picked, correctMany: answered ? expected : undefined, picked: picked?.[0], correct: answered ? expected[0] : undefined, index, total: quiz.length } }, `${index + 1}/${quiz.length}`);
  const feedback = useRef<HTMLDivElement>(null);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const previousIndex = useRef(index);

  useEffect(() => {
    const navigated = previousIndex.current !== index;
    previousIndex.current = index;
    // Back can open an already answered question: navigation still wins over
    // feedback scrolling, so its heading is not skipped.
    const target = navigated ? questionHeading.current : answered ? feedback.current : null;
    if (!target) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView({
      block: "start",
      behavior: navigated || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [answered, index]);

  const missed = readyForReview(missedQuestions(quiz, answers, mastered), answeredAt, answers.filter(Boolean).length);
  function advance() {
    if (index + 1 === quiz.length) onFinish(answers); else setIndex(i => i + 1);
  }

  return (
    <>
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button className="text-sm underline" onClick={onExit}>← Exit quiz</button>
          <button className="text-sm underline" onClick={() => openTutor()}>✦ AI assistant</button>
          <button
            className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm"
            aria-pressed={music}
            onClick={onMusic}
          >
            {music ? "♪ Music: on" : "♪ Music: off"}
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
          <span className="shrink-0 text-sm tabular-nums">Question {index + 1} of {quiz.length}</span>
        </div>
      </header>

      <QuizStage>{reviewing ? <ErrorReview candidates={missed} onCorrect={(id, selected) => {
        const corrected = creditReview(quiz, answers, id, selected);
        if (corrected !== answers) { setAnswers(corrected); onAnswer?.(id, selected); }
      }} onDone={id => {
        const nextMastered = id ? [...mastered, id] : mastered;
        setMastered(nextMastered); setReviewing(false);
        setReviewAt(missedQuestions(quiz, answers, nextMastered).length ? answers.filter(Boolean).length + reviewDelay() : null);
        advance();
      }}/> : <section className={panel}>
        <h2 ref={questionHeading} tabIndex={-1} data-selection-question lang="en" className={cn(styles.scrollTarget, "whitespace-pre-wrap break-words text-lg font-semibold leading-snug")}><QuestionText>{item.q}</QuestionText></h2>
        {multi && <p className="mt-3 text-sm" role="status">Choose {expected.length} answers · Selected: {(picked ?? selected).length} / {expected.length}</p>}
        <div className="mt-4 space-y-2">
          {item.options.map((option, i) => {
            const right = answered && expected.includes(i);
            const wrong = answered && picked?.includes(i) && expected.length > 0 && !expected.includes(i);
            const chosen = (picked ?? selected).includes(i);
            return (
              <button
                key={`${item.id}-${i}`}
                data-selection-question data-quiz-answer lang="en"
                data-answer-state={right ? "correct" : wrong ? "wrong" : undefined}
                aria-disabled={answered}
                aria-pressed={chosen}
                onClick={() => { if (!answered) { if (multi) setSelected(selected.includes(i) ? selected.filter(n => n !== i) : [...selected, i]); else submit([i]); } }}
                className={cn(
                  "relative block w-full rounded-2xl border p-3 text-left text-[15px] transition",
                  right ? "border-emerald-400 bg-emerald-500/15" : wrong ? "border-red-400 bg-red-500/15" : "border-[var(--color-border)]",
                  !answered && "hover:bg-[var(--color-surface-2)]",
                  answered && !right && !wrong && "opacity-60",
                )}
              >
                <span className="quiz-answer-mark" data-checkbox={multi && !answered ? "true" : undefined} aria-hidden="true">{right ? "✓" : wrong ? "✗" : chosen ? "✓" : ""}</span><span>{item.labels && `${item.labels[i]}. `}<QuestionText>{option}</QuestionText></span>
              </button>
            );
          })}
        </div>

        {multi && !answered && <Button variant="primary" className="mt-4 w-full" disabled={selected.length !== expected.length} onClick={() => submit(selected)}>Check answers</Button>}
        {answered && (
          <div className="yg-rise mt-4 scroll-mb-28 space-y-3">
            <div ref={feedback} tabIndex={-1} role="status" className={cn(styles.scrollTarget, "rounded-2xl bg-[var(--color-surface-2)] p-4 text-sm")}>
              <p className="font-semibold">{!expected.length ? "Explanation only" : matchesAnswer(picked, expected) ? "Correct" : "Not quite"}</p>
              {item.caution && <p className="mt-2">{item.caution}</p>}
              <p className="mt-1" data-selection-question lang={lang}>{item.why[lang]}</p>
              {item.studyLink && <a href={item.studyLink.href} target="_blank" rel="noreferrer" className="mt-3 block font-medium underline">Study notes: {item.studyLink.title} ↗</a>}
              {item.optionExplanations && <details open={explainOptionsOpen || undefined} className="mt-4 border-t border-[var(--color-border)] pt-3">
                <summary className="cursor-pointer font-semibold">{explainOptionsOpen ? "Почему каждый вариант подходит или не подходит" : "Why each option works or does not"}</summary>
                <ul className="mt-3 space-y-4">{item.options.map((option, i) => <li key={i}>
                  <p lang="en" className="font-medium">{expected.length ? expected.includes(i) ? "✓ " : "✗ " : ""}{item.labels?.[i] ?? String.fromCharCode(65 + i)}. <QuestionText>{option}</QuestionText></p>
                  <p data-selection-question className="mt-1">{item.optionExplanations?.[i]}</p>
                </li>)}</ul>
              </details>}
              {item.wrong && (
                <ul className="mt-3 space-y-1.5 border-t border-[var(--color-border)] pt-3">
                  {item.options.map((option, i) => item.wrong?.[i] && (
                    <li key={i} className={cn("text-[13px]", picked?.includes(i) ? "text-[var(--color-strength)]" : "text-[var(--color-fg-dim)]")}>
                      <span data-selection-question lang="en" className="font-medium">✗ <QuestionText>{option}</QuestionText></span> — <span data-selection-question lang={lang}>{item.wrong[i]![lang]}</span>
                    </li>
                  ))}
                </ul>
              )}
              {onLang && <button className="mt-2 text-xs underline" onClick={onLang}>
                {lang === "en" ? "Объяснение на русском" : "Explanation in English"}
              </button>}
              <ReportQuestion key={item.id} eventId={eventId} questionId={item.id} />
            </div>
          </div>
        )}
        <nav className="mt-4 flex gap-3 scroll-mb-28" aria-label="Question navigation">
          <Button disabled={index === 0} onClick={() => setIndex(i => i - 1)}>← Back</Button>
          <Button variant="primary" className="flex-1" disabled={!answered}
            onClick={() => { if (reviewAt !== null && answers.filter(Boolean).length >= reviewAt && missed.length) setReviewing(true); else advance(); }}>
            {index + 1 === quiz.length ? "Finish quiz" : "Next"}
          </Button>
        </nav>
      </section>}</QuizStage>
      {/* Плеер — под вопросом, а не над ним. Сверху он занимал на телефоне
          треть экрана (меньше 200×200 правила YouTube делать не дают), и
          варианты ответа уезжали за край. Позиция в дереве не меняется от
          вопроса к вопросу — музыка не перезапускается. */}
      {music && <EventMusic />}
    </>
  );
}

