"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { QuizQuestion } from "@/lib/events/engine";
import { clock } from "@/lib/events/examSim";
import type { ExamFormat } from "@/lib/events/types";

/**
 * Пробный тест — как настоящий: N вопросов вперемешку со всех лекций, таймер,
 * никаких объяснений по ходу. Можно пропускать, отмечать «вернуться» и
 * переходить по номерам; время вышло — ответы сдаются сами. Разбор — после.
 */
export default function ExamSim({
  format,
  quiz,
  onFinish,
  onExit,
}: {
  format: ExamFormat;
  quiz: QuizQuestion[];
  onFinish: (answers: number[], seconds: number) => void;
  onExit: () => void;
}) {
  const [answers, setAnswers] = useState<(number | undefined)[]>(() => quiz.map(() => undefined));
  const [index, setIndex] = useState(0);
  const [flags, setFlags] = useState<number[]>([]);
  const [started, setStarted] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const done = useRef(false);

  // Часы запускаются после монтирования: время — внешнее состояние, в отрисовку его не тянем.
  useEffect(() => {
    const begin = Date.now();
    setStarted(begin);
    setNow(begin);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const total = format.minutes * 60_000;
  const left = started === null ? total : started + total - now;
  const answeredCount = answers.filter((a) => a !== undefined).length;

  function submit() {
    if (done.current) return;
    done.current = true;
    onFinish(answers.map((a) => a ?? -1), started === null ? 0 : Math.round((Date.now() - started) / 1000));
  }

  useEffect(() => {
    if (started !== null && left <= 0) submit();
    // submit читает актуальные ответы при каждой отрисовке
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, started]);

  const item = quiz[index];
  const picked = answers[index];

  return (
    <div className="space-y-4 pb-10">
      <header className="sticky top-2 z-10 space-y-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <button className="text-sm underline" onClick={() => { if (confirm("Прервать пробный тест? Ответы не сохранятся.")) onExit(); }}>← Прервать</button>
          <span className={cn("rounded-full px-3 py-1 font-mono text-sm font-semibold tabular-nums", left < 5 * 60_000 ? "bg-red-500/20 text-[var(--color-strength)]" : "bg-[var(--color-surface-2)]")} aria-label="Осталось времени" role="timer">
            ⏱ {clock(left)}
          </span>
        </div>
        <p className="text-xs text-[var(--color-muted)]">{`${format.name} · отвечено ${answeredCount} из ${quiz.length}`}</p>
      </header>

      <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold tabular-nums">{`Вопрос ${index + 1} из ${quiz.length}`}</p>
          <button
            className={cn("rounded-full border px-3 py-1 text-xs", flags.includes(index) ? "border-amber-400 bg-amber-500/15" : "border-[var(--color-border)]")}
            aria-pressed={flags.includes(index)}
            onClick={() => setFlags(flags.includes(index) ? flags.filter((f) => f !== index) : [...flags, index])}
          >
            {flags.includes(index) ? "⚑ Вернуться" : "⚐ Отметить"}
          </button>
        </div>
        <h2 lang="en" className="mt-3 text-lg font-semibold leading-snug">{item.q}</h2>
        <div className="mt-4 space-y-2">
          {item.options.map((option, i) => (
            <button
              key={`${index}-${i}`}
              lang="en"
              aria-pressed={picked === i}
              onClick={() => setAnswers(answers.map((a, j) => (j === index ? i : a)))}
              className={cn(
                "block w-full rounded-2xl border p-3 text-left text-[15px] transition",
                picked === i ? "border-sky-400 bg-sky-500/15" : "border-[var(--color-border)] hover:bg-[var(--color-surface-2)]",
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button disabled={index === 0} onClick={() => setIndex(index - 1)}>← Назад</Button>
          {index + 1 < quiz.length ? (
            <Button variant="primary" onClick={() => setIndex(index + 1)}>Дальше →</Button>
          ) : (
            <Button variant="primary" onClick={() => { if (answeredCount === quiz.length || confirm(`Без ответа: ${quiz.length - answeredCount}. Сдать тест?`)) submit(); }}>Сдать тест</Button>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-xs text-[var(--color-muted)]">Номера вопросов: заполненный — есть ответ, жёлтый — отмечен «вернуться»</p>
        <ol className="mt-3 grid grid-cols-10 gap-1.5" aria-label="Вопросы теста">
          {quiz.map((q, i) => (
            <li key={q.id + i}>
              <button
                aria-label={`Вопрос ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-8 w-full rounded-lg border text-xs tabular-nums",
                  flags.includes(i) ? "border-amber-400 bg-amber-500/20" : answers[i] !== undefined ? "border-sky-400/60 bg-sky-500/15" : "border-[var(--color-border)]",
                  i === index && "ring-2 ring-[var(--color-fg)]",
                )}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ol>
        <Button className="mt-4 h-auto min-h-11 w-full whitespace-normal" onClick={() => { if (answeredCount === quiz.length || confirm(`Без ответа: ${quiz.length - answeredCount}. Сдать тест?`)) submit(); }}>
          Сдать тест
        </Button>
      </section>
    </div>
  );
}
