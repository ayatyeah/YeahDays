import { describe, expect, it } from "vitest";
import { sprintQuestions } from "./sprints";
import { relatedQuestions, questionNote } from "./related";
const get = (id: string) => sprintQuestions.find(q => q.id === id)!;
describe("related PM questions", () => {
  it("covers every question without self-links or duplicate recommendations", () => {
    for (const q of sprintQuestions) {
      const related = relatedQuestions(q);
      expect(related.length).toBeGreaterThan(0);
      expect(related.every(r => r.question.id !== q.id)).toBe(true);
      expect(new Set(related.map(r => r.question.id)).size).toBe(related.length);
      expect(questionNote(q)).toBeDefined();
    }
  });
  it("prioritizes the same concept and photo sources over supplements", () => {
    const budgets = relatedQuestions(get("pm-real-1-1"));
    expect(budgets.slice(0, 3).every(r => r.sameConcept)).toBe(true);
    expect(budgets[0].question.id).toBe("pm-real-4-1");
    expect(budgets.some(r => r.question.id === "pm-real-4-1")).toBe(true);
    expect(budgets.some(r => r.question.id === "pm-real-1-44")).toBe(false);
    expect(relatedQuestions(get("pm-real-1-19")).slice(0,3).every(r => [18,19,20].includes(r.question.number))).toBe(true);
    expect(relatedQuestions(get("pm-real-1-21"))[0].question.number).toBe(21);
  });
});
