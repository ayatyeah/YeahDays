import clsx from 'clsx'
import { getMonthGrid, toISODate, weekOrder } from '../utils/dateUtils'

interface DayCellInfo {
  color: string
  percentage: number
}

interface CalendarGridProps {
  monthDate: Date
  selectedDate: string
  onSelectDate: (date: string) => void
  getDayInfo: (date: string) => DayCellInfo
}

const weekdayLabels = weekOrder.map((day) => day.slice(0, 1).toUpperCase())

export function CalendarGrid({
  monthDate,
  selectedDate,
  onSelectDate,
  getDayInfo,
}: CalendarGridProps) {
  const cells = getMonthGrid(monthDate)
  const month = monthDate.getMonth()

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-300/80">
        {weekdayLabels.map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((date) => {
          const isoDate = toISODate(date)
          const info = getDayInfo(isoDate)
          const active = isoDate === selectedDate
          const isCurrentMonth = date.getMonth() === month

          return (
            <button
              key={isoDate}
              type="button"
              className={clsx(
                'calendar-day flex aspect-square min-h-10 items-center justify-center rounded-xl text-xs font-medium ring-1 ring-white/18',
                active && 'active',
                isCurrentMonth ? 'text-white' : 'text-white/45',
              )}
              style={{ backgroundColor: `${info.color}${isCurrentMonth ? 'CC' : '66'}` }}
              onClick={() => onSelectDate(isoDate)}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
