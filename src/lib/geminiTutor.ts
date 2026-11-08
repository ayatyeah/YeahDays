import { recordAiUsage } from "@/lib/aiUsage";

/** Server-only pool. Keys are never sent to browsers or included in errors. */
export function geminiKeys(): string[] {
  return [...new Set(Object.entries(process.env)
    .filter(([name]) => /^(GEMINI_API_KEY|GOOGLE_GEMINI_API_SECRET|GOOGLE_GEMINI_API_KEY_\d+)$/.test(name))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value?.trim()).filter((value): value is string => !!value))];
}
export const geminiAvailable = () => geminiKeys().length > 0;
let cursor = 0;
const cooldown = new Map<string, number>();

type Chunk = {
  error?: unknown;
  promptFeedback?: { blockReason?: string };
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
};

export async function streamGeminiTutor(instructions: string, messages: { role: "user" | "assistant"; text: string }[], signal?: AbortSignal) {
  const keys = geminiKeys();
  const eligible = keys.filter((key) => (cooldown.get(key) || 0) <= Date.now());
  if (!eligible.length) throw new Error("Gemini temporarily unavailable");
  const start = cursor++ % eligible.length;
  const combinedSignal = signal ? AbortSignal.any([signal, AbortSignal.timeout(40_000)]) : AbortSignal.timeout(40_000);
  const model = process.env.GEMINI_TUTOR_MODEL || "gemini-3.5-flash-lite";
  let response: Response | undefined;
  for (let attempt = 0; attempt < Math.min(3, eligible.length); attempt++) {
    const key = eligible[(start + attempt) % eligible.length];
    try {
      const current = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
        method: "POST", signal: combinedSignal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instructions }] },
          contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] })),
          generationConfig: { maxOutputTokens: 1800, ...(model.startsWith("gemini-2.5-flash") ? { thinkingConfig: { thinkingBudget: 0 } } : {}) },
        }),
      });
      if (current.ok && current.body) { response = current; break; }
      const retryHeader = current.headers.get("retry-after");
      const retryMs = retryHeader ? (Number(retryHeader) * 1000 || Date.parse(retryHeader) - Date.now()) : 0;
      const retryable = [401, 403, 429, 500, 502, 503, 504].includes(current.status);
      cooldown.set(key, Date.now() + Math.max(current.status === 401 || current.status === 403 ? 300_000 : 60_000, retryMs || 0));
      await current.body?.cancel();
      if (!retryable) break;
    } catch {
      if (combinedSignal.aborted) throw new Error("Gemini request cancelled");
      cooldown.set(key, Date.now() + 60_000);
    }
  }
  if (!response?.body) throw new Error("Gemini temporarily unavailable");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let usage: Chunk["usageMetadata"];
  let recorded = false;
  function record() {
    if (recorded) return;
    recorded = true;
    recordAiUsage("tutor", { input_tokens: usage?.promptTokenCount, output_tokens: usage?.candidatesTokenCount });
  }
  function parse(lines: string[]) {
    let text = "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const raw = line.slice(5).trim();
      if (!raw || raw === "[DONE]") continue;
      const chunk = JSON.parse(raw) as Chunk;
      if (chunk.error || chunk.promptFeedback?.blockReason) throw new Error("Gemini response unavailable");
      if (chunk.usageMetadata) usage = chunk.usageMetadata;
      const candidate = chunk.candidates?.[0];
      if (candidate?.finishReason && !["STOP", "MAX_TOKENS"].includes(candidate.finishReason)) throw new Error("Gemini response unavailable");
      text += candidate?.content?.parts?.filter((part) => !part.thought).map((part) => part.text || "").join("") || "";
    }
    return text;
  }
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        for (;;) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value, { stream: !done });
          const lines = buffer.split("\n");
          buffer = done ? "" : lines.pop() || "";
          const text = parse(lines);
          if (text) controller.enqueue(encoder.encode(text));
          if (done) { record(); controller.close(); return; }
          if (text) return;
        }
      } catch {
        record(); controller.error(new Error("Gemini stream interrupted"));
        void reader.cancel().catch(() => {});
      }
    },
    cancel() { record(); return reader.cancel(); },
  });
}
