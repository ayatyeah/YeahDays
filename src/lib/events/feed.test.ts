import { describe, expect, it } from "vitest";
import { buildFeed, CLIP_SCENES, partClips, QUIZ_EVERY, relevance, scopeLabel, VIDEO_QUESTIONS, videoShelves, wholeFeed } from "./feed";
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
    for (const q of quizzes) if (q.kind === "quiz") expect(q.questions[0].id.startsWith(q.partId)).toBe(true);
  });

  it("освоенные вопросы в ленту берутся в последнюю очередь", () => {
    const avoid = new Set(["l1-p1-1", "l1-p1-2", "l1-p1-3"]);
    const first = buildFeed(event, seeded(2), avoid).find((f) => f.kind === "quiz");
    expect(first && first.kind === "quiz" && first.questions[0].id).toBe("l1-p1-4");
  });

  it("если у части есть ролики с персонажами, в ленте они вместо клипов конспекта, после каждого — «Проверь себя»", () => {
    const video = { id: "l1-p2-v1", partId: "l1-p2", title: { en: "V", ru: "В" }, cast: { A: "mentor", B: "student" } as const, lines: [{ who: "A" as const, pose: "explain", text: "Привет" }] };
    const feed = buildFeed({ ...event, videos: [video] }, seeded(4));
    expect(feed.filter((f) => f.partId === "l1-p2").map((f) => f.kind)).toEqual(["video", "quiz"]);
    const check = feed.find((f) => f.id === "check:l1-p2-v1");
    expect(check && check.kind === "quiz" && check.questions.length).toBe(VIDEO_QUESTIONS);
    expect(feed.some((f) => f.kind === "clip" && f.partId === "l1-p1")).toBe(true);
  });

  it("вопросы после ролика — по его теме: больше общих терминов — раньше", () => {
    const traps: [string, string, string][] = [["x1", "no", "нет"], ["x2", "no", "нет"], ["x3", "no", "нет"]];
    const themed: StudyEvent = {
      ...event,
      lectures: [{ id: "l9", title: { en: "L", ru: "Л" }, parts: [part("l9-p1", { en: "P", ru: "Ч" }, notes("## A\n- a"), [
        qx("What does a Sprint Review inspect?", "The Increment", traps, "because", "потому что"),
        qx("How is Cost Variance calculated?", "BCWP minus ACWP", traps.map(([o, ...r]) => [`${o}b`, ...r] as [string, string, string]), "because", "потому что"),
        qx("Who orders the Product Backlog?", "Product Owner", traps.map(([o, ...r]) => [`${o}c`, ...r] as [string, string, string]), "because", "потому что"),
      ])] }],
    };
    const talk = (text: string) => ({ who: "A" as const, pose: "explain", text });
    const video = { id: "l9-p1-v1", partId: "l9-p1", title: { en: "V", ru: "В" }, cast: { A: "finance", B: "student" } as const, lines: [talk("Cost Variance: CV равно BCWP минус ACWP.")] };
    const bank = themed.lectures[0].parts[0].questions;
    expect(relevance(video, bank[1])).toBeGreaterThan(relevance(video, bank[0]));
    const check = buildFeed({ ...themed, videos: [video] }, seeded(5)).find((f) => f.id === "check:l9-p1-v1");
    expect(check && check.kind === "quiz" && check.questions[0].id).toBe("l9-p1-2");
  });

  it("лента темы: одна часть, одна лекция или только ролики — без чужих частей", () => {
    const video = { id: "l1-p2-v1", partId: "l1-p2", title: { en: "V", ru: "В" }, cast: { A: "mentor", B: "student" } as const, lines: [{ who: "A" as const, pose: "explain", text: "Привет" }] };
    const withVideo = { ...event, videos: [video] };
    const part = buildFeed(withVideo, seeded(6), new Set(), { kind: "part", lecture: 0, part: 1 });
    expect(part.map((f) => f.kind)).toEqual(["video", "quiz"]);
    expect(part.every((f) => f.partId === "l1-p2")).toBe(true);
    expect(buildFeed(withVideo, seeded(6), new Set(), { kind: "videos" }).every((f) => f.partId === "l1-p2")).toBe(true);
    const lecture = buildFeed(withVideo, seeded(6), new Set(), { kind: "lecture", lecture: 0 });
    expect(new Set(lecture.map((f) => f.partId))).toEqual(new Set(["l1-p1", "l1-p2"]));
    expect(wholeFeed({ kind: "videos" }) && !wholeFeed({ kind: "part", lecture: 0, part: 1 })).toBe(true);
  });

  it("счётчики роликов и подписи лент у настоящих ивентов", () => {
    const pm = EVENTS.find((e) => e.id === "project-management-test-2")!;
    const shelves = videoShelves(pm);
    // В ленте — только лекции теста (4–8); ролики лекций 9–10 сняты вместе с ними.
    expect(shelves.count).toBe(57);
    expect(pm.videos!.length).toBe(57);
    expect(shelves.lectures.every((l) => l.count === l.parts.length * 3)).toBe(true);
    expect(shelves.seconds).toBeGreaterThan(57 * 30);
    expect(scopeLabel(pm, { kind: "lecture", lecture: 0 })).toBe("Лекция 4 · Затраты и группы");
    expect(scopeLabel(pm, { kind: "part", lecture: 3, part: 1 })).toMatch(/^Лекция 7 · часть 2 · /);
    const cn = EVENTS.find((e) => e.id === "computer-networks-midterm")!;
    const net = videoShelves(cn);
    const l7 = cn.lectures.findIndex((l) => l.id === "cn-l7");
    expect(net.count).toBe(12);
    expect(net.lectures.map((l, i) => (l.count ? i : -1)).filter((i) => i >= 0)).toEqual([l7]);
    expect(scopeLabel(cn, { kind: "lecture", lecture: l7 })).toBe("Лекция 7 · Адресация IPv6. ICMP");
    const lectureFeed = buildFeed(cn, seeded(7), new Set(), { kind: "lecture", lecture: l7 });
    expect(lectureFeed.filter((f) => f.kind === "video")).toHaveLength(12);
    expect(lectureFeed.some((f) => f.kind === "clip")).toBe(false);
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
