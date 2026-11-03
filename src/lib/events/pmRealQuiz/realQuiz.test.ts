import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import alternatives from "./alternatives.json";
import bank from "./questions.json";
import sources from "./sources.json";
import notes from "./notes.json";
import { answerStats, availableQuestions, parseAnswers, realProgress, realQuizKey } from "./model";
import { event } from "./event";
import { draw, steps } from "../engine";

describe("PM real quiz source coverage and learning", () => {
  it("retains known gaps, uncertain variant identity, and every source image", () => {
    expect(["1", "4", "5", "unknown"].map(v => availableQuestions.filter(q => q.variant === v).length)).toEqual([50,37,46,18]);
    expect(bank.filter(q => !q.available && q.variant === "4").map(q => q.number)).toEqual([28,29,30,31,32,38,39,40,41,42,48,49,50]);
    expect(bank.filter(q => !q.available && q.variant === "5").map(q => q.number)).toEqual([1,2,3,4]);
    expect(sources).toHaveLength(41);
    expect(new Set(bank.map(q => q.id)).size).toBe(bank.length);
    for (const source of sources) {
      expect(existsSync(`public${source.src}`)).toBe(true);
      expect(source.questions.some(id => availableQuestions.some(q => q.id === id && q.sources.some(id => id === source.id)))).toBe(true);
    }
    for (const q of availableQuestions) {
      expect(q.options).toHaveLength(5);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(5);
      expect(q.explanation.length).toBeGreaterThan(100);
      expect(q.text + q.options.join(" ")).not.toMatch(/Не опознан|Нету на фото/);
      expect(q.sources.length).toBeGreaterThan(0);
      for (const s of q.sources) expect(sources[s].questions).toContain(q.id);
    }
  });
  it("keeps source letter order and distinct calculation results", () => {
    const get = (v: string, n: number) => bank.find(q => q.variant === v && q.number === n)!;
    expect(get("1",1).options[get("1",1).answer!]).toBe("The undistributed budget.");
    expect(get("4",1).options[get("4",1).answer!]).toBe("The unallocated budget.");
    expect(get("1",18).options[get("1",18).answer!]).toBe("-100; the work cost more than budgeted.");
    expect(get("5",19).options[get("5",19).answer!]).toBe("CPI = 1.2 and SPI = 0.8.");
    expect(get("5",20).options[get("5",20).answer!]).toBe("-200.");
    const quiz = draw(event, { ...steps(event).at(-1)!, count: 151 });
    expect(quiz).toHaveLength(151);
    for (const item of quiz) expect(item.options).toEqual(bank.find(q => q.id === item.id)!.options);
  });
  it("connects both summaries to available examples for all five lectures", () => {
    expect([...new Set(notes.map(n => n.lecture))]).toEqual([4,5,6,7,8]);
    for (const note of notes) {
      expect(note.brief.length).toBeGreaterThan(150);
      expect(note.full.length).toBeGreaterThan(note.brief.length * 2);
      for (const ref of note.examples) expect(availableQuestions.some(q => `${q.variant}:${q.number}` === ref)).toBe(true);
    }
    for (const q of availableQuestions) expect(notes.some(n => n.lecture === q.lecture && n.examples.includes(`${q.variant}:${q.number}`))).toBe(true);
  });
  it("offers exactly four distinct counterfactuals per available question without changing original answers", () => {
    const entries: Record<string, typeof alternatives["pm-real-1-1"]> = alternatives;
    expect(Object.keys(entries).sort()).toEqual(availableQuestions.map(q => q.id).sort());
    expect(Object.values(entries).flat()).toHaveLength(604);
    for (const q of availableQuestions) {
      const variants = entries[q.id];
      expect(variants.map(v => v.answer)).toEqual([0,1,2,3,4].filter(i => i !== q.answer));
      expect(new Set(variants.map(v => v.question)).size).toBe(4);
      for (const v of variants) {
        expect(["scenario", "misconception"]).toContain(v.mode);
        expect(v.question.trim()).not.toBe("");
        expect(v.question).not.toBe(q.text);
        expect(v.explanation.trim()).not.toBe("");
      }
    }
    // Regression: changing scope communication must not accidentally reuse a budget-authorization explanation.
    expect(entries["pm-real-5-16"].find(v => v.answer === 3)!.question).toContain("scope");
    expect(entries["pm-real-5-16"].find(v => v.answer === 4)!.question).toContain("vendor");
    // Verify the authored VAC scenarios against the original numeric choices.
    const q = availableQuestions.find(q => q.id === "pm-real-5-20")!;
    for (const [answer, actualCost] of [[0,350], [2,525], [3,300], [4,450]]) {
      const v = entries[q.id].find(v => v.answer === answer)!;
      expect(v.question).toContain(`ACWP = ${actualCost}`);
      expect(800 - 800 * actualCost / 400).toBe(Number(q.options[answer].replace(/\.$/, "")));
    }
  });
  it("isolates users, rejects damaged answers and excludes unseen questions from error counts", () => {
    expect(realQuizKey("alice")).not.toBe(realQuizKey("bob"));
    expect(parseAnswers("broken")).toEqual({});
    expect(parseAnswers(JSON.stringify({ "pm-real-1-1": 0, "pm-real-5-1": 1, "pm-real-1-2": 9, "pm-real-1-3": "0" }))).toEqual({"pm-real-1-1":0});
    expect(answerStats({"pm-real-1-1":0})).toEqual({ total:151, answered:1, correct:1 });
    expect(realProgress({"pm-real-1-1":0})).toEqual({});
    const complete = Object.fromEntries(availableQuestions.map(q => [q.id, q.answer!]));
    expect(Object.keys(realProgress(complete))).toHaveLength(11);
    expect(Object.values(realProgress(complete)).every(p => p.best === 1)).toBe(true);
  });
});
