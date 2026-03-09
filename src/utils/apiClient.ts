import type { AccountStats, PersistedAppState } from '../types'
import type { UserTask } from '../types'

const API_BASE = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '')).trim()

export function getConfiguredApiBase() {
  return API_BASE || '(same-origin)'
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

function buildApiUrl(path: string) {
  const base = API_BASE.replace(/\/$/, '')

  if (!base) {
    return path
  }

  if (base.endsWith('/api') && path.startsWith('/api/')) {
    return `${base}${path.slice(4)}`
  }

  return `${base}${path}`
}

function buildApiCandidates(path: string) {
  const candidates = new Set<string>()
  const primary = buildApiUrl(path)
  candidates.add(primary)

  // When an explicit API host is configured, do not fallback to same-origin paths.
  if (isAbsoluteUrl(API_BASE)) {
    return Array.from(candidates)
  }

  candidates.add(path)

  if (path.startsWith('/api/')) {
    // Some deployments expose backend routes without the /api prefix.
    candidates.add(path.slice(4))
  }

  return Array.from(candidates)
}

interface AuthResponse {
  token: string
  user: {
    email: string
  }
}

interface CloudDataResponse {
  tasks: PersistedAppState['tasks']
  records: PersistedAppState['records']
  theme: PersistedAppState['theme']
  stats: AccountStats
  updatedAt: string | null
}

interface SyncSnapshotResponse extends CloudDataResponse {
  ok: true
  staleIgnored?: boolean
  gameHighScore?: number
}

export interface LeaderboardEntry {
  rank: number
  userEmail: string
  highScore: number
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const candidates = buildApiCandidates(path)
  let lastError = 'Request failed'

  for (const url of candidates) {
    let response: Response
    try {
      response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
        ...init,
      })
    } catch {
      lastError = import.meta.env.DEV
        ? 'API unavailable. Start backend on http://localhost:4000'
        : 'API unavailable. Check backend deployment/routes.'
      continue
    }

    if (response.ok) {
      try {
        return (await response.json()) as T
      } catch {
        lastError = `Invalid API response from ${url}`
        continue
      }
    }

    const body = (await response.json().catch(() => ({}))) as { error?: string }
    lastError = body.error || `Request failed (${response.status})`

    if (response.status === 404 || response.status === 405 || response.status === 502 || response.status === 503) {
      continue
    }

    throw new Error(lastError)
  }

  throw new Error(lastError)
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function registerAccount(email: string, password: string) {
  return request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function loginAccount(email: string, password: string) {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function getMe(token: string) {
  return request<{ user: { email: string }; stats: AccountStats }>('/api/auth/me', {
    method: 'GET',
    headers: authHeaders(token),
  })
}

export async function getCloudData(token: string) {
  return request<CloudDataResponse>('/api/data', {
    method: 'GET',
    headers: authHeaders(token),
  })
}

export async function saveCloudData(token: string, payload: PersistedAppState) {
  const body = JSON.stringify({
    tasks: payload.tasks,
    records: payload.records,
    theme: payload.theme,
    clientLastChangeAt: payload.lastLocalChangeAt ?? Date.now(),
  })

  try {
    return await request<{ ok: true; stats: AccountStats; updatedAt: string | null }>('/api/data', {
      method: 'PUT',
      headers: authHeaders(token),
      body,
    })
  } catch {
    return request<{ ok: true; stats: AccountStats; updatedAt: string | null }>('/api/data', {
      method: 'POST',
      headers: authHeaders(token),
      body,
    })
  }
}

export async function syncCloudSnapshot(token: string, payload: PersistedAppState) {
  return request<SyncSnapshotResponse>('/api/sync', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      tasks: payload.tasks,
      records: payload.records,
      theme: payload.theme,
      clientLastChangeAt: payload.lastLocalChangeAt ?? Date.now(),
    }),
  })
}

export async function resetCloudData(token: string) {
  return request<{ ok: true }>('/api/data/reset', {
    method: 'POST',
    headers: authHeaders(token),
  })
}

export async function submitGameScore(token: string, score: number) {
  return request<{ ok: true; score: number; highScore: number; improved: boolean }>('/api/game/score', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ score }),
  })
}

export async function getLeaderboard(token: string) {
  return request<{ leaderboard: LeaderboardEntry[] }>('/api/game/leaderboard', {
    method: 'GET',
    headers: authHeaders(token),
  })
}

export async function upsertTaskCloud(token: string, task: UserTask, clientLastChangeAt?: number) {
  return request<{ ok: true; task: UserTask; stats: AccountStats; updatedAt?: string | null }>('/api/tasks/upsert', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      task,
      clientLastChangeAt: clientLastChangeAt ?? Date.now(),
    }),
  })
}

export async function replaceTasksCloud(token: string, tasks: UserTask[], clientLastChangeAt?: number) {
  try {
    return await request<{ ok: true; tasks: UserTask[]; stats: AccountStats; updatedAt?: string | null }>(
      '/api/tasks/replace',
      {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        tasks,
        clientLastChangeAt: clientLastChangeAt ?? Date.now(),
      }),
      },
    )
  } catch {
    // Compatibility fallback for older API versions without /api/tasks/replace.
    const cloud = await getCloudData(token)
    const localById = new Map(tasks.map((task) => [task.id, task]))
    let latestStats = cloud.stats

    for (const task of tasks) {
      const upserted = await upsertTaskCloud(token, task)
      latestStats = upserted.stats
    }

    for (const cloudTask of cloud.tasks) {
      if (!localById.has(cloudTask.id)) {
        const removed = await deleteTaskCloud(token, cloudTask.id)
        latestStats = removed.stats
      }
    }

    return {
      ok: true,
      tasks,
      stats: latestStats,
    }
  }
}

export async function deleteTaskCloud(token: string, taskId: string) {
  return request<{ ok: true; stats: AccountStats }>(`/api/tasks/${encodeURIComponent(taskId)}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

export async function upsertRecordCloud(
  token: string,
  payload: { date: string; completedTaskIds: string[]; clientLastChangeAt?: number },
) {
  try {
    return await request<{
      ok: true
      date: string
      completedTaskIds: string[]
      stats: AccountStats
      updatedAt: string | null
    }>('/api/records/upsert', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    })
  } catch {
    // Compatibility fallback for older API versions without /api/records/upsert.
    const cloud = await getCloudData(token)
    const mergedRecords = {
      ...(cloud.records || {}),
      [payload.date]: {
        date: payload.date,
        completedTaskIds: Array.from(new Set(payload.completedTaskIds || [])),
      },
    }

    const saved = await saveCloudData(token, {
      tasks: cloud.tasks,
      records: mergedRecords,
      theme: cloud.theme,
      lastLocalChangeAt: payload.clientLastChangeAt ?? Date.now(),
      authToken: null,
      userEmail: null,
      cloudUpdatedAt: cloud.updatedAt,
      notificationsEnabled: false,
    })

    return {
      ok: true,
      date: payload.date,
      completedTaskIds: mergedRecords[payload.date].completedTaskIds,
      stats: saved.stats,
      updatedAt: saved.updatedAt,
    }
  }
}

export async function setThemeCloud(
  token: string,
  payload: { theme: 'light' | 'dark'; clientLastChangeAt?: number },
) {
  try {
    return await request<{ ok: true; theme: 'light' | 'dark'; stats: AccountStats; updatedAt: string | null }>(
      '/api/theme',
      {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(payload),
      },
    )
  } catch {
    const cloud = await getCloudData(token)
    const saved = await saveCloudData(token, {
      tasks: cloud.tasks,
      records: cloud.records,
      theme: payload.theme,
      lastLocalChangeAt: payload.clientLastChangeAt ?? Date.now(),
      authToken: null,
      userEmail: null,
      cloudUpdatedAt: cloud.updatedAt,
      notificationsEnabled: false,
    })

    return {
      ok: true,
      theme: payload.theme,
      stats: saved.stats,
      updatedAt: saved.updatedAt,
    }
  }
}
