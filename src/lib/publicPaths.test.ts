import { expect, it } from "vitest";
import { needsLogin } from "./publicPaths";

it("содержимое ивентов (статический JSON) отдаётся без входа, а сами экраны — только после входа", () => {
  expect(needsLogin("/events-data/cloud-computing-midterm")).toBe(false);
  expect(needsLogin("/events")).toBe(true);
  expect(needsLogin("/events/cloud-computing-midterm")).toBe(true);
  expect(needsLogin("/login")).toBe(false);
});
