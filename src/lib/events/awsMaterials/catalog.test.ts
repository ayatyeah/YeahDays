import { describe, expect, it } from 'vitest';
import catalog from './catalog.json';
import { moduleSummaries } from './summaries';

describe('AWS module materials', () => {
  it('covers every module of both courses, including intro and certification', () => {
    expect(catalog.map(course => course.modules.length)).toEqual([10, 14]);
    expect(Object.keys(moduleSummaries).sort()).toEqual(catalog.flatMap(course => course.modules.map(module => `${course.id}-${module.number}`)).sort());
    for (const course of catalog) {
      expect(course.modules.map(module => module.number)).toEqual(Array.from({ length: course.modules.length }, (_, i) => i + 1));
      for (const module of course.modules) {
        expect(module.items.some(item => /student guide/i.test(item.title))).toBe(true);
        for (const item of module.items) {
          expect(item.url).toMatch(new RegExp(`^${course.source}/items/\\d+$`));
        }
        for (const reading of module.readings) expect(new URL(reading.url).protocol).toBe('https:');
      }
    }
  });
});
