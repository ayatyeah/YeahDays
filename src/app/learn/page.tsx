import FinalWorkspace from "@/components/final/FinalWorkspace";
import { Suspense } from "react";
import LearningPage from "@/components/learning/LearningPage";
import { EVENTS } from "@/lib/events";
import { steps } from "@/lib/events/engine";
import { routeStops } from "@/lib/events/route";

export const metadata = { title: "Study plan | YeahGrind" };

export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams;
  if (!view || view === "hub" || view === "study") return <FinalWorkspace view="plan" />;
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
      route: routeStops(e),
    };
  });
  return (
    <Suspense fallback={<p role="status">Loading your courses…</p>}>
      <LearningPage events={events} />
    </Suspense>
  );
}
