import Image from 'next/image';
import Link from 'next/link';
import { EVENT_COURSES } from '@/lib/events/courses';
import type { FinalStudy } from '@/lib/finalStudy';
import { Icon } from './Brand';
import PrimeNotebook from './PrimeNotebook';
const labels: Record<string,string> = { 'research-methods':'RMT','cloud-computing':'Cloud Comp','computer-networks':'Comp Net','computer-vision':'Comp Vision','project-management':'Project Management','philosophy':'Philosophy' };
export function CourseShelf() {
  return <section className="p-course-shelf" aria-labelledby="desk-courses-title"><div className="p-desk-section-title"><h2 id="desk-courses-title">Your courses</h2><Link href="/events">Open library<Icon name="arrow" size={17}/></Link></div><div className="p-folders">{EVENT_COURSES.map(course => { const id=course.id; return <Link href={`/events/courses/${id}`} key={id} className="p-folder" data-course={id}><span className="p-folder-tab" aria-hidden="true"/><Image src={course.logo} width={52} height={52} alt=""/><span><strong>{labels[id]}</strong><small>Final preparation</small></span><Icon name="chevron" size={18}/></Link>; })}</div></section>;
}
export default function StudyDesk({ study, onCreate }: { study: FinalStudy | null; onCreate: () => void }) {
  const next=study?.tasks.find(t=>!t.completedAt);
  const complete=study && !next;
  return <div className="p-study-desk"><header className="p-desk-heading"><h1><span className="p-desktop-title">A little focus.<br/>A real step.</span><span className="p-mobile-title">Your next step</span></h1><p>{study ? 'Pick up where you left off.' : 'A place for your notes. A plan for your next step.'}</p></header><section className="p-next-session" aria-label="Your next learning session"><div className="p-session-copy"><span className="p-session-label"><Icon name={study?.source==='ai' ? 'spark' : 'plan'} size={17}/>{study ? complete ? 'Plan complete' : 'Your next step' : 'Make it yours'}</span><h2>{next?.title || (complete ? 'Look how far you have come.' : 'Start with something you want to understand.')}</h2><p>{next ? next.instruction : complete ? 'Your reflections and completed tasks are ready to revisit.' : 'Set one goal. Choose your pace. Make room for a little progress.'}</p>{study ? <Link href={complete ? '/progress' : '/learn'} className="f-button">{complete ? 'See my progress' : 'Continue learning'}<Icon name="arrow" size={19}/></Link> : <button className="f-button" type="button" onClick={onCreate}>Create my study plan<Icon name="arrow" size={19}/></button>}</div><div className="p-session-book"><PrimeNotebook compact/></div></section><CourseShelf/><Link href="/events/all" className="p-events-strip"><span className="p-events-icon"><Icon name="events" size={24}/></span><strong>Study events</strong><span>Find your next revision session</span><span className="p-events-action">View events <Icon name="arrow" size={17}/></span></Link></div>;
}
