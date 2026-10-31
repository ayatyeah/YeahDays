"use client";

import { useEffect, useRef } from "react";
import { rigSrc, sceneLipsync, storyRig } from "@/lib/stories";
import type { RigBox, RigSprite, Story, StoryRig, StoryScene } from "@/lib/stories/types";

/**
 * Перекладка «Историй»: сцена собирается на холсте WebGL из фона без людей
 * и героев-спрайтов (scripts/story-rig.py), и плеер их оживляет:
 *
 * - спрайт — сетка, которую гнёт вершинный шейдер: голова наклоняется вокруг
 *   шеи, корпус покачивается от ступней, грудь дышит — как в Live2D, но из
 *   одной картинки;
 * - рот открывается в такт голосу (scripts/story-lipsync.mjs), глаза моргают —
 *   заплатки поверх спрайта, вырезанные из правок Codex;
 * - позы сменяются с подскоком, герои переходят с места на место;
 * - камера режет планы по репликам (общий, средний, крупный), медленно
 *   наезжает, фон на крупном плане размывается и сдвигается медленнее героев;
 * - эффекты: свечение посоха, искры, пылинки в воздухе, видение в круге,
 *   тряска и «щелчок» — герой рассыпается золотой пылью.
 *
 * Всё — функция времени сцены t: пауза замораживает кадр, перемотка
 * и покадровый рендер в видео (window.__storyStage.draw) дают тот же кадр.
 * Пока картинки грузятся или если WebGL 2 нет — под холстом видны обычные кадры.
 */

type Timing = { duration: number; lines: { start: number; end: number }[] };
type Tex = { tex: WebGLTexture; w: number; h: number };
type Vec = [number, number];

const LIPS_FPS = 30;
const POSE_FADE = 0.22;
const MOVE_TIME = 1.1;
const SNAP_DELAY = 1.2;
const SNAP_TIME = 4.2;
const DUST_LIFE = 2.6;
const ASSEMBLE_TIME = 2.4;
const VANISH_TIME = 2.6;
const HIT_DELAY = 0.12;
const NOISE = 32;

/* ---------- шейдеры ---------- */

const SPRITE_VS = `#version 300 es
in vec2 a_uv;
uniform vec4 u_cam;
uniform vec2 u_pos, u_size, u_foot, u_neck;
uniform float u_flip, u_head, u_lean, u_breath, u_squash;
out vec2 v_uv;
vec2 rot(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
void main() {
  v_uv = a_uv;
  vec2 p = (a_uv - u_foot) * u_size;
  vec2 n = (u_neck - u_foot) * u_size;
  float up = n.y < -1.0 ? clamp(p.y / n.y, 0.0, 1.6) : 0.0;
  p.y -= u_breath * u_size.y * 0.004 * smoothstep(0.45, 1.0, up);
  p.x *= 1.0 + u_breath * 0.006 * smoothstep(0.5, 0.75, up) * (1.0 - smoothstep(0.8, 1.0, up));
  p = n + rot(p - n, u_head * smoothstep(0.9, 1.06, up));
  p = rot(p, u_lean * smoothstep(0.0, 1.0, up));
  p.y *= 1.0 - u_squash;
  p.x *= 1.0 + u_squash * 0.6;
  p.x *= u_flip;
  vec2 w = u_pos + p;
  gl_Position = vec4((w.x - u_cam.x) * u_cam.z, -(w.y - u_cam.y) * u_cam.w, 0.0, 1.0);
}`;

const SPRITE_FS = `#version 300 es
precision mediump float;
uniform sampler2D u_tex, u_mouthTex, u_blinkTex, u_noise;
uniform vec4 u_mouthRect, u_blinkRect;
uniform float u_mouth, u_blink, u_alpha, u_dissolve, u_dir;
uniform vec3 u_tint;
in vec2 v_uv;
out vec4 o;
vec4 overlay(vec4 col, sampler2D t, vec4 r, float k) {
  vec2 q = (v_uv - r.xy) / r.zw;
  if (k <= 0.0 || q.x < 0.0 || q.y < 0.0 || q.x > 1.0 || q.y > 1.0) return col;
  vec4 m = texture(t, q);
  return vec4(col.rgb * (1.0 - k * m.a) + m.rgb * k, col.a);
}
void main() {
  vec4 col = texture(u_tex, v_uv);
  col = overlay(col, u_mouthTex, u_mouthRect, u_mouth);
  col = overlay(col, u_blinkTex, u_blinkRect, u_blink);
  if (u_dissolve > 0.0) {
    float n = 0.7 * texture(u_noise, v_uv * vec2(1.0, 1.5)).r + 0.3 * texture(u_noise, v_uv * vec2(5.0, 7.5)).r;
    float e = (0.62 * n + 0.38 * (u_dir > 0.0 ? 1.0 - v_uv.y : v_uv.y)) - (u_dissolve * 1.15 - 0.08);
    if (e < 0.0) discard;
    col.rgb = mix(col.rgb, vec3(1.0, 0.82, 0.42) * 1.8 * col.a, 1.0 - smoothstep(0.0, 0.09, e));
  }
  o = vec4(col.rgb * u_tint, col.a) * u_alpha;
}`;

const DOT_VS = `#version 300 es
in vec2 a_pos;
in float a_size;
in vec4 a_col;
uniform vec4 u_cam;
uniform float u_px;
out vec4 v_col;
out float v_square;
void main() {
  v_col = a_col;
  v_square = a_size < 0.0 ? 1.0 : 0.0;
  gl_Position = vec4((a_pos.x - u_cam.x) * u_cam.z, -(a_pos.y - u_cam.y) * u_cam.w, 0.0, 1.0);
  gl_PointSize = max(1.0, abs(a_size) * u_px);
}`;

const DOT_FS = `#version 300 es
precision mediump float;
in vec4 v_col;
in float v_square;
out vec4 o;
void main() {
  vec2 q = abs(gl_PointCoord - 0.5) * 2.0;
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = (v_square > 0.5 ? 1.0 - smoothstep(0.85, 1.0, max(q.x, q.y)) : pow(max(0.0, 1.0 - d), 1.6)) * v_col.a;
  o = vec4(v_col.rgb * a, a);
}`;

/* ---------- случайность и шум, одинаковые в JS и шейдере ---------- */

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hash = (s: string) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);

const NOISE_DATA = (() => {
  const r = rng(7);
  return Uint8Array.from({ length: NOISE * NOISE }, () => Math.floor(r() * 256));
})();

/** Как texture() с LINEAR и REPEAT по шумовой текстуре — для пыли «щелчка» там же, где шейдер стирает героя. */
function noiseAt(u: number, v: number) {
  const x = u * NOISE - 0.5;
  const y = v * NOISE - 0.5;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const at = (i: number, j: number) => NOISE_DATA[(((j % NOISE) + NOISE) % NOISE) * NOISE + (((i % NOISE) + NOISE) % NOISE)] / 255;
  return (at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx) * (1 - fy) + (at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx) * fy;
}
/** Порядок растворения точки спрайта: dir 1 — снизу вверх тает («щелчок»), −1 — снизу вверх собирается. */
const dissolveKey = (u: number, v: number, dir = 1) => 0.62 * (0.7 * noiseAt(u, v * 1.5) + 0.3 * noiseAt(u * 5, v * 7.5)) + 0.38 * (dir > 0 ? 1 - v : v);

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
  const q = clamp((x - a) / (b - a));
  return q * q * (3 - 2 * q);
};
const ease = (q: number) => (q < 0.5 ? 2 * q * q : 1 - (-2 * q + 2) ** 2 / 2);

/* ---------- план сцены: всё, что зависит только от сценария ---------- */

type ActorPlan = {
  id: string;
  seed: number;
  h: number;
  y: number;
  flip: number;
  x0: number;
  poses: { t: number; pose: string }[];
  moves: { t: number; from: number; to: number; dur: number }[];
  /** Сборка из пыли: с какого уровня и куда (assemble). */
  level0: number;
  levels: { t: number; to: number }[];
  vanish?: number;
  /** Удары: выпад к противнику (lunges) и отдача от удара (knocks). */
  lunges: { t: number; foe: string }[];
  knocks: { t: number; foe: string }[];
  /** Порядок отрисовки: с какого момента герой стоит на каком «ряду». */
  z: { t: number; z: number }[];
  blinks: number[];
  snap?: number;
  dust?: { u: number; v: number; key: number; r: number[] }[];
};

type Fx = { t: number; x: number; y: number };

type Plan = {
  W: number;
  H: number;
  actors: ActorPlan[];
  lines: { start: number; end: number; who: string }[];
  shots: { start: number; spec: string }[];
  shakes: number[];
  bumps: number[];
  flashes: number[];
  impacts: { t: number; who: string; foe: string }[];
  stickers: Fx[];
  darkIn?: number;
  portal?: { x: number; y: number; r: number; t: number };
  vision?: { x: number; y: number; r: number; events: { t: number; on: boolean }[] };
  env: Float32Array;
  envSmooth: Float32Array;
  duration: number;
};

function makePlan(scene: StoryScene, timing: Timing, rig: StoryRig, lips: string): Plan {
  const stage = scene.stage!;
  const plate = rig.plates[stage.plate];
  const W = plate?.w ?? 1672;
  const H = plate?.h ?? 941;
  const lines = scene.lines.map((l, i) => ({ start: timing.lines[i]?.start ?? 0, end: timing.lines[i]?.end ?? 0, who: l.who }));
  const actors: ActorPlan[] = Object.entries(stage.cast).map(([id, a]) => {
    const r = rng(hash(id + scene.id));
    const blinks: number[] = [];
    for (let t = 0.8 + r() * 2; t < timing.duration + 4; t += 2.3 + r() * 3.2) blinks.push(t);
    const level0 = a.level ?? 1;
    return { id, seed: r() * 6.28, h: a.h, y: a.y, flip: a.flip ? -1 : 1, x0: a.x, poses: [{ t: -1e9, pose: a.pose }], moves: [], blinks, z: [{ t: -1e9, z: 0 }], level0, levels: [], lunges: [], knocks: [] };
  });
  const find = (who: string) => actors.find((x) => x.id === who);
  const bumps: number[] = [];
  const flashes: number[] = [];
  const impacts: Plan["impacts"] = [];
  const stickers: Fx[] = [];
  let darkIn: number | undefined;
  let portal: Plan["portal"];
  let zTop = 0;
  const shakes: number[] = [];
  const shots: Plan["shots"] = [];
  const vision = stage.vision ? { x: stage.vision.x, y: stage.vision.y, r: stage.vision.r, events: [{ t: -1e9, on: Boolean(stage.vision.shown) }] } : undefined;
  scene.lines.forEach((l, i) => {
    const t = lines[i].start;
    const act = l.act ?? {};
    for (const [who, pose] of Object.entries(act.pose ?? {})) {
      const a = actors.find((x) => x.id === who);
      if (a) {
        a.poses.push({ t, pose });
        a.blinks.push(t + 0.04);
      }
    }
    for (const [who, m] of Object.entries(act.move ?? {})) {
      const [to, dur, delay] = typeof m === "number" ? [m] : m;
      find(who)?.moves.push({ t: t + (delay ?? 0), from: NaN, to, dur: dur ?? MOVE_TIME });
    }
    for (const who of act.front ?? []) actors.find((x) => x.id === who)?.z.push({ t, z: ++zTop });
    for (const spec of act.fx ?? []) {
      const [fx, delay] = spec.split("@");
      const ft = t + (Number(delay) || 0);
      const [kind, arg, arg2] = fx.split(":");
      if (kind === "shake") shakes.push(ft);
      else if (kind === "flash") flashes.push(ft);
      else if (kind === "dark-in") darkIn = ft;
      else if (kind === "portal" && stage.portal) portal = { ...stage.portal, t: ft };
      else if (kind === "vision-in" || kind === "vision-out") vision?.events.push({ t: ft, on: kind === "vision-in" });
      else if (kind === "snap") {
        const a = find(arg);
        if (a) {
          a.snap = ft + SNAP_DELAY;
          shakes.push(a.snap);
        }
      } else if (kind === "assemble") find(arg)?.levels.push({ t: ft, to: Number(arg2) });
      else if (kind === "vanish") {
        const a = find(arg);
        if (a) a.vanish = ft;
      } else if (kind === "hit") {
        const [who, foe] = arg.split(">");
        find(who)?.lunges.push({ t: ft, foe });
        find(foe)?.knocks.push({ t: ft + HIT_DELAY, foe: who });
        impacts.push({ t: ft + HIT_DELAY, who: foe, foe: who });
        bumps.push(ft + HIT_DELAY);
      } else if (kind === "stickers") stickers.push({ t: ft, x: Number(arg), y: Number(arg2) });
    }
    const spec = act.shot ?? (l.who in stage.cast ? `medium:${l.who}` : "wide");
    if (!shots.length || shots[shots.length - 1].spec !== spec) shots.push({ start: i === 0 ? -1e9 : t, spec });
  });
  for (const a of actors) {
    let x = a.x0;
    a.moves.sort((p, q) => p.t - q.t);
    for (const m of a.moves) {
      m.from = x;
      x = m.to;
    }
    a.blinks.sort((p, q) => p - q);
  }
  const env = Float32Array.from([...lips].map((c) => Number(c) / 9));
  const envSmooth = new Float32Array(env.length);
  const k = 5;
  for (let i = 0; i < env.length; i++) {
    let s = 0;
    let n = 0;
    for (let j = Math.max(0, i - k); j <= Math.min(env.length - 1, i + k); j++) {
      s += env[j];
      n++;
    }
    envSmooth[i] = s / n;
  }
  return { W, H, actors, lines, shots, shakes, bumps, flashes, impacts, stickers, darkIn, portal, vision, env, envSmooth, duration: timing.duration };
}

function sample(arr: Float32Array, t: number) {
  if (!arr.length) return 0;
  const x = t * LIPS_FPS;
  const i = Math.floor(x);
  if (i < 0 || i >= arr.length - 1) return 0;
  return arr[i] + (arr[i + 1] - arr[i]) * (x - i);
}

/* ---------- состояние героя в момент t ---------- */

type ActorState = {
  pose: string;
  prev?: string;
  fade: number;
  x: number;
  yOff: number;
  lean: number;
  head: number;
  breath: number;
  squash: number;
  mouth: number;
  blink: number;
  dissolve: number;
  /** Сколько героя собрано (1 — целиком) и прозрачность при исчезновении. */
  level: number;
  alpha: number;
};

/** Где стоит герой по сценарию (переходы без выпадов и отдачи). */
function baseX(a: ActorPlan, t: number) {
  let x = a.x0;
  for (const m of a.moves) {
    if (t < m.t) break;
    x = m.from + (m.to - m.from) * ease(clamp((t - m.t) / m.dur));
  }
  return x;
}

function levelAt(a: ActorPlan, t: number) {
  let level = a.level0;
  for (const e of a.levels) {
    if (t < e.t) break;
    level += (e.to - level) * ease(clamp((t - e.t) / ASSEMBLE_TIME));
  }
  return level;
}

function actorAt(plan: Plan, a: ActorPlan, t: number, speakerX: number | null, speaking: boolean): ActorState {
  let pi = 0;
  for (let i = 0; i < a.poses.length; i++) if (a.poses[i].t <= t) pi = i;
  const cur = a.poses[pi];
  const q = clamp((t - cur.t) / POSE_FADE);
  const prev = pi > 0 && q < 1 ? a.poses[pi - 1].pose : undefined;
  let x = baseX(a, t);
  let yOff = 0;
  let walkLean = 0;
  for (const m of a.moves) {
    if (t < m.t) break;
    const mq = clamp((t - m.t) / m.dur);
    if (mq < 1) {
      // шаги — подпрыгивание; быстрый перелёт (отбросило ударом) — наклон по ходу
      if (m.dur >= 0.8) yOff = -Math.abs(Math.sin(mq * Math.PI * 3)) * 0.008 * plan.H;
      walkLean = (m.dur >= 0.8 ? 0.03 : 0.16) * Math.sin(mq * Math.PI) * Math.sign(m.to - m.from) * a.flip;
    }
  }
  // удары: выпад к противнику и отдача от его удара
  let hitSquash = 0;
  for (const l of a.lunges) {
    const s = t - l.t;
    const foe = plan.actors.find((f) => f.id === l.foe);
    if (s < 0 || s > 1 || !foe) continue;
    const dir = Math.sign(baseX(foe, l.t) - baseX(a, l.t)) || 1;
    x += dir * 0.045 * (s < 0.12 ? s / 0.12 : Math.exp(-(s - 0.12) * 5));
  }
  for (const k of a.knocks) {
    const s = t - k.t;
    const foe = plan.actors.find((f) => f.id === k.foe);
    if (s < 0 || s > 1.2 || !foe) continue;
    const dir = Math.sign(baseX(a, k.t) - baseX(foe, k.t)) || 1;
    const e = (s < 0.06 ? s / 0.06 : 1) * Math.exp(-s * 4.5);
    x += dir * 0.025 * e;
    walkLean += dir * a.flip * 0.11 * e;
    hitSquash = Math.min(hitSquash, -0.03 * e);
  }
  const e = speaking ? sample(plan.env, t) : 0;
  const es = speaking ? sample(plan.envSmooth, t) : 0;
  const s = a.seed;
  const toward = speakerX === null || Math.abs(speakerX - x) < 0.02 ? 0 : Math.sign(speakerX - x) * a.flip * 0.022;
  const head =
    0.016 * Math.sin((t * 2 * Math.PI) / 4.3 + 2 * s) + toward + (speaking ? 0.05 * (es - 0.3) * Math.sin(t * 2.1 + s) + 0.018 * Math.sin(t * 6.3 + s) * es : 0);
  const lean = 0.007 * Math.sin((t * 2 * Math.PI) / 6.1 + s) + walkLean + (speaking ? 0.012 * es * Math.sin(t * 1.7 + s) : 0);
  const breath = Math.sin((t * 2 * Math.PI) / 3.4 + s) * (speaking ? 1.4 : 1);
  const squash = (q < 1 && pi > 0 ? -0.022 * Math.sin(Math.PI * q) : 0) + hitSquash;
  // моргание — 0,16 с: глаза закрываются, держатся и открываются
  let blink = 0;
  for (const b of a.blinks) {
    if (b > t) break;
    if (t - b < 0.16) blink = Math.max(blink, clamp(1.6 - Math.abs((t - b) / 0.16 - 0.5) * 3.2));
  }
  const mouth = speaking ? clamp((e - 0.15) / 0.45) : 0;
  const dissolve = a.snap !== undefined ? clamp((t - a.snap) / SNAP_TIME) : 0;
  const level = levelAt(a, t);
  // исчезновение: мерцает и тает
  const vq = a.vanish !== undefined ? clamp((t - a.vanish) / VANISH_TIME) : 0;
  const alpha = vq > 0 ? (1 - vq) * (0.78 + 0.22 * Math.sin(t * 47)) : 1;
  return { pose: `${a.id}_${cur.pose}`, prev: prev ? `${a.id}_${prev}` : undefined, fade: q, x, yOff, lean, head, breath, squash, mouth, blink, dissolve, level, alpha };
}

/**
 * Где на сцене точка спрайта (в пикселях спрайта) — с учётом места, роста и зеркала; изгибы не учитываются.
 * По горизонтали герой стоит шеей в точке x (голова при смене позы не прыгает вбок), по вертикали — ступнями на y.
 */
function actorPoint(plan: Plan, a: ActorPlan, sp: RigSprite, x: number, yOff: number, p: Vec): Vec {
  const s = actorScale(plan, a, sp);
  return [x * plan.W + (p[0] - sp.neck[0]) * s * a.flip, a.y * plan.H + yOff + (p[1] - sp.foot[1]) * s];
}

/** Масштаб: рост героя (от макушки до ступней) — доля высоты фона. */
function actorScale(plan: Plan, a: ActorPlan, sp: RigSprite) {
  const top = sp.top ?? 0;
  return (a.h * plan.H) / Math.max(1, sp.foot[1] - top);
}

/* ---------- камера ---------- */

type Cam = { cx: number; cy: number; zoom: number };

function shotCam(plan: Plan, rig: StoryRig, spec: string, t: number): Cam {
  const [kind, arg] = spec.split(":");
  const neckOf = (who: string): Vec | null => {
    const a = plan.actors.find((x) => x.id === who);
    if (!a) return null;
    const st = actorAt(plan, a, t + MOVE_TIME + POSE_FADE, null, false);
    const sp = rig.sprites[st.pose];
    if (!sp) return null;
    return actorPoint(plan, a, sp, st.x, 0, sp.neck);
  };
  const { W, H } = plan;
  if (kind === "close" || kind === "medium") {
    const n = neckOf(arg);
    if (n) return kind === "close" ? { cx: n[0], cy: n[1] - 0.02 * H, zoom: 1.85 } : { cx: n[0], cy: n[1] + 0.12 * H, zoom: 1.4 };
  }
  if (kind === "two") {
    const [a, b] = arg.split(",").map(neckOf);
    if (a && b) {
      const zoom = clamp((W * 0.6) / Math.max(1, Math.abs(a[0] - b[0])), 1, 1.6);
      return { cx: (a[0] + b[0]) / 2, cy: (a[1] + b[1]) / 2 + 0.12 * H, zoom };
    }
  }
  return { cx: W / 2, cy: H / 2, zoom: 1 };
}

function cameraAt(plan: Plan, rig: StoryRig, t: number, cache: Map<number, Cam>): Cam {
  let si = 0;
  for (let i = 0; i < plan.shots.length; i++) if (plan.shots[i].start <= t) si = i;
  const shot = plan.shots[si];
  let base = cache.get(si);
  if (!base) {
    base = shotCam(plan, rig, shot.spec, Math.max(0, shot.start));
    cache.set(si, base);
  }
  const start = Math.max(0, shot.start);
  const end = plan.shots[si + 1]?.start ?? plan.duration;
  const push = 1 + 0.05 * clamp((t - start) / Math.max(1, end - start));
  let cx = base.cx;
  let cy = base.cy;
  for (const s of plan.shakes) {
    if (t < s || t > s + 1.2) continue;
    const amp = 9 * Math.exp(-(t - s) * 4.5);
    cx += amp * Math.sin(t * 53);
    cy += amp * Math.cos(t * 47);
  }
  for (const s of plan.bumps) {
    if (t < s || t > s + 0.5) continue;
    const amp = 5 * Math.exp(-(t - s) * 9);
    cx += amp * Math.sin(t * 61);
    cy += amp * Math.cos(t * 57);
  }
  return { cx, cy, zoom: base.zoom * push };
}

/* ---------- WebGL ---------- */

function program(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  for (const [type, src] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  const u = new Proxy({} as Record<string, WebGLUniformLocation | null>, {
    get: (cache, name: string) => (name in cache ? cache[name] : (cache[name] = gl.getUniformLocation(p, name))),
  });
  return { p, u };
}

function upload(gl: WebGL2RenderingContext, src: TexImageSource, w: number, h: number): Tex {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return { tex, w, h };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((ok, fail) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => ok(im);
    im.onerror = () => fail(new Error(url));
    im.src = url;
  });
}

/** Картинка поменьше для слабых экранов: текстуры спрайтов — самые тяжёлые. */
function shrink(im: HTMLImageElement, k: number): TexImageSource {
  if (k >= 1) return im;
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(im.naturalWidth * k));
  c.height = Math.max(1, Math.round(im.naturalHeight * k));
  c.getContext("2d")!.drawImage(im, 0, 0, c.width, c.height);
  return c;
}

/** Точки силуэта спрайта — откуда летит пыль «щелчка». */
function silhouette(im: HTMLImageElement, count: number, seed: number, dir = 1) {
  const c = document.createElement("canvas");
  c.width = 96;
  c.height = Math.round((96 * im.naturalHeight) / im.naturalWidth);
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(im, 0, 0, c.width, c.height);
  const data = g.getImageData(0, 0, c.width, c.height).data;
  const pts: Vec[] = [];
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (data[(y * c.width + x) * 4 + 3] > 140) pts.push([(x + 0.5) / c.width, (y + 0.5) / c.height]);
  const r = rng(seed);
  return Array.from({ length: Math.min(count, pts.length * 3) }, () => {
    const [u, v] = pts[Math.floor(r() * pts.length)];
    const ju = u + (r() - 0.5) / c.width;
    const jv = v + (r() - 0.5) / c.height;
    return { u: ju, v: jv, key: dissolveKey(ju, jv, dir), r: [r(), r(), r(), r(), r(), r()] };
  });
}

/* ---------- компонент ---------- */

export default function StoryStage({ story, scene, timing, clock, onReady }: { story: Story; scene: StoryScene; timing: Timing; clock: () => number; onReady?: (ready: boolean) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const props = useRef({ clock, onReady });
  props.current = { clock, onReady };

  useEffect(() => {
    const el = canvas.current;
    const rig = storyRig(story.id);
    if (!el || !rig || !scene.stage) return;
    const gl = el.getContext("webgl2", { alpha: false, antialias: true, premultipliedAlpha: true });
    if (!gl) {
      console.warn("StoryStage: no WebGL 2, showing frames");
      return;
    }
    const stage = scene.stage;
    const plan = makePlan(scene, timing, rig, sceneLipsync(story.id, scene.id));
    const { W, H } = plan;
    let alive = true;
    let ready = false;
    let raf = 0;
    let lastT = NaN;
    let dirty = true;
    const camCache = new Map<number, Cam>();

    let sp: ReturnType<typeof program>;
    let dot: ReturnType<typeof program>;
    try {
      sp = program(gl, SPRITE_VS, SPRITE_FS);
      dot = program(gl, DOT_VS, DOT_FS);
    } catch (e) {
      // Шейдер не собрался — остаются обычные кадры, но причина видна в консоли.
      console.warn("StoryStage:", e);
      return;
    }

    // Сетка спрайта: 14 × 22 клетки — хватает, чтобы шея и корпус гнулись плавно.
    const GX = 14;
    const GY = 22;
    const uv: number[] = [];
    for (let j = 0; j <= GY; j++) for (let i = 0; i <= GX; i++) uv.push(i / GX, j / GY);
    const idx: number[] = [];
    for (let j = 0; j < GY; j++)
      for (let i = 0; i < GX; i++) {
        const a = j * (GX + 1) + i;
        idx.push(a, a + 1, a + GX + 1, a + 1, a + GX + 2, a + GX + 1);
      }
    const vaoSprite = gl.createVertexArray()!;
    gl.bindVertexArray(vaoSprite);
    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    const aUv = gl.getAttribLocation(sp.p, "a_uv");
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);

    const vaoDot = gl.createVertexArray()!;
    gl.bindVertexArray(vaoDot);
    const dotBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dotBuf);
    const STRIDE = 7 * 4;
    for (const [name, size, off] of [
      ["a_pos", 2, 0],
      ["a_size", 1, 8],
      ["a_col", 4, 12],
    ] as const) {
      const loc = gl.getAttribLocation(dot.p, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, STRIDE, off);
    }
    gl.bindVertexArray(null);

    // Служебные текстуры: пусто (нет заплатки), белый (вспышка), свечение, шум.
    const pixel = (rgba: number[]) => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(rgba));
      return { tex, w: 1, h: 1 };
    };
    const empty = pixel([0, 0, 0, 0]);
    const white = pixel([255, 255, 255, 255]);
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 128;
    const g2 = glowCanvas.getContext("2d")!;
    const grad = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(255,255,255,0.45)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g2.fillStyle = grad;
    g2.fillRect(0, 0, 128, 128);
    const glowTex = upload(gl, glowCanvas, 128, 128);
    const noise = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, noise);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, NOISE, NOISE, 0, gl.RED, gl.UNSIGNED_BYTE, NOISE_DATA);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    // Картинки сцены: фон, его размытая копия, передний план, видение, все позы героев с заплатками.
    const tex = new Map<string, Tex>();
    const small = Math.min(window.innerWidth, window.innerHeight) * Math.min(2, window.devicePixelRatio || 1) < 900 ? 0.6 : 1;
    const want: { key: string; url: string; k: number }[] = [
      { key: "plate", url: rigSrc(story, stage.plate), k: 1 },
      { key: "blur", url: rigSrc(story, `${stage.plate}_blur`), k: 1 },
    ];
    if (rig.plates[stage.plate]?.front) want.push({ key: "front", url: rigSrc(story, `${stage.plate}_front`), k: 1 });
    if (stage.vision) want.push({ key: "vision", url: rigSrc(story, stage.vision.src), k: 1 });
    const names = new Set<string>();
    for (const a of plan.actors) for (const p of a.poses) names.add(`${a.id}_${p.pose}`);
    for (const n of names) {
      const s = rig.sprites[n];
      if (!s) continue;
      want.push({ key: n, url: rigSrc(story, n), k: small });
      if (s.mouth) want.push({ key: `${n}_m`, url: rigSrc(story, `${n}_m`), k: small });
      if (s.blink) want.push({ key: `${n}_b`, url: rigSrc(story, `${n}_b`), k: small });
    }
    const snapSprites = new Map<string, HTMLImageElement>();
    Promise.all(
      want.map(async (w) => {
        const im = await loadImage(w.url);
        if (!alive) return;
        tex.set(w.key, upload(gl, shrink(im, w.k), im.naturalWidth, im.naturalHeight));
        snapSprites.set(w.key, im);
      }),
    )
      .then(() => {
        if (!alive) return;
        for (const a of plan.actors) {
          // откуда летит пыль: силуэт позы в момент «щелчка» или сборки
          const when = a.snap ?? (a.levels.length || a.level0 < 1 ? (a.levels[0]?.t ?? 0) : undefined);
          if (when === undefined) continue;
          let pi = 0;
          for (let i = 0; i < a.poses.length; i++) if (a.poses[i].t <= when) pi = i;
          const im = snapSprites.get(`${a.id}_${a.poses[pi].pose}`);
          if (im) a.dust = silhouette(im, a.snap !== undefined ? 3600 : 1800, hash(a.id), a.snap !== undefined ? 1 : -1);
        }
        snapSprites.clear();
        ready = true;
        dirty = true;
        props.current.onReady?.(true);
      })
      .catch(() => props.current.onReady?.(false));

    // Пылинки в воздухе — всегда; место и скорость у каждой свои.
    const motes = (() => {
      const r = rng(hash(scene.id));
      return Array.from({ length: 70 }, () => ({ x: r() * W, y: r() * H, v: 4 + r() * 10, p: r() * 6.28, s: 1.2 + r() * 2.4, a: 0.08 + r() * 0.2 }));
    })();
    const sparks = Array.from({ length: 40 }, (_, i) => {
      const r = rng(1000 + i);
      return { per: 1.4 + r() * 1.4, ph: r() * 3, ang: r() * 6.28, rad: 10 + r() * 40, s: 1.5 + r() * 3 };
    });
    const ring = Array.from({ length: 56 }, (_, i) => {
      const r = rng(2000 + i);
      return { ang: (i / 56) * 6.28 + r() * 0.1, sp: (r() - 0.5) * 0.5, s: 1.5 + r() * 3, tw: r() * 6.28 };
    });

    // Размер холста — по экрану, не больше 2048 по ширине.
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.min(2048, Math.round(el.clientWidth * dpr));
      const h = Math.round((w * el.clientHeight) / Math.max(1, el.clientWidth));
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
        dirty = true;
      }
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();

    const dots: number[] = [];
    const dotAdd = (x: number, y: number, s: number, r: number, g: number, b: number, a: number) => {
      if (a > 0.003) dots.push(x, y, s, r, g, b, a);
    };

    /** Камера слоя: фон сдвигается и приближается медленнее героев, передний план — быстрее. */
    const layerCam = (cam: Cam, f: number) => {
      const zoom = 1 + (cam.zoom - 1) * f;
      let cx = W / 2 + (cam.cx - W / 2) * f;
      let cy = H / 2 + (cam.cy - H / 2) * f;
      const aspect = el.width / Math.max(1, el.height);
      let hw: number;
      let hh: number;
      if (aspect >= W / H) {
        hh = H / zoom / 2;
        hw = hh * aspect;
      } else {
        hw = W / zoom / 2;
        hh = hw / aspect;
      }
      cx = hw * 2 >= W ? W / 2 : clamp(cx, hw, W - hw);
      cy = hh * 2 >= H ? H / 2 : clamp(cy, hh, H - hh);
      return { cam: [cx, cy, 1 / hw, 1 / hh] as [number, number, number, number], px: el.width / (hw * 2), hw, hh, cx, cy };
    };

    type Draw = {
      t: Tex;
      pos: Vec;
      size: Vec;
      foot?: Vec;
      neck?: Vec;
      flip?: number;
      head?: number;
      lean?: number;
      breath?: number;
      squash?: number;
      alpha?: number;
      tint?: [number, number, number];
      mouth?: { t: Tex; r: RigBox; k: number; w: number; h: number };
      blink?: { t: Tex; r: RigBox; k: number; w: number; h: number };
      dissolve?: number;
      dir?: number;
    };
    let cam4: [number, number, number, number] = [0, 0, 1, 1];
    const draw1 = (d: Draw) => {
      const u = sp.u;
      gl.uniform4fv(u.u_cam, cam4);
      gl.uniform2f(u.u_pos, d.pos[0], d.pos[1]);
      gl.uniform2f(u.u_size, d.size[0], d.size[1]);
      gl.uniform2f(u.u_foot, ...(d.foot ?? ([0, 0] as Vec)));
      gl.uniform2f(u.u_neck, ...(d.neck ?? ([0, 0] as Vec)));
      gl.uniform1f(u.u_flip, d.flip ?? 1);
      gl.uniform1f(u.u_head, d.head ?? 0);
      gl.uniform1f(u.u_lean, d.lean ?? 0);
      gl.uniform1f(u.u_breath, d.breath ?? 0);
      gl.uniform1f(u.u_squash, d.squash ?? 0);
      gl.uniform1f(u.u_alpha, d.alpha ?? 1);
      gl.uniform3fv(u.u_tint, d.tint ?? [1, 1, 1]);
      gl.uniform1f(u.u_dissolve, d.dissolve ?? 0);
      gl.uniform1f(u.u_dir, d.dir ?? 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, d.t.tex);
      gl.uniform1i(u.u_tex, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, d.mouth?.t.tex ?? empty.tex);
      gl.uniform1i(u.u_mouthTex, 1);
      gl.uniform4fv(u.u_mouthRect, d.mouth ? rect(d.mouth) : [0, 0, 1, 1]);
      gl.uniform1f(u.u_mouth, d.mouth?.k ?? 0);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, d.blink?.t.tex ?? empty.tex);
      gl.uniform1i(u.u_blinkTex, 2);
      gl.uniform4fv(u.u_blinkRect, d.blink ? rect(d.blink) : [0, 0, 1, 1]);
      gl.uniform1f(u.u_blink, d.blink?.k ?? 0);
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, noise);
      gl.uniform1i(u.u_noise, 3);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    };
    const rect = (p: { r: RigBox; w: number; h: number }) => [p.r.x / p.w, p.r.y / p.h, p.r.w / p.w, p.r.h / p.h] as [number, number, number, number];

    const render = (t: number) => {
      fit();
      gl.viewport(0, 0, el.width, el.height);
      gl.clearColor(0.04, 0.04, 0.05, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (!ready) return;
      gl.enable(gl.BLEND);
      const normal = () => gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      const add = () => gl.blendFunc(gl.ONE, gl.ONE);
      normal();
      gl.useProgram(sp.p);
      gl.bindVertexArray(vaoSprite);

      const cam = cameraAt(plan, rig, t, camCache);
      let li = -1;
      plan.lines.forEach((l, i) => {
        if (l.start <= t + 0.02) li = i;
      });
      const line = li >= 0 ? plan.lines[li] : null;
      const speakerId = line && t <= line.end + 0.05 ? line.who : null;
      const speaker = plan.actors.find((a) => a.id === speakerId);
      const speakerX = speaker ? actorAt(plan, speaker, t, null, false).x : null;

      // Фон: резкий и размытый на крупных планах (глубина резкости).
      const back = layerCam(cam, 0.88);
      cam4 = back.cam;
      // обратный ракурс — тот же фон зеркалом
      const fx0 = stage.mirror ? W : 0;
      const fw = stage.mirror ? -W : W;
      draw1({ t: tex.get("plate")!, pos: [fx0, 0], size: [fw, H] });
      const blur = clamp((cam.zoom - 1.2) / 0.45) * 0.9;
      if (blur > 0) draw1({ t: tex.get("blur")!, pos: [fx0, 0], size: [fw, H], alpha: blur });

      // Вспышка «щелчка» и свечение посоха перед ним.
      let flash = 0;
      let boost = 1;
      for (const f of plan.flashes) if (t >= f) flash = Math.max(flash, 0.8 * Math.exp(-(t - f) * 2.5));
      for (const a of plan.actors) {
        if (a.snap === undefined) continue;
        if (t >= a.snap) flash = Math.max(flash, 0.75 * Math.exp(-(t - a.snap) * 2.2));
        boost = Math.max(boost, 1 + 2 * smooth(a.snap - 1.4, a.snap, t) * (1 - smooth(a.snap + 2.5, a.snap + 5, t)));
      }

      const main = layerCam(cam, 1);
      cam4 = main.cam;

      // Видение.
      const vis = plan.vision;
      let visK = 0;
      if (vis && tex.get("vision")) {
        let ev = vis.events[0];
        for (const e of vis.events) if (e.t <= t) ev = e;
        const q = smooth(0, 0.9, t - ev.t);
        visK = ev.on ? q : 1 - q;
        if (visK > 0.001) {
          const r = vis.r * H * (0.82 + 0.18 * visK) * (1 + 0.012 * Math.sin(t * 2));
          const cx = vis.x * W;
          const cy = vis.y * H + 6 * Math.sin(t * 1.3);
          add();
          draw1({ t: glowTex, pos: [cx - r * 1.45, cy - r * 1.45], size: [r * 2.9, r * 2.9], alpha: 0.35 * visK, tint: [1, 0.78, 0.4] });
          normal();
          draw1({ t: tex.get("vision")!, pos: [cx - r, cy - r], size: [r * 2, r * 2], alpha: visK });
        }
      }

      // Портал: тёмное ядро в фиолетовом зареве, по спирали в него затягивает искры.
      const por = plan.portal;
      const porK = por ? smooth(0, 1.4, t - por.t) : 0;
      if (por && porK > 0) {
        const r = por.r * H * porK * (1 + 0.04 * Math.sin(t * 4));
        add();
        draw1({ t: glowTex, pos: [por.x * W - r * 1.8, por.y * H - r * 1.8], size: [r * 3.6, r * 3.6], alpha: 0.75 * porK, tint: [0.62, 0.22, 1] });
        draw1({ t: glowTex, pos: [por.x * W - r * 1.1, por.y * H - r * 1.1], size: [r * 2.2, r * 2.2], alpha: 0.5 * porK, tint: [1, 0.3, 0.45] });
        normal();
        draw1({ t: glowTex, pos: [por.x * W - r * 0.8, por.y * H - r * 0.8], size: [r * 1.6, r * 1.6], alpha: 0.95 * porK, tint: [0, 0, 0] });
      }

      // Герои.
      const light = stage.light ?? [1, 1, 1];
      const glows: { p: Vec; k: number }[] = [];
      const ghosts: { a: ActorPlan; sp: RigSprite; x: number; level: number }[] = [];
      const dusts: { a: ActorPlan; sp: RigSprite; x: number }[] = [];
      const zAt = (a: ActorPlan) => a.z.reduce((z, e) => (e.t <= t ? e.z : z), 0);
      const ordered = plan.actors.map((a, i) => ({ a, i, z: zAt(a) })).sort((p, q) => p.z - q.z || p.i - q.i);
      for (const { a } of ordered) {
        const st = actorAt(plan, a, t, speakerX, a.id === speakerId);
        if (st.dissolve >= 1 || st.level <= 0.001 || st.alpha <= 0.001) continue;
        const ghost = st.level < 0.999;
        const layers: [string, number][] = st.prev ? [[st.prev, 1 - smooth(0.5, 1, st.fade)], [st.pose, smooth(0, 0.6, st.fade)]] : [[st.pose, 1]];
        for (const [name, alpha] of layers) {
          const s = rig.sprites[name];
          const tx = tex.get(name);
          if (!s || !tx || alpha <= 0.001) continue;
          const k = actorScale(plan, a, s);
          const size: Vec = [s.w * k, s.h * k];
          const patch = (key: string, r: RigBox | undefined, amount: number) => {
            const pt = tex.get(key);
            return r && pt && amount > 0 ? { t: pt, r, k: amount, w: s.w, h: s.h } : undefined;
          };
          draw1({
            t: tx,
            pos: [st.x * W, a.y * H + st.yOff],
            size,
            foot: [s.neck[0] / s.w, s.foot[1] / s.h],
            neck: [s.neck[0] / s.w, s.neck[1] / s.h],
            flip: a.flip,
            head: st.head,
            lean: st.lean,
            breath: st.breath,
            squash: st.squash,
            alpha: alpha * st.alpha * (ghost ? 0.93 : 1),
            tint: [
              light[0] * (1 + flash * 0.35 + (ghost ? 0.3 * (1 - st.level) : 0)),
              light[1] * (1 + flash * 0.22 + (ghost ? 0.1 * (1 - st.level) : 0)),
              light[2] * (1 - (ghost ? 0.25 * (1 - st.level) : 0)) * (st.alpha < 1 ? 1.15 : 1),
            ],
            mouth: patch(`${name}_m`, s.mouth, st.mouth),
            blink: patch(`${name}_b`, s.blink, st.blink),
            dissolve: ghost ? 1 - st.level : st.dissolve,
            dir: ghost ? -1 : 1,
          });
          if (ghost && name === st.pose) ghosts.push({ a, sp: s, x: st.x, level: st.level });
          if (s.glow && alpha > 0.5) glows.push({ p: actorPoint(plan, a, s, st.x, st.yOff, s.glow), k: boost });
          if (st.dissolve > 0 && name === st.pose) dusts.push({ a, sp: s, x: st.x });
        }
      }
      // Пыль продолжает лететь и после того, как герой исчез.
      for (const a of plan.actors) {
        if (a.snap === undefined || t < a.snap || dusts.some((d) => d.a === a)) continue;
        let pi = 0;
        for (let i = 0; i < a.poses.length; i++) if (a.poses[i].t <= a.snap) pi = i;
        const s = rig.sprites[`${a.id}_${a.poses[pi].pose}`];
        if (s) dusts.push({ a, sp: s, x: actorAt(plan, a, a.snap, null, false).x });
      }

      // Золотой ореол вокруг того, кого стирает «щелчок» или кто собирается из пыли.
      add();
      for (const g of ghosts) {
        const c = actorPoint(plan, g.a, g.sp, g.x, 0, [g.sp.neck[0], (g.sp.neck[1] + g.sp.foot[1]) / 2.6]);
        const r = 0.4 * H * (0.92 + 0.08 * Math.sin(t * 3));
        draw1({ t: glowTex, pos: [c[0] - r, c[1] - r], size: [r * 2, r * 2], alpha: 0.32 * (0.4 + g.level), tint: [1, 0.78, 0.38] });
      }
      // Удар: белая вспышка у головы того, по кому попали.
      const hits: { c: Vec; s: number; seed: number }[] = [];
      for (const [i, h] of plan.impacts.entries()) {
        const s = t - h.t;
        const a = plan.actors.find((x) => x.id === h.who);
        if (s < 0 || s > 0.6 || !a) continue;
        const st = actorAt(plan, a, t, null, false);
        const sp = rig.sprites[st.pose];
        if (!sp) continue;
        const c = actorPoint(plan, a, sp, st.x, st.yOff, [sp.neck[0], sp.neck[1] - (sp.foot[1] - (sp.top ?? 0)) * 0.05]);
        const r = 0.11 * H * (0.6 + s * 1.6);
        draw1({ t: glowTex, pos: [c[0] - r, c[1] - r], size: [r * 2, r * 2], alpha: 0.9 * (1 - s / 0.6), tint: [1, 0.92, 0.7] });
        hits.push({ c, s, seed: i });
      }
      for (const d of dusts) {
        if (d.a.snap === undefined) continue;
        const k = Math.sin(Math.PI * clamp((t - d.a.snap) / (SNAP_TIME + 1)));
        if (k <= 0.01) continue;
        const c = actorPoint(plan, d.a, d.sp, d.x, 0, [d.sp.neck[0], (d.sp.neck[1] + d.sp.foot[1]) / 2.6]);
        const r = 0.42 * H * (0.9 + 0.1 * Math.sin(t * 5));
        draw1({ t: glowTex, pos: [c[0] - r, c[1] - r], size: [r * 2, r * 2], alpha: 0.45 * k, tint: [1, 0.75, 0.35] });
      }
      normal();

      // Передний план (стол) — поверх героев.
      const front = rig.plates[stage.plate]?.front;
      const ft = tex.get("front");
      if (front && ft) {
        cam4 = layerCam(cam, 1.06).cam;
        draw1({ t: ft, pos: [stage.mirror ? W - front.x : front.x, front.y], size: [stage.mirror ? -front.w : front.w, front.h] });
        cam4 = main.cam;
      }

      // Свечение посоха.
      add();
      for (const g of glows) {
        const r = 0.085 * H * (1 + 0.08 * Math.sin(t * 3.1)) * (0.8 + 0.5 * g.k);
        draw1({ t: glowTex, pos: [g.p[0] - r, g.p[1] - r], size: [r * 2, r * 2], alpha: 0.5 * Math.min(1.6, g.k), tint: [1, 0.62, 0.3] });
      }

      // Точки: пылинки, искры посоха, искры видения, пыль «щелчка».
      dots.length = 0;
      for (const m of motes) {
        const y = (((m.y - t * m.v) % H) + H) % H;
        const x = m.x + 18 * Math.sin(t * 0.21 + m.p);
        dotAdd(x, y, m.s, 1, 0.92, 0.78, m.a * (0.6 + 0.4 * Math.sin(t * 1.3 + m.p)));
      }
      for (const g of glows)
        for (const s of sparks) {
          const age = (t + s.ph) % s.per;
          const q = age / s.per;
          const a = s.ang + q * 2;
          dotAdd(g.p[0] + Math.cos(a) * s.rad * (0.5 + q), g.p[1] + Math.sin(a) * s.rad * 0.5 - q * 60, s.s * (1 - 0.6 * q), 1, 0.78, 0.36, 0.9 * (1 - q) * Math.min(1, g.k));
        }
      if (vis && visK > 0.01) {
        const r = vis.r * H * (0.82 + 0.18 * visK);
        for (const p of ring) {
          const a = p.ang + t * (0.18 + p.sp);
          dotAdd(vis.x * W + Math.cos(a) * r, vis.y * H + Math.sin(a) * r + 6 * Math.sin(t * 1.3), p.s, 1, 0.82, 0.45, visK * (0.5 + 0.5 * Math.sin(t * 3 + p.tw)));
        }
      }
      for (const d of dusts) {
        if (!d.a.dust || d.a.snap === undefined) continue;
        for (const p of d.a.dust) {
          const born = d.a.snap + ((p.key + 0.08) / 1.15) * SNAP_TIME;
          const age = t - born;
          if (age < 0 || age > DUST_LIFE) continue;
          const [x0, y0] = actorPoint(plan, d.a, d.sp, d.x, 0, [p.u * d.sp.w, p.v * d.sp.h]);
          const [r1, r2, r3, r4, r5, r6] = p.r;
          const q = age / DUST_LIFE;
          const x = x0 + (40 + 110 * r1) * age + 16 * Math.sin(age * 2.3 + r3 * 6);
          const y = y0 - (25 + 70 * r2) * age - 14 * age * age + 9 * Math.cos(age * 1.9 + r4 * 6);
          dotAdd(x, y, (3.5 + 5.5 * r5) * (1 - 0.55 * q), 1, 0.74 + 0.2 * r6, 0.34 + 0.25 * r6, (1 - q) ** 1.2);
        }
      }
      for (const g of ghosts) {
        if (!g.a.dust) continue;
        const th = (1 - g.level) * 1.15 - 0.08;
        for (const p of g.a.dust) {
          const d = p.key - th;
          if (d < 0 || d > 0.07) continue;
          const [x, y] = actorPoint(plan, g.a, g.sp, g.x, 0, [p.u * g.sp.w, p.v * g.sp.h]);
          dotAdd(x + 6 * Math.sin(t * 3 + p.r[0] * 9), y - 10 * p.r[1], 2.5 + 3 * p.r[2], 1, 0.8, 0.4, (1 - d / 0.07) * (0.6 + 0.4 * Math.sin(t * 7 + p.r[3] * 9)));
        }
      }
      for (const h of hits) {
        const r = rng(9000 + h.seed);
        for (let i = 0; i < 26; i++) {
          const ang = r() * 6.28;
          const v = 180 + r() * 420;
          dotAdd(h.c[0] + Math.cos(ang) * v * h.s, h.c[1] + Math.sin(ang) * v * h.s, (3 + 4 * r()) * (1 - h.s / 0.6), 1, 0.95, 0.75, 1 - h.s / 0.6);
        }
      }
      if (por && porK > 0) {
        const r = rng(4242);
        for (let i = 0; i < 90; i++) {
          const ph = r();
          const q = (t * 0.45 + ph) % 1;
          const ang = r() * 6.28 + q * 7;
          const rad = por.r * H * porK * (1.5 - 1.3 * q);
          dotAdd(por.x * W + Math.cos(ang) * rad, por.y * H + Math.sin(ang) * rad * 0.9, 2 + 3 * r(), 0.75 + 0.25 * r(), 0.3, 1, porK * Math.sin(Math.PI * q));
        }
      }
      if (dots.length) {
        gl.useProgram(dot.p);
        gl.bindVertexArray(vaoDot);
        gl.uniform4fv(dot.u.u_cam, cam4);
        gl.uniform1f(dot.u.u_px, main.px);
        gl.bindBuffer(gl.ARRAY_BUFFER, dotBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dots), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.POINTS, 0, dots.length / 7);
        gl.useProgram(sp.p);
        gl.bindVertexArray(vaoSprite);
      }
      // Стикеры со стены — бумага, а не свет: обычное смешивание.
      dots.length = 0;
      for (const [k, f] of plan.stickers.entries()) {
        const s0 = t - f.t;
        if (s0 < 0 || s0 > 3.5) continue;
        const r = rng(7000 + k);
        const colors = [[1, 0.87, 0.3], [1, 0.55, 0.7], [0.45, 0.8, 1], [0.6, 0.95, 0.5], [1, 0.7, 0.35]];
        for (let i = 0; i < 46; i++) {
          const delay = r() * 0.5;
          const s = s0 - delay;
          const [cr, cg, cb] = colors[Math.floor(r() * colors.length)];
          const x0 = (f.x + (r() - 0.5) * 0.12) * W;
          const y0 = (f.y + (r() - 0.5) * 0.2) * H;
          const sw = r() * 6.28;
          const vx = (r() - 0.3) * 160;
          if (s < 0) continue;
          dotAdd(x0 + vx * s + 26 * Math.sin(s * 3.2 + sw), y0 + 60 * s + 90 * s * s, -(12 + 8 * r()), cr, cg, cb, clamp((3.5 - s0) / 0.6));
        }
      }
      if (dots.length) {
        normal();
        gl.useProgram(dot.p);
        gl.bindVertexArray(vaoDot);
        gl.uniform4fv(dot.u.u_cam, cam4);
        gl.uniform1f(dot.u.u_px, main.px);
        gl.bindBuffer(gl.ARRAY_BUFFER, dotBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dots), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.POINTS, 0, dots.length / 7);
        gl.useProgram(sp.p);
        gl.bindVertexArray(vaoSprite);
        add();
      }

      // Вспышка на весь кадр.
      if (flash > 0.003) draw1({ t: white, pos: [main.cx - main.hw, main.cy - main.hh], size: [main.hw * 2, main.hh * 2], alpha: flash * 0.55, tint: [1, 0.8, 0.45] });
      normal();
      // Из темноты: чёрный экран, потом проявляется.
      if (plan.darkIn !== undefined) {
        const s = t - plan.darkIn;
        const dark = s < 1 ? 1 : 1 - smooth(1, 2.6, s);
        if (dark > 0.003) draw1({ t: white, pos: [main.cx - main.hw, main.cy - main.hh], size: [main.hw * 2, main.hh * 2], alpha: dark, tint: [0, 0, 0] });
      }
    };

    const loop = () => {
      if (!alive) return;
      const t = props.current.clock();
      if (dirty || t !== lastT) {
        render(t);
        lastT = t;
        dirty = false;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Покадровый рендер в видео (scripts/story-film.mjs): нарисовать момент t сейчас же.
    const hook = { scene: scene.id, draw: (t: number) => (render(t), ready), ready: () => ready };
    (window as unknown as { __storyStage?: typeof hook }).__storyStage = hook;

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      for (const t of tex.values()) gl.deleteTexture(t.tex);
      for (const t of [empty, white, glowTex]) gl.deleteTexture(t.tex);
      gl.deleteTexture(noise);
      gl.deleteBuffer(uvBuf);
      gl.deleteBuffer(idxBuf);
      gl.deleteBuffer(dotBuf);
      gl.deleteVertexArray(vaoSprite);
      gl.deleteVertexArray(vaoDot);
      gl.deleteProgram(sp.p);
      gl.deleteProgram(dot.p);
      const w = window as unknown as { __storyStage?: typeof hook };
      if (w.__storyStage === hook) delete w.__storyStage;
      props.current.onReady?.(false);
    };
  }, [story, scene, timing]);

  return <canvas ref={canvas} className="story-canvas absolute inset-0 h-full w-full" aria-hidden />;
}
