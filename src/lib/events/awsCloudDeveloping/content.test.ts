import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import questions from './questions.json';
import modules from './modules.json';
import explanations from './explanations.ru.json';
import counts from './optionCounts.json';
import { parseAwsAnswers } from './progress';
import { matchesAnswer } from '../quizAnswers';

describe('restored AWS Cloud Developing course checks', () => {
  it('includes all 120 original items across the twelve collected modules', () => {
    expect(questions).toHaveLength(120);
    expect(new Set(questions.map(q=>q.id)).size).toBe(120);
    expect(modules.map(m=>m.module)).toEqual(Array.from({length:12},(_,i)=>i+2));
    for (const m of modules) {
      const bank=questions.filter(q=>q.module===m.module);
      expect(bank.map(q=>q.number)).toEqual(Array.from({length:10},(_,i)=>i+1));
      for (const q of bank) {
        expect(q.source).toBe(m.url);
        expect(q.options.length).toBe(counts[q.id as keyof typeof counts]);
        expect(q.answers.length).toBeGreaterThan(0);
        expect(new Set(q.answers).size).toBe(q.answers.length);
        for(const answer of q.answers) expect(q.options[answer]).toBeTruthy();
        expect(q.explanation.length).toBeGreaterThan(20);
      }
    }
  });
  it('provides a Russian explanation for every original answer option', () => {
    expect(Object.keys(explanations).sort()).toEqual(questions.map(q => q.id).sort());
    for (const q of questions) {
      const explanation = explanations[q.id as keyof typeof explanations];
      expect(explanation.options).toHaveLength(q.options.length);
      for (const text of [explanation.summary, ...explanation.options]) {
        expect(text.length).toBeGreaterThan(35);
        expect(text).toMatch(/[А-Яа-я]/);
      }
    }
  });
  it('preserves the imported source byte for byte', () => {
    const source=readFileSync(new URL('./questions.json', import.meta.url));
    expect(createHash('sha256').update(source).digest('hex')).toBe('b4f14b7fa4c4d9a92745baa6f46fa4b3a09519bdfbc37d1e2828e87b69002ec2');
  });
  it('retains source code and contradictory S3 feedback warning', () => {
    expect(questions.find(q=>q.id==='aws-dev-m04-q09')?.prompt).toContain('"NotResource"');
    expect(questions.find(q=>q.id==='aws-dev-m06-q07')?.prompt).toContain('aws apigatewayv2 create-route');
    expect(questions.find(q=>q.id==='aws-dev-m03-q04')?.caution).toContain('HTTPS');
  });
  it('rejects corrupt, unknown or invalid saved answers without losing valid ones', () => {
    expect(parseAwsAnswers('{')).toEqual({});
    expect(parseAwsAnswers('null')).toEqual({});
    expect(parseAwsAnswers(JSON.stringify({'aws-dev-m02-q01':[2], 'aws-dev-m02-q02':[99], unknown:[0], 'aws-dev-m02-q03':[1,1]}))).toEqual({'aws-dev-m02-q01':[2]});
  });
  it('requires every correct option and no extras for multiple-answer questions', () => {
    const q=questions.find(q=>q.answers.length>1)!;
    expect(matchesAnswer([...q.answers].reverse(),q.answers)).toBe(true);
    expect(matchesAnswer(q.answers.slice(1),q.answers)).toBe(false);
    expect(matchesAnswer([...q.answers,q.answers[0]],q.answers)).toBe(false);
  });
});
