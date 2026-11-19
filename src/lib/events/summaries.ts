import { courseForEvent } from './courses';
import { FINAL_NOTEBOOKS } from './finals';
import type { EventSummary } from '@/app/events/EventsList';

/** The library opens final preparation; authored practice remains inside each notebook. */
export function eventSummaries(): EventSummary[] {
  return FINAL_NOTEBOOKS.filter(book => courseForEvent(book.event.id)).map(({ event }) => ({
    id: event.id, title: event.title, course: event.course, description: event.description,
    lectures: event.lectures.length, parts: event.lectures.reduce((total, lecture) => total + lecture.parts.length, 0),
    questions: 0, mocks: 0, practice: false, steps: [], independentProgress: true,
  }));
}
