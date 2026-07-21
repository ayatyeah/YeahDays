"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  normalizeStats,
  dominantStat,
  STAT_HEX,
  type AvatarStats,
} from "@/lib/avatar3d";
import { buildRiggedAvatar, type RiggedAvatar } from "@/lib/avatarRig";
import { updatePose, celebrateLift } from "@/lib/avatarPose";

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
  const rigRef = useRef<RiggedAvatar | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const celebrateRef = useRef({ last: 0, t: -1 });
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const shapeRef = useRef(normalizeStats(stats, level));
  const accentRef = useRef<THREE.PointLight | null>(null);
  const [failed, setFailed] = useState(false);

  /* ── Инициализация сцены (один раз) ── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 1.95, 6.6);
    camera.lookAt(0, 1.65, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    /* ── Свет ── */
    scene.add(new THREE.HemisphereLight(0xbfcadf, 0x14161c, 1.45));

    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(3.2, 6.4, 4.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -1;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 20;
    key.shadow.bias = -0.0012;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x9fb4ff, 2.1);
    rim.position.set(-4, 3.4, -3.6);
    scene.add(rim);

    const accent = new THREE.PointLight(0xff9a7a, 1.5, 14);
    accent.position.set(2, 1.7, 3);
    accentRef.current = accent;
    scene.add(accent);

    /* Пол — ловит только тень */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.4 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    /* ── Видимость: не крутим rAF за экраном ── */
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(mount);

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    /* ── Указатель ── */
    const onMove = (e: PointerEvent) => {
      if (!interactive) return;
      const r = mount.getBoundingClientRect();
      pointerRef.current.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointerRef.current.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => {
      pointerRef.current.tx = 0;
      pointerRef.current.ty = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    mount.addEventListener("pointerleave", onLeave);

    const clock = new THREE.Clock();
    let raf = 0;
    let prevT = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const t = clock.getElapsedTime();
      const dt = Math.min(0.05, t - prevT);
      prevT = t;
      const rig = rigRef.current;

      if (rig) {
        // плавное слежение за курсором
        const p = pointerRef.current;
        p.x += (p.tx - p.x) * 0.07;
        p.y += (p.ty - p.y) * 0.07;

        // прогресс празднования
        const c = celebrateRef.current;
        if (c.t >= 0) {
          c.t += dt;
          if (c.t > 1.25) c.t = -1;
        }
        const cel = c.t >= 0 ? Math.sin(Math.min(1, c.t / 1.25) * Math.PI) : 0;

        if (!reduceMotion) {
          updatePose(rig, shapeRef.current, t, {
            celebrate: cel,
            lookX: p.x,
            lookY: p.y,
          });
          rig.root.position.y = celebrateLift(
            c.t >= 0 ? Math.min(1, c.t / 1.25) : 0,
          );
          rig.root.rotation.y = p.x * 0.22;
        }

        // ядро-сердце: вращение + пульс
        rig.core.rotation.y = t * 0.7;
        rig.core.rotation.x = t * 0.35;
        rig.core.scale.setScalar(
          1 + Math.sin(t * 2.6) * 0.09 + cel * 0.5,
        );
        const coreMat = rig.core.material as THREE.MeshStandardMaterial;
        coreMat.emissiveIntensity =
          0.35 + shapeRef.current.intelligence * 1.7 + cel * 2.4;

        // платформа медленно вращается
        rig.platform.rotation.y = t * 0.16;

        if (rig.aura) {
          rig.aura.scale.setScalar(1 + Math.sin(t * 0.9) * 0.03 + cel * 0.12);
        }
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerleave", onLeave);
      rigRef.current?.dispose();
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  /* ── Пересборка персонажа при изменении статов/уровня ── */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || failed) return;

    let cancelled = false;
    const shape = normalizeStats(stats, level);
    shapeRef.current = shape;

    buildRiggedAvatar(shape)
      .then((rig) => {
        if (cancelled) {
          rig.dispose();
          return;
        }
        if (rigRef.current) {
          scene.remove(rigRef.current.root);
          rigRef.current.dispose();
        }
        rig.root.scale.setScalar(scale);
        scene.add(rig.root);
        rigRef.current = rig;

        // акцентный свет подхватывает доминирующий стат
        const light = accentRef.current;
        if (light) light.color = new THREE.Color(STAT_HEX[dominantStat(stats)]);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [
    stats.strength,
    stats.intelligence,
    stats.wealth,
    stats.stability,
    level,
    scale,
    failed,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ]);

  /* ── Триггер празднования ── */
  useEffect(() => {
    if (celebrate !== celebrateRef.current.last) {
      celebrateRef.current.last = celebrate;
      if (celebrate > 0) celebrateRef.current.t = 0;
    }
  }, [celebrate]);

  /* Без WebGL — не ломаем экран, показываем инициал уровня */
  if (failed) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: `${STAT_HEX[dominantStat(stats)]}22`,
            color: STAT_HEX[dominantStat(stats)],
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          {level}
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className={className} />;
}
