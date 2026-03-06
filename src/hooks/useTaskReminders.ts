import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { toISODate } from '../utils/dateUtils'
import { getScheduledTasksForDate } from '../utils/scoreUtils'

const CHECK_INTERVAL_MS = 30000

function currentTimeHHMM() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function makeNotificationKey(date: string, taskId: string, time: string) {
  return `yeahdays-notification-${date}-${taskId}-${time}`
}

export function useTaskReminders() {
  const { tasks, notificationsEnabled } = useAppStore()
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied'
    }
    return Notification.permission
  })

  const supported = useMemo(() => typeof window !== 'undefined' && 'Notification' in window, [])

  const requestPermission = async () => {
    if (!supported) {
      return false
    }

    const next = await Notification.requestPermission()
    setPermission(next)
    return next === 'granted'
  }

  useEffect(() => {
    if (!supported || !notificationsEnabled || permission !== 'granted') {
      return
    }

    const checkAndNotify = () => {
      const now = new Date()
      const isoDate = toISODate(now)
      const hhmm = currentTimeHHMM()
      const todayTasks = getScheduledTasksForDate(tasks, isoDate)

      for (const task of todayTasks) {
        if (!task.reminderTime || task.reminderTime !== hhmm) {
          continue
        }

        const key = makeNotificationKey(isoDate, task.id, hhmm)
        if (window.localStorage.getItem(key)) {
          continue
        }

        window.localStorage.setItem(key, '1')
        new Notification('YeahDays Reminder', {
          body: `${task.icon ? `${task.icon} ` : ''}${task.name}`,
          tag: key,
        })
      }
    }

    checkAndNotify()
    const interval = window.setInterval(checkAndNotify, CHECK_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [tasks, notificationsEnabled, permission, supported])

  return {
    supported,
    permission,
    requestPermission,
  }
}
