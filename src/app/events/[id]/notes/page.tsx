import StudyGuide from '@/components/philosophy/StudyGuide';
import { courseForEvent } from '@/lib/events/courses';
import LectureNotebook from '@/components/events/LectureNotebook';
import { notFound, redirect } from 'next/navigation';
import { findFinalEvent } from '@/lib/events/finals';
export function generateStaticParams() { return [{ id: 'cloud-computing-endterm' }]; }
export default async function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const notebook = findFinalEvent((await params).id);
  if (!notebook || !courseForEvent(notebook.event.id)) notFound();
  if (notebook.event.id === 'philosophy-final') return <div className="g-event-workspace"><LectureNotebook event={notebook.event} notebook={notebook}/><details className="g-note-paper"><summary>Лекции 1–10 · Краткий разбор</summary><StudyGuide section="lectures"/></details></div>;
  redirect(`/events/${notebook.event.id}`);
}
