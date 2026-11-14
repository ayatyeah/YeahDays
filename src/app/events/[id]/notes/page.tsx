import { notFound } from 'next/navigation';
import CloudNotesReader from '@/components/events/CloudNotesReader';
export function generateStaticParams() { return [{ id: 'cloud-computing-endterm' }]; }
export default async function ExamNotesPage({ params }: { params: Promise<{ id: string }> }) {
  if ((await params).id !== 'cloud-computing-endterm') notFound();
  return <CloudNotesReader/>;
}
