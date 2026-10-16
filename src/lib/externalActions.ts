/**
 * "Внешние" действия — то, что закрывают сторонние сервисы через
 * /api/integrations/complete-action, а не сама колода. Не в ACTION_POOL и
 * не в customActions пользователя — фиксированный набор по source+тип
 * активности, вынесен отдельно, чтобы XP-математику можно было
 * протестировать без поднятия роута (см. externalActions.test.ts).
 */
import { xpForAction, type Action, type CategoryKey, type Difficulty, type Impact } from "./domain";

export type ActivityType =
  | "reading"
  | "writing"
  | "quiz"
  | "notes"
  // YeahSoldiers (Telegram-агенты): тренировки, бег, восстановление, учёба вне StudyLoop
  | "workout"
  | "run"
  | "walk"
  | "meditation"
  | "study";

/** Категория, сложность и impact подобраны по ощутимости активности — тюнить можно здесь без миграций. */
export const ACTIVITY_PRESET: Record<
  ActivityType,
  { category: CategoryKey; difficulty: Difficulty; impact: Impact; why: string }
> = {
  reading: { category: "learning", difficulty: 2, impact: 3, why: "IELTS Reading через StudyLoop" },
  writing: { category: "learning", difficulty: 3, impact: 4, why: "IELTS Writing с AI-фидбэком через StudyLoop" },
  quiz: { category: "learning", difficulty: 2, impact: 2, why: "Квиз по конспекту через StudyLoop" },
  notes: { category: "learning", difficulty: 1, impact: 2, why: "Повтор конспекта через StudyLoop" },
  workout: { category: "fitness", difficulty: 4, impact: 4, why: "Тренировка" },
  run: { category: "fitness", difficulty: 3, impact: 4, why: "Пробежка" },
  walk: { category: "health", difficulty: 1, impact: 2, why: "Прогулка" },
  meditation: { category: "mindfulness", difficulty: 2, impact: 3, why: "Медитация" },
  study: { category: "learning", difficulty: 3, impact: 3, why: "Учёба" },
};

export function isActivityType(value: unknown): value is ActivityType {
  return typeof value === "string" && Object.hasOwn(ACTIVITY_PRESET, value);
}

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
    category: preset.category,
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
