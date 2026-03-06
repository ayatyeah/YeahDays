const weekdayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getWeekday(dateStr) {
  return weekdayMap[parseDate(dateStr).getDay()]
}

function getTasksForDate(tasks, dateStr) {
  const weekday = getWeekday(dateStr)
  return tasks.filter((task) => {
    if (task.plannedDate) {
      return task.plannedDate === dateStr
    }

    return Array.isArray(task.schedule) && task.schedule.includes(weekday)
  })
}

function getDayPercentage(tasks, completedTaskIds) {
  const completedSet = new Set(completedTaskIds)
  const total = tasks.reduce((sum, task) => sum + task.weight, 0)
  const completed = tasks.reduce((sum, task) => {
    if (!completedSet.has(task.id)) {
      return sum
    }
    return sum + task.weight
  }, 0)

  if (total === 0) {
    return { total, percentage: 0 }
  }

  return {
    total,
    percentage: Math.round((completed / total) * 100),
  }
}

export function calculateAccountStats(tasks, records) {
  const dates = Object.keys(records).sort()
  let trackedDays = 0
  let completedDays = 0
  const lifeStatus = {
    red: 0,
    yellow: 0,
    green: 0,
  }

  for (const date of dates) {
    const dayTasks = getTasksForDate(tasks, date)
    const completedIds = records[date]?.completedTaskIds ?? []
    const day = getDayPercentage(dayTasks, completedIds)
    if (day.total > 0) {
      trackedDays += 1
      if (day.percentage >= 100) {
        lifeStatus.green += 1
      } else if (day.percentage >= 50) {
        lifeStatus.yellow += 1
      } else {
        lifeStatus.red += 1
      }

      if (day.percentage === 100) {
        completedDays += 1
      }
    }
  }

  const completionRate = trackedDays === 0 ? 0 : Math.round((completedDays / trackedDays) * 100)

  const fullDays = new Set(
    dates.filter((date) => {
      const dayTasks = getTasksForDate(tasks, date)
      const completedIds = records[date]?.completedTaskIds ?? []
      const day = getDayPercentage(dayTasks, completedIds)
      return day.total > 0 && day.percentage === 100
    }),
  )

  let currentStreak = 0
  let bestStreak = 0
  let runningStreak = 0
  let prevDate = null

  for (const date of Array.from(fullDays).sort()) {
    const currentDate = parseDate(date)

    if (!prevDate) {
      runningStreak = 1
    } else {
      const expectedNext = new Date(prevDate)
      expectedNext.setDate(prevDate.getDate() + 1)
      const isConsecutive = expectedNext.toDateString() === currentDate.toDateString()
      runningStreak = isConsecutive ? runningStreak + 1 : 1
    }

    bestStreak = Math.max(bestStreak, runningStreak)
    prevDate = currentDate
  }

  const today = new Date()
  let scan = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  while (fullDays.has(scan.toISOString().slice(0, 10))) {
    currentStreak += 1
    scan.setDate(scan.getDate() - 1)
  }

  return {
    trackedDays,
    completedDays,
    completionRate,
    bestStreak,
    currentStreak,
    lifeStatus,
  }
}
