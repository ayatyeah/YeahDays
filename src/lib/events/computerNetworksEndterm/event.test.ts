import { describe, expect, it } from "vitest";
import { event } from "./event";
import bank from "./bank.json";
import { newAttempt, parseAttempt, scoreAttempt } from "./practice";
import { draw, steps } from "../engine";
import { existsSync } from "node:fs";

describe("Computer Networks endterm", () => {
  it("explains MTU as a packet-size limit in both languages without injecting module summaries", () => {
    const questions = event.lectures.flatMap(l => l.parts.flatMap(p => p.questions));
    const mtu = questions.find(q => q.id === "cne-E222")!;
    expect(mtu.options[mtu.answer]).toBe("The MTU is passed to the network layer by the data link layer.");
    expect(mtu.why.ru).toMatch(/размер/i);
    expect(mtu.why.ru).toMatch(/скорост/i);
    expect(mtu.why.en).toMatch(/size/i);
    expect(mtu.why.en).toContain("data link layer");
    for (const part of event.lectures.flatMap(l => l.parts)) {
      const summary = part.shortNotes!.en.split("\n")[1];
      for (const q of part.questions) expect(q.why.en).not.toContain(summary);
    }
    for (const q of questions) expect(q.why.en).not.toContain("A detailed English explanation is not available");
  });
  it("preserves all 558 source cards and 250 module questions with provenance", () => {
    expect(bank).toHaveLength(558);
    expect(bank.filter(q=>q.core)).toHaveLength(250);
    expect(new Set(bank.map(q=>q.id)).size).toBe(558);
    for (const q of bank) {
      expect(q.source).toBeTruthy(); expect(q.explanation).toBeTruthy(); expect(q.answerText).toBeTruthy();
      if (q.eligible) { expect(q.caution).toBe(""); expect(q.correct.length).toBe(q.answers.length); for (const i of q.correct) expect(q.options[i]).toBeTruthy(); }
    }
  });
  it("covers exactly lectures 5–10 and modules 8–16, with usable quiz pools and PDFs", () => {
    expect(event.lectures.map(l=>l.id)).toEqual([5,6,7,8,9,10].map(n=>`cne-l${n}`));
    expect(event.lectures.flatMap(l=>l.parts.map(p=>p.id))).toEqual([8,9,10,11,12,13,14,15,16].map(n=>`cne-m${n}`));
    for (const l of event.lectures) for (const p of l.parts) { expect(p.notes.ru.length).toBeGreaterThan(400); expect(p.questions.length).toBeGreaterThanOrEqual(8); }
    for (let i=5;i<=10;i++) expect(existsSync(`public/events/computer-networks-endterm/lecture-${i}.pdf`)).toBe(true);
    const quiz=draw(event,steps(event).at(-1)!);
    expect(quiz).toHaveLength(45); expect(new Set(quiz.map(q=>q.lecture)).size).toBe(6);
  });
  it("provides full and concise versions in both languages for all nine modules", () => {
    for (const part of event.lectures.flatMap(lecture => lecture.parts)) {
      for (const lang of ["ru", "en"] as const) {
        expect(part.shortNotes?.[lang].length, part.id).toBeGreaterThan(400);
        expect(part.notes[lang].length, part.id).toBeGreaterThan(part.shortNotes![lang].length);
      }
      expect(part.notes.en, part.id).not.toMatch(/[А-Яа-яЁё]/);
    }
    const ios = event.lectures[0].parts[2];
    expect(ios.notes.en).toContain("copy running-config startup-config");
    expect(ios.notes.ru).toContain("copy running-config startup-config");
  });
  it("draws the stated format, scores only exact MCQ sets and restores valid attempts", () => {
    const a=newAttempt(Math.random,1000);
    expect(a.deadline).toBe(2701000); expect(a.ids).toHaveLength(25); expect(a.openIds).toHaveLength(5);
    expect(scoreAttempt(a)).toBe(0);
    for (const id of a.ids) a.answers[id]=bank.find(q=>q.id===id)!.correct;
    expect(scoreAttempt(a)).toBe(80);
    expect(parseAttempt(JSON.stringify(a))).toEqual(a);
    const multiple=bank.find(q=>q.id===a.ids[20])!;
    a.answers[multiple.id]=multiple.options.map((_,i)=>i);
    expect(scoreAttempt(a)).toBe(76);
    expect(parseAttempt('{broken')).toBeNull();
    expect(parseAttempt(JSON.stringify({...a,ids:Array(25).fill(a.ids[0])}))).toBeNull();
    expect(parseAttempt(JSON.stringify({...a,answers:{[a.ids[0]]:[900]}}))).toBeNull();
  });
});
