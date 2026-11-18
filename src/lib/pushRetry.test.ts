import { beforeEach, expect, it, vi } from 'vitest';
const m = vi.hoisted(() => ({ users: vi.fn(), subs: vi.fn(), due: vi.fn(), claim: vi.fn(), digestClaim: vi.fn(), send: vi.fn(), cleanup: vi.fn() }));
vi.mock('./db', () => ({ prisma: {
  user: { findMany: m.users },
  pushSubscription: { findMany: m.subs, updateMany: m.digestClaim },
  scheduledNotification: { findMany: m.due, updateMany: m.claim, deleteMany: m.cleanup },
} }));
vi.mock('./push', () => ({ pushConfigured: true, sendPush: m.send, localHour: () => 8, localDateKey: () => '2026-11-18', morningMessage: () => ({ title: 'Morning' }), eveningMessage: () => ({ title: 'Evening' }) }));
import { runDispatch } from './pushDispatch';
import { runDigest } from './pushDigest';
const now = new Date('2026-11-18T08:00:00Z');
const later = new Date('2026-11-18T08:01:00Z');
beforeEach(() => { vi.resetAllMocks(); m.users.mockResolvedValue([]); m.cleanup.mockResolvedValue({ count: 0 }); });
function queue(devices = 1) {
  const row: { sentAt: Date | null } = { sentAt: null };
  m.due.mockImplementation(({ where }) => row.sentAt || where.id?.notIn?.includes('job') ? [] : [{ id: 'job', kind: 'todo', user: { state: { data: {} }, pushSubs: Array.from({length:devices}, (_, i) => ({ id: `device${i}`, tzOffset: 0 })) } }]);
  m.claim.mockImplementation(({ where, data }) => {
    if (row.sentAt?.getTime() !== where.sentAt?.getTime()) return { count: 0 };
    row.sentAt = data.sentAt;
    return { count: 1 };
  });
  return row;
}
it('retries a failed queued notification on the next tick', async () => {
  const row = queue();
  m.send.mockResolvedValueOnce('failed').mockResolvedValue('sent');
  expect(await runDispatch(now)).toMatchObject({ ok: false, failed: 1, sent: 0 });
  expect(row.sentAt).toBeNull();
  expect(await runDispatch(later)).toMatchObject({ ok: true, sent: 1 });
  expect(m.send).toHaveBeenCalledTimes(2);
  expect(row.sentAt).toEqual(later);
});
it('does not resend to successful devices after a partial delivery failure', async () => {
  const row = queue(2);
  m.send.mockResolvedValueOnce('sent').mockResolvedValueOnce('failed');
  expect(await runDispatch(now)).toMatchObject({ ok: false, sent: 1, failed: 1 });
  expect(row.sentAt).toEqual(now);
  await runDispatch(later);
  expect(m.send).toHaveBeenCalledTimes(2);
});
it('does not clear a notification claim replaced by another operation', async () => {
  const row = queue();
  m.send.mockImplementation(async () => { row.sentAt = later; return 'failed'; });
  await runDispatch(now);
  expect(row.sentAt).toEqual(later);
});
it('does not hot-loop failed notifications while draining a full batch', async () => {
  const rows = Array.from({length:25},(_,i)=>({id:`job${i}`,sentAt:null as Date|null}));
  m.due.mockImplementation(({ where, take }) => rows.filter(r => !r.sentAt && !where.id?.notIn?.includes(r.id)).slice(0,take).map(r => ({...r,kind:'todo',user:{state:{data:{}},pushSubs:[{tzOffset:0}]}})));
  m.claim.mockImplementation(({where,data})=>{ const row=rows.find(r=>r.id===where.id)!; if(row.sentAt?.getTime()!==where.sentAt?.getTime())return {count:0};row.sentAt=data.sentAt;return {count:1}; });
  m.send.mockResolvedValue('failed');
  expect(await runDispatch(now)).toMatchObject({ failed:25, sent:0 });
  expect(m.send).toHaveBeenCalledTimes(25);
  expect(rows.every(r=>r.sentAt===null)).toBe(true);
});
it('releases a failed digest claim and retries without repeating a successful digest', async () => {
  const row = { id:'device',tzOffset:0,morningHour:8,eveningHour:20,lastSentAt:null as Date|null,lastKind:null as string|null,user:{state:{data:{}}} };
  m.subs.mockImplementation(async()=>[{...row}]);
  m.digestClaim.mockImplementation(({where,data})=>{
    if(row.lastSentAt?.getTime()!==where.lastSentAt?.getTime() || row.lastKind!==where.lastKind)return {count:0};
    Object.assign(row,data);return {count:1};
  });
  m.send.mockResolvedValueOnce('failed').mockResolvedValue('sent');
  expect(await runDigest(now)).toMatchObject({ok:false,failed:1});
  expect(row.lastSentAt).toBeNull();
  expect(await runDigest(later)).toMatchObject({ok:true,sent:1});
  await runDigest(new Date(later.getTime()+60000));
  expect(m.send).toHaveBeenCalledTimes(2);
});
it('does not erase a newer digest claim when a send fails', async () => {
  const row = { id:'device',tzOffset:0,morningHour:8,eveningHour:20,lastSentAt:null as Date|null,lastKind:null as string|null,user:{state:{data:{}}} };
  m.subs.mockImplementation(async()=>[{...row}]);
  m.digestClaim.mockImplementation(({where,data})=>{
    if(row.lastSentAt?.getTime()!==where.lastSentAt?.getTime() || row.lastKind!==where.lastKind)return {count:0};
    Object.assign(row,data);return {count:1};
  });
  m.send.mockImplementation(async()=>{row.lastSentAt=later;return 'failed';});
  await runDigest(now);
  expect(row.lastSentAt).toEqual(later);
});

it.each([
  { dailyGoal: 1, done: 1, expectedSent: 0 },
  { dailyGoal: 5, done: 3, expectedSent: 1 },
  { dailyGoal: undefined, done: 1, expectedSent: 1 },
  { dailyGoal: undefined, done: 2, expectedSent: 0 },
])('uses daily goal $dailyGoal with $done completed tasks for evening reminders', async ({ dailyGoal, done, expectedSent }) => {
  m.subs.mockResolvedValue([{ id:'device', tzOffset:0, morningHour:20, eveningHour:8, lastSentAt:null, lastKind:null,
    user:{state:{data:{dailyGoal,plan:Array.from({length:done},()=>({date:'2026-11-18',completed:true,xp:10}))}}},
  }]);
  m.digestClaim.mockResolvedValue({count:1});
  m.send.mockResolvedValue('sent');
  expect(await runDigest(now)).toMatchObject({ok:true,sent:expectedSent});
  expect(m.send).toHaveBeenCalledTimes(expectedSent);
  expect(m.digestClaim).toHaveBeenCalledTimes(expectedSent);
});
