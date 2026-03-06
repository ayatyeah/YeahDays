interface ProgressBarProps {
  percentage: number
  colorHex: string
}

export function ProgressBar({ percentage, colorHex }: ProgressBarProps) {
  return (
    <div className="h-3.5 w-full overflow-hidden rounded-full bg-white/15">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${colorHex}CC 0%, ${colorHex} 100%)`,
        }}
      />
    </div>
  )
}
