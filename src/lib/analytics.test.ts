import { expect, it, vi } from "vitest";
import { analyticsEnabled, track } from "./analytics";
it("external product analytics remain off even when legacy keys exist", () => {
  const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
  expect(analyticsEnabled).toBe(false); track("action_completed", { category: "learning" });
  expect(fetch).not.toHaveBeenCalled(); vi.unstubAllGlobals();
});
