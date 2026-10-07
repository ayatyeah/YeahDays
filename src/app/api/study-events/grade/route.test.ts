import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), rate: vi.fn(), grade: vi.fn(), available: vi.fn(), target: vi.fn() }));
vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: mocks.rate }));
vi.mock("@/lib/examGrade", () => ({
  GRADE_CONSENT: "event-grade-v1",
  MAX_ANSWER: 3000,
  findGradeTarget: mocks.target,
  gradeAnswer: mocks.grade,
  gradeAvailable: mocks.available,
}));
import { GET, POST } from "./route";

const post = (body: object) => POST(new Request("https://app.test/api/study-events/grade", { method: "POST", body: JSON.stringify(body) }));
const ok = { eventId: "computer-vision-midterm", taskId: "v1-q3-b", answer: "Bird, argmax = 2", lang: "ru", consent: "event-grade-v1" };

beforeEach(() => {
  mocks.auth.mockResolvedValue({ user: { id: "u1" } });
  mocks.rate.mockReturnValue(true);
  mocks.available.mockReturnValue(true);
  mocks.target.mockReturnValue({ task: { points: 3 } });
  mocks.grade.mockResolvedValue({ score: 3, points: 3, verdict: "full", correct: [], missing: [], mistakes: [], tip: "" });
});

it("без входа не проверяет", async () => {
  mocks.auth.mockResolvedValue(null);
  expect((await post(ok)).status).toBe(401);
  expect(mocks.grade).not.toHaveBeenCalled();
});

it("без согласия на отправку в OpenAI не проверяет", async () => {
  expect((await post({ ...ok, consent: undefined })).status).toBe(400);
  expect(mocks.grade).not.toHaveBeenCalled();
});

it("пустой и слишком длинный ответ отклоняются до вызова ИИ", async () => {
  expect((await post({ ...ok, answer: "   " })).status).toBe(400);
  expect((await post({ ...ok, answer: "x".repeat(3001) })).status).toBe(400);
  expect(mocks.grade).not.toHaveBeenCalled();
});

it("чужой id задания — 404; без ключа ИИ — 503", async () => {
  mocks.target.mockReturnValueOnce(null);
  expect((await post(ok)).status).toBe(404);
  mocks.available.mockReturnValueOnce(false);
  expect((await post(ok)).status).toBe(503);
});

it("лимит частоты — 429, ИИ не вызывается", async () => {
  mocks.rate.mockReturnValueOnce(false);
  expect((await post(ok)).status).toBe(429);
  expect(mocks.grade).not.toHaveBeenCalled();
});

it("проверяет и отдаёт оценку; язык отзыва — из запроса", async () => {
  const res = await post({ ...ok, lang: "en" });
  expect(res.status).toBe(200);
  expect((await res.json()).verdict).toBe("full");
  expect(mocks.grade).toHaveBeenCalledWith({ task: { points: 3 } }, "Bird, argmax = 2", "en");
});

it("сбой ИИ — 502 с понятной ошибкой", async () => {
  mocks.grade.mockRejectedValueOnce(new Error("boom"));
  const res = await post(ok);
  expect(res.status).toBe(502);
  expect((await res.json()).error).toMatch(/Не удалось проверить/);
});

it("GET говорит, подключён ли ИИ", async () => {
  mocks.available.mockReturnValueOnce(false);
  expect(await (await GET()).json()).toEqual({ available: false });
});
