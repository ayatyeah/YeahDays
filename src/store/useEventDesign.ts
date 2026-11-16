'use client';
import { useSession } from 'next-auth/react';
import { eventDesignForUser, useThemeStore, type EventDesign } from './useThemeStore';
import { useUserStore } from './useUserStore';
import { validEventAppearance } from '@/lib/eventAppearance';

export function useEventDesign() {
  const { data: session } = useSession();
  const owner = session?.user?.id;
  const appearance = useUserStore(s => s.eventAppearance);
  const cached = useThemeStore(s => eventDesignForUser(s.eventDesignByUser, owner));
  const pending = useThemeStore(s => owner ? s.pendingEventDesignByUser[owner] : undefined);
  const design = pending ?? (validEventAppearance(appearance) && appearance.owner === owner ? appearance.design : cached);
  const setDesign = (next: EventDesign) => {
    if (!owner) return;
    useThemeStore.getState().setEventDesign(owner, next);
    useUserStore.getState().setEventAppearance({ owner, design: next });
  };
  return { design, setDesign, owner };
}
