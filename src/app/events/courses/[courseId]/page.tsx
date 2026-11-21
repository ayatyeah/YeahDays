import NetworkStudyRoutes from '@/components/events/NetworkStudyRoutes';
import { notFound } from "next/navigation";
import { EVENT_COURSES } from "@/lib/events/courses";
import Link from "next/link";
import { findFinalEvent } from "@/lib/events/finals";
import styles from "../../courses.module.css";

export function generateStaticParams() {
  return EVENT_COURSES.map(course => ({ courseId: course.id }));
}
export default async function CourseEventsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = EVENT_COURSES.find(c => c.id === courseId);
  if (!course) notFound();
  const book = findFinalEvent(course.eventIds[0]);
  if (!book) notFound();
  const essay = course.id === 'philosophy';
  const base = `/events/${book.event.id}`;
  if (course.id === 'computer-networks') {
    const folders = [
      ['practice', 'Квизы по модулям', 'Вопросы из сохранённой подборки Cisco с вариантами ответов и разбором.'],
      ['lectures', 'Лекции', 'Конспекты лекций AITU и ссылки на материалы преподавателя в LMS.'],
      ['theory', 'Теория', 'Модули Introduction to Networks по порядку.'],
    ];
    return <section className={styles.catalog} lang="ru" data-no-i18n>
      <Link className={styles.back} href="/events">← Все курсы</Link>
      <header className={styles.courseHeading}><img src={course.logo} alt=""/><div><h1>{course.title}</h1><p>Письменный финал · 40 вопросов за 50 минут. В 30 вопросах выбери один ответ, в остальных 10 — два или три.</p></div></header>
      <NetworkStudyRoutes/>
      <h2 className={styles.sectionTitle}>Подготовка к экзамену</h2>
      <nav className={styles.moduleFolders} aria-label="Выбрать экзамен">{[['midterm','Мидтерм','25 вопросов и практика по связанным темам'],['endterm','Эндтерм','Темы лекций 5–10'],['final','Файнал','Файнал банк · тесты и письменные задания']].map(([id,title,description])=><Link key={id} href={`/events/courses/computer-networks/${id}`}><strong>{title}</strong><span>{description} →</span></Link>)}</nav>
      <h2 className={styles.sectionTitle}>Файнал · весь курс</h2>
      <nav className={styles.grid} aria-label="Папки Computer Networks">
        {folders.map(([id, title, description]) => <Link className={`${styles.course} ${styles.folder}`} key={id} href={`/events/courses/computer-networks/${id}`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>
          <div className={styles.text}><h2>{title}</h2><p>{description}</p></div><span className={styles.arrow} aria-hidden="true">↗</span>
        </Link>)}
      </nav>
    </section>;
  }
  return <section className={styles.outline} lang="en" data-no-i18n>
    <Link className={styles.back} href="/events">← All courses</Link>
    <h1>{course.title}</h1>
    <section><h2>Practice</h2>
      <Link className="f-button" href={essay ? base : base + '#practice'}>{essay ? 'Prepare for the essay' : 'Open practice tests'} →</Link>
    </section>
    <section><h2>Lectures</h2><ol>{book.event.lectures.map(lecture =>
      <li key={lecture.id}><Link href={`${essay ? base + '/notes' : base}#${lecture.parts[0].id}`}>{lecture.title.en}<span aria-hidden="true"> →</span></Link></li>
    )}</ol></section>
  </section>;
}
