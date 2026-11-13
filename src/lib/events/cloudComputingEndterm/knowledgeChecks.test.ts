import { describe, expect, it } from "vitest";
import questions from "./questions.json";
import checks from "./knowledgeChecks.json";
import modules from "./knowledgeCheckModules.json";
import counts from "./knowledgeCheckOptionCounts.json";
import notes from "./examNotes.json";
import guidance from "./examAnswerGuidance.json";
import { parseProgress } from "./progress";

describe("Cloud Developing imported content", () => {
  it("contains every question from the twelve observed Knowledge Checks", () => {
    expect(checks).toHaveLength(120);
    expect(new Set(checks.map(q => q.id)).size).toBe(120);
    expect(modules.map(m => m.module)).toEqual(Array.from({ length: 12 }, (_, i) => i + 2));
    for (const m of modules) {
      const bank = checks.filter(q => q.module === m.module);
      expect(bank.map(q => q.number)).toEqual(Array.from({ length: 10 }, (_, i) => i + 1));
      for (const q of bank) {
        expect(q.source).toBe(m.url);
        expect(q.prompt.length).toBeGreaterThan(20);
        expect(q.explanation.length).toBeGreaterThan(20);
        expect(q.answers.length).toBeGreaterThan(0);
        expect(new Set(q.answers).size).toBe(q.answers.length);
        for (const a of q.answers) expect(q.options[a]).toBeTruthy();
        expect(counts[q.id as keyof typeof counts]).toBe(q.options.length);
      }
    }
  });
  it("preserves code in questions and records the contradictory S3 source feedback", () => {
    expect(checks.find(q => q.id === "aws-dev-m04-q09")?.prompt).toContain('"NotResource"');
    expect(checks.find(q => q.id === "aws-dev-m06-q07")?.prompt).toContain("aws apigatewayv2 create-route");
    expect(checks.find(q => q.id === "aws-dev-m03-q04")?.caution).toContain("HTTPS");
  });
  it("links all 47 original questions to full notes and every answer explanation", () => {
    expect(notes.map(n => n.questionId)).toEqual(questions.map(q => q.id));
    for (const [i, q] of questions.entries()) {
      expect(notes[i].body.length).toBeGreaterThanOrEqual(3);
      expect(notes[i].sources.length).toBeGreaterThan(0);
      expect(notes[i].optionExplanations).toHaveLength(q.options.length);
      expect(guidance[q.id as keyof typeof guidance].optionExplanations).toEqual(notes[i].optionExplanations);
    }
    expect(questions.filter(q => !q.answers.length).map(q => q.id)).toEqual(["cce-18", "cce-22", "cce-47"]);
  });
  it("restores both banks while rejecting invalid answer indices", () => {
    const saved = parseProgress(JSON.stringify({ answers: { "aws-dev-m02-q01": [2], "cce-1": [0], "aws-dev-m02-q02": [99] } }));
    expect(saved.answers).toEqual({ "aws-dev-m02-q01": [2], "cce-1": [0] });
  });
});
