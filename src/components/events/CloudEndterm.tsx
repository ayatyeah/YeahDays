"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import lessonsRu from "@/lib/events/cloudComputingEndterm/lessons.json";
import lessonsEn from "@/lib/events/cloudComputingEndterm/lessons.en.json";
import NotesToolbar from "./NotesToolbar";
import questions from "@/lib/events/cloudComputingEndterm/questions.en.json";
import examGuidance from "@/lib/events/cloudComputingEndterm/examAnswerGuidance.en.json";
import { CLOUD_EXAM_TITLE } from "@/lib/events/cloudComputingEndterm/meta";
import { correctAnswer, emptyProgress, parseProgress, type CloudProgress } from "@/lib/events/cloudComputingEndterm/progress";
import Tutor from "./Tutor";
import SelectionMenu from "./SelectionMenu";
import { useTutorFocus } from "@/lib/tutorFocus";
import { cloudEndtermSummary } from "@/lib/events/cloudComputingEndterm/meta";
import EventQuiz from "./EventQuiz";
import Button from "@/components/ui/Button";
import styles from "./cloud-endterm.module.css";

const guidance: Record<string, { title: string; optionExplanations: string[] }> = examGuidance;
const AwsKnowledgeChecks = dynamic(() => import("./AwsKnowledgeChecks"), { loading: () => <p role="status">Opening AWS practice…</p> });

export default function CloudEndterm() {
  const { data, status } = useSession();
  if (status === "loading") return <p role="status">Opening Cloud Computing…</p>;
  if (!data?.user?.id) return <Link href="/login">Sign in to start learning</Link>;
  return <Workspace key={data.user.id} userId={data.user.id} />;
}

function Workspace({ userId }: { userId: string }) {
  const [lang, setLang] = useState<"en" | "ru">("en");
  const lessons = lang === "en" ? lessonsEn : lessonsRu;
  const storageKey = `yg-cloud-endterm-v1:${userId}`;
  const [progress, setProgress] = useState<CloudProgress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [tab, setTab] = useState<"learn" | "quiz" | "aws">("learn");
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
  useEffect(() => {
    useTutorFocus.getState().setBase({ view: tab !== "learn" ? "quiz" : "read", partId: tab === "learn" ? lesson.id : undefined, step: tab === "aws" ? "AWS Cloud Developing · Knowledge Checks" : tab === "quiz" ? CLOUD_EXAM_TITLE : lesson.title });
    return () => useTutorFocus.getState().setBase({});
  }, [tab, lesson.id, lesson.title]);
  const filtered = lessons.filter(l => `${l.group} ${l.title} ${l.body.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  function openLesson(id: string) {
    update({ ...progress, current: id });
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: "start" }); });
  }
  if (!ready) return <p role="status">Restoring your progress…</p>;
  return <div className={styles.root} data-no-i18n data-testid="cloud-endterm">
    <Link href="/events/courses/cloud-computing" className={styles.back} data-reading-chrome>← Cloud Computing events</Link>
    <header className={styles.header} data-reading-chrome>
      <div><p>Endterm revision</p><h1>Cloud Computing</h1><p className={styles.subtitle}>Understand one topic. Test yourself. Revisit what needs practice.</p></div>
      <div className={styles.progress}><strong>{progress.read.length}<span> / {lessons.length}</span></strong><span>parts read</span><progress value={progress.read.length} max={lessons.length} /></div>
    </header>
    <div data-reading-chrome className={styles.tabs} role="group" aria-label="Study mode">
      <button aria-pressed={tab === "learn"} onClick={() => setTab("learn")}>Learn by topic</button>
      <button aria-pressed={tab === "quiz"} onClick={() => setTab("quiz")}>Exam questions <span>47</span></button>
      <button aria-pressed={tab === "aws"} onClick={() => setTab("aws")}>AWS Knowledge Checks</button>
    </div>
    <p data-reading-chrome className="mb-6"><Link href="/events/cloud-computing-endterm/notes" target="_blank" className="underline">Open the revision notebook — 47 topics ↗</Link></p>
    {storageError && <p role="alert">Your browser could not save progress. Allow local storage to keep it after closing this page.</p>}
    {tab === "learn" ? <>
      <NotesToolbar lang={lang} onLang={setLang}/>
      <div className={`${styles.layout} g-cloud-reading-layout`}>
        <aside className={styles.outline} data-reading-chrome>
          <label>Find a topic<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="IAM, costs, DynamoDB…" /></label>
          <nav aria-label="Lecture topics">{[...new Set(filtered.map(l => l.group))].map(group => <section key={group}>
            <h2>{group}</h2>{filtered.filter(l => l.group === group).map(l => <button key={l.id} aria-current={l.id === lesson.id ? "step" : undefined} onClick={() => openLesson(l.id)}><span>{l.title}</span>{progress.read.includes(l.id) && <span aria-label="Read">✓</span>}</button>)}
          </section>)}</nav>
          {!filtered.length && <p>No topic found. Try a different word.</p>}
        </aside>
        <article className={styles.reader} key={lesson.id} data-selection-notes lang={lang}>
          <p className={styles.source}>{lesson.group} / part {index + 1} of {lessons.length}</p>
          <h2 ref={heading} tabIndex={-1}>{lesson.title}</h2>
          {lesson.body.map((text, i) => <p key={i}>{text}</p>)}
          <section className={styles.example}><h3>An example</h3><p>{lesson.example}</p></section>
          <section className={styles.remember}><h3>Remember</h3><p>{lesson.remember}</p><p lang="en">{lesson.english}</p></section>
          <details className={styles.check}><summary>Check your understanding: {lesson.check}</summary><p>{lesson.answer}</p></details>
          <p className={styles.source}>{lesson.source}</p>
          <div className={styles.actions}>
            <button className={styles.primary} onClick={() => { update({ ...progress, read: progress.read.includes(lesson.id) ? progress.read.filter(id => id !== lesson.id) : [...progress.read, lesson.id] }); }}>{progress.read.includes(lesson.id) ? "✓ Read" : "Mark as read"}</button>
            <button disabled={index === 0} onClick={() => openLesson(lessons[index - 1].id)}>Previous</button>
            <button disabled={index === lessons.length - 1} onClick={() => openLesson(lessons[index + 1].id)}>Next part</button>
          </div>
        </article>
      </div>
      <details className={styles.sources}><summary>Materials & sources</summary>
        <p>Explanations are based on Lectures 5, 6, 8 and 10. AWS Developing topics supplement these with syllabus content and practice questions. The private AWS Academy course requires sign-in.</p>
        <a href="https://awsacademy.instructure.com/courses/193042/modules" target="_blank" rel="noreferrer">AWS Academy course</a>
        <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.API.html" target="_blank" rel="noreferrer">DynamoDB API</a>
        <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html" target="_blank" rel="noreferrer">S3 website endpoints</a>
        <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-metrics.html" target="_blank" rel="noreferrer">API Gateway metrics</a>
        <a href="https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management" target="_blank" rel="noreferrer">Azure Cost Management</a>
        <a href="https://aws.amazon.com/cloudshell/faqs/" target="_blank" rel="noreferrer">AWS CloudShell</a>
        <a href="https://docs.docker.com/reference/cli/docker/container/run/" target="_blank" rel="noreferrer">Docker run</a>
      </details>
    </> : tab === "aws" ? <AwsKnowledgeChecks answers={progress.answers} onAnswer={(id, value) => update({ ...progress, answers: { ...progress.answers, [id]: value } })} /> : <Exam answers={progress.answers} onAnswer={(id, value) => update({ ...progress, answers: { ...progress.answers, [id]: value } })} />}
    <Tutor event={cloudEndtermSummary} userId={userId} />
    <SelectionMenu key={tab} />
    <p className={styles.footnote}>Progress is saved for your account in this browser.</p>
  </div>;
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
      quiz={queue.map(q => ({ id: q.id, q: q.prompt, options: q.options, labels: q.labels, correct: q.answers, why: { ru: q.explanation, en: q.explanation }, caution: q.caution, optionExplanations: guidance[q.id].optionExplanations, studyLink: { href: `/events/cloud-computing-endterm/notes#${q.id}`, title: guidance[q.id].title } }))}
      lang="en" music={music} onMusic={() => setMusic(m => !m)}
      onExit={() => { if (confirm("Leave the quiz? This attempt will end.")) setMode("intro"); }}
      onAnswer={onAnswer} onFinish={values => { setResult(values); setMode("result"); }} />
  </section>;
  if (mode === "result") return <section className="space-y-5">
    <div className="rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-sky-500/10 p-5">
      <h2 className="text-xl font-bold">Quiz complete</h2>
      <p className="mt-3 text-5xl font-bold tabular-nums">{graded ? Math.round((graded - mistakes.length) / graded * 100) : 0}%</p>
      <p className="mt-3">Correct answers: {graded - mistakes.length} of {graded} / Completed: {queue.length} questions</p>
      {queue.length > graded && <p className="mt-2 text-sm">{queue.length - graded} ambiguous questions were reviewed without a score.</p>}
    </div>
    <div className="flex flex-wrap gap-3"><Button variant="primary" onClick={() => start()}>Try all 47 again</Button>
      {!!mistakes.length && <Button onClick={() => start(mistakes)}>Review mistakes ({mistakes.length})</Button>}
      <Button variant="ghost" onClick={() => setMode("intro")}>Back to quiz</Button></div>
    {mistakes.map(q => <article key={q.id} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
      <h3 lang="en" className="font-semibold">{q.prompt}</h3>
      <p>Your answer: {(result[queue.indexOf(q)] ?? []).map(i => `${q.labels[i]}. ${q.options[i]}`).join("; ")}</p>
      <p>Correct answer: {q.answers.map(i => `${q.labels[i]}. ${q.options[i]}`).join("; ")}</p><p>{q.explanation}</p>
    </article>)}
  </section>;
  const savedMistakes = questions.filter(q => q.answers.length && answers[q.id] && !correctAnswer(answers[q.id], q.answers));
  return <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
    <h2 className="text-xl font-bold">{CLOUD_EXAM_TITLE}</h2>
    <p>Work through 47 questions. Choose an answer, read the explanation and continue. Review your results and mistakes at the end.</p>
    <p className="text-sm text-[var(--color-muted)]">Original English questions and options are preserved. 44 questions are scored; 3 ambiguous questions include explanations without a score.</p>
    <div className="flex flex-wrap gap-3"><Button variant="primary" onClick={() => start()}>Start quiz — 47 questions</Button>
      {!!savedMistakes.length && <Button onClick={() => start(savedMistakes)}>Review saved mistakes ({savedMistakes.length})</Button>}</div>
  </section>;
}
