// Озвучка «Историй» голосами Gemini — по запросу на реплику, у каждого
// героя свой голос.
//
//   node scripts/story-tts.mjs pmLecture4          — озвучить, чего ещё нет, и собрать сцены
//   node scripts/story-tts.mjs pmLecture4 --mix    — только пересобрать сцены из готовых WAV
//
// Почему по реплике, а не диалогом, как в роликах (video-tts.mjs): в сцене
// бывает четыре героя и рассказчик, а модель держит не больше двух голосов
// за запрос. Заодно время каждой реплики известно точно — его не надо искать
// по паузам, и субтитры, кадр и карточки терминов меняются ровно с голосом.
//
// Ключи и модели — как в video-tts.mjs: ~/.config/yeahgrind/gemini-keys, на
// 429 следующий ключ, потом следующая модель.
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
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { mixArgs } from "./video-audio.mjs";

const FILE = process.argv[2] ?? "";
const MIX_ONLY = process.argv.includes("--mix");

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

function request(text, who, voice, spec) {
  if (spec.api === "generate") {
    return {
      url: `https://generativelanguage.googleapis.com/v1beta/models/${spec.model}:generateContent`,
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Произнеси по-русски ${TONE[who] ?? "естественно"}; английские термины и сокращения — по-английски: ${text}` }] }],
        generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
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
      generation_config: { speech_config: [{ voice }] },
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

async function synth(text, who, voice, keyList, state, prefer) {
  const order = keyList.map((_, i) => (prefer + i) % keyList.length);
  for (const spec of MODELS) {
    const { url, body } = request(text, who, voice, spec);
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

  const wavOf = (scene, i, line) => join(cache, `${scene.id}-${i}-${sha([line.who, story.cast[line.who].voice, line.text])}.wav`);

  if (!MIX_ONLY) {
    const keyList = keys();
    if (!keyList.length) throw new Error("нет ключей Gemini: положи их в ~/.config/yeahgrind/gemini-keys");
    const queue = story.scenes.flatMap((scene) => scene.lines.map((line, i) => ({ scene, line, i }))).filter((q) => !existsSync(wavOf(q.scene, q.i, q.line)));
    console.log(`реплик к озвучке: ${queue.length}, потоков: ${keyList.length}`);
    const state = { dead: new Set(), stop: false };
    const worker = async (slot) => {
      for (let q = queue.shift(); q && !state.stop; q = queue.shift()) {
        const { scene, line, i } = q;
        try {
          const audio = await synth(line.text, line.who, story.cast[line.who].voice, keyList, state, slot);
          const raw = wavOf(scene, i, line) + ".raw";
          writeFileSync(raw, audio.data);
          const tmp = wavOf(scene, i, line) + ".tmp.wav";
          execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...(audio.wav ? [] : ["-f", "s16le", "-ar", String(SR), "-ac", "1"]), "-i", raw, "-ar", String(SR), "-ac", "1", "-c:a", "pcm_s16le", tmp]);
          trimmed(tmp, wavOf(scene, i, line));
          console.log(`  ✓ ${scene.id}#${i + 1} ${line.who} ${seconds(wavOf(scene, i, line)).toFixed(1)} с`);
        } catch (e) {
          if (e instanceof Exhausted) { state.stop = true; console.log("стоп: квоты кончились — продолжу со следующего запуска"); return; }
          console.log(`  ✗ ${scene.id}#${i + 1}: ${e.message}`);
        }
        await new Promise((r) => setTimeout(r, 2500));
      }
    };
    await Promise.all(keyList.map((_, slot) => worker(slot)));
  }

  // Сборка сцен: реплики с паузами → голос сцены → с музыкой в m4a.
  const timings = existsSync(timingsFile) ? JSON.parse(readFileSync(timingsFile, "utf8")) : {};
  let missing = 0;
  for (const scene of story.scenes) {
    const files = scene.lines.map((line, i) => wavOf(scene, i, line));
    const silentLines = files.map((f) => !existsSync(f));
    if (silentLines.some(Boolean)) missing++;
    if (silentLines.every(Boolean)) continue;
    const hash = sha([files, silentLines]);
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
    execFileSync("ffmpeg", mixArgs({ id: `${story.id}-${scene.id}`, wav: voice, out: m4a }));
    timings[scene.id] = { hash, duration: Math.round(seconds(m4a) * 100) / 100, lines };
    console.log(`сцена ${scene.id}: ${timings[scene.id].duration} с`);
  }
  writeFileSync(timingsFile, JSON.stringify(timings, null, 1) + "\n");
  const total = Object.values(timings).reduce((s, v) => s + v.duration, 0);
  console.log(`итого: ${(total / 60).toFixed(1)} мин; сцен с неозвученными репликами: ${missing}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
