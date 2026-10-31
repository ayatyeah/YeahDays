import type { SceneTiming, Story } from "./types";
import { pmLecture4Story } from "./pmLecture4";
import pmLecture4Audio from "./audio/pm-l4-quickbite.json";

/**
 * Все истории. Новая история — файл сценария рядом, озвучка
 * (scripts/story-tts.mjs) и кадры в public/stories/<id>/frames
 * (scripts/story-frames.mjs), плюс строка здесь.
 */
export const STORIES: Story[] = [pmLecture4Story];

const TIMINGS: Record<string, Record<string, SceneTiming>> = {
  [pmLecture4Story.id]: pmLecture4Audio as Record<string, SceneTiming>,
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
export const sceneAudioSrc = (story: Story, scene: string) => `/stories/${story.id}/audio/${scene}.m4a`;
