import { describe, it, expect } from "vitest";
import { xpForExternalActivity, buildExternalActionSnapshot } from "./externalActions";
import { xpForAction } from "./domain";

describe("xpForExternalActivity", () => {
  it("считает XP по формуле xpForAction для каждого типа активности", () => {
    // reading: difficulty 2, impact 3 → base 8+10+12=30
    expect(xpForExternalActivity("studyloop", "reading", "IELTS Reading", 25)).toBe(
      30 + Math.round(Math.min(25, 90) / 10),
    );
    // writing: difficulty 3, impact 4 → base 8+15+16=39
    expect(xpForExternalActivity("studyloop", "writing", "IELTS Writing", 40)).toBe(
      39 + Math.round(Math.min(40, 90) / 10),
    );
  });

  it("больше реальных минут — больше XP (реальное время, а не константа)", () => {
    const short = xpForExternalActivity("studyloop", "quiz", "Квиз", 5);
    const long = xpForExternalActivity("studyloop", "quiz", "Квиз", 45);
    expect(long).toBeGreaterThan(short);
  });

  it("длительность за пределами 90 минут не даёт больше бонуса (та же формула, что и у обычных действий)", () => {
    const at90 = xpForExternalActivity("studyloop", "notes", "Конспект", 90);
    const at200 = xpForExternalActivity("studyloop", "notes", "Конспект", 200);
    expect(at200).toBe(at90);
  });

  it("снимок действия совпадает с тем, что реально уходит в xpForAction", () => {
    const snapshot = buildExternalActionSnapshot("studyloop", "writing", "Task 2", 30);
    expect(snapshot.category).toBe("learning");
    expect(snapshot.duration).toBe(30);
    expect(xpForExternalActivity("studyloop", "writing", "Task 2", 30)).toBe(
      xpForAction(snapshot),
    );
  });
});
