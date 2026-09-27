import { beforeEach, expect, it, vi } from "vitest";
import { emptyLearning, type LearningState } from "@/lib/learning";
const mocks = vi.hoisted(() => ({ auth: vi.fn(), read: vi.fn(), mutate: vi.fn(), create: vi.fn(), grade: vi.fn(), rate: vi.fn() }));
vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/learningDb", () => ({ readLearning: mocks.read, mutateLearning: mocks.mutate }));
vi.mock("@/lib/learningAi", () => ({ createLearningSkill: mocks.create, gradeLearningAnswer: mocks.grade }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: mocks.rate }));
import { GET, POST } from "./route";
const req = (body: object) => new Request("https://app.test/api/learning", { method: "POST", body: JSON.stringify(body) });
let state: LearningState;
beforeEach(() => {
  vi.resetAllMocks(); state = emptyLearning();
  mocks.auth.mockResolvedValue({ user: { id: "alice" } }); mocks.rate.mockReturnValue(true);
  mocks.read.mockImplementation(async () => ({ state: structuredClone(state), revision: 0 }));
  mocks.mutate.mockImplementation(async (_owner, change) => ({ state, revision: 1, result: change(state) }));
});
it("requires authentication for progress and purchases", async () => {
  mocks.auth.mockResolvedValue(null);
  expect((await GET()).status).toBe(401); expect((await POST(req({ action: "buy", skinId: "scholar" }))).status).toBe(401);
  expect(mocks.read).not.toHaveBeenCalled(); expect(mocks.mutate).not.toHaveBeenCalled();
});
it("binds purchases to the session and ignores supplied prices, balance and owner", async () => {
  state.coins = 100;
  const response = await POST(req({ action: "buy", skinId: "scholar", userId: "bob", price: 0, coins: 999999 }));
  expect(response.status).toBe(200); expect(state.coins).toBe(40);
  expect(mocks.mutate.mock.calls[0][0]).toBe("alice");
  expect(mocks.grade).not.toHaveBeenCalled();
});
it("rejects unowned equipment and unknown actions", async () => {
  expect((await POST(req({ action: "equip", skinId: "astronaut" }))).status).toBe(400);
  expect((await POST(req({ action: "setCoins", coins: 1000 }))).status).toBe(400);
  expect(state.coins).toBe(0);
});
it("returns a useful load error instead of database details", async () => {
  mocks.read.mockRejectedValue(new Error("private DB connection"));
  const response = await GET(); expect(response.status).toBe(503); expect(await response.text()).not.toContain("private");
});
it("does not expose rubric in progress responses", async () => {
  state.skills = [{ id: "s", goal: "math", title: "Math", createdAt: "now", minutes: 10, quests: [{ id: "q", title: "Q", lesson: "L", exercise: "E", rubric: "secret answer", boss: false, completed: false, attempts: 0, feedback: "", completedAt: null }] }];
  expect(await (await GET()).text()).not.toContain("secret answer");
});
it("limits costly requests before any model or database work", async () => {
  mocks.rate.mockReturnValue(false); expect((await POST(req({ action: "create" }))).status).toBe(429);
  expect(mocks.create).not.toHaveBeenCalled(); expect(mocks.read).not.toHaveBeenCalled();
});
it("passes bounded subject context to the tutor and stores it under the session owner", async () => {
  vi.stubEnv("OPENAI_API_KEY", "test");
  try {
    const subject = { name: "Computer Networks", materials: "IPv4, subnet masks, CIDR" };
    mocks.create.mockResolvedValue({ id: "generated", title: "Subnets", goal: "Understand CIDR", minutes: 20, subject, quests: [], createdAt: "now" });
    const response = await POST(req({ action: "create", goal: "Understand CIDR", minutes: 20, requestId: "12345678-1234-1234-1234-123456789012", subject, userId: "bob" }));
    expect(response.status).toBe(200); expect(mocks.create).toHaveBeenCalledWith("Understand CIDR", 20, subject);
    expect(mocks.mutate.mock.calls[0][0]).toBe("alice"); expect(state.skills[0].subject).toEqual(subject);
    expect((await POST(req({ action: "create", goal: "Understand CIDR", minutes: 20, requestId: "12345678-1234-1234-1234-123456789013", subject: { ...subject, materials: "a".repeat(4001) } }))).status).toBe(400);
  } finally { vi.unstubAllEnvs(); }
});
