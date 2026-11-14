'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from '@/lib/signOut';
import DataControls from '@/components/DataControls';
import LanguageSwitcher from '@/i18n/LanguageSwitcher';
import { Icon } from './Brand';
export default function FinalAccount() {
  const { data: session } = useSession();
  return <div className="f-account"><div className="f-page-heading" data-no-i18n><div><span className="f-section-kicker">Your space, your choices</span><h1>My account</h1><p>Manage your profile, preferences and saved data.</p></div></div><div className="f-account-grid"><section className="f-panel" data-no-i18n><div className="f-account-identity"><span className="f-avatar">{(session?.user?.name || 'Y').slice(0,1).toUpperCase()}</span><div><h2>{session?.user?.name || 'YeahGrind learner'}</h2><p>{session?.user?.email || 'Your connected account'}</p></div></div><Link className="f-button f-button-outline" href="/settings">Account settings <Icon name="arrow" size={18}/></Link><hr/><h3>Course content language</h3><p>English is the main workspace language. You can also read supported course materials in Russian or Kazakh.</p><LanguageSwitcher/><hr/><h3>Your study plan</h3><p>Your new study plan and earlier course progress are saved separately. Previous events remain available in the Events section.</p><div className="f-account-links"><Link href="/learn">My study plan</Link><Link href="/events">Course events</Link><Link href="/rmt/account">Earlier study participation</Link></div></section><section className="f-panel"><h2 data-no-i18n>Your data</h2><p data-no-i18n>Download your account data or manage deletion. Your study plan includes your task text and reflections.</p><DataControls/></section></div><div className="f-account-footer" data-no-i18n><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/research">About the research</Link></div><button className="f-button f-button-outline" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button></div></div>;
}
