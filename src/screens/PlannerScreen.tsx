import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { GlassCard } from '../components/GlassCard'
import { TaskItem } from '../components/TaskItem'
import { useAppStore } from '../store/useAppStore'
import { getFullDisplayDate, toISODate } from '../utils/dateUtils'
import { getScheduledTasksForDate, getScoreSummary } from '../utils/scoreUtils'

export function PlannerScreen() {
  const {
    selectedDate,
    setSelectedDate,
    tasks,
    records,
    addTask,
    toggleTaskForDate,
    setCompletedTasksForDate,
  } = useAppStore()

  const today = toISODate(new Date())
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [weight, setWeight] = useState(1)
  const [reminderTime, setReminderTime] = useState('')

  const plannedTasks = getScheduledTasksForDate(tasks, selectedDate)
  const completedTaskIds = records[selectedDate]?.completedTaskIds ?? []
  const summary = getScoreSummary(plannedTasks, completedTaskIds)

  const canSubmit = useMemo(() => name.trim().length > 0, [name])

  const submitPlannedTask = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) {
      return
    }

    addTask({
      name: name.trim(),
      icon: icon.trim() || undefined,
      weight,
      schedule: [],
      plannedDate: selectedDate,
      reminderTime: reminderTime || undefined,
    })

    setName('')
    setIcon('')
    setWeight(1)
    setReminderTime('')
  }

  return (
    <>
      <GlassCard className="space-y-4 px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Day Planner</h2>
          <span className="rounded-full border border-white/22 bg-white/10 px-3 py-1 text-xs">{summary.percentage}%</span>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-200/80" htmlFor="plannerDate">
            Planning date
          </label>
          <input
            id="plannerDate"
            className="glass-input"
            type="date"
            min={today}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
          <p className="text-xs text-slate-200/80">{getFullDisplayDate(selectedDate)}</p>
        </div>
      </GlassCard>

      <GlassCard className="space-y-3 px-4 py-4">
        <h3 className="text-sm font-semibold">Plan this day</h3>
        <form className="space-y-2" onSubmit={submitPlannedTask}>
          <input
            className="glass-input"
            placeholder="Task for this day"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <div className="grid grid-cols-3 gap-2">
            <input
              className="glass-input"
              placeholder="Icon"
              maxLength={2}
              value={icon}
              onChange={(event) => setIcon(event.target.value)}
            />
            <input
              className="glass-input"
              type="number"
              min={1}
              max={5}
              value={weight}
              onChange={(event) => setWeight(Number(event.target.value) || 1)}
            />
            <input
              className="glass-input"
              type="time"
              value={reminderTime}
              onChange={(event) => setReminderTime(event.target.value)}
            />
          </div>

          <button type="submit" className="glass-button" disabled={!canSubmit}>
            Add to {selectedDate}
          </button>
        </form>
      </GlassCard>

      <GlassCard className="space-y-3 px-3 py-3">
        <div className="flex items-center gap-2 px-1">
          <button
            type="button"
            className="glass-button !min-h-10 glass-button-secondary text-xs"
            onClick={() => setCompletedTasksForDate(selectedDate, plannedTasks.map((task) => task.id))}
          >
            Complete all
          </button>
          <button
            type="button"
            className="glass-button !min-h-10 glass-button-ghost text-xs"
            onClick={() => setCompletedTasksForDate(selectedDate, [])}
          >
            Clear all
          </button>
        </div>

        {plannedTasks.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-slate-200/80">No tasks planned for this date yet.</p>
        ) : (
          plannedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              checked={completedTaskIds.includes(task.id)}
              onToggle={() => toggleTaskForDate(selectedDate, task.id)}
            />
          ))
        )}
      </GlassCard>
    </>
  )
}
