interface LiquidBackgroundProps {
  percentage: number
  hexColor: string
}

export function LiquidBackground({ percentage, hexColor }: LiquidBackgroundProps) {
  const topPosition = `${78 - percentage * 0.55}%`
  const secondaryTop = `${Math.max(10, 86 - percentage * 0.42)}%`

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/35" />

      <div
        className="liquid-blob"
        style={{
          top: topPosition,
          background: `radial-gradient(circle at 30% 30%, ${hexColor}AA 0%, ${hexColor}22 80%)`,
        }}
      />

      <div
        className="liquid-blob secondary"
        style={{
          top: secondaryTop,
          left: '62%',
          background: `radial-gradient(circle at 60% 40%, ${hexColor}88 0%, ${hexColor}18 78%)`,
        }}
      />

      <div className="liquid-aurora" />

      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: `linear-gradient(180deg, ${hexColor}1F 0%, transparent 50%, #020617B0 100%)`,
        }}
      />
    </div>
  )
}
