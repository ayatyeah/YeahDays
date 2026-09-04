/**
 * Минимальный парсер iCalendar (RFC 5545) — ровно столько, сколько нужно,
 * чтобы разобрать выгрузку календаря Moodle. Не библиотека общего
 * назначения: VTIMEZONE, RRULE, VALARM и прочее сознательно не трогаем,
 * потому что Moodle в экспорте дедлайнов их не присылает.
 *
 * Почему свой парсер, а не пакет с npm: нужно ~150 строк, а любой
 * ical-пакет тянет зависимости в проект, где их ровно столько, сколько
 * нужно. Плюс здесь всё под тестами и видно, что именно происходит с
 * временными зонами — а в дедлайнах это главное.
 */

export interface IcalDate {
  /** Событие на весь день (VALUE=DATE) — времени в нём нет. */
  allDay: boolean;
  utcMs: number;
}

export interface IcalProperty {
  name: string;
  params: Record<string, string>;
  value: string;
}

export interface IcalEvent {
  uid: string;
  summary: string;
  description: string;
  categories: string[];
  start: IcalDate | null;
  end: IcalDate | null;
}

/**
 * Склейка перенесённых строк. RFC 5545 требует резать строки длиннее 75
 * октетов и продолжать их со ВЕДУЩЕГО пробела/таба. Moodle так и делает с
 * длинными DESCRIPTION. Если не склеить до разбора, длинное описание
 * развалится на мусорные "свойства" без двоеточия.
 */
export function unfold(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n[ \t]/g, "");
}

/**
 * Развернуть экранирование TEXT-значения: \n и \N — перевод строки,
 * \\ \, \; — сами символы. Идём одним проходом слева направо, а не
 * цепочкой .replace() — иначе "\\n" (экранированный бэкслеш + буква n)
 * превратился бы в перевод строки вместо литерала.
 */
export function unescapeText(value: string): string {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    if (value[i] === "\\" && i + 1 < value.length) {
      const next = value[++i];
      out += next === "n" || next === "N" ? "\n" : next;
    } else {
      out += value[i];
    }
  }
  return out;
}

/**
 * Разбить строку свойства на "имя+параметры" и "значение" по первому
 * двоеточию ВНЕ кавычек. Двоеточие законно встречается внутри параметра
 * (например TZID="GMT+05:00"), поэтому простой indexOf(":") ошибётся.
 */
function splitAtValue(line: string): [string, string] | null {
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') quoted = !quoted;
    else if (ch === ":" && !quoted) return [line.slice(0, i), line.slice(i + 1)];
  }
  return null;
}

/** То же правило кавычек, но для разделения параметров точкой с запятой. */
function splitParams(head: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quoted = false;
  for (const ch of head) {
    if (ch === '"') {
      quoted = !quoted;
      current += ch;
    } else if (ch === ";" && !quoted) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts;
}

/** `SUMMARY;LANGUAGE=en:Текст` → `{ name, params, value }`. */
export function parseLine(line: string): IcalProperty | null {
  const split = splitAtValue(line);
  if (!split) return null;
  const [head, value] = split;
  const [name, ...paramParts] = splitParams(head);

  const params: Record<string, string> = {};
  for (const part of paramParts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    params[part.slice(0, eq).toUpperCase()] = part.slice(eq + 1).replace(/^"|"$/g, "");
  }

  return { name: name.toUpperCase(), params, value };
}

/**
 * Смещение зоны от UTC в миллисекундах на конкретный момент времени.
 * Считаем через Intl, а не таблицей констант: Казахстан в марте 2024 свёл
 * страну в одну зону UTC+5, и захардкоженное смещение однажды снова
 * протухнет. Intl берёт актуальную базу из системы.
 */
function zoneOffsetMs(utcMs: number, timeZone: string): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const { type, value } of fmt.formatToParts(new Date(utcMs))) p[type] = value;
  // hour приходит как "24" для полуночи в некоторых версиях ICU — % 24.
  const asIfUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return asIfUtc - utcMs;
}

/**
 * "Стенное" время в зоне → момент UTC. Два прохода нужны из-за переходов
 * на летнее время: смещение зависит от момента, а момент — от смещения.
 * Первый проход даёт приближение, второй уточняет его окрестность.
 */
export function zonedWallToUtc(
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
  s: number,
  timeZone: string,
): number {
  const naive = Date.UTC(y, mo - 1, d, h, mi, s);
  const firstPass = naive - zoneOffsetMs(naive, timeZone);
  return naive - zoneOffsetMs(firstPass, timeZone);
}

export interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

/** Момент UTC → календарные поля в нужной зоне. */
export function partsInZone(utcMs: number, timeZone: string): ZonedParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const { type, value } of fmt.formatToParts(new Date(utcMs))) p[type] = value;
  return {
    year: +p.year,
    month: +p.month,
    day: +p.day,
    hour: +p.hour % 24,
    minute: +p.minute,
  };
}

/**
 * DTSTART/DTEND в момент UTC. Три формы значения, и разница между ними
 * принципиальна:
 *   20260915          — VALUE=DATE, событие на весь день, времени нет
 *   20260915T185900Z  — UTC (именно так отдаёт Moodle)
 *   20260915T235900   — "плавающее" либо с TZID=...
 * Для плавающего без TZID берём зону, в которой живёт пользователь, —
 * другого разумного варианта нет.
 */
export function parseDateValue(
  value: string,
  params: Record<string, string>,
  fallbackZone: string,
): IcalDate | null {
  if (params.VALUE === "DATE" || /^\d{8}$/.test(value)) {
    const y = +value.slice(0, 4);
    const mo = +value.slice(4, 6);
    const d = +value.slice(6, 8);
    return { allDay: true, utcMs: Date.UTC(y, mo - 1, d) };
  }

  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/.exec(value);
  if (!m) return null;

  const [, y, mo, d, h, mi, s, zulu] = m;
  if (zulu === "Z") {
    return { allDay: false, utcMs: Date.UTC(+y, +mo - 1, +d, +h, +mi, +s) };
  }

  const zone = params.TZID || fallbackZone;
  return { allDay: false, utcMs: zonedWallToUtc(+y, +mo, +d, +h, +mi, +s, zone) };
}

/**
 * Разобрать календарь в список событий.
 *
 * Возвращает сырые поля VEVENT, без интерпретации под Moodle — маппинг в
 * задачи YeahGrind живёт отдельно (src/lib/lmsCalendar.ts), чтобы его
 * можно было менять, не трогая разбор формата.
 */
export function parseEvents(icsText: string, fallbackZone = "UTC"): IcalEvent[] {
  const events: IcalEvent[] = [];
  let current: IcalEvent | null = null;

  for (const rawLine of unfold(icsText).split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line === "BEGIN:VEVENT") {
      current = { uid: "", summary: "", description: "", categories: [], start: null, end: null };
      continue;
    }
    if (line === "END:VEVENT") {
      if (current) events.push(current);
      current = null;
      continue;
    }
    if (!current) continue;

    const prop = parseLine(line);
    if (!prop) continue;

    switch (prop.name) {
      case "UID":
        current.uid = prop.value;
        break;
      case "SUMMARY":
        current.summary = unescapeText(prop.value);
        break;
      case "DESCRIPTION":
        current.description = unescapeText(prop.value);
        break;
      case "CATEGORIES":
        // Одно свойство может нести несколько значений через запятую;
        // экранированная запятая (\,) внутри названия курса — не разделитель.
        current.categories = prop.value
          .split(/(?<!\\),/)
          .map((c) => unescapeText(c).trim())
          .filter(Boolean);
        break;
      case "DTSTART":
        current.start = parseDateValue(prop.value, prop.params, fallbackZone);
        break;
      case "DTEND":
        current.end = parseDateValue(prop.value, prop.params, fallbackZone);
        break;
      default:
        break;
    }
  }

  return events;
}
