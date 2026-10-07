import { describe, expect, it } from "vitest";
import { agoLabel, ONLINE_MS, presenceOf } from "./presence";

const NOW = Date.parse("2026-10-07T12:00:00Z");

describe("presenceOf", () => {
  it("свежий heartbeat — в сети", () => {
    expect(presenceOf(true, NOW - 30_000, NOW)).toEqual({ state: "online", lastActiveAt: new Date(NOW - 30_000).toISOString() });
    expect(presenceOf(true, NOW - ONLINE_MS, NOW).state).toBe("online");
  });

  it("давний heartbeat — не в сети, но время последней активности есть", () => {
    const p = presenceOf(true, NOW - ONLINE_MS - 1, NOW);
    expect(p.state).toBe("away");
    expect(p.lastActiveAt).toBe(new Date(NOW - ONLINE_MS - 1).toISOString());
  });

  it("учёт активности выключен или отметок нет — ничего не знаем и время не показываем", () => {
    expect(presenceOf(false, NOW - 1000, NOW)).toEqual({ state: "unknown", lastActiveAt: null });
    expect(presenceOf(null, null, NOW)).toEqual({ state: "unknown", lastActiveAt: null });
    expect(presenceOf(true, 0, NOW)).toEqual({ state: "unknown", lastActiveAt: null });
  });
});

describe("agoLabel", () => {
  const ago = (ms: number) => agoLabel(new Date(NOW - ms).toISOString(), NOW);

  it("минуты, часы, вчера, дата", () => {
    expect(ago(10_000)).toBe("1 мин назад");
    expect(ago(5 * 60_000)).toBe("5 мин назад");
    expect(ago(3 * 60 * 60_000)).toBe("3 ч назад");
    // 12:00 UTC = 17:00 в Алматы; 30 часов назад — вчера по Алматы
    expect(ago(30 * 60 * 60_000)).toBe("вчера");
    expect(ago(5 * 24 * 60 * 60_000)).toBe("02.10");
  });
});
