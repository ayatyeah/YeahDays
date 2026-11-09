import { describe, expect, it } from "vitest";
import questions from "./vrt.json";

const question = (id: string) => {
  const q = questions.find(q => q.id === id);
  if (!q) throw new Error(`Missing VRT question: ${id}`);
  return q;
};

describe("VRT study collection", () => {
  it("keeps all positions in four sets without counting the duplicate photo", () => {
    expect(questions).toHaveLength(100);
    expect(new Set(questions.map(q => q.id)).size).toBe(100);
    for (const set of [1, 2, 3, 4]) {
      expect(questions.filter(q => q.set === set).map(q => q.number)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
    }
    for (const q of questions) {
      expect(q.answer.length).toBeGreaterThan(0);
      expect(q.explanation.length).toBeGreaterThan(60);
      expect(q.topic).toBeGreaterThanOrEqual(8);
      expect(q.topic).toBeLessThanOrEqual(17);
    }
  });

  it("uses the changed numbers from this collection instead of old Cisco keys", () => {
    expect(question("vrt-1-01").answer).toBe("10 segments");
    for (const id of ["vrt-1-19", "vrt-3-14"]) {
      expect(question(id).prompt).toContain("two packets");
      expect(question(id).answer).toContain(String(2 * 1500 + 1));
      expect(question(id).answer).not.toContain("4501");
    }
    expect(question("vrt-2-01").answer).toContain("Host unreachable");
    expect(question("vrt-4-18").answer).toBe(String(2 ** 10 - 2));
  });

  it("does not present incomplete conditions as unconditional exact answers", () => {
    for (const id of ["vrt-3-15", "vrt-3-22", "vrt-4-11", "vrt-4-25"]) {
      const q = question(id);
      expect(q.prompt).toMatch(/^\[Фрагмент/);
      expect(q.caution.length).toBeGreaterThan(20);
      expect(q.answer).toMatch(/^(If |Cannot determine)/);
    }
  });

  it("flags malformed answer sets instead of silently inventing a single key", () => {
    for (const id of ["vrt-1-16", "vrt-2-04", "vrt-3-02"]) {
      expect(question(id).options).not.toContain("application");
      expect(question(id).caution).toContain("Application");
    }
    expect(question("vrt-4-22").answer).toContain("Both A and B");
    for (const id of ["vrt-3-25", "vrt-4-12"]) {
      expect(question(id).caution).toContain("choose-three");
      expect(question(id).explanation).toContain("checksum");
    }
  });
});
