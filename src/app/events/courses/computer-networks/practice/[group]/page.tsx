import styles from '../../../../courses.module.css';
import {notFound} from 'next/navigation';
import NetworkPracticeQuiz from '@/components/events/NetworkPracticeQuiz';
import {groups, questionsFor} from '@/lib/events/networkFinal/quizzes';

export function generateStaticParams() {
  return groups.map(g=>({group:g.id}));
}
export default async function PracticeGroup({params}:{params:Promise<{group:string}>}) {
  const {group} = await params;
  const entry = groups.find(g=>g.id===group);
  if (!entry) notFound();
  return <div className={styles.practiceGroup}><NetworkPracticeQuiz key={group} group={group} title={entry.title} questions={questionsFor(group)}/></div>;
}
