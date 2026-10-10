import type { Progress } from "@/lib/events/engine";
export type LearningEventSummary = {
  id: string;
  course: string;
  title: string;
  lectures: number;
  stepIds: string[];
  stepWeights: number[];
  mocks: number;
  practice: string | null;
};
export type LearningEventProgress = { done: number; readiness: number };
export function summarizeLearningProgress(
  event: LearningEventSummary,
  progress: Progress,
): LearningEventProgress {
  return {
    done: event.stepIds.filter((id) => progress[id]).length,
    readiness: Math.round(
      event.stepIds.reduce((sum, id, i) => {
        const best = progress[id]?.best;
        return (
          sum +
          (typeof best === "number" && Number.isFinite(best)
            ? Math.max(0, Math.min(1, best))
            : 0) *
            event.stepWeights[i]
        );
      }, 0) * 100,
    ),
  };
}
export function orderLearningEvents(
  events: LearningEventSummary[],
  progress: Record<string, LearningEventProgress>,
) {
  return events
    .map((event, index) => ({ event, index }))
    .sort((a, b) => {
      const ap = progress[a.event.id],
        bp = progress[b.event.id];
      return (
        Number(!!bp?.done) - Number(!!ap?.done) ||
        (bp?.readiness ?? 0) - (ap?.readiness ?? 0) ||
        b.index - a.index
      );
    })
    .map(({ event }) => event);
}
export const learningVisitKey = (owner: string) =>
  `yg-learning-visits:${owner}`;
