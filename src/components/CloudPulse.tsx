import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'

function formatRelativeCloudTime(updatedAt: string | null) {
  if (!updatedAt) {
    return 'No cloud sync yet'
  }

  const diffMs = Date.now() - Date.parse(updatedAt)
  if (!Number.isFinite(diffMs)) {
    return 'Cloud time unavailable'
  }

  const sec = Math.max(0, Math.floor(diffMs / 1000))
  if (sec < 6) {
    return 'Synced just now'
  }
  if (sec < 60) {
    return `Synced ${sec}s ago`
  }

  const min = Math.floor(sec / 60)
  if (min < 60) {
    return `Synced ${min}m ago`
  }

  const hrs = Math.floor(min / 60)
  return `Synced ${hrs}h ago`
}

export function CloudPulse() {
  const { cloudSyncPending, syncError, cloudUpdatedAt, syncNow } = useAppStore()

  const status = useMemo(() => {
    if (syncError) {
      return {
        tone: 'error' as const,
        title: 'Cloud needs attention',
        subtitle: syncError,
      }
    }

    if (cloudSyncPending) {
      return {
        tone: 'pending' as const,
        title: 'Sync in progress',
        subtitle: 'Sending updates to cloud...',
      }
    }

    return {
      tone: 'ok' as const,
      title: 'Cloud connected',
      subtitle: formatRelativeCloudTime(cloudUpdatedAt ?? null),
    }
  }, [cloudSyncPending, syncError, cloudUpdatedAt])

  return (
    <button type="button" className={`cloud-pulse ${status.tone}`} onClick={() => void syncNow()}>
      <span className="cloud-pulse-dot" aria-hidden />
      <span className="cloud-pulse-copy">
        <strong>{status.title}</strong>
        <small>{status.subtitle}</small>
      </span>
      <span className="cloud-pulse-action">Sync</span>
    </button>
  )
}
