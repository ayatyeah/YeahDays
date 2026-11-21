import {grindBank,grindUnits,archiveBank,compactBank} from '@/lib/events/networkFinal/grind';
import Link from 'next/link';
import {sprints} from '@/lib/events/networkFinal/sprints';
import styles from '@/app/events/courses.module.css';

export default function NetworkStudyRoutes(){
  const path='/events/courses/computer-networks/practice/';
  return <section><h2 className={styles.sectionTitle}>GRIND MODE</h2>
    <nav className={styles.moduleFolders} aria-label="GRIND MODE и банки вопросов">
      <Link href={path+'grind'}><strong>Начать · 4–5 часов</strong><span>{grindUnits.length} коротких тем по всем 17 модулям · {grindBank.length} вопросов с разбором</span></Link>
      <Link href={path+'grind-full'}><strong>GRIND MODE целиком</strong><span>Все темы и все {archiveBank.filter(q=>q.correct.length).length} проверяемых вопросов</span></Link>
      <Link href={path+'complete'}><strong>Общий банк</strong><span>{archiveBank.length} записей, включая задания для самостоятельного разбора</span></Link>
      <Link href={path+'compact'}><strong>Укороченный банк</strong><span>После объединения повторов · {compactBank.length}</span></Link>
    </nav><h2 className={styles.sectionTitle}>Сколько времени до файнала?</h2>
    <nav className={styles.moduleFolders} aria-label="Подготовка по времени">{sprints.map(plan=>
      <Link key={plan.id} href={'/events/courses/computer-networks/practice/'+plan.id}><strong>{plan.title}</strong><span>{plan.description}</span></Link>)}</nav>
  </section>;
}
