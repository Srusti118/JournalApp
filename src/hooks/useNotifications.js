import { useState, useEffect } from 'react'

export const useNotifications = () => {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator

  const [permission, setPermission] = useState(() => {
    return isSupported ? Notification.permission : 'denied'
  })

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission)
    }
  }, [isSupported])

  const requestPermission = async () => {
    if (!isSupported) return 'denied'
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch {
      return 'denied'
    }
  }

  const sendLocalNotification = async (title = 'Sanctuary — Daily Reflection', options = {}) => {
    if (!isSupported || permission !== 'granted') return

    try {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, {
        body: 'Take a mindful pause. Record your reflections for today.',
        icon: '/icon-192.png',
        badge: '/icon.svg',
        tag: 'sanctuary-daily-reflection',
        renotify: true,
        ...options
      })
    } catch {}
  }

  return {
    isSupported,
    permission,
    requestPermission,
    sendLocalNotification
  }
}
