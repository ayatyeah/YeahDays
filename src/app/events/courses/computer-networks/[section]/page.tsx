import ReadingLanguage, {readingLanguage} from '@/components/events/ReadingLanguage';
import {readingEnglish} from '@/lib/events/networkFinal/readingEnglish';
import {auth} from '@/auth';
import {prisma} from '@/lib/db';
import Link from "next/link";
import { notFound } from "next/navigation";
import book from "@/lib/events/finals/computer-networks.json";
import { lectureModules, modules } from "@/lib/events/networkFinal/readings";
import { labs } from "@/lib/events/networkFinal/labs";
import { groups, questionsFor } from '@/lib/events/networkFinal/quizzes';
import styles from "../../../courses.module.css";

const sections = { midterm:"Мидтерм", endterm:"Эндтерм", practice: "Квизы по модулям", lectures: "Лекции", theory: "Теория" };
export function generateStaticParams() {
  return Object.keys(sections).map(section => ({ section }));
}

export default async function NetworkSection({ params }: { params: Promise<{section: string}> }) {
  const { section } = await params;
  if (!Object.hasOwn(sections, section)) notFound();
  if(section==="midterm"||section==="endterm") {
    const base="/events/courses/computer-networks";
    const mid=section==="midterm";
    const lectures=book.event.lectures.map((lecture,i)=>({lecture,i})).filter(({i})=>mid?(i<5 || i===6):i>=4);
    const ids=lectures.flatMap(({i})=>lectureModules[i]);
    return <article className={styles.outline} lang="ru" data-no-i18n>
      <Link className={styles.back} href={base}>← Computer Networks</Link>
      <h1>{sections[section]}</h1>
      <p>{mid?'Из сохранённой подготовки к мидтерму — лекции 1–5 и 7 и квизы по их темам.':'По объявлению об эндтерме — недели 5–10. Особое внимание TCP/UDP, прикладным протоколам и настройке Cisco IOS.'}</p>
      <nav aria-label="Разделы"><a className="f-button" href="#quizzes">К квизам</a> <a className="f-button" href="#lectures">К лекциям</a></nav>
      <section id="quizzes"><h2>Квизы</h2><nav className={styles.moduleFolders} aria-label="Квизы">{ids.map(id=><Link key={id} prefetch={false} href={base+'/practice/module-'+String(id).padStart(2,'0')}><small>Модуль {id}</small><strong>{modules[id-1].title}</strong><span>Настроить квиз →</span></Link>)}</nav></section>
      <section id="lectures"><h2>Лекции</h2><nav className={styles.moduleFolders} aria-label="Лекции">{lectures.map(({lecture,i})=><Link key={i} href={base+'/lectures/'+(i+1)}><strong>{lecture.title.ru}</strong><span>Открыть конспект →</span></Link>)}</nav></section>
    </article>;
  }
  const lang=section==="practice"?"ru":await readingLanguage();
  const en=lang==="en";
  const owner=(await auth())?.user?.id;
  const prefix=section==="practice"?"network-bank:":"network-reading:"+section+":";
  const progress=owner?await prisma.eventProgress.findMany({where:{userId:owner,eventId:{startsWith:prefix}},select:{eventId:true,percent:true}}):[];
  const percentages=new Map(progress.map(row=>[row.eventId.slice(prefix.length),row.percent]));
  function mastery(id:string){
    const value=percentages.get(id)??0;
    return <span>Освоено {value}% <progress aria-label="Освоено вопросов" max={100} value={value}/></span>;
  }
  return <article className={styles.outline} lang={lang} data-no-i18n>
    <Link className={styles.back} href="/events/courses/computer-networks">← Computer Networks</Link>
    {section!=="practice" && <ReadingLanguage lang={lang}/>}
    <h1>{en?(section==="lectures"?"Lectures":"Module theory"):sections[section as keyof typeof sections]}</h1>
    {section!=="practice" && <label>{en?'Read':'Прочитано'} {progress.filter(p=>p.percent===100).length} / {section==="lectures"?book.event.lectures.length:modules.length} <progress value={progress.filter(p=>p.percent===100).length} max={section==="lectures"?book.event.lectures.length:modules.length}/></label>}
    {section === "lectures" && <p>{book.guide[lang].split("\n")[1]}</p>}
    {section === "lectures" && <nav className={styles.moduleFolders} aria-label={en?"Lectures":"Лекции"}>{book.event.lectures.map((l,i)=>
      <Link key={l.id} href={`/events/courses/computer-networks/lectures/${i+1}`}><small>{en?'Lecture':'Лекция'} {i+1}</small><strong>{l.title[lang].split(' — ').slice(1).join(' — ') || l.title[lang]}</strong><span>{percentages.get(String(i+1))===100?'✓ ':''}{en?'Notes and examples':'Конспект и примеры'} →</span></Link>)}</nav>}
    {section === "theory" && <nav className={styles.moduleFolders} aria-label="Модули Cisco">{modules.map(m=>
      <Link key={m.id} href={`/events/courses/computer-networks/theory/${m.id}`}><small>{en?'Module':'Модуль'} {m.id}</small><strong>{en?readingEnglish[m.id-1][0]:m.title}</strong><span>{percentages.get(String(m.id))===100?'✓ ':''}{en?'Theory and self-check':'Теория и самопроверка'} →</span></Link>)}</nav>}
    {section === "practice" && <>
      <nav className={styles.moduleFolders} aria-label="Модули Cisco">{modules.map(m => {
        const id = 'module-'+String(m.id).padStart(2,'0');
        const count = questionsFor(id).filter(q=>q.correct.length).length;
        return <Link key={id} prefetch={false} href={`/events/courses/computer-networks/practice/${id}`}><small>Модуль {m.id}</small><strong>{m.title}</strong><span>{count} вопросов для квиза →</span>{mastery(id)}</Link>;
      })}</nav>
      <details id="labs"><summary>Разбор сданных лабораторных</summary>

        {labs.map(lab => <details key={lab.week}>
          <summary>Неделя {lab.week} · {lab.activity}</summary>
          <h3>{lab.task}</h3>
          <details><summary>Показать разбор</summary><p>{lab.answer}</p></details>
        </details>)}
      </details>
      {[
        {title:"Промежуточные тесты и финалы", items:groups.filter(g=>g.id.startsWith("test-"))},
        {title:"Самопроверка с разбором", items:groups.filter(g=>g.id.startsWith("topic-") || g.id.startsWith("vrt-"))},
      ].map(category=><details key={category.title}><summary>{category.title}</summary><ul>{category.items.map(g=><li key={g.id}><Link prefetch={false} href={`/events/courses/computer-networks/practice/${g.id}`}>{g.title} · {g.count} вопросов → {mastery(g.id)}</Link></li>)}</ul></details>)}
    </>}
  </article>;
}
