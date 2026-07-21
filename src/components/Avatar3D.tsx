"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  buildAvatar,
  normalizeStats,
  dominantStat,
  STAT_HEX,
  type AvatarStats,
  type AvatarRig,
} from "@/lib/avatar3d";

interface Avatar3DProps {
  stats: AvatarStats;
  level: number;
  className?: string;
  /** увеличить — для страницы прогресса, уменьшить — для карточек */
  scale?: number;
  /** реагировать на движение пальца/мыши */
  interactive?: boolean;
  /** триггер празднования: меняем число — персонаж радуется */
  celebrate?: number;
}

export default function Avatar3D({
  stats,
  level,
  className,
  scale = 1,
  interactive = true,
  celebrate = 0,
}: Avatar3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<AvatarRig | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const celebrateRef = useRef({ last: 0, t: -1 });
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  /* ── Инициализация сцены (один раз) ── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 1.15, 4.4);
    camera.lookAt(0, 0.85, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // нет WebGL — компонент просто не рисует, приложение живёт
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    /* ── Свет ── */
    const hemi = new THREE.HemisphereLight(0xbcd4ff, 0x14141b, 0.85);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(2.6, 4.2, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 14;
    key.shadow.camera.left = -2.5;
    key.shadow.camera.right = 2.5;
    key.shadow.camera.top = 3;
    key.shadow.camera.bottom = -1;
    key.shadow.bias = -0.0012;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x8fb8ff, 1.5);
    rim.position.set(-3, 2.2, -2.6);
    scene.add(rim);

    // цветной подсвет снизу — подхватывает доминирующий стат
    const accentLight = new THREE.PointLight(0x8b7cf6, 2.2, 8, 2);
    accentLight.position.set(0, 0.25, 1.4);
    scene.add(accentLight);

    // «пол» — ловит тень, сам невидим
    const floorG = new THREE.PlaneGeometry(14, 14);
    const floorM = new THREE.ShadowMaterial({ opacity: 0.38 });
    const floor = new THREE.Mesh(floorG, floorM);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    /* ── Размер ── */
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    /* ── Указатель ── */
    const onPointer = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      pointerRef.current.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointerRef.current.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      pointerRef.current.tx = 0;
      pointerRef.current.ty = 0;
    };
    if (interactive) {
      mount.addEventListener("pointermove", onPointer);
      mount.addEventListener("pointerleave", onLeave);
    }

    /* ── Цикл анимации ── */
    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    io.observe(mount);

    let prevT = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const t = clock.getElapsedTime();
      const dt = Math.min(0.05, t - prevT);
      prevT = t;
      const rig = rigRef.current;

      // плавное следование за пальцем
      const p = pointerRef.current;
      p.x += (p.tx - p.x) * 0.06;
      p.y += (p.ty - p.y) * 0.06;

      if (rig) {
        const idle = reduceMotion ? 0 : 1;

        // дыхание
        const breath = Math.sin(t * 1.15) * 0.014 * idle;
        rig.torso.scale.set(1 + breath * 0.5, 1 + breath, 1 + breath * 0.5);
        rig.torso.position.y = 0.62 + breath * 0.6;

        // лёгкое покачивание всего тела
        rig.root.rotation.y = p.x * 0.42 + Math.sin(t * 0.42) * 0.05 * idle;
        rig.root.rotation.x = p.y * 0.09;
        rig.root.position.y = Math.sin(t * 1.15) * 0.012 * idle;

        // голова смотрит чуть активнее корпуса
        rig.head.rotation.y = p.x * 0.24;
        rig.head.rotation.x = p.y * 0.16 + Math.sin(t * 0.9) * 0.02 * idle;

        // руки: расслабленные маятники
        rig.armL.rotation.x = Math.sin(t * 1.05) * 0.07 * idle;
        rig.armR.rotation.x = Math.sin(t * 1.05 + Math.PI) * 0.07 * idle;
        // базовый развод рук задаётся телосложением в buildAvatar —
        // здесь только дышим вокруг него, иначе накачанный персонаж
        // прижимал бы руки к корпусу
        rig.armL.rotation.z = restZ.current + Math.sin(t * 0.8) * 0.02 * idle;
        rig.armR.rotation.z = -restZ.current - Math.sin(t * 0.8) * 0.02 * idle;

        // перенос веса с ноги на ногу — стойка не выглядит окаменевшей
        const shift = Math.sin(t * 0.52) * 0.014 * idle;
        rig.legL.position.y = shift;
        rig.legR.position.y = -shift;
        rig.legL.rotation.z = shift * 0.5;
        rig.legR.rotation.z = shift * 0.5;

        // ядро-сердце: вращение + пульс
        rig.core.rotation.y = t * 0.7;
        rig.core.rotation.x = t * 0.35;
        const pulse = 1 + Math.sin(t * 2.6) * 0.09 * idle;
        rig.core.scale.setScalar(pulse);

        // платформа медленно вращается
        rig.platform.rotation.y = t * 0.16;

        if (rig.aura) {
          const a = 1 + Math.sin(t * 0.9) * 0.03;
          rig.aura.scale.setScalar(a);
        }

        /* ── Празднование ── */
        const c = celebrateRef.current;
        if (c.t >= 0) {
          c.t += dt;
          const k = Math.min(1, c.t / 1.15);
          // прыжок с приземлением
          const jump = Math.sin(k * Math.PI) * 0.30;
          rig.root.position.y += jump;
          // руки вверх
          const raise = Math.sin(k * Math.PI) * 2.5;
          rig.armL.rotation.x -= raise;
          rig.armR.rotation.x -= raise;
          rig.root.rotation.y += Math.sin(k * Math.PI * 2) * 0.25;
          // вспышка ядра
          const mat = rig.materials.core;
          mat.emissiveIntensity =
            0.6 + Math.sin(k * Math.PI) * 3.5 + (rigShapeRef.current ?? 0) * 2.2;
          if (k >= 1) {
            c.t = -1;
            mat.emissiveIntensity = 0.6 + (rigShapeRef.current ?? 0) * 2.2;
          }
        }
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      if (interactive) {
        mount.removeEventListener("pointermove", onPointer);
        mount.removeEventListener("pointerleave", onLeave);
      }
      floorG.dispose();
      floorM.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, [interactive]);

  // держим нормализованный intelligence, чтобы вернуть свечение после вспышки
  const rigShapeRef = useRef<number>(0);
  /** базовый развод рук — зависит от мышечной массы */
  const restZ = useRef<number>(0.13);

  /* ── Пересборка тела при изменении статов ── */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const shape = normalizeStats(stats, level);
    rigShapeRef.current = shape.intelligence;
    restZ.current = 0.13 + shape.strength * 0.16;

    // снимаем старый риг
    if (rigRef.current) {
      scene.remove(rigRef.current.root);
      rigRef.current.dispose();
      rigRef.current = null;
    }

    const rig = buildAvatar(shape);
    rig.root.scale.multiplyScalar(scale);
    scene.add(rig.root);
    rigRef.current = rig;

    // подсветка под доминирующий стат
    const dom = dominantStat(stats);
    const light = scene.children.find(
      (c): c is THREE.PointLight => c instanceof THREE.PointLight,
    );
    if (light) light.color.set(STAT_HEX[dom]);

    return () => {
      if (rigRef.current) {
        scene.remove(rigRef.current.root);
        rigRef.current.dispose();
        rigRef.current = null;
      }
    };
  }, [
    stats.strength,
    stats.intelligence,
    stats.wealth,
    stats.stability,
    level,
    scale,
    stats,
  ]);

  /* ── Триггер празднования ── */
  useEffect(() => {
    if (celebrate > celebrateRef.current.last) {
      celebrateRef.current.last = celebrate;
      celebrateRef.current.t = 0;
    }
  }, [celebrate]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ touchAction: "pan-y" }}
      aria-label={`Персонаж, уровень ${level}`}
      role="img"
    />
  );
}
