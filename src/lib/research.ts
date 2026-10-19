export const RESEARCH_VERSION = 'assignment3-v1';
export const MAIN_APP_CONSENT = 'main-app-v1';
export const DAY = 86_400_000;
export const SESSION_GAP = 30 * 60_000;
export const TASKS = Array.from({ length: 4 }, (_, w) => [
  { id: `w${w + 1}-plan`, week: w + 1, title: 'План из трёх шагов', instruction: 'Выбери небольшое обычное дело. На бумаге составь три последовательных шага и оцени длительность каждого. Нажми «Завершить», когда план готов.' },
  { id: `w${w + 1}-focus`, week: w + 1, title: 'Пять минут внимания', instruction: 'Выбери один пункт своего плана. Убери отвлекающие вкладки и занимайся им пять минут по таймеру. Затем нажми «Завершить».' },
  { id: `w${w + 1}-review`, week: w + 1, title: 'Короткое подведение итогов', instruction: 'На бумаге запиши, что получилось, одно затруднение и следующий шаг. Нажми «Завершить», когда все три пункта записаны.' },
]).flat();
export const QUESTIONS = [
  'Как бы вы описали свой опыт использования приложения за четыре недели?',
  'Что поддерживало ваш интерес, а что не заинтересовало?',
  'Что мотивировало возвращаться в приложение или завершать задания?',
  'Когда обратная связь или рекомендации были полезны, а когда — нет?',
  'Были ли раздражение, скука или непонимание? Опишите пример.',
  'Какое одно изменение больше всего улучшило бы ваш опыт?',
];
export const RATINGS = ['Я чувствовал(а) интерес при использовании приложения', 'Приложение мотивировало меня завершать задания', 'Обратная связь или рекомендации были полезны'];
export type ResearchEvent = { event_type: 'session_start' | 'task_start' | 'task_complete' | 'ai_feedback' | 'ai_failure' | 'app_consent' | 'version_switch'; event_timestamp: string; task_id: string | null };
export type ResearchData = { version: string; aiConsent: boolean; selectedVersion?: 'normal' | 'rmt'; ordinaryAccessAt?: string; appConsent?: { version: string; at: string; migrated?: boolean }; consentInformation?: { contact: string; deleteAt: string }; lastActivity: number; events: ResearchEvent[]; interview: { answers: string[]; ratings: (number | null)[]; at: string } | null };
export const initialResearch = (): ResearchData => ({ version: RESEARCH_VERSION, aiConsent: true, lastActivity: 0, events: [], interview: null });
export function studyWeek(enrolledAt: Date | string, now: number) { return Math.floor((now - new Date(enrolledAt).getTime()) / (7 * DAY)) + 1; }
export function activity(data: ResearchData, now: number) {
  if (!data.lastActivity || now - data.lastActivity >= SESSION_GAP) data.events.push({ event_type: 'session_start', event_timestamp: new Date(now).toISOString(), task_id: null });
  data.lastActivity = now;
}
export function taskAction(data: ResearchData, enrolledAt: Date | string, action: 'start' | 'complete', taskId: string, now: number) {
  const task = TASKS.find(t => t.id === taskId);
  const week = studyWeek(enrolledAt, now);
  if (!task || week < 1 || week > 4 || task.week > week) throw new Error('Задание пока недоступно');
  const started = data.events.find(e => e.task_id === taskId && e.event_type === 'task_start');
  const completed = data.events.some(e => e.task_id === taskId && e.event_type === 'task_complete');
  if (completed || (action === 'start' && started)) return;
  if (action === 'complete' && !started) throw new Error('Сначала откройте задание');
  activity(data, now);
  data.events.push({ event_type: action === 'start' ? 'task_start' : 'task_complete', event_timestamp: new Date(now).toISOString(), task_id: taskId });
}
export function parseInterview(value: unknown): { answers: string[]; ratings: (number | null)[] } {
  const v = value as { answers?: unknown; ratings?: unknown } | null;
  if (!v || !Array.isArray(v.answers) || v.answers.length !== 6 || v.answers.some(a => typeof a !== 'string' || !a.trim() || a.length > 3000) || !Array.isArray(v.ratings) || v.ratings.length !== 3 || v.ratings.some(r => r !== null && (!Number.isInteger(r) || r < 1 || r > 5))) throw new Error('Заполните шесть ответов; оценки — от 1 до 5 или пропуск');
  return { answers: v.answers.map(a => a.trim()), ratings: v.ratings };
}
export function metrics(enrolledAt: Date | string, data: ResearchData, until: number) {
  return Array.from({ length: 4 }, (_, i) => {
    const from = new Date(enrolledAt).getTime() + i * 7 * DAY;
    const to = from + 7 * DAY;
    const events = data.events.filter(e => { const at = Date.parse(e.event_timestamp); return at >= from && at < to && at <= until; });
    const assigned = TASKS.filter(t => t.week === i + 1);
    const completed = assigned.filter(t => data.events.some(e => e.task_id === t.id && e.event_type === 'task_complete' && Date.parse(e.event_timestamp) <= until));
    const durations = completed.flatMap(t => {
      const start = data.events.find(e => e.task_id === t.id && e.event_type === 'task_start');
      const end = data.events.find(e => e.task_id === t.id && e.event_type === 'task_complete');
      const ms = start && end ? Date.parse(end.event_timestamp) - Date.parse(start.event_timestamp) : NaN;
      return Number.isFinite(ms) && ms >= 0 ? [ms / 1000] : [];
    }).sort((a, b) => a - b);
    const n = durations.length;
    return { week: i + 1, observed: until >= from, week_finished: until >= to, sessions: until >= from ? events.filter(e => e.event_type === 'session_start').length : null, assigned: until >= from ? assigned.length : 0, completed: completed.length, completion_rate: until >= from ? completed.length / assigned.length : null, median_task_seconds: n ? (durations[Math.floor((n - 1) / 2)] + durations[Math.floor(n / 2)]) / 2 : null };
  });
}

export function totalMetrics(enrolledAt: Date | string, data: ResearchData, until: number) {
  const weeks = metrics(enrolledAt, data, until);
  const assigned = weeks.reduce((sum, w) => sum + w.assigned, 0);
  const completed = weeks.reduce((sum, w) => sum + w.completed, 0);
  const durations = TASKS.flatMap(t => {
    const start = data.events.find(e => e.task_id === t.id && e.event_type === 'task_start');
    const end = data.events.find(e => e.task_id === t.id && e.event_type === 'task_complete' && Date.parse(e.event_timestamp) <= until);
    const ms = start && end ? Date.parse(end.event_timestamp) - Date.parse(start.event_timestamp) : NaN;
    return Number.isFinite(ms) && ms >= 0 ? [ms / 1000] : [];
  }).sort((a, b) => a - b);
  const n = durations.length;
  return { sessions: weeks.reduce((sum, w) => sum + (w.sessions ?? 0), 0), assigned, completed, completion_rate: assigned ? completed / assigned : null, median_task_seconds: n ? (durations[Math.floor((n - 1) / 2)] + durations[Math.floor(n / 2)]) / 2 : null, trial_finished: until >= new Date(enrolledAt).getTime() + 28 * DAY };
}
