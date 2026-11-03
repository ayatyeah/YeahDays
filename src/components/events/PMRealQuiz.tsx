"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import EventNotes from "@/components/EventNotes";
import bank from "@/lib/events/pmRealQuiz/questions.json";
import alternativeBank from "@/lib/events/pmRealQuiz/alternatives.json";
import notes from "@/lib/events/pmRealQuiz/notes.json";
import sources from "@/lib/events/pmRealQuiz/sources.json";
import { answerStats, availableQuestions, parseAnswers, realProgress, realQuizKey, REAL_PM_ID, REAL_PM_TITLE, variants, type Answers } from "@/lib/events/pmRealQuiz/model";
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
    setVariant(v); setLecture("all"); setFilter("all"); setSearch(""); setActive(`pm-real-${v}-${n}`); setTab("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function move(index: number) {
    setActive(filtered[index].id);
    questionTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const missing = bank.filter(item => !item.available && item.variant === variant).map(item => item.number);
  return <div className="mx-auto w-full max-w-4xl space-y-5 pb-24" data-no-i18n data-testid="pm-real-quiz">
    <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm underline" aria-label="Навигация по ПМ"><Link href="/learn">← Учёба</Link><Link href="/events/project-management-test-2">Все лекции по ПМ</Link><Link href="/events">Ивенты</Link></nav>
    <header className="space-y-3 rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-sky-500/10 p-5 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)]">Project Management · Лекции 4–8</p>
      <h1 className="break-words text-3xl font-black leading-tight sm:text-4xl">{REAL_PM_TITLE}</h1>
      <p className="text-sm leading-relaxed">Подготовка к квизу 4 ноября 2026. По твоей информации — 50% эндтерма. Здесь собраны присланные вопросы, исходные ответы A–E и объяснения, чтобы узнавать принцип даже в новом сценарии.</p>
      <div className="flex flex-wrap gap-2 text-sm font-semibold"><span className="rounded-xl bg-[var(--color-surface)] px-3 py-2">151 вопрос</span><span className="rounded-xl bg-[var(--color-surface)] px-3 py-2">604 переформулировки</span><span className="rounded-xl bg-[var(--color-surface)] px-3 py-2">4 группы материалов</span><span className="rounded-xl bg-[var(--color-surface)] px-3 py-2">2 конспекта</span></div>
      <p className="text-xs leading-relaxed text-[var(--color-muted)]">Вопросы из присланных фото и Word. Ответы и разборы составлены по лекциям, это не официальный ключ. Наличие этих же вопросов в твоём квизе не подтверждено. Исходные номера и порядок A–E сохранены.</p>
    </header>
    <div className="grid grid-cols-3 gap-2 text-center" aria-live="polite">
      {[["Проверено", stats.answered], ["Верно", stats.correct], ["Ошибки", stats.answered - stats.correct]].map(([title, value]) => <div className="rounded-2xl bg-[var(--color-surface-2)] p-3" key={title}><b className="block text-xl tabular-nums">{ready ? value : "—"}</b><span className="text-xs">{title}</span></div>)}
    </div>
    <p className="text-xs text-[var(--color-muted)]">Проверенные ответы сохраняются в этом браузере для твоего аккаунта. Между устройствами они не переносятся. Счёт показывает текущие ответы, а не прогноз оценки.</p>
    {saveError && <p className="rounded-2xl border border-amber-400 p-3" role="alert">Сохранение недоступно. Ответы остаются в этой вкладке до её закрытия.</p>}
    <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Разделы ивента">{tabs.map(([id, title]) => <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined} className={`min-h-12 rounded-2xl border px-3 py-3 text-sm font-bold ${tab === id ? "border-violet-400 bg-violet-500/15" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}>{title}</button>)}</nav>

    {tab === "questions" && <>
      <section className={`${panel} space-y-4`}>
        <h2 className="text-xl font-bold">Выбери вариант и решай</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm"><span>Вариант теста</span><select aria-label="Вариант теста" className={field} value={variant} onChange={e => setVariant(e.target.value)}><option value="all">Все 151 вопрос</option>{variants.map(v => <option key={v.id} value={v.id}>{v.label} · {availableQuestions.filter(item => item.variant === v.id).length}</option>)}</select></label>
          <label className="space-y-1 text-sm"><span>Тема</span><select aria-label="Тема" className={field} value={lecture} onChange={e => setLecture(e.target.value)}><option value="all">Все лекции</option>{[[4,"Затраты и группы"],[5,"Оргструктуры"],[6,"Agile и Lean"],[7,"Scrum"],[8,"Personas и stories"]].map(([n,t]) => <option key={n} value={n}>Лекция {n} · {t}</option>)}</select></label>
          <label className="space-y-1 text-sm"><span>Показать</span><select aria-label="Показать" className={field} value={filter} onChange={e => setFilter(e.target.value)}><option value="all">Все вопросы</option><option value="errors">Только ошибки</option><option value="unanswered">Без ответа</option></select></label>
          <label className="space-y-1 text-sm"><span>Поиск по вопросу или разбору</span><input className={field} type="search" placeholder="CPI, persona, доверие…" value={search} onChange={e => setSearch(e.target.value)} /></label>
        </div>
        {variant !== "all" && <p className="text-sm text-[var(--color-muted)]">{variants.find(v => v.id === variant)?.note}</p>}
        {!!missing.length && <p className="text-sm">Отсутствуют №{missing.join(", ")}. Их не включаем в тренировку и не заменяем придуманными вопросами.</p>}
        <p className="text-sm font-semibold" role="status">По фильтрам: {filtered.length} вопросов</p>
        <details><summary className="min-h-11 cursor-pointer py-2 font-semibold">Перейти к номеру вопроса</summary><div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">{filtered.map(item => <button key={item.id} onClick={() => { setActive(item.id); questionTop.current?.scrollIntoView({ behavior: "smooth" }); }} aria-label={`${label(item.variant)}, вопрос ${item.number}`} aria-current={q?.id === item.id ? "step" : undefined} className={`min-h-12 rounded-xl border p-2 text-sm ${q?.id === item.id ? "border-violet-400 bg-violet-500/15" : "border-[var(--color-border)]"}`}>
          {variant === "all" ? `${item.variant === "unknown" ? "?" : item.variant}.${item.number}` : item.number}{answers[item.id] === undefined ? "" : answers[item.id] === item.answer ? " ✓" : " ×"}
        </button>)}</div></details>
      </section>
      {!ready ? <p role="status">Загружаем сохранённые ответы…</p> : !q ? <section className={panel}><h2 className="font-bold">По этим фильтрам вопросов нет</h2><p className="mt-2 text-sm">Попробуй другой вариант или тему. В фильтре ошибок появляются только проверенные неверные ответы.</p><Button className="mt-4" onClick={() => { setVariant("all"); setLecture("all"); setFilter("all"); setSearch(""); }}>Показать все вопросы</Button></section> : <section className={`${panel} scroll-mt-4 space-y-5`} ref={questionTop} data-testid="pm-real-question">
        <div className="flex flex-wrap justify-between gap-2 text-sm"><p className="font-bold">{label(q.variant)} · №{q.number}</p><span>Лекция {q.lecture} · {position + 1} / {filtered.length}</span></div>
        {"transcriptionNote" in q && q.transcriptionNote && <p className="rounded-xl bg-amber-500/10 p-3 text-sm">{q.transcriptionNote}</p>}
        <fieldset className="space-y-3" lang="en"><legend className="mb-4 whitespace-pre-line text-base font-medium leading-relaxed sm:text-lg">{q.text}</legend>
          {q.options.map((option, i) => <label key={`${q.id}-${i}`} className={`flex min-h-12 items-start gap-3 rounded-2xl border p-3 ${showAnswer && q.answer === i ? "border-emerald-500 bg-emerald-500/10" : checked && selected === i ? "border-rose-400 bg-rose-500/10" : "border-[var(--color-border)] has-[:checked]:bg-violet-500/10"}`}>
            <input className="mt-1 shrink-0" type="radio" name={q.id} value={i} checked={selected === i} disabled={checked} onChange={() => setDraft({ ...draft, [q.id]: i })} />
            <span><b>{letters[i]}.</b> {option}{showAnswer && q.answer === i ? " ✓" : ""}</span>
          </label>)}
        </fieldset>
        <div className="flex flex-wrap gap-2">
          {!checked && <Button disabled={selected === undefined} onClick={() => { if (selected !== undefined) persist({ ...answers, [q.id]: selected }); }}>Проверить ответ</Button>}
          {!showAnswer && <Button variant="ghost" onClick={() => setRevealed({ ...revealed, [q.id]: true })}>Показать разбор без ответа</Button>}
          {showAnswer && <Button variant="ghost" onClick={() => {
            const next = { ...answers }; delete next[q.id]; persist(next);
            const nextDraft = { ...draft }; delete nextDraft[q.id]; setDraft(nextDraft);
            setRevealed({ ...revealed, [q.id]: false });
          }}>Решить ещё раз</Button>}
        </div>
        {showAnswer && <div className="space-y-3 rounded-2xl bg-[var(--color-surface-2)] p-4" role="status" data-testid="pm-real-explanation">
          <h3 className="font-bold">{checked ? selected === q.answer ? "Верно!" : "Есть ошибка." : "Разбор без зачёта ответа."} Ответ: {letters[q.answer!]}</h3>
          <p className="text-sm leading-relaxed">{q.explanation}</p>
          <p className="text-xs text-[var(--color-muted)]">Учебный ключ по Lecture {q.lecture}; не официальный ответ преподавателя.</p>
          <div className="flex flex-wrap gap-2">{notes.filter(n => n.examples.includes(`${q.variant}:${q.number}`)).map(n => <button key={n.id} className="min-h-11 text-left text-sm underline" onClick={() => { setTab("full"); requestAnimationFrame(() => document.getElementById(`note-${n.id}`)?.scrollIntoView({ behavior: "smooth" })); }}>Разобраться: {n.title} →</button>)}</div>
        </div>}
        {showAnswer && <section key={`alternatives-${q.id}`} className="space-y-3" data-testid="pm-real-alternatives">
          <h3 className="text-lg font-bold">А если правильный ответ — другой?</h3>
          <p className="text-sm leading-relaxed text-[var(--color-muted)]">Четыре учебные переформулировки, не вопросы с реального теста. Варианты A–E остаются теми же: меняется условие. Раскрой букву, чтобы увидеть, когда подходит этот ответ.</p>
          {alternatives[q.id].map(alt => <details key={alt.answer} className="rounded-2xl border border-[var(--color-border)] p-3 sm:p-4" data-testid="pm-real-alternative">
            <summary className="min-h-11 cursor-pointer break-words py-2 text-sm font-semibold"><span className="text-violet-500">Если ответ {letters[alt.answer]}</span> · <span lang="en">{q.options[alt.answer]}</span></summary>
            <div className="space-y-3 border-t border-[var(--color-border)] pt-3">
              <p className="text-xs font-bold text-[var(--color-muted)]">{alt.mode === "misconception" ? "Найди ошибочное утверждение" : "Новое условие"}</p>
              <p lang="en" className="whitespace-pre-line text-base leading-relaxed">{alt.question}</p>
              <p className="text-sm leading-relaxed"><b>Почему {letters[alt.answer]}:</b> {alt.explanation}</p>
              {alt.mode === "misconception" && <p className="text-xs leading-relaxed text-[var(--color-muted)]">Здесь нужно выбрать указанную ошибку. Само утверждение в ответе не становится верным правилом.</p>}
            </div>
          </details>)}
        </section>}
        <div className="flex flex-wrap justify-between gap-2"><Button variant="ghost" disabled={position <= 0} onClick={() => move(position - 1)}>← Предыдущий</Button><Button disabled={position >= filtered.length - 1} onClick={() => move(position + 1)}>Следующий →</Button></div>
      </section>}
      <section className={`${panel} space-y-3`}><h2 className="font-bold">Что повторить по лекциям</h2>{[4,5,6,7,8].map(n => {
        const st = answerStats(answers, availableQuestions.filter(item => item.lecture === n));
        return <p key={n} className="text-sm">Лекция {n}: верно {st.correct} / {st.total} · ошибок {st.answered - st.correct} · без ответа {st.total - st.answered}</p>;
      })}<Button variant="ghost" onClick={() => { setVariant("all"); setLecture("all"); setSearch(""); setFilter("errors"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Повторить все ошибки</Button>
      {confirmReset ? <div className="space-y-3"><p>Удалить все проверенные ответы этого ивента на этом устройстве?</p><div className="flex flex-wrap gap-2"><Button onClick={() => { persist({}); setDraft({}); setRevealed({}); setConfirmReset(false); }}>Да, сбросить ответы</Button><Button variant="ghost" onClick={() => setConfirmReset(false)}>Отмена</Button></div></div> : <Button variant="ghost" onClick={() => setConfirmReset(true)}>Сбросить тренировку</Button>}
      </section>
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
  </div>;
}
function SourcePhoto({ index }: { index: number }) {
  const source = sources[index];
  return <figure className="min-w-0 space-y-2"><a href={source.src} target="_blank" rel="noreferrer" aria-label={`Открыть фото ${index + 1} в полном размере`}><Image src={source.src} alt={`Фото ${index + 1} с исходными вопросами ПМ`} width={source.width} height={source.height} unoptimized className="h-auto w-full rounded-xl" /></a><figcaption className="break-words text-xs text-[var(--color-muted)]">Фото {index + 1} · {source.name} · Нажми, чтобы увеличить</figcaption></figure>;
}
