import type { Weekday } from '../types'

const weekdayByIndex: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export const weekOrder: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function fromISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getWeekday(input: string | Date): Weekday {
  const date = input instanceof Date ? input : fromISODate(input)
  return weekdayByIndex[date.getDay()]
}

export function getMonthTitle(baseDate: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(baseDate)
}

export function getFullDisplayDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(fromISODate(dateStr))
}

export function shiftMonth(baseDate: Date, amount: number): Date {
  return new Date(baseDate.getFullYear(), baseDate.getMonth() + amount, 1)
}

export function getMonthGrid(baseDate: Date): Date[] {
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
  const startWeekday = (start.getDay() + 6) % 7
  const firstCell = new Date(start)
  firstCell.setDate(start.getDate() - startWeekday)

  return Array.from({ length: 42 }, (_, idx) => {
    const day = new Date(firstCell)
    day.setDate(firstCell.getDate() + idx)
    return day
  })
}
