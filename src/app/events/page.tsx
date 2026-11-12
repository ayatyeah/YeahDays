import Image from "next/image";
import Link from "next/link";
import { EVENT_COURSES, courseHref } from "@/lib/events/courses";
import styles from "./courses.module.css";

export default function EventsPage() {
  return <section className={styles.catalog}>
    <Link href="/learn" className={styles.back}>← Учёба</Link>
    <header className={styles.header}><h1>Ивенты</h1><p>Выбери курс. Внутри — все его ивенты, подготовка к экзаменам и практика.</p></header>
    <div className={styles.grid}>{EVENT_COURSES.map(course => <Link key={course.id} href={courseHref(course.id)} className={styles.course}>
      <Image src={course.logo} width={72} height={72} alt="" className={styles.logo} />
      <div className={styles.text}><h2 lang="en">{course.title}</h2><p>{course.description}</p><span className={styles.count}>{course.eventIds.length} {course.eventIds.length === 1 ? "ивент" : "ивента"}</span></div>
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>)}</div>
  </section>;
}
