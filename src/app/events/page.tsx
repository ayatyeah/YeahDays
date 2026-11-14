import Image from "next/image";
import Link from "next/link";
import { EVENT_COURSES, courseHref } from "@/lib/events/courses";
import styles from "./courses.module.css";

export default function EventsPage() {
  return <section className={styles.catalog} lang="en">
    <Link href="/learn" className={styles.back}>← Study plan</Link>
    <header className={styles.header}><span className="f-section-kicker">Make your course part of the plan</span><h1>Learn together. Practise your way.</h1><p>Choose a course to explore lecture notes, revision and practice events. Your existing progress is right where you left it.</p></header>
    <div className={styles.grid}>{EVENT_COURSES.map(course => <Link key={course.id} href={courseHref(course.id)} className={styles.course}>
      <Image src={course.logo} width={72} height={72} alt="" className={styles.logo} />
      <div className={styles.text}><h2 lang="en">{course.title}</h2><p>{course.description}</p><span className={styles.count}>{course.eventIds.length} {course.eventIds.length === 1 ? "event" : "events"}</span></div>
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>)}</div>
  </section>;
}
