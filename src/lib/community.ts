// Shared bounds and server-time focus accounting. No rewards for posts or page views.
export class CommunityError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function textField(value: unknown, max: number, optional = false): string {
  if (typeof value !== 'string' || value.trim().length > max || (!optional && !value.trim())) throw new CommunityError(`Проверь текст: от ${optional ? 0 : 1} до ${max} символов`);
  return value.trim();
}
export function linesField(value: unknown): string[] {
  if (!Array.isArray(value) || value.length > 8) throw new CommunityError('Можно указать до 8 пунктов');
  return [...new Set(value.map(v => textField(v, 120)))];
}
export function focusCredit(lastSeenAt: Date, endsAt: Date, now: Date) {
  const elapsed = (now.getTime() - lastSeenAt.getTime()) / 1000;
  // Gaps over 90s mean the tab was closed/backgrounded. Client cannot supply elapsed time.
  if (elapsed < 10 || elapsed > 90) return 0;
  return Math.max(0, Math.min(45, Math.floor((Math.min(now.getTime(), endsAt.getTime()) - lastSeenAt.getTime()) / 1000)));
}
export function focusRequired(startsAt: Date, endsAt: Date) {
  return Math.floor((endsAt.getTime() - startsAt.getTime()) / 1000 * 0.8);
}
