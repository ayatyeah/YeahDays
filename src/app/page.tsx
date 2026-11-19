import type { Metadata } from 'next';
import FinalLanding from '@/components/final/FinalLanding';
export const metadata: Metadata = {
  title: 'YeahGrind — Small lessons. Lasting knowledge.',
  description: 'Learn one idea at a time with short explanations, quick checks and focused practice.',
  openGraph: { title: 'YeahGrind — Small lessons. Lasting knowledge.', description: 'One idea. A quick check. A little progress, every day.', url: 'https://yeahgrind.site', siteName: 'YeahGrind', locale: 'en_US', type: 'website' },
};
export default function Page() { return <FinalLanding/>; }
