import { describe, expect, it } from "vitest";
import { buildFeed, CLIP_SCENES, partClips, QUIZ_EVERY } from "./feed";
import { EVENTS } from "./index";
import { part, qx, type StudyEvent } from "./types";

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const bank = (tag: string) => Array.from({ length: 4 }, (_, i) => qx(`${tag} q${i}?`, `${tag} right ${i}`, [[`${tag} a${i}`, "no", "нет"], [`${tag} b${i}`, "no", "нет"], [`${tag} c${i}`, "no", "нет"]], "because", "потому что"));
const bullets = (n: number) => Array.from({ length: n }, (_, i) => `- point ${i}`).join("\n");
const notes = (body: string) => ({ en: body, ru: body });
const event: StudyEvent = {
  id: "t", title: "T", course: "C", description: "d",
  lectures: [{
    id: "l1", title: { en: "L1", ru: "Л1" },
    parts: [
      part("l1-p1", { en: "Part one", ru: "Часть один" }, notes(`Intro line.\n## Alpha\n${bullets(3)}\n## Beta\n${bullets(20)}\n## Empty`), bank("A")),
      part("l1-p2", { en: "Part two", ru: "Часть два" }, notes(`## Gamma\n${bullets(2)}`), bank("B")),
    ],
  }],
  counts: { part: 4, lecture: 4, final: 4 },
};

describe("лента: клипы", () => {
  it("клип — раздел конспекта; вводная часть — под названием части; пустой раздел пропускается", () => {
    const clips = partClips(event, 0, 0);
    expect(clips.map((c) => c.heading.en)).toEqual(["Part one", "Alpha", "Beta", "Beta", "Beta"]);
    expect(clips[0].scenes).toHaveLength(1);
    expect(clips[1].scenes).toHaveLength(3);
  });

  it("длинный раздел режется поровну, не длиннее CLIP_SCENES сцен", () => {
    const beta = partClips(event, 0, 0).filter((c) => c.heading.en === "Beta");
    expect(beta.map((c) => c.piece)).toEqual(["1/3", "2/3", "3/3"]);
    expect(beta.every((c) => c.scenes.length <= CLIP_SCENES)).toBe(true);
    expect(beta.reduce((n, c) => n + c.scenes.length, 0)).toBe(20);
    expect(new Set(partClips(event, 0, 0).map((c) => c.id)).size).toBe(5);
  });

  it("быстрый вопрос — после каждых трёх клипов, из той же части, без повторов", () => {
    const feed = buildFeed(event, seeded(1));
    const kinds = feed.map((f) => f.kind);
    expect(kinds.slice(0, QUIZ_EVERY + 1)).toEqual(["clip", "clip", "clip", "quiz"]);
    const quizzes = feed.filter((f) => f.kind === "quiz");
    expect(new Set(quizzes.map((q) => q.id)).size).toBe(quizzes.length);
    for (const q of quizzes) if (q.kind === "quiz") expect(q.question.id.startsWith(q.partId)).toBe(true);
  });

  it("освоенные вопросы в ленту берутся в последнюю очередь", () => {
    const avoid = new Set(["l1-p1-1", "l1-p1-2", "l1-p1-3"]);
    const first = buildFeed(event, seeded(2), avoid).find((f) => f.kind === "quiz");
    expect(first && first.kind === "quiz" && first.question.id).toBe("l1-p1-4");
  });

  it("у настоящих ивентов лента собирается, id клипов уникальны", () => {
    for (const e of EVENTS) {
      const feed = buildFeed(e, seeded(3));
      expect(feed.length, e.id).toBeGreaterThan(20);
      expect(new Set(feed.map((f) => f.id)).size, e.id).toBe(feed.length);
      for (const f of feed) if (f.kind === "clip") expect(f.scenes.length, f.id).toBeGreaterThan(0);
    }
  });
});
