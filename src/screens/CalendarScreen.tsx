import { useMemo, useState } from 'react'
import { CalendarGrid } from '../components/CalendarGrid'
import { GlassCard } from '../components/GlassCard'
import { useAppStore } from '../store/useAppStore'
import { getFullDisplayDate, getMonthTitle, shiftMonth } from '../utils/dateUtils'
import { getScheduledTasksForDate, getScoreSummary } from '../utils/scoreUtils'

export function CalendarScreen() {
  const { tasks, records, selectedDate, setSelectedDate } = useAppStore()
  const [monthDate, setMonthDate] = useState(new Date())

  const selectedInfo = useMemo(() => {
    const dayTasks = getScheduledTasksForDate(tasks, selectedDate)
    const completedIds = records[selectedDate]?.completedTaskIds ?? []
    const score = getScoreSummary(dayTasks, completedIds)

    return {
      ...score,
      dayTasks,
      completedCount: completedIds.length,
    }
  }, [records, selectedDate, tasks])

  return (
    <>
      <GlassCard className="space-y-4 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="glass-chip text-base"
            onClick={() => setMonthDate((current) => shiftMonth(current, -1))}
          >
            ←
          </button>

          <h2 className="text-base font-semibold">{getMonthTitle(monthDate)}</h2>

          <button
            type="button"
            className="glass-chip text-base"
            onClick={() => setMonthDate((current) => shiftMonth(current, 1))}
          >
            →
          </button>
        </div>

        <CalendarGrid
          monthDate={monthDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          getDayInfo={(date) => {
            const dayTasks = getScheduledTasksForDate(tasks, date)
            const completedIds = records[date]?.completedTaskIds ?? []
            const score = getScoreSummary(dayTasks, completedIds)
            return {
              color: score.hexColor,
              percentage: score.percentage,
            }
          }}
        />
      </GlassCard>

      <GlassCard className="space-y-2 px-4 py-4">
        <p className="text-xs text-slate-200/75">{getFullDisplayDate(selectedDate)}</p>
        <p className="text-2xl font-semibold tracking-tight">{selectedInfo.percentage}%</p>
        <p className="text-sm text-slate-200/85">
          {selectedInfo.completedScore}/{selectedInfo.totalScore} score from{' '}
          {selectedInfo.dayTasks.length} tasks
        </p>
      </GlassCard>
    </>
  )
}
