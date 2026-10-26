import type { ExplainerVideo } from "../../types";
import timings from "./audio.json";
import { videos7 } from "./l7";

/**
 * Ролики-объяснения курса Computer Networks: сценарии + озвучка из audio.json
 * (scripts/video-tts.mjs computerNetworks; звук — public/events/cn/video/<id>.m4a).
 * Ролик без озвучки тоже попадает в ленту — идёт по таймеру, без звука.
 */
const audio = timings as Record<string, { duration: number; starts: number[] }>;

export const cnVideos: ExplainerVideo[] = [...videos7].map((v) =>
  audio[v.id] ? { ...v, audio: { src: `/events/cn/video/${v.id}.m4a`, duration: audio[v.id].duration, starts: audio[v.id].starts } } : v,
);
