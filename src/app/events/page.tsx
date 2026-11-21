import Image from "next/image";
import Link from "next/link";
import { EVENT_COURSES, courseHref } from "@/lib/events/courses";
import styles from "./courses.module.css";

export default function EventsPage() {
  return <section className={styles.catalog} lang="en" data-no-i18n>
    <header className={styles.header}><span className="f-section-kicker">Final exam preparation</span><h1>Philosophy final</h1><p>Prepare a handwritten essay with a practice case, philosopher cards and a 50-minute rehearsal.</p></header>
    <div className={styles.grid}>{EVENT_COURSES.map(course => <Link key={course.id} href={courseHref(course.id)} className={styles.course} data-course={course.id}>
      <Image src={course.logo} width={72} height={72} alt="" className={styles.logo} />
      <div className={styles.text}><h2 lang="en">{course.title}</h2><p>{course.description}</p><span className={styles.count}>{course.id === 'philosophy' ? 'Lectures & essay practice' : 'Lectures & tests'}</span></div>
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>)}</div>
  </section>;
}
