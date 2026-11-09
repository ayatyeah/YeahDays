import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import bank from "./bank.json";
import { event } from "./event";
import express from "./express.json";

describe("NetAcad explanation and course audit", () => {
  it("reviews every source card once and ships the reviewed bilingual explanations", () => {
    const seen = new Set<string>();
    for (let module = 8; module <= 16; module++) {
      const review = JSON.parse(readFileSync(`src/lib/events/computerNetworksEndterm/audit/module-${module}.json`, "utf8"));
      expect(review.questions.length).toBe(bank.filter(q => q.topic === module).length);
      expect(review.coverage.length).toBeGreaterThan(3);
      for (const patch of review.questions) {
        expect(seen.has(patch.id)).toBe(false); seen.add(patch.id);
        const q = bank.find(q => q.id === patch.id)!;
        expect(q.topic).toBe(module);
        expect(q.explanation).toBe(patch.explanation);
        expect(q.explanationEn).toBe(patch.explanationEn);
        for (const text of [q.explanation, q.explanationEn]) {
          expect(text.length).toBeGreaterThan(90);
          expect(text).not.toContain("A detailed English explanation is not available");
        }
      }
      const part = event.lectures.flatMap(l => l.parts).find(p => p.id === `cne-m${module}`)!;
      for (const lang of ["ru", "en"] as const) expect(part.notes[lang]).toContain(review.notes[lang]);
    }
    expect(seen.size).toBe(558);
  });
  it("keeps known ambiguous items out of scored practice", () => {
    expect(bank.find(q => q.id === "E227")?.eligible).toBe(false);
    for (const q of bank) if (q.eligible) {
      expect(q.caution).toBe("");
      expect(new Set(q.correct).size).toBe(q.correct.length);
      for (const index of q.correct) expect(q.options[index]).toBeTruthy();
    }
  });
  it("provides recall exercises for every module and downloadable reviewed material", () => {
    expect(new Set(express.map(c => c.id)).size).toBe(express.length);
    expect([...new Set(express.map(c => c.module))].sort((a,b) => a-b)).toEqual([8,9,10,11,12,13,14,15,16]);
    for (const part of event.lectures.flatMap(l => l.parts)) for (const lang of ["ru", "en"] as const) {
      expect(readFileSync(`public/events/computer-networks-endterm/notes-${lang}.md`, "utf8")).toContain(part.notes[lang]);
    }
    const download = readFileSync("public/events/computer-networks-endterm/question-bank.md", "utf8");
    for (const q of bank) { expect(download).toContain(q.explanation); expect(download).toContain(q.explanationEn); }
  });
});
