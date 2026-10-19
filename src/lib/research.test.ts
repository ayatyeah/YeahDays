import { expect, it } from 'vitest';
import { activity, DAY, initialResearch, metrics, parseInterview, SESSION_GAP, studyWeek, taskAction, TASKS, totalMetrics } from './research';
const start = Date.parse('2026-11-01T00:00:00Z');
it('defines exactly three identical benchmark tasks per week', () => {
  expect(TASKS).toHaveLength(12); expect(new Set(TASKS.map(t => t.id)).size).toBe(12);
  for (let w = 1; w <= 4; w++) expect(TASKS.filter(t => t.week === w)).toHaveLength(3);
});
it('uses elapsed UTC weeks and the exact 28-day end boundary', () => {
  expect(studyWeek(new Date(start), start + 7 * DAY - 1)).toBe(1);
  expect(studyWeek(new Date(start), start + 28 * DAY)).toBe(5);
});
it('splits sessions at 30 minutes of inactivity, not tab openings', () => {
  const d = initialResearch(); activity(d, start); activity(d, start); activity(d, start + SESSION_GAP - 1);
  expect(d.events).toHaveLength(1); activity(d, start + 2 * SESSION_GAP - 1); expect(d.events).toHaveLength(2);
});
it('requires a start and rejects unknown, future and expired tasks', () => {
  const d = initialResearch();
  expect(() => taskAction(d, new Date(start), 'complete', 'w1-plan', start)).toThrow();
  expect(() => taskAction(d, new Date(start), 'start', 'w2-plan', start)).toThrow();
  expect(() => taskAction(d, new Date(start), 'start', 'bad', start)).toThrow();
  expect(() => taskAction(d, new Date(start), 'start', 'w1-plan', start + 28 * DAY)).toThrow();
  expect(d.events).toHaveLength(0);
});
it('retries neither reset the timer nor double-count rewards', () => {
  const d = initialResearch();
  taskAction(d, new Date(start), 'start', 'w1-plan', start);
  taskAction(d, new Date(start), 'start', 'w1-plan', start + 1000);
  taskAction(d, new Date(start), 'complete', 'w1-plan', start + 5000);
  taskAction(d, new Date(start), 'complete', 'w1-plan', start + 9000);
  const m = metrics(new Date(start), d, start + DAY);
  expect(m[0]).toMatchObject({ completed: 1, assigned: 3, sessions: 1, median_task_seconds: 5, completion_rate: 1/3 });
  expect(m[1]).toMatchObject({ observed: false, sessions: null, completion_rate: null, median_task_seconds: null });
});
it('keeps late completion with the assigned cohort week and sessions with their actual week', () => {
  const d = initialResearch(); taskAction(d, new Date(start), 'start', 'w1-plan', start);
  taskAction(d, new Date(start), 'complete', 'w1-plan', start + 8 * DAY);
  const m = metrics(new Date(start), d, start + 9 * DAY);
  expect(m[0].completed).toBe(1); expect(m[1].completed).toBe(0); expect(m[1].sessions).toBe(1);
});
it('rejects malformed interview answers and ratings while allowing omitted ratings', () => {
  const answers = Array(6).fill('Some feedback');
  expect(parseInterview({ answers, ratings: [null, 1, 5] }).ratings).toEqual([null, 1, 5]);
  for (const ratings of [[0, 1, 2], [1.5, 2, 3], ['1', 2, 3], [6, 2, 3], []]) expect(() => parseInterview({ answers, ratings })).toThrow();
  expect(() => parseInterview({ answers: Array(6).fill(' '), ratings: [null,null,null] })).toThrow();
});

it('computes total median from tasks instead of averaging weekly medians', () => {
  const d = initialResearch();
  for (const [id, offset, duration] of [['w1-plan', 0, 10], ['w1-review', 100, 20], ['w2-plan', 8 * DAY, 1000]] as const) {
    taskAction(d, new Date(start), 'start', id, start + offset);
    taskAction(d, new Date(start), 'complete', id, start + offset + duration * 1000);
  }
  expect(totalMetrics(new Date(start), d, start + 28 * DAY)).toMatchObject({ assigned: 12, completed: 3, completion_rate: .25, median_task_seconds: 20, trial_finished: true });
});
