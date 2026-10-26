import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadScroll, saveScroll } from "./scrollMemory";

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };
});
afterEach(() => {
  delete (globalThis as { localStorage?: unknown }).localStorage;
});

const question = { id: "q1", lecture: 0, q: "Q?", options: ["a", "b"], correct: 1, why: { en: "w", ru: "п" } };

describe("scroll-mode: где остановился", () => {
  it("место, места по частям и недоотвеченный тест сохраняются и читаются", () => {
    saveScroll("u", "e", {
      at: { step: "p2", kind: "question", n: 3 },
      places: { p1: { step: "p1", kind: "page", n: 7 }, p2: { step: "p2", kind: "question", n: 3 } },
      tests: { p2: { quiz: [question, question], answers: [1, null] } },
    });
    const m = loadScroll("u", "e");
    expect(m.at).toEqual({ step: "p2", kind: "question", n: 3 });
    expect(m.places.p1).toEqual({ step: "p1", kind: "page", n: 7 });
    expect(m.tests.p2.answers).toEqual([1, null]);
    expect(loadScroll("u", "other")).toEqual({ places: {}, tests: {} });
  });

  it("мусор в хранилище не ломает экран: битые записи отбрасываются", () => {
    store.set("yg-event-scroll:u:e", JSON.stringify({ at: { step: 1, kind: "page" }, places: { p: { step: "p", kind: "nope" } }, tests: { p: { quiz: [question], answers: [] } } }));
    expect(loadScroll("u", "e")).toEqual({ at: undefined, places: {}, tests: {} });
    store.set("yg-event-scroll:u:e", "{не json");
    expect(loadScroll("u", "e")).toEqual({ places: {}, tests: {} });
  });
});
