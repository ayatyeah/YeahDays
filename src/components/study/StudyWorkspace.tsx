'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AppBrand from '@/components/mono/AppBrand';
import { useLocaleStore } from '@/i18n/locale';
import type { StudySnapshot } from '@/lib/studyWorkspace';
import './workspace.css';

const copy = {
 en: { title:'Make room for learning.', intro:'A small plan. A focused session. A clearer next step.', plan:'Study plan', materials:'Materials', events:'Events', eventsDescription:'Choose a course to see its exam preparation, lecture notes and practice events.', begin:'Start my study plan', welcome:'Build a steady study rhythm', description:'Four weeks, three practical tasks each week. Work on your own course or exam preparation. Your progress is saved to your account.', week:'Week', points:'Study points', completed:'Tasks completed', route:'Your four-week journey', tasks:'This week’s steps', feedback:'Your study coach', fixed:'Standard guidance', ai:'AI feedback', consent:'Allow task IDs, completion events and timestamps to be sent to OpenAI for personalised feedback. My written work is not sent.', enable:'Enable AI feedback', refresh:'Get feedback', empty:'Complete a step or request guidance to see feedback here.', start:'Start task', finish:'Mark complete', done:'Completed', active:'In progress', locked:'Available in a later week', badges:'Milestones', badgesNames:['First step','First three','Finding a rhythm','Full journey'], reward:'10 points per completed task. Milestones recognise completion, not exam performance.', error:'Could not save or load this change. Please try again.', retry:'Retry', loading:'Loading your study plan…', login:'Sign in to save your study plan', closed:'Your four-week plan has ended. You can review your progress and continue with the course materials.', saving:'Saving…', titles:['Make a three-step plan','Five minutes of focus','Reflect and move forward'], instructions:['Choose a small study activity. On paper, write three steps and estimate the time for each. Mark this task complete once your plan is ready.','Choose one step from your plan. Close distracting tabs and work on it for five minutes using your timer. Then mark this task complete.','On paper, write what you achieved, one difficulty and your next step. Mark this task complete once all three are written.'] },
 ru: { title:'Найди время для учёбы.', intro:'Небольшой план. Фокус на деле. Понятный следующий шаг.', plan:'Учебный план', materials:'Материалы', events:'Ивенты', eventsDescription:'Выбери курс и открой его ивенты: подготовку к экзаменам, конспекты и тесты.', begin:'Начать учебный план', welcome:'Учись в своём ритме', description:'Четыре недели, три практических задания каждую неделю. Выбирай свой предмет или подготовку к экзамену. Прогресс сохраняется в аккаунте.', week:'Неделя', points:'Учебные очки', completed:'Завершено заданий', route:'Твой путь на четыре недели', tasks:'Шаги этой недели', feedback:'Помощник в учёбе', fixed:'Обычные подсказки', ai:'ИИ-обратная связь', consent:'Разрешаю отправлять OpenAI идентификаторы заданий, события выполнения и время для персональных подсказок. Мои записи не отправляются.', enable:'Включить ИИ-подсказки', refresh:'Получить подсказку', empty:'Заверши шаг или запроси подсказку — здесь появится обратная связь.', start:'Начать задание', finish:'Завершить', done:'Готово', active:'В процессе', locked:'Откроется на следующей неделе', badges:'Достижения', badgesNames:['Первый шаг','Первая тройка','В своём ритме','Весь путь'], reward:'10 очков за задание. Достижения отмечают выполнение, а не знания или оценку на экзамене.', error:'Не удалось сохранить или загрузить изменения. Попробуй ещё раз.', retry:'Повторить', loading:'Загружаем учебный план…', login:'Войди, чтобы сохранить учебный план', closed:'Четыре недели завершились. Можно посмотреть прогресс и продолжить учёбу в материалах.', saving:'Сохраняем…', titles:['План из трёх шагов','Пять минут внимания','Короткое подведение итогов'], instructions:['Выбери небольшое учебное дело. На бумаге составь три последовательных шага и оцени длительность каждого. Заверши задание, когда план готов.','Выбери один пункт плана. Убери отвлекающие вкладки и занимайся им пять минут по своему таймеру. Затем заверши задание.','На бумаге запиши, что получилось, одно затруднение и следующий шаг. Заверши задание, когда все три пункта записаны.'] },
};
export default function StudyWorkspace() {
 const {data:session}=useSession();
 return <StudyWorkspaceContent key={session?.user?.id ?? "guest"}/>;
}
function StudyWorkspaceContent() {
 const locale = useLocaleStore(s=>s.locale); const c = copy[locale === 'ru' ? 'ru' : 'en'];
 const {data:session,status} = useSession(); const owner=session?.user?.id;
 const [study,setStudy]=useState<StudySnapshot|null>(null); const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false); const [error,setError]=useState(false); const [aiError,setAiError]=useState(false); const [reload,setReload]=useState(0);
 const [week,setWeek]=useState(1); const [consent,setConsent]=useState(false);
 useEffect(()=>{let live=true; const controller=new AbortController();
  fetch('/api/study-workspace',{signal:controller.signal,cache:'no-store'}).then(async r=>{if(!r.ok)throw Error();return r.json();}).then(v=>{if(live){setStudy(v.study);setWeek(Math.min(4,Math.max(1,v.study?.week??1)));setError(false);}}).catch(()=>{if(live)setError(true);}).finally(()=>{if(live)setLoading(false);});
  return()=>{live=false;controller.abort();};
 },[owner,reload]);
 async function act(action:string, extra:Record<string,unknown>={}) {
  setBusy(true);setError(false);setAiError(false);
  try {const send=async(a:string)=>{const r=await fetch('/api/study-workspace',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:a,locale:locale==='ru'?'ru':'en',...extra})}); const v=await r.json();if(!r.ok){if(v.error==='ai_unavailable')setAiError(true);throw Error();}setStudy(v.study);};
   await send(action); if(action==='complete') await send('feedback');
  }catch{setError(true);}finally{setBusy(false);}
 }
 const completed=study?.tasks.filter(t=>t.completed).length??0;
 return <div className="study-workspace" lang={locale==='ru'?'ru':'en'}>
  <AppBrand/><header className="sw-heading"><span className="sw-eyebrow">STUDY / YEAHGRIND</span><h1>{c.title}</h1><p>{c.intro}</p></header>
  <nav className="sw-tabs" aria-label="Study"><span aria-current="page">{c.plan}</span><Link href="/learn?view=courses">{c.materials} ↗</Link><Link href="/events">{c.events}</Link></nav>
  <Link href="/events" className="sw-card sw-events" aria-labelledby="study-events-title">
   <div><h2 id="study-events-title">{c.events}</h2><p>{c.eventsDescription}</p></div>
   <span className="sw-events-arrow" aria-hidden="true">→</span>
  </Link>
  {status==='unauthenticated'?<Link className="sw-primary" href="/login">{c.login}</Link>:loading||status==='loading'?<p role="status">{c.loading}</p>:<>
  {error&&<div className="sw-error" role="alert">{aiError ? (locale==='ru' ? 'ИИ-подсказки сейчас недоступны. Можно продолжить задания или выбрать обычные подсказки.' : 'AI feedback is currently unavailable. Continue your tasks or select standard guidance.') : c.error} <button onClick={()=>aiError?act('feedback'):setReload(n=>n+1)}>{c.retry}</button></div>}
  {!study?<section className="sw-card sw-welcome"><h2>{c.welcome}</h2><p>{c.description}</p><button className="sw-primary" disabled={busy} onClick={()=>act('begin')}>{busy?c.saving:c.begin} →</button></section>:<>
  <section className="sw-stats" aria-label={c.route}><div><strong>{study.points}<small> XP</small></strong><span>{c.points}</span></div><div><strong>{completed}<small> / 12</small></strong><span>{c.completed}</span></div><div><strong>{Math.min(4,study.week)}<small> / 4</small></strong><span>{c.week}</span></div></section>
  <section className="sw-card sw-route"><div className="sw-section-title"><h2>{c.route}</h2><span>{completed} / 12</span></div><progress value={completed} max={12}/><div className="sw-weeks">{[1,2,3,4].map(w=><button key={w} aria-pressed={week===w} onClick={()=>setWeek(w)}>{c.week} {w}<small>{study.tasks.filter(t=>t.week===w&&t.completed).length}/3 {w>study.week?' · 🔒':''}</small></button>)}</div></section>
  {study.week>4&&<p className="sw-notice">{c.closed}</p>}
  <div className="sw-columns"><section className="sw-card"><div className="sw-section-title"><h2>{c.tasks}</h2><span>{c.week} {week}</span></div><div className="sw-task-list">{study.tasks.filter(t=>t.week===week).map((t,i)=><article className={`sw-task ${t.completed?'is-done':''}`} key={t.id}><span className="sw-step">{t.completed?'✓':String(i+1).padStart(2,'0')}</span><div><div className="sw-task-title"><h3>{c.titles[i]}</h3><span>+10 XP</span></div><p>{c.instructions[i]}</p>{t.completed?<span className="sw-status">✓ {c.done}</span>:week>study.week?<span>{c.locked}</span>:study.week<=4?<button className={t.startedAt?'sw-primary':'sw-secondary'} disabled={busy} onClick={()=>act(t.startedAt?'complete':'start',{taskId:t.id})}>{busy?c.saving:t.startedAt?c.finish:c.start} →</button>:null}{t.startedAt&&!t.completed&&<small className="sw-active">{c.active}</small>}</div></article>)}</div></section>
  <aside className="sw-side"><section className="sw-card sw-coach"><span className="sw-eyebrow">✦ YEAHGRIND</span><h2>{c.feedback}</h2><p className="sw-fine">{locale==='ru' ? 'Персонализируются только подсказки. Задания и награды одинаковые в обоих режимах.' : 'Only the feedback is personalised. Tasks and rewards are the same in both modes.'}</p><div className="sw-modes"><button aria-pressed={study.mode==='fixed'} disabled={busy} onClick={()=>act('mode',{mode:'fixed'})}>{c.fixed}</button><button aria-pressed={study.mode==='ai'} disabled={busy||study.mode==='ai'} onClick={()=>setConsent(!consent)}>{c.ai}</button></div>{consent&&study.mode!=='ai'&&<div className="sw-consent"><p>{c.consent}</p><button disabled={busy} onClick={()=>act('mode',{mode:'ai',consent:true})}>{c.enable}</button></div>}<p className="sw-feedback" aria-live="polite">{study.feedbackLocale===(locale==='ru'?'ru':'en')&&study.feedback?study.feedback:c.empty}</p><button className="sw-secondary" disabled={busy} onClick={()=>act('feedback')}>{c.refresh} ↗</button></section>
  <section className="sw-card"><h2>{c.badges}</h2><div className="sw-badges">{[1,3,6,12].map((n,i)=><div key={n} className={completed>=n?'earned':''}><span>{completed>=n?'✦':'◇'}</span><strong>{c.badgesNames[i]}</strong><small>{Math.min(completed,n)} / {n}</small></div>)}</div><p className="sw-fine">{c.reward}</p></section></aside></div>
  </>}
  </>}
 </div>;
}
