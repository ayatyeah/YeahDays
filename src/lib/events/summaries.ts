import { EVENTS } from "./index";
import { steps } from "./engine";
import { cloudEndtermSummary } from "./cloudComputingEndterm/meta";
import type { EventSummary } from "@/app/events/EventsList";

/** Server-side only: return small cards, never ship all course content. */
export function eventSummaries(): EventSummary[] {
  return [cloudEndtermSummary, ...EVENTS.filter(e => !e.unlisted).reverse().map(e => ({
    id: e.id,
    title: e.title,
    course: e.course,
    description: e.description,
    lectures: e.lectures.length,
    parts: e.lectures.reduce((n, l) => n + l.parts.length, 0),
    questions: e.lectures.reduce((n, l) => n + l.parts.reduce((m, p) => m + p.questions.length, 0), 0),
    mocks: e.mocks?.length ?? 0,
    practice: !!e.practice,
    steps: steps(e).map(s => ({ id: s.id, kind: s.kind })),
  }))];
}
