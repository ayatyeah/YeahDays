import { useEffect, useMemo, useState } from 'react'
import { LiquidBackground } from './components/LiquidBackground'
import { getScheduledTasksForDate, getScoreSummary } from './utils/scoreUtils'
import { CalendarScreen } from './screens/CalendarScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { TasksScreen } from './screens/TasksScreen'
import { TodayScreen } from './screens/TodayScreen'
import { toISODate } from './utils/dateUtils'
import { useAppStore } from './store/useAppStore'

type Tab = 'today' | 'calendar' | 'tasks' | 'settings'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'today', label: 'Today', icon: '☀️' },
  { id: 'calendar', label: 'Calendar', icon: '🗓️' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today')
  const { tasks, records, theme, hydrated, hydrate } = useAppStore()

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  useEffect(() => {
    const body = document.body
    const root = document.documentElement

    body.classList.toggle('light', theme === 'light')
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])

  const todayStats = useMemo(() => {
    const today = toISODate(new Date())
    const scheduledTasks = getScheduledTasksForDate(tasks, today)
    const completedIds = records[today]?.completedTaskIds ?? []
    return getScoreSummary(scheduledTasks, completedIds)
  }, [records, tasks])

  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-[390px] items-center justify-center px-4 text-sm text-slate-300">
        Loading YeahDays...
      </main>
    )
  }

  return (
    <main className="app-shell relative mx-auto min-h-dvh max-w-[390px] overflow-hidden px-4 pb-22 pt-4 text-slate-100 dark:text-slate-100">
      <LiquidBackground percentage={todayStats.percentage} hexColor={todayStats.hexColor} />
      <section className="relative z-10 flex min-h-[calc(100dvh-6rem)] flex-col gap-4">
        {activeTab === 'today' && <TodayScreen />}
        {activeTab === 'calendar' && <CalendarScreen />}
        {activeTab === 'tasks' && <TasksScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </section>

      <nav className="glass-nav fixed inset-x-0 bottom-3 z-20 mx-auto flex w-[calc(100%-1.5rem)] max-w-[370px] items-center justify-between px-2 py-2">
        {tabs.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              className={`glass-tab flex min-w-16 flex-1 flex-col items-center justify-center px-2 text-[11px] font-medium ${active ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span aria-hidden>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </main>
  )
}

export default App
