import { afterAll, beforeAll, describe, expect, it } from "vitest";
const enabled = process.env.SYNC_DB_TEST === "1";
describe.skipIf(!enabled)("state merges on PostgreSQL", () => {
 let db: typeof import("./db").prisma;
 let merge: typeof import("./userState").mergeUserState;
 const id = `sync-test-${Date.now()}`;
 beforeAll(async () => {
   const url = new URL(process.env.DATABASE_URL!);
   if (!["localhost", "127.0.0.1"].includes(url.hostname) || !/test/.test(url.pathname)) throw new Error("Local test DB required");
   db = (await import("./db")).prisma; merge = (await import("./userState")).mergeUserState;
 });
 afterAll(async () => { if (db) await db.user.deleteMany({ where: { id } }); });
 it("serializes concurrent offline edits and revisions, independent of device clocks", async () => {
   const base = { todos: [{ id: "a", done: false }, { id: "b", done: false }], updatedAt: 1 };
   const initial = await merge(id, null, base);
   const [phone, laptop] = await Promise.all([
     merge(id, base, { todos: [{ id: "a", done: true }, { id: "b", done: false }], updatedAt: 9999999999999 }),
     merge(id, base, { todos: [{ id: "a", done: false }, { id: "b", done: true }], updatedAt: 0 }),
   ]);
   expect([phone.revision, laptop.revision].sort()).toEqual([initial.revision + 1, initial.revision + 2]);
   const result = await db.userState.findUniqueOrThrow({ where: { userId: id } });
   expect(result.data).toMatchObject({ todos: [{ id: "a", done: true }, { id: "b", done: true }] });
   expect(result.clientAt.getTime()).toBeLessThan(Date.now() + 1000);
 });
 it("does not resurrect a deletion from a stale device or retried request", async () => {
   const before = (await db.userState.findUniqueOrThrow({ where: { userId: id } })).data as Record<string, unknown>;
   await merge(id, before, { ...before, todos: [{ id: "b", done: true }] });
   const stale = { ...before, todos: [{ id: "a", done: false }, { id: "b", done: true }, { id: "c", done: false }] };
   await merge(id, before, stale);
   const retried = await merge(id, before, stale);
   expect(retried.data).toMatchObject({ todos: [{ id: "b", done: true }, { id: "c", done: false }] });
 });
 it("increments revision for legacy direct SQL writes", async () => {
   const before = await db.userState.findUniqueOrThrow({ where: { userId: id } });
   await db.$executeRaw`UPDATE "UserState" SET "data" = "data" WHERE "userId" = ${id}`;
   expect((await db.userState.findUniqueOrThrow({ where: { userId: id } })).revision).toBe(before.revision + 1);
 });
});
