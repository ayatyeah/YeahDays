import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { STORIES, framePoses, frameSrc, sceneAudioSrc, storyRig, storyTimings } from "./index";

const pub = (src: string) => join(process.cwd(), "public", src);

describe("истории: всё, что нужно плееру, на месте", () => {
  for (const story of STORIES) {
    it(`${story.id}: у каждой реплики есть герой и кадр`, () => {
      expect(existsSync(pub(frameSrc(story, story.cover)))).toBe(true);
      for (const scene of story.scenes) {
        expect(scene.lines.length).toBeGreaterThan(0);
        for (const line of scene.lines) {
          expect(story.cast[line.who], `${scene.id}: герой ${line.who}`).toBeDefined();
          for (const pose of framePoses(story, line.frame)) expect(existsSync(pub(frameSrc(story, pose))), `${scene.id}: кадр ${pose}`).toBe(true);
        }
      }
    });

    it(`${story.id}: герои двигаются — у кадров дорисованы позы или сцена в перекладке`, () => {
      // перекладка: двигает холст, нужны спрайты всех поз из постановки
      const rig = storyRig(story.id);
      for (const scene of story.scenes.filter((s) => s.stage)) {
        expect(rig, `${scene.id}: перекладка без спрайтов`).toBeDefined();
        const poses = new Set(Object.entries(scene.stage!.cast).map(([who, a]) => `${who}_${a.pose}`));
        for (const l of scene.lines) for (const [who, pose] of Object.entries(l.act?.pose ?? {})) poses.add(`${who}_${pose}`);
        for (const pose of poses) expect(rig!.sprites[pose], `${scene.id}: спрайт ${pose}`).toBeDefined();
      }
      const lines = story.scenes.filter((s) => !s.stage).flatMap((s) => s.lines);
      const animated = lines.filter((l) => framePoses(story, l.frame).length >= 3);
      if (lines.length) expect(animated.length / lines.length).toBeGreaterThan(0.9);
    });

    it(`${story.id}: озвучка каждой сцены — файл и тайминг на каждую реплику`, () => {
      const timings = storyTimings(story.id);
      for (const scene of story.scenes) {
        const t = timings[scene.id];
        expect(t, `озвучка сцены ${scene.id}`).toBeDefined();
        expect(t.lines).toHaveLength(scene.lines.length);
        expect(existsSync(pub(sceneAudioSrc(story, scene.id)))).toBe(true);
        t.lines.forEach((l, i) => {
          expect(l.end).toBeGreaterThan(l.start);
          if (i) expect(l.start).toBeGreaterThan(t.lines[i - 1].end);
        });
        expect(t.duration).toBeGreaterThan(t.lines.at(-1)!.end);
      }
    });

    it(`${story.id}: термины — по-английски, пояснения — по-русски`, () => {
      const terms = story.scenes.flatMap((s) => s.lines.flatMap((l) => l.terms ?? []));
      expect(terms.length).toBeGreaterThan(10);
      for (const term of terms) {
        expect(term.term).toMatch(/^[A-Za-z0-9]/);
        expect(term.term).not.toMatch(/[А-Яа-яЁё]/);
        expect(term.ru).toMatch(/[А-Яа-яЁё]/);
      }
    });

    it(`${story.id}: подсказки эмоций — теги ElevenLabs, фон сцен — по-английски`, () => {
      // Иначе голос прочитает подсказку вслух.
      for (const line of story.scenes.flatMap((s) => s.lines)) if (line.say) expect(line.say).toMatch(/^\[[a-z ,'-]+\]$/);
      for (const scene of story.scenes) if (scene.ambience) expect(scene.ambience).not.toMatch(/[А-Яа-яЁё]/);
      // Голоса ElevenLabs — у всех героев или ни у кого: смешанный состав озвучивать нечем.
      const eleven = Object.values(story.cast).filter((c) => c.eleven).length;
      expect([0, Object.keys(story.cast).length]).toContain(eleven);
    });
  }
});
