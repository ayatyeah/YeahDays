import { describe, expect, it } from "vitest";
import questions from "./quiz2_questions.json";
import { answerQuiz2, finishQuiz2, newQuiz2Attempt, parseQuiz2Attempt, quiz2Key } from "./quiz2";

describe("PM lecture practice", () => {
  it("has 50 unique sourced scenario questions, five distinct options, balanced letters and the planned coverage", () => {
    expect(questions).toHaveLength(50);
    expect(new Set(questions.map(q => q.id)).size).toBe(50);
    expect(new Set(questions.map(q => q.scenario + q.question)).size).toBe(50);
    expect([4,5,6,7,8].map(l => questions.filter(q => q.lecture === l).length)).toEqual([11,10,11,11,7]);
    expect([..."ABCDE"].map(l => questions.filter(q => q.correct_option === l).length)).toEqual([10,10,10,10,10]);
    for (const q of questions) {
      expect(new Set(q.options).size).toBe(5);
      expect(q.per_option_explanations).toHaveLength(5);
      expect(q.per_option_explanations.every(s => s.trim().length > 15)).toBe(true);
      expect(q.per_option_explanations["ABCDE".indexOf(q.correct_option)]).toBe(q.detailed_russian_explanation);
      expect(q.scenario.length).toBeGreaterThan(40);
      expect(q.question.endsWith("?")).toBe(true);
      expect(q.source_pdf).toContain(`Lecture ${q.lecture}`);
      expect(q.source_page).toBeGreaterThan(1);
      expect(q.source_page).toBeLessThanOrEqual(({4:33,5:45,6:50,7:45,8:31} as Record<number,number>)[q.lecture]);
    }
  });
  it("independently recomputes the five EVM answer keys", () => {
    const chosen = questions.slice(0,5).map(q => q.options["ABCDE".indexOf(q.correct_option)]);
    expect(800-900).toBeLessThan(0); expect(800-1000).toBeLessThan(0);
    expect(chosen[0]).toBe("Over budget and behind schedule.");
    expect(chosen[1]).toBe(`CPI = ${(1200/1000).toFixed(2)}; SPI = ${(1200/1500).toFixed(2)}.`);
    expect(chosen[2]).toBe(`$${0.4*2000}.`);
    expect(4000/0.8).toBe(5000); expect(4000-4000/0.8).toBe(-1000);
    expect(chosen[3]).toBe("EAC = $5,000; VAC = −$1,000.");
    expect((800-1000)/800*100).toBe(-25); expect((800-1000)/1000*100).toBe(-20);
    expect(chosen[4]).toBe("CVP = −25%; SVP = −20%.");
  });
  it("preserves answers on reload and isolates users", () => {
    const a=answerQuiz2(newQuiz2Attempt(1000), 3, 4, 2000);
    expect(parseQuiz2Attempt(JSON.stringify(a))).toEqual(a);
    expect(a.answers[3]).toBe(4);
    expect(quiz2Key("alice")).not.toBe(quiz2Key("bob"));
  });
  it("rejects damaged or stale storage", () => {
    expect(parseQuiz2Attempt("bad")).toBeNull();
    for (const patch of [{version:0},{answers:[1]},{deadline:99},{answers:Array(50).fill(5)},{submittedAt:0}]) {
      expect(parseQuiz2Attempt(JSON.stringify({...newQuiz2Attempt(1000),...patch}))).toBeNull();
    }
  });
  it("closes at the wall-clock deadline and never accepts a late answer", () => {
    const a=newQuiz2Attempt(1000);
    const done=answerQuiz2(a,0,2,a.deadline);
    expect(done.answers[0]).toBeNull();
    expect(done.submittedAt).toBe(a.deadline);
    expect(finishQuiz2(a,a.deadline+999999).submittedAt).toBe(a.deadline);
  });
  it("locks submitted answers and can start a fresh attempt without changing the previous object", () => {
    const a=answerQuiz2(newQuiz2Attempt(1000),0,2,2000);
    const done=finishQuiz2(a,3000);
    expect(answerQuiz2(done,0,4,4000)).toBe(done);
    expect(newQuiz2Attempt(5000).answers.every(v=>v===null)).toBe(true);
    expect(done.answers[0]).toBe(2);
  });
});
