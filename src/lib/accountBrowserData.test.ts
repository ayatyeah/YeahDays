import { describe, expect, it } from 'vitest';
import { accountOwnsBrowserKey, clearAccountBrowserData } from './accountBrowserData';
function storage(entries: Record<string, string>) {
  const map = new Map(Object.entries(entries));
  return { get length() { return map.size; }, key: (i: number) => [...map.keys()][i] ?? null,
    getItem: (key: string) => map.get(key) ?? null, removeItem: (key: string) => { map.delete(key); }, map };
}

describe('deleted account browser data', () => {
  it('removes account study records, tutor chats and reading positions without touching another account', () => {
    const owned = ['yg-cn-bank:alice:Модуль 01','yg-aws-one-day-v1:alice','yg-aws-developing-checks-v1:alice','yg-aws-foundations-checks-v1:alice','yg-tutor:alice:cloud-computing-final', 'yg-mock:alice:course:exam', 'yg-event:alice:course','yg-sync-v2:alice','yg-lesson-draft:alice:skill:quest','yg-event-achievement:alice:course','yg-event-game-binary:alice','yg-philosophy-v1:alice'];
    const keep = ['yg-cn-bank:bob:Модуль 01','yg-aws-one-day-v1:bob','yg-tutor:alice2:course','unrelated:alice','yeahdays-theme','yg-story:story-id','yg-event-lang'];
    const local = storage(Object.fromEntries([...owned,...keep].map(key => [key,'saved'])));
    const session = storage({ 'yg-reading-position:alice:skill:quest:lesson':'35', 'yg-reading-position:bob:skill:quest:lesson':'70' });
    clearAccountBrowserData('alice',local,session);
    expect([...local.map.keys()]).toEqual(keep);
    expect([...session.map.keys()]).toEqual(['yg-reading-position:bob:skill:quest:lesson']);
  });
  it('only removes legacy data when its current owner matches and preserves the logout isolation sentinel', () => {
    const own=storage({ 'yd-active-account':'alice','yeahdays-store':'private','yd-uid':'device','yd-event-queue':'[]' });
    clearAccountBrowserData('alice',own);
    expect([...own.map.entries()]).toEqual([['yd-active-account','alice']]);
    const other=storage({ 'yd-active-account':'bob','yeahdays-store':'bob-private','yd-uid':'device','yd-event-queue':'[]' });
    clearAccountBrowserData('alice',other);
    expect(other.length).toBe(4);
  });
  it('requires exact ownership boundaries and never treats arbitrary keys as account data', () => {
    expect(accountOwnsBrowserKey('yg-aws-one-day-v1:alice-extra','alice')).toBe(false);
    expect(accountOwnsBrowserKey('yg-tutor:alice-extra:event','alice')).toBe(false);
    expect(accountOwnsBrowserKey('another-app:alice:event','alice')).toBe(false);
    expect(accountOwnsBrowserKey('yg-tutor::event','')).toBe(false);
  });
});
