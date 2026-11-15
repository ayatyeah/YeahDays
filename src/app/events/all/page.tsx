import Link from 'next/link';
import { eventSummaries } from '@/lib/events/summaries';
import { Icon } from '@/components/final/Brand';

export const metadata = { title: 'Study events | YeahGrind' };
export default function StudyEventsPage() {
  const events = eventSummaries();
  return <section className="p-all-events" lang="en" data-no-i18n><header className="p-desk-heading"><h1>A little practice.<br/>A clearer picture.</h1><p>Choose a revision event and give what you know a little room to grow.</p></header><div className="p-event-grid">{events.map(event => <Link key={event.id} className="f-event-card p-event" href={`/events/${event.id}`}><span className="p-event-label"><Icon name="events" size={20}/>{event.course}</span><h2>{event.title}</h2><p>{event.description}</p><div><span>{event.parts} parts</span><span>{event.questions} questions</span></div><strong>Open event <Icon name="arrow" size={18}/></strong></Link>)}</div></section>;
}
