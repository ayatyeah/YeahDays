import { describe, expect, it, vi } from "vitest";
import { dailyLimitWith, type LimitDb } from "./aiLimit";

/** База в памяти с тем же поведением upsert, что у Prisma. */
function fakeDb(): LimitDb & { rows: Map<string, number> } {
  const rows = new Map<string, number>();
  return {
    rows,
    aiLimit: {
      upsert: async ({ where, create, update }) => {
        const k = `${where.key_day.key}|${where.key_day.day}`;
        const count = rows.has(k) ? rows.get(k)! + update.count.increment : create.count;
        rows.set(k, count);
        return { count };
      },
      deleteMany: async () => ({ count: 0 }),
    },
  };
}

describe("суточный лимит ИИ в базе", () => {
  const now = new Date("2026-10-10T12:00:00Z");

  it("пускает до лимита включительно, дальше — нет", async () => {
    const db = fakeDb();
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await dailyLimitWith(db, "tutor-day:u1", 3, now));
    expect(results).toEqual([true, true, true, false]);
  });

  it("у каждого ключа и каждых суток свой счётчик", async () => {
    const db = fakeDb();
    await dailyLimitWith(db, "tutor-day:u1", 1, now);
    expect(await dailyLimitWith(db, "tutor-day:u2", 1, now)).toBe(true);
    expect(await dailyLimitWith(db, "tutor-day:u1", 1, new Date("2026-10-11T00:00:01Z"))).toBe(true);
    expect([...db.rows.keys()].sort()).toEqual(["tutor-day:u1|2026-10-10", "tutor-day:u1|2026-10-11", "tutor-day:u2|2026-10-10"]);
  });

  it("если база недоступна — не роняет запрос, а считает в памяти", async () => {
    const broken: LimitDb = { aiLimit: { upsert: vi.fn().mockRejectedValue(new Error("relation does not exist")), deleteMany: vi.fn() } };
    expect(await dailyLimitWith(broken, "report:fallback-user", 1, now)).toBe(true);
    expect(await dailyLimitWith(broken, "report:fallback-user", 1, now)).toBe(false);
  });
});
