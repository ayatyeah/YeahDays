import { EVENTS } from "@/lib/events";
import { steps } from "@/lib/events/engine";
import EventsList, { type EventSummary } from "./EventsList";

/**
 * Список ивентов: сводки считаются на сервере при сборке, в браузер уходят
 * только заголовки и числа — без конспектов и вопросов (иначе ~6 МБ JS).
 * Ивенты «только по ссылке» в списке не показываем (StudyEvent.unlisted);
 * свежие — сверху.
 */
export default function EventsPage() {
  const events: EventSummary[] = EVENTS.filter((e) => !e.unlisted)
    .reverse()
    .map((e) => ({
      id: e.id,
      title: e.title,
      course: e.course,
      description: e.description,
      lectures: e.lectures.length,
      parts: e.lectures.reduce((n, l) => n + l.parts.length, 0),
      questions: e.lectures.reduce((n, l) => n + l.parts.reduce((m, p) => m + p.questions.length, 0), 0),
      mocks: e.mocks?.length ?? 0,
      practice: !!e.practice,
      steps: steps(e).map((s) => ({ id: s.id, kind: s.kind })),
    }));
  return <EventsList events={events} />;
}
