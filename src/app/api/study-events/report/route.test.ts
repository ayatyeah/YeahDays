import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), rate: vi.fn(), build: vi.fn(), available: vi.fn() }));
vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: mocks.rate }));
vi.mock("@/lib/examGrade", () => ({ gradeAvailable: mocks.available }));
vi.mock("@/lib/examReport", () => ({ REPORT_CONSENT: "event-report-v1", buildReport: mocks.build }));
import { findEvent } from "@/lib/events";
import { POST } from "./route";

const exam = findEvent("computer-vision-midterm")!.mocks![0];
const ids = exam.questions.flatMap((q) => q.tasks.map((t) => t.id));
const items = ids.slice(0, 4).map((taskId) => ({ taskId, score: 1, points: 4, missing: ["x"], mistakes: [] }));
const post = (body: object) => POST(new Request("https://app.test/api/study-events/report", { method: "POST", body: JSON.stringify(body) }));
const ok = { eventId: "computer-vision-midterm", examId: exam.id, items, lang: "ru", consent: "event-report-v1" };

beforeEach(() => {
  mocks.auth.mockResolvedValue({ user: { id: "u1" } });
  mocks.rate.mockReturnValue(true);
  mocks.available.mockReturnValue(true);
  mocks.build.mockResolvedValue({ summary: "ok", topics: [], plan: [] });
});

it("без входа и без согласия отчёт не собирается", async () => {
  mocks.auth.mockResolvedValueOnce(null);
  expect((await post(ok)).status).toBe(401);
  expect((await post({ ...ok, consent: undefined })).status).toBe(400);
  expect(mocks.build).not.toHaveBeenCalled();
});

it("чужой вариант — 404; меньше трёх проверенных ответов — 400", async () => {
  expect((await post({ ...ok, examId: "v99" })).status).toBe(404);
  expect((await post({ ...ok, items: items.slice(0, 2) })).status).toBe(400);
  expect(mocks.build).not.toHaveBeenCalled();
});

it("подпункты не из этого варианта отбрасываются, остальное уходит в отчёт", async () => {
  const res = await post({ ...ok, items: [...items, { taskId: "evil", score: 99, points: 1, missing: [], mistakes: [] }] });
  expect(res.status).toBe(200);
  expect(mocks.build.mock.calls[0][2]).toHaveLength(4);
});

it("лимит и выключенный ИИ", async () => {
  mocks.available.mockReturnValueOnce(false);
  expect((await post(ok)).status).toBe(503);
  mocks.rate.mockReturnValueOnce(false);
  expect((await post(ok)).status).toBe(429);
});
