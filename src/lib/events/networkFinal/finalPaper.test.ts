import { describe, expect, it } from 'vitest';
import { finalOccurrences, finalPaper, finalRelated, finalTranslations } from './finalPaper';
import { writtenQuestions } from './finalWritten';

describe('final exam banks', () => {
  it('keeps every visible paper position accessible through its shared question', () => {
    expect(finalOccurrences).toBe(96);
    expect(finalPaper).toHaveLength(72);
    expect(writtenQuestions).toHaveLength(10);
    for (const [variant, length] of [[4,25],[113,21],[122,25],[123,25]]) {
      const positions = finalPaper.flatMap(q => q.source?.positions?.[variant] ?? []).sort((a,b) => a-b);
      expect(positions).toEqual(Array.from({length}, (_,i) => i+1));
    }
    for (const q of finalPaper) {
      expect(q.correct.length).toBeGreaterThan(0);
      expect(q.correct.every(i => q.options[i])).toBe(true);
      expect([q.q, ...q.options].every(text => finalTranslations[text])).toBe(true);
      expect(q.optionReasons).toHaveLength(q.options.length);
      for (const lang of ['en','ru'] as const) {
        const reasons = q.optionReasons!.map(reason => reason[lang]);
        expect(reasons.every(reason => reason.trim().length > 12)).toBe(true);
        expect(new Set(reasons).size).toBe(reasons.length);
      }
      expect(q.why.ru.length).toBeGreaterThan(25);
      expect(q.why.en.length).toBeGreaterThan(25);
    }
    expect(new Set(finalRelated.map(q => q.id)).size).toBe(finalRelated.length);
  });
});
