"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import EventNotes from "@/components/EventNotes";
import bank from "@/lib/events/pmRealQuiz/questions.json";
import alternativeBank from "@/lib/events/pmRealQuiz/alternatives.json";
import notes from "@/lib/events/pmRealQuiz/notes.json";
import sources from "@/lib/events/pmRealQuiz/sources.json";
import { answerStats, availableQuestions, parseAnswers, realProgress, realQuizKey, REAL_PM_ID, variants, type Answers } from "@/lib/events/pmRealQuiz/model";
import { saveProgress } from "@/lib/events/storage";

const panel = "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6";
const field = "min-h-12 w-full min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-base";
const letters = "ABCDE";
const alternatives: Record<string, { answer: number; mode: string; question: string; explanation: string }[]> = alternativeBank;
type Tab = "questions" | "brief" | "full" | "sources";
const tabs: [Tab, string][] = [["questions", "Вопросы"], ["brief", "Краткий конспект"], ["full", "Развёрнутый конспект"], ["sources", "Источники"]];
const label = (v: string) => variants.find(x => x.id === v)?.label ?? v;

export default function PMRealQuiz({ userId }: { userId: string }) {
  const [tab, setTab] = useState<Tab>("questions");
  const [variant, setVariant] = useState("1");
  const [lecture, setLecture] = useState("all");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState("pm-real-1-1");
  const [answers, setAnswers] = useState<Answers>({});
  const [draft, setDraft] = useState<Answers>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const scrollArea = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (tab !== "questions") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [tab]);
  const questionTop = useRef<HTMLElement>(null);
  const storageKey = realQuizKey(userId);
  useEffect(() => {
    try { setAnswers(parseAnswers(localStorage.getItem(storageKey))); }
    catch { setSaveError(true); }
    setReady(true);
  }, [storageKey]);
  function persist(next: Answers) {
    setAnswers(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setSaveError(false); }
    catch { setSaveError(true); }
    saveProgress(userId, REAL_PM_ID, realProgress(next));
  }
  const stats = answerStats(answers);
  const filtered = availableQuestions.filter(q =>
    (variant === "all" || q.variant === variant) &&
    (lecture === "all" || q.lecture === Number(lecture)) &&
    (filter !== "errors" || (answers[q.id] !== undefined && answers[q.id] !== q.answer)) &&
    (filter !== "unanswered" || answers[q.id] === undefined) &&
    (!search.trim() || `${q.number} ${q.text} ${q.options.join(" ")} ${q.explanation}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
  );
  const q = filtered.find(item => item.id === active) ?? filtered[0];
  const position = q ? filtered.findIndex(item => item.id === q.id) : -1;
  const checked = q && answers[q.id] !== undefined;
  const showAnswer = q && (checked || revealed[q.id]);
  const selected = q ? (checked ? answers[q.id] : draft[q.id]) : undefined;
  function openQuestion(ref: string) {
    const [v, n] = ref.split(":");
    setVariant(v); setLecture("all"); setFilter("all"); setSearch(""); setActive(`pm-real-${v}-${n}`); setFiltersOpen(false); setTab("questions");
    requestAnimationFrame(() => scrollArea.current?.scrollTo({ top: 0 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function move(index: number) {
    setActive(filtered[index].id);
    scrollArea.current?.scrollTo({ top: 0 });
  }
  const missing = bank.filter(item => !item.available && item.variant === variant).map(item => item.number);
  const content = <div className={tab === "questions" ? "fixed inset-x-0 bottom-0 top-[var(--history-nav-height)] z-[60] flex h-[calc(100dvh-var(--history-nav-height))] flex-col overflow-hidden bg-[var(--color-bg)]" : "mx-auto w-full max-w-5xl space-y-4 pb-24"} data-no-i18n data-testid="pm-real-quiz">
    <header className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <Link href="/learn" className="flex min-h-11 items-center text-sm font-semibold">← Учёба</Link>
        <h1 className="text-sm font-bold sm:text-lg">ПМ · Квиз 2</h1>
        <span className="text-xs tabular-nums text-[var(--color-muted)]" aria-live="polite">{ready ? stats.correct : "—"} / 151 верно</span>
      </div>
      <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto" aria-label="Разделы ивента">{tabs.map(([id, title]) => <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined} className={`min-h-11 shrink-0 rounded-xl px-3 text-xs font-bold sm:text-sm ${tab === id ? "bg-violet-500/15 text-violet-500" : "text-[var(--color-muted)]"}`}>{title}</button>)}</nav>
    </header>
    <div ref={scrollArea} className={tab === "questions" ? "min-h-0 flex-1 overflow-y-auto overscroll-contain" : "space-y-4"} data-testid="pm-quiz-scroll">
    <div className="mx-auto w-full max-w-6xl space-y-3 p-3 sm:p-5">
    {saveError && <p className="rounded-2xl border border-amber-400 p-3" role="alert">Сохранение недоступно. Ответы остаются в этой вкладке до её закрытия.</p>}
    {tab === "questions" && <>
      <details open={filtersOpen} onToggle={e => setFiltersOpen(e.currentTarget.open)} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4" data-testid="pm-quiz-filters">
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">Вариант и фильтры <span className="font-normal text-[var(--color-muted)]">· {label(variant)} · {filtered.length}</span></summary>
        <div className="space-y-3 pb-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm"><span>Вариант теста</span><select aria-label="Вариант теста" className={field} value={variant} onChange={e => setVariant(e.target.value)}><option value="all">Все 151 вопрос</option>{variants.map(v => <option key={v.id} value={v.id}>{v.label} · {availableQuestions.filter(item => item.variant === v.id).length}</option>)}</select></label>
          <label className="space-y-1 text-sm"><span>Тема</span><select aria-label="Тема" className={field} value={lecture} onChange={e => setLecture(e.target.value)}><option value="all">Все лекции</option>{[[4,"Затраты и группы"],[5,"Оргструктуры"],[6,"Agile и Lean"],[7,"Scrum"],[8,"Personas и stories"]].map(([n,t]) => <option key={n} value={n}>Лекция {n} · {t}</option>)}</select></label>
          <label className="space-y-1 text-sm"><span>Показать</span><select aria-label="Показать" className={field} value={filter} onChange={e => setFilter(e.target.value)}><option value="all">Все вопросы</option><option value="errors">Только ошибки</option><option value="unanswered">Без ответа</option></select></label>
          <label className="space-y-1 text-sm"><span>Поиск по вопросу или разбору</span><input className={field} type="search" placeholder="CPI, persona, доверие…" value={search} onChange={e => setSearch(e.target.value)} /></label>
        </div>
        {variant !== "all" && <p className="text-sm text-[var(--color-muted)]">{variants.find(v => v.id === variant)?.note}</p>}
        {!!missing.length && <p className="text-sm">Отсутствуют №{missing.join(", ")}. Их не включаем в тренировку и не заменяем придуманными вопросами.</p>}
        <p className="text-sm font-semibold" role="status">По фильтрам: {filtered.length} вопросов</p>
        <details><summary className="min-h-11 cursor-pointer py-2 font-semibold">Перейти к номеру вопроса</summary><div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">{filtered.map(item => <button key={item.id} onClick={() => { setActive(item.id); setFiltersOpen(false); scrollArea.current?.scrollTo({ top: 0 }); }} aria-label={`${label(item.variant)}, вопрос ${item.number}`} aria-current={q?.id === item.id ? "step" : undefined} className={`min-h-12 rounded-xl border p-2 text-sm ${q?.id === item.id ? "border-violet-400 bg-violet-500/15" : "border-[var(--color-border)]"}`}>
          {variant === "all" ? `${item.variant === "unknown" ? "?" : item.variant}.${item.number}` : item.number}{answers[item.id] === undefined ? "" : answers[item.id] === item.answer ? " ✓" : " ×"}
        </button>)}</div></details>
        <Button onClick={() => { setFiltersOpen(false); scrollArea.current?.scrollTo({ top: 0 }); }}>К вопросам</Button>
        </div>
      </details>
      {!ready ? <p role="status">Загружаем сохранённые ответы…</p> : !q ? <section className={panel}><h2 className="font-bold">По этим фильтрам вопросов нет</h2><p className="mt-2 text-sm">Попробуй другой вариант или тему. В фильтре ошибок появляются только проверенные неверные ответы.</p><Button className="mt-4" onClick={() => { setVariant("all"); setLecture("all"); setFilter("all"); setSearch(""); }}>Показать все вопросы</Button></section> : <section className={`${panel} scroll-mt-4 space-y-4`} ref={questionTop} data-testid="pm-real-question">
        <div className="flex flex-wrap justify-between gap-2 text-sm"><p className="font-bold">{label(q.variant)} · №{q.number}</p><span>Лекция {q.lecture} · {position + 1} / {filtered.length}</span></div>
        {"transcriptionNote" in q && q.transcriptionNote && <p className="rounded-xl bg-amber-500/10 p-3 text-sm">{q.transcriptionNote}</p>}
        <fieldset className="min-w-0" lang="en"><legend className="sr-only">Question {q.number}</legend>
          <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-8">
          <p className="whitespace-pre-line text-base font-medium leading-relaxed lg:sticky lg:top-4 lg:text-lg" id="pm-question-text">{q.text}</p>
          <div className="space-y-2" role="radiogroup" aria-labelledby="pm-question-text">
          {q.options.map((option, i) => <label key={`${q.id}-${i}`} className={`flex min-h-12 items-start gap-3 rounded-2xl border p-3 ${showAnswer && q.answer === i ? "border-emerald-500 bg-emerald-500/10" : checked && selected === i ? "border-rose-400 bg-rose-500/10" : "border-[var(--color-border)] has-[:checked]:bg-violet-500/10"}`}>
            <input className="mt-1 shrink-0" type="radio" name={q.id} value={i} checked={selected === i} disabled={checked} onChange={() => setDraft({ ...draft, [q.id]: i })} />
            <span><b>{letters[i]}.</b> {option}{showAnswer && q.answer === i ? " ✓" : ""}</span>
          </label>)}
          </div></div>
        </fieldset>
        <div className="flex flex-wrap gap-2">
          {!showAnswer && <Button variant="ghost" onClick={() => setRevealed({ ...revealed, [q.id]: true })}>Показать разбор без ответа</Button>}
          {showAnswer && <Button variant="ghost" onClick={() => {
            const next = { ...answers }; delete next[q.id]; persist(next);
            const nextDraft = { ...draft }; delete nextDraft[q.id]; setDraft(nextDraft);
            setRevealed({ ...revealed, [q.id]: false });
          }}>Решить ещё раз</Button>}
        </div>
        {showAnswer && <details key={`explanation-${q.id}`} className="space-y-3 rounded-2xl bg-[var(--color-surface-2)] p-4" data-testid="pm-real-explanation">
          <summary className="min-h-11 cursor-pointer font-bold"><span role="status">{checked ? selected === q.answer ? "Верно!" : "Есть ошибка." : "Разбор без зачёта ответа."} Ответ: {letters[q.answer!]}</span><span className="ml-2 text-sm font-normal underline">Почему?</span></summary>
          <p className="text-sm leading-relaxed">{q.explanation}</p>
          <p className="text-xs text-[var(--color-muted)]">Учебный ключ по Lecture {q.lecture}; не официальный ответ преподавателя.</p>
          <div className="flex flex-wrap gap-2">{notes.filter(n => n.examples.includes(`${q.variant}:${q.number}`)).map(n => <button key={n.id} className="min-h-11 text-left text-sm underline" onClick={() => { setTab("full"); requestAnimationFrame(() => document.getElementById(`note-${n.id}`)?.scrollIntoView({ behavior: "smooth" })); }}>Разобраться: {n.title} →</button>)}</div>
        </details>}
        {showAnswer && <details key={`alternatives-${q.id}`} className="space-y-3" data-testid="pm-real-alternatives">
          <summary className="min-h-11 cursor-pointer py-2 font-bold">А если правильный ответ — другой? <span className="text-sm font-normal text-[var(--color-muted)]">4 условия</span></summary>
          <p className="text-sm leading-relaxed text-[var(--color-muted)]">Четыре учебные переформулировки, не вопросы с реального теста. Варианты A–E остаются теми же: меняется условие. Раскрой букву, чтобы увидеть, когда подходит этот ответ.</p>
          {alternatives[q.id].map(alt => <details key={alt.answer} name={`alternatives-${q.id}`} className="rounded-2xl border border-[var(--color-border)] p-3 sm:p-4" data-testid="pm-real-alternative">
            <summary className="min-h-11 cursor-pointer break-words py-2 text-sm font-semibold"><span className="text-violet-500">Если ответ {letters[alt.answer]}</span> · <span lang="en">{q.options[alt.answer]}</span></summary>
            <div className="space-y-3 border-t border-[var(--color-border)] pt-3">
              <p className="text-xs font-bold text-[var(--color-muted)]">{alt.mode === "misconception" ? "Найди ошибочное утверждение" : "Новое условие"}</p>
              <p lang="en" className="whitespace-pre-line text-base leading-relaxed">{alt.question}</p>
              <p className="text-sm leading-relaxed"><b>Почему {letters[alt.answer]}:</b> {alt.explanation}</p>
              {alt.mode === "misconception" && <p className="text-xs leading-relaxed text-[var(--color-muted)]">Здесь нужно выбрать указанную ошибку. Само утверждение в ответе не становится верным правилом.</p>}
            </div>
          </details>)}
        </details>}
      </section>}
      <details className={`${panel} space-y-3`}><summary className="min-h-11 cursor-pointer font-bold">Прогресс и настройки тренировки</summary><h2 className="font-bold">Что повторить по лекциям</h2>{[4,5,6,7,8].map(n => {
        const st = answerStats(answers, availableQuestions.filter(item => item.lecture === n));
        return <p key={n} className="text-sm">Лекция {n}: верно {st.correct} / {st.total} · ошибок {st.answered - st.correct} · без ответа {st.total - st.answered}</p>;
      })}<Button variant="ghost" onClick={() => { setVariant("all"); setLecture("all"); setSearch(""); setFilter("errors"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Повторить все ошибки</Button>
      {confirmReset ? <div className="space-y-3"><p>Удалить все проверенные ответы этого ивента на этом устройстве?</p><div className="flex flex-wrap gap-2"><Button onClick={() => { persist({}); setDraft({}); setRevealed({}); setConfirmReset(false); }}>Да, сбросить ответы</Button><Button variant="ghost" onClick={() => setConfirmReset(false)}>Отмена</Button></div></div> : <Button variant="ghost" onClick={() => setConfirmReset(true)}>Сбросить тренировку</Button>}
      <p className="text-xs text-[var(--color-muted)]">Ответы сохраняются в этом браузере. 151 исходный вопрос, 604 учебные переформулировки; ключ по лекциям, не официальный. Порядок A–E сохранён.</p>
      <Link className="inline-block py-2 text-sm underline" href="/events/project-management-test-2">Все лекции по ПМ →</Link>
      </details>
    </>}

    {(tab === "brief" || tab === "full") && <>
      <section className={`${panel} space-y-3`}><h2 className="text-2xl font-bold">{tab === "brief" ? "Краткий конспект" : "Развёрнутый конспект"}</h2>
        <p className="text-sm leading-relaxed">{tab === "brief" ? "Быстрое повторение перед квизом: ключевые признаки, формулы и различия. После каждого блока — примеры из банка." : "Разбор всей тематической базы лекций 4–8: как устроены понятия, как применять их в сценариях и почему похожие ответы не подходят."}</p>
        <p className="text-sm">Сначала пойми правило, затем ответь на примеры без подсказки. После полного варианта повтори ошибки. На самом квизе ориентируйся на смысл ответа: буквы и сценарии могут измениться.</p>
        <nav className="grid gap-2 sm:grid-cols-2" aria-label="Оглавление конспекта">{notes.map(n => <a key={n.id} className="min-h-11 rounded-xl bg-[var(--color-surface-2)] px-3 py-2 text-sm" href={`#note-${n.id}`}>L{n.lecture} · {n.title}</a>)}</nav>
      </section>
      {notes.map(n => <section key={n.id} id={`note-${n.id}`} className={`${panel} scroll-mt-4 space-y-4`}>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)]">Лекция {n.lecture}</p><h2 className="text-xl font-bold">{n.title}</h2>
        <EventNotes text={tab === "brief" ? n.brief : n.full} lang="ru" />
        <div><h3 className="mb-2 text-sm font-bold">Проверь на вопросах из материалов</h3><div className="flex flex-wrap gap-2">{n.examples.map(ref => { const [v, num] = ref.split(":"); return <button key={ref} onClick={() => openQuestion(ref)} className="min-h-11 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm">{v === "unknown" ? "Без номера" : v === "5" ? "Предп. 5" : `В${v}`} · №{num} →</button>; })}</div></div>
        <a className="inline-block min-h-11 py-2 text-xs underline" href={`/study/pm-quiz2/lecture-${n.lecture}.pdf`} target="_blank" rel="noreferrer">Оригинальная лекция {n.lecture} (PDF) ↗</a>
      </section>)}
    </>}

    {tab === "sources" && <section className={`${panel} space-y-5`}>
      <h2 className="text-2xl font-bold">Источники и полнота материалов</h2>
      <p className="text-sm leading-relaxed">Проверены 41 фотография и Word из папки «ПМ ВОПРОСЫ С РЕАЛЬНОГО ТЕСТА». Повторные снимки связаны с одним вопросом. В Word не хватало 15 вопросов варианта 1 и полного №50 предполагаемого варианта 5 — они восстановлены по фото. Ещё 18 вопросов перенесены со страниц без номера.</p>
      <div className="space-y-3">{variants.map(v => <div key={v.id} className="rounded-2xl bg-[var(--color-surface-2)] p-4"><h3 className="font-bold">{v.label} · {availableQuestions.filter(item => item.variant === v.id).length} вопросов</h3><p className="mt-1 text-sm">{v.note}</p></div>)}</div>
      <p className="text-sm">Фотографии подтверждают текст, но не официальный ключ. Разборы основаны на пяти лекциях курса. В папках есть смешанные страницы; поэтому 18 вопросов без обложки не добавлены автоматически в вариант 4. Размытые строки помечены у соответствующих вопросов.</p>
      <a href="/study/pm-quiz2/source-transcription.docx" className="inline-block min-h-11 underline">Скачать исходный Word (с исходными пропусками)</a>
      <div className="flex flex-wrap gap-3">{[4,5,6,7,8].map(n => <a key={n} href={`/study/pm-quiz2/lecture-${n}.pdf`} target="_blank" rel="noreferrer" className="min-h-11 rounded-xl border border-[var(--color-border)] px-3 py-2">Lecture {n} · PDF ↗</a>)}</div>
      <p className="text-sm">Дополнительная сверка: <a className="underline" href="https://scrumguides.org/scrum-guide.html" target="_blank" rel="noreferrer">Scrum Guide 2020</a> · <a className="underline" href="https://agilemanifesto.org/principles.html" target="_blank" rel="noreferrer">Agile Manifesto</a>.</p>
      <h3 className="text-lg font-bold">Все 41 фото</h3>
      {sources.map((source, i) => <details key={source.id} className="rounded-2xl border border-[var(--color-border)] p-3"><summary className="min-h-11 cursor-pointer break-words py-2 text-sm">Фото {i + 1} · {source.name}</summary><SourcePhoto index={i} /></details>)}
    </section>}
    </div></div>
    {tab === "questions" && q && ready && <footer className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-5" data-testid="pm-quiz-controls">
      <div className="mx-auto flex max-w-6xl items-center gap-2">
        <Button className="shrink-0 px-3" variant="ghost" aria-label="Предыдущий вопрос" disabled={position <= 0} onClick={() => move(position - 1)}>←</Button>
        <span className="shrink-0 text-xs tabular-nums">{position + 1} / {filtered.length}</span>
        {!checked && !showAnswer ? <Button className="ml-auto flex-1 sm:max-w-xs" variant="primary" disabled={selected === undefined} onClick={() => { if (selected !== undefined) persist({ ...answers, [q.id]: selected }); }}>Проверить ответ</Button> : <Button className="ml-auto flex-1 sm:max-w-xs" variant="primary" disabled={position >= filtered.length - 1} onClick={() => move(position + 1)}>{position >= filtered.length - 1 ? "Конец подборки" : "Следующий →"}</Button>}
        {!showAnswer && <Button className="shrink-0 px-3" variant="ghost" aria-label="Следующий вопрос" disabled={position >= filtered.length - 1} onClick={() => move(position + 1)}>→</Button>}
      </div>
      {showAnswer && <p className="mx-auto mt-1 max-w-6xl text-center text-xs" role="status">{checked ? selected === q.answer ? "Верно" : "Есть ошибка" : "Без зачёта ответа"} · Правильный ответ: {letters[q.answer!]}</p>}
    </footer>}
  </div>;
  return tab === "questions" && ready ? createPortal(content, document.body) : content;
}
function SourcePhoto({ index }: { index: number }) {
  const source = sources[index];
  return <figure className="min-w-0 space-y-2"><a href={source.src} target="_blank" rel="noreferrer" aria-label={`Открыть фото ${index + 1} в полном размере`}><Image src={source.src} alt={`Фото ${index + 1} с исходными вопросами ПМ`} width={source.width} height={source.height} unoptimized className="h-auto w-full rounded-xl" /></a><figcaption className="break-words text-xs text-[var(--color-muted)]">Фото {index + 1} · {source.name} · Нажми, чтобы увеличить</figcaption></figure>;
}
