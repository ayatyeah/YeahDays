import { useEffect, useMemo, useState } from 'react'
import { AuthScreen } from './screens/AuthScreen'
import { CloudPulse } from './components/CloudPulse'
import { LiquidBackground } from './components/LiquidBackground'
import { useTaskReminders } from './hooks/useTaskReminders'
import { getScheduledTasksForDate, getScoreSummary } from './utils/scoreUtils'
import { CalendarScreen } from './screens/CalendarScreen'
import { GameScreen } from './screens/GameScreen'
import { LabScreen } from './screens/LabScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { TasksScreen } from './screens/TasksScreen'
import { TodayScreen } from './screens/TodayScreen'
import { toISODate } from './utils/dateUtils'
import { useAppStore } from './store/useAppStore'

type Tab = 'today' | 'calendar' | 'tasks' | 'game' | 'lab' | 'settings'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'today', label: 'Today', icon: '☀️' },
  { id: 'calendar', label: 'Calendar', icon: '🗓️' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'game', label: 'Game', icon: '🎮' },
  { id: 'lab', label: 'Lab', icon: '🧪' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const CLOUD_REFRESH_MS = 25000

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today')
  const { tasks, records, theme, hydrated, hydrate, userEmail, authToken, refreshFromCloud } = useAppStore()
  const reminders = useTaskReminders()

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

  useEffect(() => {
    if (!authToken) {
      return
    }

    void refreshFromCloud()
    const intervalId = window.setInterval(() => {
      void refreshFromCloud()
    }, CLOUD_REFRESH_MS)

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void refreshFromCloud()
      }
    }

    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [authToken, refreshFromCloud])

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

  if (!userEmail) {
    return (
      <main className="app-shell relative mx-auto min-h-dvh max-w-[430px] overflow-hidden px-4 py-5 text-slate-100 dark:text-slate-100 md:my-4 md:min-h-[calc(100dvh-2rem)] md:rounded-[34px]">
        <LiquidBackground percentage={36} hexColor="#38bdf8" />
        <section className="relative z-10">
          <AuthScreen />
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell relative mx-auto min-h-dvh max-w-[430px] overflow-hidden px-4 pb-24 pt-5 text-slate-100 dark:text-slate-100 md:my-4 md:min-h-[calc(100dvh-2rem)] md:rounded-[34px]">
      <LiquidBackground percentage={todayStats.percentage} hexColor={todayStats.hexColor} />
      <section className="relative z-10 flex min-h-[calc(100dvh-6rem)] flex-col gap-4">
        <CloudPulse />
        {activeTab === 'today' && <TodayScreen />}
        {activeTab === 'calendar' && <CalendarScreen onOpenTasks={() => setActiveTab('tasks')} />}
        {activeTab === 'tasks' && <TasksScreen />}
        {activeTab === 'game' && <GameScreen />}
        {activeTab === 'lab' && <LabScreen />}
        {activeTab === 'settings' && <SettingsScreen reminders={reminders} />}
      </section>

      <nav className="glass-nav iphone-nav fixed inset-x-0 z-20 mx-auto flex w-[calc(100%-1.5rem)] max-w-[400px] items-center justify-between gap-1.5 px-1.5 py-1.5 md:bottom-6">
        {tabs.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              className={`glass-tab flex min-w-12 flex-1 flex-col items-center justify-center px-1 text-[10px] font-medium ${active ? 'active' : ''}`}
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
