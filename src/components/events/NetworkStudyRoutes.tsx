import Link from 'next/link';
import {sprints} from '@/lib/events/networkFinal/sprints';
import styles from '@/app/events/courses.module.css';

export default function NetworkStudyRoutes(){
  return <section><h2 className={styles.sectionTitle}>Сколько времени до файнала?</h2>
    <nav className={styles.moduleFolders} aria-label="Подготовка по времени">{sprints.map(plan=>
      <Link key={plan.id} href={'/events/courses/computer-networks/practice/'+plan.id}><strong>{plan.title}</strong><span>{plan.description}</span></Link>)}</nav>
  </section>;
}
