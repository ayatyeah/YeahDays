/**
 * Позы и анимация по костям.
 *
 * В GLB нет анимационных клипов — только скелет. Поэтому вместо
 * AnimationMixer мы каждый кадр считаем позу процедурно: берём
 * bind-кватернион кости и домножаем на смещение. Это дёшево
 * (66 костей) и позволяет плавно смешивать состояния.
 */

import * as THREE from "three";
import type { BoneMap, RiggedAvatar } from "./avatarRig";
import type { AvatarShape } from "./avatar3d";

const _q = new THREE.Quaternion();
const _e = new THREE.Euler();

/** Повернуть кость относительно её bind-позы. */
function pose(
  rig: RiggedAvatar,
  key: keyof BoneMap,
  x: number,
  y: number,
  z: number,
) {
  const bone = rig.bones[key];
  if (!bone) return;
  const base = rig.bind.get(bone);
  if (!base) return;
  _e.set(x, y, z);
  _q.setFromEuler(_e);
  bone.quaternion.copy(base).multiply(_q);
}

export interface PoseState {
  /** 0..1 — сила празднования */
  celebrate: number;
  /** взгляд за курсором, -1..1 */
  lookX: number;
  lookY: number;
}

/**
 * Idle + празднование. Всё смешивается в одну позу за кадр,
 * поэтому переходы не дёргаются.
 */
export function updatePose(
  rig: RiggedAvatar,
  shape: AvatarShape,
  t: number,
  st: PoseState,
) {
  const idle = 1 - st.celebrate;
  const c = st.celebrate;

  // ── дыхание: грудь поднимается, плечи чуть расходятся
  const breath = Math.sin(t * 1.25) * 0.5 + 0.5;
  const spineBreath = breath * 0.022 * idle;

  // ── перенос веса с ноги на ногу
  const shift = Math.sin(t * 0.5);
  const sway = shift * 0.03 * idle;

  // Осанка и развод рук уже вшиты в bind-базу (applyRestPose),
  // здесь только дельты поверх неё.

  /* ── Таз: покачивание при переносе веса ── */
  pose(rig, "pelvis", 0, sway * 0.4, sway * 0.5);

  /* ── Позвоночник: дыхание + осанка + компенсация покачивания ── */
  pose(rig, "spine", spineBreath * 0.4, -sway * 0.3, -sway * 0.3);
  pose(rig, "spine1", -spineBreath - c * 0.28, -sway * 0.2, 0);

  /* ── Шея и голова: следят за курсором ── */
  const lookY = st.lookX * 0.34 * idle;
  const lookX = -st.lookY * 0.2 * idle - c * 0.3;
  pose(rig, "neck", lookX * 0.4, lookY * 0.4, 0);
  pose(
    rig,
    "head",
    lookX * 0.6 + Math.sin(t * 0.9) * 0.012 * idle,
    lookY * 0.6,
    Math.sin(t * 0.7) * 0.01 * idle,
  );

  /* ── Ключицы: дыхание расширяет грудь ── */
  pose(rig, "clavL", 0, 0, -spineBreath * 0.5 - c * 0.2);
  pose(rig, "clavR", 0, 0, spineBreath * 0.5 + c * 0.2);

  /* ── Руки ──
   * Покой: маятник вдоль тела, развод зависит от массы.
   * Празднование: подъём вверх в victory-позу.
   */
  const swingL = Math.sin(t * 1.0) * 0.07 * idle;
  const swingR = Math.sin(t * 1.0 + Math.PI) * 0.07 * idle;

  /* Кости рук идут вдоль локальной X → подъём руки это вращение по Y.
     Victory: руки взлетают вверх и слегка в стороны. */
  const up = c * -2.5;
  const out = c * 0.45;

  pose(rig, "upperArmL", swingL * 0.4, up - out, swingL);
  pose(rig, "upperArmR", swingR * 0.4, -up + out, swingR);

  // локти: в победе сгибаются сильнее
  pose(rig, "foreArmL", 0, -c * 0.6, 0);
  pose(rig, "foreArmR", 0, c * 0.6, 0);

  // кисти чуть живые
  pose(rig, "handL", Math.sin(t * 1.3) * 0.05 * idle, -c * 0.25, 0);
  pose(rig, "handR", Math.sin(t * 1.3 + 1) * 0.05 * idle, c * 0.25, 0);

  /* ── Ноги: перенос веса, лёгкое сгибание при приземлении ── */
  const crouch = Math.sin(c * Math.PI) * 0.18;
  pose(rig, "thighL", crouch * 0.5, 0, -sway * 0.4);
  pose(rig, "thighR", crouch * 0.5, 0, -sway * 0.4);
  pose(rig, "calfL", -crouch, 0, 0);
  pose(rig, "calfR", -crouch, 0, 0);
  pose(rig, "footL", crouch * 0.5, 0, 0);
  pose(rig, "footR", crouch * 0.5, 0, 0);
}

/** Вертикальный подскок при праздновании. */
export function celebrateLift(c: number) {
  return Math.sin(c * Math.PI) * 0.34;
}
