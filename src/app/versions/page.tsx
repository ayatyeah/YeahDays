import { redirect } from 'next/navigation';
// The RMT/ordinary version picker was removed; old links open the main page.
export default function Page() { redirect('/'); }
