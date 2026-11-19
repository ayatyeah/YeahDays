import { describe, expect, it, vi } from 'vitest';
import { parseAwsAnswers } from '../awsCloudDeveloping/progress';
import { matchesAnswer } from '../quizAnswers';
import sections from './terms.json';
import { termAttempt, termOptionCounts, termQuestions } from './quiz';

const terms = sections.flatMap(section => section.terms);

describe('AWS term practice', () => {
  it('covers all 134 published glossary cards exactly once without mixing in the Academy bank', () => {
    expect(terms).toHaveLength(134);
    expect(termQuestions).toHaveLength(134);
    expect(new Set(termQuestions.map(question => question.id)).size).toBe(134);
    expect(termQuestions.map(question => question.id).sort()).toEqual(terms.map(term => `term-${term.id}`).sort());
    expect(Object.keys(termOptionCounts).sort()).toEqual(termQuestions.map(question => question.id).sort());

    for (const section of sections) {
      const definitions = new Set(section.terms.map(term => term.meaning));
      for (const term of section.terms) {
        const question = termQuestions.find(question => question.id === `term-${term.id}`)!;
        expect(question.category).toBe(section.id);
        expect(question.q).toContain(term.name);
        expect(question.options).toHaveLength(4);
        expect(new Set(question.options).size).toBe(4);
        expect(question.options.every(option => definitions.has(option))).toBe(true);
        expect(question.correct).toHaveLength(1);
        expect(Number.isInteger(question.correct[0])).toBe(true);
        expect(question.correct[0]).toBeGreaterThanOrEqual(0);
        expect(question.correct[0]).toBeLessThan(4);
        expect(question.options[question.correct[0]]).toBe(term.meaning);
        expect(termOptionCounts[question.id]).toBe(question.options.length);
        expect(question.optionExplanations).toHaveLength(question.options.length);
        expect(question.optionExplanations.every(explanation => explanation.trim().length > 30)).toBe(true);
        expect(new Set(question.optionExplanations).size).toBe(4);
        expect(question.why.ru).toContain(term.example);
        expect(question.why.ru).toContain(term.distinction);
      }
    }
  });

  it('uses every answer position without making one position dominate a subject', () => {
    for (const section of sections) {
      const questions = termQuestions.filter(question => question.category === section.id);
      const positions = [0, 1, 2, 3].map(index => questions.filter(question => question.correct[0] === index).length);
      expect(Math.min(...positions)).toBeGreaterThan(0);
      expect(Math.max(...positions) - Math.min(...positions)).toBeLessThanOrEqual(1);
    }
  });

  it('offers the complete selected subject and clamps or rejects invalid quantities', () => {
    for (const section of sections) {
      const expectedIds = section.terms.map(term => `term-${term.id}`);
      const attempt = termAttempt(section.id, 999, false);
      expect(attempt.map(question => question.id)).toEqual(expectedIds);
      expect(attempt.every(question => question.category === section.id)).toBe(true);
    }
    expect(termAttempt('all', 999, false)).toHaveLength(134);
    expect(termAttempt('all', 2.9, false)).toEqual(termQuestions.slice(0, 2));
    expect(termAttempt('unknown-category', 10, false)).toEqual([]);
    for (const invalid of [NaN, Infinity, -Infinity, 0, -1, 0.9]) {
      expect(termAttempt('all', invalid, false)).toEqual([]);
    }
  });

  it('shuffles only question order, retaining every question, option order and source card', () => {
    const originalBank = structuredClone(termQuestions);
    const originalCards = structuredClone(sections);
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    try {
      const attempt = termAttempt('all', 134, true);
      expect(attempt.map(question => question.id)).not.toEqual(originalBank.map(question => question.id));
      expect(new Set(attempt.map(question => question.id)).size).toBe(134);
      expect(attempt.map(question => question.id).sort()).toEqual(originalBank.map(question => question.id).sort());
      for (const question of attempt) {
        expect(question).toEqual(originalBank.find(original => original.id === question.id));
      }
      expect(termAttempt('database-types', 5, true)).toHaveLength(5);
    } finally {
      random.mockRestore();
    }
    expect(termQuestions).toEqual(originalBank);
    expect(sections).toEqual(originalCards);
    expect(termAttempt('all', 1, false)).toEqual([originalBank[0]]);
  });

  it('restores answers by term ID and grades them identically in a different attempt order', () => {
    const selections = Object.fromEntries(termQuestions.map((question, index) => [question.id,
      [index % 2 === 0 ? question.correct[0] : (question.correct[0] + 1) % question.options.length],
    ]));
    const restored = parseAwsAnswers(JSON.stringify({ ...selections, 'aws-found-foreign': [0], removedTerm: [0] }), termOptionCounts);
    expect(restored).toEqual(selections);
    for (const question of [...termQuestions].reverse()) {
      expect(matchesAnswer(restored[question.id], question.correct)).toBe(matchesAnswer(selections[question.id], question.correct));
    }
    expect(termQuestions.filter(question => matchesAnswer(restored[question.id], question.correct))).toHaveLength(67);
  });
});
