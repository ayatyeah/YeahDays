/**
 * Что и когда напоминать — чистая логика, без браузера и без сети.
 *
 * Смысл разделения: планирование уведомлений — это правила продукта
 * («половина времени», «дольше плана», «за 5 минут до задачи»), а не работа
 * с Push API. Правила отделены, поэтому их видно, их можно менять и на них
 * есть тесты; транспорт (service worker / web-push) живёт отдельно.
 *
 * Главный принцип текстов: уведомление говорит КОНКРЕТНО про то, что сейчас
 * происходит («Отжимания идут 25 минут»), а не «зайди в приложение». Второе
 * человек выключает после третьего раза.
 */

export type NotifyKind = "task" | "todo" | "day";

export interface NotifyItem {
  /** ключ идемпотентности: пересоздание не плодит дубли */
  key: string;
  /** когда показать (мс) */
  at: number;
  title: string;
  body: string;
  /** куда вести по нажатию */
  url: string;
  kind: NotifyKind;
  /** id задачи плана — для кнопки «Сделал» прямо из уведомления */
  taskId?: string;
}

export interface NotifyPrefs {
  /** утро и вечер — общий ритм дня */
  daily: boolean;
  /** ход активной задачи */
  tasks: boolean;
  /** задачи, привязанные ко времени */
  todos: boolean;
  /** тихие часы: с какого локального часа */
  quietFrom: number;
  /** до какого локального часа */
  quietTo: number;
}

export const DEFAULT_NOTIFY: NotifyPrefs = {
  daily: true,
  tasks: true,
  todos: true,
  quietFrom: 23,
  quietTo: 7,
};

/** За сколько минут до задачи со временем предупреждать. */
export const TODO_LEAD_MIN = 5;

/** Через сколько после взятия считать, что про задачу забыли. */
const STALE_AFTER_MS = 3 * 3600_000;

/**
 * Попадает ли час в тихие часы. Интервал может проходить через полночь
 * (23 → 7), поэтому обычное сравнение здесь не работает.
 */
export function inQuietHours(
  hour: number,
  from: number,
  to: number,
): boolean {
  if (from === to) return false;
  return from < to ? hour >= from && hour < to : hour >= from || hour < to;
}

/** Сдвинуть время из тихих часов на утро — уведомление не теряется. */
export function shiftOutOfQuiet(at: number, prefs: NotifyPrefs): number {
  const d = new Date(at);
  if (!inQuietHours(d.getHours(), prefs.quietFrom, prefs.quietTo)) return at;
  const out = new Date(at);
  // если тихие часы уже перевалили за полночь — просыпаемся сегодня,
  // иначе завтра утром
  if (d.getHours() >= prefs.quietFrom && prefs.quietFrom > prefs.quietTo) {
    out.setDate(out.getDate() + 1);
  }
  out.setHours(prefs.quietTo, 0, 0, 0);
  return out.getTime();
}

/* ────────────────────────  Активная задача  ──────────────────────── */

export interface ActiveTaskInput {
  id: string;
  title: string;
  /** заявленная длительность в минутах */
  duration: number;
  /** когда взята в план (мс) */
  acceptedAt: number;
}

/** «7 мин» / «1 ч 5 мин» — для текста уведомления. */
export function humanMinutes(min: number): string {
  const m = Math.max(1, Math.round(min));
  if (m < 60) return `${m} мин`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} ч ${rest} мин` : `${h} ч`;
}

/**
 * Ход активной задачи.
 *
 * Три момента, в которые напоминание уместно, и ни одного лишнего:
 *  — половина заявленного времени (только для длинных задач: на пятиминутке
 *    это дёрганье);
 *  — время вышло — момент, когда честнее всего спросить «закрываем?»;
 *  — заметно дольше плана — сигнал, что задача застряла;
 *  — и «висит третий час» для случая, когда про неё просто забыли.
 */
export function taskNotifications(
  task: ActiveTaskInput,
  prefs: NotifyPrefs = DEFAULT_NOTIFY,
): NotifyItem[] {
  if (!prefs.tasks) return [];

  const planned = Math.max(0, task.duration) * 60_000;
  const items: NotifyItem[] = [];
  const base = { url: "/app", kind: "task" as const, taskId: task.id };

  if (planned >= 20 * 60_000) {
    items.push({
      ...base,
      key: `task:${task.id}:half`,
      at: task.acceptedAt + planned / 2,
      title: "Половина времени",
      body: `«${task.title}» — прошла половина от ${humanMinutes(task.duration)}.`,
    });
  }

  if (planned > 0) {
    items.push({
      ...base,
      key: `task:${task.id}:end`,
      at: task.acceptedAt + planned,
      title: "Время задачи вышло",
      body: `«${task.title}» — ${humanMinutes(task.duration)} прошли. Закрываем?`,
    });

    items.push({
      ...base,
      key: `task:${task.id}:over`,
      at: task.acceptedAt + planned + Math.max(10 * 60_000, planned * 0.5),
      title: "Задача идёт дольше плана",
      body: `«${task.title}» всё ещё открыта. Доделать или снять?`,
    });
  }

  items.push({
    ...base,
    key: `task:${task.id}:stale`,
    at: task.acceptedAt + STALE_AFTER_MS,
    title: "Задача так и висит",
    body: `«${task.title}» взята, но не закрыта. Даже две минуты считаются.`,
  });

  return items;
}

/* ────────────────────────  Задачи со временем  ──────────────────────── */

export interface TodoInput {
  id: string;
  title: string;
  /** день YYYY-MM-DD */
  day: string;
  /** локальный час начала */
  hour: number;
  /** сколько минут заложено */
  duration?: number;
}

/** Напоминание за TODO_LEAD_MIN до начала задачи, привязанной ко времени. */
export function todoNotification(todo: TodoInput): NotifyItem | null {
  const [y, m, d] = todo.day.split("-").map(Number);
  if (!y || !m || !d) return null;
  const at =
    new Date(y, m - 1, d, todo.hour, 0, 0, 0).getTime() -
    TODO_LEAD_MIN * 60_000;

  return {
    key: `todo:${todo.id}:${todo.day}`,
    at,
    title: `Через ${TODO_LEAD_MIN} минут`,
    body: todo.duration
      ? `${todo.title} · ${humanMinutes(todo.duration)}`
      : todo.title,
    url: "/today",
    kind: "todo",
  };
}

/* ────────────────────────  Сборка расписания  ──────────────────────── */

export interface ScheduleInput {
  active: ActiveTaskInput | null;
  todos: TodoInput[];
  prefs: NotifyPrefs;
  now: number;
}

/**
 * Полное расписание на ближайшее время.
 *
 * Отбрасываем всё, что уже в прошлом (иначе при открытии приложения
 * прилетал бы залп из просроченных напоминаний) и всё, что попадает в
 * тихие часы — задачи переносим на утро, а «ход задачи» просто отменяем:
 * будить ночью ради таймера бессмысленно.
 */
export function buildSchedule(input: ScheduleInput): NotifyItem[] {
  const { active, todos, prefs, now } = input;
  const out: NotifyItem[] = [];

  if (active) {
    for (const item of taskNotifications(active, prefs)) {
      if (item.at <= now) continue;
      if (inQuietHours(new Date(item.at).getHours(), prefs.quietFrom, prefs.quietTo)) {
        continue;
      }
      out.push(item);
    }
  }

  if (prefs.todos) {
    for (const todo of todos) {
      const item = todoNotification(todo);
      if (!item || item.at <= now) continue;
      out.push({ ...item, at: shiftOutOfQuiet(item.at, prefs) });
    }
  }

  return out.sort((a, b) => a.at - b.at);
}
