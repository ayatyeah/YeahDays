import { openDB } from 'idb'
import type { PersistedAppState } from '../types'

const DB_NAME = 'yeahdays-db'
const STORE_NAME = 'kv-store'
const KEY = 'yeahdays-app-state'

let dbEnabled = true

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    },
  })
}

export async function loadPersistedState(): Promise<PersistedAppState | null> {
  try {
    if (dbEnabled) {
      const db = await getDb()
      const data = await db.get(STORE_NAME, KEY)
      if (data) {
        return data as PersistedAppState
      }
    }
  } catch {
    dbEnabled = false
  }

  try {
    const fallback = localStorage.getItem(KEY)
    return fallback ? (JSON.parse(fallback) as PersistedAppState) : null
  } catch {
    return null
  }
}

export async function savePersistedState(state: PersistedAppState): Promise<void> {
  try {
    if (dbEnabled) {
      const db = await getDb()
      await db.put(STORE_NAME, state, KEY)
      return
    }
  } catch {
    dbEnabled = false
  }

  localStorage.setItem(KEY, JSON.stringify(state))
}
