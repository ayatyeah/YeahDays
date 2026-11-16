import { beforeEach, describe, expect, it } from 'vitest';
import { eventDesignForUser, useThemeStore } from './useThemeStore';

describe('event design preference', () => {
  beforeEach(() => useThemeStore.setState({ theme: 'light', eventDesignByUser: {} }));

  it('isolates preferences when accounts change and leaves dark mode independent', () => {
    const store = useThemeStore.getState();
    store.setEventDesign('account-a', 'ocean');
    store.setEventDesign('account-b', 'sunset');
    store.setTheme('dark');
    const preferences = useThemeStore.getState().eventDesignByUser;
    expect(eventDesignForUser(preferences, 'account-a')).toBe('ocean');
    expect(eventDesignForUser(preferences, 'account-b')).toBe('sunset');
    expect(eventDesignForUser(preferences, 'account-c')).toBe('prime');
    expect(eventDesignForUser(preferences, null)).toBe('prime');
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('defaults safely for pre-existing or invalid persisted data', () => {
    expect(eventDesignForUser(undefined, 'a')).toBe('prime');
    expect(eventDesignForUser({ a: 'invalid' }, 'a')).toBe('prime');
    expect(eventDesignForUser({ a: 'sunset' }, 'a')).toBe('sunset');
    expect(eventDesignForUser({}, 'toString')).toBe('prime');
    expect(eventDesignForUser(null, 'a')).toBe('prime');
  });
});
