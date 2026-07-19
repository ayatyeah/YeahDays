export type StatKey = "body" | "mind" | "discipline";
export type Difficulty = "easy" | "medium" | "hard";

export interface CategoryConfig {
  key: StatKey;
  label: string;
  hint: string;
  /** CSS var color token */
  color: string;
  emoji: string;
}

export const CATEGORIES: Record<StatKey, CategoryConfig> = {
  body: {
    key: "body",
    label: "Тело",
    hint: "Спорт, сон, еда, прогулки",
    color: "var(--color-body)",
    emoji: "💪",
  },
  mind: {
    key: "mind",
    label: "Разум",
    hint: "Чтение, учёба, навыки",
    color: "var(--color-mind)",
    emoji: "🧠",
  },
  discipline: {
    key: "discipline",
    label: "Дисциплина",
    hint: "Рутина, работа, привычки",
    color: "var(--color-discipline)",
    emoji: "🎯",
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export const DIFFICULTY_XP: Record<Difficulty, number> = {
  easy: 15,
  medium: 30,
  hard: 60,
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Лёгкая",
  medium: "Средняя",
  hard: "Сложная",
};
