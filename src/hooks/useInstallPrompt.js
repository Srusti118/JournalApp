import { useState, useEffect } from 'react'

export const useInstallPrompt = () => {
  const [promptInstall, setPromptInstall] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setPromptInstall(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstallable(false)
      setPromptInstall(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!promptInstall) return
    promptInstall.prompt()
    const { outcome } = await promptInstall.userChoice
    if (outcome === 'accepted') {
      setIsInstallable(false)
    }
  }

  return { isInstallable, handleInstallClick }
}
