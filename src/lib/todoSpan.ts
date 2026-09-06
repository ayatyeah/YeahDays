/**
 * Протяжённость задачи во времени — в минутах от полуночи.
 *
 * Расписание раскладывает задачи ПО ЧАСУ НАЧАЛА (см. hourRows в
 * TimelineSchedule): пиксельной математики по длительности там нет
 * осознанно, строки разной высоты. Но длительность всё равно должна быть
 * видна: двухчасовая лекция в 11:00 накрывает и 12:00, и без этого второй
 * час выглядит свободным — ровно та путаница, с которой всё началось.
 *
 * Отсюда две функции: где задача начинается и где кончается, — и третья:
 * какие часы после часа старта она ещё занимает. По ним расписание рисует
 * продолжение в накрытых часах, а «сейчас/далее/просрочено» сравнивают
 * минуты, а не номер часа.
 */

export interface SpanTodo {
  hour?: number;
  minute?: number;
  duration?: number;
}

/** Минута начала. Для задачи без часа — null. */
export function todoStartMin(t: SpanTodo): number | null {
  if (t.hour == null) return null;
  return t.hour * 60 + (t.minute ?? 0);
}

/**
 * Минута конца. Без длительности — граница часа старта: так задача
 * «на 14:00» без минут остаётся делом часа 14, как и было до этого,
 * и не становится просроченной в 14:01.
 */
export function todoEndMin(t: SpanTodo): number | null {
  const start = todoStartMin(t);
  if (start === null) return null;
  if (t.duration && t.duration > 0) return start + t.duration;
  return (t.hour! + 1) * 60;
}

/**
 * Часы ПОСЛЕ часа старта, которые задача ещё занимает. Час старта не
 * включён — там задача и так стоит своей карточкой. Обрезается по
 * maxHour (последний видимый час сетки) и по 23.
 */
export function hoursCoveredAfterStart(t: SpanTodo, maxHour = 23): number[] {
  const end = todoEndMin(t);
  if (end === null || t.hour == null) return [];
  const out: number[] = [];
  for (let h = t.hour + 1; h <= Math.min(maxHour, 23); h++) {
    // час h занят, если задача ещё идёт в момент его начала
    if (h * 60 < end) out.push(h);
    else break;
  }
  return out;
}

/** "12:50" из минут от полуночи. */
export function fmtMin(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
