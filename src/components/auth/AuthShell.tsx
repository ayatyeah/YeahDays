'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCopy } from '@/i18n/useCopy';
import { Brand } from '@/components/final/Brand';
import '@/components/final/final.css';
export type AuthMode = 'login' | 'register';
export const authInput = 'f-auth-input';
export const authPrimary = 'f-button w-full';
export const authSecondary = 'f-button f-button-outline w-full';
export function AuthField({ label, hint, aside, children }: { label: string; hint?: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return <label className="f-auth-field"><span><span>{label}</span>{aside}</span>{children}{hint && <small>{hint}</small>}</label>;
}
export function AuthDivider({ children }: { children: React.ReactNode }) { return <div className="f-auth-divider"><span/>{children}<span/></div>; }
export function AuthError({ children }: { children: React.ReactNode }) { const tx = useCopy(); return <p role="alert" className="f-auth-error">{typeof children === 'string' ? tx(children) : children}</p>; }
export function MicrosoftIcon() { return <svg viewBox="0 0 21 21" width="18" height="18" aria-hidden><path fill="#f25022" d="M1 1h9v9H1z"/><path fill="#7fba00" d="M11 1h9v9h-9z"/><path fill="#00a4ef" d="M1 11h9v9H1z"/><path fill="#ffb900" d="M11 11h9v9h-9z"/></svg>; }
export default function AuthShell({ mode, title, subtitle, callbackUrl, tabs = true, children }: { mode: AuthMode | 'neutral'; title: string; subtitle?: string; callbackUrl?: string; tabs?: boolean; children: React.ReactNode }) {
  const keep = callbackUrl && callbackUrl !== '/today' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : '';
  return <div className="final-auth"><aside className="f-auth-story" lang="en"><Brand/><div><span className="f-section-kicker">A little structure. A clear next step.</span><h2>Make learning<br/>a practice.</h2><p>A study plan that starts with your goal. Focused sessions, useful reflections and progress you can return to.</p></div><Image src="/landing/looks/campus.webp" alt="YeahGrind study companion" width={220} height={260}/><span>Built by students, for the way students learn.</span></aside><main className="f-auth-form-area">{tabs && <nav className="f-auth-tabs" aria-label="Account access"><Link href={'/login'+keep} aria-current={mode === 'login' ? 'page' : undefined}>Log in</Link><Link href={'/register'+keep} aria-current={mode === 'register' ? 'page' : undefined}>Create account</Link></nav>}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}{children}<footer className="f-auth-footer"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/research">The research</Link></footer></main></div>;
}
