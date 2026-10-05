import { describe, expect, it } from "vitest";
import { clampRate, rankVoices, voiceScore } from "./voice";

const v = (name: string, lang: string, extra = {}) => ({ name, lang, ...extra });

describe("выбор голоса", () => {
  it("нейронный голос выигрывает у голоса по умолчанию", () => {
    const edge = [v("Microsoft Irina - Russian (Russia)", "ru-RU", { default: true }), v("Microsoft Svetlana Online (Natural) - Russian (Russia)", "ru-RU")];
    expect(rankVoices(edge, "ru")[0].name).toContain("Natural");
    const mac = [v("Milena", "ru-RU", { default: true }), v("Milena (Enhanced)", "ru-RU"), v("Yuri", "ru-RU")];
    expect(rankVoices(mac, "ru")[0].name).toBe("Milena (Enhanced)");
  });

  it("в Chrome берётся голос Google, а не системный робот", () => {
    const linux = [v("Russian espeak", "ru"), v("Google русский", "ru-RU")];
    expect(rankVoices(linux, "ru")[0].name).toBe("Google русский");
    const en = [v("English (America)+espeak", "en-US"), v("Google UK English Female", "en-GB"), v("Google US English", "en-US")];
    expect(rankVoices(en, "en")[0].name).toBe("Google US English");
  });

  it("чужой язык и шуточные голоса не выбираются", () => {
    expect(rankVoices([v("Samantha", "en-US"), v("Milena", "ru-RU")], "ru").map((x) => x.name)).toEqual(["Milena"]);
    expect(voiceScore(v("Zarvox", "en-US"), "en")).toBeLessThan(0);
    expect(rankVoices([v("Bells", "en-US"), v("Samantha", "en-US")], "en")[0].name).toBe("Samantha");
    expect(rankVoices([], "en")).toEqual([]);
  });

  it("понимает метки языка с подчёркиванием, как на Android", () => {
    expect(rankVoices([v("Google русский", "ru_RU")], "ru")).toHaveLength(1);
  });

  it("скорость приводится к ближайшему шагу", () => {
    expect(clampRate(1.3)).toBe(1.25);
    expect(clampRate(9)).toBe(2);
    expect(clampRate(Number.NaN)).toBe(1);
  });
});
