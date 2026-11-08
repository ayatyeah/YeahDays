import { afterEach, beforeEach, expect, it, vi } from "vitest";
vi.mock("@/lib/aiUsage", () => ({ recordAiUsage: vi.fn() }));
const sse = (...chunks: string[]) => new Response(new ReadableStream({ start(c) { chunks.forEach(s => c.enqueue(new TextEncoder().encode(s))); c.close(); } }));
const data = (text: string) => `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] })}\n\n`;
beforeEach(() => { vi.resetModules(); vi.stubEnv("GOOGLE_GEMINI_API_SECRET", "first-key"); vi.stubEnv("GOOGLE_GEMINI_API_KEY_2", "second-key"); });
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
it("streams split UTF-8/SSE chunks and maps conversation roles without putting keys in URLs", async () => {
  const event = data("Пакет");
  const fetcher = vi.fn().mockResolvedValue(sse('data: {}\n\n', event.slice(0, 15), event.slice(15), data(" идёт в сеть.")));
  vi.stubGlobal("fetch", fetcher);
  const { streamGeminiTutor } = await import("./geminiTutor");
  const stream = await streamGeminiTutor("Explain", [{ role: "assistant", text: "Prior" }, { role: "user", text: "Now" }]);
  expect(await new Response(stream).text()).toBe("Пакет идёт в сеть.");
  const [url, options] = fetcher.mock.calls[0];
  expect(url).not.toContain("key=");
  expect(JSON.parse(options.body).contents[0].role).toBe("model");
  expect(options.headers["x-goog-api-key"]).toBeTruthy();
});
it("honors key cooldown after 429 and retries a different configured key", async () => {
  const fetcher = vi.fn().mockResolvedValueOnce(new Response('{}', { status: 429, headers: { 'retry-after': '120' } })).mockImplementation(async () => sse(data("OK")));
  vi.stubGlobal("fetch", fetcher);
  const { streamGeminiTutor } = await import("./geminiTutor");
  expect(await new Response(await streamGeminiTutor("", [{ role: "user", text: "q" }])).text()).toBe("OK");
  const rejected = fetcher.mock.calls[0][1].headers["x-goog-api-key"];
  expect(fetcher.mock.calls[1][1].headers["x-goog-api-key"]).not.toBe(rejected);
  await new Response(await streamGeminiTutor("", [{ role: "user", text: "q" }])).text();
  expect(fetcher.mock.calls[2][1].headers["x-goog-api-key"]).not.toBe(rejected);
});
it("does not retry bad request and does not expose provider errors or keys", async () => {
  const fetcher = vi.fn().mockResolvedValue(new Response('private provider error', { status: 400 }));
  vi.stubGlobal("fetch", fetcher);
  const { streamGeminiTutor } = await import("./geminiTutor");
  await expect(streamGeminiTutor("", [])).rejects.toThrow("Gemini temporarily unavailable");
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it("blocked output fails instead of presenting it as an empty successful answer", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(sse('data: {"promptFeedback":{"blockReason":"SAFETY"}}\n\n')));
  const { streamGeminiTutor } = await import("./geminiTutor");
  await expect(new Response(await streamGeminiTutor("", [])).text()).rejects.toThrow("Gemini stream interrupted");
});
