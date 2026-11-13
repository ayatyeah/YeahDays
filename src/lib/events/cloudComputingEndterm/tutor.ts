import type { StudyEvent } from "../types";
import { cloudEndtermSummary } from "./meta";
import lessons from "./lessons.json";

/** Tutor context only; the original exam bank retains its multiple-choice answers. */
export const cloudTutorEvent: StudyEvent = {
  id: cloudEndtermSummary.id, title: cloudEndtermSummary.title, course: cloudEndtermSummary.course, description: cloudEndtermSummary.description,
  counts: { part: 0, lecture: 0, final: 47 },
  lectures: [{ id: "cloud-endterm", title: { ru: "Cloud Computing Endterm", en: "Cloud Computing Endterm" },
    parts: lessons.map(l => ({ id: l.id, title: { ru: l.title, en: l.title },
      notes: { ru: l.body.join("\n\n"), en: l.body.join("\n\n") }, questions: [] })) }],
};
