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
  if (course.id === 'cloud-computing') {
    const folders = [
      ['lectures', 'Лекции', 'Материалы преподавателя и объяснения по темам', `${book.event.lectures.length} лекций`],
      ['files', 'Модули AWS', 'Student Guide, содержание и материалы двух курсов', '2 курса · 24 модуля'],
      ['terms', 'Термины', 'Сервисы, типы баз данных и технологии простыми словами', 'Поиск · примеры · различия'],
      ['practice', 'Квиз · 220 вопросов', 'Оригинальные Knowledge Checks с разбором ответов', '100 Foundations + 120 Developing'],
      ['aws-notes', 'Конспекты', 'Простые объяснения, примеры и проверка понимания', '11 тем'],
      ['one-day', 'Подготовка за 1 день', 'Маршрут изучения, повторение и закрепление тестами', 'План с перерывами'],
      ['overview', 'Требования к экзамену', 'Что входит в финал и как готовиться', 'Финал'],
    ];
    return <section className={styles.catalog} lang="ru" data-no-i18n>
      <Link className={styles.back} href="/events">← Все курсы</Link>
      <header className={styles.courseHeading}><img src={course.logo} alt=""/><div><h1>{course.title}</h1><p>Открой нужную папку — сразу к материалам или тесту.</p></div></header>
      <nav className={styles.grid} aria-label="Папки Cloud Computing">
        {folders.map(([id, title, description, count]) => <Link className={`${styles.course} ${styles.folder}`} key={id} href={`${base}#${id}`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>
          <div className={styles.text}><h2>{title}</h2><p>{description}</p><span className={styles.count}>{count}</span></div><span className={styles.arrow} aria-hidden="true">↗</span>
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
