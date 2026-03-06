export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface UserTask {
  id: string
  name: string
  weight: number
  icon?: string
  schedule: Weekday[]
  plannedDate?: string
  reminderTime?: string
}

export type DayLifeStatus = 'red' | 'yellow' | 'green'

export interface LifeStatusCounts {
  red: number
  yellow: number
  green: number
}

export interface DailyRecord {
  date: string
  completedTaskIds: string[]
}

export interface PersistedAppState {
  tasks: UserTask[]
  records: Record<string, DailyRecord>
  theme: 'light' | 'dark'
  notificationsEnabled?: boolean
  authToken?: string | null
  userEmail?: string | null
  lastLocalChangeAt?: number
  cloudUpdatedAt?: string | null
}

export interface AccountStats {
  trackedDays: number
  completedDays: number
  completionRate: number
  bestStreak: number
  currentStreak: number
  lifeStatus: LifeStatusCounts
}

