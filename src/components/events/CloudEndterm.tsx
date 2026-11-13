"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import lessons from "@/lib/events/cloudComputingEndterm/lessons.json";
import questions from "@/lib/events/cloudComputingEndterm/questions.json";
import { CLOUD_EXAM_TITLE } from "@/lib/events/cloudComputingEndterm/meta";
import { correctAnswer, emptyProgress, parseProgress, type CloudProgress } from "@/lib/events/cloudComputingEndterm/progress";
import EventQuiz from "./EventQuiz";
import Button from "@/components/ui/Button";
import styles from "./cloud-endterm.module.css";

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
    <Link href="/events/courses/cloud-computing" className={styles.back}>← Ивенты Cloud Computing</Link>
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
  const [queue, setQueue] = useState(questions);
  const [run, setRun] = useState(0);
  const [mode, setMode] = useState<"intro" | "quiz" | "result">("intro");
  const [result, setResult] = useState<number[][]>([]);
  const [music, setMusic] = useState(false);
  const mistakes = queue.filter((q, i) => q.answers.length && !correctAnswer(result[i] ?? [], q.answers));
  const graded = queue.filter(q => q.answers.length).length;
  function start(items = questions) { setQueue(items); setResult([]); setRun(n => n + 1); setMode("quiz"); }
  if (mode === "quiz") return <section className="space-y-5">
    <EventQuiz key={run} eventId="cloud-computing-endterm" step={{ title: { ru: CLOUD_EXAM_TITLE, en: CLOUD_EXAM_TITLE } }}
      quiz={queue.map(q => ({ id: q.id, q: q.prompt, options: q.options, labels: q.labels, correct: q.answers, why: { ru: q.explanation, en: q.explanation }, caution: q.caution }))}
      lang="ru" music={music} onMusic={() => setMusic(m => !m)}
      onExit={() => { if (confirm("Выйти из теста? Текущая попытка завершится.")) setMode("intro"); }}
      onAnswer={onAnswer} onFinish={values => { setResult(values); setMode("result"); }} />
  </section>;
  if (mode === "result") return <section className="space-y-5">
    <div className="rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-sky-500/10 p-5">
      <h2 className="text-xl font-bold">Тест завершён</h2>
      <p className="mt-3 text-5xl font-bold tabular-nums">{graded ? Math.round((graded - mistakes.length) / graded * 100) : 0}%</p>
      <p className="mt-3">Верных ответов: {graded - mistakes.length} из {graded} · Пройдено: {queue.length} вопросов</p>
      {queue.length > graded && <p className="mt-2 text-sm">{queue.length - graded} спорных вопроса разобраны без оценки.</p>}
    </div>
    <div className="flex flex-wrap gap-3"><Button variant="primary" onClick={() => start()}>Пройти все 47 ещё раз</Button>
      {!!mistakes.length && <Button onClick={() => start(mistakes)}>Повторить ошибки ({mistakes.length})</Button>}
      <Button variant="ghost" onClick={() => setMode("intro")}>К тесту</Button></div>
    {mistakes.map(q => <article key={q.id} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
      <h3 lang="en" className="font-semibold">{q.prompt}</h3>
      <p>Твой ответ: {(result[queue.indexOf(q)] ?? []).map(i => `${q.labels[i]}. ${q.options[i]}`).join("; ")}</p>
      <p>Правильный ответ: {q.answers.map(i => `${q.labels[i]}. ${q.options[i]}`).join("; ")}</p><p>{q.explanation}</p>
    </article>)}
  </section>;
  const savedMistakes = questions.filter(q => q.answers.length && answers[q.id] && !correctAnswer(answers[q.id], q.answers));
  return <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
    <h2 className="text-xl font-bold">{CLOUD_EXAM_TITLE}</h2>
    <p>47 вопросов по порядку. Выбери ответ, прочитай объяснение и нажми «Дальше». В конце — результат и повторение ошибок.</p>
    <p className="text-sm text-[var(--color-muted)]">Оригинальные английские вопросы и варианты сохранены. 44 вопроса с проверкой, 3 спорных — с разбором без оценки.</p>
    <div className="flex flex-wrap gap-3"><Button variant="primary" onClick={() => start()}>Начать тест — 47 вопросов</Button>
      {!!savedMistakes.length && <Button onClick={() => start(savedMistakes)}>Повторить прошлые ошибки ({savedMistakes.length})</Button>}</div>
  </section>;
}
