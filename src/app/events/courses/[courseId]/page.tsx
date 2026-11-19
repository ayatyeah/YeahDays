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
