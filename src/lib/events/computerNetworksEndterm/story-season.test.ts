import { describe, expect, it } from "vitest";
import { readFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import season from "./story-season.json";
import notes from "./notes.json";
import { event } from "./event";

describe("Network story season", () => {
  it("provides a complete, seekable episode for every study part", () => {
    expect(season.map(s => s.partId)).toEqual(event.lectures.flatMap(l => l.parts.map(p => p.id)));
    for (const episode of season) {
      expect(episode.duration).toBeGreaterThan(150);
      expect(episode.chapters.length).toBeGreaterThanOrEqual(5);
      let previous = -1;
      for (const chapter of episode.chapters) {
        expect(chapter.start).toBeGreaterThan(previous);
        expect(chapter.start).toBeLessThan(episode.duration);
        previous = chapter.start;
      }
      for (const extension of ["mp4", "jpg", "vtt", "txt"]) expect(existsSync(`public${episode.base}.${extension}`)).toBe(true);
      expect(statSync(`public${episode.base}.mp4`).size).toBeGreaterThan(1_000_000);
      expect(readFileSync(`public${episode.base}.vtt`, "utf8")).toContain("[Закадровый смех]");
    }
  });
  it("keeps the editorial coverage map in sync with the full notes", () => {
    const coverage: { module: number; notesSha256: string; sections: { heading: string; chapters: number[] }[] }[] = JSON.parse(readFileSync("src/lib/events/computerNetworksEndterm/story-coverage.json", "utf8"));
    expect(coverage).toHaveLength(9);
    for (const entry of coverage) {
      const text = notes[String(entry.module) as keyof typeof notes];
      expect(createHash("sha256").update(text).digest("hex")).toBe(entry.notesSha256);
      expect(entry.sections.map(s => s.heading)).toEqual([...text.matchAll(/^## (.+)$/gm)].map(m => m[1]));
      const episode = season.find(e => e.module === entry.module)!;
      for (const section of entry.sections) for (const chapter of section.chapters) expect(chapter >= 1 && chapter <= episode.chapters.length).toBe(true);
    }
  });
});
