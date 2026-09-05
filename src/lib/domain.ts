/**
 * YeahGrind — доменная модель.
 *
 * Ключевая идея продукта: пользователь не ведёт список из 50 задач.
 * Каждый день движок подбирает 3 действия под ТЕКУЩЕЕ состояние человека.
 * Поэтому у задачи гораздо больше параметров, чем "название + сложность":
 * они кормят scoring-движок (см. lib/recommendation.ts).
 */

/* ────────────────────────  Характеристики персонажа  ──────────────────────── */

/** 5 статов персонажа. Каждая категория действия качает свой стат. */
export type StatKey = "strength" | "intelligence" | "wealth" | "stability" | "health";

export interface StatConfig {
  key: StatKey;
  label: string;
  short: string;
  hint: string;
  color: string;
  /** hex-дубль для canvas/WebGL, где CSS-переменные недоступны */
  hex: string;
  icon: string;
}

export const STATS: Record<StatKey, StatConfig> = {
  strength: {
    key: "strength",
    label: "Сила",
    short: "STR",
    hint: "Спорт, сон, питание, тело",
    color: "var(--color-strength)",
    hex: "#cf8578",
    icon: "⚡",
  },
  intelligence: {
    key: "intelligence",
    label: "Интеллект",
    short: "INT",
    hint: "Учёба, чтение, навыки",
    color: "var(--color-intelligence)",
    hex: "#9a93cc",
    icon: "◈",
  },
  wealth: {
    key: "wealth",
    label: "Капитал",
    short: "WLT",
    hint: "Деньги, карьера, проекты",
    color: "var(--color-wealth)",
    hex: "#c9ad6f",
    icon: "◆",
  },
  stability: {
    key: "stability",
    label: "Стабильность",
    short: "STB",
    hint: "Рутина, порядок, спокойствие",
    color: "var(--color-stability)",
    hex: "#6fb39c",
    icon: "●",
  },
  health: {
    key: "health",
    label: "Здоровье",
    short: "HP",
    hint: "Сон, питание, восстановление, самочувствие",
    color: "var(--color-health)",
    hex: "#c2818f",
    icon: "❤️",
  },
};

export const STAT_LIST = Object.values(STATS);

/* ────────────────────────  Категории действий  ──────────────────────── */

export type CategoryKey =
  | "fitness"
  | "health"
  | "learning"
  | "creativity"
  | "money"
  | "career"
  | "discipline"
  | "mindfulness"
  | "social";

export interface CategoryConfig {
  key: CategoryKey;
  label: string;
  /** какой стат качает категория */
  stat: StatKey;
  icon: string;
}

export const CATEGORIES: Record<CategoryKey, CategoryConfig> = {
  fitness: { key: "fitness", label: "Спорт", stat: "strength", icon: "🏃" },
  health: { key: "health", label: "Здоровье", stat: "health", icon: "🌿" },
  learning: { key: "learning", label: "Учёба", stat: "intelligence", icon: "📚" },
  creativity: { key: "creativity", label: "Творчество", stat: "intelligence", icon: "🎨" },
  money: { key: "money", label: "Финансы", stat: "wealth", icon: "💰" },
  career: { key: "career", label: "Карьера", stat: "wealth", icon: "🚀" },
  discipline: { key: "discipline", label: "Дисциплина", stat: "stability", icon: "🎯" },
  mindfulness: { key: "mindfulness", label: "Осознанность", stat: "stability", icon: "🧘" },
  social: { key: "social", label: "Общение", stat: "stability", icon: "💬" },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

/* ────────────────────────  Параметры действия  ──────────────────────── */

/** 1 — совсем легко, 5 — требует серьёзного усилия. */
export type Difficulty = 1 | 2 | 3 | 4 | 5;

/** Сколько энергии требует действие. */
export type EnergyLevel = "low" | "medium" | "high";

/** Когда действие уместнее всего. */
export type TimePreference = "morning" | "afternoon" | "evening" | "any";

/** Насколько сильно действие двигает пользователя к цели. */
export type Impact = 1 | 2 | 3 | 4 | 5;

/**
 * Условия и контекст действия. Нужны, чтобы колода попадала не только
 * в «сколько сил», но и в обстоятельства: дома/на улице, нужен ли
 * инвентарь, сезон, делается одному или с людьми.
 */
export type ActionTag =
  | "outdoor" // нужно выйти на улицу
  | "home" // делается дома
  | "desk" // за рабочим столом
  | "nogear" // не нужно вообще ничего
  | "quiet" // требует тишины
  | "quickwin" // меньше 5 минут, мгновенная победа
  | "deepwork" // требует непрерывного блока
  | "withpeople" // нужен другой человек
  | "warm" // приятнее в тёплый сезон
  | "cold"; // приятнее в холодный сезон

/**
 * Ступень прогрессии — «лестница» одного навыка (20 → 30 → 50 отжиманий).
 * Движок не показывает следующую ступень, пока предыдущая не освоена,
 * и поднимает планку, когда человек стабильно закрывает текущую.
 */
export interface Progression {
  /** общий id лестницы для всех её ступеней */
  id: string;
  /** номер ступени, 1 — начальная */
  step: number;
}

/**
 * Действие — единица контента приложения.
 * Это НЕ "задача пользователя из списка", а карточка-кандидат,
 * которую движок может предложить сегодня.
 */
export interface Action {
  id: string;
  title: string;
  /** одна строка "почему это стоит сделать" — показываем на карточке */
  why: string;
  category: CategoryKey;
  difficulty: Difficulty;
  /** минуты */
  duration: number;
  energy: EnergyLevel;
  timePreference: TimePreference;
  impact: Impact;
  /** условия и контекст — фильтрация и связки между действиями */
  tags?: ActionTag[];
  /** ступень навыка, если действие часть лестницы */
  progression?: Progression;
  /** создана пользователем вручную (не из общего пула) */
  custom?: boolean;
}

/* ────────────────────────  Состояние пользователя  ──────────────────────── */

/** Ежедневный "чек-ин": как ты себя сегодня чувствуешь. */
export interface DailyMood {
  /** сколько сил сегодня */
  energy: EnergyLevel;
  /** сколько минут реально готов вложить */
  minutes: number;
}

export const DEFAULT_MOOD: DailyMood = { energy: "medium", minutes: 30 };

/** Долгосрочные приоритеты — вес каждого стата 0..1. */
export type GoalWeights = Record<StatKey, number>;

export const DEFAULT_GOALS: GoalWeights = {
  strength: 0.7,
  intelligence: 0.7,
  wealth: 0.5,
  stability: 0.5,
  health: 0.6,
};

/* ────────────────────────  Экономика XP  ──────────────────────── */

/**
 * XP считаем из параметров действия, а не из плоской таблицы:
 * сложность и impact весят больше, длительность — мягкий бонус.
 * Это делает "10 минут каждый день" осмысленным, а не убыточным.
 */
export function xpForAction(a: Pick<Action, "difficulty" | "impact" | "duration">) {
  const base = 8 + a.difficulty * 5 + a.impact * 4;
  const durationBonus = Math.round(Math.min(a.duration, 90) / 10);
  return base + durationBonus;
}

export const ENERGY_LABEL: Record<EnergyLevel, string> = {
  low: "Мало сил",
  medium: "Норма",
  high: "Полон сил",
};

export const ENERGY_RANK: Record<EnergyLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export const TIME_LABEL: Record<TimePreference, string> = {
  morning: "Утро",
  afternoon: "День",
  evening: "Вечер",
  any: "Любое время",
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  1: "Очень легко",
  2: "Легко",
  3: "Средне",
  4: "Сложно",
  5: "Вызов",
};

/** Текущий слот дня по часам — используется в timeMatch. */
export function currentSlot(d = new Date()): Exclude<TimePreference, "any"> {
  const h = d.getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

/** Локальный YYYY-MM-DD (без UTC-сдвига). */
export function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}
