'use client';
import { createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { isRmtPath, isVersionPicker, type AppMode } from '@/lib/appMode';
const Context = createContext<AppMode | null>(null);
export function AppModeProvider({mode,children}:{mode:AppMode|null;children:React.ReactNode}) { return <Context.Provider value={mode}>{children}</Context.Provider>; }
export function useOrdinaryVersion() {
  const mode = useContext(Context); const path = usePathname();
  return mode === 'normal' && !isRmtPath(path) && !isVersionPicker(path) && !path.startsWith('/admin');
}
