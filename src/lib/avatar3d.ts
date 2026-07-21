/**
 * Процедурный 3D-персонаж YeahDays.
 *
 * Атлетичный мужчина 22–28 лет, полуреалистичная стилизация:
 * чистая геометрия, матовый графитовый «камень», без мультяшности
 * и без фотореализма. Анатомия собирается кодом, а не импортируется
 * из GLB — поэтому пропорции это функция статов, и персонаж растёт
 * непрерывно, а не переключается между тремя картинками.
 *
 * Сила        → ширина плеч, объём груди/рук/ног, глубина пресса, осанка
 * Интеллект   → свечение ядра и визора
 * Капитал     → золотая отделка, корона
 * Стабильность→ кольца платформы, разворот стоп, устойчивость стойки
 *
 * Бюджет: ~9k треугольников, MeshStandardMaterial, без текстур —
 * тянет мобильный GPU в PWA.
 */

import * as THREE from "three";
import type { StatKey } from "./domain";

export interface AvatarStats {
  strength: number;
  intelligence: number;
  wealth: number;
  stability: number;
}

/** Нормализованные 0..1 значения — насколько прокачан каждый стат. */
export interface AvatarShape {
  strength: number;
  intelligence: number;
  wealth: number;
  stability: number;
  level: number;
}

/**
 * Нормализация: логарифмическая, чтобы первые задачи давали
 * заметный визуальный отклик, а рост не упирался в потолок.
 */
export function normalizeStats(stats: AvatarStats, level: number): AvatarShape {
  // Потолок вынесен на ~1200 XP: первые задачи дают заметный отклик
  // (log растёт круто в начале), но тело продолжает меняться и на 40+ уровне.
  const n = (v: number) =>
    Math.min(1, Math.log10(1 + v / 55) / Math.log10(1 + 1200 / 55));
  return {
    strength: n(stats.strength),
    intelligence: n(stats.intelligence),
    wealth: n(stats.wealth),
    stability: n(stats.stability),
    level,
  };
}

export const STAT_HEX: Record<StatKey, string> = {
  strength: "#f97362",
  intelligence: "#8b7cf6",
  wealth: "#f0b23f",
  stability: "#3fbf9a",
};

export function dominantStat(stats: AvatarStats): StatKey {
  let best: StatKey = "strength";
  let max = -1;
  (Object.keys(stats) as StatKey[]).forEach((k) => {
    if (stats[k] > max) {
      max = stats[k];
      best = k;
    }
  });
  return best;
}

/* ────────────────────────  Материалы  ──────────────────────── */

interface Materials {
  skin: THREE.MeshStandardMaterial;
  skinDark: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  core: THREE.MeshStandardMaterial;
  gold: THREE.MeshStandardMaterial;
  platform: THREE.MeshStandardMaterial;
}

function makeMaterials(shape: AvatarShape): Materials {
  // Матовый графит с лёгким металлическим/каменным откликом.
  // С ростом уровня камень «оживает»: чуть светлее и теплее.
  const base = new THREE.Color("#4a4e5c").lerp(
    new THREE.Color("#79808f"),
    Math.min(1, shape.level / 45),
  );

  const skin = new THREE.MeshStandardMaterial({
    color: base,
    roughness: 0.62,
    metalness: 0.34,
    flatShading: false,
  });

  // Затемнённая версия для впадин: разделение пресса, подмышки, шея.
  const skinDark = new THREE.MeshStandardMaterial({
    color: base.clone().multiplyScalar(0.72),
    roughness: 0.72,
    metalness: 0.28,
  });

  const accent = new THREE.MeshStandardMaterial({
    color: new THREE.Color(STAT_HEX.strength),
    roughness: 0.4,
    metalness: 0.5,
    emissive: new THREE.Color(STAT_HEX.strength),
    emissiveIntensity: 0.16 + shape.strength * 0.4,
  });

  const core = new THREE.MeshStandardMaterial({
    color: new THREE.Color(STAT_HEX.intelligence),
    roughness: 0.25,
    metalness: 0.1,
    emissive: new THREE.Color(STAT_HEX.intelligence),
    emissiveIntensity: 0.35 + shape.intelligence * 1.7,
  });

  const gold = new THREE.MeshStandardMaterial({
    color: new THREE.Color(STAT_HEX.wealth),
    roughness: 0.22,
    metalness: 0.92,
    emissive: new THREE.Color(STAT_HEX.wealth),
    emissiveIntensity: 0.1 + shape.wealth * 0.34,
  });

  const platform = new THREE.MeshStandardMaterial({
    color: new THREE.Color(STAT_HEX.stability),
    roughness: 0.35,
    metalness: 0.6,
    emissive: new THREE.Color(STAT_HEX.stability),
    emissiveIntensity: 0.14 + shape.stability * 0.55,
    transparent: true,
    opacity: 0.5 + shape.stability * 0.45,
  });

  return { skin, skinDark, accent, core, gold, platform };
}

export interface AvatarRig {
  root: THREE.Group;
  /** узлы для анимации */
  torso: THREE.Group;
  head: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  core: THREE.Mesh;
  platform: THREE.Group;
  aura: THREE.Mesh | null;
  materials: Materials;
  dispose: () => void;
}

/* ────────────────────────  Хелперы формы  ──────────────────────── */

const geoms: THREE.BufferGeometry[] = [];
function track<T extends THREE.BufferGeometry>(g: T): T {
  geoms.push(g);
  return g;
}

/**
 * Лофт по профилю: строим тело вращения с переменным радиусом
 * и эллиптическим сечением. Так получается V-образный торс,
 * который капсулами не собрать.
 */
function loft(
  profile: { y: number; r: number; sx?: number; sz?: number }[],
  radialSeg = 24,
): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = profile.map((p) => new THREE.Vector2(p.r, p.y));
  const geo = new THREE.LatheGeometry(pts, radialSeg);

  // Эллиптическое сечение: интерполируем sx/sz по высоте.
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const yMin = profile[0].y;
  const yMax = profile[profile.length - 1].y;

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = (y - yMin) / (yMax - yMin || 1);

    // найти сегмент профиля
    let sx = 1;
    let sz = 1;
    for (let j = 0; j < profile.length - 1; j++) {
      const a = profile[j];
      const b = profile[j + 1];
      const ta = (a.y - yMin) / (yMax - yMin || 1);
      const tb = (b.y - yMin) / (yMax - yMin || 1);
      if (t >= ta && t <= tb) {
        const k = tb === ta ? 0 : (t - ta) / (tb - ta);
        sx = THREE.MathUtils.lerp(a.sx ?? 1, b.sx ?? 1, k);
        sz = THREE.MathUtils.lerp(a.sz ?? 1, b.sz ?? 1, k);
        break;
      }
    }
    pos.setX(i, pos.getX(i) * sx);
    pos.setZ(i, pos.getZ(i) * sz);
  }

  geo.computeVertexNormals();
  return track(geo);
}

/** Сплющенная сфера — основа для мышечных объёмов. */
function blob(r: number, sx: number, sy: number, sz: number, seg = 16) {
  const g = new THREE.SphereGeometry(r, seg, Math.max(8, seg - 4));
  g.scale(sx, sy, sz);
  return track(g);
}

function capsule(r: number, h: number, seg = 14) {
  return track(new THREE.CapsuleGeometry(r, h, 4, seg));
}

/* ────────────────────────  Сборка  ──────────────────────── */

export function buildAvatar(shape: AvatarShape): AvatarRig {
  geoms.length = 0;
  const mats = makeMaterials(shape);
  const root = new THREE.Group();

  const S = shape.strength;          // 0..1 мышечная масса
  const posture = 0.55 + S * 0.45;   // осанка: новичок чуть сутулится

  /* ─── Пропорции. Модель ~3.4 юнита ростом ─── */
  const shoulderW = 0.62 + S * 0.30; // ширина плеч
  const chestD = 0.30 + S * 0.13;    // глубина грудной клетки
  const waistW = 0.335 - S * 0.085;  // талия реально сужается — иначе V схлопывается
  const hipW = 0.40 + S * 0.05;
  const limbR = 0.088 + S * 0.052;   // толщина конечностей

  /* ══════════ ПЛАТФОРМА ══════════ */
  const platform = new THREE.Group();
  const ringCount = 1 + Math.round(shape.stability * 3);
  for (let i = 0; i < ringCount; i++) {
    const rr = 0.66 + i * 0.19;
    const ring = new THREE.Mesh(
      track(new THREE.TorusGeometry(rr, 0.016 + i * 0.004, 8, 56)),
      mats.platform,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.012 + i * 0.014;
    platform.add(ring);
  }
  const disc = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.6, 0.66, 0.035, 40)),
    mats.platform,
  );
  disc.position.y = -0.012;
  platform.add(disc);
  root.add(platform);

  /* ══════════ НОГИ ══════════ */
  function buildLeg(side: number) {
    const leg = new THREE.Group();
    const hipX = hipW * 0.46 * side;

    // Бедро: квадрицепс — объёмный сверху, сужается к колену
    const thigh = new THREE.Mesh(
      loft([
        { y: 0.0, r: limbR * 0.86, sx: 1.0, sz: 0.94 },
        { y: 0.18, r: limbR * 1.34, sx: 1.06, sz: 0.9 },
        { y: 0.42, r: limbR * 1.26, sx: 1.04, sz: 0.88 },
        { y: 0.72, r: limbR * 0.95, sx: 1.0, sz: 0.92 },
        { y: 0.86, r: limbR * 0.8, sx: 1.0, sz: 1.0 },
      ], 18),
      mats.skin,
    );
    thigh.position.set(hipX, 0.62, 0);
    thigh.castShadow = true;
    leg.add(thigh);

    // Колено
    const knee = new THREE.Mesh(blob(limbR * 0.8, 1, 0.8, 1, 12), mats.skinDark);
    knee.position.set(hipX, 0.6, 0.012);
    leg.add(knee);

    // Голень + икра: объём смещён назад и вверх
    const shin = new THREE.Mesh(
      loft([
        { y: 0.0, r: limbR * 0.62, sx: 1.0, sz: 1.0 },
        { y: 0.1, r: limbR * 0.72, sx: 1.0, sz: 1.0 },
        { y: 0.26, r: limbR * 0.95, sx: 0.96, sz: 1.14 },
        { y: 0.46, r: limbR * 0.78, sx: 0.94, sz: 1.0 },
        { y: 0.62, r: limbR * 0.56, sx: 0.92, sz: 0.9 },
      ], 16),
      mats.skin,
    );
    shin.position.set(hipX, -0.02, 0);
    shin.castShadow = true;
    leg.add(shin);

    // Стопа — с ростом Стабильности разворачивается наружу (устойчивее)
    const foot = new THREE.Mesh(
      track(new THREE.BoxGeometry(limbR * 1.7, 0.075, 0.31)),
      mats.skinDark,
    );
    foot.position.set(hipX, 0.038, 0.055);
    foot.rotation.y = side * (0.08 + shape.stability * 0.16);
    foot.castShadow = true;
    leg.add(foot);

    return leg;
  }

  const legL = buildLeg(1);
  const legR = buildLeg(-1);
  root.add(legL, legR);

  /* ══════════ ТОРС ══════════ */
  const torso = new THREE.Group();
  torso.position.y = 1.42;

  // Главный лофт: таз → талия → грудь → плечи. Здесь и живёт V-образность.
  const trunk = new THREE.Mesh(
    loft([
      { y: -0.30, r: hipW * 0.86, sx: 1.0, sz: 0.74 },
      { y: -0.16, r: waistW * 1.02, sx: 1.0, sz: 0.70 },
      { y: 0.0, r: waistW, sx: 1.0, sz: 0.68 },       // талия — самое узкое
      { y: 0.16, r: waistW * 1.30, sx: 1.0, sz: 0.76 },
      { y: 0.34, r: shoulderW * 0.74, sx: 1.0, sz: chestD / 0.34 },
      { y: 0.50, r: shoulderW * 0.97, sx: 1.0, sz: chestD / 0.36 },
      { y: 0.60, r: shoulderW * 0.78, sx: 1.0, sz: 0.80 },
    ], 28),
    mats.skin,
  );
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  torso.add(trunk);

  // Грудные мышцы: две плиты, форма естественная, не «сценический» бодибилдинг
  for (const side of [-1, 1]) {
    const pec = new THREE.Mesh(
      blob(0.155 + S * 0.055, 1.28, 0.86, 0.62, 16),
      mats.skin,
    );
    pec.position.set(side * (0.135 + S * 0.05), 0.44, chestD * 0.80);
    pec.rotation.z = side * -0.16;
    pec.castShadow = true;
    torso.add(pec);
  }
  // Разделение грудных
  const sternum = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.018, 0.2, 0.05)),
    mats.skinDark,
  );
  sternum.position.set(0, 0.44, chestD * 0.86);
  torso.add(sternum);

  /* ─── ПРЕСС: 6 кубиков + косые ─── */
  const absDepth = 0.18 + S * 0.55; // видимость растёт с Силой
  const absGroup = new THREE.Group();
  for (let row = 0; row < 3; row++) {
    for (const side of [-1, 1]) {
      const w = 0.088 - row * 0.006;
      const h = 0.062 - row * 0.004;
      const ab = new THREE.Mesh(
        blob(1, w, h, 0.055 + S * 0.02, 10),
        mats.skin,
      );
      ab.position.set(
        side * 0.058,
        0.22 - row * 0.115,
        waistW * 0.74 + 0.014,
      );
      ab.scale.setScalar(0.85 + absDepth * 0.35);
      absGroup.add(ab);
    }
  }
  // вертикальная белая линия (linea alba)
  const alba = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.012, 0.36, 0.04)),
    mats.skinDark,
  );
  alba.position.set(0, 0.11, waistW * 0.78);
  absGroup.add(alba);

  // косые мышцы
  for (const side of [-1, 1]) {
    const obl = new THREE.Mesh(blob(0.06, 0.7, 1.5, 0.6, 10), mats.skinDark);
    obl.position.set(side * (waistW * 0.80), 0.06, waistW * 0.34);
    obl.rotation.z = side * 0.42;
    absGroup.add(obl);
  }
  absGroup.visible = S > 0.12; // пресс проявляется по мере прокачки
  torso.add(absGroup);

  // Широчайшие: расширяют спину, усиливают V-силуэт
  for (const side of [-1, 1]) {
    const lat = new THREE.Mesh(
      blob(0.125 + S * 0.07, 0.62, 1.35, 0.66, 14),
      mats.skin,
    );
    // под подмышкой, не на талии: широчайшие расширяют ВЕРХ спины
    lat.position.set(side * (shoulderW * 0.46), 0.42, -chestD * 0.26);
    lat.rotation.z = side * 0.52;
    lat.castShadow = true;
    torso.add(lat);
  }

  // Трапеции — переход шея/плечи
  const trap = new THREE.Mesh(blob(0.14 + S * 0.05, 1.5, 0.62, 0.8, 14), mats.skin);
  trap.position.set(0, 0.60, -0.05);
  torso.add(trap);

  // Ядро (Интеллект) — светящийся кристалл в груди
  const core = new THREE.Mesh(
    track(new THREE.IcosahedronGeometry(0.072, 1)),
    mats.core,
  );
  core.position.set(0, 0.40, chestD * 0.92);
  torso.add(core);

  // Золотая отделка (Капитал)
  if (shape.wealth > 0.06) {
    const belt = new THREE.Mesh(
      track(new THREE.TorusGeometry(waistW * 1.06, 0.019, 8, 40)),
      mats.gold,
    );
    belt.rotation.x = Math.PI / 2;
    belt.position.y = -0.24;
    belt.scale.z = 0.72;
    torso.add(belt);

    if (shape.wealth > 0.3) {
      for (const side of [-1, 1]) {
        const stripe = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.016, 0.30, 0.02)),
          mats.gold,
        );
        stripe.position.set(side * 0.23, 0.42, chestD * 0.78);
        stripe.rotation.z = side * 0.2;
        torso.add(stripe);
      }
    }
  }
  root.add(torso);

  /* ══════════ РУКИ ══════════ */
  function buildArm(side: number) {
    const arm = new THREE.Group();
    // Точка подвеса — плечевой сустав
    arm.position.set(side * shoulderW * 0.5, 1.94, 0);

    // Дельта — круглая шапка плеча
    const delt = new THREE.Mesh(
      blob(0.105 + S * 0.058, 1.05, 0.95, 1.0, 16),
      mats.skin,
    );
    delt.castShadow = true;
    arm.add(delt);

    // Акцентная полоса на дельте — цвет Силы
    const band = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.098 + S * 0.05, 0.011, 8, 28)),
      mats.accent,
    );
    band.rotation.y = Math.PI / 2;
    band.rotation.x = 0.3;
    arm.add(band);

    // Плечо: бицепс спереди, трицепс сзади
    const upper = new THREE.Mesh(
      loft([
        { y: -0.44, r: limbR * 0.72, sx: 1.0, sz: 1.0 },
        { y: -0.30, r: limbR * 0.92, sx: 1.0, sz: 1.06 },
        { y: -0.16, r: limbR * 1.12, sx: 1.0, sz: 1.12 },
        { y: -0.04, r: limbR * 1.0, sx: 1.0, sz: 1.0 },
        { y: 0.02, r: limbR * 0.86, sx: 1.0, sz: 1.0 },
      ], 14),
      mats.skin,
    );
    upper.castShadow = true;
    arm.add(upper);

    // Локоть
    const elbow = new THREE.Mesh(blob(limbR * 0.68, 1, 0.85, 1, 10), mats.skinDark);
    elbow.position.y = -0.47;
    arm.add(elbow);

    // Предплечье: широкое у локтя, сухое к запястью
    const fore = new THREE.Mesh(
      loft([
        { y: -0.42, r: limbR * 0.5, sx: 1.0, sz: 1.0 },
        { y: -0.28, r: limbR * 0.62, sx: 1.0, sz: 1.0 },
        { y: -0.1, r: limbR * 0.84, sx: 1.04, sz: 1.0 },
        { y: 0.0, r: limbR * 0.76, sx: 1.0, sz: 1.0 },
      ], 12),
      mats.skin,
    );
    fore.position.y = -0.5;
    fore.castShadow = true;
    arm.add(fore);

    // Кисть
    const hand = new THREE.Mesh(
      blob(limbR * 0.62, 0.82, 1.25, 0.55, 10),
      mats.skinDark,
    );
    hand.position.y = -0.99;
    arm.add(hand);

    // Расслабленная стойка: руки немного отведены от корпуса.
    // Чем больше масса — тем сильнее разведены (широчайшие мешают).
    arm.rotation.z = side * (0.13 + S * 0.16);
    return arm;
  }

  const armL = buildArm(1);
  const armR = buildArm(-1);
  root.add(armL, armR);

  /* ══════════ ГОЛОВА ══════════ */
  const head = new THREE.Group();
  head.position.y = 2.16;

  // Шея — толстеет с Силой
  const neck = new THREE.Mesh(
    capsule(0.072 + S * 0.03, 0.1, 12),
    mats.skinDark,
  );
  neck.position.y = -0.1;
  head.add(neck);

  // Череп: слегка вытянут, скулы шире челюсти сверху
  const skull = new THREE.Mesh(
    loft([
      { y: -0.20, r: 0.088, sx: 1.0, sz: 1.06 },  // подбородок
      { y: -0.13, r: 0.115, sx: 1.0, sz: 1.05 },  // челюсть
      { y: -0.04, r: 0.136, sx: 1.0, sz: 1.02 },  // скулы
      { y: 0.06, r: 0.142, sx: 1.0, sz: 1.0 },
      { y: 0.15, r: 0.128, sx: 1.0, sz: 1.0 },
      { y: 0.21, r: 0.075, sx: 1.0, sz: 1.0 },    // темя
    ], 22),
    mats.skin,
  );
  skull.castShadow = true;
  head.add(skull);

  // Надбровные дуги — дают спокойный сосредоточенный взгляд
  const brow = new THREE.Mesh(
    blob(0.1, 1.02, 0.2, 0.72, 14),
    mats.skinDark,
  );
  brow.position.set(0, 0.028, 0.084);
  head.add(brow);

  // Глаза — минималистичные тёмные впадины, взгляд прямо
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(blob(0.03, 1.25, 0.62, 0.5, 10), mats.core);
    eye.position.set(side * 0.056, -0.005, 0.108);
    head.add(eye);
  }

  // Нос — одна плоскость, без лишней детализации
  const nose = new THREE.Mesh(blob(0.024, 0.7, 1.5, 1.1, 8), mats.skin);
  nose.position.set(0, -0.045, 0.125);
  head.add(nose);

  // Челюсть: очерченная, но без агрессии
  const jaw = new THREE.Mesh(blob(0.1, 1.0, 0.52, 0.9, 14), mats.skin);
  jaw.position.set(0, -0.132, 0.022);
  head.add(jaw);

  // Лёгкая щетина — проявляется с уровнем
  if (shape.level >= 5) {
    const stubble = new THREE.Mesh(blob(0.101, 1.0, 0.44, 0.88, 14), mats.skinDark);
    stubble.position.set(0, -0.15, 0.03);
    stubble.scale.setScalar(1.005);
    head.add(stubble);
  }

  // Волосы — короткая аккуратная форма
  const hair = new THREE.Mesh(blob(0.145, 1.0, 0.72, 1.0, 18), mats.skinDark);
  hair.position.set(0, 0.085, -0.012);
  hair.scale.setScalar(1.02);
  head.add(hair);

  // Визор (Интеллект) — тонкая светящаяся полоса
  if (shape.intelligence > 0.22) {
    const visor = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.13, 0.008, 8, 24, Math.PI * 0.7)),
      mats.core,
    );
    visor.rotation.set(0, 0, Math.PI * 0.86);
    visor.position.set(0, 0.012, 0.03);
    head.add(visor);
  }

  // Корона (Капитал)
  if (shape.wealth > 0.55) {
    const crown = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.108, 0.013, 8, 28)),
      mats.gold,
    );
    crown.rotation.x = Math.PI / 2;
    crown.position.y = 0.176;
    head.add(crown);
  }
  root.add(head);

  /* ══════════ АУРА ══════════ */
  let aura: THREE.Mesh | null = null;
  const auraPower = (shape.strength + shape.intelligence + shape.wealth + shape.stability) / 4;
  if (auraPower > 0.35) {
    aura = new THREE.Mesh(
      track(new THREE.SphereGeometry(1.5, 24, 16)),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(STAT_HEX[dominantStat({
          strength: shape.strength,
          intelligence: shape.intelligence,
          wealth: shape.wealth,
          stability: shape.stability,
        })]),
        transparent: true,
        opacity: 0.05 + auraPower * 0.05,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );
    aura.position.y = 1.4;
    aura.renderOrder = -1;
    aura.matrixAutoUpdate = false;
    aura.updateMatrix();
    root.add(aura);
  }

  /* ─── Осанка: новичок сутулится, прокачанный стоит прямо ─── */
  torso.rotation.x = (1 - posture) * 0.1;
  head.position.z = (1 - posture) * 0.07;
  head.rotation.x = (1 - posture) * 0.11;

  const owned = geoms.slice();
  const dispose = () => {
    owned.forEach((g) => g.dispose());
    Object.values(mats).forEach((m) => m.dispose());
    if (aura) (aura.material as THREE.Material).dispose();
  };

  return {
    root,
    torso,
    head,
    armL,
    armR,
    legL,
    legR,
    core,
    platform,
    aura,
    materials: mats,
    dispose,
  };
}
