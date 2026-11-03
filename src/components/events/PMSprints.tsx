"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { availableQuestions, variants } from "@/lib/events/pmRealQuiz/model";
import { advanceSprint, createSprint, emptySprintState, lockSprintAnswer, parseSprintState, sprintKey, sprintGroups, sprintQuestions, type SprintOrder, type SprintState } from "@/lib/events/pmRealQuiz/sprints";
import notes from "@/lib/events/pmRealQuiz/notes.json";
import PMQuizVersion, { type PMQuizMode } from "./PMQuizVersion";

const button = "min-h-11 rounded-xl border border-[var(--color-border)] px-4 py-2 font-semibold disabled:opacity-40";
const letters = "ABCDE";
const byId = new Map(sprintQuestions.map(q => [q.id, q]));
function NoteLink({ question }: { question: (typeof sprintQuestions)[number] }) {
  const sourceNumber = question.variant === "supplement" ? Number(question.id.split("-").at(-1)) : question.number;
  const topicByNumber: Record<number, string> = { 1: "control", 2: "control", 3: "groups", 4: "authority", 5: "structures", 6: "structures", 7: "agile", 8: "methods", 9: "methods", 10: "scrum-foundation", 11: "scrum-events", 12: "scrum-artifacts", 13: "personas", 14: "stories", 15: "stories", 16: "control", 17: "control", 18: "evm", 19: "evm", 20: "evm", 21: "groups", 22: "groups", 23: "authority", 24: "authority", 25: "structures", 26: "structures", 27: "structures", 28: "structures", 29: "structures", 30: "agile", 31: "agile", 32: "agile", 33: "methods", 34: "lean", 35: "lean", 36: "leader", 37: "scrum-foundation", 38: "scrum-foundation", 39: "scrum-roles", 40: "scrum-roles", 41: "scrum-events", 42: "scrum-events", 43: "scrum-events", 44: "personas", 45: "personas", 46: "personas", 47: "stories", 48: "stories", 49: "stories", 50: "stories" };
  const topic = question.id === "pm-supp-html-11" ? "scrum-roles" : topicByNumber[sourceNumber];
  const note = notes.find(n => n.examples.includes(`${question.variant}:${question.number}`)) ?? notes.find(n => n.id === topic) ?? notes.find(n => n.lecture === question.lecture)!;
  return <a className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline" href={`/events/project-management-quiz-2-real?pmMode=learn&pmView=full&pmNote=${note.id}#note-${note.id}`}>Читать конспект: {note.title} →</a>;
}
export default function PMSprints({ userId, onVersionChange }: { userId: string; onVersionChange: (mode: PMQuizMode) => void }) {
  const [state, setState] = useState<SprintState>(emptySprintState);
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [group, setGroup] = useState("1");
  const [order, setOrder] = useState<SprintOrder>("ordered");
  const [configure, setConfigure] = useState(false);
  const [count, setCount] = useState("20");
  const scroller = useRef<HTMLDivElement>(null);
  const key = sprintKey(userId);
  useEffect(() => {
    try {
      current.current = parseSprintState(localStorage.getItem(key)); setState(current.current);
      const saved = current.current.sprint;
      if (saved?.group) { setGroup(saved.group); setCount(String(Math.min(50, saved.ids.length))); }
      if (saved?.order) setOrder(saved.order);
    } catch { setError(true); }
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
  const covered = availableQuestions.filter(q => state.record[q.id]).length;
  const supplementCovered = sprintQuestions.filter(q => q.variant === "supplement" && state.record[q.id]).length;
  const correctCoverage = availableQuestions.filter(q => state.record[q.id]?.lastAnswer === q.answer).length;
  const pool = sprintGroups.find(g => g.id === group)!;
  const maximum = Math.min(50, pool.ids.length);
  const validCount = Number.isInteger(Number(count)) && Number(count) >= 1 && Number(count) <= maximum;
  const score = s ? s.ids.filter(id => s.answers[id] === byId.get(id)!.answer).length : 0;
  if (!ready) return <p role="status">Загружаем спринты…</p>;
  return createPortal(<section data-testid="pm-sprints" data-no-i18n className="fixed inset-x-0 bottom-0 top-[var(--history-nav-height)] z-[60] flex h-[calc(100dvh-var(--history-nav-height))] flex-col overflow-hidden bg-[var(--color-bg)]">
    <header className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3"><Link className="flex min-h-11 items-center text-sm" href="/learn">← Учёба</Link><h1 className="text-base font-bold">ПМ · Спринты</h1><span className="text-xs">{s && !s.finished ? `${s.index + 1} / ${s.ids.length}` : `${covered} / ${availableQuestions.length} пройдено`}</span></div>
      <PMQuizVersion mode="sprints" onChange={onVersionChange} />
    </header>
    <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto overscroll-contain"><div className="mx-auto max-w-4xl space-y-4 p-4 sm:p-6">
      {error && <p role="alert" className="rounded-xl border border-amber-400 p-3">Не удалось сохранить прогресс. Не закрывай вкладку, пока сохранение не восстановится.</p>}
      {(!s || configure) && <div className="space-y-5" data-testid="pm-sprint-setup">
        <h2 className="text-2xl font-bold">Новый спринт</h2>
        <p>Первый выбор фиксируется сразу. Поменять ответ нельзя. Сразу после выбора увидишь результат и объяснение. Кнопка «Разбор» внизу откроет его без поиска прокруткой.</p>
        <div className="rounded-2xl border border-[var(--color-border)] p-4"><p>Пройдено уникальных: <strong>{covered} / {availableQuestions.length}</strong></p><p>Дополнение: <strong>{supplementCovered} / 54</strong> · Основной банк с фото: 192 вопроса.</p><p>Верно в последней попытке: <strong>{correctCoverage} / {availableQuestions.length}</strong></p><p className="mt-2 text-sm text-[var(--color-muted)]">Внутри спринта повторов нет. У вопросов с фото порядок A–E сохранён. HTML содержит сокращённые формулировки; вопросы и отвлекающие ответы DOCX составлены для тренировки по ключу. Дополнительные подборки — учебное разделение остальных вопросов, а не номера реальных вариантов.</p></div>
        {configure && s && <div className="space-y-2 rounded-xl border border-amber-400 p-3"><p>Запуск нового спринта заменит текущую попытку. Общий прогресс сохранится.</p><button className={button} onClick={() => setConfigure(false)}>Продолжить текущий спринт</button></div>}
        <label className="block space-y-2 font-semibold">Вариант спринта<select aria-label="Вариант спринта" value={group} onChange={e => { setGroup(e.target.value); const max = sprintGroups.find(g => g.id === e.target.value)!.ids.length; setCount(String(Math.min(Number(count) || 20, max, 50))); }} className="block min-h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3">{sprintGroups.map(g => <option key={g.id} value={g.id}>{g.label} · {g.ids.length} вопросов</option>)}</select></label>
        <p className="text-sm text-[var(--color-muted)]">{group.startsWith("supplement") ? "Отдельное учебное дополнение. Не входит в основной банк из 192 вопросов с фотографий. HTML — 14 вопросов; DOCX — 40 авторских тренировочных вопросов по ключу. Все доступны в двух подборках до 50 вопросов." : group === "4" ? "В варианте 4 доступны 37 вопросов: отсутствующие оригиналы не добавляем." : group === "5" ? "Предположительно вариант 5: доступны 46 вопросов, обложки с номером нет." : group.startsWith("extra") ? "Вопросы из предполагаемого варианта 3 и со страниц без номера. Исходный номер указан у каждого вопроса." : "Все 50 вопросов варианта 1."}</p>
        <label className="block space-y-2 font-semibold">Порядок вопросов<select aria-label="Порядок вопросов" value={order} onChange={e => setOrder(e.target.value as SprintOrder)} className="block min-h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3"><option value="ordered">По порядку — с первого</option><option value="random">Случайно из выбранного варианта</option></select></label>
        <p className="text-sm">{order === "ordered" ? "Первые выбранные N вопросов по порядку исходных номеров." : "Случайные N вопросов из всей выбранной подборки, без повторов."}</p>
        <label className="block space-y-2 font-semibold">Количество вопросов<input aria-label="Количество вопросов" type="number" inputMode="numeric" min={1} max={maximum} value={count} onChange={e => setCount(e.target.value)} className="block min-h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-lg" /></label>
        <div className="flex flex-wrap gap-2">{[...new Set([10,20,30,50,maximum].filter(n => n <= maximum))].map(n => <button key={n} className={button} onClick={() => setCount(String(n))} aria-pressed={Number(count) === n}>{n === maximum ? `Все ${n}` : n}</button>)}</div>
        {!validCount && <p role="alert">Выбери целое число от 1 до {maximum}.</p>}
        <button className={`${button} w-full bg-violet-600 text-white`} disabled={!validCount} onClick={() => { commit({ ...current.current, sprint: createSprint(group, Number(count), order) }); setConfigure(false); scroller.current?.scrollTo({ top: 0 }); }}>Начать спринт</button>
        <p className="text-xs text-[var(--color-muted)]">Прогресс спринтов сохраняется отдельно от версии «Обучение», в этом браузере. Можно переключить версию и продолжить позже.</p>
      </div>}
      {s && !s.finished && !configure && q && <article className="space-y-4" data-testid="pm-sprint-question" data-question-id={q.id}>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span>{sprintGroups.find(g => g.id === s.group)?.label ?? "Сохранённый спринт"} · {s.order === "ordered" ? "По порядку" : "Случайно"}</span><button className={button} onClick={() => { setConfigure(true); scroller.current?.scrollTo({ top: 0 }); }}>Выбрать другой спринт</button></div>
        <p className="text-sm text-[var(--color-muted)]">{q.variant === "supplement" ? "Учебное дополнение" : variants.find(v => v.id === q.variant)?.label} · №{q.number} · Лекция {q.lecture}</p>
        <h2 className="whitespace-pre-line text-lg font-bold leading-relaxed sm:text-xl">{q.text}</h2>
        {q.transcriptionNote && <p className="text-xs text-[var(--color-muted)]">{q.transcriptionNote}</p>}
        <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Ответы — выбор необратим">{q.options.map((option, i) => <button key={i} disabled={selected !== undefined} aria-pressed={selected === i} className={`min-h-14 rounded-2xl border p-3 text-left leading-relaxed ${selected !== undefined && i === q.answer ? "border-emerald-500 bg-emerald-500/15" : selected === i ? "border-red-500 bg-red-500/15" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`} onClick={() => commit(lockSprintAnswer(current.current, q.id, i))}><strong>{letters[i]}.</strong> {option}</button>)}</div>
        <p className="text-sm" role="status">{selected !== undefined ? `${selected === q.answer ? "Верно!" : "Неверно."} Правильный ответ: ${letters[q.answer!]}. ${q.options[q.answer!]}. Ответ зафиксирован.` : "Нажатие на вариант сразу фиксирует ответ."}</p>
        {selected !== undefined && <section id="pm-sprint-explanation" data-testid="pm-sprint-explanation" className="rounded-2xl border border-violet-400/40 bg-violet-500/10 p-4"><h3 className="mb-2 font-bold">Почему этот ответ</h3><p className="whitespace-pre-line leading-relaxed">{q.explanation}</p><NoteLink question={q} /></section>}
      </article>}
      {s?.finished && !configure && <section className="space-y-4" data-testid="pm-sprint-result">
        <h2 className="text-2xl font-bold">Спринт завершён</h2><p className="text-3xl font-black">{score} / {s.ids.length} · {Math.round(score / s.ids.length * 100)}%</p>
        <p>Ошибок: {s.ids.length - score}. Пройдено уникальных: {covered} / {availableQuestions.length}. Верно в последней попытке: {correctCoverage}.</p>
        <button className={`${button} bg-violet-600 text-white`} onClick={() => { commit({ ...current.current, sprint: null }); scroller.current?.scrollTo({ top: 0 }); }}>Настроить следующий спринт</button>
        <h3 className="text-lg font-bold">Ответы и разборы</h3>
        {s.ids.map((id, i) => { const item = byId.get(id)!; const chosen = s.answers[id]; const correct = chosen === item.answer; return <details key={id} className="rounded-2xl border border-[var(--color-border)] p-4"><summary className="min-h-11 cursor-pointer font-semibold">{i + 1}. {correct ? "Верно" : "Ошибка"} · {item.variant === "supplement" ? "Учебное дополнение" : variants.find(v => v.id === item.variant)?.label} · №{item.number}</summary><p className="my-3 whitespace-pre-line font-semibold">{item.text}</p><p>Твой ответ: {letters[chosen]}. {item.options[chosen]}</p><p className="my-2">Правильный: {letters[item.answer!]}. {item.options[item.answer!]}</p><p>{item.explanation}</p><NoteLink question={item} />{item.variant === "supplement" && <p className="mt-2 text-xs text-[var(--color-muted)]">{item.transcriptionNote}</p>}</details>; })}
      </section>}
    </div></div>
    {s && !s.finished && !configure && <footer className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">{selected !== undefined && q && <p className="mx-auto mb-2 max-w-4xl text-sm font-bold" data-testid="pm-sprint-feedback" role="status">{selected === q.answer ? "✓ Верно" : "✕ Неверно"} · Правильный ответ: {letters[q.answer!]} <button className="ml-3 min-h-11 rounded-lg border border-[var(--color-border)] px-3" onClick={() => document.getElementById("pm-sprint-explanation")?.scrollIntoView({ block: "start", behavior: "smooth" })}>Разбор ↓</button></p>}<div className="mx-auto flex max-w-4xl gap-3"><button className={button} disabled={s.index === 0} onClick={() => { commit({ ...current.current, sprint: { ...current.current.sprint!, index: s.index - 1 } }); scroller.current?.scrollTo({ top: 0 }); }}>← Назад</button><button className={`${button} flex-1 bg-violet-600 text-white`} disabled={selected === undefined} onClick={advance}>{s.index === s.ids.length - 1 ? "Завершить спринт" : "Следующий →"}</button></div></footer>}
  </section>, document.body);
}
