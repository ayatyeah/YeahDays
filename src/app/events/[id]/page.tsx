"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import EventNotes from "@/components/EventNotes";
import { cn } from "@/lib/cn";
import { findEvent } from "@/lib/events";
import { draw, nextStep, readiness, record, steps, type Progress, type QuizQuestion, type Step } from "@/lib/events/engine";
import { createAmbient, type Ambient } from "@/lib/events/music";
import { clearProgress, loadPref, loadProgress, savePref, saveProgress } from "@/lib/events/storage";
import type { Lang, StudyEvent } from "@/lib/events/types";

const panel = "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5";
const percent = (value: number) => `${Math.round(value * 100)}%`;

type View =
  | { mode: "map" }
  | { mode: "read"; step: Step }
  | { mode: "quiz"; step: Step; quiz: QuizQuestion[]; run: number }
  | { mode: "result"; step: Step; quiz: QuizQuestion[]; answers: number[] };

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const { data, status } = useSession();
  const event = findEvent(id);
  if (!event) {
    return (
      <div className="mx-auto max-w-3xl space-y-3">
        <p>Такого ивента нет.</p>
        <Link href="/events" className="underline">← Все ивенты</Link>
      </div>
    );
  }
  if (status === "loading") return <p>Открываем ивент…</p>;
  if (!data?.user?.id) return <Link href="/login" className="underline">Войти в аккаунт</Link>;
  return <Runner key={`${data.user.id}:${event.id}`} event={event} userId={data.user.id} />;
}

function Runner({ event, userId }: { event: StudyEvent; userId: string }) {
  const list = useMemo(() => steps(event), [event]);
  const [progress, setProgress] = useState<Progress>({});
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>({ mode: "map" });
  const [lang, setLang] = useState<Lang>("en");
  const [music, setMusic] = useState(true);
  const ambient = useRef<Ambient | null>(null);
  const top = useRef<HTMLDivElement>(null);
  // Номер попытки: по нему экран квиза сбрасывает ответы при повторе.
  const runs = useRef(0);

  // Прогресс и настройки живут в браузере — читаем после монтирования, чтобы
  // серверная и клиентская разметка совпали.
  useEffect(() => {
    setProgress(loadProgress(userId, event.id));
    setLang(loadPref("lang", "en") === "ru" ? "ru" : "en");
    setMusic(loadPref("music", "on") !== "off");
    setLoaded(true);
    ambient.current = createAmbient();
    return () => ambient.current?.stop();
  }, [userId, event.id]);

  // Свернули вкладку — музыка замолкает: фон нужен только во время квиза.
  useEffect(() => {
    const onHide = () => {
      if (document.hidden) ambient.current?.stop();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const stepKey = view.mode === "map" ? "map" : `${view.mode}:${view.step.id}`;
  useEffect(() => {
    top.current?.scrollIntoView({ block: "start" });
  }, [stepKey]);

  function switchLang() {
    const next: Lang = lang === "en" ? "ru" : "en";
    setLang(next);
    savePref("lang", next);
  }

  function toggleMusic() {
    const next = !music;
    setMusic(next);
    savePref("music", next ? "on" : "off");
    if (next && view.mode === "quiz") ambient.current?.start();
    else ambient.current?.stop();
  }

  // Вызывается из обработчика нажатия: браузер разрешает звук только по
  // действию человека, поэтому музыка стартует здесь, а не в эффекте.
  function startQuiz(step: Step) {
    if (music) ambient.current?.start();
    setView({ mode: "quiz", step, quiz: draw(event, step), run: ++runs.current });
  }

  function open(step: Step) {
    if (step.kind === "part") {
      ambient.current?.stop();
      setView({ mode: "read", step });
    } else startQuiz(step);
  }

  function finish(step: Step, quiz: QuizQuestion[], answers: number[]) {
    const next = record(progress, step, quiz, answers);
    setProgress(next);
    saveProgress(userId, event.id, next);
    ambient.current?.stop();
    setView({ mode: "result", step, quiz, answers });
  }

  function toMap() {
    ambient.current?.stop();
    setView({ mode: "map" });
  }

  const ready = readiness(event, progress);
  const following = view.mode === "map" ? undefined : list[list.findIndex((s) => s.id === view.step.id) + 1];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 pb-6">
      <div ref={top} />
      {view.mode === "map" && (
        <>
          <header>
            <Link href="/events" className="text-sm underline">← Ивенты</Link>
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{event.course}</p>
            <h1 className="ios-title mt-2">{event.title}</h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{event.description}</p>
          </header>

          <section className="rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-sky-500/10 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest">Готовность к квизу</p>
                <p className="mt-2 text-5xl font-bold tabular-nums">{loaded ? ready.percent : "…"}%</p>
              </div>
              <p className="text-sm">Шагов пройдено: {ready.done} из {ready.total}</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div className="h-full rounded-full bg-violet-400" style={{ width: `${ready.percent}%` }} />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
              {[["Квизы по частям", ready.parts], ["Квизы по лекциям", ready.lectures], ["Итоговый квиз", ready.final]].map(([name, value]) => (
                <div key={name} className="rounded-2xl bg-[var(--color-bg)] p-3">
                  <dt className="text-xs text-[var(--color-muted)]">{name}</dt>
                  <dd className="mt-1 text-lg font-bold tabular-nums">{value}%</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-[var(--color-muted)]">
              Готовность = итоговый квиз (50%) + квизы по лекциям (30%) + квизы по частям (20%). Считается лучший результат; непройденный шаг — ноль.
            </p>
            <Verdict event={event} progress={progress} percent={ready.percent} />
            {loaded && (
              <Button variant="primary" className="mt-4 w-full" onClick={() => open(nextStep(event, progress) ?? list[list.length - 1])}>
                {ready.done === 0 ? "Начать с первой части" : ready.done === ready.total ? "Пройти итоговый квиз ещё раз" : "Продолжить"}
              </Button>
            )}
          </section>

          {event.lectures.map((lecture, li) => (
            <section key={lecture.id} className={panel}>
              <h2 className="text-lg font-bold">{lecture.title.ru}</h2>
              <p className="text-sm text-[var(--color-muted)]">{lecture.title.en}</p>
              <ol className="mt-4 space-y-2">
                {list.filter((s) => s.lecture === li).map((step) => (
                  <StepRow key={step.id} step={step} result={progress[step.id]} onOpen={() => open(step)} />
                ))}
              </ol>
            </section>
          ))}

          <section className={panel}>
            <h2 className="text-lg font-bold">Финал</h2>
            <p className="text-sm text-[var(--color-muted)]">Вопросы вперемешку со всех лекций — как на настоящем квизе.</p>
            <ol className="mt-4 space-y-2">
              <StepRow step={list[list.length - 1]} result={progress[list[list.length - 1].id]} onOpen={() => open(list[list.length - 1])} />
            </ol>
          </section>

          {ready.done > 0 && (
            <Button
              variant="danger"
              className="h-auto min-h-11 whitespace-normal"
              onClick={() => {
                if (!confirm("Сбросить все результаты этого ивента на этом устройстве?")) return;
                clearProgress(userId, event.id);
                setProgress({});
              }}
            >
              Сбросить прогресс
            </Button>
          )}
        </>
      )}

      {view.mode === "read" && (() => {
        const part = event.lectures[view.step.lecture!].parts[view.step.part!];
        return (
          <>
            <header>
              <button className="text-sm underline" onClick={toMap}>← К маршруту</button>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                {event.lectures[view.step.lecture!].title[lang]} · часть {view.step.part! + 1} из {event.lectures[view.step.lecture!].parts.length}
              </p>
              <h1 className="mt-2 text-2xl font-bold">{part.title[lang]}</h1>
            </header>
            <Button size="sm" className="h-auto min-h-9 whitespace-normal" onClick={switchLang}>
              {lang === "en" ? "Перевести на русский" : "Показать оригинал (English)"}
            </Button>
            <article className={panel}>
              <EventNotes text={part.notes[lang]} lang={lang} />
            </article>
            <Button variant="primary" className="h-auto min-h-11 w-full whitespace-normal" onClick={() => startQuiz(view.step)}>
              Начать квиз по этой части · {view.step.count} вопросов
            </Button>
          </>
        );
      })()}

      {view.mode === "quiz" && (
        <Quiz
          key={view.run}
          step={view.step}
          quiz={view.quiz}
          lang={lang}
          music={music}
          onLang={switchLang}
          onMusic={toggleMusic}
          onExit={() => {
            if (confirm("Выйти из квиза? Эта попытка не сохранится.")) toMap();
          }}
          onFinish={(answers) => finish(view.step, view.quiz, answers)}
        />
      )}

      {view.mode === "result" && (
        <Result
          event={event}
          step={view.step}
          quiz={view.quiz}
          answers={view.answers}
          lang={lang}
          best={progress[view.step.id]?.best ?? 0}
          readiness={ready.percent}
          following={following}
          onLang={switchLang}
          onRetry={() => startQuiz(view.step)}
          onReread={view.step.kind === "part" ? () => open(view.step) : undefined}
          onNext={following ? () => open(following) : undefined}
          onMap={toMap}
        />
      )}
    </div>
  );
}

/** Совет по итогам: что именно подтянуть, а не просто цифра. */
function Verdict({ event, progress, percent: value }: { event: StudyEvent; progress: Progress; percent: number }) {
  const final = progress[`${event.id}-final`];
  if (!final) return null;
  const weak = Object.entries(final.byLecture ?? {})
    .map(([li, [right, total]]) => ({ title: event.lectures[Number(li)].title.ru, share: total ? right / total : 1 }))
    .sort((a, b) => a.share - b.share)[0];
  const text = value >= 85 ? "Ты готов к квизу." : value >= 65 ? "Почти готов — повтори слабые места." : "Пока рано: пройди оставшиеся шаги и повтори квизы.";
  return (
    <p role="status" className="mt-3 rounded-2xl bg-[var(--color-bg)] p-3 text-sm">
      <strong>{text}</strong>
      {weak && weak.share < 1 && <> Слабее всего в последнем итоговом квизе: «{weak.title}» — {percent(weak.share)} верных.</>}
    </p>
  );
}

function StepRow({ step, result, onOpen }: { step: Step; result?: Progress[string]; onOpen: () => void }) {
  const label = step.kind === "part" ? `Часть ${step.part! + 1}. ${step.title.ru}` : step.title.ru;
  return (
    <li>
      <button
        onClick={onOpen}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-3 text-left transition hover:bg-[var(--color-surface-2)]"
      >
        <span className="min-w-0">
          <span className={cn("block break-words text-sm", step.kind !== "part" && "font-semibold")}>{label}</span>
          <span className="block text-xs text-[var(--color-muted)]">
            {step.kind === "part" ? `конспект + квиз · ${step.count} вопросов` : `${step.count} вопросов`}
          </span>
        </span>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-semibold tabular-nums",
            !result ? "bg-[var(--color-surface-2)] text-[var(--color-muted)]" : result.best >= 0.8 ? "bg-emerald-500/20" : "bg-amber-500/20",
          )}
        >
          {result ? percent(result.best) : "не пройдено"}
        </span>
      </button>
    </li>
  );
}

function Quiz({
  step, quiz, lang, music, onLang, onMusic, onExit, onFinish,
}: {
  step: Step;
  quiz: QuizQuestion[];
  lang: Lang;
  music: boolean;
  onLang: () => void;
  onMusic: () => void;
  onExit: () => void;
  onFinish: (answers: number[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const item = quiz[index];
  const picked: number | undefined = answers[index];
  const answered = picked !== undefined;
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
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{step.title.ru}</p>
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
        <h2 lang="en" className="text-lg font-semibold leading-snug">{item.q}</h2>
        <div className="mt-4 space-y-2">
          {item.options.map((option, i) => {
            const right = answered && i === item.correct;
            const wrong = answered && i === picked && i !== item.correct;
            return (
              <button
                key={i}
                lang="en"
                disabled={answered}
                aria-pressed={picked === i}
                onClick={() => setAnswers([...answers, i])}
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
              <p className="font-semibold">{picked === item.correct ? "Верно" : "Неверно"}</p>
              <p className="mt-1" lang={lang}>{item.why[lang]}</p>
              <button className="mt-2 text-xs underline" onClick={onLang}>
                {lang === "en" ? "Объяснение на русском" : "Explanation in English"}
              </button>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => (index + 1 === quiz.length ? onFinish(answers) : setIndex(index + 1))}
            >
              {index + 1 === quiz.length ? "Завершить квиз" : "Дальше"}
            </Button>
          </div>
        )}
      </section>
    </>
  );
}

function Result({
  event, step, quiz, answers, lang, best, readiness: ready, following, onLang, onRetry, onReread, onNext, onMap,
}: {
  event: StudyEvent;
  step: Step;
  quiz: QuizQuestion[];
  answers: number[];
  lang: Lang;
  best: number;
  readiness: number;
  following?: Step;
  onLang: () => void;
  onRetry: () => void;
  onReread?: () => void;
  onNext?: () => void;
  onMap: () => void;
}) {
  const mistakes = quiz.map((item, i) => ({ item, picked: answers[i] })).filter(({ item, picked }) => picked !== item.correct);
  const right = quiz.length - mistakes.length;
  const share = quiz.length ? right / quiz.length : 0;
  const perLecture = event.lectures.map((lecture, li) => {
    const mine = quiz.map((item, i) => ({ item, ok: answers[i] === item.correct })).filter(({ item }) => item.lecture === li);
    return { title: lecture.title.ru, right: mine.filter((x) => x.ok).length, total: mine.length };
  }).filter((x) => x.total > 0);

  return (
    <>
      <section className="rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-sky-500/10 p-5">
        <p className="text-xs uppercase tracking-widest">{step.title.ru}</p>
        <p className="mt-3 text-5xl font-bold tabular-nums">{percent(share)}</p>
        <p className="mt-2 text-sm">
          Верных ответов: {right} из {quiz.length} · лучший результат: {percent(best)}
        </p>
        <p className="mt-2 text-sm">
          {share >= 0.8 ? "Отлично — можно идти дальше." : share >= 0.6 ? "Неплохо. Разбери ошибки ниже и двигайся дальше или повтори." : "Стоит перечитать материал и пройти квиз ещё раз."}
        </p>
        {step.kind === "final" && (
          <div className="mt-4 rounded-2xl bg-[var(--color-bg)] p-4">
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Готовность к квизу</p>
            <p className="mt-1 text-4xl font-bold tabular-nums">{ready}%</p>
            <ul className="mt-3 space-y-2 text-sm">
              {perLecture.map((x) => (
                <li key={x.title} className="flex justify-between gap-3">
                  <span className="min-w-0 break-words">{x.title}</span>
                  <span className="shrink-0 tabular-nums">{x.right} из {x.total}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        {onNext && following && (
          <Button variant="primary" className="h-auto min-h-11 whitespace-normal sm:col-span-2" onClick={onNext}>
            Дальше: {following.kind === "part" ? `часть ${following.part! + 1} — ${following.title.ru}` : following.title.ru}
          </Button>
        )}
        <Button className="h-auto min-h-11 whitespace-normal" onClick={onRetry}>Пройти ещё раз (новые вопросы)</Button>
        {onReread && <Button className="h-auto min-h-11 whitespace-normal" onClick={onReread}>Перечитать конспект</Button>}
        <Button variant="ghost" className="h-auto min-h-11 whitespace-normal" onClick={onMap}>К маршруту</Button>
      </div>

      {mistakes.length > 0 && (
        <section className={panel}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Разбор ошибок · {mistakes.length}</h2>
            <button className="text-xs underline" onClick={onLang}>
              {lang === "en" ? "Объяснения на русском" : "Explanations in English"}
            </button>
          </div>
          <ol className="mt-4 space-y-4">
            {mistakes.map(({ item, picked }) => (
              <li key={item.id} className="rounded-2xl border border-[var(--color-border)] p-4 text-sm">
                <p lang="en" className="font-semibold">{item.q}</p>
                {picked !== undefined && picked >= 0 && <p lang="en" className="mt-2 text-[var(--color-strength)]">✗ {item.options[picked]}</p>}
                <p lang="en" className="mt-1 text-[var(--color-stability)]">✓ {item.options[item.correct]}</p>
                <p lang={lang} className="mt-2 text-[var(--color-muted)]">{item.why[lang]}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
