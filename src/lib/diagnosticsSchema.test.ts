import { expect, it } from "vitest";
import { diagnosticRoute, safeSignal, durationBucket } from "./diagnosticsSchema";
it("never retains free text, personal paths, query parameters or identifiers", () => {
 const signal = safeSignal({ kind: "browser_error", code: "secret task", route: "/api/media/private-user-id?token=secret", message: "my homework", stack: "private", userId: "123", ip: "1.2.3.4", status: 500, duration: "5-10s" });
 expect(signal).toEqual({ kind: "browser_error", code: "error", route: "/api/media/:item", status: 500, duration: "5-10s" });
 expect(diagnosticRoute("/private-name-and-email")).toBe("/other");
 expect(diagnosticRoute("/api/state?userId=secret")).toBe("/api/state");
});
it("bounds categories and timing instead of persisting arbitrary payloads", () => {
 expect(safeSignal({ kind: "my-private-event" })).toBeNull();
 expect(safeSignal({ kind: "api_slow", status: -1, duration: "my text" })).toMatchObject({ status: 0, duration: "under2s" });
 expect([100,2500,6000,20000].map(durationBucket)).toEqual(["under2s","2-5s","5-10s","over10s"]);
});
