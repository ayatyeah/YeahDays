import Link from 'next/link';
import {notFound} from 'next/navigation';
import EventNotes from '@/components/EventNotes';
import book from '@/lib/events/finals/computer-networks.json';
import {labs} from '@/lib/events/networkFinal/labs';
import {modules,lectureModules} from '@/lib/events/networkFinal/readings';
import styles from '../../../../courses.module.css';

export function generateStaticParams() {
  return [...book.event.lectures.map((_,i)=>({section:'lectures',unit:String(i+1)})),...modules.map(m=>({section:'theory',unit:String(m.id)}))];
}
export default async function Reading({params}:{params:Promise<{section:string;unit:string}>}) {
  const {section,unit}=await params;
  const n=Number(unit);
  const lecturePage=section==='lectures';
  if ((!lecturePage && section!=='theory') || String(n)!==unit || !Number.isInteger(n) || n<1 || n>(lecturePage?book.event.lectures.length:modules.length)) notFound();
  const lecture=book.event.lectures[n-1];
  const module=modules[n-1];
  const topics=lecturePage?lectureModules[n-1].map(id=>modules[id-1]):[module];
  const parts=lecturePage?lecture.parts:module.parts;
  const source=lecturePage?book.sources.find(s=>s.lectureId===lecture.id):undefined;
  const base='/events/courses/computer-networks';
  return <article className={styles.outline} lang="ru" data-no-i18n>
    <Link className={styles.back} href={base+'/'+section}>← {lecturePage?'Лекции':'Теория по модулям'}</Link>
    <h1>{lecturePage?lecture.title.ru:`Модуль ${n}. ${module.title}`}</h1>
    {topics.map(t=><section key={t.id}><h2>{t.scenario}</h2><p>{t.explanation}</p></section>)}
    {parts.length>1 && <nav aria-label="Темы"><ol>{parts.map(p=><li key={p.id}><a href={'#'+p.id}>{p.title.ru}</a></li>)}</ol></nav>}
    {parts.map(p=><section key={p.id} id={p.id} className={styles.reading}><h2>{p.title.ru}</h2><EventNotes text={p.notes.ru} lang="ru"/></section>)}
    {!lecturePage && n===17 && <section><h2>От схемы до рабочего сервиса</h2>{[labs[2],labs[4],labs[7]].map(l=><section key={l.week}><h3>{l.task}</h3><p>{l.answer}</p></section>)}</section>}
    <section><h2>Проверь понимание</h2>{topics.map(t=><div key={t.id}><p>{t.question}</p><details><summary>Показать ответ</summary>{t.answer}</details><Link className={styles.back} href={base+'/practice/module-'+String(t.id).padStart(2,'0')}>Квиз по модулю {t.id} →</Link></div>)}</section>
    <section><h2>Материал курса</h2>{source?<p><a href={source.url}>Открыть в LMS</a> · <a download href={`/events/network-final/${source.id}.${source.title.split('.').pop()}`}>Скачать {source.title}</a></p>:<a href={`/events/network-final/reading-${n}.txt`}>Текст модуля Cisco на английском</a>}</section>
  </article>;
}
