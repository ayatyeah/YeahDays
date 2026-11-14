"use client";

import { useState } from "react";
import questions from "@/lib/events/cloudComputingEndterm/knowledgeChecks.json";
import modules from "@/lib/events/cloudComputingEndterm/knowledgeCheckModules.json";
import { correctAnswer } from "@/lib/events/cloudComputingEndterm/progress";
import EventQuiz from "./EventQuiz";
import Button from "@/components/ui/Button";

export default function AwsKnowledgeChecks({ answers, onAnswer }: { answers: Record<string, number[]>; onAnswer: (id: string, value: number[]) => void }) {
  const [module, setModule] = useState(0);
  const [queue, setQueue] = useState(questions);
  const [mode, setMode] = useState<"intro" | "quiz" | "result">("intro");
  const [result, setResult] = useState<number[][]>([]);
  const [run, setRun] = useState(0);
  const [music, setMusic] = useState(false);
  const selected = questions.filter(q => !module || q.module === module);
  const mistakes = queue.filter((q, i) => !correctAnswer(result[i] ?? [], q.answers));
  const savedMistakes = selected.filter(q => answers[q.id] && !correctAnswer(answers[q.id], q.answers));
  function start(items = selected) { setQueue(items); setResult([]); setRun(n => n + 1); setMode("quiz"); }
  if (mode === "quiz") return <EventQuiz key={run} eventId="cloud-computing-endterm"
    step={{ title: { ru: "AWS Cloud Developing · Knowledge Checks", en: "AWS Cloud Developing · Knowledge Checks" } }}
    quiz={queue.map(q => ({ id: q.id, q: q.prompt, options: q.options, correct: q.answers, why: { ru: q.explanation, en: q.explanation }, caution: q.caution }))}
    lang="en" music={music} onMusic={() => setMusic(v => !v)} onAnswer={onAnswer}
    onExit={() => { if (confirm("Exit the quiz? This attempt will end.")) setMode("intro"); }}
    onFinish={values => { setResult(values); setMode("result"); }} />;
  if (mode === "result") return <section className="space-y-5">
    <div className="rounded-3xl border border-violet-400/30 bg-violet-500/10 p-5 space-y-3">
      <h2 className="text-xl font-bold">Knowledge Check complete</h2>
      <p className="text-5xl font-bold">{Math.round((queue.length - mistakes.length) / queue.length * 100)}%</p>
      <p>Correct answers: {queue.length - mistakes.length} of {queue.length}</p>
    </div>
    <div className="flex flex-wrap gap-3"><Button onClick={() => start(queue)}>Try again</Button>
      {!!mistakes.length && <Button onClick={() => start(mistakes)}>Review mistakes ({mistakes.length})</Button>}
      <Button onClick={() => setMode("intro")}>Choose another module</Button></div>
    {mistakes.map(q => <article key={q.id} className="rounded-3xl border border-[var(--color-border)] p-5 space-y-3">
      <h3 lang="en" className="font-semibold whitespace-pre-wrap">{q.prompt}</h3>
      <p>Correct answer: {q.answers.map(i => q.options[i]).join("; ")}</p>
      <p lang="en">{q.explanation}</p>
    </article>)}
  </section>;
  return <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-5" data-testid="aws-knowledge-checks">
    <h2 className="text-xl font-bold">AWS Cloud Developing — Knowledge Checks</h2>
    <p>{questions.length} questions from {modules.length} AWS Academy knowledge checks. Questions, options and explanations are in English. You can ask the assistant to explain an answer in Russian.</p>
    <label>Choose a module<select value={module} onChange={e => setModule(Number(e.target.value))}>
      <option value={0}>All modules — {questions.length} questions</option>
      {modules.map(m => <option key={m.module} value={m.module}>{m.moduleTitle}</option>)}
    </select></label>
    <p>Completed in this set: {selected.filter(q => answers[q.id]).length} of {selected.length}. Answer, read the explanation, then continue.</p>
    <div className="flex flex-wrap gap-3"><Button variant="primary" onClick={() => start()}>Start quiz — {selected.length} questions</Button>
      {!!savedMistakes.length && <Button onClick={() => start(savedMistakes)}>Review previous mistakes ({savedMistakes.length})</Button>}</div>
    <p className="text-sm text-[var(--color-muted)]">Source: <a className="underline" href="https://awsacademy.instructure.com/courses/193042/modules" target="_blank" rel="noreferrer">AWS Academy Cloud Developing, course 193042</a>. This is a separate practice bank. It is not a prediction of future exam questions.</p>
  </section>;
}
