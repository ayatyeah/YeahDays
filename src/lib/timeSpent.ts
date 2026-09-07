/**
 * Куда уходит неделя — свод по задачам с часом.
 *
 * Характеристики персонажа отвечают на «что я качаю», но не на «куда
 * физически уходит время». У человека с расписанием пар второе честнее:
 * видно, что Cloud Computing забирает вдвое больше часов, чем собственный
 * проект, — и это повод либо смириться, либо переставить.
 *
 * Предмет берём из названия: у пар оно вида «Cloud Computing — практика,
 * 307K (Korkem)» или «Philosophy: Attendance (Group SE-2425)», то есть до
 * первого тире или двоеточия стоит именно предмет. Для остальных задач
 * предметом становится всё название целиком — «Завтрак» и «Душ» так и
 * останутся собой.
 */

import { isTodoOnDay, isTodoDone, type Todo } from "@/store/useUserStore";
import { categorizeTodo } from "./todoCategory";
import type { YgIconName } from "@/components/yg-icons";
import type { StatKey } from "./domain";

export interface SpentBucket {
  subject: string;
  minutes: number;
  /** сколько из них уже отмечено сделанным */
  doneMinutes: number;
  stat: StatKey;
  icon: YgIconName;
}

/** Название предмета из полного названия задачи. */
export function subjectOf(title: string): string {
  const cut = title.split(/\s+[—–-]\s+|:\s+/)[0] ?? title;
  return cut.trim().replace(/\s*\(.*\)$/, "").trim() || title.trim();
}

/** YYYY-MM-DD за N дней до даты (включая саму дату как день 0). */
function dayKeysBack(days: number, from = new Date()): string[] {
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() - i);
    const p = (n: number) => String(n).padStart(2, "0");
    out.push(`${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`);
  }
  return out;
}

/**
 * Свод за последние `days` дней, по убыванию минут.
 *
 * Повторяющиеся задачи считаются в каждый день, где они выпадают, — иначе
 * ежедневная зарядка весила бы столько же, сколько разовая встреча.
 */
export function timeSpentBySubject(
  todos: Todo[],
  days = 7,
  from = new Date(),
): SpentBucket[] {
  const keys = dayKeysBack(days, from);
  const map = new Map<string, SpentBucket>();

  for (const t of todos) {
    if (t.hour === undefined) continue;
    const minutes = t.duration ?? 60;
    const subject = subjectOf(t.title);
    for (const key of keys) {
      if (!isTodoOnDay(t, key)) continue;
      const kind = categorizeTodo(t.title);
      const b =
        map.get(subject) ??
        { subject, minutes: 0, doneMinutes: 0, stat: kind.stat, icon: kind.icon };
      b.minutes += minutes;
      if (isTodoDone(t, key)) b.doneMinutes += minutes;
      map.set(subject, b);
    }
  }

  return [...map.values()].sort((a, b) => b.minutes - a.minutes);
}

/** «6 ч 30 мин» / «45 мин» — для подписи под полоской. */
export function fmtHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} мин`;
  if (m === 0) return `${h} ч`;
  return `${h} ч ${m} мин`;
}
