'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Brand, Icon } from './Brand';
import './final.css';
const navigation = [
  { href: '/app', label: 'Dashboard', icon: 'home', paths: ['/app', '/today'] },
  { href: '/learn', label: 'Study plan', icon: 'plan', paths: ['/learn', '/calendar'] },
  { href: '/events', label: 'Events', icon: 'events', paths: ['/events'] },
  { href: '/progress', label: 'Progress', icon: 'progress', paths: ['/progress'] },
  { href: '/research', label: 'Research', icon: 'research', paths: ['/research'] },
];
export default function FinalChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { data: session } = useSession();
  const current = navigation.find(n => n.paths.some(p => path === p || path.startsWith(p + '/')));
  const name = session?.user?.name || 'Learner';
  return <div className="final-shell">
    <a className="f-skip" href="#workspace-content">Skip to content</a>
    <aside className="f-sidebar" data-no-i18n>
      <Brand href="/app"/>
      <span className="f-sidebar-label">Your workspace</span>
      <nav aria-label="Main navigation">{navigation.map(n => <Link key={n.href} href={n.href} className={current === n ? 'active' : ''} aria-current={current === n ? 'page' : undefined}><Icon name={n.icon}/>{n.label}</Link>)}</nav>
      <div className="f-sidebar-note"><span className="f-small-spark"><Icon name="spark"/></span><strong>Small steps.<br/>Meaningful progress.</strong><p>Your next step starts with a goal that matters to you.</p><Link href="/learn">Open study plan <Icon name="arrow" size={17}/></Link></div>
      <div className="f-sidebar-bottom"><Link href="/account" className={path === '/account' ? 'active' : ''}><Icon name="user"/>My account</Link><Link href="/">About YeahGrind</Link><span>Built by YeahGrinders</span></div>
    </aside>
    <div className="f-main-frame">
      <header className="f-app-header" data-no-i18n><Brand href="/app"/><div><span>Workspace</span><span className="f-breadcrumb-separator">/</span><strong>{current?.label || (path === '/account' ? 'My account' : 'Learning')}</strong></div><Link href="/account" className="f-profile-link"><span>{name}</span><span className="f-avatar">{name.slice(0, 1).toUpperCase()}</span></Link></header>
      <main id="workspace-content" className="f-content">{children}</main>
    </div>
    <nav className="f-mobile-nav" aria-label="Mobile navigation" data-no-i18n>{navigation.map(n => <Link key={n.href} href={n.href} aria-current={current === n ? 'page' : undefined}><Icon name={n.icon} size={21}/><span>{n.label === 'Dashboard' ? 'Home' : n.label === 'Study plan' ? 'Plan' : n.label}</span></Link>)}</nav>
  </div>;
}
