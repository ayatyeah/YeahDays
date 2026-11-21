import {finalPaper, finalOccurrences} from '@/lib/events/networkFinal/finalPaper';
import {writtenQuestions} from '@/lib/events/networkFinal/finalWritten';
import NetworkStudyRoutes from '@/components/events/NetworkStudyRoutes';
import ReadingLanguage, {readingLanguage} from '@/components/events/ReadingLanguage';
import {readingEnglish} from '@/lib/events/networkFinal/readingEnglish';
import {auth} from '@/auth';
import {prisma} from '@/lib/db';
import Link from "next/link";
import { notFound } from "next/navigation";
import book from "@/lib/events/finals/computer-networks.json";
import { modules } from "@/lib/events/networkFinal/readings";
import { labs } from "@/lib/events/networkFinal/labs";
import { groups, questionsFor } from '@/lib/events/networkFinal/quizzes';
import styles from "../../../courses.module.css";

const sections = { midterm:"Мидтерм", endterm:"Эндтерм", final:"Файнал", practice: "Квизы по модулям", lectures: "Лекции", theory: "Теория" };
export function generateStaticParams() {
  return Object.keys(sections).map(section => ({ section }));
}

export default async function NetworkSection({ params }: { params: Promise<{section: string}> }) {
  const { section } = await params;
  if (!Object.hasOwn(sections, section)) notFound();
  if(section==="midterm" || section==="endterm" || section==="final"){
    if (section === 'final') {
      const root = '/events/courses/computer-networks';
      return <article className={`${styles.outline} ${styles.sectionPage}`} lang="ru" data-no-i18n>
        <Link className={styles.back} href={root}>← Computer Networks</Link><h1>Файнал</h1>
        <nav className={styles.moduleFolders} aria-label="Банки файнала">
          <Link href={root+'/practice/final-close'}><strong>Более близкий файнал</strong><span>Три комплекта с фотографий · 100 вопросов с проверкой и 2 для разбора</span></Link>
          <Link href={root+'/practice/final-paper'}><strong>Файнал банк</strong><span>{finalPaper.length} тестовых вопросов с разбором · по всем вариантам или по одному</span></Link>
          <Link href={root+'/final/open-ended'}><strong>Open-ended</strong><span>{writtenQuestions.length} письменных заданий · оценка Gemini и образец ответа</span></Link>
          <Link href={root+'/practice/final-related'}><strong>Вопросы по модулям и лекциям</strong><span>Дополнительная практика по темам файнала</span></Link>
        </nav>
        <p>В тестах {finalOccurrences} позиций. В общем банке {finalOccurrences-finalPaper.length} повторов объединено.</p>
      </article>;
    }
    const mid=section==="midterm";
    const term=mid?'мидтерма':'эндтерма';
    return <article className={`${styles.outline} ${styles.sectionPage}`} lang="ru" data-no-i18n>
      <Link className={styles.back} href="/events/courses/computer-networks">← Computer Networks</Link><h1>{sections[section]}</h1>
      <nav className={styles.moduleFolders} aria-label={'Папки '+term}>{['paper','related'].map((type,i)=><Link key={type} href={'/events/courses/computer-networks/practice/'+section+'-'+type}><strong>{i?'Вопросы по модулям и лекциям':'Вопросы '+term}</strong><span>{i?'Вся практика или подборка по модулю и лекции':mid?'Отдельный банк · 25 вопросов':'Отдельный банк · 4 варианта по 25 вопросов'}</span></Link>)}</nav>
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
    return <span>Освоено {value}% <progress className={styles.meter} aria-label="Освоено вопросов" max={100} value={value}/></span>;
  }
  return <article className={`${styles.outline} ${styles.sectionPage}`} lang={lang} data-no-i18n>
    <Link className={styles.back} href="/events/courses/computer-networks">← Computer Networks</Link>
    {section!=="practice" && <ReadingLanguage lang={lang}/>}
    <h1>{en?(section==="lectures"?"Lectures":"Module theory"):sections[section as keyof typeof sections]}</h1>
    {section!=="practice" && <label>{en?'Read':'Прочитано'} {progress.filter(p=>p.percent===100).length} / {section==="lectures"?book.event.lectures.length:modules.length} <progress className={styles.meter} value={progress.filter(p=>p.percent===100).length} max={section==="lectures"?book.event.lectures.length:modules.length}/></label>}
    {section === "lectures" && <p>{book.guide[lang].split("\n")[1]}</p>}
    {section === "lectures" && <nav className={styles.moduleFolders} aria-label={en?"Lectures":"Лекции"}>{book.event.lectures.map((l,i)=>
      <Link key={l.id} href={`/events/courses/computer-networks/lectures/${i+1}`}><small>{en?'Lecture':'Лекция'} {i+1}</small><strong>{l.title[lang].split(' — ').slice(1).join(' — ') || l.title[lang]}</strong><span>{percentages.get(String(i+1))===100?'✓ ':''}{en?'Notes and examples':'Конспект и примеры'} →</span></Link>)}</nav>}
    {section === "theory" && <nav className={styles.moduleFolders} aria-label="Модули Cisco">{modules.map(m=>
      <Link key={m.id} href={`/events/courses/computer-networks/theory/${m.id}`}><small>{en?'Module':'Модуль'} {m.id}</small><strong>{en?readingEnglish[m.id-1][0]:m.title}</strong><span>{percentages.get(String(m.id))===100?'✓ ':''}{en?'Theory and self-check':'Теория и самопроверка'} →</span></Link>)}</nav>}
    {section === "practice" && <>
      <NetworkStudyRoutes/>
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
