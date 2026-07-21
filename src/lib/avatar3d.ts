/**
 * Процедурный 3D-персонаж.
 *
 * Тело собирается из примитивов, но пропорции — не константы, а функция
 * от статов пользователя. Поэтому персонаж не «переключается» между
 * 3 картинками, а плавно растёт: качаешь Силу — шире плечи и грудь,
 * Интеллект — ярче ядро-сердце, Капитал — золотая отделка,
 * Стабильность — устойчивая платформа под ногами.
 *
 * Всё на MeshStandardMaterial + один HemisphereLight и 3 источника:
 * дёшево для мобильного GPU, но выглядит как премиальный рендер.
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
  const n = (v: number) => Math.min(1, Math.log10(1 + v / 40) / Math.log10(1 + 60 / 40));
  return {
    strength: n(stats.strength),
    intelligence: n(stats.intelligence),
    wealth: n(stats.wealth),
    stability: n(stats.stability),
    level,
  };
}

/* ────────────────────────  Материалы  ──────────────────────── */

interface Materials {
  skin: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  core: THREE.MeshStandardMaterial;
  gold: THREE.MeshStandardMaterial;
  platform: THREE.MeshStandardMaterial;
}

function makeMaterials(shape: AvatarShape): Materials {
  // база тела светлеет и теплеет с ростом уровня
  const bodyColor = new THREE.Color("#3a3d4a").lerp(
    new THREE.Color("#8e93a8"),
    Math.min(1, shape.level / 60),
  );

  const skin = new THREE.MeshStandardMaterial({
    color: bodyColor,
    roughness: 0.42,
    metalness: 0.22,
    envMapIntensity: 0.9,
  });

  // акцент подхватывает доминирующий стат
  const accent = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#f97362"),
    roughness: 0.3,
    metalness: 0.5,
  });

  const core = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#8b7cf6"),
    emissive: new THREE.Color("#8b7cf6"),
    emissiveIntensity: 0.6 + shape.intelligence * 2.2,
    roughness: 0.15,
    metalness: 0.1,
  });

  const gold = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#f0b23f"),
    roughness: 0.18,
    metalness: 0.95,
    emissive: new THREE.Color("#f0b23f"),
    emissiveIntensity: shape.wealth * 0.35,
  });

  const platform = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#3fbf9a"),
    roughness: 0.25,
    metalness: 0.6,
    transparent: true,
    opacity: 0.25 + shape.stability * 0.45,
    emissive: new THREE.Color("#3fbf9a"),
    emissiveIntensity: shape.stability * 0.5,
  });

  return { skin, accent, core, gold, platform };
}

/* ────────────────────────  Сборка тела  ──────────────────────── */

export interface AvatarRig {
  root: THREE.Group;
  /** узлы для анимации */
  torso: THREE.Group;
  head: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  core: THREE.Mesh;
  platform: THREE.Group;
  aura: THREE.Mesh | null;
  materials: Materials;
  dispose: () => void;
}

/** Капсула вручную — CapsuleGeometry есть в r185, но так надёжнее и легче. */
function capsule(r: number, h: number, seg = 16) {
  return new THREE.CapsuleGeometry(r, h, 4, seg);
}

export function buildAvatar(shape: AvatarShape): AvatarRig {
  const mats = makeMaterials(shape);
  const disposables: (THREE.BufferGeometry | THREE.Material)[] = [
    ...Object.values(mats),
  ];
  const track = <T extends THREE.BufferGeometry>(g: T) => {
    disposables.push(g);
    return g;
  };

  const root = new THREE.Group();

  // ── пропорции как функция статов ──
  const s = shape.strength;
  const shoulderW = 0.42 + s * 0.30;   // плечи
  const chestR = 0.26 + s * 0.13;      // грудь
  const armR = 0.085 + s * 0.05;       // толщина рук
  const legR = 0.105 + s * 0.045;
  const waistR = 0.20 + s * 0.05;
  const height = 1 + shape.level / 400; // очень мягкий рост

  /* ── Платформа (Стабильность) ── */
  const platform = new THREE.Group();
  const discG = track(new THREE.CylinderGeometry(0.62, 0.68, 0.045, 48));
  const disc = new THREE.Mesh(discG, mats.platform);
  disc.position.y = 0.022;
  disc.receiveShadow = true;
  platform.add(disc);

  // кольца устойчивости — их количество растёт со стабильностью
  const ringCount = 1 + Math.round(shape.stability * 2);
  for (let i = 0; i < ringCount; i++) {
    const rg = track(
      new THREE.TorusGeometry(0.72 + i * 0.13, 0.006, 8, 64),
    );
    const ring = new THREE.Mesh(rg, mats.platform);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01 + i * 0.004;
    platform.add(ring);
  }
  root.add(platform);

  /* ── Ноги ── */
  const legs = new THREE.Group();
  const legG = track(capsule(legR, 0.44));
  for (const dir of [-1, 1]) {
    const leg = new THREE.Mesh(legG, mats.skin);
    leg.position.set(dir * 0.13, 0.34, 0);
    leg.castShadow = true;
    legs.add(leg);

    const footG = track(new THREE.BoxGeometry(0.16, 0.06, 0.24));
    const foot = new THREE.Mesh(footG, mats.skin);
    foot.position.set(dir * 0.13, 0.06, 0.03);
    foot.castShadow = true;
    legs.add(foot);
  }
  root.add(legs);

  /* ── Торс ── */
  const torso = new THREE.Group();
  torso.position.y = 0.62;

  const chestG = track(capsule(chestR, 0.30));
  const chest = new THREE.Mesh(chestG, mats.skin);
  chest.position.y = 0.20;
  chest.scale.set(1, 1, 0.72);
  chest.castShadow = true;
  torso.add(chest);

  const waistG = track(capsule(waistR, 0.14));
  const waist = new THREE.Mesh(waistG, mats.skin);
  waist.position.y = -0.03;
  waist.scale.set(1, 1, 0.7);
  waist.castShadow = true;
  torso.add(waist);

  // Плечевые «наплечники» — главный визуальный маркер Силы
  const deltG = track(new THREE.SphereGeometry(0.11 + s * 0.07, 20, 16));
  for (const dir of [-1, 1]) {
    const delt = new THREE.Mesh(deltG, s > 0.35 ? mats.accent : mats.skin);
    delt.position.set(dir * shoulderW * 0.5, 0.32, 0);
    delt.scale.set(1, 0.85, 0.9);
    delt.castShadow = true;
    torso.add(delt);
  }

  // Ядро-сердце (Интеллект) — светится изнутри груди
  const coreG = track(new THREE.IcosahedronGeometry(0.075 + shape.intelligence * 0.05, 1));
  const core = new THREE.Mesh(coreG, mats.core);
  core.position.set(0, 0.24, chestR * 0.62);
  torso.add(core);

  // Золотые полосы (Капитал) — появляются по мере роста
  if (shape.wealth > 0.12) {
    const stripes = 1 + Math.round(shape.wealth * 3);
    for (let i = 0; i < stripes; i++) {
      const sg = track(new THREE.TorusGeometry(chestR * 0.98, 0.012, 8, 40, Math.PI * 1.2));
      const stripe = new THREE.Mesh(sg, mats.gold);
      stripe.position.y = 0.10 + i * 0.075;
      stripe.rotation.x = Math.PI / 2;
      stripe.rotation.z = -Math.PI * 0.6;
      stripe.scale.z = 0.72;
      torso.add(stripe);
    }
  }
  root.add(torso);

  /* ── Руки ── */
  const upperG = track(capsule(armR, 0.22));
  const foreG = track(capsule(armR * 0.86, 0.20));
  const handG = track(new THREE.SphereGeometry(armR * 1.15, 14, 12));

  function makeArm(dir: number) {
    const arm = new THREE.Group();
    arm.position.set(dir * shoulderW * 0.52, 0.94, 0);

    const upper = new THREE.Mesh(upperG, mats.skin);
    upper.position.y = -0.15;
    upper.castShadow = true;
    arm.add(upper);

    const fore = new THREE.Mesh(foreG, mats.skin);
    fore.position.y = -0.40;
    fore.castShadow = true;
    arm.add(fore);

    const hand = new THREE.Mesh(handG, mats.skin);
    hand.position.y = -0.55;
    arm.add(hand);

    return arm;
  }
  const armL = makeArm(-1);
  const armR2 = makeArm(1);
  root.add(armL, armR2);

  /* ── Голова ── */
  const head = new THREE.Group();
  head.position.y = 1.06;

  const headG = track(new THREE.SphereGeometry(0.155, 28, 24));
  const headMesh = new THREE.Mesh(headG, mats.skin);
  headMesh.scale.set(1, 1.12, 0.94);
  headMesh.castShadow = true;
  head.add(headMesh);

  const neckG = track(capsule(0.055, 0.06));
  const neck = new THREE.Mesh(neckG, mats.skin);
  neck.position.y = -0.15;
  head.add(neck);

  // визор — «лицо» без лица: премиально и не мультяшно
  const visorG = track(new THREE.SphereGeometry(0.158, 28, 24, Math.PI * 0.15, Math.PI * 0.7, Math.PI * 0.34, Math.PI * 0.3));
  const visorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0d0d12"),
    roughness: 0.08,
    metalness: 0.9,
    emissive: new THREE.Color("#8b7cf6"),
    emissiveIntensity: 0.15 + shape.intelligence * 0.6,
  });
  disposables.push(visorMat);
  const visor = new THREE.Mesh(visorG, visorMat);
  visor.scale.set(1, 1.12, 0.94);
  visor.rotation.y = -Math.PI / 2;
  head.add(visor);

  // корона (Капитал на высоком уровне)
  if (shape.wealth > 0.55) {
    const crownG = track(new THREE.TorusGeometry(0.115, 0.014, 8, 32));
    const crown = new THREE.Mesh(crownG, mats.gold);
    crown.position.y = 0.15;
    crown.rotation.x = Math.PI / 2;
    head.add(crown);
  }
  root.add(head);

  /* ── Аура (общий уровень) ── */
  let aura: THREE.Mesh | null = null;
  const auraStrength = Math.min(1, shape.level / 50);
  if (auraStrength > 0.05) {
    const auraG = track(new THREE.SphereGeometry(1.05, 32, 24));
    const auraMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#8fb8ff"),
      transparent: true,
      opacity: 0.05 * auraStrength,
      side: THREE.BackSide,
      depthWrite: false,
    });
    disposables.push(auraMat);
    aura = new THREE.Mesh(auraG, auraMat);
    aura.position.y = 0.75;
    root.add(aura);
  }

  // общий рост
  root.scale.setScalar(height);

  return {
    root,
    torso,
    head,
    armL,
    armR: armR2,
    core,
    platform,
    aura,
    materials: mats,
    dispose: () => {
      for (const d of disposables) d.dispose();
    },
  };
}

/** Доминирующий стат — используется для подсветки сцены. */
export function dominantStat(stats: AvatarStats): StatKey {
  const entries = Object.entries(stats) as [StatKey, number][];
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

export const STAT_HEX: Record<StatKey, string> = {
  strength: "#f97362",
  intelligence: "#8b7cf6",
  wealth: "#f0b23f",
  stability: "#3fbf9a",
};
