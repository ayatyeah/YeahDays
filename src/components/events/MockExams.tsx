"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import EventNotes from "@/components/EventNotes";
import { cn } from "@/lib/cn";
import type { ExamTask, MockExam, StudyEvent } from "@/lib/events/types";
import { useContentLang, useLocaleStore } from "@/i18n/locale";
import { usePersonalizationStore } from "@/store/usePersonalizationStore";
import { TRAINER_KINDS, type TrainerKind } from "@/lib/visionTrainer";
import type { MockReport } from "@/lib/examReport";
import { openTutor, useTutorDetail } from "@/lib/tutorFocus";

/**
 * Пробные варианты экзамена с открытыми вопросами и проверкой ИИ.
 *
 * Ответы и оценки живут в браузере (ключ на человека, ивент и вариант): это
 * черновик для тренировки, а не результат ивента — в готовность не идут и на
 * сервер не сохраняются. На сервер уходит только сам ответ в момент проверки
 * (api/study-events/grade), и только с согласием.
 */

const CONSENT = "event-grade-v1";
const REPORT_CONSENT = "event-report-v1";

interface Grade {
  score: number;
  points: number;
  verdict: "full" | "partial" | "wrong" | "empty";
  correct: string[];
  missing: string[];
  mistakes: string[];
  tip: string;
  /** Текст, который проверяли: если ответ потом поменяли, оценка устарела. */
  answer: string;
}

interface Saved {
  answers: Record<string, string>;
  grades: Record<string, Grade>;
  startedAt?: number;
  /** Последний отчёт ИИ и по скольким проверенным ответам он собран. */
  report?: MockReport & { graded: number };
}

const key = (userId: string, eventId: string, examId: string) => `yg-mock:${userId}:${eventId}:${examId}`;

function load(userId: string, eventId: string, examId: string): Saved {
  try {
    const raw = localStorage.getItem(key(userId, eventId, examId));
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object") return { answers: parsed.answers ?? {}, grades: parsed.grades ?? {}, startedAt: parsed.startedAt, report: parsed.report };
  } catch {
    /* хранилище недоступно — начнём с чистого листа */
  }
  return { answers: {}, grades: {} };
}

function save(userId: string, eventId: string, examId: string, value: Saved) {
  try {
    localStorage.setItem(key(userId, eventId, examId), JSON.stringify(value));
  } catch {
    /* без хранилища черновик проживёт до закрытия страницы */
  }
}

const total = (exam: MockExam) => exam.questions.reduce((n, q) => n + q.points, 0);
const tasksOf = (exam: MockExam) => exam.questions.flatMap((q) => q.tasks);

/** Сводка по варианту для списка на карте ивента. */
export function mockSummary(userId: string, eventId: string, exam: MockExam) {
  const saved = load(userId, eventId, exam.id);
  const graded = tasksOf(exam).filter((t) => saved.grades[t.id]);
  return { graded: graded.length, tasks: tasksOf(exam).length, score: graded.reduce((n, t) => n + saved.grades[t.id].score, 0), total: total(exam) };
}

export function MockList({ event, userId, onOpen }: { event: StudyEvent; userId: string; onOpen: (exam: MockExam) => void }) {
  const tl = useContentLang();
  const [summaries, setSummaries] = useState<Record<string, ReturnType<typeof mockSummary>>>({});
  useEffect(() => {
    setSummaries(Object.fromEntries((event.mocks ?? []).map((m) => [m.id, mockSummary(userId, event.id, m)])));
  }, [event, userId]);
  if (!event.mocks?.length) return null;
  return (
    <section className="rounded-3xl border border-sky-400/40 bg-gradient-to-br from-sky-500/10 via-[var(--color-surface)] to-violet-500/10 p-5">
      {event.mocksKind === "case" ? (
        <>
          <h2 className="text-lg font-bold">Пробный квиз-кейс · {event.mocks.length} вариантов</h2>
          <p className="text-sm text-[var(--color-muted)]">Как настоящий квиз: кейс и таблица исследований. Часть A — тест, проверяется сразу; часть B — открытые задания, ИИ ставит баллы по критериям преподавателя и объясняет, чего не хватило. В готовность не идёт — это тренировка.</p>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold">Пробный мидтерм · {event.mocks.length} вариантов</h2>
          <p className="text-sm text-[var(--color-muted)]">Как настоящий мидтерм: пять заданий — три открытых вопроса и две задачи с расчётом. Пишешь ответ, ИИ ставит баллы по критериям и объясняет, чего не хватило. В готовность не идёт — это тренировка.</p>
        </>
      )}
      <ol className="mt-4 space-y-2">
        {event.mocks.map((exam) => {
          const s = summaries[exam.id];
          return (
            <li key={exam.id}>
              <button className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-left" onClick={() => onOpen(exam)}>
                <span className="min-w-0">
                  <span className="block font-semibold">{exam.title[tl]}</span>
                  <span className="block text-xs text-[var(--color-muted)]">{exam.source[tl]} · {exam.minutes} мин · {total(exam)} баллов</span>
                </span>
                <span className="shrink-0 text-sm tabular-nums">{s && s.graded > 0 ? `${s.score} / ${s.total}` : "Начать →"}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

const verdictStyle: Record<Grade["verdict"], string> = {
  full: "border-emerald-400/60 bg-emerald-500/10",
  partial: "border-amber-400/60 bg-amber-500/10",
  wrong: "border-red-400/60 bg-red-500/10",
  empty: "border-red-400/60 bg-red-500/10",
};

export default function MockExamView({
  event,
  exam,
  userId,
  onExit,
  onOpenPart,
  onOpenTrainer,
}: {
  event: StudyEvent;
  exam: MockExam;
  userId: string;
  onExit: () => void;
  onOpenPart?: (partId: string) => void;
  onOpenTrainer?: (kind: TrainerKind) => void;
}) {
  const tl = useContentLang();
  const locale = useLocaleStore((s) => s.locale);
  const aiAllowed = usePersonalizationStore((s) => s.data?.ai === true);
  const [saved, setSaved] = useState<Saved>({ answers: {}, grades: {} });
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [batch, setBatch] = useState<{ done: number; of: number } | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [reportBusy, setReportBusy] = useState(false);
  const [reportError, setReportError] = useState("");
  const latest = useRef(saved);

  useEffect(() => {
    const s = load(userId, event.id, exam.id);
    latest.current = s;
    setSaved(s);
    setReady(true);
    void fetch("/api/study-events/grade")
      .then((r) => r.json())
      .then((b: { available?: boolean }) => setAvailable(b.available === true))
      .catch(() => setAvailable(false));
  }, [userId, event.id, exam.id]);

  useEffect(() => {
    if (!saved.startedAt) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [saved.startedAt]);

  function update(change: (s: Saved) => Saved) {
    const next = change(latest.current);
    latest.current = next;
    setSaved(next);
    save(userId, event.id, exam.id, next);
  }

  const tasks = useMemo(() => tasksOf(exam), [exam]);
  const max = total(exam);
  // Подпункт, над которым человек сейчас думает: его видит ИИ-помощник.
  const [focusId, setFocusId] = useState(tasks[0]?.id ?? "");
  const focusQ = exam.questions.find((q) => q.tasks.some((t) => t.id === focusId));
  const focusGrade = saved.grades[focusId];
  useTutorDetail(
    { mock: { examId: exam.id, taskId: focusId, answer: saved.answers[focusId], grade: focusGrade && { score: focusGrade.score, points: focusGrade.points, missing: focusGrade.missing, mistakes: focusGrade.mistakes } } },
    focusQ ? `${focusQ.title.split(" — ")[0]} ${focusQ.tasks.find((t) => t.id === focusId)?.label})` : "",
  );
  const graded = tasks.filter((t) => saved.grades[t.id]);
  const score = graded.reduce((n, t) => n + saved.grades[t.id].score, 0);
  const canSend = available === true && (aiAllowed || consent);
  const pending = tasks.filter((t) => !t.options && (saved.answers[t.id] ?? "").trim() && saved.grades[t.id]?.answer !== (saved.answers[t.id] ?? "").trim());

  /** Тестовый подпункт: ответ проверяется сразу на устройстве, без ИИ; выбор окончательный. */
  function choose(task: ExamTask, index: number) {
    if (!task.options || latest.current.grades[task.id]) return;
    const right = index === task.correct;
    const picked = task.options[index];
    const answer = String(index);
    setFocusId(task.id);
    update((s) => ({
      ...s,
      answers: { ...s.answers, [task.id]: answer },
      grades: {
        ...s.grades,
        [task.id]: {
          score: right ? task.points : 0,
          points: task.points,
          verdict: right ? "full" : "wrong",
          correct: right ? [picked] : [],
          missing: right ? [] : [`Correct option: ${task.options![task.correct ?? 0]}`],
          mistakes: right ? [] : [`Chose: ${picked}`],
          tip: "",
          answer,
        },
      },
    }));
  }

  async function grade(taskId: string): Promise<void> {
    const answer = (latest.current.answers[taskId] ?? "").trim();
    if (!answer) return;
    setBusy((b) => ({ ...b, [taskId]: true }));
    setErrors((e) => ({ ...e, [taskId]: "" }));
    try {
      const res = await fetch("/api/study-events/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, taskId, answer, lang: locale, consent: CONSENT }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof body.error === "string" ? body.error : "Не удалось проверить — попробуй ещё раз");
      update((s) => ({ ...s, grades: { ...s.grades, [taskId]: { ...body, answer } } }));
    } catch (e) {
      setErrors((x) => ({ ...x, [taskId]: e instanceof Error ? e.message : "Не удалось проверить — попробуй ещё раз" }));
    } finally {
      setBusy((b) => ({ ...b, [taskId]: false }));
    }
  }

  async function makeReport() {
    setReportBusy(true);
    setReportError("");
    try {
      const items = tasks
        .filter((t) => latest.current.grades[t.id])
        .map((t) => {
          const g = latest.current.grades[t.id];
          return { taskId: t.id, score: g.score, points: g.points, missing: g.missing, mistakes: g.mistakes };
        });
      const res = await fetch("/api/study-events/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, examId: exam.id, items, lang: locale, consent: REPORT_CONSENT }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof body.error === "string" ? body.error : "Не удалось собрать отчёт — попробуй ещё раз");
      update((s) => ({ ...s, report: { ...(body as MockReport), graded: items.length } }));
      setConsent(false);
    } catch (e) {
      setReportError(e instanceof Error ? e.message : "Не удалось собрать отчёт — попробуй ещё раз");
    } finally {
      setReportBusy(false);
    }
  }

  async function gradeAll() {
    const queue = pending.map((t) => t.id);
    setBatch({ done: 0, of: queue.length });
    // По два запроса сразу: быстрее, чем по одному, и не упирается в лимит частоты.
    const worker = async () => {
      for (let id = queue.shift(); id; id = queue.shift()) {
        await grade(id);
        setBatch((b) => (b ? { ...b, done: b.done + 1 } : b));
      }
    };
    await Promise.all([worker(), worker()]);
    setBatch(null);
    setConsent(false);
  }

  const left = saved.startedAt ? Math.max(0, saved.startedAt + exam.minutes * 60_000 - now) : 0;
  const clock = (ms: number) => {
    const s = Math.ceil(ms / 1000);
    return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-5 pb-10">
      <header className="space-y-2">
        <button className="text-sm underline" onClick={onExit}>← К маршруту</button>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{event.course} · {exam.source[tl]}</p>
        <h1 className="text-2xl font-bold">{exam.title[tl]}</h1>
        <p className="text-sm text-[var(--color-muted)]">{exam.minutes} минут · {max} баллов · пиши, как на экзамене, по-английски или по-русски. Черновик сохраняется на этом устройстве.</p>
      </header>

      <div className="sticky top-2 z-10 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm shadow-lg">
        <span>
          Проверено: <b>{graded.length}</b> из {tasks.length} · <b className="tabular-nums">{score}</b> / {max}
        </span>
        {saved.startedAt ? (
          <span className="flex items-center gap-2 tabular-nums">
            {left > 0 ? <>⏱ {clock(left)}</> : <b className="text-red-400">Время вышло</b>}
            <button className="underline" onClick={() => update((s) => ({ ...s, startedAt: undefined }))}>стоп</button>
          </span>
        ) : (
          <button className="underline" onClick={() => update((s) => ({ ...s, startedAt: Date.now() }))}>▶ Засечь {exam.minutes} минут</button>
        )}
      </div>

      <section className="space-y-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        {available === false && <p className="text-sm text-[var(--color-muted)]">ИИ сейчас не подключён — пиши ответы и сверяйся с эталоном.</p>}
        {available && !aiAllowed && (
          <label className="flex items-start gap-2 text-xs">
            <input type="checkbox" className="mt-0.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>Разрешаю отправить условие, критерии и мой ответ в OpenAI для проверки. Ответ на сервере не сохраняется.</span>
          </label>
        )}
        {available && (
          <Button variant="primary" className="h-auto min-h-11 w-full whitespace-normal" disabled={!canSend || !!batch || pending.length === 0} onClick={() => void gradeAll()}>
            {batch
              ? `Проверяю ${batch.done} из ${batch.of}…`
              : pending.length
                ? `Проверить все ответы ИИ · ${pending.length}`
                : graded.length
                  ? "Все ответы проверены"
                  : "Напиши ответы — и проверь все разом"}
          </Button>
        )}
      </section>

      {available && graded.length >= 3 && (
        <section className="space-y-3 rounded-3xl border border-sky-400/40 bg-sky-500/5 p-5">
          <h2 className="text-lg font-bold">Отчёт по варианту</h2>
          {saved.report ? (
            <>
              {saved.report.summary && <p className="text-sm leading-relaxed">{saved.report.summary}</p>}
              {saved.report.topics.map((t) => (
                <div key={t.title} className="space-y-1.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                  <p className="font-semibold">{t.title}</p>
                  {t.why && <p className="text-sm text-[var(--color-muted)]">{t.why}</p>}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {t.parts.map((id) => {
                      const part = event.lectures.flatMap((l) => l.parts).find((p) => p.id === id);
                      return part && onOpenPart ? (
                        <button key={id} className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs hover:border-[var(--color-fg-dim)]" onClick={() => onOpenPart(id)}>
                          Конспект: {part.title[tl]}
                        </button>
                      ) : null;
                    })}
                    {t.trainers.map((k) => onOpenTrainer && (
                      <button key={k} className="rounded-full border border-amber-400/50 px-3 py-1 text-xs hover:border-amber-300" onClick={() => onOpenTrainer(k)}>
                        Тренажёр: {TRAINER_KINDS.find((x) => x.kind === k)?.title ?? k}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {saved.report.plan.length > 0 && (
                <div className="text-sm">
                  <b>План на следующее занятие:</b>
                  <ol className="list-decimal pl-5">{saved.report.plan.map((p) => <li key={p}>{p}</li>)}</ol>
                </div>
              )}
              <p className="text-xs text-[var(--color-muted)]">Собран по {saved.report.graded} проверенным ответам.</p>
            </>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">ИИ соберёт слабые темы по итогам проверки и подскажет, какие части конспекта перечитать и какие задачи порешать в тренажёре. Твои ответы не отправляются — только баллы и замечания проверки.</p>
          )}
          {reportError && <p role="alert" className="text-sm text-red-400">{reportError}</p>}
          <Button disabled={!canSend || reportBusy || !!batch} onClick={() => void makeReport()}>
            {reportBusy ? "Собираю отчёт…" : saved.report ? "Обновить отчёт" : "Собрать отчёт ИИ"}
          </Button>
        </section>
      )}

      {ready && exam.questions.map((question) => (
        <section key={question.id} className="space-y-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          {question.kind && (
            <p className={cn("w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold", question.kind === "task" ? "bg-amber-500/15 text-amber-300" : "bg-sky-500/15 text-sky-300")}>
              {question.kind === "task" ? "Задача: расчёт" : "Открытый вопрос"}
            </p>
          )}
          <h2 className="text-lg font-bold" lang="en">{question.title} <span className="text-sm font-normal text-[var(--color-muted)]">[{question.points} pts]</span></h2>
          {question.context.trim() && <div lang="en"><EventNotes text={question.context} lang="en" /></div>}
          {question.tasks.map((task) => {
            const answer = saved.answers[task.id] ?? "";
            const g = saved.grades[task.id];
            const stale = g && g.answer !== answer.trim();
            return (
              <div key={task.id} className="space-y-2 border-t border-[var(--color-border)] pt-4">
                <div lang="en" className="flex gap-2">
                  <b className="shrink-0">{task.label})</b>
                  <div className="min-w-0 flex-1">
                    <span className="mr-1 text-xs text-[var(--color-muted)]">[{task.points} pts]</span>
                    <EventNotes text={task.prompt} lang="en" />
                  </div>
                </div>
                {task.options ? (
                  <div className="space-y-2">
                    {task.options.map((option, i) => {
                      const chosen = g ? Number(g.answer) === i : false;
                      const right = !!g && i === task.correct;
                      return (
                        <button
                          key={i}
                          lang="en"
                          disabled={!!g}
                          aria-pressed={chosen}
                          onClick={() => choose(task, i)}
                          className={cn(
                            "block w-full rounded-2xl border px-3 py-2.5 text-left text-sm transition",
                            !g && "border-[var(--color-border)] hover:bg-[var(--color-surface-2)]",
                            right && "border-emerald-400 bg-emerald-500/15",
                            chosen && !right && "border-red-400 bg-red-500/15",
                            g && !right && !chosen && "border-[var(--color-border)] opacity-60",
                          )}
                        >
                          <span className="mr-2 font-semibold">{String.fromCharCode(65 + i)})</span>
                          {option}
                        </button>
                      );
                    })}
                    {g && (
                      <div role="status" className={cn("space-y-1.5 rounded-2xl border px-4 py-3 text-sm", verdictStyle[g.verdict])}>
                        <p className="font-semibold">{g.score > 0 ? "Верно" : "Неверно"} · {g.score} из {g.points}</p>
                        <div lang={tl}><EventNotes text={task.answer[tl]} lang={tl} /></div>
                      </div>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => { setFocusId(task.id); openTutor(); }}>✦ Спросить помощника</Button>
                  </div>
                ) : (
                <>
                <textarea
                  aria-label={`Ответ ${task.label}`}
                  value={answer}
                  maxLength={3000}
                  rows={4}
                  placeholder="Твой ответ…"
                  onFocus={() => setFocusId(task.id)}
                  onChange={(e) => {
                    const value = e.target.value;
                    update((s) => ({ ...s, answers: { ...s.answers, [task.id]: value } }));
                  }}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--color-fg-dim)]"
                />
                <div className="flex flex-wrap gap-2">
                  {available && (
                    <Button size="sm" disabled={!answer.trim() || !canSend || busy[task.id] || !!batch} onClick={() => { void grade(task.id).then(() => setConsent(false)); }}>
                      {busy[task.id] ? "Проверяю…" : g && !stale ? "Проверить ещё раз" : "Проверить ИИ"}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setOpen((o) => ({ ...o, [task.id]: !o[task.id] }))}>{open[task.id] ? "Скрыть эталон" : "Эталон и критерии"}</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setFocusId(task.id); openTutor(); }}>✦ Спросить помощника</Button>
                </div>
                {errors[task.id] && <p role="alert" className="text-sm text-red-400">{errors[task.id]}</p>}
                {g && (
                  <div role="status" className={cn("space-y-1.5 rounded-2xl border px-4 py-3 text-sm", verdictStyle[g.verdict])}>
                    <p className="font-semibold">
                      ИИ: {g.score} из {g.points}
                      {stale && <span className="ml-2 text-xs font-normal text-[var(--color-muted)]">ответ изменён — проверь заново</span>}
                    </p>
                    {g.correct.length > 0 && <List title="Засчитано" items={g.correct} />}
                    {g.missing.length > 0 && <List title="Не хватает" items={g.missing} />}
                    {g.mistakes.length > 0 && <List title="Ошибки" items={g.mistakes} />}
                    {g.tip && <p><b>Совет:</b> {g.tip}</p>}
                  </div>
                )}
                {open[task.id] && (
                  <div className="space-y-3 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-4 py-3 text-sm">{/* эталон и критерии */}
                    <div lang="en">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">Как написать на экзамене</p>
                      <EventNotes text={task.answer.en} lang="en" />
                    </div>
                    <div lang="ru">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">Разбор</p>
                      <EventNotes text={task.answer.ru} lang="ru" />
                    </div>
                    <div lang="en">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">Критерии</p>
                      <ul className="list-disc space-y-1 pl-5">{task.rubric.map((r) => <li key={r}>{r}</li>)}</ul>
                    </div>
                  </div>
                )}
                </>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <b>{title}:</b>
      <ul className="list-disc pl-5">{items.map((v) => <li key={v}>{v}</li>)}</ul>
    </div>
  );
}
