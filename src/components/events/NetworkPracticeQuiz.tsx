'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {useTutorFocus} from '@/lib/tutorFocus';
import {useSession} from 'next-auth/react';
import setup from './aws-practice.module.css';
import EventQuiz, {type EventQuizQuestion} from './EventQuiz';
import {matchesAnswer} from '@/lib/events/quizAnswers';
import styles from './aws-knowledge-checks.module.css';

const Tutor = dynamic(() => import('./Tutor'));
const home = '/events/courses/computer-networks/practice';

export default function NetworkPracticeQuiz({title, questions}:{title:string; questions:EventQuizQuestion[]}) {
  const {data:session,status} = useSession();
  const storage = session?.user?.id ? 'yg-cn-bank:'+session.user.id+':'+title : null;
  const bank = questions.filter(q=>q.correct.length);
  const [limit,setLimit] = useState(String(Math.min(10,bank.length)));
  const [order,setOrder] = useState('original');
  const [scope,setScope] = useState('all');
  const [history,setHistory] = useState<Record<string,boolean>>({});
  const [loaded,setLoaded] = useState<string | null>(null);
  useEffect(()=>{
    function reload() {
      let saved = {};
      try { if(storage) saved=JSON.parse(localStorage.getItem(storage) ?? '{}') ?? {}; } catch {}
      setHistory(saved);
      setLoaded(storage);
    }
    function sync(event: StorageEvent) { if(event.key===storage || event.key===null) reload(); }
    reload();
    window.addEventListener('storage',sync);
    return () => window.removeEventListener('storage',sync);
  },[storage]);
  const pool = bank.filter(q=>scope==='all' || (scope==='new' ? history[q.id]===undefined : history[q.id]===false));
  function start() {
    const items=[...pool];
    if(order==='random') for(let i=items.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [items[i],items[j]]=[items[j],items[i]];
    }
    restart(items.slice(0,Math.min(Number(limit),items.length)));
  }
  function record(id:string, selected:number[]) {
    const question=quiz.find(q=>q.id===id);
    if(!question)return;
    let updated={...history,[id]:matchesAnswer(selected,question.correct)};
    try {
      if(storage && loaded===storage) {
        const raw = localStorage.getItem(storage);
        if(raw) updated = {...JSON.parse(raw), [id]:updated[id]};
        localStorage.setItem(storage,JSON.stringify(updated));
      }
    } catch {}
    setHistory(updated);
  }
  const [music,setMusic] = useState(false);
  const [round,setRound] = useState(0);
  const [answers,setAnswers] = useState<number[][] | null>(null);
  const [errorsOnly,setErrorsOnly] = useState<EventQuizQuestion[] | null>(null);
  const quiz = errorsOnly ?? [];
  const takingQuiz = quiz.length > 0 && !answers;
  useEffect(() => {
    if (!takingQuiz) return;
    const focus = useTutorFocus.getState();
    focus.setBase({view: 'quiz', step: title});
    return () => { focus.setBase({}); focus.setOpen(false); };
  }, [takingQuiz,title]);
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
      <div className={styles.actions}><button className="f-button" onClick={()=>restart(null)}>К настройкам</button>
      {!!missed.length && <button className="f-button" onClick={()=>restart(missed)}>Повторить ошибки · {missed.length}</button>}</div></section>
    : quiz.length > 0 ? <EventQuiz key={round} eventId="computer-networks-final" step={{title:{ru:title,en:title}}} quiz={quiz} lang="ru" music={music} onMusic={()=>setMusic(v=>!v)} onFinish={setAnswers} onAnswer={record} reviewDuringQuiz={false} onExit={()=>restart(null)} explainOptionsOpen/> : <section className={setup.panel}>
      <h2>Настроить квиз</h2><p>Верно с последней попытки: {bank.filter(q=>history[q.id]===true).length} из {bank.length}</p>
      <div className={setup.fields}>
        <label>Какие вопросы<select value={scope} onChange={e=>setScope(e.target.value)}><option value="all">Весь банк</option><option value="new">Ещё не отвеченные</option><option value="errors">Мои ошибки</option></select></label>
        <label>Количество вопросов<input type="number" min="1" max={pool.length || 1} value={limit && Math.min(Number(limit),pool.length)} onChange={e=>setLimit(e.target.value)}/></label>
        <label>Порядок<select value={order} onChange={e=>setOrder(e.target.value)}><option value="original">По порядку</option><option value="random">Случайный</option></select></label>
      </div>
      <div className={styles.actions}><button className="f-button" disabled={!pool.length} onClick={()=>setLimit(String(pool.length))}>Все {pool.length}</button>
      <button className="f-button" disabled={!pool.length || !Number.isInteger(Number(limit)) || Number(limit)<1 || status==="loading" || loaded!==storage} onClick={start}>Начать квиз</button></div>
      {!pool.length && <p>В этой подборке пока нет вопросов. Выбери весь банк.</p>}
    </section>}
    {takingQuiz && session?.user?.id && <Tutor event={{id:'computer-networks-final'}} userId={session.user.id} showLauncher={false}/>}
    {!quiz.length && !!reference.length && <details><summary>Задания для самостоятельного разбора · {reference.length}</summary>{reference.map(q=><article key={q.id}><h3>{q.q}</h3><ul>{q.options.map((o,i)=><li key={i}>{o}</li>)}</ul><p>{q.caution}</p><p>{q.why.ru}</p></article>)}</details>}
  </section>;
}
