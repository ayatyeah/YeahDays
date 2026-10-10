import { Suspense } from "react";
import LearningPage from "@/components/learning/LearningPage";
import { EVENTS } from "@/lib/events";
import { steps } from "@/lib/events/engine";

export default function Page() {
  // Only lightweight summaries cross into the browser, not the lecture/question banks.
  const events = EVENTS.filter((e) => !e.unlisted).map((e) => {
    const list = steps(e);
    const weights = { part: 0.2, lecture: 0.3, final: 0.5, deep: 0 };
    return {
      id: e.id,
      course: e.course,
      title: e.title,
      lectures: e.lectures.length,
      stepIds: list.map((s) => s.id),
      stepWeights: list.map(
        (s) =>
          weights[s.kind] /
          list.filter((other) => other.kind === s.kind).length,
      ),
      mocks: e.mocks?.length ?? 0,
      practice: e.practice ?? null,
    };
  });
  return (
    <Suspense fallback={<p role="status">Загружаем учёбу…</p>}>
      <LearningPage events={events} />
    </Suspense>
  );
}
