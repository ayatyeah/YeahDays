// Звук «Историй» из ElevenLabs: музыка по настроению сцены и фон сцен.
//
//   node scripts/story-sound.mjs music        — треки настроений (uplift, tension, calm, grief), каких ещё нет
//   node scripts/story-sound.mjs pmLecture7   — фоновые звуки сцен истории (scene.ambience), каких ещё нет
//
// Файлы — в ~/.cache/yg-stories/sound (см. musicFile и ambienceFile в
// story-tts.mjs); story-tts.mjs подмешивает их при сборке сцены, поэтому
// после генерации: node scripts/story-tts.mjs <история> --mix.
// Музыка — 60 с инструментала, который не спорит с речью; по кругу плеер её
// не гоняет — сцена короче или трек повторяется (-stream_loop).

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { MUSIC_TRACKS, ambienceFile, elevenKey, musicFile } from "./story-tts.mjs";

const MOOD_OF_TRACK = { uplift: "hope", tension: "tension", calm: "calm", grief: "grief" };

const PROMPTS = {
  uplift: "Warm hopeful instrumental underscore for an animated film: soft piano, light strings, gentle pizzicato, optimistic and calm. No drums, no vocals. Stays in the background under dialogue, even dynamics, loopable.",
  tension: "Subtle tense instrumental underscore for an animated drama: low pulsing synth pad, muted string ostinato, slow build, uneasy but quiet. No vocals. Unobtrusive under dialogue, even dynamics, loopable.",
  calm: "Thoughtful light instrumental underscore for an educational animated film: soft marimba, felt piano and warm pads, focused and gentle. No drums, no vocals. Unobtrusive under dialogue, even dynamics, loopable.",
  grief: "Sad tender instrumental underscore for a scene of loss in an animated film: slow solo felt piano with soft cello, quiet, melancholic but warm. No vocals. Unobtrusive under dialogue, even dynamics.",
};

async function post(path, body, key) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(`https://api.elevenlabs.io${path}`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(300_000),
    }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
    if (r.ok) return { data: Buffer.from(await r.arrayBuffer()), cost: r.headers.get?.("character-cost") };
    const t = await r.text();
    if (r.status === 429 || r.status >= 500 || r.status === 0) {
      await new Promise((ok) => setTimeout(ok, 5000 * (attempt + 1)));
      continue;
    }
    throw new Error(`ElevenLabs ${r.status}: ${t.slice(0, 240)}`);
  }
  throw new Error("ElevenLabs не ответил за четыре попытки");
}

function save(file, data) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
}

async function main() {
  const what = process.argv[2] ?? "";
  const key = elevenKey();
  if (!key) throw new Error("нет ключа ElevenLabs: ~/.config/yeahgrind/elevenlabs-key");
  if (what === "music") {
    for (const track of MUSIC_TRACKS) {
      const file = musicFile(MOOD_OF_TRACK[track]);
      if (existsSync(file)) continue;
      const { data, cost } = await post("/v1/music?output_format=mp3_44100_128", { prompt: PROMPTS[track], music_length_ms: 60_000, force_instrumental: true }, key);
      save(file, data);
      console.log(`музыка ${track}: ${file}${cost ? `, кредитов ${cost}` : ""}`);
    }
    return;
  }
  if (!what) throw new Error("укажи: music или файл истории (pmLecture7)");
  const mod = await import(pathToFileURL(join(process.cwd(), "src/lib/stories", `${what}.ts`)).href);
  const story = Object.values(mod).find((v) => v && typeof v === "object" && "scenes" in v);
  if (!story) throw new Error(`в src/lib/stories/${what}.ts нет истории`);
  for (const scene of story.scenes) {
    if (!scene.ambience) continue;
    const file = ambienceFile(story.id, scene);
    if (existsSync(file)) continue;
    const { data, cost } = await post("/v1/sound-generation?output_format=mp3_44100_128", { text: scene.ambience, duration_seconds: 20, loop: true, prompt_influence: 0.45 }, key);
    save(file, data);
    console.log(`фон ${story.id}/${scene.id}: ${scene.ambience}${cost ? ` (кредитов ${cost})` : ""}`);
  }
}

await main();
