import { describe, expect, it } from "vitest";
import { EVENTS } from "./index";
import { holdFor, narration, scenes, sentences } from "./scenes";

describe("сцены видео из конспекта", () => {
  it("каждая часть каждого ивента нарезается на сцены: заголовок первым, пункты по одному, вопрос с ответом", () => {
    for (const event of EVENTS) for (const lecture of event.lectures) for (const part of lecture.parts) {
      const list = scenes(part.notes, part.title);
      expect(list[0]).toEqual({ kind: "title", ru: part.title.ru, en: part.title.en });
      expect(list.length, part.id).toBeGreaterThan(5);
      for (const s of list) {
        if (s.kind === "bullet") expect(s.index).toBeLessThanOrEqual(s.total);
        if (s.kind === "question") expect(s.answerEn.length, part.id).toBeGreaterThan(3);
        if ("en" in s && typeof s.en === "string") expect(s.en, part.id).not.toMatch(/\*\*/);
        expect(holdFor(s)).toBeGreaterThanOrEqual(3500);
        expect(holdFor(s)).toBeLessThanOrEqual(14000);
      }
      expect(list.some((s) => s.kind === "demo" as never)).toBe(false);
    }
  });

  it("в смешанном режиме заголовок звучит по-английски и по-русски, текст — по-русски", () => {
    const [title, ...rest] = scenes({ en: "## Default gateway\nThe router interface on the LAN.", ru: "## Шлюз по умолчанию\nИнтерфейс маршрутизатора в LAN." }, { en: "Part", ru: "Часть" });
    expect(narration(title, "mix").map((n) => n.lang)).toEqual(["en", "ru"]);
    expect(narration(rest[1], "mix")).toEqual([{ lang: "ru", text: "Интерфейс маршрутизатора в LAN." }]);
    expect(narration(rest[1], "en")).toEqual([{ lang: "en", text: "The router interface on the LAN." }]);
  });

  it("абзац делится по предложениям, не ломая IP-адреса и сокращения", () => {
    expect(sentences("PC1 is 192.168.1.110. The server is 172.16.1.9. Done!")).toEqual(["PC1 is 192.168.1.110.", "The server is 172.16.1.9.", "Done!"]);
    expect(sentences("Use e.g. SSH instead.")).toEqual(["Use e.g. SSH instead."]);
  });
});
