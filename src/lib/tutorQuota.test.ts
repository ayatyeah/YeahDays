import { expect, it, vi } from "vitest";
import { tutorQuotaWith } from "./tutorQuota";

it("reads the authenticated user's UTC budget without consuming requests", async () => {
  const findMany = vi.fn().mockResolvedValue([{key:"tutor-day:u1",count:17},{key:"tutor:global",count:200}]);
  const result = await tutorQuotaWith({aiLimit:{findMany}},"u1",new Date("2026-11-09T23:59:00Z"));
  expect(result?.personal).toEqual({limit:120,used:17,remaining:103,resetsAt:"2026-11-10T00:00:00.000Z"});
  expect(result?.shared.remaining).toBe(3800);
  expect(findMany).toHaveBeenCalledWith({where:{day:"2026-11-09",key:{in:["tutor-day:u1","tutor:global"]}},select:{key:true,count:true}});
});
it("new UTC day starts at full budget and exhausted counters never go negative", async () => {
  const findMany = vi.fn().mockResolvedValueOnce([]).mockResolvedValue([{key:"tutor-day:u1",count:121},{key:"tutor:global",count:4002}]);
  const db={aiLimit:{findMany}};
  expect((await tutorQuotaWith(db,"u1"))?.personal.remaining).toBe(120);
  const exhausted=await tutorQuotaWith(db,"u1");expect(exhausted?.personal.remaining).toBe(0);expect(exhausted?.shared.remaining).toBe(0);
});
it("unavailable storage means unknown, never a fabricated full balance", async () => {
  expect(await tutorQuotaWith({aiLimit:{findMany:vi.fn().mockRejectedValue(new Error('offline'))}},"u1")).toBeNull();
});
