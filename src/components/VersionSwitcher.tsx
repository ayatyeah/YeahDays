'use client';
import Link from 'next/link';
import { useOrdinaryVersion } from './AppModeProvider';
export default function VersionSwitcher(){
  if(!useOrdinaryVersion())return null;
  return <Link href="/" className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-3 z-40 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-fg)] shadow-sm">Обычная версия · Сменить версию</Link>;
}
