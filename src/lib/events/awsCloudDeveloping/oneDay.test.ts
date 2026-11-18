import { describe, expect, it } from 'vitest';
import { dayBlocks, dayMinutes } from './oneDay';
import { dayPracticeSet } from './practiceSets';
import questions from './questions.json';

describe('one-day AWS preparation route', () => {
  it('covers each collected module exactly once across the six blocks', () => {
    expect(dayBlocks).toHaveLength(6);
    expect(dayBlocks.flatMap(b => b.modules).sort((a,b) => a-b)).toEqual(Array.from({length:12},(_,i)=>i+2));
    expect(dayMinutes).toBe(480);
    for (const block of dayBlocks) expect(dayPracticeSet({},block.modules,'all')).toHaveLength(20);
  });
  it('balances diagnostic and final sets across every module without duplicates', () => {
    for (const kind of ['diagnostic','final'] as const) {
      const set=dayPracticeSet({},[],kind);
      const count=kind==='diagnostic'?1:2;
      expect(set).toHaveLength(12*count);
      expect(new Set(set.map(q=>q.id)).size).toBe(set.length);
      for(let m=2;m<=13;m++) expect(set.filter(q=>q.module===m)).toHaveLength(count);
    }
  });
  it('repeats actual errors while excluding unseen and correct items', () => {
    const a=questions[0],b=questions[1];
    const wrong=a.options.map((_,i)=>i).find(i=>!a.answers.includes(i))!;
    expect(dayPracticeSet({[a.id]:[wrong],[b.id]:b.answers},[],'mistakes').map(q=>q.id)).toEqual([a.id]);
    expect(dayPracticeSet({[a.id]:[wrong]},[3],'mistakes')).toEqual([]);
  });
});
