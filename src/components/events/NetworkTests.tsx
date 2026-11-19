'use client';

import { useState } from 'react';
import { event } from '@/lib/events/computerNetworks/event';
import { draw, steps, type Step } from '@/lib/events/engine';
import type { Lang } from '@/lib/events/types';
import EventQuiz, { type EventQuizQuestion } from './EventQuiz';

export default function NetworkTests({ lang }: { lang: Lang }) {
  const [attempt, setAttempt] = useState<{ step: Step; questions: EventQuizQuestion[] } | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [music, setMusic] = useState(false);
  const ru = lang === 'ru';
  if (attempt && score === null) return <EventQuiz eventId={event.id} step={attempt.step} quiz={attempt.questions} lang={lang}
    music={music} onMusic={() => setMusic(!music)} onExit={() => setAttempt(null)}
    onFinish={answers => setScore(attempt.questions.filter((q, i) => answers[i]?.[0] === q.correct[0]).length)}/>;
  return <section className="g-note-paper"><h2>{ru ? 'Тесты по сетям' : 'Networking tests'}</h2>
    {attempt && <p role="status">{attempt.step.title[lang]} · {score} / {attempt.questions.length}</p>}
    <ul>{steps(event).filter(step => step.kind !== 'part' && step.count > 0).map(step =>
      <li key={step.id}><button className="py-3 text-left underline" onClick={() => {
        const questions = draw(event, step).map(q => ({ ...q, correct: [q.correct] }));
        setScore(null);
        setAttempt({ step, questions });
      }}>{step.title[lang]} · {step.count} {ru ? 'вопр.' : 'questions'}</button></li>
    )}</ul>
  </section>;
}
