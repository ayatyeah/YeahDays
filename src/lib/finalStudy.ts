/** Current product records. Never merged with the historical RMT research cohort. */
export const FINAL_STUDY_VERSION = 'rmt-final-2026-11-v1';
export const PHASES = ['Find your starting point', 'Build through practice', 'Connect what you learned'];
export const KINDS = ['plan', 'focus', 'review'] as const;
export type StudyKind = typeof KINDS[number];
export type StudyProfile = { goal: string; topic: string; difficulty: string; minutes: number; mode: 'standard' | 'ai' };
export type FinalTask = { id: string; phase: number; kind: StudyKind; title: string; instruction: string; rationale: string; startedAt: string | null; completedAt: string | null; reflection: string };
export type FinalStudy = {
  version: string; profile: StudyProfile; createdAt: string; source: 'standard' | 'ai';
  generation: { provider: 'google-gemini'; model: string; responseId: string; promptVersion: string } | null;
  aiConsentAt: string | null; tasks: FinalTask[];
  events: { type: 'plan_created' | 'task_start' | 'task_complete' | 'reflection_saved'; at: string; taskId: string | null }[];
  survey: { interest: number; motivation: number; usefulness: number; comment: string; submittedAt: string } | null;
};
export function readProfile(value: unknown): StudyProfile {
  if (!value || typeof value !== 'object') throw Error('invalid_profile');
  const p = value as Record<string, unknown>;
  const field = (key: string, max: number) => {
    if (typeof p[key] !== 'string') throw Error('invalid_profile');
    const text = p[key].trim();
    if (text.length < 3 || text.length > max) throw Error('invalid_profile');
    return text;
  };
  if (![5, 15, 25].includes(p.minutes as number) || !['standard', 'ai'].includes(p.mode as string)) throw Error('invalid_profile');
  return { goal: field('goal', 240), topic: field('topic', 120), difficulty: field('difficulty', 400), minutes: p.minutes as number, mode: p.mode as StudyProfile['mode'] };
}
export function standardTasks(minutes: number): FinalTask[] {
  const titles = [['Map a small learning goal', 'Try one worked example', 'Explain your starting point'], ['Plan a second attempt', 'Practise without your notes', 'Learn from one mistake'], ['Plan a final challenge', 'Connect two ideas', 'Reflect and choose what is next']];
  return PHASES.flatMap((_, phase) => KINDS.map((kind, i) => ({
    id: `phase-${phase + 1}-${kind}`, phase: phase + 1, kind, title: titles[phase][i],
    instruction: kind === 'plan' ? `Choose a small activity from your course${phase ? ' that builds on your previous work' : ''}. Write three steps, the materials you need and what a finished attempt will look like.` : kind === 'focus' ? `Choose ${phase === 2 ? 'a problem that connects two ideas' : phase === 1 ? 'a fresh example to try without looking at the solution' : 'one example related to your plan'}. Work on it for ${minutes} minutes in your notebook or editor. Keep your attempt, even if it is incomplete.` : `Write what you attempted, one thing you can explain now and one remaining difficulty. ${phase === 2 ? 'Choose a next goal to practise independently.' : 'Name a concrete next step for your next session.'}`,
    rationale: 'A shared study structure. You choose the subject-specific exercise.', startedAt: null, completedAt: null, reflection: '',
  })));
}
export function validateGeneratedTasks(value: unknown): FinalTask[] {
  if (!value || typeof value !== 'object' || !('tasks' in value) || !Array.isArray(value.tasks) || value.tasks.length !== 9) throw Error('ai_unavailable');
  return value.tasks.map((entry: unknown, index: number) => {
    if (!entry || typeof entry !== 'object') throw Error('ai_unavailable');
    const item = entry as Record<string, unknown>;
    const text = (name: string, min: number, max: number) => {
      if (typeof item[name] !== 'string' || item[name].trim().length < min || item[name].length > max) throw Error('ai_unavailable');
      return item[name].trim();
    };
    const phase = Math.floor(index / 3) + 1, kind = KINDS[index % 3];
    if (item.phase !== phase || item.kind !== kind) throw Error('ai_unavailable');
    return { id: `phase-${phase}-${kind}`, phase, kind, title: text('title', 3, 100), instruction: text('instruction', 20, 1200), rationale: text('rationale', 10, 400), startedAt: null, completedAt: null, reflection: '' };
  });
}
export function createFinalStudy(profile: StudyProfile, tasks: FinalTask[], generation: FinalStudy['generation'], now = new Date().toISOString()): FinalStudy {
  return { version: FINAL_STUDY_VERSION, profile, createdAt: now, source: generation ? 'ai' : 'standard', generation, aiConsentAt: generation ? now : null, tasks, events: [{ type: 'plan_created', at: now, taskId: null }], survey: null };
}
export function mutateFinalStudy(data: FinalStudy, body: Record<string, unknown>, now = new Date().toISOString()) {
  if (body.action === 'survey') {
    for (const key of ['interest', 'motivation', 'usefulness']) if (!Number.isInteger(body[key]) || Number(body[key]) < 1 || Number(body[key]) > 5) throw Error('invalid_request');
    if (typeof body.comment !== 'string' || body.comment.length > 2000) throw Error('invalid_request');
    data.survey = { interest: Number(body.interest), motivation: Number(body.motivation), usefulness: Number(body.usefulness), comment: body.comment.trim(), submittedAt: now };
    return;
  }
  const task = data.tasks.find(t => t.id === body.taskId);
  if (!task) throw Error('invalid_task');
  if (body.action === 'reflection') {
    if (!task.startedAt) throw Error('start_first');
    if (typeof body.reflection !== 'string' || body.reflection.length > 2000) throw Error('invalid_request');
    task.reflection = body.reflection.trim();
    // Bound autosave events without discarding task history.
    if (!data.events.some(e => e.type === 'reflection_saved' && e.taskId === task.id)) data.events.push({ type: 'reflection_saved', at: now, taskId: task.id });
    return;
  }
  if (body.action !== 'start' && body.action !== 'complete') throw Error('invalid_request');
  if (task.completedAt) return; // Idempotent: repeat clicks never grant points twice.
  if (data.tasks.find(t => !t.completedAt)?.id !== task.id) throw Error('previous_task');
  if (body.action === 'start') {
    if (!task.startedAt) { task.startedAt = now; data.events.push({ type: 'task_start', at: now, taskId: task.id }); }
  } else {
    if (!task.startedAt) throw Error('start_first');
    task.completedAt = now;
    data.events.push({ type: 'task_complete', at: now, taskId: task.id });
  }
}
