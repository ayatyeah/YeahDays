/** Known account-owned browser records only. Never use localStorage.clear():
 * this origin may contain another account's offline work and device preferences. */
const exactPrefixes = [
  'yg-aws-one-day-v2:',
  'yg-aws-one-day-v1:', 'yg-aws-developing-checks-v1:', 'yg-aws-foundations-checks-v1:', 'yg-trainer:', 'yg-bughunt:',
  'yg-pm-quiz2:v1:', 'yg-philosophy-v1:', 'yg-sync-v2:', 'yd-linked:',
  'yg-lesson-visits:', 'yg-learning-visits:',
  'yg-event-game-binary:', 'yg-event-game-switch:',
];
const nestedPrefixes = [
  'yg-cn-bank:', 'yg-tutor:', 'yg-event:', 'yg-event-exam:', 'yg-event-drill:', 'yg-event-scroll:',
  'yg-event-feed:', 'yg-fast:', 'yg-mock:', 'yg-event-achievement:', 'yg-lesson-draft:',
];
type BrowserStorage = Pick<Storage, 'length' | 'key' | 'getItem' | 'removeItem'>;

export function accountOwnsBrowserKey(key: string, userId: string): boolean {
  if (!userId) return false;
  return exactPrefixes.some(prefix => key === `${prefix}${userId}`) ||
    nestedPrefixes.some(prefix => key.startsWith(`${prefix}${userId}:`));
}

function removeMatching(storage: BrowserStorage, matches: (key: string) => boolean) {
  // Snapshot keys first: removing entries changes indexes in browser Storage.
  const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index));
  for (const key of keys) if (key && matches(key)) storage.removeItem(key);
}

export function clearAccountBrowserData(userId: string, local: BrowserStorage, session?: BrowserStorage) {
  if (!userId) return;
  removeMatching(local, key => accountOwnsBrowserKey(key, userId));
  // These legacy records are not namespaced. Only clear a snapshot known to
  // belong to the account being deleted. Keep the active-account sentinel so
  // StateSync can reset its in-memory store when the session signs out.
  if (local.getItem('yd-active-account') === userId) {
    for (const key of ['yeahdays-store', 'yd-uid', 'yd-event-queue']) local.removeItem(key);
  }
  if (session) removeMatching(session, key => key.startsWith(`yg-reading-position:${userId}:`));
}
