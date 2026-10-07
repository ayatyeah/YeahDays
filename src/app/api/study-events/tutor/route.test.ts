import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), rate: vi.fn(), stream: vi.fn(), available: vi.fn() }));
vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: mocks.rate }));
vi.mock("@/lib/examGrade", () => ({ gradeAvailable: mocks.available }));
vi.mock("@/lib/tutor", async (original) => ({ ...(await original<typeof import("@/lib/tutor")>()), streamTutor: mocks.stream }));
import { POST } from "./route";

const post = (body: object) => POST(new Request("https://app.test/api/study-events/tutor", { method: "POST", body: JSON.stringify(body) }));
const ok = { eventId: "computer-vision-midterm", focus: { view: "map" }, messages: [{ role: "user", text: "Что повторить?" }], lang: "ru", consent: "event-tutor-v1" };

beforeEach(() => {
  mocks.auth.mockResolvedValue({ user: { id: "u1" } });
  mocks.rate.mockReturnValue(true);
  mocks.available.mockReturnValue(true);
  mocks.stream.mockResolvedValue(new ReadableStream({ start: (c) => { c.enqueue(new TextEncoder().encode("Ответ")); c.close(); } }));
});

it("без входа, без согласия и без вопроса — отказ", async () => {
  mocks.auth.mockResolvedValueOnce(null);
  expect((await post(ok)).status).toBe(401);
  expect((await post({ ...ok, consent: "event-grade-v1" })).status).toBe(400);
  expect((await post({ ...ok, messages: [{ role: "assistant", text: "hi" }] })).status).toBe(400);
  expect((await post({ ...ok, eventId: "nope" })).status).toBe(404);
  expect(mocks.stream).not.toHaveBeenCalled();
});

it("отвечает потоком текста", async () => {
  const res = await post(ok);
  expect(res.status).toBe(200);
  expect(res.headers.get("content-type")).toContain("text/plain");
  expect(await res.text()).toBe("Ответ");
  expect(mocks.stream.mock.calls[0][3]).toBe("ru");
});

it("лимиты, выключенный ИИ и сбой", async () => {
  mocks.available.mockReturnValueOnce(false);
  expect((await post(ok)).status).toBe(503);
  mocks.rate.mockReturnValueOnce(false);
  expect((await post(ok)).status).toBe(429);
  mocks.stream.mockRejectedValueOnce(new Error("boom"));
  expect((await post(ok)).status).toBe(502);
});
