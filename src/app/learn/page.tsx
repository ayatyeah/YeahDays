import { Suspense } from "react";
import LearningPage from "@/components/learning/LearningPage";
import { EVENTS } from "@/lib/events";
import { steps } from "@/lib/events/engine";

export default function Page() {
  // Only lightweight summaries cross into the browser, not the lecture/question banks.
  const events = EVENTS.filter((e) => !e.unlisted).map((e) => ({
    id: e.id,
    course: e.course,
    title: e.title,
    lectures: e.lectures.length,
    stepIds: steps(e).map((s) => s.id),
  }));
  return (
    <Suspense fallback={<p role="status">Загружаем учёбу…</p>}>
      <LearningPage events={events} />
    </Suspense>
  );
}
