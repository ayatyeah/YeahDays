import { afterEach, describe, expect, it, vi } from "vitest";
import { failureLimit, rateLimit, SlidingWindowLimiter } from "./rateLimit";

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


afterEach(() => vi.useRealTimers());
it("bounds noisy keys and recovers after the accepted window", () => {
  vi.useFakeTimers(); vi.setSystemTime(10000);
  const limiter = new SlidingWindowLimiter(2);
  expect(limiter.allow("busy", 2, 1000)).toBe(true);
  expect(limiter.allow("busy", 2, 1000)).toBe(true);
  for (let n = 0; n < 10000; n++) expect(limiter.allow("busy", 2, 1000)).toBe(false);
  vi.advanceTimersByTime(1001);
  expect(limiter.allow("busy", 2, 1000)).toBe(true);
});
it("does not evict live login limits when new keys flood capacity", () => {
  vi.useFakeTimers(); vi.setSystemTime(10000);
  const limiter = new SlidingWindowLimiter(2);
  expect(limiter.allow("long", 1, 60000)).toBe(true);
  expect(limiter.allow("short", 1, 1000)).toBe(true);
  expect(limiter.allow("new", 1, 1000)).toBe(false);
  expect(limiter.allow("long", 1, 60000)).toBe(false);
  vi.advanceTimersByTime(1001);
  expect(limiter.allow("new", 1, 1000)).toBe(true);
  expect(limiter.allow("long", 1, 60000)).toBe(false);
});
it("counts concurrent asynchronous failures together and each callback once", () => {
  const limiter = new SlidingWindowLimiter();
  const first = limiter.failures("login", 2, 60000);
  const second = limiter.failures("login", 2, 60000);
  first.fail(); first.fail();
  expect(limiter.failures("login", 2, 60000).allowed).toBe(true);
  second.fail();
  expect(limiter.failures("login", 2, 60000).allowed).toBe(false);
});
