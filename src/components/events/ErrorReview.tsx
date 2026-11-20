'use client';
import AnswerOption from "@/components/events/AnswerOption";
import { QuestionText } from "./QuestionLanguage";
import { useEffect, useRef, useState } from 'react';
import type { EventQuizQuestion } from './EventQuiz';
import { matchesAnswer } from '@/lib/events/quizAnswers';
import { shuffledOptions } from '@/lib/events/errorReview';
import styles from './error-review.module.css';

export default function ErrorReview({ candidates, onCorrect, onDone }: { candidates: EventQuizQuestion[]; onCorrect: (id: string, selected: number[]) => void; onDone: (id?: string) => void }) {
  const [roll, setRoll] = useState<{ question: EventQuizQuestion; order: number[]; face: number } | null>(null);
  const [rolling, setRolling] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); }, []);
  useEffect(() => {
    if (!rolling) return;
    const timer = setTimeout(() => setRolling(false), 850);
    return () => clearTimeout(timer);
  }, [rolling]);
  const q = roll?.question;
  const correct = q ? matchesAnswer(selected, q.correct) : false;
  return <section className={styles.card} aria-label="Закрепление ошибок">
    <h2 ref={heading} tabIndex={-1}>Время закрепить 🎲</h2>
    <p>Кубик выберет один из вопросов, где ты ошибся. Правильный ответ исправит прошлую ошибку и добавит один балл к результату теста.</p>
    <div className={styles.scene} aria-hidden="true"><div className={`${styles.dice} ${rolling ? styles.rolling : ''}`}>{['⚀','⚁','⚂','⚃','⚄','⚅'].map((face, i) => <span key={face} className={styles.face} style={{ transform: ['translateZ(34px)','rotateY(180deg) translateZ(34px)','rotateY(90deg) translateZ(34px)','rotateY(-90deg) translateZ(34px)','rotateX(90deg) translateZ(34px)','rotateX(-90deg) translateZ(34px)'][i] }}>{roll && !rolling && i === 0 ? ['⚀','⚁','⚂','⚃','⚄','⚅'][roll.face] : face}</span>)}</div></div>
    {!roll && <button type="button" onClick={() => { const question = candidates[Math.floor(Math.random() * candidates.length)]; setRoll({ question, order: shuffledOptions(question.options.length), face: Math.floor(Math.random() * 6) }); setRolling(true); }}>Подбросить кубик</button>}
    {rolling && <p role="status">Кубик выбирает вопрос…</p>}
    {q && !rolling && <>
      <h3><QuestionText>{q.q}</QuestionText></h3><p>Выбери {q.correct.length === 1 ? 'один ответ' : `${q.correct.length} ответа`}. Варианты перемешаны.</p>
      <div className={styles.options}>{roll.order.map(original => <AnswerOption type="button" key={original} aria-pressed={selected.includes(original)} disabled={checked} data-answer-state={checked && q.correct.includes(original) ? 'correct' : checked && selected.includes(original) ? 'wrong' : undefined} onClick={() => setSelected(previous => q.correct.length === 1 ? [original] : previous.includes(original) ? previous.filter(i => i !== original) : [...previous, original])}>{checked && q.correct.includes(original) ? '✓ ' : checked && selected.includes(original) ? '✗ ' : ''}<QuestionText>{q.options[original]}</QuestionText></AnswerOption>)}</div>
      {!checked ? <button type="button" disabled={selected.length !== q.correct.length} onClick={() => { setChecked(true); if (correct) onCorrect(q.id, selected); }}>Проверить</button> : <div role="status"><strong>{correct ? 'Верно — ошибка исправлена, +1 балл!' : 'Пока не совсем. Разберись и попробуй ещё раз.'}</strong><p>{q.why.ru}</p>{q.optionExplanations && <details><summary>Почему остальные варианты не подходят</summary>{roll.order.map(i => <p key={i}><strong><QuestionText>{q.options[i]}</QuestionText></strong><br/>{q.optionExplanations?.[i]}</p>)}</details>}{correct ? <button type="button" onClick={() => onDone(q.id)}>Продолжить тест →</button> : <button type="button" onClick={() => { setChecked(false); setSelected([]); setRoll({ ...roll, order: shuffledOptions(q.options.length) }); }}>Попробовать ещё</button>}</div>}
    </>}
    {!(checked && correct) && <button type="button" className={styles.skip} onClick={() => onDone()}>Продолжить без повторения</button>}
  </section>;
}
