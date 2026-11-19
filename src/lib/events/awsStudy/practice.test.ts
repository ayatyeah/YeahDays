import { describe, expect, it } from 'vitest';
import { studyQuestions } from './bank';
import { examVariant, moduleBank, prepareAttempt, questionCourse } from './practice';
import { examOverlap } from './examOverlap';
import catalog from '../awsMaterials/catalog.json';
import { moduleWalkthrough } from '../awsMaterials/deepDive';

describe('configurable AWS practice', () => {
  it('partitions all 220 questions into five balanced variants without changing originals', () => {
    const variants = [1,2,3,4,5].map(examVariant);
    for (const set of variants) {
      expect(set).toHaveLength(44);
      const groups = Object.groupBy(set, q => `${questionCourse(q)}-${q.module}`);
      expect(Object.keys(groups)).toHaveLength(22);
      for (const group of Object.values(groups)) expect(group).toHaveLength(2);
    }
    expect(new Set(variants.flat().map(q => q.id)).size).toBe(220);
    expect(variants.flat().map(q => q.id).sort()).toEqual(studyQuestions.map(q => q.id).sort());
    expect(examVariant(0)).toEqual([]);
  });
  it('keeps every assessed module isolated, with explicit review pools for non-assessed modules', () => {
    for (const course of ['foundations', 'developing'] as const) {
      for (let module = course === 'foundations' ? 1 : 2; module <= (course === 'foundations' ? 10 : 13); module++) {
        const bank = moduleBank(course,module);
        expect(bank).toHaveLength(10);
        expect(bank.every(q => q.module === module && questionCourse(q) === course)).toBe(true);
      }
    }
    expect(moduleBank('developing',1)).toHaveLength(20);
    expect(moduleBank('developing',14)).toHaveLength(120);
  });
  it('caps attempts, preserves original order and samples without duplicates or mutations', () => {
    const bank = moduleBank('foundations',1), original = JSON.stringify(bank);
    expect(prepareAttempt(bank,3,false)).toEqual(bank.slice(0,3));
    expect(prepareAttempt(bank,999,true)).toHaveLength(10);
    const picked = prepareAttempt(bank,5,true);
    expect(new Set(picked.map(q => q.id)).size).toBe(5);
    expect(picked.every(q => bank.includes(q))).toBe(true);
    for (const count of [NaN,Infinity,0,-1]) expect(prepareAttempt(bank,count,true)).toEqual([]);
    expect(JSON.stringify(bank)).toBe(original);
  });
  it('traces all 25 exam overlaps to Developing and records three option differences', () => {
    expect(examOverlap).toHaveLength(25);
    expect(examOverlap.filter(q => !q.sameOptions).map(q => q.examNumber).sort()).toEqual(['25','27','47']);
    for (const match of examOverlap) {
      expect(studyQuestions.some(q => q.id === match.questionId && q.module === match.module)).toBe(true);
      expect(match.questionId).toMatch(/^aws-dev/);
    }
  });
  it('resolves explanatory content for every module without dangling sections', () => {
    for (const course of catalog) for (const module of course.modules) {
      const { detail,sections } = moduleWalkthrough(`${course.id}-${module.number}`);
      expect(detail.steps.length).toBeGreaterThanOrEqual(4);
      expect(detail.answer.length).toBeGreaterThan(60);
      expect(sections.every(section => section?.text && section.title)).toBe(true);
    }
  });
});
