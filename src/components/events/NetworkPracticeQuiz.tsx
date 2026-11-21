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
import courseStyles from '@/app/events/courses.module.css';
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
  const grind=group==="grind" || group==="grind-full";
  const [lang,setLang]=useState<'ru'|'en'>('ru');
  const en=grind && lang==='en';
  const bank = questions.filter(q=>q.correct.length);
  const [limit,setLimit] = useState(String((grind || ["compact","complete","midterm-paper","midterm-related","endterm-paper","endterm-related"].includes(group) || group.startsWith("sprint-"))?bank.length:Math.min(10,bank.length)));
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
      const r=await fetch(url,{method:'PUT',headers:{'Content-Type':'application/json','x-progress-owner':user},body:JSON.stringify(value),keepalive:JSON.stringify(value).length<30000});
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
  const term=group.startsWith('midterm-')?'midterm':group.startsWith('endterm-')?'endterm':null;
  const [source,setSource]=useState('all');
  const [kind,number]=source.split('-');
  const related=group.endsWith('-related');
  const inSource=(q:EventQuizQuestion)=>{
    if(source==='all')return true;
    if(kind==='only')return q.source?.kind===number;
    if(related && q.source?.kind!==kind)return false;
    return q.source?.[kind as 'lecture'|'module'|'variant']===Number(number);
  };
  const sourcePool=bank.filter(inSource);
  function numbersFor(kind:'module'|'lecture'){
    const numbers=questions.flatMap(q=>{
      const value=q.source?.[kind];
      return value && (!related || q.source?.kind===kind)?[value]:[];
    });
    return [...new Set(numbers)].sort((a,b)=>a-b);
  }
  const moduleNumbers=numbersFor('module');
  const lectureNumbers=numbersFor('lecture');
  const pool = sourcePool.filter(q=>scope==='all' || (scope==='new' ? history[q.id]===undefined : history[q.id]===false));
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
  const reference = questions.filter(q => !q.correct.length && inSource(q));
  const missed = quiz.filter((q,i) => !matchesAnswer(answers?.[i],q.correct));
  function restart(pool: EventQuizQuestion[] | null) {
    persist(pool?{ids:pool.map(q=>q.id),index:0,answers:[],done:false}:null);
    setErrorsOnly(pool);
    setAnswers(null);
    setRound(n => n+1);
  }
  return <section className={styles.quiz} data-no-i18n>
    <Link href={term?'/events/courses/computer-networks/'+term:home}>{term?(term==='midterm'?'← Мидтерм':'← Эндтерм'):en?'← Computer Networks practice':'← Практика Computer Networks'}</Link><h1>{en?'GRIND MODE':title}</h1>
    {grind && <div className={courseStyles.readingLanguage} role="group" aria-label="Study language">{(['ru','en'] as const).map(code=><button key={code} aria-pressed={lang===code} onClick={()=>setLang(code)}>{code==='ru'?'Русский':'English'}</button>)}</div>}
    {grind && !takingQuiz && !answers && <p>{en?'Read a short rule, then apply it to questions on the same topic.':'Прочитай короткое правило, затем закрепи его на вопросах по той же теме.'} {group==='grind'?(en?'Budget about 1 hour for the notes, 2½–3 hours for practice, and 30–60 minutes for mistakes and breaks.':'Около часа на разборы, 2,5–3 часа на вопросы и 30–60 минут на ошибки и перерывы.'):(en?'Allow 12–18 hours for all questions.':'Ориентир на все задания — 12–18 часов.')}</p>}
    <label>{en?'Mastered':'Освоено вопросов'} · {bank.filter(q=>history[q.id]).length} / {bank.length}
      <progress className={courseStyles.meter} max={bank.length||1} value={bank.filter(q=>history[q.id]).length}/>
    </label>
    <small role="status">{en?({'Сохранение…':'Saving…','Сохранено в аккаунте':'Saved to account','Нет синхронизации. Повторите сохранение.':'Sync failed. Try again.'}[saveStatus]??''):saveStatus} {saveStatus.startsWith('Нет') && owner && <button onClick={()=>reload.current()}>{en?'Retry':'Повторить'}</button>}</small>
    {answers ? <section aria-live="polite"><h2>{en?'Result':'Результат'} · {quiz.length-missed.length} / {quiz.length}</h2>
      <div className={styles.actions}><button className="f-button" onClick={()=>restart(null)}>{en?'Back to setup':'К настройкам'}</button>
      {!!missed.length && <button className="f-button" onClick={()=>restart(missed)}>{en?'Review mistakes':'Повторить ошибки'} · {missed.length}</button>}</div></section>
    : quiz.length > 0 ? <EventQuiz key={round} eventId="computer-networks-final" step={{title:{ru:title,en:grind?"GRIND MODE":title}}} quiz={quiz} lang={grind?lang:"ru"} lessons={grind} music={music} onMusic={()=>setMusic(v=>!v)} resume={snapshot.attempt??undefined} onNavigate={index=>{const a=current.current.attempt;if(a)persist({...a,index});}} onFinish={values=>{setAnswers(values);const a=current.current.attempt;if(a)persist({...a,answers:values,done:true});}} onAnswer={record} reviewDuringQuiz={false} onExit={()=>setErrorsOnly(null)} explainOptionsOpen/> : <section className={setup.panel}>
      {snapshot.attempt && loaded===cache && <button className="f-button" onClick={()=>{
        const a=snapshot.attempt!;
        const pool=a.ids.map(id=>bank.find(q=>q.id===id)).filter((q):q is EventQuizQuestion=>!!q);
        if(pool.length!==a.ids.length)return;
        setErrorsOnly(pool);setAnswers(a.done?a.answers:null);setRound(n=>n+1);
      }}>{snapshot.attempt.done?(en?'View result':'Открыть результат'):en?`Resume · question ${snapshot.attempt.index+1} of ${snapshot.attempt.ids.length}`:`Продолжить · вопрос ${snapshot.attempt.index+1} из ${snapshot.attempt.ids.length}`}</button>}
      {!grind && <><h2>Настроить квиз</h2><p>Верно с последней попытки: {bank.filter(q=>history[q.id]===true).length} из {bank.length}</p>
      <div className={setup.fields}>
        {term && <label>Банк вопросов<select value={source} onChange={e=>setSource(e.target.value)}><option value="all">Общий банк</option>{group.endsWith("-related") && <optgroup label="По источнику"><option value="only-module">Все вопросы модулей</option><option value="only-lecture">Все вопросы лекций</option></optgroup>}{group==="endterm-paper" && <optgroup label="По вариантам">{[1,2,3,4].map(n=><option key={n} value={"variant-"+n}>Вариант {n}</option>)}</optgroup>}<optgroup label="По модулям">{moduleNumbers.map(n=><option key={n} value={'module-'+n}>Модуль {n}</option>)}</optgroup><optgroup label="По лекциям">{lectureNumbers.map(n=><option key={n} value={'lecture-'+n}>Лекция {n}</option>)}</optgroup></select></label>}
        <label>Какие вопросы<select value={scope} onChange={e=>setScope(e.target.value)}><option value="all">Весь банк</option><option value="new">Ещё не отвеченные</option><option value="errors">Мои ошибки</option></select></label>
        <label>Количество вопросов<input type="number" min="1" max={pool.length || 1} value={limit && Math.min(Number(limit),pool.length)} onChange={e=>setLimit(e.target.value)}/></label>
        <label>Порядок<select value={order} onChange={e=>setOrder(e.target.value)}><option value="original">По порядку</option><option value="random">Случайный</option></select></label>
      </div>
      </>}
      <div className={styles.actions}>{!grind && <button className="f-button" disabled={!pool.length} onClick={()=>setLimit(String(pool.length))}>Все {pool.length}</button>}
      <button className="f-button" disabled={!pool.length || !Number.isInteger(Number(limit)) || Number(limit)<1 || status==="loading" || !owner || loaded!==cache} onClick={start}>{snapshot.attempt?(en?"Start again":"Начать новую попытку"):(en?"Start":grind?"Начать GRIND MODE":"Начать квиз")}</button></div>
      {!pool.length && <p>В этой подборке пока нет вопросов. Выбери весь банк.</p>}
    </section>}
    {takingQuiz && session?.user?.id && <Tutor event={{id:'computer-networks-final'}} userId={session.user.id} showLauncher={false}/>}
    {!quiz.length && !!reference.length && <details><summary>Задания для самостоятельного разбора · {reference.length}</summary>{reference.map(q=><article key={q.id}><h3>{q.q}</h3><ul>{q.options.map((o,i)=><li key={i}>{o}</li>)}</ul><p>{q.caution}</p><p>{q.why.ru}</p></article>)}</details>}
  </section>;
}
