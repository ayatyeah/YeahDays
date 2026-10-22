export const APP_MODE_COOKIE = 'yg-version';
export type AppMode = 'normal' | 'rmt';
export function parseAppMode(value: unknown): AppMode | null { return value === 'normal' || value === 'rmt' ? value : null; }
export const RMT_PATHS: Record<string, string> = { '/app': '/rmt', '/today': '/rmt/tasks', '/calendar': '/rmt/calendar', '/progress': '/rmt/progress', '/account': '/rmt/account' };
export function isRmtPath(path: string) { return path === '/rmt' || path.startsWith('/rmt/') || path === '/rmt-privacy' || path === '/rmt-terms'; }
// The RMT version picker was removed: only the legacy /versions address remains (it redirects to /).
export function isVersionPicker(path: string) { return path === '/versions'; }
