import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import questions from './questions.json';
import modules from './modules.json';
import explanations from './explanations.ru.json';
import counts from './optionCounts.json';
import { parseAwsAnswers } from '../awsCloudDeveloping/progress';

describe('original Cloud Foundations Knowledge Checks', () => {
  it('contains all ten checks with ten original questions each', () => {
    expect(questions).toHaveLength(100);
    expect(new Set(questions.map(q => q.id)).size).toBe(100);
    expect(modules.map(m => m.module)).toEqual(Array.from({ length: 10 }, (_, i) => i + 1));
    for (const module of modules) {
      const bank = questions.filter(q => q.module === module.module);
      expect(bank.map(q => q.number)).toEqual(Array.from({ length: 10 }, (_, i) => i + 1));
      expect(module.url).toContain('/courses/188512/');
      for (const q of bank) {
        expect(q.source).toBe(module.url);
        expect(q.options).toHaveLength(counts[q.id as keyof typeof counts]);
        expect(q.answers.length).toBeGreaterThan(0);
        expect(new Set(q.answers).size).toBe(q.answers.length);
        for (const answer of q.answers) expect(q.options[answer]).toBeTruthy();
      }
    }
  });

  it('freezes the imported original text, option order and verified answer key', () => {
    const source = readFileSync(new URL('./questions.json', import.meta.url));
    expect(createHash('sha256').update(source).digest('hex')).toBe('31b3c60fe35a913cd8393ad21f63daf1917a845e39d12d003b1bb508bbcb90a3');
    const duplicate = questions.find(q => q.id === 'aws-found-m09-q09')!;
    expect(duplicate.options).toEqual(['High durability', 'Fault tolerance', 'High availability', 'High durability']);
    expect(questions.find(q => q.id === 'aws-found-m08-q08')!.answers).toEqual([3]);
    expect(questions.find(q => q.id === 'aws-found-m09-q08')!.answers).toEqual([2]);
  });

  it('keeps Russian teaching notes separate and covers every answer option', () => {
    expect(Object.keys(explanations).sort()).toEqual(questions.map(q => q.id).sort());
    for (const q of questions) {
      const why = explanations[q.id as keyof typeof explanations];
      expect(why.options).toHaveLength(q.options.length);
      for (const text of [why.summary, ...why.options]) {
        expect(text).toMatch(/[А-Яа-я]/);
        expect(text.length).toBeGreaterThan(25);
      }
    }
  });

  it('loads only valid answers for the selected course', () => {
    const raw = JSON.stringify({ 'aws-found-m01-q01': [4], 'aws-found-m01-q06': [0, 2], 'aws-found-m01-q02': [9], 'aws-found-m01-q03': [1, 1], 'aws-dev-m02-q01': [2] });
    expect(parseAwsAnswers(raw, counts)).toEqual({ 'aws-found-m01-q01': [4], 'aws-found-m01-q06': [0, 2] });
    expect(parseAwsAnswers(raw)).toEqual({ 'aws-dev-m02-q01': [2] });
    expect(parseAwsAnswers('null', counts)).toEqual({});
  });
});
