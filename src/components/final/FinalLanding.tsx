import Image from 'next/image';
import Link from 'next/link';
import { Brand, Icon } from './Brand';
import ThemeSwitch from './ThemeSwitch';
import { EVENT_COURSES } from '@/lib/events/courses';
import MicroLessonDemo from './MicroLessonDemo';
import styles from './micro-landing.module.css';
export default function FinalLanding() {
  return <div className={styles.site} lang="en" data-no-i18n>
    <a className="f-skip" href="#main-content">Skip to content</a>
    <header className={styles.header}><Brand/><nav aria-label="Website navigation"><a href="#how-it-works">How it works</a><a href="#courses">Courses</a></nav><div className={styles.headerActions}><ThemeSwitch/><Link href="/login">Log in</Link><a className={styles.smallButton} href="#try-lesson">Start learning</a></div></header>
    <main id="main-content">
      <section className={styles.hero} aria-labelledby="hero-title"><div className={styles.heroCopy}><span className={styles.kicker}>MICROLEARNING, MADE PERSONAL</span><h1 id="hero-title">Small lessons.<br/>Lasting knowledge.</h1><p>One idea. A quick check. A little progress, every day.</p><div className={styles.actions}><a className={styles.primary} href="#try-lesson">Start a 5-minute lesson</a><a className={styles.textLink} href="#courses">Explore courses</a></div><div className={styles.chips}><span><Icon name="book"/>Understand</span><span><Icon name="check"/>Practise</span><span><Icon name="progress"/>Remember</span></div></div>
      <div className={styles.scene}><Image src="/landing/microlearning-book-v1.webp" alt="An open notebook with a lilac glass arch and a raised idea tile" width={1200} height={1000} preload sizes="(max-width: 760px) 95vw, 52vw"/><a className={styles.lessonTile} href="#try-lesson"><span className={styles.tileIcon}><Icon name="book" size={30}/></span><div><strong>Cloud Computing</strong><span>S3 or a database?</span><i aria-hidden="true"><b/><b/><b/><b/></i></div><small><Icon name="clock" size={16}/>5 min</small></a></div></section>
      <section id="how-it-works" className={styles.steps} aria-label="How microlearning works">{[['Learn one idea','Focus on a single, practical concept in just a few minutes.'],['Test your understanding','Answer a quick check and understand the reasoning.'],['Come back stronger','Revisit the idea later and explain it in your own words.']].map(([title,description],index) => <article key={title}><span>0{index+1}</span><div><h2>{title}</h2><p>{description}</p></div></article>)}</section>
      <section id="courses" className={styles.courses}><h2>Your next small step</h2><div>{EVENT_COURSES.map(course => <Link key={course.id} className={styles.course} href={`/events/courses/${course.id}`}><Image src={course.logo} alt="" width={64} height={64}/><span><strong>{course.title}</strong><small>{course.id === 'cloud-computing' ? 'Core ideas in the cloud, step by step.' : course.id === 'computer-networks' ? 'How devices connect and communicate.' : 'Big questions, clear ideas.'}</small></span><Icon name="arrow" size={22}/></Link>)}</div></section>
      <MicroLessonDemo/>
      <section className={styles.close}><h2>A little learning.<br/>Room for your life.</h2><p>Keep your notes, practise what matters and make the next step small enough to begin.</p><Link className={styles.primary} href="/register">Create your learning space</Link></section>
    </main>
    <footer className={styles.footer}><Brand/><span>A student project by YeahGrinders.</span><nav aria-label="Footer"><Link href="/research">Research</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav></footer>
  </div>;
}
