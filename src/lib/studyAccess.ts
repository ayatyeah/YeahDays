/** Main application surface for the controlled comparison. APIs not listed here
 * stay inaccessible even through old clients or a manually entered URL. */
export const STUDY_PAGES = new Set(['/app', '/today', '/calendar', '/progress', '/account']);
export function studyApiAllowed(path: string) {
  return path === '/api/research' || path.startsWith('/api/research/')
    || path.startsWith('/api/auth/') || path.startsWith('/api/owner/')
    || path.startsWith('/api/admin/') || path === '/api/account'
    || path === '/api/account/password' || path === '/api/account/providers';
}
export function studyPageAllowed(path: string) {
  return STUDY_PAGES.has(path) || ['/', '/login', '/login/lms', '/register', '/forgot-password', '/privacy', '/terms', '/offline'].includes(path)
    || path === '/admin' || path.startsWith('/admin/');
}
