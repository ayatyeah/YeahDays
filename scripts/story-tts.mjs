// Озвучка «Историй» голосами Gemini — у каждого героя свой голос.
//
//   node scripts/story-tts.mjs pmLecture4          — озвучить, чего ещё нет, и собрать сцены
//   node scripts/story-tts.mjs pmLecture4 --one    — то же, но строго по запросу на реплику
//   node scripts/story-tts.mjs pmLecture4 --mix    — только пересобрать сцены из готовых WAV
//
// Пачками: дневной лимит TTS считается в запросах, а не в символах, поэтому
// соседние реплики сцены (до MAX_LINES, не больше двух героев — модель держит
// два голоса) идут одним запросом-диалогом. Запись режется на реплики по
// паузам, ближайшим к границам, ожидаемым по длине текста; каждую часть
// сверяем со скоростью речи. Не сошлось — эти реплики переозвучиваются по
// одной, так что время каждой реплики по-прежнему точное: субтитры, кадр и
// карточки терминов меняются ровно с голосом.
//
// Ключи и модели — как в video-tts.mjs: ~/.config/yeahgrind/gemini-keys, на
// 429 следующий ключ, потом следующая модель.
//
// ElevenLabs: если у всех героев истории есть голос eleven, история
// озвучивается им (ELEVEN_MODEL, ключ — ~/.config/yeahgrind/elevenlabs-key).
// Лимит там в кредитах, а не в запросах, поэтому строго по реплике; теги
// эмоций из line.say идут только в озвучку. Музыка сцены — по настроению,
// фоновый звук — по scene.ambience (оба — scripts/story-sound.mjs).
//
// Что получается:
// - ~/.cache/yg-stories/<id>/wav/<сцена>-<n>-<хеш>.wav — реплики без потерь;
// - public/stories/<id>/audio/<сцена>.m4a — сцена: реплики с паузами и музыка;
// - src/lib/stories/audio/<id>.json — длина сцены и начало/конец каждой реплики.
//
// Квоты кончились посреди сцены — сцена всё равно собирается: на месте
// неозвученной реплики пауза длиной по тексту, в таймингах у неё silent,
// плеер показывает субтитр под музыку. Следующий запуск доозвучит и
// пересоберёт (хеш сцены включает, какие реплики без голоса).

import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { lufs, mixArgs } from "./video-audio.mjs";

const FILE = process.argv[2] ?? "";
const MIX_ONLY = process.argv.includes("--mix");
const ONE_BY_ONE = process.argv.includes("--one");
/** Пачка за запрос: не больше реплик и символов (длинный диалог модель читает хуже). */
const MAX_LINES = 2, MAX_CHARS = 650;

const MODELS = [
  { model: "gemini-2.5-flash-preview-tts", api: "generate" },
  { model: "gemini-2.5-pro-preview-tts", api: "generate" },
  { model: "gemini-3.8-flash-tts", api: "interactions" },
  { model: "gemini-3.8-flash-lite-tts", api: "interactions" },
];

/** Как произносить: интонация героя. Английские термины — по-английски. */
const TONE = {
  narrator: "спокойно и тепло, как рассказчик в анимационном фильме",
  sara: "тепло и уверенно, как мудрый преподаватель-наставник",
  ayat: "энергично и решительно, как молодой лидер команды",
  mira: "живо и эмоционально, как увлечённая дизайнер",
  dani: "горячо и немного нервно, как разработчик под дедлайном",
  arman: "собранно и чётко, как финансист, который любит цифры",
  bekzat: "уверенно и напористо, как требовательный крупный заказчик",
  aliya: "живо, с иронией и прямотой, как молодая разработчица, которая не стесняется сказать как есть",
  gulnara: "тепло и по-домашнему, как добродушная хозяйка маленького кафе",
};

/** Паузы, с: перед первой репликой, между репликами, при смене говорящего, после реплики с терминами (дочитать карточку), в конце сцены. */
const LEAD = 0.5, GAP = 0.45, TURN = 0.7, TERMS_HOLD = 1.2, END = 1.4;

const SR = 24000;

function keys() {
  const file = join(homedir(), ".config/yeahgrind/gemini-keys");
  const list = existsSync(file) ? readFileSync(file, "utf8").split(/\s+/).map((k) => k.trim()).filter(Boolean) : [];
  if (list.length) return list;
  const env = existsSync(".env") ? readFileSync(".env", "utf8") : "";
  const m = /^GOOGLE_GEMINI_API_SECRET\s*=\s*"?([^"\n]+)"?/m.exec(env);
  return m ? [m[1].trim()] : [];
}

const sha = (v) => createHash("sha1").update(JSON.stringify(v)).digest("hex").slice(0, 10);

/** Метка героя в диалоге: латиницей, та же, что в настройке голосов. */
const label = (who) => who[0].toUpperCase() + who.slice(1);

/** Запрос на пачку реплик: один герой — его голосом, два — диалогом на два голоса. */
function request(chunk, cast, spec) {
  const speakers = [...new Set(chunk.map((l) => l.who))];
  const dialog = speakers.length > 1;
  const text = dialog ? chunk.map((l) => `${label(l.who)}: ${l.text}`).join("\n") : chunk.map((l) => l.text).join("\n\n");
  if (spec.api === "generate") {
    const how = dialog
      ? `Озвучь диалог по-русски, английские термины и сокращения — по-английски. ${speakers.map((w) => `${label(w)} говорит ${TONE[w] ?? "естественно"}`).join("; ")}. Между репликами — короткая пауза`
      : `Произнеси по-русски ${TONE[speakers[0]] ?? "естественно"}; английские термины и сокращения — по-английски${chunk.length > 1 ? "; между абзацами — пауза" : ""}`;
    const speechConfig = dialog
      ? { multiSpeakerVoiceConfig: { speakerVoiceConfigs: speakers.map((w) => ({ speaker: label(w), voiceConfig: { prebuiltVoiceConfig: { voiceName: cast[w].voice } } })) } }
      : { voiceConfig: { prebuiltVoiceConfig: { voiceName: cast[speakers[0]].voice } } };
    return {
      url: `https://generativelanguage.googleapis.com/v1beta/models/${spec.model}:generateContent`,
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${how}:\n${text}` }] }],
        generationConfig: { responseModalities: ["AUDIO"], speechConfig },
      }),
    };
  }
  return {
    url: "https://generativelanguage.googleapis.com/v1beta/interactions",
    body: JSON.stringify({
      model: spec.model,
      // Один голос — массив из одного голоса без имени говорящего: с именем
      // API считает это диалогом и требует ровно два голоса.
      input: [{ type: "user_input", content: [{ type: "text", text }] }],
      response_format: { type: "audio", mime_type: "audio/wav", sample_rate: SR },
      generation_config: { speech_config: dialog ? speakers.map((w) => ({ speaker: label(w), voice: cast[w].voice })) : [{ voice: cast[speakers[0]].voice }] },
    }),
  };
}

function audioOf(json) {
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (part) return { data: Buffer.from(part.inlineData.data, "base64"), wav: false };
  const audio = (json.steps ?? []).flatMap((s) => s.content ?? []).find((c) => c.type === "audio" && c.data);
  if (audio) return { data: Buffer.from(audio.data, "base64"), wav: /wav/i.test(audio.mime_type ?? "") };
  return null;
}

class Exhausted extends Error {}

const ELEVEN_MODEL = "eleven_v4";

/** Ключ ElevenLabs: ~/.config/yeahgrind/elevenlabs-key или ELEVENLABS_API_KEY. */
export function elevenKey() {
  const file = join(homedir(), ".config/yeahgrind/elevenlabs-key");
  return (existsSync(file) ? readFileSync(file, "utf8").trim() : "") || process.env.ELEVENLABS_API_KEY || "";
}

/** Реплика голосом ElevenLabs: MP3 (ffmpeg определит формат сам). */
async function elevenSpeak(line, cast, key) {
  const body = JSON.stringify({ text: `${line.say ? `${line.say} ` : ""}${line.text}`, model_id: ELEVEN_MODEL, language_code: "ru" });
  for (let attempt = 0; attempt < 5; attempt++) {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cast[line.who].eleven}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body,
      signal: AbortSignal.timeout(180_000),
    }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
    if (r.ok) return { data: Buffer.from(await r.arrayBuffer()), wav: true };
    const t = await r.text();
    if (/quota_exceeded|insufficient|exceeds your/i.test(t)) throw new Exhausted("кредиты ElevenLabs кончились");
    // 429 — слишком много запросов разом, 409 — голос из библиотеки ещё
    // подключается к аккаунту (первые запросы новым голосом параллельно),
    // 5xx и сеть — подождать и повторить.
    if (r.status === 429 || r.status === 409 || r.status >= 500 || r.status === 0) {
      await new Promise((ok) => setTimeout(ok, 4000 * (attempt + 1)));
      continue;
    }
    throw new Error(`ElevenLabs ${r.status}: ${t.slice(0, 200)}`);
  }
  throw new Error("ElevenLabs не ответил за пять попыток");
}

/** Музыка по настроению сцены: близкие настроения делят трек. Нет трека — общий (video-audio.mjs). */
const MOOD_MUSIC = { hope: "uplift", uplift: "uplift", triumph: "uplift", tension: "tension", conflict: "tension", calm: "calm", smart: "calm", strategy: "calm", grief: "grief" };
export const SOUND = join(homedir(), ".cache/yg-stories/sound");
export const MUSIC_TRACKS = [...new Set(Object.values(MOOD_MUSIC))];
export const musicFile = (mood) => join(SOUND, `music-${MOOD_MUSIC[mood] ?? "calm"}.mp3`);
export const ambienceFile = (storyId, scene) => join(SOUND, storyId, `${scene.id}-${sha(scene.ambience)}.mp3`);

async function synth(chunk, cast, keyList, state, prefer) {
  const order = keyList.map((_, i) => (prefer + i) % keyList.length);
  for (const spec of MODELS) {
    const { url, body } = request(chunk, cast, spec);
    for (const k of order) {
      const tag = `${spec.model}#${k}`;
      if (state.dead.has(tag)) continue;
      let response;
      for (let attempt = 0; attempt < 4; attempt++) {
        response = await fetch(url, {
          method: "POST",
          headers: { "x-goog-api-key": keyList[k], "Content-Type": "application/json" },
          body,
          signal: AbortSignal.timeout(120_000),
        }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
        if (response.status !== 429) break;
        const t = await response.text();
        if (/PerDay/i.test(t) || attempt === 3) {
          state.dead.add(tag);
          console.log(`  квота ${tag} на сегодня кончилась`);
          response = null;
          break;
        }
        const wait = Number(/"retryDelay":\s*"(\d+)/.exec(t)?.[1] ?? 30);
        console.log(`  ${tag}: лимит в минуту, жду ${wait} с`);
        await new Promise((r) => setTimeout(r, (wait + 2) * 1000));
      }
      if (!response) continue;
      if (!response.ok) {
        console.log(`  ${tag}: ${response.status} ${(await response.text()).slice(0, 160)}`);
        continue;
      }
      const audio = audioOf(await response.json());
      if (audio) return audio;
      console.log(`  ${tag}: нет аудио в ответе`);
    }
  }
  throw new Exhausted("все ключи и модели исчерпаны");
}

const seconds = (file) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" }).trim());

/** Обрезать тишину по краям реплики: у моделей бывает до полусекунды пустоты в начале. */
function trimmed(src, out) {
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", src, "-af",
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse",
    "-ar", String(SR), "-ac", "1", "-c:a", "pcm_s16le", out]);
}

function silence(file, sec) {
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "lavfi", "-i", `anullsrc=r=${SR}:cl=mono`, "-t", sec.toFixed(3), "-c:a", "pcm_s16le", file]);
}

/** Скорость речи, символов в секунду, в которой реплике можно верить: вне её — нарезка промахнулась. */
const RATE = [6.5, 26];

/**
 * Где резать запись пачки: по одной паузе на границу реплик. Ожидаемая
 * граница — по длине текста и обычной скорости речи голоса (rates, символов
 * в секунду); из пауз (silencedetect) выбираем по порядку те, что ближе к
 * ожиданию и длиннее. Каждый отрезок сверяем со скоростью его голоса.
 * Возвращает отрезки [начало, конец] или null — тогда реплики по одной.
 */
function cuts(wav, chunk, rates) {
  const total = seconds(wav);
  if (chunk.length === 1) return [[0, total]];
  const log = spawnSync("ffmpeg", ["-hide_banner", "-i", wav, "-af", "silencedetect=noise=-40dB:d=0.15", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const starts = [...log.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const gaps = starts
    .map((st, i) => ({ mid: (st + (ends[i] ?? total)) / 2, len: (ends[i] ?? total) - st }))
    .filter((g) => g.mid > 0.4 && g.mid < total - 0.4);
  const rate = (l) => rates[l.who] ?? 14;
  const want = chunk.map((l) => l.text.length / rate(l));
  const sum = want.reduce((x, y) => x + y, 0);
  let acc = 0;
  const expect = want.slice(0, -1).map((w) => ((acc += w) / sum) * total);
  const n = expect.length;
  if (gaps.length < n) return null;
  const cost = (k, j) => Math.abs(gaps[j].mid - expect[k]) - 6 * Math.min(gaps[j].len, 0.9);
  // Динамика: best[k][j] — лучшая цена, если граница k легла на паузу j.
  const best = expect.map(() => gaps.map(() => Infinity));
  const from = expect.map(() => gaps.map(() => -1));
  gaps.forEach((_, j) => { best[0][j] = cost(0, j); });
  for (let k = 1; k < n; k++) {
    for (let j = k; j < gaps.length; j++) {
      for (let q = k - 1; q < j; q++) {
        const c = best[k - 1][q] + cost(k, j);
        if (c < best[k][j]) { best[k][j] = c; from[k][j] = q; }
      }
    }
  }
  let j = best[n - 1].indexOf(Math.min(...best[n - 1]));
  const picked = [];
  for (let k = n - 1; k >= 0; k--) { picked.unshift(gaps[j].mid); j = from[k][j]; }
  const edges = [0, ...picked, total];
  const parts = chunk.map((_, i) => [edges[i], edges[i + 1]]);
  const ok = parts.every(([x, y], i) => {
    const r = chunk[i].text.length / (y - x);
    return y - x > 0.6 && r >= RATE[0] && r <= RATE[1] && r / rate(chunk[i]) > 0.65 && r / rate(chunk[i]) < 1.5;
  });
  return ok ? parts : null;
}

/** Пачки к озвучке: подряд идущие неозвученные реплики сцены, не больше двух героев. */
function batches(story, missing, single) {
  const out = [];
  for (const scene of story.scenes) {
    let cur = null;
    scene.lines.forEach((line, i) => {
      if (!missing(scene, i, line)) { cur = null; return; }
      const who = new Set([...(cur?.items.map((q) => q.line.who) ?? []), line.who]);
      // Пачка — пара реплик разных героев: между ними пауза смены голоса, её легче найти.
      const prev = cur?.items[cur.items.length - 1]?.line.who;
      if (single || !cur || prev === line.who || who.size > 2 || cur.items.length >= MAX_LINES || cur.chars + line.text.length > MAX_CHARS) {
        cur = { items: [], chars: 0 };
        out.push(cur);
      }
      cur.items.push({ scene, line, i });
      cur.chars += line.text.length;
    });
  }
  return out;
}

/**
 * Обычная скорость речи каждого героя (символов в секунду) — медиана по уже
 * озвученным репликам этого голоса во всех историях; кэш —
 * ~/.cache/yg-stories/voice-rate.json. Нет записей — 14 (средняя по голосам).
 */
async function voiceRates(story) {
  const file = join(homedir(), ".cache/yg-stories/voice-rate.json");
  const known = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
  const want = new Set(Object.values(story.cast).map((c) => c.voice).filter((v) => !known[v]));
  if (want.size) {
    const dir = join(process.cwd(), "src/lib/stories");
    const found = {};
    for (const f of readdirSync(dir).filter((n) => /^\w+\.ts$/.test(n) && n !== "index.ts" && n !== "types.ts")) {
      const mod = await import(pathToFileURL(join(dir, f)).href);
      const other = Object.values(mod).find((v) => v && typeof v === "object" && "scenes" in v);
      if (!other) continue;
      for (const scene of other.scenes) {
        scene.lines.forEach((line, i) => {
          const voice = other.cast[line.who].voice;
          if (!want.has(voice)) return;
          const wav = join(homedir(), ".cache/yg-stories", other.id, "wav", `${scene.id}-${i}-${sha([line.who, voice, line.text])}.wav`);
          if (existsSync(wav)) (found[voice] ??= []).push(line.text.length / seconds(wav));
        });
      }
    }
    for (const [voice, list] of Object.entries(found)) {
      if (list.length < 3) continue;
      list.sort((x, y) => x - y);
      known[voice] = Math.round(list[list.length >> 1] * 10) / 10;
    }
    writeFileSync(file, JSON.stringify(known, null, 1));
  }
  return Object.fromEntries(Object.entries(story.cast).map(([who, c]) => [who, known[c.voice] ?? 14]));
}

async function main() {
  if (!FILE) throw new Error("укажи файл истории: node scripts/story-tts.mjs pmLecture4");
  const mod = await import(pathToFileURL(join(process.cwd(), "src/lib/stories", `${FILE}.ts`)).href);
  const story = Object.values(mod).find((v) => v && typeof v === "object" && "scenes" in v);
  if (!story) throw new Error(`в src/lib/stories/${FILE}.ts нет истории`);
  const cache = join(homedir(), ".cache/yg-stories", story.id, "wav");
  const out = join("public/stories", story.id, "audio");
  const timingsFile = join("src/lib/stories/audio", `${story.id}.json`);
  mkdirSync(cache, { recursive: true });
  mkdirSync(out, { recursive: true });
  mkdirSync("src/lib/stories/audio", { recursive: true });

  const ELEVEN = Object.values(story.cast).every((c) => c.eleven);
  const wavOf = (scene, i, line) => {
    const c = story.cast[line.who];
    const key = ELEVEN ? [line.who, c.eleven, ELEVEN_MODEL, line.say ?? "", line.text] : [line.who, c.voice, line.text];
    return join(cache, `${scene.id}-${i}-${sha(key)}.wav`);
  };

  if (!MIX_ONLY) {
    const ekey = ELEVEN ? elevenKey() : "";
    if (ELEVEN && !ekey) throw new Error("нет ключа ElevenLabs: положи его в ~/.config/yeahgrind/elevenlabs-key");
    const keyList = ELEVEN ? [] : keys();
    if (!ELEVEN && !keyList.length) throw new Error("нет ключей Gemini: положи их в ~/.config/yeahgrind/gemini-keys");
    const rates = ELEVEN ? {} : await voiceRates(story);
    const queue = batches(story, (scene, i, line) => !existsSync(wavOf(scene, i, line)), ELEVEN || ONE_BY_ONE);
    const total = queue.reduce((n, b) => n + b.items.length, 0);
    // У ElevenLabs на тарифе Starter — до трёх запросов одновременно.
    const streams = ELEVEN ? 3 : keyList.length;
    console.log(`${ELEVEN ? `ElevenLabs ${ELEVEN_MODEL}` : "Gemini"}: реплик к озвучке: ${total}, запросов: ${queue.length}, потоков: ${streams}`);
    const state = { dead: new Set(), stop: false };
    const worker = async (slot) => {
      for (let batch = queue.shift(); batch && !state.stop; batch = queue.shift()) {
        const { items } = batch;
        const first = items[0];
        const tag = `${first.scene.id}#${first.i + 1}${items.length > 1 ? `–${items[items.length - 1].i + 1}` : ""}`;
        try {
          const audio = ELEVEN ? await elevenSpeak(first.line, story.cast, ekey) : await synth(items.map((q) => q.line), story.cast, keyList, state, slot);
          const base = wavOf(first.scene, first.i, first.line);
          writeFileSync(base + ".raw", audio.data);
          const whole = base + ".batch.wav";
          execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...(audio.wav ? [] : ["-f", "s16le", "-ar", String(SR), "-ac", "1"]), "-i", base + ".raw", "-ar", String(SR), "-ac", "1", "-c:a", "pcm_s16le", whole]);
          const parts = cuts(whole, items.map((q) => q.line), rates);
          if (!parts) {
            // Не нашли, где реплики кончаются, — эти реплики по одной, в начало очереди.
            console.log(`  ↺ ${tag}: паузы между репликами не нашлись — по одной`);
            queue.unshift(...items.map((q) => ({ items: [q], chars: q.line.text.length })));
            continue;
          }
          items.forEach(({ scene, line, i }, k) => {
            const tmp = wavOf(scene, i, line) + ".tmp.wav";
            const [from, to] = parts[k];
            execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", whole, "-ss", from.toFixed(3), "-to", to.toFixed(3), "-c:a", "pcm_s16le", tmp]);
            trimmed(tmp, wavOf(scene, i, line));
            console.log(`  ✓ ${scene.id}#${i + 1} ${line.who} ${seconds(wavOf(scene, i, line)).toFixed(1)} с${items.length > 1 ? ` (пачка ${tag})` : ""}`);
          });
        } catch (e) {
          if (e instanceof Exhausted) { state.stop = true; console.log("стоп: квоты кончились — продолжу со следующего запуска"); return; }
          console.log(`  ✗ ${tag}: ${e.message}`);
        }
        await new Promise((r) => setTimeout(r, ELEVEN ? 300 : 2500));
      }
    };
    await Promise.all(Array.from({ length: streams }, (_, slot) => worker(slot)));
  }

  // Сборка сцен: реплики с паузами → голос сцены → с музыкой в m4a.
  const timings = existsSync(timingsFile) ? JSON.parse(readFileSync(timingsFile, "utf8")) : {};
  let missing = 0;
  for (const scene of story.scenes) {
    const files = scene.lines.map((line, i) => wavOf(scene, i, line));
    const silentLines = files.map((f) => !existsSync(f));
    // Сцена без единого голоса тоже собирается: паузы по тексту под музыку.
    if (silentLines.some(Boolean)) missing++;
    const music = existsSync(musicFile(scene.mood)) ? musicFile(scene.mood) : null;
    const amb = scene.ambience && existsSync(ambienceFile(story.id, scene)) ? ambienceFile(story.id, scene) : null;
    // Хеш прежний, пока нет своей музыки и фона, — старые сцены не пересобираются зря.
    const hash = sha(music || amb ? [files, silentLines, music, amb] : [files, silentLines]);
    const m4a = join(out, `${scene.id}.m4a`);
    if (timings[scene.id]?.hash === hash && existsSync(m4a)) continue;
    const parts = [];
    const lines = [];
    let t = LEAD;
    const lead = join(cache, `gap-${LEAD}.wav`);
    silence(lead, LEAD);
    parts.push(lead);
    scene.lines.forEach((line, i) => {
      let file = files[i];
      if (silentLines[i]) {
        // Как в плеере (fallbackLine): по длине текста, не меньше 2,5 с.
        const want = Math.max(2.5, line.text.length / 14);
        file = join(cache, `silent-${want.toFixed(2)}.wav`);
        if (!existsSync(file)) silence(file, want);
      }
      const d = seconds(file);
      lines.push({ start: Math.round(t * 100) / 100, end: Math.round((t + d) * 100) / 100, ...(silentLines[i] ? { silent: true } : {}) });
      parts.push(file);
      t += d;
      const next = scene.lines[i + 1];
      const gap = (next ? (next.who === line.who ? GAP : TURN) : END) + (line.terms?.length ? TERMS_HOLD : 0);
      const g = join(cache, `gap-${gap.toFixed(2)}.wav`);
      if (!existsSync(g)) silence(g, gap);
      parts.push(g);
      t += gap;
    });
    const list = join(cache, `${scene.id}.txt`);
    writeFileSync(list, parts.map((p) => `file '${p}'`).join("\n"));
    const voice = join(cache, `${scene.id}-voice.wav`);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-c:a", "pcm_s16le", voice]);
    let bed = voice;
    if (amb) {
      // Фон сцены (дождь, офис, больница) — по кругу, на 22 LU тише голоса.
      bed = join(cache, `${scene.id}-voice-amb.wav`);
      const gain = lufs(voice) - 22 - lufs(amb);
      execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", voice, "-stream_loop", "-1", "-i", amb, "-filter_complex",
        `[1:a]aresample=${SR},aformat=channel_layouts=mono,volume=${gain.toFixed(2)}dB,afade=t=in:d=1.5[a];[0:a][a]amix=inputs=2:normalize=0:duration=first[out]`,
        "-map", "[out]", "-c:a", "pcm_s16le", bed]);
    }
    execFileSync("ffmpeg", mixArgs({ id: `${story.id}-${scene.id}`, wav: bed, out: m4a, ...(music ? { music } : {}) }));
    timings[scene.id] = { hash, duration: Math.round(seconds(m4a) * 100) / 100, lines };
    console.log(`сцена ${scene.id}: ${timings[scene.id].duration} с`);
  }
  writeFileSync(timingsFile, JSON.stringify(timings, null, 1) + "\n");
  const total = Object.values(timings).reduce((s, v) => s + v.duration, 0);
  console.log(`итого: ${(total / 60).toFixed(1)} мин; сцен с неозвученными репликами: ${missing}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
