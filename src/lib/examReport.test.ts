import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/aiUsage", () => ({ recordAiUsage: vi.fn() }));
import { findEvent } from "@/lib/events";
import { parseReport, reportInput } from "./examReport";

const event = findEvent("computer-vision-midterm")!;
const exam = event.mocks![0];
const task = exam.questions[2].tasks[0];

describe("reportInput", () => {
  it("отдаёт итоги проверки и списки ссылок, но не ответы человека", () => {
    const input = JSON.parse(reportInput(event, exam, [{ taskId: task.id, score: 4, points: task.points, missing: ["bias not added"], mistakes: [] }, { taskId: "nope", score: 0, points: 1, missing: [], mistakes: [] }]));
    expect(input.tasks).toHaveLength(1);
    expect(input.tasks[0]).toMatchObject({ score: 4, points: task.points, missing: ["bias not added"] });
    expect(JSON.stringify(input)).not.toMatch(/studentAnswer|answer"/);
    expect(input.notesParts.some((p: { id: string }) => p.id === "cv-l3-p1")).toBe(true);
    expect(input.trainers.some((t: { id: string }) => t.id === "linear")).toBe(true);
  });
});

describe("parseReport", () => {
  const parts = new Set(["cv-l3-p1", "cv-drill-p1"]);
  it("оставляет только известные части и тренажёры, режет длину", () => {
    const r = parseReport(
      {
        summary: "x".repeat(1000),
        topics: [
          { title: "Bias", why: "forgot b", parts: ["cv-l3-p1", "made-up"], trainers: ["linear", "hack"] },
          { title: "", why: "empty title is dropped", parts: [], trainers: [] },
        ],
        plan: ["a", "b", "c", "d", "e"],
      },
      parts,
    );
    expect(r.summary.length).toBe(400);
    expect(r.topics).toEqual([{ title: "Bias", why: "forgot b", parts: ["cv-l3-p1"], trainers: ["linear"] }]);
    expect(r.plan).toHaveLength(4);
  });

  it("мусор вместо ответа не роняет разбор", () => {
    expect(parseReport(null, parts)).toEqual({ summary: "", topics: [], plan: [] });
  });
});
