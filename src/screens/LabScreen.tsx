import { useMemo, useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import ogBudaSecret from '../assets/og-buda-secret.svg'
import { useAppStore } from '../store/useAppStore'
import { getCloudData } from '../utils/apiClient'

interface DbCheckResult {
  checkedAt: string
  localTaskCount: number
  cloudTaskCount: number
  missingInCloud: string[]
  extraInCloud: string[]
  ok: boolean
}

const boosterPool = [
  '15 min focus sprint with phone in another room',
  'Cold water face splash + deep breath reset',
  'One high-weight task before any scrolling',
  'Quick cleanup challenge for your desk',
  'Push-ups + 60 sec plank combo',
  'Read 5 pages and write one key note',
  '2-minute journaling check-in',
  'One bold message you were delaying',
  'Mini mobility session for neck/back',
]

function pickBoosters(seedText: string) {
  const seed = Array.from(seedText).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const items = [...boosterPool]
  const selected: string[] = []

  let idxSeed = seed || 1
  while (selected.length < 3 && items.length > 0) {
    idxSeed = (idxSeed * 17 + 29) % 997
    const idx = idxSeed % items.length
    selected.push(items.splice(idx, 1)[0])
  }

  return selected
}

export function LabScreen() {
  const { authToken, tasks, syncNow, refreshFromCloud } = useAppStore()
  const [dbCheckLoading, setDbCheckLoading] = useState(false)
  const [repairLoading, setRepairLoading] = useState(false)
  const [dbCheckError, setDbCheckError] = useState<string | null>(null)
  const [dbCheckResult, setDbCheckResult] = useState<DbCheckResult | null>(null)
  const [mood, setMood] = useState('locked in')
  const [tapCount, setTapCount] = useState(0)

  const boosters = useMemo(() => pickBoosters(mood), [mood])
  const showSecret = tapCount >= 7

  const runDbCheck = async () => {
    if (!authToken) {
      setDbCheckError('Login required for DB check')
      return
    }

    setDbCheckLoading(true)
    setDbCheckError(null)

    try {
      const cloud = await getCloudData(authToken)
      const localIds = new Set(tasks.map((task) => task.id))
      const cloudIds = new Set(cloud.tasks.map((task) => task.id))

      const missingInCloud = [...localIds].filter((id) => !cloudIds.has(id))
      const extraInCloud = [...cloudIds].filter((id) => !localIds.has(id))

      setDbCheckResult({
        checkedAt: new Date().toISOString(),
        localTaskCount: tasks.length,
        cloudTaskCount: cloud.tasks.length,
        missingInCloud,
        extraInCloud,
        ok: missingInCloud.length === 0,
      })
    } catch (error) {
      setDbCheckError(error instanceof Error ? error.message : 'DB check failed')
    } finally {
      setDbCheckLoading(false)
    }
  }

  const runAutoRepair = async () => {
    if (!authToken) {
      setDbCheckError('Login required for auto-repair')
      return
    }

    setRepairLoading(true)
    setDbCheckError(null)

    try {
      await syncNow()
      await refreshFromCloud()
      await runDbCheck()
    } catch (error) {
      setDbCheckError(error instanceof Error ? error.message : 'Auto-repair failed')
    } finally {
      setRepairLoading(false)
    }
  }

  return (
    <>
      <GlassCard className="space-y-3 px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="glass-chip px-3 text-xs font-semibold"
            onClick={() => setTapCount((count) => count + 1)}
          >
            Vault Mode
          </button>
          <span className="text-xs text-slate-200/80">Tap badge x7 for secret</span>
        </div>

        <h2 className="text-lg font-semibold">Momentum Lab</h2>
        <p className="text-xs text-slate-200/80">
          Premium control center: cloud integrity check + daily performance boosters.
        </p>
      </GlassCard>

      <GlassCard className="space-y-3 px-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">DB Sync Check</h3>
          <button type="button" className="glass-button !w-auto px-4" onClick={() => void runDbCheck()}>
            {dbCheckLoading ? 'Checking...' : 'Check DB now'}
          </button>
        </div>

        <button
          type="button"
          className="glass-button glass-button-secondary"
          onClick={() => void runAutoRepair()}
        >
          {repairLoading ? 'Repairing cloud...' : 'Auto-Repair Cloud Mismatch'}
        </button>

        {dbCheckError && <p className="text-xs text-rose-200">{dbCheckError}</p>}

        {dbCheckResult ? (
          <div className="vault-grid">
            <div className="vault-chip">
              <p>Result</p>
              <strong>{dbCheckResult.ok ? 'OK' : 'Mismatch'}</strong>
            </div>
            <div className="vault-chip">
              <p>Local tasks</p>
              <strong>{dbCheckResult.localTaskCount}</strong>
            </div>
            <div className="vault-chip">
              <p>Cloud tasks</p>
              <strong>{dbCheckResult.cloudTaskCount}</strong>
            </div>
            <div className="vault-chip">
              <p>Missing in cloud</p>
              <strong>{dbCheckResult.missingInCloud.length}</strong>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-200/80">Run check to verify tasks are written to DB.</p>
        )}

        {dbCheckResult && (
          <p className="text-[11px] text-slate-300/80">Last check: {new Date(dbCheckResult.checkedAt).toLocaleString()}</p>
        )}
      </GlassCard>

      <GlassCard className="space-y-3 px-4 py-4">
        <h3 className="text-sm font-semibold">Daily Booster Generator</h3>
        <input
          className="glass-input"
          value={mood}
          onChange={(event) => setMood(event.target.value)}
          placeholder="Mood / focus input"
        />

        <div className="space-y-2">
          {boosters.map((booster, idx) => (
            <div key={`${booster}-${idx}`} className="surface-panel px-3 py-2 text-sm">
              {idx + 1}. {booster}
            </div>
          ))}
        </div>
      </GlassCard>

      {showSecret && (
        <GlassCard className="space-y-3 px-4 py-4">
          <h3 className="text-sm font-semibold">Hidden OG Zone</h3>
          <p className="text-xs text-slate-200/80">Secret tribute visual unlocked.</p>
          <img src={ogBudaSecret} alt="Hidden OG style tribute" className="secret-poster" />
        </GlassCard>
      )}
    </>
  )
}
