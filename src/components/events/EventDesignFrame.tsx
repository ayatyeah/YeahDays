'use client';

import { useSession } from 'next-auth/react';
import { eventDesignForUser, useThemeStore } from '@/store/useThemeStore';

/** Account-scoped appearance, shared by every event on this browser. */
export default function EventDesignFrame({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const design = useThemeStore(s => eventDesignForUser(s.eventDesignByUser, session?.user?.id));
  return <div className="prime-event" data-event-design={design}>{children}</div>;
}
