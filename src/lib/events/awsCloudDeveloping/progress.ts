import counts from './optionCounts.json';
export type AwsAnswers = Record<string, number[]>;
export function parseAwsAnswers(raw: string | null, optionCounts: Readonly<Record<string, number>> = counts): AwsAnswers {
  try {
    const data: unknown = JSON.parse(raw ?? '{}');
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    return Object.fromEntries(Object.entries(data).filter(([id, values]) => {
      const count = optionCounts[id];
      return count && Array.isArray(values) && values.length > 0 && new Set(values).size === values.length && values.every(n => Number.isInteger(n) && n >= 0 && n < count);
    }));
  } catch { return {}; }
}
