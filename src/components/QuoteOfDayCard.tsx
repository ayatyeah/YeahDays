import { GlassCard } from './GlassCard'

interface QuoteOfDayCardProps {
  jp: string
  ru: string
  author: string
}

export function QuoteOfDayCard({ jp, ru, author }: QuoteOfDayCardProps) {
  return (
    <GlassCard className="quote-card space-y-2 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300/75">Quote of the day</p>
      <p className="text-base leading-relaxed text-white/95">「{jp}」</p>
      <p className="text-sm leading-relaxed text-slate-200/88">{ru}</p>
      <p className="text-xs text-slate-300/70">— {author}</p>
    </GlassCard>
  )
}
