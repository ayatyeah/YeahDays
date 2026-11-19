import { courseForEvent } from '@/lib/events/courses';
import { notFound, redirect } from 'next/navigation';
import { EVENTS, findEvent } from '@/lib/events';
import { FINAL_NOTEBOOKS, RETIRED_NOTEBOOK_ROUTES, findFinalEvent } from '@/lib/events/finals';
import LectureNotebook from '@/components/events/LectureNotebook';
import EventRoute from './EventRoute';
import PhilosophyWorkspace from '@/components/philosophy/PhilosophyWorkspace';

export function generateStaticParams() {
  return [...EVENTS.map(event => event.id), ...FINAL_NOTEBOOKS.map(book => book.event.id), ...Object.keys(RETIRED_NOTEBOOK_ROUTES)].filter(id => courseForEvent(id)).map(id => ({ id }));
}
export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!courseForEvent(id)) notFound();
  if (RETIRED_NOTEBOOK_ROUTES[id]) redirect(`/events/${RETIRED_NOTEBOOK_ROUTES[id]}`);
  const notebook = findFinalEvent(id);
  if (notebook && id === 'philosophy-final') return <PhilosophyWorkspace notebook={notebook}/>;
  if (notebook) return <div className="g-event-workspace"><LectureNotebook event={notebook.event} notebook={notebook}/></div>;
  if (!findEvent(id)) notFound();
  return <EventRoute/>;
}
