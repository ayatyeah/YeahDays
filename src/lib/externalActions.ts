/**
 * "Внешние" действия — то, что закрывают сторонние сервисы через
 * /api/integrations/complete-action, а не сама колода. Не в ACTION_POOL и
 * не в customActions пользователя — фиксированный набор по source+тип
 * активности, вынесен отдельно, чтобы XP-математику можно было
 * протестировать без поднятия роута (см. externalActions.test.ts).
 */
import { xpForAction, type Action, type Difficulty, type Impact } from "./domain";

export type ActivityType = "reading" | "writing" | "quiz" | "notes";

/** Сложность/impact подобраны по ощутимости активности — тюнить можно менять здесь без миграций. */
export const ACTIVITY_PRESET: Record<
  ActivityType,
  { difficulty: Difficulty; impact: Impact; why: string }
> = {
  reading: { difficulty: 2, impact: 3, why: "IELTS Reading через StudyLoop" },
  writing: { difficulty: 3, impact: 4, why: "IELTS Writing с AI-фидбэком через StudyLoop" },
  quiz: { difficulty: 2, impact: 2, why: "Квиз по конспекту через StudyLoop" },
  notes: { difficulty: 1, impact: 2, why: "Повтор конспекта через StudyLoop" },
};

/** Снимок Action под конкретное закрытие — duration берётся из реального времени, не из константы. */
export function buildExternalActionSnapshot(
  source: string,
  activityType: ActivityType,
  title: string,
  minutes: number,
): Action {
  const preset = ACTIVITY_PRESET[activityType];
  return {
    id: `ext-${source}-${activityType}`,
    title,
    why: preset.why,
    category: "learning",
    difficulty: preset.difficulty,
    duration: minutes,
    energy: "medium",
    timePreference: "any",
    impact: preset.impact,
    custom: true,
  };
}

/** XP за одно закрытие внешней активности — то, что реально уйдёт в PlannedTask.xp. */
export function xpForExternalActivity(
  source: string,
  activityType: ActivityType,
  title: string,
  minutes: number,
): number {
  return xpForAction(buildExternalActionSnapshot(source, activityType, title, minutes));
}
