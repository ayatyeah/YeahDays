import { initialResearch, TASKS, studyWeek, metrics, totalMetrics, type ResearchData } from './research';

export type StudyData = ResearchData & { mode: 'fixed' | 'ai'; aiConsentAt: string | null; feedback: string; feedbackLocale: string };
export const newStudyData = (): StudyData => ({ ...initialResearch(), aiConsent: false, mode: 'fixed', aiConsentAt: null, feedback: '', feedbackLocale: '' });
export function studySnapshot(enrolledAt: Date | string, data: StudyData, now = Date.now()) {
  const completed = new Set(data.events.filter(e => e.event_type === 'task_complete').map(e => e.task_id));
  return { enrolledAt: new Date(enrolledAt).toISOString(), week: studyWeek(enrolledAt, now), mode: data.mode,
    feedback: data.feedback, feedbackLocale: data.feedbackLocale,
    points: TASKS.filter(t => completed.has(t.id)).length * 10,
    tasks: TASKS.map(t => ({ ...t, startedAt: data.events.find(e => e.task_id === t.id && e.event_type === 'task_start')?.event_timestamp ?? null, completed: completed.has(t.id) })),
    weeks: metrics(enrolledAt, data, now), summary: totalMetrics(enrolledAt, data, now) };
}
export type StudySnapshot = ReturnType<typeof studySnapshot>;
export function setStudyMode(data: StudyData, mode: unknown, consent: unknown, now: number) {
  if (mode !== 'fixed' && mode !== 'ai') throw new Error('invalid_mode');
  if (mode === 'ai' && consent !== true) throw new Error('consent_required');
  data.mode = mode; data.aiConsent = mode === 'ai'; data.aiConsentAt = mode === 'ai' ? new Date(now).toISOString() : null;
  data.feedback = ''; data.feedbackLocale = '';
}
export function feedbackEvents(data: StudyData) {
  return data.events.filter(e => ['session_start', 'task_start', 'task_complete'].includes(e.event_type)).slice(-80).map(e => ({ event_type: e.event_type, event_timestamp: e.event_timestamp, task_id: e.task_id }));
}
export const fixedStudyFeedback = {
  en: 'Choose an available task, read the instructions and follow the steps in order. Mark it complete when you finish. Each completed task earns 10 points.',
  ru: 'Выбери доступное задание, прочитай инструкцию и выполни шаги по порядку. После выполнения отметь результат. Каждое завершённое задание приносит 10 очков.',
  kk: 'Қолжетімді тапсырманы таңдап, нұсқаулықты оқы және қадамдарды ретімен орында. Аяқтаған соң нәтижені белгіле. Әр аяқталған тапсырма 10 ұпай береді.',
};
