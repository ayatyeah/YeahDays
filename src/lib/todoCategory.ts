import type { StatKey } from "./domain";
import type { Todo, TodoPriority } from "@/store/useUserStore";
import type { YgIconName } from "@/components/yg-icons";

export interface TodoCategory {
  stat: StatKey;
  icon: YgIconName;
  subLabel?: string;
}

/**
 * XP за выполненную почасовую задачу — тот же общий пул и уровень, что и
 * у колоды (карточек), не отдельная параллельная валюта. Величины ниже
 * шкалы xpForAction() (~17-62): задача заводится в два клика, без ввода
 * сложности/impact/длительности как у полноценного действия, поэтому
 * не должна перевешивать основной цикл колоды.
 *
 * Живёт здесь, а не в useUserStore.ts — тот файл клиентский ("use client"),
 * а эта константа нужна и серверным роутам (движок рекомендаций читает её
 * при подсчёте вклада задач календаря, см. recentTodoStatXp ниже).
 */
export const TODO_PRIORITY_XP: Record<TodoPriority, number> = {
  low: 8,
  normal: 14,
  high: 22,
};

/**
 * Стат/иконка по заголовку задачи. У Todo нет отдельного поля категории
 * (это не Action из движка рекомендаций, а свободный пункт плана) —
 * угадываем по ключевым словам в названии, как уже делает anchorIcon() в
 * HomeSection для якорей маршрута.
 *
 * Это ЕДИНСТВЕННОЕ место, которое решает, в какой стат идёт задача — тот
 * же результат используется и для подписи на карточке, и для начисления
 * XP (useUserStore.selectTodoStats). Раньше это были два независимых
 * алгоритма (карточка — по словам в названии, XP — по часу дня), из-за
 * чего показанный на карточке стат мог не совпадать с тем, что реально
 * прокачивалось при выполнении.
 *
 * \b (граница слова) в JS регэкспах считает словом только [A-Za-z0-9_] —
 * кириллица для \b невидима, и "\bбег\b" тихо НЕ матчит "бег" вообще
 * (с обеих сторон "не-\w"). Поэтому у кириллических ключевых слов ниже —
 * просто вхождение подстроки, без \b; \b оставлен только там, где слово
 * латиницей (sleep/node/npm/git/ts/js).
 *
 * Нераспознанные заголовки — фолбэк "stability" (не "без стата"): иначе
 * общий XP (selectTodoXp) и сумма по статам (selectTodoStats) разошлись
 * бы у задач без совпавших ключевых слов.
 */
export function categorizeTodo(title: string): TodoCategory {
  const t = title.toLowerCase();

  // Университет — пары из расписания и события LMS. Идут первыми: в
  // названиях пар («Cloud Computing — практика, 307K») нет слов из остальных
  // правил, а вот «Attendance» и «Assignment» из LMS иначе падали бы в «•».
  // Порядок внутри: экзамен и дедлайны важнее формы занятия.
  if (/экзамен|\bexam|midterm|final\b|зачёт|зачет/.test(t)) {
    return { stat: "intelligence", icon: "exam", subLabel: "Экзамен" };
  }
  if (/attendance|посещаем/.test(t)) {
    return { stat: "intelligence", icon: "attendance", subLabel: "Посещаемость" };
  }
  if (/assignment|quiz|дедлайн|deadline|\bdue\b|homework|домашк|\bдз\b|сдать/.test(t)) {
    return { stat: "intelligence", icon: "assignment", subLabel: "Дедлайн" };
  }
  if (/лекци|lecture/.test(t)) {
    return /онлайн|online/.test(t)
      ? { stat: "intelligence", icon: "online", subLabel: "Лекция онлайн" }
      : { stat: "intelligence", icon: "lecture", subLabel: "Лекция" };
  }
  if (/практик|practice|семинар|seminar|\bлаб|\blab\b/.test(t)) {
    return /онлайн|online/.test(t)
      ? { stat: "intelligence", icon: "online", subLabel: "Практика онлайн" }
      : { stat: "intelligence", icon: "practice", subLabel: "Практика" };
  }
  if (/\bпара\b|универ|\bуник\b|кампус|campus|\bвуз\b/.test(t)) {
    return { stat: "intelligence", icon: "campus", subLabel: "Пара" };
  }

  // Здоровье — восстановление и самочувствие: сон, питание, дыхание, растяжка.
  if (/медитац/.test(t)) return { stat: "health", icon: "lotus" };
  if (/^sleep\b|сон/.test(t)) return { stat: "health", icon: "moon" };
  if (/дыхательн/.test(t)) return { stat: "health", icon: "wind" };
  if (/обед|завтрак|перекус|ужин/.test(t)) return { stat: "health", icon: "meal" };
  if (/растяжк|mobility/.test(t)) return { stat: "health", icon: "stretch" };

  // Стабильность — рутина и организация дня, не про здоровье как таковое.
  if (/душ/.test(t)) return { stat: "stability", icon: "drop" };
  if (/подъём|подъем/.test(t)) return { stat: "stability", icon: "alarm" };
  if (/буфер|перерыв|пауза/.test(t)) return { stat: "stability", icon: "pause" };

  if (/interview|интервью|собеседован/.test(t)) {
    return { stat: "intelligence", icon: "mic", subLabel: "Собеседования" };
  }
  if (/english|английск/.test(t)) {
    return { stat: "intelligence", icon: "book", subLabel: "Английский" };
  }
  if (/^ts:|typescript|\bnode\b|\bnpm\b|\bgit\b|react|flutter|\bdart\b|массив|строки|базовые типы|^js:|javascript|алгоритм/.test(t)) {
    return { stat: "intelligence", icon: "code", subLabel: "Код" };
  }

  // Сила — активная физическая нагрузка, отдельно от восстановления (health).
  // «турник, отжимания, брусья, зарядка» — то, чем план и заполнен; без
  // них зарядка уходила в «дисциплину» и карточка из плана шла не в «Спорт».
  if (
    /push:|pull:|legs:|тренировк|бег|running|гантел|фитнес|турник|брусья|отжиман|подтягива|зарядк|разминк|пробежк|качалк|спортзал|\bзал\b/.test(
      t,
    )
  ) {
    return { stat: "strength", icon: "dumbbell", subLabel: "Спорт" };
  }

  if (/yeahgrind|репо|проект|tiktok|съёмка|монтаж/.test(t)) {
    return { stat: "wealth", icon: "wrench", subLabel: "Проект" };
  }

  return { stat: "stability", icon: "dot" };
}

export function fmtDuration(mins: number): string {
  if (mins < 60) return `${mins}м`;
  if (mins % 60 === 0) return `${mins / 60}ч`;
  return `${Math.floor(mins / 60)}ч${mins % 60}м`;
}

/**
 * Вклад задач календаря в статы за недавнее окно — сигнал для баланса
 * движка рекомендаций (goalMatch в recommendation.ts), НЕ для отображения
 * "Прогресса" (там нужна useUserStore.selectTodoStats — за всё время).
 * Окно, а не всё время: иначе накопленный за месяцы план (например,
 * 100-дневный) задавил бы вклад обычных действий из колоды — движок "видел"
 * бы только календарь, а не текущий, свежий баланс поведения.
 */
export function recentTodoStatXp(
  todos: Todo[],
  sinceMs: number,
): Partial<Record<StatKey, number>> {
  const out: Partial<Record<StatKey, number>> = {};
  const bump = (stat: StatKey, xp: number) => {
    out[stat] = (out[stat] ?? 0) + xp;
  };

  for (const t of todos) {
    const stat = categorizeTodo(t.title).stat;
    const xp = TODO_PRIORITY_XP[t.priority];
    if (t.repeat) {
      for (const day of t.doneDays) {
        if (new Date(`${day}T00:00:00`).getTime() >= sinceMs) bump(stat, xp);
      }
    } else if (t.done && t.completedAt != null && t.completedAt >= sinceMs) {
      bump(stat, xp);
    }
  }

  return out;
}
