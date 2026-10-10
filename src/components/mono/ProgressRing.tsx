import type { ReactNode } from "react";

export default function ProgressRing({
  value,
  max,
  label,
  children,
  tone = "ink",
}: {
  value: number;
  max: number;
  label: string;
  children: ReactNode;
  tone?: "ink" | "sage" | "stone";
}) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <span
      className={`mono-ring mono-ring-${tone}`}
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle className="mono-ring-track" cx="40" cy="40" r="34" />
        <circle
          className="mono-ring-fill"
          opacity={ratio > 0 ? 1 : 0}
          cx="40"
          cy="40"
          r="34"
          pathLength="100"
          strokeDasharray={`${ratio * 100} 100`}
          transform="rotate(-90 40 40)"
        />
      </svg>
      <b aria-hidden="true">{children}</b>
    </span>
  );
}
