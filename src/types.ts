export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface UserTask {
  id: string
  name: string
  weight: number
  icon?: string
  schedule: Weekday[]
}

export interface DailyRecord {
  date: string
  completedTaskIds: string[]
}

export interface PersistedAppState {
  tasks: UserTask[]
  records: Record<string, DailyRecord>
  theme: 'light' | 'dark'
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
}

