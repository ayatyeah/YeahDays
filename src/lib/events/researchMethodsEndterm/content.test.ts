import { describe, expect, it } from "vitest";
import { cases, figures, modes, scenario, workedAnswers, type CaseId } from "./content";

describe("RMT photographed cases and alternate designs", () => {
  it("preserves original denominators and distinguishes percentage points from relative growth", () => {
    expect(figures("A")).toMatchObject({ n: 32, before: 20, after: 28, pre: 62.5, post: 87.5, pp: 25, relative: 40, contrast: 18.75 });
    expect(figures("B")).toMatchObject({ n: 40, before: 26, after: 32, pre: 65, post: 80, pp: 15, contrast: 10 });
    expect(figures("B").relative).toBeCloseTo(23.076923);
  });
  for (const id of ["A", "B"] as CaseId[]) for (const { id: mode } of modes) {
    it(`${id}/${mode}: all exam subparts, five six-point tasks and three-sentence report`, () => {
      const answers = workedAnswers(id, mode);
      expect(answers.map(q => q.id)).toEqual(["1a","1b","1c","2a","2b","2c","3a","3b","3c","3d","4a","4b","4c","5a","5b"]);
      for (let i=1;i<=5;i++) expect(answers.filter(q=>q.id.startsWith(String(i))).reduce((n,q)=>n+q.points,0)).toBe(6);
      for (const q of answers) for (const field of [q.prompt,q.answer,q.why,q.trap]) expect(field.length).toBeGreaterThan(30);
      expect(answers.at(-1)?.answer.split("\n").map(s=>s.split(":")[0])).toEqual(["Methods","Results","Discussion/Limitations"]);
      if (mode !== "mixed") expect(scenario(id, mode)).toContain("AUTHOR-CREATED PRACTICE SCENARIO");
      if (mode === "qualitative") expect(scenario(id,mode)).toContain("No performance logs");
      expect(cases[id].before.every(n=>n>=0 && n<=cases[id].items)).toBe(true);
    });
  }
});
