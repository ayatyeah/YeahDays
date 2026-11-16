export const EVENT_DESIGNS = ['prime', 'ocean', 'sunset'] as const;
export type EventDesign = typeof EVENT_DESIGNS[number];
export type EventAppearance = { owner: string; design: EventDesign };
export function validEventAppearance(value: unknown): value is EventAppearance {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.owner === 'string' && v.owner.length > 0 && EVENT_DESIGNS.includes(v.design as EventDesign);
}
