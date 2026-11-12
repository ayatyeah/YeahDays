"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import lessons from "@/lib/events/cloudComputingEndterm/lessons.json";
import questions from "@/lib/events/cloudComputingEndterm/questions.json";
import { CLOUD_EXAM_TITLE } from "@/lib/events/cloudComputingEndterm/meta";
import { correctAnswer, emptyProgress, parseProgress, type CloudProgress } from "@/lib/events/cloudComputingEndterm/progress";
import styles from "./cloud-endterm.module.css";

const topics: Record<string, string> = { cost: "Расходы и Azure", architecture: "Архитектура", database: "Базы данных", security: "Безопасность", storage: "S3 и хранение", api: "API Gateway", develop: "Разработка" };

export default function CloudEndterm() {
  const { data, status } = useSession();
  if (status === "loading") return <p role="status">Открываем Cloud Computing…</p>;
  if (!data?.user?.id) return <Link href="/login">Войти, чтобы начать подготовку</Link>;
  return <Workspace key={data.user.id} userId={data.user.id} />;
}

function Workspace({ userId }: { userId: string }) {
  const storageKey = `yg-cloud-endterm-v1:${userId}`;
  const [progress, setProgress] = useState<CloudProgress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [tab, setTab] = useState<"learn" | "quiz">("learn");
  const [query, setQuery] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    try { setProgress(parseProgress(localStorage.getItem(storageKey))); }
    catch { setStorageError(true); }
    setReady(true);
  }, [storageKey]);
  function update(next: CloudProgress) {
    setProgress(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
  }
  const index = Math.max(0, lessons.findIndex(l => l.id === progress.current));
  const lesson = lessons[index];
  const filtered = lessons.filter(l => `${l.group} ${l.title} ${l.body.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  function openLesson(id: string) {
    update({ ...progress, current: id });
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: "start" }); });
  }
  if (!ready) return <p role="status">Восстанавливаем прогресс…</p>;
  return <main className={styles.root} data-no-i18n data-testid="cloud-endterm">
    <Link href="/events" className={styles.back}>← Все ивенты</Link>
    <header className={styles.header}>
      <div><p>Подготовка к эндтерму</p><h1>Cloud Computing</h1><p className={styles.subtitle}>Разобраться по частям. Проверить себя. Повторить сложное.</p></div>
      <div className={styles.progress}><strong>{progress.read.length}<span> / {lessons.length}</span></strong><span>частей прочитано</span><progress value={progress.read.length} max={lessons.length} /></div>
    </header>
    <div className={styles.tabs} role="group" aria-label="Режим подготовки">
      <button aria-pressed={tab === "learn"} onClick={() => setTab("learn")}>Объяснения по частям</button>
      <button aria-pressed={tab === "quiz"} onClick={() => setTab("quiz")}>Вопросы с реального экзамена <span>47</span></button>
    </div>
    {storageError && <p role="alert">Браузер не разрешил сохранить прогресс. До закрытия страницы он останется здесь; разреши локальное хранилище для сохранения.</p>}
    {tab === "learn" ? <>
      <div className={styles.layout}>
        <aside className={styles.outline}>
          <label>Найти тему<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="IAM, расходы, DynamoDB…" /></label>
          <nav aria-label="Части лекций">{[...new Set(filtered.map(l => l.group))].map(group => <section key={group}>
            <h2>{group}</h2>{filtered.filter(l => l.group === group).map(l => <button key={l.id} aria-current={l.id === lesson.id ? "step" : undefined} onClick={() => openLesson(l.id)}><span>{l.title}</span>{progress.read.includes(l.id) && <span aria-label="Прочитано">✓</span>}</button>)}
          </section>)}</nav>
          {!filtered.length && <p>Тема не найдена. Попробуй другое слово.</p>}
        </aside>
        <article className={styles.reader} key={lesson.id}>
          <p className={styles.source}>{lesson.group} · часть {index + 1} из {lessons.length}</p>
          <h2 ref={heading} tabIndex={-1}>{lesson.title}</h2>
          {lesson.body.map((text, i) => <p key={i}>{text}</p>)}
          <section className={styles.example}><h3>На примере</h3><p>{lesson.example}</p></section>
          <section className={styles.remember}><h3>Запомни</h3><p>{lesson.remember}</p><p lang="en">{lesson.english}</p></section>
          <details className={styles.check}><summary>Проверь себя: {lesson.check}</summary><p>{lesson.answer}</p></details>
          <p className={styles.source}>{lesson.source}</p>
          <div className={styles.actions}>
            <button className={styles.primary} onClick={() => { update({ ...progress, read: progress.read.includes(lesson.id) ? progress.read.filter(id => id !== lesson.id) : [...progress.read, lesson.id] }); }}>{progress.read.includes(lesson.id) ? "✓ Прочитано" : "Отметить прочитанным"}</button>
            <button disabled={index === 0} onClick={() => openLesson(lessons[index - 1].id)}>Назад</button>
            <button disabled={index === lessons.length - 1} onClick={() => openLesson(lessons[index + 1].id)}>Следующая часть</button>
          </div>
        </article>
      </div>
      <details className={styles.sources}><summary>Материалы и источники</summary>
        <p>Локальные Lecture5, Lecture6, Lecture8 и Lecture10 переработаны в объяснения. Блок AWS Developing дополняет лекции по темам syllabus и вопросам с фотографий. Доступ к закрытому курсу AWS Academy требует входа.</p>
        <a href="https://awsacademy.instructure.com/courses/193042/modules" target="_blank" rel="noreferrer">Курс AWS Academy</a>
        <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.API.html" target="_blank" rel="noreferrer">DynamoDB API</a>
        <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html" target="_blank" rel="noreferrer">S3 website endpoints</a>
        <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-metrics.html" target="_blank" rel="noreferrer">API Gateway metrics</a>
        <a href="https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management" target="_blank" rel="noreferrer">Azure Cost Management</a>
        <a href="https://aws.amazon.com/cloudshell/faqs/" target="_blank" rel="noreferrer">AWS CloudShell</a>
        <a href="https://docs.docker.com/reference/cli/docker/container/run/" target="_blank" rel="noreferrer">Docker run</a>
      </details>
    </> : <Exam answers={progress.answers} onAnswer={(id, value) => update({ ...progress, answers: { ...progress.answers, [id]: value } })} />}
    <p className={styles.footnote}>Прогресс сохраняется для твоего аккаунта в этом браузере.</p>
  </main>;
}

function Exam({ answers, onAnswer }: { answers: Record<string, number[]>; onAnswer: (id: string, value: number[]) => void }) {
  const [topic, setTopic] = useState("all");
  const [mode, setMode] = useState("all");
  const [query, setQuery] = useState("");
  const [queue, setQueue] = useState(() => questions.map(q => q.id));
  const [position, setPosition] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const filtered = questions.filter(q => (topic === "all" || q.topic === topic) && `${q.prompt} ${q.options.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  const byId = new Map(questions.map(q => [q.id, q]));
  const current = byId.get(queue[position]);
  const graded = questions.filter(q => q.answers.length);
  const right = graded.filter(q => answers[q.id] && correctAnswer(answers[q.id], q.answers)).length;
  const attempted = graded.filter(q => answers[q.id]).length;
  function move(next: number) {
    setPosition(next);
    requestAnimationFrame(() => { const h = document.getElementById("cloud-question-title"); h?.focus(); h?.scrollIntoView({ block: "start" }); });
  }
  function start(nextMode = mode, nextTopic = topic, nextQuery = query, shuffle = false) {
    const items = questions.filter(q => (nextTopic === "all" || q.topic === nextTopic) && `${q.prompt} ${q.options.join(" ")}`.toLowerCase().includes(nextQuery.trim().toLowerCase()) && (nextMode !== "mistakes" || (q.answers.length > 0 && answers[q.id] && !correctAnswer(answers[q.id], q.answers))) && (nextMode !== "unanswered" || !answers[q.id]));
    const ids = items.map(q => q.id);
    if (shuffle) for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    setQueue(ids); setPosition(0); setAttempt(a => a + 1);
  }
  return <section className={styles.exam}>
    <header><h2>{CLOUD_EXAM_TITLE}</h2><p>47 уникальных вопросов с фотографий. Английские формулировки и порядок вариантов сохранены. Совпадение с будущим экзаменом не подтверждено.</p><p>44 вопроса с проверкой и 3 спорных с разбором без оценки. Выбери ответ, затем открой объяснение. №14 на листе использован дважды; №46 повторяет №44.</p></header>
    <p className={styles.score} role="status">Верно: {right} / {graded.length} · Проверено: {attempted} · Осталось: {graded.length - attempted}</p>
    <div className={styles.filters}>
      <label>Тема<select value={topic} onChange={e => { setTopic(e.target.value); start(mode, e.target.value); }}><option value="all">Все темы</option>{Object.entries(topics).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      <label>Режим<select value={mode} onChange={e => { setMode(e.target.value); start(e.target.value); }}><option value="all">Все вопросы</option><option value="mistakes">Повторить ошибки</option><option value="unanswered">Без ответа</option></select></label>
      <label>Поиск<input type="search" value={query} onChange={e => { setQuery(e.target.value); start(mode, topic, e.target.value); }} placeholder="Текст вопроса или варианта" /></label>
    </div>
    <div className={styles.actions}><button onClick={() => start(mode, topic, query, true)}>Перемешать вопросы</button><span>{queue.length ? `${position + 1} / ${queue.length}` : "Нет вопросов в подборке"}</span></div>
    {current ? <QuestionCard key={`${current.id}:${attempt}`} question={current} saved={answers[current.id]} onAnswer={a => onAnswer(current.id, a)} /> : <p className={styles.example}>Здесь пока нет вопросов. Выбери «Все вопросы» или другую тему.</p>}
    {current && <div className={styles.actions}><button disabled={position === 0} onClick={() => move(position - 1)}>Предыдущий вопрос</button><button className={styles.primary} disabled={position === queue.length - 1} onClick={() => move(position + 1)}>Следующий вопрос</button>{position === queue.length - 1 && <button onClick={() => { setMode("mistakes"); start("mistakes"); }}>Повторить ошибки</button>}</div>}
    <details className={styles.questionList}><summary>Список уникальных вопросов ({filtered.length})</summary>{filtered.map(q => <button key={q.id} onClick={() => { setMode("all"); setQueue(filtered.map(item => item.id)); setPosition(filtered.findIndex(item => item.id === q.id)); setAttempt(a => a + 1); }} lang="en"><span>№{q.number}</span>{q.prompt}</button>)}</details>
  </section>;
}

function QuestionCard({ question: q, saved, onAnswer }: { question: { id: string; number: string; prompt: string; options: string[]; labels: string[]; answers: number[]; explanation: string; topic: string; caution?: string }; saved?: number[]; onAnswer: (a: number[]) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const multi = q.answers.length > 1;
  const correct = correctAnswer(selected, q.answers);
  return <article className={styles.question} data-testid="cloud-question">
    <p className={styles.source}>Вопрос №{q.number} · {topics[q.topic]}{saved ? " · Уже отвечал — попробуй вспомнить" : ""}</p>
    <h3 id="cloud-question-title" tabIndex={-1} lang="en">{q.prompt}</h3>
    {multi && <p>Выбери {q.answers.length} варианта.</p>}
    <div className={styles.options} role="group" aria-label="Варианты ответа">{q.options.map((option, i) => <button key={i} lang="en" aria-pressed={selected.includes(i)} disabled={revealed} data-correct={revealed && q.answers.includes(i) || undefined} data-wrong={revealed && q.answers.length > 0 && selected.includes(i) && !q.answers.includes(i) || undefined} onClick={() => setSelected(multi ? selected.includes(i) ? selected.filter(n => n !== i) : [...selected, i] : [i])}><span>{q.labels[i]}.</span><span>{option}</span></button>)}</div>
    {!revealed ? <button className={styles.primary} disabled={!selected.length || (multi && selected.length !== q.answers.length)} onClick={() => { setRevealed(true); onAnswer(selected); }}>Проверить и понять</button> : <div className={styles.feedback} aria-live="polite" data-testid="cloud-explanation">
      <strong>{!q.answers.length ? "Разбор без оценки" : correct ? "Верно" : "Разберём ошибку"}</strong>
      {q.answers.length > 0 && <p>Ответ: {q.answers.map(i => q.labels[i]).join(", ")}</p>}
      {q.caution && <p className={styles.caution}>{q.caution}</p>}
      <p>{q.explanation}</p><button onClick={() => { setSelected([]); setRevealed(false); }}>Ответить ещё раз</button>
    </div>}
  </article>;
}
