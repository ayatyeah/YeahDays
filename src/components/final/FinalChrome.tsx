'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Brand, Icon } from './Brand';
import ThemeSwitch from './ThemeSwitch';
import { useState } from 'react';
const navigation = [
  { href: '/app', label: 'My study', icon: 'plan', paths: ['/app', '/today', '/learn', '/calendar'] },
  { href: '/events', label: 'Courses', icon: 'book', paths: ['/events'] },
  { href: '/progress', label: 'Progress', icon: 'progress', paths: ['/progress'] },
];
export default function FinalChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [reading, setReading] = useState<string | null>(null);
  const clean = reading === path;
  const canRead = path.startsWith('/events/') && !path.startsWith('/events/courses/');
  const { data: session } = useSession();
  const current = navigation.find(n => n.paths.some(p => path === p || path.startsWith(p + '/')));
  const name = session?.user?.name || 'Learner';
  return <div className="final-shell f-simple-shell" data-clean-mode={clean ? 'true' : undefined}>
    <a className="f-skip" href="#workspace-content">Skip to content</a>
    <header className="f-navigation-wrap" data-no-i18n><div className="f-navigation">
      <Brand href="/app"/>
      <nav className="f-nav-track" aria-label="Main navigation">{navigation.map(n => <Link key={n.href} href={n.href} aria-current={current === n ? 'page' : undefined}><Icon name={n.icon} size={19}/><span>{n.label}</span></Link>)}</nav>
      <div className="f-nav-tools"><ThemeSwitch/><span className="f-nav-divider"/><Link href="/account" className="f-nav-account" aria-label="My account" aria-current={path === '/account' ? 'page' : undefined}><span className="f-avatar">{name.slice(0,1).toUpperCase()}</span><span>{name.split(' ')[0]}</span></Link></div>
    </div></header>
    <main id="workspace-content" className="f-content">{children}</main>
    {canRead && <button type="button" className="g-clean-toggle" data-no-i18n aria-pressed={clean} onClick={() => setReading(clean ? null : path)}><Icon name="book" size={18}/>{clean ? 'Exit clean mode' : 'Clean mode'}</button>}
    <footer className="f-workspace-footer" data-no-i18n><span>Small steps, made yours.</span><Link href="/research">The research</Link><Link href="/privacy">Privacy</Link></footer>
    <nav className="f-mobile-dock" aria-label="Mobile navigation" data-no-i18n>{navigation.map(n => <Link key={n.href} href={n.href} aria-current={current === n ? 'page' : undefined}><Icon name={n.icon} size={21}/><span>{n.label}</span><i/></Link>)}<Link href="/account" aria-current={path === '/account' ? 'page' : undefined}><Icon name="user" size={21}/><span>Account</span><i/></Link></nav>
  </div>;
}
