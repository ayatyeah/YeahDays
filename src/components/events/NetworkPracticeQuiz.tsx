'use client';
import {useEffect,useRef,useState} from 'react';
import {emptyProgress,mergeNetwork,type NetworkProgress,type Attempt} from '@/lib/events/networkFinal/progress';
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

type Props={group:string;title:string;questions:EventQuizQuestion[]};
export default function NetworkPracticeQuiz(props:Props) {
  const {data}=useSession();
  return <AccountQuiz key={data?.user?.id??'guest'} {...props}/>;
}
function AccountQuiz({group,title,questions}:Props) {
  const {data:session,status} = useSession();
  const storage = session?.user?.id ? 'yg-cn-bank:'+session.user.id+':'+title : null;
  const bank = questions.filter(q=>q.correct.length);
  const [limit,setLimit] = useState(String(Math.min(10,bank.length)));
  const [order,setOrder] = useState('original');
  const [scope,setScope] = useState('all');
  const owner=session?.user?.id;
  const cache=owner?'yg-cn-bank:'+owner+':snapshot:'+group:null;
  const url='/api/network-progress/'+group;
  const current=useRef<NetworkProgress>(emptyProgress);
  const [snapshot,setSnapshot]=useState(emptyProgress);
  const [loaded,setLoaded]=useState<string|null>(null);
  const [saveStatus,setSaveStatus]=useState('');
  const version=useRef(0);
  const reload=useRef<()=>void>(()=>{});
  function display(value:NetworkProgress){
    current.current=value;
    setSnapshot(value);
  }
  async function sync(value:NetworkProgress, user:string){
    const ticket=++version.current;
    setSaveStatus('Сохранение…');
    try{
      const r=await fetch(url,{method:'PUT',headers:{'Content-Type':'application/json','x-progress-owner':user},body:JSON.stringify(value),keepalive:true});
      if(!r.ok)throw Error();
      if(version.current===ticket)setSaveStatus('Сохранено в аккаунте');
    }catch{if(version.current===ticket)setSaveStatus('Нет синхронизации. Повторите сохранение.');}
  }
  useEffect(()=>{
    let active=true;
    if(!owner||!cache||!storage)return;
    const user=owner, localKey=cache;
    let local=emptyProgress;
    try{
      const raw=localStorage.getItem(localKey);
      if(raw)local=JSON.parse(raw);
      else {
        const legacy=JSON.parse(localStorage.getItem(storage)||'{}');
        local={...emptyProgress,history:Object.fromEntries(Object.entries(legacy).filter((entry):entry is [string,boolean]=>typeof entry[1]==='boolean' && questions.some(q=>q.id===entry[0] && q.correct.length)).map(([id,ok])=>[id,{ok,time:1}]))};
      }
    }catch{}
    display(local);setLoaded(null);
    async function load(){
      try{
        const r=await fetch(url,{headers:{'x-progress-owner':user},cache:'no-store',signal:AbortSignal.timeout(8000)});
        if(!r.ok)throw Error();
        const remote=await r.json();
        if(!active)return;
        const merged=mergeNetwork(remote,current.current);
        display(merged);
        try{localStorage.setItem(localKey,JSON.stringify(merged));}catch{}
        if(JSON.stringify(remote)!==JSON.stringify(merged))void sync(merged,user);
        else setSaveStatus('Сохранено в аккаунте');
      }catch{if(active)setSaveStatus('Нет синхронизации. Повторите сохранение.');}
      if(active)setLoaded(localKey);
    }
    reload.current=load;
    void load();
    function retry(){void load();}
    window.addEventListener('online',retry);
    return ()=>{active=false;version.current++;window.removeEventListener('online',retry);};
    // The authenticated owner and group define this snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[owner,cache,storage,url]);
  function persist(attempt:Attempt|null, updated?:{id:string;ok:boolean}){
    if(!owner||!cache||loaded!==cache)return;
    let prev=current.current;
    try{const raw=localStorage.getItem(cache);if(raw)prev=mergeNetwork(prev,JSON.parse(raw));}catch{}
    const time=Math.max(Date.now(),prev.time+1);
    const next={time,attempt,history:updated?{...prev.history,[updated.id]:{time,ok:updated.ok}}:prev.history};
    display(next);
    try{localStorage.setItem(cache,JSON.stringify(next));}catch{}
    void sync(next,owner);
  }
  const history=Object.fromEntries(Object.entries(snapshot.history).map(([id,x])=>[id,x.ok]));
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
    const a=current.current.attempt;
    if(!a)return;
    const index=a.ids.indexOf(id);
    if(index<0)return;
    const picks=[...a.answers];picks[index]=selected;
    persist({...a,index,answers:picks},{id,ok:matchesAnswer(selected,question.correct)});
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
    persist(pool?{ids:pool.map(q=>q.id),index:0,answers:[],done:false}:null);
    setErrorsOnly(pool);
    setAnswers(null);
    setRound(n => n+1);
  }
  return <section className={styles.quiz} data-no-i18n>
    <Link href={home}>← Практика Computer Networks</Link><h1>{title}</h1>
    <label>Освоено вопросов: {bank.filter(q=>history[q.id]).length} из {bank.length}
      <progress style={{display:'block',width:'100%',height:12,accentColor:'var(--g-accent)'}} max={bank.length||1} value={bank.filter(q=>history[q.id]).length}/>
    </label>
    <small role="status">{saveStatus} {saveStatus.startsWith('Нет') && owner && <button onClick={()=>reload.current()}>Повторить</button>}</small>
    {answers ? <section aria-live="polite"><h2>Результат: {quiz.length-missed.length} из {quiz.length}</h2>
      <div className={styles.actions}><button className="f-button" onClick={()=>restart(null)}>К настройкам</button>
      {!!missed.length && <button className="f-button" onClick={()=>restart(missed)}>Повторить ошибки · {missed.length}</button>}</div></section>
    : quiz.length > 0 ? <EventQuiz key={round} eventId="computer-networks-final" step={{title:{ru:title,en:title}}} quiz={quiz} lang="ru" music={music} onMusic={()=>setMusic(v=>!v)} resume={snapshot.attempt??undefined} onNavigate={index=>{const a=current.current.attempt;if(a)persist({...a,index});}} onFinish={values=>{setAnswers(values);const a=current.current.attempt;if(a)persist({...a,answers:values,done:true});}} onAnswer={record} reviewDuringQuiz={false} onExit={()=>setErrorsOnly(null)} explainOptionsOpen/> : <section className={setup.panel}>
      {snapshot.attempt && loaded===cache && <button className="f-button" onClick={()=>{
        const a=snapshot.attempt!;
        const pool=a.ids.map(id=>bank.find(q=>q.id===id)).filter((q):q is EventQuizQuestion=>!!q);
        if(pool.length!==a.ids.length)return;
        setErrorsOnly(pool);setAnswers(a.done?a.answers:null);setRound(n=>n+1);
      }}>{snapshot.attempt.done?'Открыть результат':`Продолжить · вопрос ${snapshot.attempt.index+1} из ${snapshot.attempt.ids.length}`}</button>}
      <h2>Настроить квиз</h2><p>Верно с последней попытки: {bank.filter(q=>history[q.id]===true).length} из {bank.length}</p>
      <div className={setup.fields}>
        <label>Какие вопросы<select value={scope} onChange={e=>setScope(e.target.value)}><option value="all">Весь банк</option><option value="new">Ещё не отвеченные</option><option value="errors">Мои ошибки</option></select></label>
        <label>Количество вопросов<input type="number" min="1" max={pool.length || 1} value={limit && Math.min(Number(limit),pool.length)} onChange={e=>setLimit(e.target.value)}/></label>
        <label>Порядок<select value={order} onChange={e=>setOrder(e.target.value)}><option value="original">По порядку</option><option value="random">Случайный</option></select></label>
      </div>
      <div className={styles.actions}><button className="f-button" disabled={!pool.length} onClick={()=>setLimit(String(pool.length))}>Все {pool.length}</button>
      <button className="f-button" disabled={!pool.length || !Number.isInteger(Number(limit)) || Number(limit)<1 || status==="loading" || !owner || loaded!==cache} onClick={start}>{snapshot.attempt?"Начать новую попытку":"Начать квиз"}</button></div>
      {!pool.length && <p>В этой подборке пока нет вопросов. Выбери весь банк.</p>}
    </section>}
    {takingQuiz && session?.user?.id && <Tutor event={{id:'computer-networks-final'}} userId={session.user.id} showLauncher={false}/>}
    {!quiz.length && !!reference.length && <details><summary>Задания для самостоятельного разбора · {reference.length}</summary>{reference.map(q=><article key={q.id}><h3>{q.q}</h3><ul>{q.options.map((o,i)=><li key={i}>{o}</li>)}</ul><p>{q.caution}</p><p>{q.why.ru}</p></article>)}</details>}
  </section>;
}
