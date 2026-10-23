/**
 * Короткие видео по юнитам (docs/diploma-en, раздел 7.8).
 *
 * Запрос возвращает уже готовое видео той же версии юнита и языка (FR-22)
 * или ставит задачу и сразу отвечает 202 (FR-20). Задача: сценарий →
 * проверка схемы и ссылок → сверка каждого предложения с абзацем юнита →
 * озвучка Gemini одной дорожкой → субтитры WebVTT по длительностям сцен.
 * Сценарий с замечаниями сверки получает статус needs_review и не
 * озвучивается, пока владелец цели не посмотрит его (FR-21).
 *
 * Отдельного воркера нет: задача выполняется в том же Node-процессе после
 * ответа (after()). Если процесс перезапустился посреди работы, следующий
 * запрос статуса видит зависшую задачу и запускает её снова — до трёх
 * попыток, потом failed с понятной причиной.
 */

import { Prisma, type PathVideo } from "@prisma/client";
import { prisma } from "@/lib/db";
import { dailyLimit } from "@/lib/aiLimit";
import { generateScript, PathAiError, verifyScript } from "./ai";
import { membership, PathError } from "./service";
import { speak, ttsAvailable, TtsError } from "./tts";
import { paragraphs, words, type VideoScript } from "./validate";

export const MAX_ATTEMPTS = 3;
/** Между «пульсами» задачи (сценарий, сверка, озвучка) проходит не больше нескольких минут. */
const STALE_MS = 10 * 60_000;
const QUEUED_STALE_MS = 15_000;

export interface StoredScript extends VideoScript {
  /** длительность озвучки каждой сцены, секунд */
  seconds?: number[];
  /** владелец посмотрел сценарий с замечаниями и разрешил озвучить */
  approved?: boolean;
}

/** Казахская озвучка включается только после проверки носителем языка (FR-23). */
export const narrationLanguage = (language: string) => language !== "kk" || process.env.VIDEO_KK === "1";

/** Чужой и несуществующий объект неразличимы: одна и та же 404. */
async function memberOr404(userId: string, goalId: string, notFound: string) {
  try {
    return await membership(userId, goalId);
  } catch (error) {
    if (error instanceof PathError && error.status === 404) throw new PathError(notFound, 404);
    throw error;
  }
}

async function unitFor(userId: string, unitId: string) {
  const unit = await prisma.pathUnit.findUnique({ where: { id: unitId } });
  if (!unit) throw new PathError("Юнит не найден", 404);
  const member = await memberOr404(userId, unit.goalId, "Юнит не найден");
  return { unit, member };
}

/** Видео юнита: готовое отдаём сразу (FR-22), иначе ставим задачу; запускает её роут после ответа. */
export async function requestVideo(userId: string, unitId: string, rewrite = false) {
  const { unit, member } = await unitFor(userId, unitId);
  if (unit.status !== "ready") throw new PathError("Сначала откроется юнит — видео строится по его тексту", 409);
  const language = member.goal.language;
  if (!narrationLanguage(language)) throw new PathError("Казахская озвучка включится после проверки носителем языка", 409);
  if (!ttsAvailable()) throw new PathError("Озвучка пока не подключена на сервере", 503);
  const key = { unitId_unitVersion_language: { unitId, unitVersion: unit.version, language } };
  const existing = await prisma.pathVideo.findUnique({ where: key });
  // Упавшее видео можно запросить снова; сценарий «на проверке» владелец может заказать заново.
  const again = existing && (existing.status === "failed" || (rewrite && existing.status === "needs_review" && member.role === "owner"));
  if (existing && !again) return { video: existing, created: false };
  if (!(await dailyLimit(`path:video:${userId}`, 5)) || !(await dailyLimit("path:video:global", 200))) throw new PathError("На сегодня лимит новых видео исчерпан — посмотри готовые или вернись завтра", 429);
  const video = existing
    ? await prisma.pathVideo.update({ where: { id: existing.id }, data: { status: "queued", attempts: 0, error: "", issues: [], script: Prisma.DbNull, createdBy: userId } })
    : await prisma.pathVideo.upsert({ where: key, create: { unitId, unitVersion: unit.version, language, createdBy: userId }, update: {} });
  return { video, created: true };
}

/** Статус для экрана; зависшую или забытую задачу помечает к перезапуску (kick = true). */
export async function videoStatus(userId: string, videoId: string) {
  const video = await prisma.pathVideo.findUnique({ where: { id: videoId }, include: { unit: { select: { goalId: true, body: true, title: true } }, clips: { select: { idx: true, seconds: true }, orderBy: { idx: "asc" } } } });
  if (!video) throw new PathError("Видео не найдено", 404);
  const member = await memberOr404(userId, video.unit.goalId, "Видео не найдено");
  const now = Date.now();
  const kick =
    (video.status === "queued" && now - video.updatedAt.getTime() > QUEUED_STALE_MS) ||
    (video.status === "running" && !!video.startedAt && now - video.startedAt.getTime() > STALE_MS);
  const script = (video.script ?? null) as StoredScript | null;
  const visible = video.status === "succeeded" || (video.status === "needs_review" && member.role === "owner");
  return {
    kick,
    view: {
      id: video.id,
      unitId: video.unitId,
      status: video.status,
      error: video.error,
      issues: member.role === "owner" ? video.issues : [],
      attempts: video.attempts,
      seconds: video.seconds,
      language: video.language,
      canApprove: member.role === "owner" && video.status === "needs_review",
      script: visible && script ? { title: script.title, scenes: script.scenes } : null,
      cues: video.status === "succeeded" && script ? cues(script) : [],
      sceneStarts: video.status === "succeeded" && script?.seconds ? script.seconds.map((_, i) => script.seconds!.slice(0, i).reduce((a, b) => a + b, 0)) : [],
      clips: video.status === "succeeded" ? video.clips.map((c) => ({ idx: c.idx, seconds: c.seconds, src: `/api/path/videos/${video.id}/clips/${c.idx}` })) : [],
      sources: visible ? paragraphs(video.unit.body) : [],
    },
  };
}

/** Владелец посмотрел сценарий с замечаниями и разрешает озвучку. */
export async function approveVideo(userId: string, videoId: string) {
  const video = await prisma.pathVideo.findUnique({ where: { id: videoId }, include: { unit: { select: { goalId: true } } } });
  if (!video) throw new PathError("Видео не найдено", 404);
  const member = await memberOr404(userId, video.unit.goalId, "Видео не найдено");
  if (member.role !== "owner") throw new PathError("Это может только владелец цели", 403);
  if (video.status !== "needs_review" || !video.script) throw new PathError("Видео не ждёт проверки", 409);
  await prisma.pathVideo.update({ where: { id: videoId }, data: { status: "queued", attempts: 0, script: { ...(video.script as object), approved: true } as Prisma.InputJsonValue } });
}

const errorText = (error: unknown) =>
  error instanceof PathAiError || error instanceof PathError ? error.message : error instanceof TtsError ? "Не удалось озвучить сценарий" : "Внутренняя ошибка при сборке видео";

class LostClaim extends Error {}

/**
 * Захват задачи. startedAt служит токеном: «пульс» между шагами продлевает
 * его, а все итоговые записи проходят, только пока захват наш. Если задачу
 * сочли зависшей и перехватили, старый исполнитель тихо выходит.
 */
function claimOf(videoId: string, startedAt: Date) {
  let token = startedAt;
  return {
    get token() {
      return token;
    },
    async beat() {
      const next = new Date();
      const moved = await prisma.pathVideo.updateMany({ where: { id: videoId, status: "running", startedAt: token }, data: { startedAt: next } });
      if (!moved.count) throw new LostClaim();
      token = next;
    },
  };
}
type Claim = ReturnType<typeof claimOf>;

/**
 * Выполнить задачу. Захват через updateMany — две параллельные попытки не
 * пройдут обе; попытки считаются здесь же.
 */
export async function runVideo(videoId: string) {
  const staleBefore = new Date(Date.now() - STALE_MS);
  const claimedAt = new Date();
  const claim = await prisma.pathVideo.updateMany({
    where: { id: videoId, attempts: { lt: MAX_ATTEMPTS }, OR: [{ status: "queued" }, { status: "running", startedAt: { lt: staleBefore } }] },
    data: { status: "running", startedAt: claimedAt, attempts: { increment: 1 } },
  });
  if (!claim.count) {
    await prisma.pathVideo.updateMany({ where: { id: videoId, attempts: { gte: MAX_ATTEMPTS }, status: { in: ["queued", "running"] }, OR: [{ status: "queued" }, { startedAt: { lt: staleBefore } }] }, data: { status: "failed", error: "Не получилось за три попытки. Попробуй позже." } });
    return;
  }
  const video = (await prisma.pathVideo.findUnique({ where: { id: videoId }, include: { unit: true } }))!;
  const job = claimOf(videoId, claimedAt);
  try {
    await build(video as PathVideo & { unit: { body: string; title: string; goalId: string } }, job);
  } catch (error) {
    if (error instanceof LostClaim) return;
    const fresh = await prisma.pathVideo.findUnique({ where: { id: videoId }, select: { attempts: true } });
    const final = (fresh?.attempts ?? MAX_ATTEMPTS) >= MAX_ATTEMPTS || error instanceof PathError;
    const marked = await prisma.pathVideo.updateMany({ where: { id: videoId, status: "running", startedAt: job.token }, data: { status: final ? "failed" : "queued", error: errorText(error) } });
    if (marked.count && !final) {
      await new Promise((r) => setTimeout(r, 3000 * (fresh?.attempts ?? 1)));
      await runVideo(videoId);
    }
  }
}

async function build(video: PathVideo & { unit: { body: string; title: string; goalId: string } }, job: Claim) {
  const goal = await prisma.pathGoal.findUniqueOrThrow({ where: { id: video.unit.goalId }, select: { level: true } });
  const parts = paragraphs(video.unit.body);
  const stored = (video.script ?? null) as StoredScript | null;
  let script: StoredScript;
  if (stored?.approved) {
    script = stored;
  } else {
    script = await generateScript({ title: video.unit.title, paragraphs: parts, language: video.language, level: goal.level });
    await job.beat();
    const issues = await verifyScript(script, parts, video.language);
    await job.beat();
    if (issues.length) {
      await prisma.pathVideo.updateMany({ where: { id: video.id, status: "running", startedAt: job.token }, data: { status: "needs_review", script: script as unknown as Prisma.InputJsonValue, issues, error: "" } });
      return;
    }
  }
  // Весь сценарий — одним запросом озвучки (квоты TTS считаются по запросам); границы
  // сцен делим по числу слов: темп речи ровный, расхождение — доли секунды.
  const speech = await speak(script.scenes.map((sc) => sc.sentences.map((x) => x.text).join(" ")).join("\n\n"), video.language);
  const seconds = sceneSeconds(script, speech.seconds);
  await prisma.$transaction(async (tx) => {
    const done = await tx.pathVideo.updateMany({ where: { id: video.id, status: "running", startedAt: job.token }, data: { status: "succeeded", script: { ...script, seconds } as unknown as Prisma.InputJsonValue, seconds: speech.seconds, issues: [], error: "" } });
    if (!done.count) throw new LostClaim();
    await tx.pathVideoClip.deleteMany({ where: { videoId: video.id } });
    await tx.pathVideoClip.create({ data: { videoId: video.id, idx: 0, mime: speech.mime, seconds: speech.seconds, data: new Uint8Array(speech.data) } });
    await tx.pathEvent.create({ data: { goalId: video.unit.goalId, userId: video.createdBy, kind: "video_ready", title: video.unit.title } });
  });
}

/** Длительность каждой сцены: общая длина озвучки пропорционально словам сцены. */
export function sceneSeconds(script: VideoScript, total: number) {
  const counts = script.scenes.map((sc) => sc.sentences.reduce((n, x) => n + Math.max(1, words(x.text)), 0));
  const sum = counts.reduce((a, b) => a + b, 0) || 1;
  return counts.map((c) => Math.round(((total * c) / sum) * 100) / 100);
}

const stamp = (t: number) => {
  const ms = Math.max(0, Math.round(t * 1000));
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;
};

export interface Cue {
  scene: number;
  start: number;
  end: number;
  text: string;
  /** абзац юнита, на который опирается предложение */
  ref: number;
}

/**
 * Раскладка по времени: сцены идут подряд по своим длительностям, внутри
 * сцены время делится между предложениями пропорционально их длине в словах.
 * Одна функция и для WebVTT, и для титров в плеере.
 */
export function cues(script: StoredScript): Cue[] {
  const out: Cue[] = [];
  let start = 0;
  script.scenes.forEach((scene, i) => {
    const total = script.seconds?.[i] ?? 0;
    const counts = scene.sentences.map((s) => Math.max(1, words(s.text)));
    const sum = counts.reduce((a, b) => a + b, 0);
    let t = start;
    scene.sentences.forEach((s, j) => {
      const end = t + (total * counts[j]) / sum;
      out.push({ scene: i, start: t, end, text: s.text, ref: s.ref });
      t = end;
    });
    start += total;
  });
  return out;
}

/** Субтитры WebVTT (FR-19). */
export function captions(script: StoredScript) {
  const lines = ["WEBVTT", ""];
  cues(script).forEach((c, i) => lines.push(String(i + 1), `${stamp(c.start)} --> ${stamp(c.end)}`, c.text.replace(/-->/g, "→"), ""));
  return lines.join("\n");
}

export async function captionsFor(userId: string, videoId: string) {
  const video = await prisma.pathVideo.findUnique({ where: { id: videoId }, include: { unit: { select: { goalId: true } } } });
  if (!video || video.status !== "succeeded" || !video.script) throw new PathError("Видео не найдено", 404);
  await memberOr404(userId, video.unit.goalId, "Видео не найдено");
  return captions(video.script as unknown as StoredScript);
}

export async function clipFor(userId: string, videoId: string, idx: number) {
  const clip = await prisma.pathVideoClip.findUnique({ where: { videoId_idx: { videoId, idx } }, include: { video: { select: { status: true, unit: { select: { goalId: true } } } } } });
  if (!clip || clip.video.status !== "succeeded") throw new PathError("Клип не найден", 404);
  await memberOr404(userId, clip.video.unit.goalId, "Клип не найден");
  return { data: Buffer.from(clip.data), mime: clip.mime };
}
