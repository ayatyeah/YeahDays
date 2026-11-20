import Link from "next/link";
import { notFound } from "next/navigation";
import book from "@/lib/events/finals/computer-networks.json";
import { modules } from "@/lib/events/networkFinal/readings";
import { labs } from "@/lib/events/networkFinal/labs";
import { groups, questionsFor } from '@/lib/events/networkFinal/quizzes';
import styles from "../../../courses.module.css";

const sections = { practice: "Практика", lectures: "Лекции", theory: "Теория" };
export function generateStaticParams() {
  return Object.keys(sections).map(section => ({ section }));
}

export default async function NetworkSection({ params }: { params: Promise<{section: string}> }) {
  const { section } = await params;
  if (!Object.hasOwn(sections, section)) notFound();
  return <article className={styles.outline} lang="ru" data-no-i18n>
    <Link className={styles.back} href="/events/courses/computer-networks">← Computer Networks</Link>
    <h1>{sections[section as keyof typeof sections]}</h1>
    {section === "lectures" && <p>В LMS на 20 ноября опубликованы лекции 1–10. На странице Final Test вопросы пока не добавлены. <a href="https://lms.astanait.edu.kz/mod/quiz/view.php?id=75585">Проверить Final Test в LMS</a></p>}
    {section === "lectures" && <nav className={styles.moduleFolders} aria-label="Лекции">{book.event.lectures.map((l,i)=>
      <Link key={l.id} href={`/events/courses/computer-networks/lectures/${i+1}`}><small>Лекция {i+1}</small><strong>{l.title.ru.split(' — ').slice(1).join(' — ') || l.title.ru}</strong><span>Конспект и примеры →</span></Link>)}</nav>}
    {section === "theory" && <nav className={styles.moduleFolders} aria-label="Модули Cisco">{modules.map(m=>
      <Link key={m.id} href={`/events/courses/computer-networks/theory/${m.id}`}><small>Модуль {m.id}</small><strong>{m.title}</strong><span>Теория и самопроверка →</span></Link>)}</nav>}
    {section === "practice" && <>
      <nav className={styles.moduleFolders} aria-label="Модули Cisco">{modules.map(m => {
        const id = 'module-'+String(m.id).padStart(2,'0');
        const count = questionsFor(id).filter(q=>q.correct.length).length;
        return <Link key={id} prefetch={false} href={`/events/courses/computer-networks/practice/${id}`}><small>Модуль {m.id}</small><strong>{m.title}</strong><span>{count} вопросов для квиза →</span></Link>;
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
      ].map(category=><details key={category.title}><summary>{category.title}</summary><ul>{category.items.map(g=><li key={g.id}><Link prefetch={false} href={`/events/courses/computer-networks/practice/${g.id}`}>{g.title} · {g.count} вопросов →</Link></li>)}</ul></details>)}
    </>}
  </article>;
}
