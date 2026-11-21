import {describe,expect,it} from 'vitest';
import {archiveBank,compactBank,grindBank,grindUnits} from './grind';
import {endtermPaper,endtermRelated} from './endterm';
import {midtermPaper,midtermRelated} from './midterm';
import {questionsFor} from './quizzes';

describe('network study banks',()=>{
  it('assigns each original record exactly once and keeps reference items out of grading',()=>{
    const ids=archiveBank.map(q=>q.id);
    expect(new Set(ids).size).toBe(795);
    expect(grindUnits.flatMap(u=>u.ids).sort()).toEqual([...ids].sort());
    expect(archiveBank.filter(q=>q.correct.length)).toHaveLength(709);
    for(const q of archiveBank){
      expect(q.why.ru).not.toMatch(/В завершённом задании с результатом/);
      expect(q.why.en).not.toMatch(/[А-Яа-яЁё]/);
      expect(q.why.ru.length).toBeGreaterThan(15);
    }
    expect(archiveBank.find(q=>q.id==='module-04-2')?.why.ru).toContain('интервалов');
  });
  it('covers every topic in the short cycle and keeps full practice available',()=>{
    for(const unit of grindUnits){
      const short=grindBank.filter(q=>q.lesson?.id===unit.id);
      expect(short.length).toBeGreaterThan(0);
      expect(short.length).toBeLessThanOrEqual(3);
      expect(questionsFor('unit-'+unit.id).map(q=>q.id)).toEqual(unit.ids);
    }
    expect(questionsFor('grind-full')).toHaveLength(709);
    expect(compactBank.length).toBeLessThan(709);
    expect(compactBank.every(q=>q.correct.length)).toBe(true);
  });
  it('pairs each practice topic with a different bilingual worked case and transfer check',()=>{
    const lessons=new Map(questionsFor('grind').map(q=>[q.lesson!.id,q.lesson!]));
    expect([...lessons.keys()].sort()).toEqual(grindUnits.map(u=>u.id).sort());
    for(const lang of ['ru','en'] as const){
      const cases=new Set<string>();
      for(const lesson of lessons.values()){
        const notes=lesson.notes![lang];
        const [reading,worked]=notes.split(lang==='ru'?'## Разбор задачи\n':'## Worked example\n');
        expect(reading).toMatch(/^## /);
        expect(worked).toMatch(/\n\?\? .+\n\?= .+/);
        cases.add(worked);
      }
      expect(cases.size).toBe(lessons.size);
    }
  });
  it('keeps all four endterm papers complete including reference questions',()=>{
    for(const variant of [1,2,3,4]){
      const paper=endtermPaper.filter(q=>q.source?.variant===variant);
      expect(paper).toHaveLength(25);
      for(const q of paper)expect(q.correct.every(i=>i>=0 && i<q.options.length)).toBe(true);
    }
    expect(endtermPaper.find(q=>q.id==='vrt-1-16')?.correct).toEqual([]);
    expect(endtermPaper.find(q=>q.id==='vrt-1-12')?.correct).toHaveLength(3);
    expect(endtermRelated.filter(q=>q.source?.kind==='lecture')).toHaveLength(12);
  });
  it('preserves all 25 paper questions and keeps related sources filterable',()=>{
    expect(midtermPaper).toHaveLength(25);
    expect(midtermPaper[0].correct).toEqual([1]);
    expect(midtermPaper[3].correct).toEqual([1]);
    expect(midtermRelated.some(q=>q.source?.kind==='lecture')).toBe(true);
    expect(midtermRelated.some(q=>q.source?.kind==='module')).toBe(true);
    expect(new Set(midtermRelated.map(q=>q.id)).size).toBe(midtermRelated.length);
  });
});
