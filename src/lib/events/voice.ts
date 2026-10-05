/**
 * Выбор голоса для озвучки конспектов.
 *
 * Синтезатор браузера по умолчанию берёт первый попавшийся голос языка, и
 * на многих устройствах это старый «робот», хотя рядом установлен
 * нормальный нейронный. Здесь голоса языка ранжируются по названию —
 * другого признака качества Web Speech API не даёт.
 */

export interface VoiceLike {
  name: string;
  lang: string;
  localService?: boolean;
  default?: boolean;
}

/** Нейронные и «улучшенные» голоса: Edge, Chrome, macOS и iOS называют их по-разному. */
const GOOD = /natural|neural|premium|enhanced|улучш|siri|online|wavenet/i;
/** Голоса Google в Chrome и Android заметно лучше системных по умолчанию. */
const DECENT = /google/i;
/** Известные приятные системные голоса — на случай, когда пометок качества нет. */
const NAMED = /milena|милена|katya|катя|svetlana|светлана|dariya|samantha|ava\b|allison|aria|jenny|zira|karen|serena/i;
/** Сжатые и синтезированные по правилам — то самое «как робот». */
const BAD = /compact|espeak|festival|pico|robot|novelty|albert|bahh|bells|boing|bubbles|cellos|whisper|zarvox|trinoids|jester|organ|superstar|wobble|good news|bad news/i;

const language = (tag: string) => tag.toLowerCase().replace("_", "-");

/** Чем больше, тем приятнее голос; отрицательное — лучше не брать, если есть другой. */
export function voiceScore(voice: VoiceLike, lang: "ru" | "en"): number {
  const tag = language(voice.lang);
  if (!tag.startsWith(lang)) return -1000;
  let score = 0;
  if (GOOD.test(voice.name)) score += 100;
  if (DECENT.test(voice.name)) score += 60;
  if (NAMED.test(voice.name)) score += 30;
  if (BAD.test(voice.name)) score -= 200;
  // Для английского конспекта привычнее американское или британское произношение.
  if (lang === "en") score += tag === "en-us" ? 12 : tag === "en-gb" ? 8 : 0;
  if (lang === "ru" && tag === "ru-ru") score += 5;
  if (voice.default) score += 2;
  return score;
}

/** Голоса языка от лучшего к худшему. */
export function rankVoices<T extends VoiceLike>(voices: readonly T[], lang: "ru" | "en"): T[] {
  return voices
    .filter((v) => language(v.lang).startsWith(lang))
    .map((voice, index) => ({ voice, index, score: voiceScore(voice, lang) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((x) => x.voice);
}

export const RATES = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;
/** Ближайшая допустимая скорость — сохранённое значение могло быть любым. */
export const clampRate = (value: number): number => (Number.isFinite(value) ? RATES.reduce((best, r) => (Math.abs(r - value) < Math.abs(best - value) ? r : best), 1 as number) : 1);
