import type { AccountStats, PersistedAppState } from '../types'

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '')

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

  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host.endsWith('.ondigitalocean.app')) {
      const apiHost = `api-${host}`
      candidates.add(`https://${apiHost}${path}`)

      if (path.startsWith('/api/')) {
        candidates.add(`https://${apiHost}${path.slice(4)}`)
      }
    }
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
      lastError = 'API unavailable. Start backend on http://localhost:4000'
      continue
    }

    if (response.ok) {
      return (await response.json()) as T
    }

    const body = (await response.json().catch(() => ({}))) as { error?: string }
    lastError = body.error || `Request failed (${response.status})`

    if (response.status === 404 || response.status === 405) {
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
  return request<{ ok: true; stats: AccountStats; updatedAt: string | null }>('/api/data', {
    method: 'PUT',
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
