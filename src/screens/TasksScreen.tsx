import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { GlassCard } from '../components/GlassCard'
import { useAppStore } from '../store/useAppStore'
import type { Weekday } from '../types'
import { toISODate } from '../utils/dateUtils'

const weekdays: { key: Weekday; label: string }[] = [
  { key: 'mon', label: 'M' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'W' },
  { key: 'thu', label: 'T' },
  { key: 'fri', label: 'F' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'S' },
]

const everyDay: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
type PlanType = 'recurring' | 'one-time'

function formatTaskDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function TasksScreen() {
  const { tasks, addTask, deleteTask, selectedDate } = useAppStore()
  const today = toISODate(new Date())
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [weight, setWeight] = useState(1)
  const [schedule, setSchedule] = useState<Weekday[]>(everyDay)
  const [planType, setPlanType] = useState<PlanType>('recurring')
  const [plannedDate, setPlannedDate] = useState(selectedDate >= today ? selectedDate : today)

  useEffect(() => {
    if (planType !== 'one-time') {
      return
    }

    if (selectedDate >= today) {
      setPlannedDate(selectedDate)
    }
  }, [planType, selectedDate, today])

  const canSubmit = useMemo(() => {
    if (name.trim().length === 0) {
      return false
    }

    return planType === 'one-time' ? plannedDate.length > 0 : schedule.length > 0
  }, [name, planType, plannedDate, schedule])

  const toggleWeekday = (weekday: Weekday) => {
    setSchedule((current) =>
      current.includes(weekday) ? current.filter((item) => item !== weekday) : [...current, weekday],
    )
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) {
      return
    }

    addTask({
      name: name.trim(),
      icon: icon.trim() || undefined,
      weight,
      schedule: planType === 'one-time' ? [] : schedule,
      plannedDate: planType === 'one-time' ? plannedDate : undefined,
    })

    setName('')
    setIcon('')
    setWeight(1)
    setSchedule(everyDay)
    setPlanType('recurring')
    setPlannedDate(selectedDate >= today ? selectedDate : today)
  }

  return (
    <>
      <GlassCard className="space-y-4 px-4 py-4">
        <h2 className="text-lg font-semibold">Add task</h2>

        <form className="space-y-3" onSubmit={submit}>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`glass-button !min-h-10 text-xs ${planType === 'recurring' ? '' : 'glass-button-secondary'}`}
              onClick={() => setPlanType('recurring')}
            >
              Recurring
            </button>
            <button
              type="button"
              className={`glass-button !min-h-10 text-xs ${planType === 'one-time' ? '' : 'glass-button-secondary'}`}
              onClick={() => setPlanType('one-time')}
            >
              One-time
            </button>
          </div>

          <input
            className="glass-input"
            placeholder="Task name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <div className="flex gap-2">
            <input
              className="glass-input w-20"
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
          </div>

          {planType === 'one-time' ? (
            <div className="space-y-2">
              <label className="text-xs text-slate-200/80" htmlFor="plannedDate">
                Plan for date
              </label>
              <input
                id="plannedDate"
                className="glass-input"
                type="date"
                min={today}
                value={plannedDate}
                onChange={(event) => setPlannedDate(event.target.value)}
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {weekdays.map((day) => {
                const active = schedule.includes(day.key)
                return (
                  <button
                    key={day.key}
                    type="button"
                    className={`weekday-pill h-9 w-9 text-xs font-semibold ${active ? 'active' : ''}`}
                    onClick={() => toggleWeekday(day.key)}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
          )}

          <button type="submit" className="glass-button" disabled={!canSubmit}>
            Add task
          </button>
        </form>
      </GlassCard>

      <GlassCard className="space-y-3 px-3 py-3">
        <h3 className="px-1 text-sm font-semibold text-slate-200/85">Your tasks</h3>
        {tasks.length === 0 ? (
          <p className="px-1 py-5 text-sm text-slate-200/80">No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="surface-panel flex min-h-12 items-center justify-between px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {task.icon ? `${task.icon} ` : ''}
                  {task.name}
                </p>
                <p className="text-xs text-slate-200/75">Weight: {task.weight}</p>
                {task.plannedDate ? (
                  <p className="text-xs text-emerald-200/85">Planned: {formatTaskDate(task.plannedDate)}</p>
                ) : (
                  <p className="text-xs text-slate-300/70">Recurring</p>
                )}
              </div>

              <button
                type="button"
                className="glass-button glass-button-danger !min-h-9 !w-auto px-3 py-2 text-xs font-semibold"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </GlassCard>
    </>
  )
}
