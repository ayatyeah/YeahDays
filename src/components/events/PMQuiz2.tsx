"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import questions from "@/lib/events/projectManagement/quiz2_questions.json";
import { answerQuiz2, finishQuiz2, newQuiz2Attempt, parseQuiz2Attempt, PM_QUIZ2_TITLE, quiz2Key, type Quiz2Attempt } from "@/lib/events/projectManagement/quiz2";

const panel = "space-y-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6";
const letters = "ABCDE";
export default function PMQuiz2({ userId, onExit }: { userId: string; onExit: () => void }) {
  const [attempt, setAttempt] = useState<Quiz2Attempt | null>(null);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(0);
  const [saveError, setSaveError] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [onlyErrors, setOnlyErrors] = useState(false);
  const current = useRef<Quiz2Attempt | null>(null);
  const key = quiz2Key(userId);
  function persist(next: Quiz2Attempt) {
    current.current = next;
    setAttempt(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setSaveError(false); }
    catch { setSaveError(true); }
  }
  useEffect(() => {
    let saved: Quiz2Attempt | null = null;
    try { saved = parseQuiz2Attempt(localStorage.getItem(key)); } catch { setSaveError(true); }
    const time = Date.now();
    if (saved && saved.submittedAt === null && saved.deadline <= time) saved = finishQuiz2(saved, time);
    current.current = saved;
    setAttempt(saved); setNow(time); setReady(true);
    if (saved) {
      try { localStorage.setItem(key, JSON.stringify(saved)); } catch { setSaveError(true); }
    }
  }, [key]);
  useEffect(() => {
    if (!ready || !attempt || attempt.submittedAt !== null) return;
    const tick = () => {
      const time = Date.now(); setNow(time);
      const active = current.current;
      if (active && active.submittedAt === null && time >= active.deadline) {
        const done = finishQuiz2(active, time);
        current.current = done; setAttempt(done); setConfirm(false);
        try { localStorage.setItem(key, JSON.stringify(done)); } catch { setSaveError(true); }
      }
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    return () => { clearInterval(interval); window.removeEventListener("focus", tick); document.removeEventListener("visibilitychange", tick); };
  }, [ready, attempt?.deadline, attempt?.submittedAt, key, !!attempt]);
  const question = questions[index];
  const submitted = attempt?.submittedAt != null;
  const answered = attempt?.answers.filter(a => a !== null).length ?? 0;
  const seconds = attempt ? Math.max(0, Math.ceil((attempt.deadline - now) / 1000)) : 3600;
  const correct = (i: number) => attempt?.answers[i] === letters.indexOf(questions[i].correct_option);
  const score = questions.filter((_, i) => correct(i)).length;
  function start() { const time = Date.now(); setNow(time); setIndex(0); setConfirm(false); setOnlyErrors(false); persist(newQuiz2Attempt(time)); }
  return <div className="space-y-5" data-no-i18n data-testid="pm-quiz2">
    <Button variant="ghost" onClick={onExit}>← К подготовке по ПМ</Button>
    <header className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">Project Management · Practice / Simulated</p>
      <h1 className="break-words text-2xl font-black leading-tight sm:text-3xl">{PM_QUIZ2_TITLE}</h1>
      <p className={`text-sm text-[var(--color-muted)] ${attempt ? "hidden" : ""}`}>Отдельный тренировочный вариант по лекциям 4–8. Авторские задания со ссылками на страницы лекций. 60 минут и формат A–E выбраны для самостоятельной тренировки.</p>
    </header>
    {saveError && <p role="alert" className="rounded-2xl border border-amber-400 p-3 text-sm">Не удалось сохранить попытку на устройстве. Не закрывай эту вкладку до завершения.</p>}
    {!ready ? <p role="status">Загружаем попытку…</p> : !attempt ? <section className={panel}>
      <h2 className="text-xl font-bold">Репетиция квиза</h2>
      <p>50 вопросов · один правильный ответ · варианты A–E · 60 минут.</p>
      <p className="text-sm">Вопросы на английском. Ответы и подробный русский разбор откроются после сдачи. Можно пропускать вопросы и возвращаться. По окончании времени попытка сдаётся автоматически.</p>
      <p className="text-sm text-[var(--color-muted)]">Ответы сохраняются в этом браузере для твоего аккаунта. Между устройствами эта попытка не переносится. Таймер продолжает идти, даже если закрыть страницу. Для расчётов хватит черновика.</p>
      <Button onClick={start}>Начать 60 минут</Button>
    </section> : submitted ? <>
      <section className={panel} data-testid="quiz2-result">
        <h2 className="text-2xl font-bold">Результат: {score} / 50</h2>
        <p>{Math.round(score / 50 * 100)}% · отвечено {answered} / 50 · тренировочный эквивалент: {(score / 50 * 18).toFixed(2)} / 18 баллов</p>
        <p className="text-sm text-[var(--color-muted)]">Это результат тренировки, не официальная оценка. {attempt.submittedAt === attempt.deadline ? "Время закончилось — попытка сдана автоматически." : "Попытка сдана."}</p>
        <h3 className="font-semibold">Что повторить</h3>
        <ul className="space-y-2">{[4,5,6,7,8].map(l => {
          const items = questions.map((q,i) => ({q,i})).filter(x => x.q.lecture === l);
          const mistakes = items.filter(x => !correct(x.i));
          return <li key={l} className="text-sm"><b>Lecture {l}: {items.length-mistakes.length} / {items.length}</b>{mistakes.length ? <span> · повтори: {mistakes.map(x => x.q.topic).join(", ")}</span> : " · все ответы верны"}</li>;
        })}</ul>
        <Button onClick={start}>Пройти заново</Button>
      </section>
      <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={onlyErrors} onChange={e => setOnlyErrors(e.target.checked)} />Только ошибки и пропуски</label>
      {questions.map((q,i) => (!onlyErrors || !correct(i)) && <section key={q.id} className={panel} data-testid="quiz2-review">
        <h3 className="font-bold">{i+1}. {correct(i) ? "Верно" : attempt.answers[i] === null ? "Пропущено" : "Ошибка"} · Lecture {q.lecture}</h3>
        <p data-selection-question lang="en"><b>Scenario:</b> {q.scenario}</p><p data-selection-question lang="en"><b>Question:</b> {q.question}</p>
        <p className="text-sm"><b>Разбор:</b> {q.detailed_russian_explanation}</p>
        <ol className="space-y-3">{q.options.map((o,j) => <li key={o} className="rounded-xl border border-[var(--color-border)] p-3 text-sm">
          <p data-selection-question lang="en"><b>{letters[j]}. {o}</b></p>
          <p className="my-1 font-semibold">{q.correct_option === letters[j] ? "✓ Правильный ответ" : "Неверный вариант"}{attempt.answers[i] === j ? " · Твой ответ" : ""}</p>
          <p>{q.per_option_explanations[j]}</p>
        </li>)}</ol>
        <p className="break-words text-xs text-[var(--color-muted)]">Источник: {q.source_pdf} · слайд {q.source_pages.join(", ")}.</p>
      </section>)}
      {onlyErrors && score === 50 && <p>Ошибок нет. Все 50 ответов верны.</p>}
    </> : <>
      <div className="sticky top-2 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <span>Отвечено: <b>{answered} / 50</b></span><span role="timer" aria-label="Оставшееся время" className="font-bold tabular-nums">{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</span>
      </div>
      <details className="rounded-2xl border border-[var(--color-border)] p-3"><summary className="min-h-11 cursor-pointer py-2 font-semibold">Перейти к вопросу · {index+1} / 50</summary><nav aria-label="Номера вопросов" className="grid grid-cols-5 gap-2 sm:grid-cols-10">{questions.map((q,i) => <button key={q.id} aria-label={`Вопрос ${i+1}${attempt.answers[i] === null ? ", без ответа" : ", отвечен"}`} aria-current={index===i ? "step" : undefined} onClick={() => setIndex(i)} className={`min-h-11 rounded-xl border text-sm ${index===i ? "border-[var(--color-fg)] font-black" : "border-[var(--color-border)]"} ${attempt.answers[i] !== null ? "bg-[var(--color-surface-2)]" : ""}`}>{i+1}{attempt.answers[i] !== null ? " ✓" : ""}</button>)}</nav></details>
      <section className={panel} data-testid="quiz2-question">
        <p className="font-semibold">Вопрос {index+1} из 50</p>
        <p data-selection-question lang="en"><b>Scenario:</b> {question.scenario}</p>
        <fieldset className="space-y-3" lang="en"><legend data-selection-question lang="en" className="mb-3"><b>Question:</b> {question.question}</legend>
          {question.options.map((o,j) => <label data-selection-question lang="en" key={`${question.id}-${j}`} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-2xl border border-[var(--color-border)] p-3 has-[:checked]:bg-[var(--color-surface-2)]">
            <input type="radio" className="mt-1 shrink-0" name={question.id} value={j} checked={attempt.answers[index] === j} onChange={() => { const active=current.current; if(active) persist(answerQuiz2(active,index,j,Date.now())); }} />
            <span data-selection-question lang="en">{letters[j]}. {o}</span>
          </label>)}
        </fieldset>
        <div className="flex flex-wrap justify-between gap-2"><Button disabled={index===0} onClick={() => setIndex(i=>i-1)}>← Назад</Button><Button disabled={index===49} onClick={() => setIndex(i=>i+1)}>Дальше →</Button></div>
      </section>
      {confirm ? <section className={panel} aria-label="Подтверждение сдачи">
        <p>Сдать попытку? Без ответа: {50-answered}. После сдачи изменить ответы нельзя.</p>
        <div className="flex flex-wrap gap-3"><Button onClick={() => { const active=current.current; if(active) persist(finishQuiz2(active,Date.now())); setConfirm(false); }}>Подтвердить сдачу</Button><Button variant="ghost" onClick={() => setConfirm(false)}>Продолжить решать</Button></div>
      </section> : <Button onClick={() => setConfirm(true)}>Сдать квиз</Button>}
      <p className="text-xs text-[var(--color-muted)]">{saveError ? "Сохранение недоступно" : "Попытка сохраняется на этом устройстве"} · Разбор доступен только после сдачи.</p>
    </>}
  </div>;
}
