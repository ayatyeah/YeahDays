/**
 * «Истории» — мультфильмы по лекциям: сюжет с персонажами, где каждое
 * понятие лекции появляется в момент, когда оно нужно героям.
 *
 * История — сцены, сцена — реплики. У каждой реплики свой кадр (картинка
 * 16:9, плеер ведёт по ней камеру) и, если в ней звучит термин, карточка
 * термина: сам термин по-английски, как на слайдах и в тесте, пояснение —
 * по-русски. Озвучка — по реплике на файл (scripts/story-tts.mjs), поэтому
 * время каждой реплики известно точно.
 */

export type StoryMood = "hope" | "tension" | "calm" | "smart" | "strategy" | "conflict" | "uplift" | "triumph";

export interface StoryCharacter {
  /** Имя в субтитрах. */
  name: string;
  /** Роль в команде — по-английски, как подпись на кадрах. */
  role?: string;
  /** Голос Gemini TTS. */
  voice: string;
}

export interface StoryTerm {
  /** Термин как на слайде: «BCWS», «Storming». */
  term: string;
  /** Полная английская форма, если термин — сокращение. */
  full?: string;
  /** Что это значит — по-русски, одной-двумя фразами. */
  ru: string;
}

export interface StoryLine {
  who: string;
  text: string;
  /** Кадр — имя файла без расширения в public/stories/<id>/frames. */
  frame: string;
  terms?: StoryTerm[];
}

export interface StoryScene {
  id: string;
  title: string;
  mood: StoryMood;
  lines: StoryLine[];
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  /** К какой лекции: ивент, лекция и подпись для списка. */
  lecture: { eventId: string; lectureId: string; label: string };
  /** Обложка — кадр из frames. */
  cover: string;
  cast: Record<string, StoryCharacter>;
  scenes: StoryScene[];
  /** Финальная карточка после последней сцены. */
  moral: string;
}

/** Время реплик в озвучке сцены (scripts/story-tts.mjs): начало и конец, с. silent — реплика ещё без голоса (кончилась квота TTS): на её месте пауза, плеер показывает субтитр. */
export interface SceneTiming {
  duration: number;
  lines: { start: number; end: number; silent?: boolean }[];
}
