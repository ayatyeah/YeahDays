import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { EVENTS } from "./index";
import { CAST_POSES } from "./types";
import { DIAGRAM_NAMES } from "@/components/events/NotesDiagram";

/**
 * Ролики-объяснения: всё, на что ссылается сценарий, существует — картинка
 * каждой позы, файл озвучки, схема; разметка озвучки — на каждую реплику.
 */
describe.each(EVENTS.filter((e) => e.videos?.length).map((e) => [e.id, e] as const))("ролики ивента %s", (_id, event) => {
  const videos = event.videos!;
  const parts = new Set(event.lectures.flatMap((l) => l.parts.map((p) => p.id)));

  it("id не повторяются, ролики привязаны к существующим частям", () => {
    expect(new Set(videos.map((v) => v.id)).size).toBe(videos.length);
    for (const v of videos) expect(parts.has(v.partId), v.id).toBe(true);
  });

  it("у каждой позы есть картинка персонажа, у каждой схемы — рисунок", () => {
    for (const v of videos) {
      for (const l of v.lines) {
        const role = v.cast[l.who];
        expect(CAST_POSES[role], `${v.id}: поза ${l.pose}`).toContain(l.pose);
        expect(existsSync(`public/cast/${role}-${l.pose}.webp`), `${v.id}: нет public/cast/${role}-${l.pose}.webp`).toBe(true);
        if (l.show?.kind === "diagram") expect(DIAGRAM_NAMES, v.id).toContain(l.show.name);
        if (l.show?.kind === "quiz") expect(l.show.options[l.show.answer], v.id).toBeTruthy();
      }
    }
  });

  it("озвучка: файл есть, разметка на каждую реплику, по возрастанию и внутри длительности", () => {
    for (const v of videos.filter((x) => x.audio)) {
      const a = v.audio!;
      expect(existsSync(`public${a.src}`), `${v.id}: нет public${a.src}`).toBe(true);
      expect(a.starts, v.id).toHaveLength(v.lines.length);
      a.starts.forEach((t, i) => i && expect(t, `${v.id} #${i + 1}`).toBeGreaterThan(a.starts[i - 1]));
      expect(a.starts.at(-1)!, v.id).toBeLessThan(a.duration);
    }
  });
});
