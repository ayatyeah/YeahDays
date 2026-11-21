'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { writtenPoints, writtenQuestions } from '@/lib/events/networkFinal/finalWritten';
import { useQuizLanguages } from './useQuizLanguages';
import styles from './aws-practice.module.css';

type Language = 'ru' | 'en';
type Question = (typeof writtenQuestions)[number];
type Grade = { score: number; maxPoints: number; modelAnswer: string; feedback: string };

function WrittenQuestion({ question, lang, explanation }: {
  question: Question;
  lang: Language;
  explanation: Language;
}) {
  const [answer, setAnswer] = useState('');
  const [pending, setPending] = useState(false);
  const [grade, setGrade] = useState<{ lang: Language; result: Grade } | null>(null);
  const [error, setError] = useState<number | null>(null);
  const request = useRef<AbortController | null>(null);
  const ru = explanation === 'ru';
  const result = grade?.lang === explanation ? grade.result : null;

  useEffect(() => () => request.current?.abort(), []);

  function edit(value: string) {
    request.current?.abort();
    request.current = null;
    setAnswer(value);
    setGrade(null);
    setError(null);
    setPending(false);
  }

  async function check(event: FormEvent) {
    event.preventDefault();
    if (!answer.trim() || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    setGrade(null);
    setError(null);
    try {
      const response = await fetch('/api/network-final/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: question.id, answer: answer.trim(), lang: explanation }),
        signal: controller.signal,
      });
      if (!response.ok) {
        if (!controller.signal.aborted) setError(response.status);
        return;
      }
      const body: Grade = await response.json();
      if (!controller.signal.aborted) setGrade({ lang: explanation, result: body });
    } catch {
      if (!controller.signal.aborted) setError(0);
    } finally {
      if (request.current === controller) {
        request.current = null;
        setPending(false);
      }
    }
  }

  const number = question.id.split('-')[1];
  const points = writtenPoints(question.id);
  return <form className={styles.panel} onSubmit={check}>
    <p className={styles.note}>{lang === 'ru' ? 'Задание' : 'Question'} {number} · {lang === 'ru' ? 'Макс.' : 'Max.'} {points}</p>
    <label htmlFor={question.id} lang={lang}><strong>{question[lang]}</strong></label>
    <textarea id={question.id} value={answer} onChange={e => edit(e.target.value)}
      rows={question.id === '4-30' ? 6 : 2} maxLength={5000} required
      className="my-3 block w-full resize-y rounded-xl border border-[var(--g-border)] bg-[var(--g-inset)] p-3 text-base"
      placeholder={lang === 'ru' ? 'Твой ответ' : 'Your answer'} />
    <div className={styles.actions}>
      <button type="submit" disabled={!answer.trim() || pending || !!result}>
        {pending ? (ru ? 'Проверяем…' : 'Checking…') : (ru ? 'Отправить в Gemini на проверку' : 'Send to Gemini for grading')}
      </button>
    </div>
    <div role="status" aria-live="polite" aria-busy={pending} lang={explanation}>
      {error !== null && <p>{error === 401
        ? (ru ? 'Войди в аккаунт и повтори проверку.' : 'Sign in and try again.')
        : error === 429
          ? (ru ? 'Достигнут лимит проверок. Попробуй позже.' : 'Grading limit reached. Please try again later.')
          : (ru ? 'Не удалось проверить ответ. Попробуй отправить его ещё раз.' : 'Could not check your answer. Try sending it again.')}</p>}
      {result && <>
        <p><strong>{ru ? 'Баллы' : 'Score'} · {result.score} / {result.maxPoints}</strong></p>
        <p className="whitespace-pre-line break-words">{result.feedback}</p>
        <details>
          <summary>{ru ? 'Ответ и ход решения' : 'Model answer and worked solution'}</summary>
          <p className="whitespace-pre-line break-words"><strong>{result.modelAnswer}</strong></p>
          <p>{ru ? question.whyRu : question.whyEn}</p>
        </details>
      </>}
    </div>
  </form>;
}

export default function NetworkFinalWritten() {
  const { choices, choose } = useQuizLanguages();
  const lang = choices.question ?? 'en';
  const explanation = choices.explanation ?? 'ru';
  return <>
    <div className={styles.fields}>
      {(['question', 'explanation'] as const).map(field => <label key={field}>
        {field === 'question' ? 'Язык вопроса' : 'Язык разбора'}
        <select value={field === 'question' ? lang : explanation} onChange={e => choose(field, e.target.value === 'en' ? 'en' : 'ru')}>
          <option value="en">English</option><option value="ru">Русский</option>
        </select>
      </label>)}
    </div>
    {['4-', 'open-'].map((prefix, index) => <section key={prefix}>
      <h2>{lang === 'ru' ? 'Комплект' : 'Set'} {index + 1}</h2>
      {writtenQuestions.filter(q => q.id.startsWith(prefix)).map(q =>
        <WrittenQuestion key={q.id} question={q} lang={lang} explanation={explanation} />
      )}
    </section>)}
  </>;
}
