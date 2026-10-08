import type { ReactNode } from "react";

/**
 * Общие детали схем конспектов: цвета темы, блок, стрелка, устройство,
 * перенос подписи, рамка SVG. Схемы лежат в NotesDiagram и в файлах рядом
 * (diagrams/<лекция>.tsx) — у каждой лекции свой файл, чтобы их можно было
 * писать параллельно.
 */

export type L = (ru: string, en: string) => string;
export const V = "#a78bfa"; // violet-400
export const G = "#34d399"; // emerald-400
export const A = "#fbbf24"; // amber-400
export const S = "#38bdf8"; // sky-400
export const R = "#f87171"; // red-400
export const F = "var(--color-surface-2)";
export const B = "var(--color-border-strong)";

export function Box({ x, y, w, h, label, sub, fill = F, stroke = B, size = 12 }: { x: number; y: number; w: number; h: number; label: string; sub?: string; fill?: string; stroke?: string; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 4)} textAnchor="middle" fontSize={size} fontWeight={600} fill="currentColor">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>{sub}</text>}
    </g>
  );
}
export function Arrow({ x1, y1, x2, y2, color = "currentColor", dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = x2 - 8 * Math.cos(a), hy = y2 - 8 * Math.sin(a);
  return (
    <g stroke={color} fill={color} strokeWidth={1.5}>
      <line x1={x1} y1={y1} x2={hx} y2={hy} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={`${x2},${y2} ${hx - 4 * Math.sin(a)},${hy + 4 * Math.cos(a)} ${hx + 4 * Math.sin(a)},${hy - 4 * Math.cos(a)}`} stroke="none" />
    </g>
  );
}
export function Device({ x, y, kind, label }: { x: number; y: number; kind: "pc" | "router" | "switch" | "server" | "cloud" | "hub"; label: string }) {
  return (
    <g>
      {kind === "pc" && <><rect x={x - 14} y={y - 12} width={28} height={18} rx={3} fill={F} stroke="currentColor" strokeWidth={1.5} /><rect x={x - 8} y={y + 8} width={16} height={3} fill="currentColor" /></>}
      {kind === "server" && <><rect x={x - 11} y={y - 14} width={22} height={28} rx={3} fill={F} stroke="currentColor" strokeWidth={1.5} /><line x1={x - 7} y1={y - 6} x2={x + 7} y2={y - 6} stroke="currentColor" /><line x1={x - 7} y1={y} x2={x + 7} y2={y} stroke="currentColor" /></>}
      {kind === "router" && <><circle cx={x} cy={y} r={14} fill={F} stroke={V} strokeWidth={1.5} /><path d={`M${x - 7} ${y - 3}h10M${x + 3} ${y - 3}l-3-3M${x + 3} ${y - 3}l-3 3M${x + 7} ${y + 3}h-10M${x - 3} ${y + 3}l3-3M${x - 3} ${y + 3}l3 3`} stroke={V} strokeWidth={1.5} fill="none" /></>}
      {kind === "switch" && <><rect x={x - 22} y={y - 9} width={44} height={18} rx={4} fill={F} stroke={S} strokeWidth={1.5} /><path d={`M${x - 14} ${y - 3}h8l-2-2M${x - 6} ${y - 3}l-2 2M${x + 14} ${y + 3}h-8l2-2M${x + 6} ${y + 3}l2 2`} stroke={S} strokeWidth={1.5} fill="none" /></>}
      {kind === "hub" && <rect x={x - 18} y={y - 7} width={36} height={14} rx={3} fill={F} stroke={A} strokeWidth={1.5} />}
      {kind === "cloud" && <path d={`M${x - 30} ${y + 8}a12 12 0 0 1 4-23a16 16 0 0 1 30-6a13 13 0 0 1 22 10a11 11 0 0 1-4 19z`} fill={F} stroke="currentColor" strokeWidth={1.5} />}
      <text x={x} y={y + 28} textAnchor="middle" fontSize={10} fill="currentColor">{label}</text>
    </g>
  );
}
/** Подпись в несколько строк: SVG сам текст не переносит. */
export function Wrap({ x, y, text, max = 18, size = 9, opacity = 0.8, gap = 11 }: { x: number; y: number; text: string; max?: number; size?: number; opacity?: number; gap?: number }) {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + word).length <= max) lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  return <>{lines.map((l, i) => <text key={i} x={x} y={y + i * gap} textAnchor="middle" fontSize={size} fill="currentColor" opacity={opacity}>{l}</text>)}</>;
}
export const Svg = ({ h, label, children }: { h: number; label: string; children: ReactNode }) => (
  <figure className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
    <svg viewBox={`0 0 360 ${h}`} role="img" aria-label={label} className="h-auto w-full text-[var(--color-fg)]" fontFamily="inherit">{children}</svg>
  </figure>
);


/** Схема: получает переводчик подписей t(ru, en). */
export type Draw = (t: L) => ReactNode;
