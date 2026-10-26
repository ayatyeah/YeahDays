// Озвучка роликов-объяснений (ExplainerVideo) голосом Gemini — по одному
// запросу на ролик, диалог двумя голосами.
//
//   node scripts/video-tts.mjs projectManagement            — всё, что ещё не озвучено
//   node scripts/video-tts.mjs projectManagement pm-l4-p2-v1 — один ролик (заново)
//   node scripts/video-tts.mjs projectManagement --realign   — заново разметить реплики по WAV
//
// Ключи — по одному в строке в ~/.config/yeahgrind/gemini-keys (вне репозитория),
// иначе GOOGLE_GEMINI_API_SECRET из .env. На 429 переходим к следующему ключу,
// затем к следующей модели: у бесплатного тарифа маленькие суточные квоты.
//
// Что получается:
// - public/events/<папка>/video/<id>.m4a — звук для ленты: голос и фоновая
//   музыка (scripts/video-audio.mjs), AAC 64 кбит/с, моно;
// - ~/.cache/yg-video/wav/<id>.wav — без потерь, для рендера MP4;
// - src/lib/events/<ивент>/videos/audio.json — длительность и время начала
//   каждой реплики. Модель меток времени не даёт: границы реплик ищем по
//   паузам (ffmpeg silencedetect), ожидая их там, куда указывает длина текста.
//   Хеш сценария рядом — изменённый ролик озвучится заново.

import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { mixArgs } from "./video-audio.mjs";

const EVENT_DIR = process.argv[2] ?? "";
const ONLY = process.argv[3];
const PUBLIC_DIR = { projectManagement: "pm", computerNetworks: "cn" }[EVENT_DIR] ?? EVENT_DIR;
const SRC = join("src/lib/events", EVENT_DIR, "videos");
const OUT = join("public/events", PUBLIC_DIR, "video");
const WAV = join(homedir(), ".cache/yg-video/wav");
const TIMINGS = join(SRC, "audio.json");

/**
 * Модели по порядку; у каждой своя суточная квота на ключ. 2.5 — через
 * generateContent (диалог текстом «Имя: реплика»), 3.8 — через interactions
 * (говорящий — в разметке каждой реплики). Отдают сырой PCM или WAV.
 */
const MODELS = [
  { model: "gemini-2.5-flash-preview-tts", api: "generate" },
  { model: "gemini-2.5-pro-preview-tts", api: "generate" },
  { model: "gemini-3.8-flash-tts", api: "interactions" },
  { model: "gemini-3.8-flash-lite-tts", api: "interactions" },
];
/** Голос и метка говорящего для каждой роли (все роли — один маскот, голоса разные). */
const VOICES = {
  mentor: ["Mentor", "Charon"],
  student: ["Student", "Puck"],
  "scrum-master": ["Coach", "Achird"],
  "product-owner": ["Owner", "Orus"],
  developer: ["Developer", "Zubenelgenubi"],
  sponsor: ["Sponsor", "Algenib"],
  "functional-manager": ["Manager", "Iapetus"],
  customer: ["Customer", "Fenrir"],
  tester: ["Tester", "Sadachbia"],
  finance: ["Finance", "Schedar"],
};
const STYLE =
  "Озвучь диалог из короткого обучающего ролика в стиле TikTok: живо, дружелюбно, с интонацией, в хорошем темпе, по-русски. Английские термины и сокращения произноси по-английски.";

function keys() {
  const file = join(homedir(), ".config/yeahgrind/gemini-keys");
  const list = existsSync(file) ? readFileSync(file, "utf8").split(/\s+/).map((k) => k.trim()).filter(Boolean) : [];
  if (list.length) return list;
  const env = existsSync(".env") ? readFileSync(".env", "utf8") : "";
  const m = /^GOOGLE_GEMINI_API_SECRET\s*=\s*"?([^"\n]+)"?/m.exec(env);
  return m ? [m[1].trim()] : [];
}

async function loadVideos() {
  const out = [];
  for (const f of readdirSync(SRC).filter((f) => /^l\d+\.ts$/.test(f)).sort((a, b) => Number(a.slice(1, -3)) - Number(b.slice(1, -3)))) {
    const mod = await import(pathToFileURL(join(process.cwd(), SRC, f)).href);
    for (const list of Object.values(mod)) if (Array.isArray(list)) out.push(...list);
  }
  return out;
}

const hash = (v) => createHash("sha1").update(JSON.stringify([v.cast, v.lines.map((l) => [l.who, l.text])])).digest("hex").slice(0, 12);

function prompt(v) {
  const name = (who) => VOICES[v.cast[who]][0];
  return `${STYLE}\n${v.lines.map((l) => `${name(l.who)}: ${l.text}`).join("\n")}`;
}

class Exhausted extends Error {}

/** Тело запроса и адрес для модели: два API с разным форматом диалога. */
function request(v, spec) {
  const speaker = (who) => VOICES[v.cast[who]][0];
  const voice = (who) => VOICES[v.cast[who]][1];
  if (spec.api === "generate") {
    const speakers = ["A", "B"].map((who) => ({ speaker: speaker(who), voiceConfig: { prebuiltVoiceConfig: { voiceName: voice(who) } } }));
    return {
      url: `https://generativelanguage.googleapis.com/v1beta/models/${spec.model}:generateContent`,
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt(v) }] }], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { multiSpeakerVoiceConfig: { speakerVoiceConfigs: speakers } } } }),
    };
  }
  return {
    url: "https://generativelanguage.googleapis.com/v1beta/interactions",
    body: JSON.stringify({
      model: spec.model,
      input: [{ type: "user_input", content: v.lines.map((l) => ({ type: "text", text: l.text, annotations: [{ type: "speech_metadata", speaker: speaker(l.who) }] })) }],
      response_format: { type: "audio", mime_type: "audio/wav", sample_rate: 24000 },
      generation_config: { speech_config: ["A", "B"].map((who) => ({ speaker: speaker(who), voice: voice(who) })) },
    }),
  };
}

/** Звук из ответа: PCM (generateContent) или WAV (interactions). */
function audioOf(json) {
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (part) return { data: Buffer.from(part.inlineData.data, "base64"), wav: false };
  const audio = (json.steps ?? []).flatMap((s) => s.content ?? []).find((c) => c.type === "audio" && c.data);
  if (audio) return { data: Buffer.from(audio.data, "base64"), wav: /wav/i.test(audio.mime_type ?? "") };
  return null;
}

async function synth(v, keyList, state, prefer = 0) {
  // Свой ключ потока — первым, остальные — запасные.
  const order = keyList.map((_, i) => (prefer + i) % keyList.length);
  for (const spec of MODELS) {
    const { url, body } = request(v, spec);
    for (const k of order) {
      const tag = `${spec.model}#${k}`;
      if (state.dead.has(tag)) continue;
      let response;
      for (let attempt = 0; attempt < 4; attempt++) {
        response = await fetch(url, {
          method: "POST",
          headers: { "x-goog-api-key": keyList[k], "Content-Type": "application/json" },
          body,
          signal: AbortSignal.timeout(180_000),
        }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
        if (response.status !== 429) break;
        // 429 бывает от суточной квоты (ключ на сегодня всё) и от поминутного лимита (ждём).
        const text = await response.text();
        if (/PerDay/i.test(text) || attempt === 3) {
          state.dead.add(tag);
          console.log(`  квота ${tag} на сегодня кончилась`);
          response = null;
          break;
        }
        const wait = Number(/"retryDelay":\s*"(\d+)/.exec(text)?.[1] ?? 30);
        console.log(`  ${tag}: лимит в минуту, жду ${wait} с`);
        await new Promise((r) => setTimeout(r, (wait + 2) * 1000));
      }
      if (!response) continue;
      if (!response.ok) {
        console.log(`  ${tag}: ${response.status} ${(await response.text()).slice(0, 160)}`);
        continue;
      }
      const audio = audioOf(await response.json());
      if (!audio) {
        console.log(`  ${tag}: нет аудио в ответе`);
        continue;
      }
      return audio;
    }
  }
  throw new Exhausted("все ключи и модели исчерпаны");
}

/** Паузы в записи: [начало, конец] в секундах (ffmpeg пишет отчёт в stderr). */
export function silences(wav) {
  const log = spawnSync("ffmpeg", ["-hide_banner", "-i", wav, "-af", "silencedetect=noise=-35dB:d=0.12", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const out = [];
  const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  starts.forEach((s, i) => out.push([s, ends[i] ?? s]));
  return out;
}

/**
 * Разрезать отрезок [t0, t1] на куски по длинам текста, выбирая границы из
 * пауз. Динамическое программирование по всем вариантам: штраф — за то, что
 * скорость речи куска далека от средней, бонус — за длинную паузу на границе.
 * Пауз мало — граница по пропорции текста.
 */
function split(lengths, t0, t1, pauses, rate, bonus = 1) {
  const n = lengths.length;
  if (n === 1) return [];
  const cands = pauses.filter(([s, e]) => s > t0 + 0.25 && e < t1 - 0.25);
  const mid = ([s, e]) => (s + e) / 2;
  const pieceCost = (len, from, to) => {
    const want = len / rate;
    const d = (to - from - want) / Math.max(want, 1.2);
    return d * d * 6;
  };
  const m = cands.length;
  if (m < n - 1) {
    const total = lengths.reduce((a, b) => a + b, 0);
    let acc = 0;
    return lengths.slice(0, -1).map((len) => t0 + ((acc += len) / total) * (t1 - t0));
  }
  // dp[k][j]: первые k+1 кусков закончились на паузе j.
  const dp = Array.from({ length: n - 1 }, () => new Array(m).fill(Infinity));
  const from = Array.from({ length: n - 1 }, () => new Array(m).fill(-1));
  for (let j = 0; j < m; j++) dp[0][j] = pieceCost(lengths[0], t0, mid(cands[j])) - bonus * Math.min(cands[j][1] - cands[j][0], 0.8);
  for (let k = 1; k < n - 1; k++) {
    for (let j = k; j < m; j++) {
      for (let i = k - 1; i < j; i++) {
        if (dp[k - 1][i] === Infinity) continue;
        const c = dp[k - 1][i] + pieceCost(lengths[k], mid(cands[i]), mid(cands[j])) - bonus * Math.min(cands[j][1] - cands[j][0], 0.8);
        if (c < dp[k][j]) { dp[k][j] = c; from[k][j] = i; }
      }
    }
  }
  let best = Infinity, j = -1;
  for (let t = n - 2; t < m; t++) {
    const c = dp[n - 2][t] + pieceCost(lengths[n - 1], mid(cands[t]), t1);
    if (c < best) { best = c; j = t; }
  }
  const out = [];
  for (let k = n - 2; k >= 0; k--) { out.unshift(Math.max(t0, cands[j][1] - 0.05)); j = from[k][j]; }
  return out;
}

/**
 * Время начала каждой реплики. Сначала — границы между сменами говорящего
 * (там пауза и другой голос, бонус за паузу выше), потом реплики одного
 * говорящего внутри его хода — с его собственной скоростью речи.
 */
export function align(lengths, duration, pauses, who = lengths.map((_, i) => i)) {
  const n = lengths.length;
  if (n === 1) return [0];
  const lead = pauses.length && pauses[0][0] < 0.05 ? pauses[0][1] : 0;
  const tail = pauses.length && pauses[pauses.length - 1][1] > duration - 0.05 ? pauses[pauses.length - 1][0] : duration;
  const rate = lengths.reduce((a, b) => a + b, 0) / Math.max(1, tail - lead);
  const turns = [];
  for (let k = 0; k < n; k++) if (k === 0 || who[k] !== who[k - 1]) turns.push(k);
  const turnLen = turns.map((first, t) => lengths.slice(first, turns[t + 1] ?? n).reduce((a, b) => a + b, 0));
  const turnStarts = [lead, ...split(turnLen, lead, tail, pauses, rate, 1.5)];
  const startOf = new Array(n).fill(0);
  turns.forEach((first, t) => {
    const last = (turns[t + 1] ?? n) - 1;
    const t0 = turnStarts[t];
    const t1 = turnStarts[t + 1] ?? tail;
    startOf[first] = t === 0 ? 0 : t0;
    if (last === first) return;
    const lens = lengths.slice(first, last + 1);
    const local = lens.reduce((a, b) => a + b, 0) / Math.max(0.5, t1 - t0);
    split(lens, t0, t1, pauses, local, 0.6).forEach((at, i) => { startOf[first + 1 + i] = at; });
  });
  for (let k = 1; k < n; k++) if (startOf[k] <= startOf[k - 1]) startOf[k] = startOf[k - 1] + 0.3;
  return startOf;
}

/** Переразметить уже озвученные ролики (алгоритм поменялся, WAV лежат в кэше). */
async function realign() {
  const timings = JSON.parse(readFileSync(TIMINGS, "utf8"));
  for (const v of await loadVideos()) {
    const wav = join(WAV, `${v.id}.wav`);
    if (!timings[v.id] || !existsSync(wav)) continue;
    timings[v.id].starts = align(v.lines.map((l) => l.text.length), timings[v.id].duration, silences(wav), v.lines.map((l) => l.who)).map((t) => Math.round(t * 100) / 100);
  }
  writeFileSync(TIMINGS, JSON.stringify(timings, null, 1) + "\n");
  console.log("переразмечено");
}

async function main() {
  if (!EVENT_DIR) throw new Error("укажи папку ивента: node scripts/video-tts.mjs projectManagement [id]");
  if (ONLY === "--realign") return realign();
  const keyList = keys();
  if (!keyList.length) throw new Error("нет ключей Gemini: положи их в ~/.config/yeahgrind/gemini-keys");
  mkdirSync(OUT, { recursive: true });
  mkdirSync(WAV, { recursive: true });
  const timings = existsSync(TIMINGS) ? JSON.parse(readFileSync(TIMINGS, "utf8")) : {};
  const videos = (await loadVideos()).filter((v) => !ONLY || v.id === ONLY);
  const state = { dead: new Set(), stop: false };
  let done = 0;
  const queue = videos.filter((v) => ONLY || !(timings[v.id]?.hash === hash(v) && existsSync(join(OUT, `${v.id}.m4a`))));
  console.log(`к озвучке: ${queue.length}, потоков: ${keyList.length}`);
  const worker = async (slot) => {
    for (let v = queue.shift(); v && !state.stop; v = queue.shift()) {
      console.log(`${v.id} (${v.lines.length} реплик) — поток ${slot + 1}…`);
      let audio;
      try {
        audio = await synth(v, keyList, state, slot);
      } catch (e) {
        if (e instanceof Exhausted) { state.stop = true; console.log("стоп: квоты кончились — продолжу со следующего запуска"); return; }
        console.log(`  ${v.id}: ✗ ${e.message}`);
        continue;
      }
      const raw = join(WAV, `${v.id}.pcm`), wav = join(WAV, `${v.id}.wav`), m4a = join(OUT, `${v.id}.m4a`);
      writeFileSync(raw, audio.data);
      // WAV приводим к тому же виду, что и сырой PCM: 24 кГц, моно, 16 бит.
      execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...(audio.wav ? [] : ["-f", "s16le", "-ar", "24000", "-ac", "1"]), "-i", raw, "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", wav]);
      execFileSync("ffmpeg", mixArgs({ id: v.id, wav, out: m4a }));
      const duration = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav], { encoding: "utf8" }).trim());
      const starts = align(v.lines.map((l) => l.text.length), duration, silences(wav), v.lines.map((l) => l.who)).map((t) => Math.round(t * 100) / 100);
      // Перечитать файл перед записью: другие потоки уже могли дописать свои ролики.
      const latest = existsSync(TIMINGS) ? JSON.parse(readFileSync(TIMINGS, "utf8")) : {};
      latest[v.id] = { hash: hash(v), duration: Math.round(duration * 100) / 100, starts };
      writeFileSync(TIMINGS, JSON.stringify(latest, null, 1) + "\n");
      Object.assign(timings, latest);
      done++;
      console.log(`  ✓ ${v.id} ${duration.toFixed(1)} с`);
      await new Promise((r) => setTimeout(r, 4000));
    }
  };
  await Promise.all(keyList.map((_, slot) => worker(slot)));
  const missing = (await loadVideos()).filter((v) => !timings[v.id] || timings[v.id].hash !== hash(v));
  console.log(`озвучено сейчас: ${done}; без озвучки осталось: ${missing.length}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
