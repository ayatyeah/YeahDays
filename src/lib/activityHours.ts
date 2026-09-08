/**
 * В какие часы человек реально закрывает дела.
 *
 * Приложение давно пишет время каждого выполнения, но нигде его не
 * показывает. А это единственная статистика, которую нельзя получить из
 * головы: люди уверены, что продуктивны утром, и удивляются, увидев, что
 * закрывают всё после девяти вечера. Отсюда практический вывод — куда
 * ставить сложное.
 *
 * Считаем по отметкам выполнения: у взятых действий (plan) и у разовых
 * задач. У повторяющихся задач времени нет вовсе — там хранятся только
 * дни, — поэтому они в расчёт не идут.
 */

export interface HourBucket {
  hour: number;
  count: number;
}

export interface ActivityProfile {
  hours: HourBucket[];
  total: number;
  /** час с наибольшим числом закрытий; null — данных ещё нет */
  peak: number | null;
}

interface Completable {
  completedAt?: number | null;
}

export function activityByHour(
  sources: Completable[][],
  now = new Date(),
  days = 30,
): ActivityProfile {
  const since = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days + 1).getTime();
  const hours: HourBucket[] = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
  let total = 0;

  for (const list of sources) {
    for (const item of list) {
      const at = item.completedAt;
      if (!at || at < since) continue;
      const h = new Date(at).getHours();
      hours[h]!.count += 1;
      total += 1;
    }
  }

  let peak: number | null = null;
  for (const b of hours) {
    if (b.count > 0 && (peak === null || b.count > hours[peak]!.count)) peak = b.hour;
  }

  return { hours, total, peak };
}

/** «21:00–22:00» — окно часа, а не точка: так читается как промежуток. */
export function hourWindow(hour: number): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(hour)}:00–${p((hour + 1) % 24)}:00`;
}
