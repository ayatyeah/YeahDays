import { notFound, redirect } from 'next/navigation';
import { findFinalEvent } from '@/lib/events/finals';
export function generateStaticParams() { return [{ id: 'cloud-computing-endterm' }]; }
export default async function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const notebook = findFinalEvent((await params).id);
  if (!notebook) notFound();
  redirect(`/events/${notebook.event.id}`);
}
