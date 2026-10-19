'use client';
import StudyApp from '@/components/study/StudyApp';
import type { TabKey } from '@/lib/nav';
export default function AppShell({ initialTab }: { initialTab: TabKey }) {
  return <StudyApp view={initialTab} />;
}
