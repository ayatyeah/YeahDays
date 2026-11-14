import { describe, expect, it } from 'vitest';
import { createFinalStudy, mutateFinalStudy, readProfile, standardTasks, validateGeneratedTasks } from './finalStudy';
const profile = { goal: 'Explain database joins', topic: 'Databases', difficulty: 'Choosing a key', minutes: 15, mode: 'standard' };
const fresh = () => createFinalStudy(readProfile(profile), standardTasks(15), null, '2026-11-14T10:00:00.000Z');
describe('final study data integrity', () => {
  it('validates bounded context and explicit mode', () => {
    expect(() => readProfile({ ...profile, minutes: 999 })).toThrow('invalid_profile');
    expect(() => readProfile({ ...profile, mode: 'randomized' })).toThrow('invalid_profile');
    expect(() => readProfile({ ...profile, topic: 'x'.repeat(121) })).toThrow('invalid_profile');
    expect(readProfile({ ...profile, goal: '  Study databases  ' }).goal).toBe('Study databases');
  });
  it('keeps nine unique tasks and 90 possible points in both modes', () => {
    const tasks = standardTasks(25);
    expect(tasks).toHaveLength(9); expect(new Set(tasks.map(t => t.id)).size).toBe(9);
    expect(tasks.filter(t => t.kind === 'focus').every(t => t.instruction.includes('25 minutes'))).toBe(true);
    expect(validateGeneratedTasks({tasks})).toEqual(tasks);
    expect(() => validateGeneratedTasks({tasks:tasks.slice(0,8)})).toThrow('ai_unavailable');
    expect(() => validateGeneratedTasks({tasks:[...tasks].reverse()})).toThrow('ai_unavailable');
    expect(() => validateGeneratedTasks({tasks:tasks.map(t => ({...t,instruction:''}))})).toThrow('ai_unavailable');
  });
  it('requires sequential starts and preserves idempotent completion', () => {
    const data=fresh();
    expect(()=>mutateFinalStudy(data,{action:'complete',taskId:'phase-1-plan'})).toThrow('start_first');
    expect(()=>mutateFinalStudy(data,{action:'start',taskId:'phase-2-plan'})).toThrow('previous_task');
    for (const task of data.tasks) {
      mutateFinalStudy(data,{action:'start',taskId:task.id});
      mutateFinalStudy(data,{action:'start',taskId:task.id});
      mutateFinalStudy(data,{action:'complete',taskId:task.id});
      mutateFinalStudy(data,{action:'complete',taskId:task.id});
    }
    expect(data.events.filter(e=>e.type==='task_complete')).toHaveLength(9);
    expect(data.events.filter(e=>e.type==='task_start')).toHaveLength(9);
    expect(data.tasks.filter(t=>t.completedAt)).toHaveLength(9);
  });
  it('saves notes without awarding points and records bounded feedback', () => {
    const data=fresh();
    expect(()=>mutateFinalStudy(data,{action:'reflection',taskId:'phase-1-plan',reflection:'note'})).toThrow('start_first');
    mutateFinalStudy(data,{action:'start',taskId:'phase-1-plan'});
    mutateFinalStudy(data,{action:'reflection',taskId:'phase-1-plan',reflection:'  A first attempt  '});
    expect(data.tasks[0].reflection).toBe('A first attempt');
    expect(data.tasks[0].completedAt).toBeNull();
    expect(()=>mutateFinalStudy(data,{action:'survey',interest:6,motivation:3,usefulness:3,comment:''})).toThrow('invalid_request');
    mutateFinalStudy(data,{action:'survey',interest:3,motivation:4,usefulness:5,comment:'Helpful structure'});
    expect(data.survey?.usefulness).toBe(5);
    expect(data.source).toBe('standard'); expect(data.generation).toBeNull(); expect(data.aiConsentAt).toBeNull();
  });
});
