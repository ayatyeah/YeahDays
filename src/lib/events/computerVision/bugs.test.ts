import { expect, it } from "vitest";
import { BUGS } from "./bugs";

it("банк «Найди баг»: строка бага в коде, три разных исправления, объяснения на двух языках", () => {
  expect(BUGS.length).toBeGreaterThanOrEqual(30);
  expect(new Set(BUGS.map((b) => b.id)).size).toBe(BUGS.length);
  for (const b of BUGS) {
    expect(b.bug, b.id).toBeGreaterThanOrEqual(0);
    expect(b.bug, b.id).toBeLessThan(b.lines.length);
    expect(new Set(b.fixes).size, b.id).toBe(3);
    expect(b.fixes, b.id).not.toContain(b.lines[b.bug]);
    for (const t of [b.why, ...b.wrongFix]) expect(t.ru.trim() && t.en.trim(), b.id).toBeTruthy();
  }
});

it("каждая тема встречается хотя бы дважды", () => {
  const count = new Map<string, number>();
  for (const b of BUGS) count.set(b.topic, (count.get(b.topic) ?? 0) + 1);
  for (const [topic, n] of count) expect(n, topic).toBeGreaterThanOrEqual(2);
});
