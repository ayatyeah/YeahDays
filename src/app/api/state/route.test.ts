import { beforeEach, expect, it, vi } from "vitest";
const mock = vi.hoisted(() => ({ auth: vi.fn(), findUnique: vi.fn(), merge: vi.fn() }));
vi.mock("@/auth", () => ({ auth: mock.auth }));
vi.mock("@/lib/db", () => ({ prisma: { userState: { findUnique: mock.findUnique } } }));
vi.mock("@/lib/userState", () => ({ mergeUserState: mock.merge }));
import { GET, PUT } from "./route";
beforeEach(() => { vi.clearAllMocks(); mock.auth.mockResolvedValue({ user: { id: "owner" } }); });
it("distinguishes read failure from an empty account", async () => {
 mock.findUnique.mockRejectedValueOnce(new Error("DB down"));
 expect((await GET(new Request("http://local/api/state"))).status).toBe(503);
 mock.findUnique.mockResolvedValue(null);
 expect(await (await GET(new Request("http://local/api/state"))).json()).toEqual({ data: null, revision: 0 });
});
it("uses server revision, not the caller's clock", async () => {
 mock.findUnique.mockResolvedValue({ data: {}, revision: 4 });
 expect(await (await GET(new Request("http://local/api/state?revision=4&since=999999999999"))).json()).toEqual({ unchanged: true, revision: 4 });
});
it("rejects old overwrite requests before mutation", async () => {
 const result = await PUT(new Request("http://local/api/state", { method: "PUT", body: JSON.stringify({ data: { updatedAt: 1 } }) }));
 expect(result.status).toBe(409); expect(mock.merge).not.toHaveBeenCalled();
});
it("binds a valid merge to the session owner", async () => {
 const data = { updatedAt: 0, todos: [], plan: [], quests: [], challenges: [], customActions: [] };
 mock.merge.mockResolvedValue({ data, revision: 2 });
 const result = await PUT(new Request("http://local/api/state", { method: "PUT", body: JSON.stringify({ protocol: 2, userId: "someone-else", data, base: null, baseRevision: 0 }) }));
 expect(result.status).toBe(200); expect(mock.merge).toHaveBeenCalledWith("owner", null, data);
});
