import type { SceneTiming, Story } from "./types";
import { pmLecture4Story } from "./pmLecture4";
import { pmLecture5Story } from "./pmLecture5";
import { pmLecture6Story } from "./pmLecture6";
import { pmLecture7Story } from "./pmLecture7";
import pmLecture4Audio from "./audio/pm-l4-quickbite.json";
import pmLecture5Audio from "./audio/pm-l5-quickbite-grows.json";
import pmLecture6Audio from "./audio/pm-l6-quickbite-falls.json";
import pmLecture7Audio from "./audio/pm-l7-saras-last-sprint.json";
import pmLecture4Poses from "./poses/pm-l4-quickbite.json";
import pmLecture5Poses from "./poses/pm-l5-quickbite-grows.json";
import pmLecture6Poses from "./poses/pm-l6-quickbite-falls.json";
import pmLecture7Poses from "./poses/pm-l7-saras-last-sprint.json";

/**
 * Все истории. Новая история — файл сценария рядом, озвучка
 * (scripts/story-tts.mjs) и кадры в public/stories/<id>/frames
 * (scripts/story-frames.mjs), плюс строка здесь.
 */
export const STORIES: Story[] = [pmLecture4Story, pmLecture5Story, pmLecture6Story, pmLecture7Story];

const TIMINGS: Record<string, Record<string, SceneTiming>> = {
  [pmLecture4Story.id]: pmLecture4Audio as Record<string, SceneTiming>,
  [pmLecture5Story.id]: pmLecture5Audio as Record<string, SceneTiming>,
  [pmLecture6Story.id]: pmLecture6Audio as Record<string, SceneTiming>,
  [pmLecture7Story.id]: pmLecture7Audio as Record<string, SceneTiming>,
};

/** Сколько поз дорисовано к кадру (scripts/story-frames.mjs): кадр-2, кадр-3… */
const POSES: Record<string, Record<string, number>> = {
  [pmLecture4Story.id]: pmLecture4Poses,
  [pmLecture5Story.id]: pmLecture5Poses,
  [pmLecture6Story.id]: pmLecture6Poses,
  [pmLecture7Story.id]: pmLecture7Poses,
};

export function storyById(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}

/** Озвучка сцен истории; сцены без озвучки идут по таймеру (см. StoryPlayer). */
export function storyTimings(id: string): Record<string, SceneTiming> {
  return TIMINGS[id] ?? {};
}

/** Истории к лекции — для кнопки у лекции в ивенте. */
export function storiesForLecture(eventId: string, lectureId: string): Story[] {
  return STORIES.filter((s) => s.lecture.eventId === eventId && s.lecture.lectureId === lectureId);
}

/** Сколько длится реплика без озвучки: по длине текста, не меньше 2,5 с. */
export const fallbackLine = (text: string) => Math.max(2.5, text.length / 14);

/** Длина истории в секундах: озвученные сцены — по звуку, остальные — по тексту. */
export function storySeconds(story: Story): number {
  const timings = storyTimings(story.id);
  return story.scenes.reduce(
    (sum, scene) => sum + (timings[scene.id]?.duration ?? scene.lines.reduce((s, l) => s + fallbackLine(l.text) + 0.6, 0)),
    0,
  );
}

export const frameSrc = (story: Story, frame: string) => `/stories/${story.id}/frames/${frame}.webp`;

/** Кадр и его позы по порядку: [кадр, кадр-2, кадр-3]. Плеер сменяет их по ходу реплики. */
export function framePoses(story: Story, frame: string): string[] {
  const extra = POSES[story.id]?.[frame] ?? 0;
  return [frame, ...Array.from({ length: extra }, (_, i) => `${frame}-${i + 2}`)];
}
export const sceneAudioSrc = (story: Story, scene: string) => `/stories/${story.id}/audio/${scene}.m4a`;
