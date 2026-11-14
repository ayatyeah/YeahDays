'use client';
import { useThemeStore } from '@/store/useThemeStore';
export default function ThemeSwitch() {
  const theme = useThemeStore(s => s.theme);
  const toggle = useThemeStore(s => s.toggleTheme);
  return <button type="button" className="f-theme-switch" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title={theme === 'dark' ? 'Light theme' : 'Dark theme'} data-no-i18n>
    <svg className="f-theme-sun" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>
    <svg className="f-theme-moon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M20.5 13.4A8.7 8.7 0 0 1 10.6 3.5 8.8 8.8 0 1 0 20.5 13.4Z"/></svg>
  </button>;
}
