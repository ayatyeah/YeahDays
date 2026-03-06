import { getWeekday } from './dateUtils'
import type { LifeStatusCounts, UserTask } from '../types'

export type DayColor = 'gray' | 'red' | 'yellow' | 'green'

export const dayColorHex: Record<DayColor, string> = {
  gray: '#E5E7EB',
  red: '#EF4444',
  yellow: '#F59E0B',
  green: '#22C55E',
}

export function getScheduledTasksForDate(tasks: UserTask[], isoDate: string): UserTask[] {
  const weekday = getWeekday(isoDate)
  return tasks.filter((task) => {
    if (task.plannedDate) {
      return task.plannedDate === isoDate
    }

    return Array.isArray(task.schedule) && task.schedule.includes(weekday)
  })
}

export function calculateProgress(tasks: UserTask[], completedTaskIds: string[]) {
  const completedSet = new Set(completedTaskIds)
  const totalScore = tasks.reduce((sum, task) => sum + task.weight, 0)
  const completedScore = tasks.reduce((sum, task) => {
    if (!completedSet.has(task.id)) {
      return sum
    }
    return sum + task.weight
  }, 0)

  const percentage = totalScore === 0 ? 0 : Math.round((completedScore / totalScore) * 100)

  return {
    totalScore,
    completedScore,
    percentage,
  }
}

export function getDayColor(percentage: number, totalScore: number): DayColor {
  if (totalScore === 0 || percentage === 0) {
    return 'gray'
  }
  if (percentage < 50) {
    return 'red'
  }
  if (percentage < 100) {
    return 'yellow'
  }
  return 'green'
}

export function getScoreSummary(tasks: UserTask[], completedTaskIds: string[]) {
  const progress = calculateProgress(tasks, completedTaskIds)
  const color = getDayColor(progress.percentage, progress.totalScore)

  return {
    ...progress,
    color,
    hexColor: dayColorHex[color],
  }
}

export function getLifeStatusCounts(tasks: UserTask[], records: Record<string, { completedTaskIds: string[] }>): LifeStatusCounts {
  const counts: LifeStatusCounts = {
    red: 0,
    yellow: 0,
    green: 0,
  }

  for (const [date, record] of Object.entries(records)) {
    const dayTasks = getScheduledTasksForDate(tasks, date)
    const score = getScoreSummary(dayTasks, record?.completedTaskIds ?? [])
    if (score.totalScore === 0) {
      continue
    }

    if (score.percentage >= 100) {
      counts.green += 1
    } else if (score.percentage >= 50) {
      counts.yellow += 1
    } else {
      counts.red += 1
    }
  }

  return counts
}
