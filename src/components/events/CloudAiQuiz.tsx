"use client";
import {useEffect,useRef,useState} from 'react';
import {useSession} from 'next-auth/react';
import Link from 'next/link';
import {questions,sources,sourceKinds,topics,difficulties,defaultFilters,filterBank,makeAttempt,quizQuestion,optionCounts,type AiQuestion,type Filters} from '@/lib/events/cloudAi/bank';
import {parseAwsAnswers,type AwsAnswers} from '@/lib/events/awsCloudDeveloping/progress';
import {matchesAnswer} from '@/lib/events/quizAnswers';
import EventQuiz from './EventQuiz';
import {QuestionLanguage,QuestionText} from './QuestionLanguage';
import styles from './aws-practice.module.css';
import local from './cloud-ai.module.css';
export default function CloudAiQuiz(){
 const {data:session,status}=useSession();
 if(status==='loading')return <p role="status">Открываем банк вопросов…</p>;
 if(!session?.user?.id)return <section className={styles.panel}><h2>ИИ-вопросы по материалам курса</h2><p>Войди, чтобы проходить тесты и сохранять ошибки.</p><Link href="/login?callbackUrl=%2Fevents%2Fcloud-computing-final%23ai-questions">Войти</Link></section>;
 return <Quiz key={session.user.id} userId={session.user.id}/>;
}
function Quiz({userId}:{userId:string}){
 const [filters,setFilters]=useState<Filters>(defaultFilters);
 const [filtersOpen,setFiltersOpen]=useState(false);
 const [count,setCount]=useState('all');
 const [random,setRandom]=useState(true);
 const [queue,setQueue]=useState<AiQuestion[]>([]);
 const [result,setResult]=useState<number[][]|null>(null);
 const [run,setRun]=useState(0);
 const [music,setMusic]=useState(false);
 const [browse,setBrowse]=useState(false);
  const [saved, setSaved] = useState<AwsAnswers>({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const frame = useRef<HTMLElement>(null);
  const pending = useRef<AwsAnswers>({});
  const storage = useRef<Storage | null>(null);
  const key = `cloud-ai-quiz:v1:${userId}`;
  const screen = result ? 'result' : queue.length ? 'quiz' : 'settings';

  useEffect(() => {
    try { storage.current = window.localStorage; setSaved(parseAwsAnswers(storage.current.getItem(key), optionCounts)); }
    catch { setError(true); }
    setReady(true);
    function sync(event: StorageEvent) {
      if (event.storageArea === storage.current && (event.key === key || event.key === null)) {
        setSaved({ ...parseAwsAnswers(event.newValue, optionCounts), ...pending.current });
      }
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [key]);

  useEffect(() => {
    if (!run) return;
    frame.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    frame.current?.querySelector<HTMLHeadingElement>('h2, h3')?.focus({ preventScroll: true });
  }, [run, screen]);

  const pool = filterBank(filters, saved);
  const requested = count === 'all' ? pool.length : Number(count);
  const size = Number.isFinite(requested) && requested >= 1 ? Math.min(Math.floor(requested), pool.length) : 0;
  const mistakes = queue.filter((question, index) => !matchesAnswer(result?.[index], [question.answer]));
  const answered = pool.filter(question => saved[question.id]).length;
  const correct = pool.filter(question => matchesAnswer(saved[question.id], [question.answer])).length;

  function start(items = makeAttempt(pool, size, random)) {
    if (!items.length || !ready) return;
    setQueue(items);
    setFiltersOpen(false);
    setResult(null);
    setRun(value => value + 1);
  }
  function settings() { setQueue([]); setResult(null); setFiltersOpen(false); }
  function save(id: string, value: number[]) {
    pending.current = { ...pending.current, [id]: value };
    setSaved(previous => ({ ...previous, [id]: value }));
    try {
      storage.current = window.localStorage;
      const merged = { ...parseAwsAnswers(storage.current.getItem(key), optionCounts), ...pending.current };
      storage.current.setItem(key, JSON.stringify(merged));
      pending.current = {};
      setSaved(merged);
      setError(false);
    } catch { setError(true); }
  }
  const notice = error && <p role="alert">Хранилище ответов недоступно. Можно продолжить тест, но после закрытия несохранённые ответы могут потеряться.</p>;

 function update(name:keyof Filters,value:string){setFilters(previous=>({...previous,[name]:value,...(name==='kind'?{source:'all'}:{})}));setCount('all');}
 if(screen==='quiz')return <section ref={frame} className={local.quiz} data-no-i18n>{notice}<EventQuiz key={run} eventId="cloud-computing-final" step={{title:{ru:'ИИ-вопросы по материалам',en:'AI practice · course materials'}}} quiz={queue.map(quizQuestion)} lang="ru" music={music} onMusic={()=>setMusic(v=>!v)} onAnswer={save} onExit={settings} onFinish={setResult} explainOptionsOpen/></section>;
 if(screen==='result')return <section ref={frame} className={styles.panel} data-no-i18n>{notice}<h2 tabIndex={-1}>Верно: {queue.length-mistakes.length} из {queue.length}</h2><div className={styles.actions}><button onClick={()=>start(queue)}>Повторить</button>{mistakes.length>0&&<button onClick={()=>start(mistakes)}>Только ошибки · {mistakes.length}</button>}<button onClick={settings}>К фильтрам и банку</button></div>{mistakes.map(q=><details key={q.id}><summary>{q.prompt}</summary><p>{q.explanationRu}</p><a href={sources.find(s=>s.id===q.sourceId)?.url} target="_blank" rel="noreferrer">Материал по теме ↗</a></details>)}</section>;
 return <section ref={frame} className={styles.panel} data-no-i18n aria-label="ИИ-вопросы по материалам">
 <h2 tabIndex={-1}>Общий банк · {questions.length} новых вопросов</h2>
 <p>Авторская тренировка по лекциям LMS, лабораторным и двум курсам AWS. Это не вопросы преподавателя и не прогноз точного варианта экзамена. Оригинальные 220 Knowledge Checks находятся отдельно.</p>
 <p>Вопросы — English / Русский, объяснения — на русском. У каждого вопроса указан источник и страница или слайд.</p>{notice}
 <p aria-live="polite">В подборке {pool.length} · В тесте {size} · {random?'Случайный порядок':'По порядку'} · Отвечено {answered}, верно {correct}</p>
 <div className={styles.primaryActions}><button className={styles.filterToggle} aria-expanded={filtersOpen} aria-controls="cloud-ai-filters" onClick={()=>setFiltersOpen(v=>!v)}>Фильтр <span aria-hidden>{filtersOpen?'−':'+'}</span></button><button className={styles.startButton} disabled={!ready||!size} onClick={()=>start()}>Начать тест · {size}</button></div>
 <div id="cloud-ai-filters" className={styles.filtersPanel} hidden={!filtersOpen}><div className={styles.fields}>
 <label>Источник<select value={filters.kind} onChange={e=>update('kind',e.target.value)}><option value="all">Все материалы</option>{Object.entries(sourceKinds).map(([id,title])=><option key={id} value={id}>{title}</option>)}</select></label>
 <label>Лекция / задание / модуль<select value={filters.source} onChange={e=>update('source',e.target.value)}><option value="all">Все</option>{sources.filter(s=>filters.kind==='all'||s.kind===filters.kind).map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
 <label>Тема<select value={filters.topic} onChange={e=>update('topic',e.target.value)}><option value="all">Все темы</option>{Object.entries(topics).map(([id,title])=><option key={id} value={id}>{title}</option>)}</select></label>
 <label>Сложность<select value={filters.difficulty} onChange={e=>update('difficulty',e.target.value)}><option value="all">Все уровни</option>{Object.entries(difficulties).map(([id,title])=><option key={id} value={id}>{title}</option>)}</select></label>
 <label>Какие вопросы<select value={filters.status} onChange={e=>update('status',e.target.value)}><option value="all">Все</option><option value="unanswered">Ещё не отвеченные</option><option value="errors">Мои ошибки</option></select></label>
 <label>Количество<input type="number" min={1} max={Math.max(1,pool.length)} step={1} value={count==='all'?pool.length:count} onChange={e=>setCount(e.target.value)}/></label>
 <label>Порядок<select value={random?'random':'original'} onChange={e=>setRandom(e.target.value==='random')}><option value="random">Случайный</option><option value="original">По порядку</option></select></label>
 <label>Поиск<input type="search" value={filters.search} onChange={e=>update('search',e.target.value)} placeholder="Например: S3, Docker, Azure"/></label>
 </div><button onClick={()=>{setFilters(defaultFilters);setCount('all');}}>Сбросить фильтры · все вопросы</button></div>
 {!pool.length&&<p role="status">Нет вопросов с такими фильтрами. Измени подборку.</p>}
 <details className={local.bank} onToggle={e=>setBrowse(e.currentTarget.open)}><summary>Посмотреть банк и разборы · {pool.length}</summary>{browse&&<QuestionLanguage>{pool.map(q=><details key={q.id}><summary><QuestionText>{q.prompt}</QuestionText></summary><ol>{q.options.map((o,i)=><li key={i}><strong>{q.answer===i?'✓ ':''}<QuestionText>{o}</QuestionText></strong><p>{q.optionExplanationsRu[i]}</p></li>)}</ol><p>{q.explanationRu}</p><a href={sources.find(s=>s.id===q.sourceId)?.url} target="_blank" rel="noreferrer">{sources.find(s=>s.id===q.sourceId)?.title} · стр./слайд {q.evidence.map(e=>e.page).join(', ')} ↗</a></details>)}</QuestionLanguage>}</details>
 <details><summary>Какие материалы использованы</summary><p>Локальные копии лекций сверены со списком LMS. Задания скачаны из курса; полные страницы Student Guide прочитаны через AWS Academy. Личные данные и оценки в банк не включены.</p><ul>{sources.map(s=><li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> — {s.coverage}</li>)}</ul></details>
 </section>;
}
