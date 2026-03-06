import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { GlassCard } from '../components/GlassCard'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { useAppStore } from '../store/useAppStore'

export function SettingsScreen() {
  const {
    theme,
    setTheme,
    exportData,
    importData,
    resetAll,
    login,
    register,
    logout,
    syncNow,
    userEmail,
    authLoading,
    syncError,
    accountStats,
  } = useAppStore()
  const { installAvailable, install } = useInstallPrompt()
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const download = () => {
    const payload = JSON.stringify(exportData(), null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `yeahdays-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()

    URL.revokeObjectURL(url)
    setMessage('Data exported')
  }

  const onImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const text = await file.text()
    const result = importData(text)
    setMessage(result.success ? 'Data imported' : result.error ?? 'Import failed')
    event.target.value = ''
  }

  const onReset = () => {
    if (!window.confirm('Reset all YeahDays data?')) {
      return
    }

    resetAll()
    setMessage('All data reset')
  }

  const handleAuth = async (mode: 'login' | 'register') => {
    if (!email || !password) {
      setMessage('Enter email and password')
      return
    }

    const result =
      mode === 'login' ? await login(email.trim(), password.trim()) : await register(email.trim(), password.trim())

    setMessage(result.success ? `${mode === 'login' ? 'Logged in' : 'Account created'}` : result.error ?? 'Auth failed')
    if (result.success) {
      setPassword('')
    }
  }

  return (
    <GlassCard className="space-y-4 px-4 py-4">
      <h2 className="text-lg font-semibold">Settings</h2>

      {!userEmail ? (
        <div className="surface-panel space-y-2 p-3">
          <p className="text-sm font-semibold">Account</p>
          <input
            className="glass-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="glass-input"
            type="password"
            placeholder="Password (min 6)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="glass-button glass-button-secondary"
              disabled={authLoading}
              onClick={() => void handleAuth('login')}
            >
              Login
            </button>
            <button
              type="button"
              className="glass-button"
              disabled={authLoading}
              onClick={() => void handleAuth('register')}
            >
              Register
            </button>
          </div>
        </div>
      ) : (
        <div className="surface-panel space-y-2 p-3">
          <p className="text-sm font-semibold">Signed in as {userEmail}</p>
          {accountStats && (
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-200/90">
              <p>Tracked days: {accountStats.trackedDays}</p>
              <p>100% days: {accountStats.completedDays}</p>
              <p>Completion: {accountStats.completionRate}%</p>
              <p>Streak: {accountStats.currentStreak}</p>
            </div>
          )}
          <div className="flex gap-2">
            <button type="button" className="glass-button glass-button-secondary" onClick={() => void syncNow()}>
              Sync now
            </button>
            <button type="button" className="glass-button glass-button-ghost" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="glass-button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        Theme: {theme === 'dark' ? 'Dark' : 'Light'}
      </button>

      {installAvailable && (
        <button
          type="button"
          className="glass-button glass-button-secondary"
          onClick={async () => {
            const accepted = await install()
            setMessage(accepted ? 'App installed' : 'Install dismissed')
          }}
        >
          Install app
        </button>
      )}

      <button type="button" className="glass-button" onClick={download}>
        Export JSON
      </button>

      <label className="glass-button glass-button-secondary cursor-pointer text-center">
        Import JSON
        <input type="file" accept="application/json" className="hidden" onChange={onImport} />
      </label>

      <button type="button" className="glass-button glass-button-danger" onClick={onReset}>
        Reset all data
      </button>

      {syncError && <p className="text-xs text-red-200">{syncError}</p>}
      {message && <p className="text-xs text-slate-200/85">{message}</p>}
    </GlassCard>
  )
}
