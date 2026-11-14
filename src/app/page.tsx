import type { Metadata } from 'next';
import FinalLanding from '@/components/final/FinalLanding';
export const metadata: Metadata = {
  title: 'YeahGrind — Make learning a practice',
  description: 'Turn your learning goal into a personal study plan. Focus on concrete exercises, reflect on your progress and explore course events.',
  openGraph: { title: 'YeahGrind — Make learning a practice', description: 'A clear next step for your learning goal.', url: 'https://yeahgrind.site', siteName: 'YeahGrind', locale: 'en_US', type: 'website' },
};
export default function Page() { return <FinalLanding/>; }
