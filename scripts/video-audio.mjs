// Звук роликов-объяснений: голос + фоновая музыка.
//
// Голос (WAV из scripts/video-tts.mjs) выравнивается по громкости — ролики
// озвучивали разные модели, и разброс был до 5 дБ. Музыка
// (scripts/video-music.py, петля 96 с) идёт на MUSIC_BELOW дБ тише голоса и
// под речью ещё приседает (сайдчейн по голосу), в паузах — громче. Каждый
// ролик начинает трек со своей фразы (смещение по id), конец — плавное
// затухание через TAIL с после последней реплики: плеер ждёт столько же.
//
// mixArgs — аргументы ffmpeg; используются при озвучке (m4a для приложения,
// моно) и при рендере MP4 (стерео, громче битрейт).

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const MUSIC = join(homedir(), ".cache/yg-video/music.wav");
/** Голос — к этой громкости (LUFS). */
const VOICE_LUFS = -16;
/** Музыка тише голоса на столько дБ (до приседания под речью). */
const MUSIC_BELOW = 6;
/** Громкость треков, LUFS, по пути файла (scripts/video-music.py выдаёт ≈ −11). */
const musicLufs = new Map();
/** Тишина после последней реплики, с: в неё музыка затухает. Плеер заканчивает ролик через столько же. */
export const TAIL = 0.6;
/** Фраза трека — 4 такта по 3 с; ролик начинается с начала одной из восьми. */
const PHRASE = 12;

export function lufs(file) {
  const log = spawnSync("ffmpeg", ["-hide_banner", "-i", file, "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const all = [...log.matchAll(/^\s+I:\s+(-?[\d.]+) LUFS/gm)];
  if (!all.length) throw new Error(`не измерить громкость: ${file}`);
  return Number(all[all.length - 1][1]);
}

function seconds(file) {
  const out = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" }).stdout;
  return Number(out.trim());
}

function offset(id) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (h % 8) * PHRASE;
}

/**
 * Аргументы ffmpeg: голос `wav` + музыка → `out`.
 * stereo — для MP4 (AAC 160 кбит/с), иначе моно для приложения (64 кбит/с).
 * Если трека нет (не запускали video-music.py) — только голос.
 */
export function mixArgs({ id, wav, out, stereo = false, extraInputs = [], extraMaps = [], music = MUSIC }) {
  const voiceGain = VOICE_LUFS - lufs(wav);
  const end = seconds(wav) + TAIL;
  const layout = stereo ? "stereo" : "mono";
  const codec = ["-c:a", "aac", "-b:a", stereo ? "160k" : "64k", "-ar", "44100"];
  if (!existsSync(music)) {
    return ["-loglevel", "error", "-y", ...extraInputs, "-i", wav,
      "-filter_complex", `[${extraInputs.length / 2}:a]aresample=44100,aformat=channel_layouts=${layout},volume=${voiceGain.toFixed(2)}dB,apad=pad_dur=${TAIL},alimiter=limit=0.95[out]`,
      ...extraMaps, "-map", "[out]", ...codec, "-movflags", "+faststart", out];
  }
  if (!musicLufs.has(music)) musicLufs.set(music, lufs(music));
  const musicGain = VOICE_LUFS - MUSIC_BELOW - musicLufs.get(music);
  // Общий трек начинается с фразы по id; свой (story-sound.mjs) короче — с начала первых двух третей.
  const start = music === MUSIC ? offset(id) : offset(id) % Math.max(1, Math.floor(seconds(music) * 0.66));
  const v = extraInputs.length / 2; // номер входа с голосом (до него — видео при рендере)
  const graph = [
    `[${v}:a]aresample=44100,aformat=channel_layouts=${layout},volume=${voiceGain.toFixed(2)}dB,apad=pad_dur=${TAIL},asplit=2[voice][key]`,
    `[${v + 1}:a]aformat=channel_layouts=${layout},volume=${musicGain.toFixed(2)}dB,atrim=0:${end.toFixed(3)},afade=t=in:d=0.8,afade=t=out:st=${Math.max(0, end - 1.4).toFixed(3)}:d=1.4[bed]`,
    // Под речью музыка приседает на ~5 дБ, в паузах за полсекунды возвращается.
    `[bed][key]sidechaincompress=threshold=0.06:ratio=2:attack=25:release=500:knee=3[ducked]`,
    `[voice][ducked]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[out]`,
  ].join(";");
  return ["-loglevel", "error", "-y", ...extraInputs, "-i", wav, "-stream_loop", "-1", "-ss", String(start), "-i", music,
    "-filter_complex", graph, ...extraMaps, "-map", "[out]", ...codec, "-movflags", "+faststart", out];
}
