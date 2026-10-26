import { describe, expect, it } from "vitest";
import { lineAt, posesAt, termChunks, timeline, visualAt } from "./explainer";
import type { ExplainerVideo } from "./types";

const video: ExplainerVideo = {
  id: "v", partId: "p", title: { en: "T", ru: "Т" }, cast: { A: "mentor", B: "student" },
  lines: [
    { who: "B", pose: "ask", text: "Что такое CV?", show: { kind: "hook", text: "CV?" } },
    { who: "A", pose: "explain", text: "CV равно BCWP минус ACWP — это разница между заработанным и потраченным." },
    { who: "A", pose: "point", text: "Смотри на формулу.", show: { kind: "formula", lines: ["CV = BCWP − ACWP"] } },
    { who: "B", pose: "aha", text: "Понял!" },
  ],
};

describe("ролик-объяснение: время", () => {
  it("без озвучки реплики идут по длине текста, не короче 1,8 с", () => {
    const { starts, duration } = timeline(video);
    expect(starts).toHaveLength(4);
    expect(starts[1] - starts[0]).toBeGreaterThanOrEqual(1.8);
    expect(starts[2] - starts[1]).toBeGreaterThan(4);
    expect(duration).toBeGreaterThan(starts[3]);
  });

  it("с озвучкой — её разметка", () => {
    const audio = { src: "x.m4a", duration: 9, starts: [0, 2, 6, 8] };
    expect(timeline({ ...video, audio })).toEqual({ starts: audio.starts, duration: 9 });
    // разметка не на все реплики — не доверяем ей
    expect(timeline({ ...video, audio: { ...audio, starts: [0, 2] } }).starts).toHaveLength(4);
  });

  it("реплика, картинка и позы в момент t", () => {
    const starts = [0, 2, 6, 8];
    expect(lineAt(starts, 0)).toBe(0);
    expect(lineAt(starts, 5.9)).toBe(1);
    expect(lineAt(starts, 6)).toBe(2);
    expect(lineAt(starts, 99)).toBe(3);
    expect(visualAt(video, 1)).toEqual({ visual: { kind: "hook", text: "CV?" }, from: 0 });
    expect(visualAt(video, 3).visual?.kind).toBe("formula");
    expect(posesAt(video, 0)).toEqual({ A: "explain", B: "ask" });
    expect(posesAt(video, 2)).toEqual({ A: "point", B: "ask" });
    expect(posesAt(video, 3)).toEqual({ A: "point", B: "aha" });
  });

  it("латинские термины выделяются целиком, вместе с составными", () => {
    expect(termChunks("Это Sprint Review, а не CV.").filter((c) => c.term).map((c) => c.text)).toEqual(["Sprint Review", "CV"]);
    expect(termChunks("Только русский").every((c) => !c.term)).toBe(true);
    expect(termChunks("BCWP минус ACWP").map((c) => c.text).join("")).toBe("BCWP минус ACWP");
  });
});
