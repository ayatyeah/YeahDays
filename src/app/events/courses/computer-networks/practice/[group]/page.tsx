import {QuestionTranslations} from '@/components/events/QuestionLanguage';
import {finalTranslations} from '@/lib/events/networkFinal/finalPaper';
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
  const quiz = <NetworkPracticeQuiz key={group} group={group} title={entry.title} questions={questionsFor(group)}/>;
  return <div className={styles.practiceGroup}>{group==='final-paper' ? <QuestionTranslations translations={{ru:finalTranslations}}>{quiz}</QuestionTranslations> : quiz}</div>;
}
