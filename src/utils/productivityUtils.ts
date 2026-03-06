import { fromISODate, toISODate } from './dateUtils'
import { getScheduledTasksForDate, getScoreSummary } from './scoreUtils'
import type { DailyRecord, UserTask } from '../types'

interface JapaneseQuote {
  jp: string
  ru: string
  author: string
}

const quotes: JapaneseQuote[] = [
  {
    jp: '千里の道も一歩から。',
    ru: 'Путь в тысячу ри начинается с одного шага.',
    author: 'Японская пословица',
  },
  {
    jp: '継続は力なり。',
    ru: 'Постоянство становится силой.',
    author: 'Японская пословица',
  },
  {
    jp: '七転び八起き。',
    ru: 'Упал семь раз — встань восемь.',
    author: 'Японская пословица',
  },
  {
    jp: '急がば回れ。',
    ru: 'Если спешишь — иди окольным путём.',
    author: 'Японская пословица',
  },
  {
    jp: '石の上にも三年。',
    ru: 'Даже на холодном камне сиди три года — и он станет тёплым.',
    author: 'Японская пословица',
  },
  {
    jp: '思い立ったが吉日。',
    ru: 'Лучший день начать — тот, когда ты решил.',
    author: 'Японская пословица',
  },
  {
    jp: '習うより慣れろ。',
    ru: 'Лучше привыкнуть практикой, чем только учиться.',
    author: 'Японская пословица',
  },
  {
    jp: '為せば成る。',
    ru: 'Если делать — получится.',
    author: 'Японская мудрость',
  },
]

function previousDate(isoDate: string, amount: number) {
  const date = fromISODate(isoDate)
  date.setDate(date.getDate() - amount)
  return toISODate(date)
}

export function getQuoteOfTheDay(isoDate: string): JapaneseQuote {
  const numeric = Number(isoDate.replaceAll('-', ''))
  return quotes[numeric % quotes.length]
}

export function getLastNDates(isoDate: string, total: number) {
  return Array.from({ length: total }, (_, index) => previousDate(isoDate, total - index - 1))
}

export function getSevenDayInsights(
  currentDate: string,
  tasks: UserTask[],
  records: Record<string, DailyRecord>,
) {
  const range = getLastNDates(currentDate, 7)
  const percentages = range.map((date) => {
    const scheduled = getScheduledTasksForDate(tasks, date)
    const completedIds = records[date]?.completedTaskIds ?? []
    return getScoreSummary(scheduled, completedIds).percentage
  })

  const avg = percentages.length
    ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length)
    : 0
  const best = percentages.length ? Math.max(...percentages) : 0
  const today = percentages.at(-1) ?? 0
  const delta = today - avg

  return {
    avg,
    best,
    today,
    delta,
    sparkline: percentages,
  }
}
