'use client';

import { useEventDesign } from '@/store/useEventDesign';

/** Account-synced appearance, shared by every event and device. */
export default function EventDesignFrame({ children }: { children: React.ReactNode }) {
  const { design } = useEventDesign();
  return <div className="prime-event" data-event-design={design}>{children}</div>;
}
