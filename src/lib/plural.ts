/** Russian cardinal form, shared by UI and notifications. */
export function plural(
  n: number,
  one: string,
  few: string,
  many: string,
): string {
  const value = Math.abs(n);
  if (!Number.isInteger(value)) return few;
  const last = value % 10,
    lastTwo = value % 100;
  if (last === 1 && lastTwo !== 11) return one;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
  return many;
}
