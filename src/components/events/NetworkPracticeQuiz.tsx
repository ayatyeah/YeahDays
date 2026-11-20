'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import EventQuiz, {type EventQuizQuestion} from './EventQuiz';
import {matchesAnswer} from '@/lib/events/quizAnswers';
import styles from './aws-knowledge-checks.module.css';

const home = '/events/courses/computer-networks/practice';

export default function NetworkPracticeQuiz({title, questions}:{title:string; questions:EventQuizQuestion[]}) {
  const router = useRouter();
  const [music,setMusic] = useState(false);
  const [round,setRound] = useState(0);
  const [answers,setAnswers] = useState<number[][] | null>(null);
  const [errorsOnly,setErrorsOnly] = useState<EventQuizQuestion[] | null>(null);
  const quiz = errorsOnly ?? questions.filter(q => q.correct.length);
  const reference = questions.filter(q => !q.correct.length);
  const missed = quiz.filter((q,i) => !matchesAnswer(answers?.[i],q.correct));
  function restart(pool: EventQuizQuestion[] | null) {
    setErrorsOnly(pool);
    setAnswers(null);
    setRound(n => n+1);
  }
  return <section className={styles.quiz} data-no-i18n>
    <Link href={home}>← Практика Computer Networks</Link><h1>{title}</h1>
    {answers ? <section aria-live="polite"><h2>Результат: {quiz.length-missed.length} из {quiz.length}</h2>
      <div className={styles.actions}><button className="f-button" onClick={()=>restart(null)}>Пройти заново</button>
      {!!missed.length && <button className="f-button" onClick={()=>restart(missed)}>Повторить ошибки · {missed.length}</button>}</div></section>
    : quiz.length > 0 && <EventQuiz key={round} eventId="computer-networks-final" step={{title:{ru:title,en:title}}} quiz={quiz} lang="ru" music={music} onMusic={()=>setMusic(v=>!v)} onFinish={setAnswers} onExit={()=>router.push(home)} explainOptionsOpen/>}
    {!!reference.length && <details><summary>Задания для самостоятельного разбора · {reference.length}</summary>{reference.map(q=><article key={q.id}><h3>{q.q}</h3><ul>{q.options.map((o,i)=><li key={i}>{o}</li>)}</ul><p>{q.caution}</p><p>{q.why.ru}</p></article>)}</details>}
  </section>;
}
