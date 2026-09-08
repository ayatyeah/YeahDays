/**
 * Выгрузка расписания в файл календаря (RFC 5545).
 *
 * Зачем: приложение знает расписание целиком, но живёт оно только внутри
 * приложения. Тот же файл, открытый в системном календаре, кладёт пары на
 * экран блокировки, в виджеты и в системные напоминания — без установки
 * чего-либо ещё. Односторонний экспорт: обратно ничего не читаем.
 *
 * Разбор чужих календарей у нас уже есть (src/lib/ical.ts, для LMS), но
 * это обратная задача — сборка, и правила тут другие: экранирование,
 * длина строк, повторы. Поэтому отдельный модуль.
 */

import { isTodoOnDay, isTodoDone, type Todo } from "@/store/useUserStore";
import { todoStartMin, todoEndMin } from "./todoSpan";

/** Экранирование по RFC 5545: запятая, точка с запятой, обратный слэш, перевод строки. */
function esc(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Строки длиннее 75 октетов складываются с пробелом в начале продолжения.
 * Календарь iPhone к этому строг: без свёртки длинное название пары может
 * просто потеряться.
 */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    parts.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest) parts.push(" " + rest);
  return parts.join("\r\n");
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Локальное время в формате календаря: 20260909T160000. */
function stamp(day: string, minutes: number): string {
  const [y, m, d] = day.split("-").map(Number);
  // минуты могут перевалить за полночь (пара с 23:30) — Date сам перенесёт день
  const dt = new Date(y!, m! - 1, d!, 0, minutes);
  return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
}

export interface IcsOptions {
  /** сколько дней вперёд выгружать */
  days?: number;
  from?: Date;
  /** имя календаря, как он подпишется в системе */
  name?: string;
}

/**
 * Расписание на ближайшие дни одним файлом.
 *
 * Повторы разворачиваем в отдельные события, а не пишем RRULE: у нас есть
 * свои отмены отдельных дней (skipDays) и «через день» с якорем, которые в
 * правило RFC не укладываются без EXDATE и хитрого INTERVAL. Развёрнутый
 * список на пару недель весит килобайты и всегда точен.
 *
 * Выполненные задачи и события LMS пропускаем: первые уже не нужны, вторые
 * и так лежат в календаре университета.
 */
export function buildIcs(todos: Todo[], { days = 21, from = new Date(), name = "YeahGrind" }: IcsOptions = {}): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YeahGrind//Schedule//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(name)}`,
  ];

  const now = `${stamp(`${from.getFullYear()}-${pad(from.getMonth() + 1)}-${pad(from.getDate())}`, from.getHours() * 60 + from.getMinutes())}`;

  for (let i = 0; i < days; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    for (const t of todos) {
      if (t.hour === undefined || t.source === "lms") continue;
      if (!isTodoOnDay(t, key) || isTodoDone(t, key)) continue;

      const start = todoStartMin(t);
      const end = todoEndMin(t);
      if (start === null || end === null) continue;

      lines.push(
        "BEGIN:VEVENT",
        // UID обязан быть стабильным: повторный импорт того же файла
        // обновит событие, а не создаст второе.
        `UID:${t.id}-${key}@yeahgrind`,
        `DTSTAMP:${now}`,
        `DTSTART:${stamp(key, start)}`,
        `DTEND:${stamp(key, end)}`,
        fold(`SUMMARY:${esc(t.title)}`),
      );
      if (t.note) lines.push(fold(`DESCRIPTION:${esc(t.note)}`));
      lines.push("END:VEVENT");
    }
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
