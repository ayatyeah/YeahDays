import { create } from 'zustand'
import { toISODate } from '../utils/dateUtils'
import {
  getCloudData,
  getMe,
  loginAccount,
  replaceTasksCloud,
  registerAccount,
  resetCloudData,
  setThemeCloud,
  upsertRecordCloud,
} from '../utils/apiClient'
import { loadPersistedState, savePersistedState } from '../utils/persistence'
import type { AccountStats, DailyRecord, PersistedAppState, UserTask } from '../types'

interface AppState extends PersistedAppState {
  selectedDate: string
  hydrated: boolean
  authLoading: boolean
  syncError: string | null
  cloudSyncPending: boolean
  accountStats: AccountStats | null
  notificationsEnabled: boolean
  hydrate: () => Promise<void>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  syncNow: () => Promise<void>
  refreshFromCloud: () => Promise<void>
  toggleTaskForDate: (date: string, taskId: string) => void
  setCompletedTasksForDate: (date: string, completedTaskIds: string[]) => void
  addTask: (task: Omit<UserTask, 'id'>) => void
  updateTask: (task: UserTask) => void
  deleteTask: (taskId: string) => void
  setTheme: (theme: 'light' | 'dark') => void
  setNotificationsEnabled: (enabled: boolean) => void
  setSelectedDate: (date: string) => void
  resetAll: () => void
  exportData: () => PersistedAppState
  importData: (payload: string) => { success: boolean; error?: string }
}

const defaultTasks: UserTask[] = []

function getInitialTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function hasContent(tasks: UserTask[], records: Record<string, DailyRecord>) {
  return tasks.length > 0 || Object.keys(records).length > 0
}

function pickPersistedState(state: AppState): PersistedAppState {
  return {
    tasks: state.tasks,
    records: state.records,
    theme: state.theme,
    notificationsEnabled: state.notificationsEnabled,
    authToken: state.authToken,
    userEmail: state.userEmail,
    lastLocalChangeAt: state.lastLocalChangeAt,
    cloudUpdatedAt: state.cloudUpdatedAt,
  }
}

export const useAppStore = create<AppState>((set, get) => {
  let syncInFlight = false
  let syncQueued = false

  const persist = () => {
    const state = get()
    void savePersistedState(pickPersistedState(state))
  }

  const flushAllTasksToCloud = async (token: string, tasks: UserTask[]) => {
    const result = await replaceTasksCloud(token, tasks)
    set({ accountStats: result.stats, syncError: null })
    return true
  }

  const pushLocalToCloud = async (token: string, state: AppState) => {
    const safeChangeAt = state.lastLocalChangeAt ?? Date.now()

    await flushAllTasksToCloud(token, state.tasks)

    const recordEntries = Object.entries(state.records || {})
    for (const [date, record] of recordEntries) {
      await upsertRecordCloud(token, {
        date,
        completedTaskIds: Array.isArray(record?.completedTaskIds) ? record.completedTaskIds : [],
        clientLastChangeAt: safeChangeAt,
      })
    }

    await setThemeCloud(token, {
      theme: state.theme,
      clientLastChangeAt: safeChangeAt,
    })

    const fresh = await getCloudData(token)
    set((current) => ({
      tasks: fresh.tasks,
      records: fresh.records,
      theme: fresh.theme,
      accountStats: fresh.stats,
      cloudUpdatedAt: fresh.updatedAt,
      syncError: null,
      cloudSyncPending: (current.lastLocalChangeAt ?? 0) > safeChangeAt,
      lastLocalChangeAt: Math.max(current.lastLocalChangeAt ?? 0, safeChangeAt),
    }))
    persist()
  }

  const saveCloud = async () => {
    const state = get()
    if (!state.authToken) {
      return
    }

    if (syncInFlight) {
      syncQueued = true
      return
    }

    syncInFlight = true

    try {
      // Run until no queued local changes remain.
      while (true) {
        syncQueued = false
        const current = get()
        if (!current.authToken) {
          break
        }

        if (!current.cloudSyncPending) {
          break
        }

        await pushLocalToCloud(current.authToken, current)

        if (!syncQueued) {
          break
        }
      }
    } catch (error) {
      set({
        syncError: error instanceof Error ? error.message : 'Cloud sync failed',
        cloudSyncPending: true,
      })
    } finally {
      syncInFlight = false
    }
  }

  const syncFromCloud = async (token: string, uploadIfCloudEmpty: boolean) => {
    const [me, cloud] = await Promise.all([getMe(token), getCloudData(token)])
    const state = get()

    const localHasContent = hasContent(state.tasks, state.records)
    const cloudHasContent = hasContent(cloud.tasks, cloud.records)
    const localChangedAt = state.lastLocalChangeAt ?? 0
    const cloudChangedAt = cloud.updatedAt ? Date.parse(cloud.updatedAt) : 0

    // Upload local snapshot for first login if cloud is empty.
    if (uploadIfCloudEmpty && localHasContent && !cloudHasContent) {
      const tasksOk = await flushAllTasksToCloud(token, state.tasks)
      if (!tasksOk) {
        throw new Error('Task sync failed')
      }
      await pushLocalToCloud(token, state)
      set({ userEmail: me.user.email })
      return
    }

    if (!uploadIfCloudEmpty && state.cloudSyncPending && localHasContent) {
      const tasksOk = await flushAllTasksToCloud(token, state.tasks)
      if (!tasksOk) {
        throw new Error('Task sync failed')
      }
      await pushLocalToCloud(token, state)
      set({ userEmail: me.user.email })
      return
    }

    // During background refresh, never wipe non-empty local data with empty cloud payload.
    if (!uploadIfCloudEmpty && localHasContent && !cloudHasContent) {
      const tasksOk = await flushAllTasksToCloud(token, state.tasks)
      if (!tasksOk) {
        throw new Error('Task sync failed')
      }
      await pushLocalToCloud(token, state)
      set({ userEmail: me.user.email })
      return
    }

    // If local state is newer than cloud, push local version instead of replacing it.
    if (!uploadIfCloudEmpty && localHasContent && cloudHasContent && localChangedAt > cloudChangedAt) {
      const tasksOk = await flushAllTasksToCloud(token, state.tasks)
      if (!tasksOk) {
        throw new Error('Task sync failed')
      }
      await pushLocalToCloud(token, state)
      set({ userEmail: me.user.email })
      return
    }

    set({
      userEmail: me.user.email,
      tasks: cloud.tasks,
      records: cloud.records,
      theme: cloud.theme,
      accountStats: cloud.stats,
      cloudUpdatedAt: cloud.updatedAt,
      lastLocalChangeAt: Math.max(localChangedAt, cloudChangedAt),
      syncError: null,
      cloudSyncPending: false,
    })
    persist()
  }

  return {
    tasks: defaultTasks,
    records: {},
    theme: getInitialTheme(),
    notificationsEnabled: false,
    authToken: null,
    userEmail: null,
    lastLocalChangeAt: 0,
    cloudUpdatedAt: null,
    selectedDate: toISODate(new Date()),
    hydrated: false,
    authLoading: false,
    syncError: null,
    cloudSyncPending: false,
    accountStats: null,

    hydrate: async () => {
      const persisted = await loadPersistedState()
      if (persisted) {
        const nextState: Partial<AppState> = {
          tasks: persisted.tasks,
          records: persisted.records,
          theme: persisted.theme,
          hydrated: true,
          authToken: persisted.authToken ?? null,
          userEmail: persisted.userEmail ?? null,
          notificationsEnabled: persisted.notificationsEnabled ?? false,
          lastLocalChangeAt:
            persisted.lastLocalChangeAt ??
            (hasContent(persisted.tasks, persisted.records) ? Date.now() : 0),
          cloudUpdatedAt: persisted.cloudUpdatedAt ?? null,
          cloudSyncPending: false,
        }

        set(nextState)

        if (persisted.authToken) {
          try {
            await syncFromCloud(persisted.authToken, true)
          } catch {
            set({
              authToken: null,
              userEmail: null,
              accountStats: null,
              cloudUpdatedAt: null,
              tasks: [],
              records: {},
              cloudSyncPending: false,
            })
            persist()
          }
        }
        return
      }

      set({ hydrated: true })
      persist()
    },

    register: async (email, password) => {
      set({ authLoading: true, syncError: null })
      try {
        const response = await registerAccount(email, password)
        set({ authToken: response.token, userEmail: response.user.email })
        await syncFromCloud(response.token, true)
        set({ authLoading: false })
        persist()
        return { success: true }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed'
        set({ authLoading: false, syncError: message })
        return { success: false, error: message }
      }
    },

    login: async (email, password) => {
      set({ authLoading: true, syncError: null })
      try {
        const response = await loginAccount(email, password)
        set({ authToken: response.token, userEmail: response.user.email })
        await syncFromCloud(response.token, true)
        set({ authLoading: false })
        persist()
        return { success: true }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed'
        set({ authLoading: false, syncError: message })
        return { success: false, error: message }
      }
    },

    logout: () => {
      set({
        authToken: null,
        userEmail: null,
        accountStats: null,
        syncError: null,
        cloudUpdatedAt: null,
        tasks: [],
        records: {},
        selectedDate: toISODate(new Date()),
        cloudSyncPending: false,
      })
      persist()
    },

    syncNow: async () => {
      const state = get()
      if (!state.authToken) {
        return
      }

      set({ cloudSyncPending: true, lastLocalChangeAt: Date.now() })
      persist()
      await saveCloud()
    },

    refreshFromCloud: async () => {
      const state = get()
      if (!state.authToken) {
        return
      }

      try {
        await syncFromCloud(state.authToken, false)
      } catch (error) {
        set({ syncError: error instanceof Error ? error.message : 'Cloud refresh failed' })
      }
    },

    toggleTaskForDate: (date, taskId) => {
      set((state) => {
        const currentRecord: DailyRecord = state.records[date] ?? {
          date,
          completedTaskIds: [],
        }

        const hasTask = currentRecord.completedTaskIds.includes(taskId)
        const completedTaskIds = hasTask
          ? currentRecord.completedTaskIds.filter((id) => id !== taskId)
          : [...currentRecord.completedTaskIds, taskId]

        return {
          records: {
            ...state.records,
            [date]: {
              date,
              completedTaskIds,
            },
          },
          lastLocalChangeAt: Date.now(),
          cloudSyncPending: true,
        }
      })
      persist()
      void saveCloud()
    },

    setCompletedTasksForDate: (date, completedTaskIds) => {
      const normalized = Array.from(new Set(completedTaskIds))
      set((state) => ({
        records: {
          ...state.records,
          [date]: {
            date,
            completedTaskIds: normalized,
          },
        },
        lastLocalChangeAt: Date.now(),
        cloudSyncPending: true,
      }))
      persist()
      void saveCloud()
    },

    addTask: (task) => {
      const newTask: UserTask = {
        ...task,
        id: crypto.randomUUID(),
      }

      set((state) => ({
        tasks: [...state.tasks, newTask],
        lastLocalChangeAt: Date.now(),
        cloudSyncPending: true,
      }))
      persist()

      void saveCloud()
    },

    updateTask: (task) => {
      set((state) => ({
        tasks: state.tasks.map((currentTask) => (currentTask.id === task.id ? task : currentTask)),
        lastLocalChangeAt: Date.now(),
        cloudSyncPending: true,
      }))
      persist()

      void saveCloud()
    },

    deleteTask: (taskId) => {
      set((state) => {
        const records = Object.fromEntries(
          Object.entries(state.records).map(([date, record]) => [
            date,
            {
              ...record,
              completedTaskIds: record.completedTaskIds.filter((id) => id !== taskId),
            },
          ]),
        )

        return {
          tasks: state.tasks.filter((task) => task.id !== taskId),
          records,
          lastLocalChangeAt: Date.now(),
          cloudSyncPending: true,
        }
      })
      persist()

      void saveCloud()
    },

    setTheme: (theme) => {
      set({ theme, lastLocalChangeAt: Date.now(), cloudSyncPending: true })
      persist()
      void saveCloud()
    },

    setNotificationsEnabled: (enabled) => {
      set({ notificationsEnabled: enabled })
      persist()
    },

    setSelectedDate: (date) => {
      set({ selectedDate: date })
    },

    resetAll: () => {
      set({
        tasks: [],
        records: {},
        selectedDate: toISODate(new Date()),
        accountStats: null,
        lastLocalChangeAt: Date.now(),
        cloudSyncPending: true,
      })
      persist()
      const token = get().authToken
      if (token) {
        void resetCloudData(token)
      }
    },

    exportData: () => {
      return pickPersistedState(get())
    },

    importData: (payload) => {
      try {
        const parsed = JSON.parse(payload) as Partial<PersistedAppState>

        if (!Array.isArray(parsed.tasks) || typeof parsed.records !== 'object') {
          return { success: false, error: 'Invalid JSON format' }
        }

        set({
          tasks: parsed.tasks,
          records: (parsed.records as Record<string, DailyRecord>) ?? {},
          theme: parsed.theme === 'light' ? 'light' : 'dark',
          lastLocalChangeAt: Date.now(),
          cloudSyncPending: true,
        })
        persist()
        void saveCloud()

        return { success: true }
      } catch {
        return { success: false, error: 'Unable to parse file' }
      }
    },
  }
})
