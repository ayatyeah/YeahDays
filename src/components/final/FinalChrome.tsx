'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Brand, Icon } from './Brand';
import ThemeSwitch from './ThemeSwitch';
import { useState } from 'react';
import { ReadingModeContext } from './ReadingMode';
const navigation = [
  { href: '/app', label: 'Today', icon: 'home', paths: ['/app', '/today', '/learn', '/calendar'] },
  { href: '/events', label: 'Courses', icon: 'book', paths: ['/events'] },
  { href: '/progress', label: 'Progress', icon: 'progress', paths: ['/progress'] },
];
export default function FinalChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [reading, setReading] = useState<string | null>(null);
  const clean = reading === path;
  const canRead = path.startsWith('/events/') && path !== '/events/all' && !path.startsWith('/events/courses/');
  const { data: session } = useSession();
  const current = [...navigation].reverse().find(n => n.paths.some(p => path === p || path.startsWith(p + '/')));
  const name = session?.user?.name || 'Learner';
  return <ReadingModeContext.Provider value={{ clean, canRead, toggle: () => setReading(clean ? null : path) }}><div className="final-shell f-simple-shell p-shell" data-clean-mode={clean ? 'true' : undefined}>
    <a className="f-skip" href="#workspace-content">Skip to content</a>
    <header className="f-navigation-wrap" data-no-i18n><div className="f-navigation">
      <Brand href="/app"/>
      <nav className="f-nav-track" aria-label="Main navigation">{navigation.map(n => <Link key={n.href} href={n.href} aria-current={current === n ? 'page' : undefined}><Icon name={n.icon} size={19}/><span>{n.label}</span></Link>)}</nav>
      <div className="f-nav-tools"><Link href="/events" className="p-nav-search" aria-label="Find learning material"><Icon name="search" size={22}/></Link><ThemeSwitch/><span className="f-nav-divider"/><Link href="/account" className="f-nav-account" aria-label="My account" aria-current={path === '/account' ? 'page' : undefined}><span className="f-avatar">{name.slice(0,1).toUpperCase()}</span><span>{name.split(' ')[0]}</span></Link></div>
    </div></header>
    <main id="workspace-content" className="f-content">{children}</main>
    {canRead && <button type="button" className="g-clean-toggle" data-no-i18n aria-pressed={clean} onClick={() => setReading(clean ? null : path)}><Icon name="expand" size={18}/>{clean ? 'Exit clean mode' : 'Clean mode'}</button>}
    {!canRead && path !== '/chat' && session?.user?.id && <Link href="/chat" className="p-global-assistant" data-no-i18n><Icon name="spark" size={22}/>Ask assistant</Link>}
    <footer className="f-workspace-footer" data-no-i18n><span>Small steps, made yours.</span><Link href="/progress">My progress</Link><Link href="/research">The research</Link><Link href="/privacy">Privacy</Link></footer>
    <nav className="f-mobile-dock" aria-label="Mobile navigation" data-no-i18n>{navigation.map(n => <Link key={n.href} href={n.href} aria-current={current === n ? 'page' : undefined}><Icon name={n.icon} size={21}/><span>{n.label}</span><i/></Link>)}</nav>
  </div></ReadingModeContext.Provider>;
}
