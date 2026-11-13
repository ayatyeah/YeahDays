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
    lang="ru" music={music} onMusic={() => setMusic(v => !v)} onAnswer={onAnswer}
    onExit={() => { if (confirm("Выйти из теста? Текущая попытка завершится.")) setMode("intro"); }}
    onFinish={values => { setResult(values); setMode("result"); }} />;
  if (mode === "result") return <section className="space-y-5">
    <div className="rounded-3xl border border-violet-400/30 bg-violet-500/10 p-5 space-y-3">
      <h2 className="text-xl font-bold">Knowledge Check завершён</h2>
      <p className="text-5xl font-bold">{Math.round((queue.length - mistakes.length) / queue.length * 100)}%</p>
      <p>Верных ответов: {queue.length - mistakes.length} из {queue.length}</p>
    </div>
    <div className="flex flex-wrap gap-3"><Button onClick={() => start(queue)}>Пройти ещё раз</Button>
      {!!mistakes.length && <Button onClick={() => start(mistakes)}>Повторить ошибки ({mistakes.length})</Button>}
      <Button onClick={() => setMode("intro")}>К выбору модуля</Button></div>
    {mistakes.map(q => <article key={q.id} className="rounded-3xl border border-[var(--color-border)] p-5 space-y-3">
      <h3 lang="en" className="font-semibold whitespace-pre-wrap">{q.prompt}</h3>
      <p>Правильный ответ: {q.answers.map(i => q.options[i]).join("; ")}</p>
      <p lang="en">{q.explanation}</p>
    </article>)}
  </section>;
  return <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-5" data-testid="aws-knowledge-checks">
    <h2 className="text-xl font-bold">AWS Cloud Developing — Knowledge Checks</h2>
    <p>{questions.length} вопросов из {modules.length} проверок курса AWS Academy. Оригинальные вопросы, варианты и разборы AWS на английском. После ответа можно попросить ИИ объяснить по-русски.</p>
    <label>Выбери модуль<select value={module} onChange={e => setModule(Number(e.target.value))}>
      <option value={0}>Все модули — {questions.length} вопросов</option>
      {modules.map(m => <option key={m.module} value={m.module}>{m.moduleTitle}</option>)}
    </select></label>
    <p>Пройдено в этом наборе: {selected.filter(q => answers[q.id]).length} из {selected.length}. Сначала ответ, затем разбор и следующий вопрос.</p>
    <div className="flex flex-wrap gap-3"><Button variant="primary" onClick={() => start()}>Начать тест — {selected.length} вопросов</Button>
      {!!savedMistakes.length && <Button onClick={() => start(savedMistakes)}>Повторить прошлые ошибки ({savedMistakes.length})</Button>}</div>
    <p className="text-sm text-[var(--color-muted)]">Источник: <a className="underline" href="https://awsacademy.instructure.com/courses/193042/modules" target="_blank" rel="noreferrer">AWS Academy Cloud Developing, курс 193042</a>. Это отдельный банк проверок курса; совпадение с вопросами будущего экзамена не подтверждено.</p>
  </section>;
}
