import { notFound } from "next/navigation";
import { EVENT_COURSES } from "@/lib/events/courses";
import { eventSummaries } from "@/lib/events/summaries";
import EventsList from "../../EventsList";

export function generateStaticParams() {
  return EVENT_COURSES.map(course => ({ courseId: course.id }));
}
export default async function CourseEventsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = EVENT_COURSES.find(c => c.id === courseId);
  if (!course) notFound();
  const summaries = eventSummaries();
  const events = course.eventIds.flatMap(id => {
    const event = summaries.find(e => e.id === id);
    return event ? [event] : [];
  });
  return <EventsList course={course} events={events} />;
}
