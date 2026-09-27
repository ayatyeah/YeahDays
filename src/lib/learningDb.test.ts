import { beforeEach, expect, it, vi } from "vitest";
import { emptyLearning, buySkin, applyGrade, type LearningState } from "./learning";
const db = vi.hoisted(() => ({ findUnique: vi.fn(), upsert: vi.fn(), updateMany: vi.fn() }));
vi.mock("./db", () => ({ prisma: { learningProfile: db } }));
import { mutateLearning } from "./learningDb";
beforeEach(() => vi.resetAllMocks());
it("retries a competing purchase using the new balance and prevents double spending", async () => {
  let state: LearningState = { ...emptyLearning(), coins: 120 };
  let revision = 0;
  db.findUnique.mockImplementation(async () => ({ data: structuredClone(state), revision }));
  db.updateMany.mockImplementation(async ({ where, data }) => {
    if (where.revision !== revision) return { count: 0 };
    revision++; state = structuredClone(data.data); return { count: 1 };
  });
  const results = await Promise.allSettled([mutateLearning("alice", s => buySkin(s, "explorer")), mutateLearning("alice", s => buySkin(s, "scholar"))]);
  expect(results.filter(r => r.status === "fulfilled")).toHaveLength(1);
  expect(state.coins).toBeGreaterThanOrEqual(0); expect(state.owned).toHaveLength(2);
  expect(db.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ userId: "alice" }) }));
});
it("two simultaneous correct submissions award once", async () => {
  let state: LearningState = { ...emptyLearning(), skills: [{ id: "skill", title: "Math", goal: "Math", minutes: 10, createdAt: "now", quests: [{ id: "q", title: "Math", exercise: "2+2", lesson: "Math", rubric: "4", boss: false, completed: false, attempts: 0, feedback: "", completedAt: null }] }] };
  let revision = 0;
  db.findUnique.mockImplementation(async () => ({ data: structuredClone(state), revision }));
  db.updateMany.mockImplementation(async ({ where, data }) => { if (where.revision !== revision) return { count: 0 }; revision++; state = structuredClone(data.data); return { count: 1 }; });
  await Promise.all([mutateLearning("alice", s => applyGrade(s, "skill", "q", 100, "yes", "now")), mutateLearning("alice", s => applyGrade(s, "skill", "q", 100, "yes", "now"))]);
  expect(state.coins).toBe(20); expect(state.xp).toBe(50);
});
