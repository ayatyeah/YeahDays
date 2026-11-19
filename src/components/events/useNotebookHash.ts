'use client';
import { useSyncExternalStore } from 'react';
function subscribe(listener: () => void) {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
}
const snapshot = () => window.location.hash.slice(1);
const serverSnapshot = () => '';
export const useNotebookHash = () => useSyncExternalStore(subscribe, snapshot, serverSnapshot);
