import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ auth: vi.fn(), rate: vi.fn() }));
vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: mocks.rate }));
import { GET, POST } from "./route";
const payload = { mode: "tasks", date: "2026-09-28", text: "Завтра доклад", context: "" };
const req = (body = payload) => new Request("https://app.test/api/ai/planner", { method: "POST", body: JSON.stringify(body) });
beforeEach(() => { vi.resetAllMocks(); vi.stubEnv("OPENAI_API_KEY", "test-private-key"); mocks.auth.mockResolvedValue({ user: { id: "alice" } }); mocks.rate.mockReturnValue(true); vi.stubGlobal("fetch", vi.fn()); });
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
it("requires a session and never calls OpenAI for anonymous users", async () => {
  mocks.auth.mockResolvedValue(null);
  expect((await GET()).status).toBe(401); expect((await POST(req())).status).toBe(401); expect(fetch).not.toHaveBeenCalled();
});
it("reports an unset key without exposing credentials", async () => {
  expect(await (await GET()).json()).toEqual({ available: true });
  vi.stubEnv("OPENAI_API_KEY", ""); expect((await POST(req())).status).toBe(503); expect(fetch).not.toHaveBeenCalled();
});
it("enforces per-user limits", async () => {
  mocks.rate.mockReturnValue(false); expect((await POST(req())).status).toBe(429); expect(fetch).not.toHaveBeenCalled();
});
it("rejects bad dates and remote images before contacting OpenAI", async () => {
  expect((await POST(req({ ...payload, date: "2026-02-30" }))).status).toBe(400);
  const request = new Request("https://app.test/api/ai/planner", { method: "POST", body: JSON.stringify({ ...payload, image: "https://private.invalid/file" }) });
  expect((await POST(request)).status).toBe(400); expect(fetch).not.toHaveBeenCalled();
});
it("uses structured Responses output with storage disabled and a server-only key", async () => {
  const output = { message: "Готово", warnings: [], items: [] };
  vi.mocked(fetch).mockResolvedValue(Response.json({ status: "completed", output: [{ content: [{ type: "output_text", text: JSON.stringify(output) }] }] }));
  expect(await (await POST(req())).json()).toEqual(output);
  const [url, options] = vi.mocked(fetch).mock.calls[0];
  expect(url).toBe("https://api.openai.com/v1/responses");
  expect(JSON.parse(String(options?.body))).toMatchObject({ store: false, text: { format: { strict: true, type: "json_schema" } } });
  expect(options?.headers).toMatchObject({ Authorization: "Bearer test-private-key" });
});
it("does not forward provider errors, tokens or incomplete responses", async () => {
  vi.mocked(fetch).mockResolvedValue(Response.json({ error: { message: "test-private-key" } }, { status: 401 }));
  const response = await POST(req()); expect(response.status).toBe(502); expect(await response.text()).not.toContain("test-private-key");
  vi.mocked(fetch).mockResolvedValue(Response.json({ status: "incomplete", output: [] }));
  expect((await POST(req())).status).toBe(502);
});
it("accepts a screenshot and sends normalized image content to vision", async () => {
  const { default: sharp } = await import("sharp");
  const png = await sharp({ create: { width: 4, height: 4, channels: 3, background: "white" } }).png().toBuffer();
  vi.mocked(fetch).mockResolvedValue(Response.json({ status: "completed", output: [{ content: [{ type: "output_text", text: JSON.stringify({ message: "Пустой скрин", warnings: [], items: [] }) }] }] }));
  const request = new Request("https://app.test/api/ai/planner", { method: "POST", body: JSON.stringify({ ...payload, mode: "schedule", image: `data:image/png;base64,${png.toString("base64")}` }) });
  expect((await POST(request)).status).toBe(200);
  const body = JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body));
  expect(body.input[0].content[1]).toMatchObject({ type: "input_image", detail: "high" });
  expect(body.input[0].content[1].image_url).toMatch(/^data:image\/png;base64,/);
});
it("rejects oversized request bodies before image decoding or a paid request", async () => {
  const response = await POST(new Request("https://app.test/api/ai/planner", { method: "POST", body: "a".repeat(7_500_001) }));
  expect(response.status).toBe(400); expect(fetch).not.toHaveBeenCalled();
});
