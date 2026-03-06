import { GlassCard } from '../components/GlassCard'
import { ProgressBar } from '../components/ProgressBar'
import { QuoteOfDayCard } from '../components/QuoteOfDayCard'
import { TaskItem } from '../components/TaskItem'
import logo from '../assets/yeahdays-logo.svg'
import { useAppStore } from '../store/useAppStore'
import { getFullDisplayDate, toISODate } from '../utils/dateUtils'
import { getQuoteOfTheDay, getSevenDayInsights } from '../utils/productivityUtils'
import { getScheduledTasksForDate, getScoreSummary } from '../utils/scoreUtils'

export function TodayScreen() {
  const { tasks, records, toggleTaskForDate, setCompletedTasksForDate } = useAppStore()

  const todayDate = toISODate(new Date())
  const todayTasks = getScheduledTasksForDate(tasks, todayDate)
  const completedTaskIds = records[todayDate]?.completedTaskIds ?? []
  const score = getScoreSummary(todayTasks, completedTaskIds)
  const insight = getSevenDayInsights(todayDate, tasks, records)
  const quote = getQuoteOfTheDay(todayDate)

  const completeAll = () => {
    setCompletedTasksForDate(
      todayDate,
      todayTasks.map((task) => task.id),
    )
  }

  const clearAll = () => {
    setCompletedTasksForDate(todayDate, [])
  }

  return (
    <>
      <GlassCard className="space-y-2 px-5 py-4">
        <p className="text-xs text-slate-200/75">{getFullDisplayDate(todayDate)}</p>
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="YeahDays" className="h-8 w-auto" />
          </div>
          <div
            className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]"
            style={{ backgroundColor: `${score.hexColor}40` }}
          >
            {score.percentage}%
          </div>
        </div>

        <ProgressBar percentage={score.percentage} colorHex={score.hexColor} />

        <div className="mt-2 flex items-center justify-between text-xs text-slate-300/85">
          <span>
            {score.completedScore}/{score.totalScore} score
          </span>
          <span>{todayTasks.length} tasks today</span>
        </div>
      </GlassCard>

      <GlassCard className="space-y-3 px-3 py-3">
        <div className="flex items-center gap-2 px-1">
          <button type="button" className="glass-button !min-h-10 glass-button-secondary text-xs" onClick={completeAll}>
            Complete all
          </button>
          <button type="button" className="glass-button !min-h-10 glass-button-ghost text-xs" onClick={clearAll}>
            Clear all
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-slate-200/80">
            No tasks scheduled for today. Add tasks in the Tasks tab.
          </p>
        ) : (
          todayTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              checked={completedTaskIds.includes(task.id)}
              onToggle={() => toggleTaskForDate(todayDate, task.id)}
            />
          ))
        )}
      </GlassCard>

      <GlassCard className="space-y-3 px-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">7-day insights</h3>
          <span className="rounded-full border border-white/18 bg-white/10 px-2.5 py-1 text-[11px] text-slate-100/90">
            Avg {insight.avg}%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="surface-panel py-2">
            <p className="text-[11px] text-slate-300/80">Today</p>
            <p className="text-sm font-semibold">{insight.today}%</p>
          </div>
          <div className="surface-panel py-2">
            <p className="text-[11px] text-slate-300/80">Best</p>
            <p className="text-sm font-semibold">{insight.best}%</p>
          </div>
          <div className="surface-panel py-2">
            <p className="text-[11px] text-slate-300/80">Trend</p>
            <p className={`text-sm font-semibold ${insight.delta >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
              {insight.delta >= 0 ? '+' : ''}
              {insight.delta}%
            </p>
          </div>
        </div>

        <div className="flex h-11 items-end gap-1 rounded-2xl border border-white/12 bg-white/6 px-2 py-1">
          {insight.sparkline.map((value, idx) => (
            <div
              key={`bar-${idx}`}
              className="flex-1 rounded-md bg-white/14"
              style={{
                height: `${Math.max(14, value)}%`,
                background: `linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.16) 100%)`,
              }}
            />
          ))}
        </div>
      </GlassCard>

      <QuoteOfDayCard jp={quote.jp} ru={quote.ru} author={quote.author} />
    </>
  )
}
