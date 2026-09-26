import { describe, expect, it } from "vitest";
import { failureLimit, rateLimit } from "./rateLimit";

const WINDOW = 60_000;

describe("rateLimit", () => {
  it("пускает до предела и отсекает дальше", () => {
    const key = `t-${Math.random()}`;
    expect(rateLimit(key, 2, WINDOW)).toBe(true);
    expect(rateLimit(key, 2, WINDOW)).toBe(true);
    expect(rateLimit(key, 2, WINDOW)).toBe(false);
  });
});

describe("failureLimit", () => {
  it("успешные попытки не приближают блокировку", () => {
    // Ровно та ситуация, ради которой он и появился: общий Wi-Fi, много
    // людей, все входят правильно — блокировать их нельзя.
    const key = `ok-${Math.random()}`;
    for (let i = 0; i < 50; i++) {
      expect(failureLimit(key, 3, WINDOW).allowed).toBe(true);
    }
  });

  it("считает только провалы и закрывает дверь на пределе", () => {
    const key = `bad-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      const gate = failureLimit(key, 3, WINDOW);
      expect(gate.allowed).toBe(true);
      gate.fail();
    }
    expect(failureLimit(key, 3, WINDOW).allowed).toBe(false);
  });

  it("окно скользит: старые провалы перестают считаться", () => {
    const key = `old-${Math.random()}`;
    for (let i = 0; i < 3; i++) failureLimit(key, 3, 30).fail();
    expect(failureLimit(key, 3, 30).allowed).toBe(false);
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        expect(failureLimit(key, 3, 30).allowed).toBe(true);
        resolve();
      }, 45),
    );
  });
});
