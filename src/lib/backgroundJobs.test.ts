import { expect, it, vi, beforeEach } from "vitest";
const mock = vi.hoisted(() => ({ upsert: vi.fn() }));
vi.mock("./db", () => ({ prisma: { backgroundJob: { upsert: mock.upsert } } }));
import { runTrackedJob } from "./backgroundJobs";
beforeEach(() => { vi.clearAllMocks(); mock.upsert.mockResolvedValue({ consecutiveFailures: 0 }); });
it("records partial failure as failure", async () => {
 await runTrackedJob("lms-sync", async () => ({ ok: false }));
 expect(mock.upsert.mock.calls[0][0].update.consecutiveFailures).toEqual({ increment: 1 });
});
it("resets the failure streak after success", async () => {
 await runTrackedJob("lms-sync", async () => ({ ok: true }));
 expect(mock.upsert.mock.calls[0][0].update.consecutiveFailures).toBe(0);
});
it("records and rethrows exceptions", async () => {
 await expect(runTrackedJob("lms-sync", async () => { throw new Error("failed"); })).rejects.toThrow("failed");
 expect(mock.upsert).toHaveBeenCalledOnce();
});
