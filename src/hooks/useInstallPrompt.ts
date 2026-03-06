import { useEffect, useState } from 'react'

interface DeferredPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as DeferredPromptEvent)
    }

    const onInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) {
      return false
    }

    await deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    return result.outcome === 'accepted'
  }

  return {
    installAvailable: Boolean(deferredPrompt) && !installed,
    install,
    installed,
  }
}
