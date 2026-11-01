import { afterEach, expect, it, vi } from "vitest";
import { linkAccount } from "./linkAccount";
afterEach(() => vi.unstubAllGlobals());
it("rejects JSON error bodies so migration can be retried", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Unavailable" }), { status: 503 })));
  await expect(linkAccount("guest")).rejects.toThrow();
});
it("accepts only a confirmed transfer", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true, moved: 3 }))));
  expect(await linkAccount("guest")).toBe(3);
});
