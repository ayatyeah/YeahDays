import type { StatKey } from "./domain";

export interface TodoCategory {
  stat: StatKey;
  icon: string;
  subLabel?: string;
}

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

  // Здоровье — восстановление и самочувствие: сон, питание, дыхание, растяжка.
  if (/медитац/.test(t)) return { stat: "health", icon: "🧘" };
  if (/^sleep\b|сон/.test(t)) return { stat: "health", icon: "😴" };
  if (/дыхательн/.test(t)) return { stat: "health", icon: "🌬️" };
  if (/обед|завтрак|перекус|ужин/.test(t)) return { stat: "health", icon: "🍽️" };
  if (/растяжк|mobility/.test(t)) return { stat: "health", icon: "🤸" };

  // Стабильность — рутина и организация дня, не про здоровье как таковое.
  if (/душ/.test(t)) return { stat: "stability", icon: "🚿" };
  if (/подъём|подъем/.test(t)) return { stat: "stability", icon: "⏰" };
  if (/буфер|перерыв|пауза/.test(t)) return { stat: "stability", icon: "⏸️" };

  if (/interview|интервью|собеседован/.test(t)) {
    return { stat: "intelligence", icon: "🗣️", subLabel: "Собеседования" };
  }
  if (/english|английск/.test(t)) {
    return { stat: "intelligence", icon: "📖", subLabel: "Английский" };
  }
  if (/^ts:|typescript|\bnode\b|\bnpm\b|\bgit\b|react|массив|строки|базовые типы|^js:|javascript|алгоритм/.test(t)) {
    return { stat: "intelligence", icon: "💻", subLabel: "Код" };
  }

  // Сила — активная физическая нагрузка, отдельно от восстановления (health).
  if (/push:|pull:|legs:|тренировк|бег|running|гантел|фитнес/.test(t)) {
    return { stat: "strength", icon: "💪", subLabel: "Спорт" };
  }

  if (/yeahgrind|репо|проект|tiktok|съёмка|монтаж|didi/.test(t)) {
    return { stat: "wealth", icon: "🛠️", subLabel: "Проект" };
  }

  return { stat: "stability", icon: "•" };
}

export function fmtDuration(mins: number): string {
  if (mins < 60) return `${mins}м`;
  if (mins % 60 === 0) return `${mins / 60}ч`;
  return `${Math.floor(mins / 60)}ч${mins % 60}м`;
}
