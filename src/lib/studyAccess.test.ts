import { expect, it } from 'vitest';
import { studyApiAllowed, studyPageAllowed } from './studyAccess';
it('keeps legacy AI, recommendations, integration writes and analytics out of both conditions', () => {
  for (const path of ['/api/ai/chat','/api/ai/planner','/api/learning','/api/challenge30','/api/study-events/tutor','/api/study-events/grade','/api/recommendations','/api/state','/api/events','/api/personalization','/api/visit','/api/integrations/add-todo','/api/push/send','/api/cron/lms-sync']) expect(studyApiAllowed(path),path).toBe(false);
});
it('keeps authentication, account rights and authorized researcher endpoints reachable', () => {
  for (const path of ['/api/auth/session','/api/auth/callback/credentials','/api/research','/api/research/feedback','/api/account','/api/account/password','/api/owner/research','/api/admin/login']) expect(studyApiAllowed(path),path).toBe(true);
});
it('routes the full application through the five main sections', () => {
  for (const path of ['/app','/today','/calendar','/progress','/account','/privacy','/login','/admin']) expect(studyPageAllowed(path)).toBe(true);
  for (const path of ['/research','/chat','/learn','/events/test','/personalization','/shop','/community']) expect(studyPageAllowed(path)).toBe(false);
});
