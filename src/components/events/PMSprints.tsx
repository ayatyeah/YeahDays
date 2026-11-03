"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { availableQuestions, variants } from "@/lib/events/pmRealQuiz/model";
import { advanceSprint, createSprint, emptySprintState, lockSprintAnswer, parseSprintState, sprintKey, type SprintState } from "@/lib/events/pmRealQuiz/sprints";
import PMQuizVersion, { type PMQuizMode } from "./PMQuizVersion";

const button = "min-h-11 rounded-xl border border-[var(--color-border)] px-4 py-2 font-semibold disabled:opacity-40";
const letters = "ABCDE";
const byId = new Map(availableQuestions.map(q => [q.id, q]));
export default function PMSprints({ userId, onVersionChange }: { userId: string; onVersionChange: (mode: PMQuizMode) => void }) {
  const [state, setState] = useState<SprintState>(emptySprintState);
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [count, setCount] = useState("20");
  const scroller = useRef<HTMLDivElement>(null);
  const key = sprintKey(userId);
  useEffect(() => {
    try { current.current = parseSprintState(localStorage.getItem(key)); setState(current.current); } catch { setError(true); }
    setReady(true);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [key]);
  function commit(next: SprintState) {
    current.current = next;
    setState(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setError(false); } catch { setError(true); }
  }
  function advance() { commit(advanceSprint(current.current)); scroller.current?.scrollTo({ top: 0 }); }
  const s = state.sprint;
  const q = s ? byId.get(s.ids[s.index])! : null;
  const selected = q && s ? s.answers[q.id] : undefined;
  const covered = Object.keys(state.record).length;
  const correctCoverage = availableQuestions.filter(q => state.record[q.id]?.lastAnswer === q.answer).length;
  const validCount = Number.isInteger(Number(count)) && Number(count) >= 1 && Number(count) <= availableQuestions.length;
  const score = s ? s.ids.filter(id => s.answers[id] === byId.get(id)!.answer).length : 0;
  if (!ready) return <p role="status">Загружаем спринты…</p>;
  return createPortal(<section data-testid="pm-sprints" data-no-i18n className="fixed inset-x-0 bottom-0 top-[var(--history-nav-height)] z-[60] flex h-[calc(100dvh-var(--history-nav-height))] flex-col overflow-hidden bg-[var(--color-bg)]">
    <header className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3"><Link className="flex min-h-11 items-center text-sm" href="/learn">← Учёба</Link><h1 className="text-base font-bold">ПМ · Спринты</h1><span className="text-xs">{s && !s.finished ? `${s.index + 1} / ${s.ids.length}` : `${covered} / ${availableQuestions.length} пройдено`}</span></div>
      <PMQuizVersion mode="sprints" onChange={onVersionChange} />
    </header>
    <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto overscroll-contain"><div className="mx-auto max-w-4xl space-y-4 p-4 sm:p-6">
      {error && <p role="alert" className="rounded-xl border border-amber-400 p-3">Не удалось сохранить прогресс. Не закрывай вкладку, пока сохранение не восстановится.</p>}
      {!s && <div className="space-y-5" data-testid="pm-sprint-setup">
        <h2 className="text-2xl font-bold">Новый спринт</h2>
        <p>Первый выбор фиксируется сразу. Поменять ответ нельзя. Правильные ответы и разборы откроются после последнего вопроса.</p>
        <div className="rounded-2xl border border-[var(--color-border)] p-4"><p>Пройдено уникальных: <strong>{covered} / {availableQuestions.length}</strong></p><p>Верно в последней попытке: <strong>{correctCoverage} / {availableQuestions.length}</strong></p><p className="mt-2 text-sm text-[var(--color-muted)]">Сначала попадутся ещё не пройденные вопросы, затем ошибки, затем повторение. Внутри спринта повторов нет. Порядок A–E сохранён.</p></div>
        <label className="block space-y-2 font-semibold">Количество вопросов<input aria-label="Количество вопросов" type="number" inputMode="numeric" min={1} max={availableQuestions.length} value={count} onChange={e => setCount(e.target.value)} className="block min-h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-lg" /></label>
        <div className="flex flex-wrap gap-2">{[10,20,30,50,100,availableQuestions.length].map(n => <button key={n} className={button} onClick={() => setCount(String(n))} aria-pressed={Number(count) === n}>{n === availableQuestions.length ? `Все ${n}` : n}</button>)}</div>
        {!validCount && <p role="alert">Выбери целое число от 1 до {availableQuestions.length}.</p>}
        <button className={`${button} w-full bg-violet-600 text-white`} disabled={!validCount} onClick={() => commit({ ...current.current, sprint: createSprint(current.current.record, Number(count)) })}>Начать спринт</button>
        <p className="text-xs text-[var(--color-muted)]">Прогресс спринтов сохраняется отдельно от версии «Обучение», в этом браузере. Можно переключить версию и продолжить позже.</p>
      </div>}
      {s && !s.finished && q && <article className="space-y-4" data-testid="pm-sprint-question">
        <p className="text-sm text-[var(--color-muted)]">{variants.find(v => v.id === q.variant)?.label} · №{q.number} · Лекция {q.lecture}</p>
        <h2 className="whitespace-pre-line text-lg font-bold leading-relaxed sm:text-xl">{q.text}</h2>
        {q.transcriptionNote && <p className="text-xs text-[var(--color-muted)]">{q.transcriptionNote}</p>}
        <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Ответы — выбор необратим">{q.options.map((option, i) => <button key={i} disabled={selected !== undefined} aria-pressed={selected === i} className={`min-h-14 rounded-2xl border p-3 text-left leading-relaxed ${selected === i ? "border-violet-500 bg-violet-500/15" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`} onClick={() => commit(lockSprintAnswer(current.current, q.id, i))}><strong>{letters[i]}.</strong> {option}</button>)}</div>
        <p className="text-sm" role="status">{selected !== undefined ? `Ответ ${letters[selected]} зафиксирован. Изменить его нельзя.` : "Нажатие на вариант сразу фиксирует ответ."}</p>
      </article>}
      {s?.finished && <section className="space-y-4" data-testid="pm-sprint-result">
        <h2 className="text-2xl font-bold">Спринт завершён</h2><p className="text-3xl font-black">{score} / {s.ids.length} · {Math.round(score / s.ids.length * 100)}%</p>
        <p>Ошибок: {s.ids.length - score}. Пройдено уникальных: {covered} / {availableQuestions.length}. Верно в последней попытке: {correctCoverage}.</p>
        <button className={`${button} bg-violet-600 text-white`} onClick={() => { commit({ ...current.current, sprint: null }); scroller.current?.scrollTo({ top: 0 }); }}>Настроить следующий спринт</button>
        <h3 className="text-lg font-bold">Ответы и разборы</h3>
        {s.ids.map((id, i) => { const item = byId.get(id)!; const chosen = s.answers[id]; const correct = chosen === item.answer; return <details key={id} className="rounded-2xl border border-[var(--color-border)] p-4"><summary className="min-h-11 cursor-pointer font-semibold">{i + 1}. {correct ? "Верно" : "Ошибка"} · {variants.find(v => v.id === item.variant)?.label} · №{item.number}</summary><p className="my-3 whitespace-pre-line font-semibold">{item.text}</p><p>Твой ответ: {letters[chosen]}. {item.options[chosen]}</p><p className="my-2">Правильный: {letters[item.answer!]}. {item.options[item.answer!]}</p><p>{item.explanation}</p></details>; })}
      </section>}
    </div></div>
    {s && !s.finished && <footer className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"><div className="mx-auto flex max-w-4xl gap-3"><button className={button} disabled={s.index === 0} onClick={() => { commit({ ...current.current, sprint: { ...current.current.sprint!, index: s.index - 1 } }); scroller.current?.scrollTo({ top: 0 }); }}>← Назад</button><button className={`${button} flex-1 bg-violet-600 text-white`} disabled={selected === undefined} onClick={advance}>{s.index === s.ids.length - 1 ? "Завершить спринт" : "Следующий →"}</button></div></footer>}
  </section>, document.body);
}
