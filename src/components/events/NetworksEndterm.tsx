"use client";
import { useEffect, useState } from "react";
import EventNotes from "@/components/EventNotes";
import { fullRu as notesRu, fullEn as notesEn } from "@/lib/events/computerNetworksEndterm/full-notes";
import Button from "@/components/ui/Button";
import bank from "@/lib/events/computerNetworksEndterm/bank.json";
import { isCorrect, newAttempt, openQuestions, parseAttempt, scoreAttempt, type Attempt } from "@/lib/events/computerNetworksEndterm/practice";

const root = "/events/computer-networks-endterm";
const panel = "space-y-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6";
const input = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3";
export default function NetworksEndterm({ userId, onExit }: { userId: string; onExit: () => void }) {
  const [notesLang, setNotesLang] = useState<"ru" | "en">("ru");
  const notes = notesLang === "ru" ? notesRu : notesEn;
  const [tab, setTab] = useState("materials");
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState(0);
  const [core, setCore] = useState(false);
  const [page, setPage] = useState(0);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [now, setNow] = useState(0);
  const key = `yg:cn-endterm:v1:${userId}`;
  useEffect(() => {
    try { setAttempt(parseAttempt(localStorage.getItem(key))); } catch { setSaveError(true); }
    setNow(Date.now()); setReady(true);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [key]);
  function save(next: Attempt) {
    setAttempt(next);
    try { localStorage.setItem(key,JSON.stringify(next)); setSaveError(false); } catch { setSaveError(true); }
  }
  const ended = !!attempt && (attempt.finished || now >= attempt.deadline);
  function update(next: Attempt) { if (!attempt || attempt.finished || Date.now() >= attempt.deadline) return; save(next); }
  const filtered = bank.filter(q => (!topic || q.topic === topic) && (!core || q.core) && `${q.id} ${q.prompt} ${q.options.join(" ")} ${q.explanation}`.toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 20));
  const seconds = attempt ? Math.max(0,Math.ceil((attempt.deadline-now)/1000)) : 2700;
  return <div className="space-y-5" data-no-i18n data-testid="cn-endterm">
    <Button variant="ghost" onClick={onExit}>← К лекциям и конспектам</Button>
    <h1 className="text-2xl font-bold">Computer Networks · Эндтерм</h1>
    <nav aria-label="Разделы подготовки" className="flex flex-wrap gap-2">
      {[["materials","Лекции и материалы"],["notes","Подробные конспекты"],["bank","Банк вопросов"],["sample","Образец преподавателя"],["exam","Пробная эндка"]].map(([id,label]) => <Button key={id} variant={tab === id ? "primary" : "ghost"} aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</Button>)}
    </nav>
    {tab === "materials" && <>
      <section className={panel}><h2 className="text-xl font-bold">Лекции 5–10 · оригиналы PDF</h2><p>Конспекты и квизы по каждой теме находятся в основном маршруте ивента. Здесь — исходные слайды со схемами.</p>
        <div className="grid gap-3 sm:grid-cols-2">{["IP, ARP/ND, Router configuration","IPv4, Subnetting, VLSM","IPv6 и ICMP","Transport layer: TCP/UDP","Application layer","Network security"].map((title,i) => <a key={title} className="rounded-xl border border-[var(--color-border)] p-3 underline" href={`${root}/lecture-${i+5}.pdf`} target="_blank" rel="noreferrer">Лекция {i+5} · {title} ↗</a>)}</div>
      </section>
      <section className={panel}><h2 className="text-xl font-bold">Письменный экзамен</h2><p>45 минут · 30 вопросов · 100 баллов.</p><ul className="list-disc space-y-2 pl-5"><li>20 MCQ × 3 балла.</li><li>5 MCQ с двумя/тремя ответами × 4 балла.</li><li>5 открытых вопросов × 4 балла.</li></ul><p>Приоритет: transport layer, application layer и Cisco IOS. Затем адресация, IP/ARP/ICMP и безопасность.</p><a className="underline" href={`${root}/exam-info.txt`} target="_blank" rel="noreferrer">Объявление преподавателя и расписание по группам ↗</a></section>
      <section className={panel}><h2 className="text-xl font-bold">Материалы для скачивания</h2>{[["notes-ru.md","Полный русский конспект"],["notes-en.md","Полный английский конспект"],["core-250.md","250 вопросов модулей 8–16"],["question-bank.md","558 карточек с ответами и пояснениями"]].map(([file,label]) => <a className="block py-2 underline" key={file} href={`${root}/${file}`} download>{label} ↓</a>)}<p className="text-sm text-[var(--color-muted)]">Источник: предоставленные лекции, объявление, образец и сохранённый анализ NetAcad от 7 ноября 2026. Это весь доступный тематический отбор, а не полный скрытый банк Cisco. Совпадение с реальной эндкой не гарантируется.</p></section>
    </>}
    {tab === "notes" && <section className={panel}><h2 className="text-xl font-bold">Подробные конспекты · Модули 8–16</h2><p>Полные конспекты: правила, примеры расчётов, таблицы и команды. Краткая версия доступна на экране чтения каждой части.</p><div role="group" aria-label="Язык подробных конспектов" className="flex gap-2">{(["ru","en"] as const).map(value => <Button key={value} aria-pressed={notesLang === value} variant={notesLang === value ? "primary" : "ghost"} onClick={() => setNotesLang(value)}>{value.toUpperCase()}</Button>)}</div>{Object.entries(notes).map(([module,text]) => <details key={module} className="border-t border-[var(--color-border)] pt-3"><summary className="cursor-pointer py-3 font-bold">Модуль {module} · {text.split("\n")[0].replace(/^## \d+\. /, "")}</summary><EventNotes text={text} lang={notesLang} translation={notesLang === "en" ? notesRu[module as keyof typeof notesRu] : undefined} /></details>)}</section>}
    {tab === "sample" && <section className={panel}><h2 className="text-xl font-bold">Три задания из образца</h2><a className="underline" href={`${root}/sample.pdf`} target="_blank" rel="noreferrer">Открыть исходный PDF ↗</a>
      {[
        ["How many bits must be borrowed from the host portion of an address to accommodate a router with five connected networks?", "A. two · B. three · C. four · D. five", "B. three: 2² = 4 недостаточно, 2³ = 8 достаточно."],
        ["What three blocks of addresses are defined by RFC 1918 for private network use? (Choose three.)", "A. 10.0.0.0/8 · B. 172.16.0.0/12 · C. 192.168.0.0/16 · D. 100.64.0.0/14 · E. 169.254.0.0/16 · F. 239.0.0.0/8", "A, B, C. Это три private-диапазона RFC 1918."],
        [openQuestions[0].prompt, "Открытый вопрос", openQuestions[0].answer],
      ].map(([q,options,answer],i) => <article className="space-y-3 border-t border-[var(--color-border)] pt-4" key={q}><h3 className="font-bold" data-selection-question lang="en">{i+1}. {q}</h3><p>{options}</p><details><summary className="cursor-pointer py-2">Ответ и разбор</summary><p>{answer}</p></details></article>)}
    </section>}
    {tab === "bank" && <>
      <section className={panel}><h2 className="text-xl font-bold">Полный доступный банк · 558 карточек</h2><p className="text-sm">250 карточек — непосредственно из модулей 8–16. Остальные — те же темы из других разделов и смешанных тестов. Карточки со схемами, сопоставлением или уточнениями сохранены для чтения; в автоматическую тренировку они не входят.</p>
        <label className="block">Поиск<input className={input} value={search} onChange={e => {setSearch(e.target.value);setPage(0);}} placeholder="TCP, subnet, SSH, E200…" /></label>
        <label className="block">Модуль<select className={input} value={topic} onChange={e => {setTopic(Number(e.target.value));setPage(0);}}><option value={0}>Все модули</option>{[8,9,10,11,12,13,14,15,16].map(m => <option key={m} value={m}>Модуль {m}</option>)}</select></label>
        <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={core} onChange={e => {setCore(e.target.checked);setPage(0);}} />Только 250 вопросов модулей 8–16</label><p role="status">Найдено: {filtered.length} · страница {page+1} / {pages}</p>
      </section>
      {filtered.slice(page*20,page*20+20).map(q => <article key={q.id} className={panel}><p className="text-xs text-[var(--color-muted)]">{q.id} · Модуль {q.topic} · {q.source}</p><h3 data-selection-question lang="en" className="font-bold">{q.prompt}</h3><ol data-selection-question lang="en" className="list-decimal space-y-2 pl-6">{q.options.map((o,i) => <li key={i}>{o}</li>)}</ol>{q.caution && <p className="rounded-xl bg-amber-500/10 p-3 text-sm">{q.caution}{/exhibit|diagram|refer to|packet tracer/i.test(q.prompt) ? " · Для независимой проверки нужна исходная схема или PT-файл." : ""}</p>}<details><summary className="cursor-pointer py-2 font-semibold">Показать ответ и объяснение</summary><p className="mt-3 font-medium">{q.answerText}</p><p className="mt-3">{q.explanation}</p></details></article>)}
      {!filtered.length && <p>По этому запросу ничего нет. Измени поиск или фильтр.</p>}
      <div className="flex gap-3"><Button disabled={page===0} onClick={() => setPage(page-1)}>Назад</Button><Button disabled={page+1>=pages} onClick={() => setPage(page+1)}>Далее</Button></div>
    </>}
    {tab === "exam" && <>
      <section className={panel}><h2 className="text-xl font-bold">Пробная эндка · 45 минут</h2><p>Новый случайный набор: 20 одиночных + 5 множественных + 5 открытых. Ответы и разбор появляются после завершения.</p><p className="text-sm">Автопроверка даёт до 80 баллов: для множественного выбора здесь требуется точный набор. На экзамене предусмотрен частичный зачёт, но его формула не указана. Открытые ответы (до 20 баллов) сравни с эталоном самостоятельно; автоматической оценки для них нет.</p><p className="text-sm text-[var(--color-muted)]">Попытка сохраняется в этом браузере для твоего аккаунта. Таймер продолжает идти после закрытия страницы. Эта тренировка не изменяет готовность в основном маршруте.</p>
        {!ready ? <p role="status">Загружаем попытку…</p> : !attempt || ended ? <Button onClick={() => {const a=newAttempt();setNow(Date.now());save(a);}}>Начать новый вариант</Button> : <p>Попытка уже идёт — продолжай ниже.</p>}
      </section>
      {saveError && <p role="alert">Не удалось сохранить попытку. Не закрывай страницу до завершения.</p>}
      {attempt && <>
        <section className={`${panel} sticky top-16 z-10`}><p className="font-bold">{ended ? `Результат автопроверки: ${scoreAttempt(attempt)} / 80` : `Осталось ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`}</p>{ended ? <p>Открытые вопросы — самостоятельная проверка по эталонам ниже. Это результат тренировки, не оценка за экзамен.</p> : <Button onClick={() => save({...attempt,finished:true})}>Завершить и показать разбор</Button>}</section>
        {attempt.ids.map((id,index) => { const q=bank.find(q=>q.id===id)!; const selected=attempt.answers[id] ?? []; return <article className={panel} key={id}><p className="text-sm">{index+1} / 30 · {index<20 ? "Один ответ · 3 балла" : `Выбери ${q.correct.length} ответа · 4 балла`}</p><h3 className="font-bold" data-selection-question lang="en">{q.prompt}</h3>{q.options.map((o,i) => <label data-selection-question lang="en" className="flex min-h-11 items-start gap-3 rounded-xl border border-[var(--color-border)] p-3" key={i}><input className="mt-1" type={index<20 ? "radio" : "checkbox"} name={id} checked={selected.includes(i)} disabled={ended} onChange={() => update({...attempt, answers:{...attempt.answers,[id]:index<20 ? [i] : selected.includes(i) ? selected.filter(v=>v!==i) : [...selected,i]}})} /><span data-selection-question lang="en">{o}</span></label>)}{ended && <div className="space-y-2 border-t border-[var(--color-border)] pt-3"><p className="font-bold">{isCorrect(q,selected) ? "Верно" : "Ошибка или пропуск"}</p><p>{q.answerText}</p><p>{q.explanation}</p></div>}</article>;})}
        {attempt.openIds.map((id,index) => {const q=openQuestions.find(q=>q.id===id)!;return <article className={panel} key={id}><h3 className="font-bold" data-selection-question lang="en">{index+26}. {q.prompt}</h3><label className="block">Твой ответ · 4 балла<textarea rows={5} className={`${input} mt-2`} disabled={ended} value={attempt.written[id] ?? ""} onChange={e=>update({...attempt,written:{...attempt.written,[id]:e.target.value}})} /></label>{ended && <p><b>Эталон для самопроверки: </b>{q.answer}</p>}</article>;})}
      </>}
    </>}
  </div>;
}
