import { describe, expect, it } from 'vitest';
import lessonsRu from './lessons.json';
import lessonsEn from './lessons.en.json';
import notesRu from './examNotes.json';
import notesEn from './examNotes.en.json';
import guidanceRu from './examAnswerGuidance.json';
import guidanceEn from './examAnswerGuidance.en.json';
import questionsRu from './questions.json';
import questionsEn from './questions.en.json';
import recallRu from '../computerNetworksEndterm/express.json';
import recallEn from '../computerNetworksEndterm/express.en.json';

// Translations must not change IDs, scoring, options already in English,
// source URLs or the structure used to align paragraphs in the reader.
function verify(source: unknown, translated: unknown): void {
  expect(typeof translated).toBe(typeof source);
  expect(Array.isArray(translated)).toBe(Array.isArray(source));
  if (source && typeof source === 'object') {
    expect(Object.keys(translated as object)).toEqual(Object.keys(source));
    for (const [key, value] of Object.entries(source)) verify(value, (translated as Record<string, unknown>)[key]);
  } else if (typeof source === 'string' && /[А-Яа-яЁё]/.test(source)) {
    expect((translated as string).trim().length).toBeGreaterThan(0);
    expect(translated).not.toMatch(/[А-Яа-яЁё]/);
  } else expect(translated).toEqual(source);
}
describe('English study materials preserve the source contract', () => {
  for (const [name, source, translated] of [
    ['lessons', lessonsRu, lessonsEn], ['exam notes', notesRu, notesEn],
    ['answer guidance', guidanceRu, guidanceEn], ['questions', questionsRu, questionsEn],
    ['network recall cards', recallRu, recallEn],
  ] as const) it(name, () => verify(source, translated));
});
