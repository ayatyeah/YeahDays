import type { ExplainerVideo } from "../../types";
import timings from "./audio.json";
import { videos4 } from "./l4";
import { videos5 } from "./l5";
import { videos6 } from "./l6";
import { videos7 } from "./l7";
import { videos8 } from "./l8";
import { videos9 } from "./l9";
import { videos10 } from "./l10";

/**
 * Ролики-объяснения ивента: сценарии по лекциям + озвучка из audio.json
 * (её пишет scripts/video-tts.mjs; звук — public/events/pm/video/<id>.m4a).
 * Ролик без озвучки тоже попадает в ленту — идёт по таймеру, без звука.
 */
const audio = timings as Record<string, { duration: number; starts: number[] }>;

export const pmVideos: ExplainerVideo[] = [...videos4, ...videos5, ...videos6, ...videos7, ...videos8, ...videos9, ...videos10].map((v) =>
  audio[v.id] ? { ...v, audio: { src: `/events/pm/video/${v.id}.m4a`, duration: audio[v.id].duration, starts: audio[v.id].starts } } : v,
);
