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
  return <main style={{maxWidth:840,margin:'0 auto',padding:'16px 12px 128px'}}><NetworkPracticeQuiz key={group} group={group} title={entry.title} questions={questionsFor(group)}/></main>;
}
