import type { Transition, Variants } from "framer-motion";

/**
 * Общие пресеты движения.
 *
 * Разрозненные `transition={{ duration: 0.2 }}` по компонентам делают
 * интерфейс несобранным: одно едет линейно, другое пружинит. Здесь единый
 * словарь — приложение начинает ощущаться как одна вещь, а не набор экранов.
 *
 * Пружины вместо длительностей: физика читается как «дорого», потому что
 * повторяет поведение реальных предметов, а не таймер.
 */

/** Основная пружина интерфейса: быстро выходит, мягко останавливается. */
export const spring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.8,
};

/** Мягче и медленнее — для крупных блоков и оверлеев. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 30,
};

/** Резкая, для мелких откликов (галочки, счётчики). */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 600,
  damping: 30,
};

/** С лёгким перелётом — для наград и «вау»-моментов (морф, конфетти, уровень). */
export const springBouncy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 20,
  mass: 0.9,
};

/**
 * Тактильная отдача — единая на всё приложение.
 *
 * Раньше navigator.vibrate вызывался вразнобой по компонентам с разными
 * магическими паттернами. Один хелпер = один язык ощущений: свайп, выбор,
 * успех и предупреждение отличаются на ощупь и везде одинаковы.
 * Молча ничего не делает там, где вибрации нет (десктоп, iOS Safari).
 */
type HapticKind = "light" | "select" | "medium" | "success" | "warning";

const HAPTIC_PATTERNS: Record<HapticKind, number | number[]> = {
  light: 8,
  select: 5,
  medium: 14,
  success: [10, 30, 20],
  warning: [22, 40, 22],
};

export function haptic(kind: HapticKind = "light"): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate?.(HAPTIC_PATTERNS[kind]);
  } catch {
    // некоторые браузеры бросают, если вибрация запрещена политикой — игнорируем
  }
}

/** Появление экрана: лёгкий подъём + проявление. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { ...springSoft } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.14 } },
};

/**
 * Контейнер списка: дети появляются каскадом.
 * Каскад важнее, чем кажется — он показывает структуру списка,
 * вместо того чтобы вываливать всё разом.
 */
export const listVariants: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.045, delayChildren: 0.02 },
  },
};

export const itemVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: spring },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

/** Появление карточки/секции снизу. */
export const riseVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: springSoft },
  exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
};
