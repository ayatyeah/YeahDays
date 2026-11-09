import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { event } from "./event";
import supplements from "./question-supplements.json";

describe("question-focused study supplements", () => {
  it("serves both languages in every full reader and downloadable notes", () => {
    for (const lecture of event.lectures) for (const part of lecture.parts) {
      const module = part.id.replace("cne-m", "") as keyof typeof supplements;
      for (const lang of ["ru", "en"] as const) {
        expect(part.notes[lang]).toContain(supplements[module][lang]);
        expect(readFileSync(`public/events/computer-networks-endterm/notes-${lang}.md`, "utf8")).toContain(supplements[module][lang]);
      }
    }
  });
  it("teaches and explains remote routes rather than substituting longest-prefix rules", () => {
    const part = event.lectures.flatMap(l => l.parts).find(p => p.id === "cne-m8")!;
    const question = part.questions.find(q => q.id === "cne-E699")!;
    expect(question.options[question.answer]).toMatch(/remote routes/i);
    for (const lang of ["ru", "en"] as const) {
      expect(part.notes[lang]).toContain("192.168.1.254");
      expect(question.why[lang]).toContain("192.168.1.254");
      expect(question.why[lang]).toContain("connected");
      expect(question.why[lang]).toContain("local");
    }
  });
});
