import ReadingLanguage, {readingLanguage} from '@/components/events/ReadingLanguage';
import {readingEnglish} from '@/lib/events/networkFinal/readingEnglish';
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
  const lang=await readingLanguage();
  const en=lang==="en";
  const local=topics.map(t=>{const [title,terms,scenario,explanation,question,answer]=readingEnglish[t.id-1];return {...(en?{...t,title,scenario,explanation,question,answer}:t),terms};});
  return <article className={styles.outline} lang={lang} data-no-i18n>
    <Link className={styles.back} href={base+'/'+section}>← {lecturePage?(en?'Lectures':'Лекции'):(en?'Module theory':'Теория по модулям')}</Link>
    <ReadingLanguage lang={lang}/>
    <h1>{lecturePage?lecture.title[lang]:`${en?'Module':'Модуль'} ${n}. ${local[0].title}`}</h1>
    {local.map(t=><section key={t.id}><h2>{t.scenario}</h2><p>{t.explanation}</p>{!en && <p><strong>Термины для экзамена. </strong>{t.terms}</p>}</section>)}
    {parts.length>1 && <nav aria-label={en?"Topics":"Темы"}><ol>{parts.map(p=><li key={p.id}><a href={'#'+p.id}>{p.title[lang]}</a></li>)}</ol></nav>}
    {parts.map(p=><section key={p.id} id={p.id} className={styles.reading}><h2>{p.title[lang]}</h2><EventNotes text={p.notes[lang]} lang={lang}/></section>)}
    {!lecturePage && n===17 && !en && <section><h2>От схемы до рабочего сервиса</h2>{[labs[2],labs[4],labs[7]].map(l=><section key={l.week}><h3>{l.task}</h3><p>{l.answer}</p></section>)}</section>}
    {!lecturePage && n===17 && en && <section><h2>From topology to a working service</h2><h3>A client has a link but no IP address</h3><p>Check DHCP. Verify the assigned address, mask, default gateway and DNS server, then test the gateway before opening the website.</p><h3>Divide a /24 into four equal subnets</h3><p>Borrow two bits to obtain four /26 networks. Each block contains 64 addresses and supports 62 hosts. Check the interfaces, routes and return path before testing between LANs.</p><h3>Verify management access</h3><p>Resolve the device name, test IP reachability, then connect with SSH. Save the configuration and verify that it survives a restart.</p></section>}
    <section><h2>{en?'Check your understanding':'Проверь понимание'}</h2>{local.map(t=><div key={t.id}><p>{t.question}</p><details><summary>{en?'Show answer':'Показать ответ'}</summary>{t.answer}</details><Link className={styles.back} href={base+'/practice/module-'+String(t.id).padStart(2,'0')}>{en?'Module quiz':'Квиз по модулю'} {t.id} →</Link></div>)}</section>
    <section><h2>{en?'Course material':'Материал курса'}</h2>{source?<p><a href={source.url}>{en?'Open in LMS':'Открыть в LMS'}</a> · <a download href={`/events/network-final/${source.id}.${source.title.split('.').pop()}`}>{en?'Download':'Скачать'} {source.title}</a></p>:<a href={`/events/network-final/reading-${n}.txt`}>{en?'Cisco module text (English)':'Текст модуля Cisco на английском'}</a>}</section>
  </article>;
}
