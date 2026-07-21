/**
 * Загрузка и настройка риггованной модели персонажа (GLB + Biped-скелет).
 *
 * Модель: "Rigged Man" by Mr.Toadstool (Sketchfab), CC-BY-4.0.
 * См. public/models/CREDITS.md — лицензия требует указания автора.
 *
 * В файле нет анимаций, только скелет в bind-позе (66 костей: позвоночник,
 * ключицы, руки с пальцами, ноги, стопы). Поэтому позы и движение мы
 * авторим сами по костям — зато это настоящий скиннинг с деформацией
 * меша, а не иерархия примитивов.
 *
 * Статы влияют на кости: Сила расширяет ключицы/грудь и утолщает
 * конечности, Стабильность ставит стойку, Интеллект/Капитал работают
 * через материал и накладки.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { AvatarShape } from "./avatar3d";
import { STAT_HEX, dominantStat } from "./avatar3d";

/**
 * Путь к модели. Вынесен в env, чтобы модель можно было отдать
 * с CDN, а тесты — с локального сервера.
 */
export const MODEL_URL =
  (process.env.NEXT_PUBLIC_MODEL_ORIGIN ?? "") + "/models/rigged_man.glb";

/** Имена костей Biped, которые нам реально нужны. */
const B = {
  pelvis: "Bip001_Pelvis_02",
  spine: "Bip001_Spine_03",
  spine1: "Bip001_Spine1_04",
  neck: "Bip001_Neck_05",
  head: "Bip001_Head_054",
  clavL: "Bip001_L_Clavicle_06",
  clavR: "Bip001_R_Clavicle_030",
  upperArmL: "Bip001_L_UpperArm_07",
  upperArmR: "Bip001_R_UpperArm_031",
  foreArmL: "Bip001_L_Forearm_08",
  foreArmR: "Bip001_R_Forearm_032",
  handL: "Bip001_L_Hand_09",
  handR: "Bip001_R_Hand_033",
  thighL: "Bip001_L_Thigh_056",
  thighR: "Bip001_R_Thigh_060",
  calfL: "Bip001_L_Calf_057",
  calfR: "Bip001_R_Calf_061",
  footL: "Bip001_L_Foot_058",
  footR: "Bip001_R_Foot_062",
} as const;

/**
 * Нормализация имени кости: GLTFLoader заменяет пробелы на подчёркивания,
 * другие экспортёры — на точки или дефисы. Сравниваем по канону,
 * чтобы карта костей не разваливалась от версии загрузчика.
 */
function canon(n: string) {
  return n.toLowerCase().replace(/[\s._-]+/g, "");
}

export type BoneMap = Partial<Record<keyof typeof B, THREE.Bone>>;

export interface RiggedAvatar {
  root: THREE.Group;
  skinned: THREE.SkinnedMesh;
  bones: BoneMap;
  /** локальные кватернионы bind-позы — база для анимации */
  bind: Map<THREE.Bone, THREE.Quaternion>;
  core: THREE.Mesh;
  platform: THREE.Group;
  aura: THREE.Mesh | null;
  material: THREE.MeshStandardMaterial;
  dispose: () => void;
}

/* Кэш: парсим GLB один раз, дальше клонируем скелет. */
let cached: THREE.Group | null = null;
let pending: Promise<THREE.Group> | null = null;

function loadSource(): Promise<THREE.Group> {
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    new GLTFLoader().load(
      MODEL_URL,
      (gltf) => {
        cached = gltf.scene;
        resolve(cached);
      },
      undefined,
      reject,
    );
  });
  return pending;
}

/** Глубокое клонирование со скелетом (обычный clone() ломает скиннинг). */
function cloneSkinned(source: THREE.Object3D): THREE.Object3D {
  const clone = source.clone(true);

  const srcBones: THREE.Bone[] = [];
  const dstBones: THREE.Bone[] = [];
  source.traverse((o) => {
    if ((o as THREE.Bone).isBone) srcBones.push(o as THREE.Bone);
  });
  clone.traverse((o) => {
    if ((o as THREE.Bone).isBone) dstBones.push(o as THREE.Bone);
  });

  clone.traverse((o) => {
    const sm = o as THREE.SkinnedMesh;
    if (!sm.isSkinnedMesh) return;
    // найти оригинал по имени
    let orig: THREE.SkinnedMesh | null = null;
    source.traverse((s) => {
      const ss = s as THREE.SkinnedMesh;
      if (ss.isSkinnedMesh && ss.name === sm.name) orig = ss;
    });
    if (!orig) return;
    const o2 = orig as THREE.SkinnedMesh;
    const newBones = o2.skeleton.bones.map(
      (b) => dstBones[srcBones.indexOf(b)] ?? b,
    );
    sm.bind(
      new THREE.Skeleton(newBones, o2.skeleton.boneInverses),
      o2.bindMatrix,
    );
  });
  return clone;
}

/* ────────────────────  Пропорции от статов  ──────────────────── */

/**
 * Масштабирование костей. Скиннинг переносит масштаб кости на меш,
 * поэтому телосложение меняется без правки геометрии.
 */
/** Исходные длины смещений — чтобы масштаб не накапливался при пересборке. */
const restLen = new WeakMap<THREE.Bone, number>();

function applyPhysique(bones: BoneMap, shape: AvatarShape) {
  const S = shape.strength;

  /**
   * ВАЖНО: все кости этого рига вытянуты вдоль ЛОКАЛЬНОЙ X
   * (у каждой кости child.position = [len, 0, 0]). Значит:
   *   scale.x — ДЛИНА кости (двигает потомков, менять почти нельзя),
   *   scale.y / scale.z — ОБХВАТ (толщина мышц).
   * Раньше здесь было наоборот, из-за чего плечи «сужались».
   */

  // Ключицы: удлиняем (scale.x) — это и есть ширина плеч,
  // потому что ключица отодвигает плечевой сустав от центра.
  // Плюс сдвигаем сам сустав наружу: одного масштаба мало, дельта
  // сидит на кости плеча и должна уехать вбок вместе с ней.
  const clavLen = 1 + S * 0.30;
  bones.clavL?.scale.set(clavLen, 1 + S * 0.35, 1 + S * 0.35);
  bones.clavR?.scale.set(clavLen, 1 + S * 0.35, 1 + S * 0.35);

  // Ключица короткая, одного её масштаба мало. Дополнительно
  // отодвигаем плечевой сустав от центра — вместе с ним уезжает
  // дельтовидная масса, и плечи реально становятся шире.
  if (bones.upperArmL && bones.upperArmR) {
    const uaL = bones.upperArmL;
    const uaR = bones.upperArmR;
    const bl = restLen.get(uaL) ?? uaL.position.length();
    const br = restLen.get(uaR) ?? uaR.position.length();
    restLen.set(uaL, bl);
    restLen.set(uaR, br);
    const push = 1 + S * 0.14;
    uaL.position.setLength(bl * push);
    uaR.position.setLength(br * push);
  }

  // Грудная клетка: обхват по Y/Z, длина не трогаем.
  bones.spine1?.scale.set(1, 1 + S * 0.26, 1 + S * 0.30);
  // Талия: тоньше по обхвату — вместе с широкими плечами даёт V.
  bones.spine?.scale.set(1, 1 - S * 0.14, 1 - S * 0.12);
  // Таз чуть уже, иначе бёдра съедают V-силуэт.
  bones.pelvis?.scale.set(1, 1 - S * 0.10, 1 - S * 0.10);

  // Руки: обхват.
  const armT = 1 + S * 0.42;
  bones.upperArmL?.scale.set(1, armT, armT);
  bones.upperArmR?.scale.set(1, armT, armT);
  const foreT = 1 + S * 0.28;
  bones.foreArmL?.scale.set(1, foreT, foreT);
  bones.foreArmR?.scale.set(1, foreT, foreT);

  // Ноги: обхват.
  const thighT = 1 + S * 0.30;
  bones.thighL?.scale.set(1, thighT, thighT);
  bones.thighR?.scale.set(1, thighT, thighT);
  const calfT = 1 + S * 0.24;
  bones.calfL?.scale.set(1, calfT, calfT);
  bones.calfR?.scale.set(1, calfT, calfT);

  // Шея толстеет — признак тренированности.
  bones.neck?.scale.set(1, 1 + S * 0.20, 1 + S * 0.20);
}

/**
 * Стойка покоя. Новичок сутулится и держит руки ближе к телу,
 * прокачанный стоит прямо, руки разведены объёмом широчайших.
 */
export function applyRestPose(bones: BoneMap, shape: AvatarShape) {
  const S = shape.strength;
  const posture = 0.5 + S * 0.5;
  const stance = 0.35 + shape.stability * 0.65;

  const rx = (b: THREE.Bone | undefined, v: number) => b?.rotateX(v);
  const ry = (b: THREE.Bone | undefined, v: number) => b?.rotateY(v);

  // Осанка: сутулость уходит с ростом Силы.
  rx(bones.spine, (1 - posture) * 0.10);
  rx(bones.spine1, (1 - posture) * 0.07);
  rx(bones.neck, (1 - posture) * 0.10);
  rx(bones.head, -(1 - posture) * 0.05);

  /**
   * ВАЖНО: в этом Biped-риге кости конечностей идут вдоль ЛОКАЛЬНОЙ X
   * (foreArm.position = [6.78, 0, 0]), поэтому «поднять/опустить руку» —
   * это вращение вокруг Y, а не вокруг Z. Проверено замером угла
   * плечо→кисть: Y+0.5 даёт 32.8° → 12.1°.
   *
   * Bind — A-поза (~33° от вертикали). Опускаем руки вдоль корпуса;
   * масса не даёт прижать полностью, поэтому у прокачанного
   * развод остаётся заметно больше.
   */
  const drop = 0.40 - S * 0.10;
  ry(bones.upperArmL, drop);
  ry(bones.upperArmR, -drop);

  // Лёгкое сгибание локтя — иначе руки выглядят палками.
  ry(bones.foreArmL, 0.16);
  ry(bones.foreArmR, -0.16);

  // Стойка: стопы чуть врозь при высокой Стабильности.
  ry(bones.thighL, -stance * 0.04);
  ry(bones.thighR, stance * 0.04);
}

/* ────────────────────────  Сборка  ──────────────────────── */

export async function buildRiggedAvatar(
  shape: AvatarShape,
): Promise<RiggedAvatar> {
  const src = await loadSource();
  const model = cloneSkinned(src);

  let skinned: THREE.SkinnedMesh | null = null;
  const bones: BoneMap = {};
  const nameToKey = new Map<string, keyof typeof B>();
  (Object.keys(B) as (keyof typeof B)[]).forEach((k) =>
    nameToKey.set(canon(B[k]), k),
  );

  model.traverse((o) => {
    const sm = o as THREE.SkinnedMesh;
    if (sm.isSkinnedMesh && !skinned) skinned = sm;
    const bone = o as THREE.Bone;
    if (bone.isBone) {
      const key = nameToKey.get(canon(bone.name));
      if (key) bones[key] = bone;
    }
  });

  if (!skinned) throw new Error("SkinnedMesh not found in model");
  const missing = (Object.keys(B) as (keyof typeof B)[]).filter(
    (k) => !bones[k],
  );
  if (missing.length) {
    throw new Error(`Bones not resolved: ${missing.join(", ")}`);
  }
  const mesh = skinned as THREE.SkinnedMesh;

  /* Материал: матовый графит, теплеет с уровнем — как в процедурной версии. */
  const base = new THREE.Color("#4a4e5c").lerp(
    new THREE.Color("#79808f"),
    Math.min(1, shape.level / 45),
  );
  // NB: флага `skinning` в материале больше нет — three включает
  // скиннинг автоматически, если меш является SkinnedMesh.
  const material = new THREE.MeshStandardMaterial({
    color: base,
    roughness: 0.6,
    metalness: 0.36,
  });

  mesh.material = material;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;

  /* Нормализация масштаба: модель ~46.5 юнитов → приводим к ~3.4. */
  const root = new THREE.Group();
  const holder = new THREE.Group();
  holder.add(model);

  applyPhysique(bones, shape);
  applyRestPose(bones, shape);

  /**
   * Базовые кватернионы снимаем ПОСЛЕ стойки: updatePose каждый кадр
   * сбрасывает кость к базе и домножает смещение, поэтому база обязана
   * включать позу покоя — иначе анимация возвращала бы модель в A-позу.
   */
  const bind = new Map<THREE.Bone, THREE.Quaternion>();
  model.traverse((o) => {
    const b = o as THREE.Bone;
    if (b.isBone) bind.set(b, b.quaternion.clone());
  });

  // измерить реальную высоту после позы и посадить на пол
  holder.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(holder);
  const size = new THREE.Vector3();
  box.getSize(size);
  const scale = size.y > 0 ? 3.4 / size.y : 1;
  holder.scale.setScalar(scale);

  holder.updateMatrixWorld(true);
  const box2 = new THREE.Box3().setFromObject(holder);
  holder.position.y -= box2.min.y;
  root.add(holder);

  /* Ядро (Интеллект) — светящийся кристалл в груди, крепится к кости. */
  const coreMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(STAT_HEX.intelligence),
    roughness: 0.25,
    metalness: 0.1,
    emissive: new THREE.Color(STAT_HEX.intelligence),
    emissiveIntensity: 0.35 + shape.intelligence * 1.7,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 1), coreMat);
  if (bones.spine1) {
    core.position.set(0, 2.5, 5.4);
    bones.spine1.add(core);
  } else {
    core.position.set(0, 2.1, 0.3);
    root.add(core);
  }

  /* Пояс/корона (Капитал). */
  const goldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(STAT_HEX.wealth),
    roughness: 0.22,
    metalness: 0.92,
    emissive: new THREE.Color(STAT_HEX.wealth),
    emissiveIntensity: 0.1 + shape.wealth * 0.34,
  });
  if (shape.wealth > 0.06 && bones.pelvis) {
    const belt = new THREE.Mesh(
      new THREE.TorusGeometry(5.2, 0.55, 8, 36),
      goldMat,
    );
    belt.rotation.x = Math.PI / 2;
    belt.scale.z = 0.7;
    bones.pelvis.add(belt);
  }
  if (shape.wealth > 0.55 && bones.head) {
    const crown = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.42, 8, 28),
      goldMat,
    );
    crown.rotation.x = Math.PI / 2;
    crown.position.y = 4.6;
    bones.head.add(crown);
  }

  /* Платформа (Стабильность). */
  const platMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(STAT_HEX.stability),
    roughness: 0.35,
    metalness: 0.6,
    emissive: new THREE.Color(STAT_HEX.stability),
    emissiveIntensity: 0.14 + shape.stability * 0.55,
    transparent: true,
    opacity: 0.5 + shape.stability * 0.45,
  });
  const platform = new THREE.Group();
  const rings = 1 + Math.round(shape.stability * 3);
  for (let i = 0; i < rings; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.66 + i * 0.19, 0.016 + i * 0.004, 8, 48),
      platMat,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.012 + i * 0.014;
    platform.add(ring);
  }
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.66, 0.035, 36),
    platMat,
  );
  disc.position.y = -0.012;
  platform.add(disc);
  root.add(platform);

  /* Аура. */
  let aura: THREE.Mesh | null = null;
  const power =
    (shape.strength + shape.intelligence + shape.wealth + shape.stability) / 4;
  if (power > 0.35) {
    aura = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 24, 16),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(
          STAT_HEX[
            dominantStat({
              strength: shape.strength,
              intelligence: shape.intelligence,
              wealth: shape.wealth,
              stability: shape.stability,
            })
          ],
        ),
        transparent: true,
        opacity: 0.05 + power * 0.05,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );
    aura.position.y = 1.6;
    root.add(aura);
  }

  const dispose = () => {
    material.dispose();
    coreMat.dispose();
    goldMat.dispose();
    platMat.dispose();
    core.geometry.dispose();
    platform.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.geometry.dispose();
    });
    if (aura) {
      aura.geometry.dispose();
      (aura.material as THREE.Material).dispose();
    }
    // геометрия меша общая с кэшем — не диспозим
  };

  return { root, skinned: mesh, bones, bind, core, platform, aura, material, dispose };
}
