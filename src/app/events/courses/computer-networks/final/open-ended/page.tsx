import Link from 'next/link';
import NetworkFinalWritten from '@/components/events/NetworkFinalWritten';
import styles from '../../../../courses.module.css';

export default function OpenEndedPage() {
  return <article className={`${styles.outline} ${styles.sectionPage}`} data-no-i18n>
    <Link className={styles.back} href="/events/courses/computer-networks/final">← Файнал</Link>
    <h1>Open-ended</h1>
    <NetworkFinalWritten/>
  </article>;
}
