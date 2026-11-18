import { describe, expect, it } from 'vitest';
import { runInNewContext } from 'node:vm';
import { PERFORMANCE_INIT_SCRIPT } from './clientPerformance';

describe('early performance mode', () => {
  it.each([
    [4, true, true], [2, true, true], [8, true, false],
    [4, false, false], [undefined, true, false], [0, true, false],
  ])('memory=%s, coarse=%s enables light mode=%s', (memory, coarse, expected) => {
    const attrs = new Map<string, string>();
    runInNewContext(PERFORMANCE_INIT_SCRIPT, {
      navigator: { deviceMemory: memory },
      matchMedia: () => ({ matches: coarse }),
      document: { documentElement: { setAttribute: (k: string, v: string) => attrs.set(k, v) } },
    });
    expect(attrs.get('data-performance')).toBe(expected ? 'light' : undefined);
  });
  it('does not break boot when capability APIs are unavailable', () => {
    expect(() => runInNewContext(PERFORMANCE_INIT_SCRIPT, {})).not.toThrow();
  });
});
