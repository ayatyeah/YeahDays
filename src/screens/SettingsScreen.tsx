import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { GlassCard } from '../components/GlassCard'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { useAppStore } from '../store/useAppStore'
import { getConfiguredApiBase } from '../utils/apiClient'

interface SettingsScreenProps {
  reminders: {
    supported: boolean
    permission: NotificationPermission
    requestPermission: () => Promise<boolean>
  }
}

export function SettingsScreen({ reminders }: SettingsScreenProps) {
  const {
    theme,
    setTheme,
    exportData,
    importData,
    resetAll,
    logout,
    syncNow,
    userEmail,
    syncError,
    accountStats,
    notificationsEnabled,
    setNotificationsEnabled,
    cloudSyncPending,
    cloudUpdatedAt,
  } = useAppStore()
  const { installAvailable, install } = useInstallPrompt()
  const [message, setMessage] = useState('')

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

  return (
    <GlassCard className="space-y-4 px-4 py-4">
      <h2 className="text-lg font-semibold">Settings</h2>

      <div className="surface-panel space-y-2 p-3">
        <p className="text-sm font-semibold">Signed in as {userEmail}</p>
        {accountStats && (
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-200/90">
            <p>Tracked days: {accountStats.trackedDays}</p>
            <p>100% days: {accountStats.completedDays}</p>
            <p>Completion: {accountStats.completionRate}%</p>
            <p>Streak: {accountStats.currentStreak}</p>
            <p>Red days: {accountStats.lifeStatus.red}</p>
            <p>Yellow days: {accountStats.lifeStatus.yellow}</p>
            <p>Green days: {accountStats.lifeStatus.green}</p>
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

      <div className="surface-panel space-y-2 p-3">
        <p className="text-sm font-semibold">Task reminders</p>
        <p className="text-xs text-slate-200/85">Notification permission: {reminders.permission}</p>
        {!reminders.supported && <p className="text-xs text-red-200">This browser does not support notifications.</p>}
        {reminders.supported && reminders.permission !== 'granted' && (
          <button
            type="button"
            className="glass-button glass-button-secondary"
            onClick={async () => {
              const granted = await reminders.requestPermission()
              setMessage(granted ? 'Notifications enabled' : 'Permission not granted')
            }}
          >
            Enable browser notifications
          </button>
        )}

        <button
          type="button"
          className={`glass-button ${notificationsEnabled ? '' : 'glass-button-secondary'}`}
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
        >
          {notificationsEnabled ? 'Reminders: ON' : 'Reminders: OFF'}
        </button>
      </div>

      <div className="surface-panel space-y-1 p-3 text-xs">
        <p className="text-sm font-semibold">Sync debug</p>
        <p>API: {getConfiguredApiBase()}</p>
        <p>Cloud pending: {cloudSyncPending ? 'yes' : 'no'}</p>
        <p>Cloud updated: {cloudUpdatedAt || 'none'}</p>
      </div>

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
