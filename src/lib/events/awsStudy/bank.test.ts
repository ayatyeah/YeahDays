import { plainLessons } from './lessons';
import { describe, expect, it } from 'vitest';
import { studyTopics, studyMinutes, topicForQuestion } from './topics';
import { studyQuestions, studyExplanations, studyPracticeSet } from './bank';
import foundations from '../awsCloudFoundations/questions.json';
import developing from '../awsCloudDeveloping/questions.json';

describe('two-course one-day preparation', () => {
  it('covers all 220 original questions exactly once in 11 thematic notes', () => {
    expect(studyTopics).toHaveLength(11);
    expect(Object.keys(plainLessons).sort()).toEqual(studyTopics.map(t => t.id).sort());
    expect(studyMinutes).toBe(600);
    const covered = studyTopics.flatMap(t => {
      const questions = studyPracticeSet({}, [t.id], 'all');
      expect(questions).toHaveLength(20);
      for (const q of questions) {
        expect(topicForQuestion(q)).toBe(t);
        expect(studyExplanations[q.id].options).toHaveLength(q.options.length);
        expect(studyExplanations[q.id].summary).toMatch(/[А-Яа-я]/);
      }
      return questions;
    });
    expect(new Set(covered.map(q => q.id)).size).toBe(220);
    expect(covered.slice().sort((a, b) => a.id.localeCompare(b.id))).toEqual([...foundations, ...developing].sort((a, b) => a.id.localeCompare(b.id)));
    expect(studyQuestions).toEqual([...foundations, ...developing]);
  });
  it('samples each of 22 modules independently, including overlapping module numbers', () => {
    for (const kind of ['diagnostic', 'final'] as const) {
      const set = studyPracticeSet({}, [], kind);
      const count = kind === 'diagnostic' ? 1 : 2;
      expect(set).toHaveLength(22 * count);
      expect(new Set(set.map(q => q.id)).size).toBe(set.length);
      for (const t of studyTopics) for (const module of t.modules) {
        expect(set.filter(q => topicForQuestion(q).id === t.id && q.module === module)).toHaveLength(count);
      }
    }
  });
  it('keeps unseen, wrong and correct questions distinct across both courses', () => {
    const a = foundations[0], b = developing[0];
    const wrong = a.options.map((_, i) => i).find(i => !a.answers.includes(i))!;
    const answers = { [a.id]: [wrong], [b.id]: b.answers };
    expect(studyPracticeSet(answers, [], 'mistakes').map(q => q.id)).toEqual([a.id]);
    expect(studyPracticeSet(answers, [], 'unanswered')).toHaveLength(218);
    expect(studyPracticeSet(answers, [topicForQuestion(b).id], 'mistakes')).toEqual([]);
    expect(studyPracticeSet(answers, [topicForQuestion(a).id], 'unanswered')).toHaveLength(19);
  });
});
