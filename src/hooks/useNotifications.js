import { useState, useEffect } from 'react'

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const useNotifications = () => {
  const isSupported =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window

  const [permission, setPermission] = useState(() => {
    return typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  })

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return 'denied'
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch {
      return 'denied'
    }
  }

  const subscribeToPush = async (vapidPublicKey) => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported on this browser')
    }
    if (!vapidPublicKey) {
      throw new Error('VAPID public key was not found')
    }

    const registration = await navigator.serviceWorker.ready
    if (!registration) {
      throw new Error('Service worker is not active')
    }

    let subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      try {
        await subscription.unsubscribe()
      } catch {}
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey.trim())
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })

    return subscription
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
        ...options,
      })
    } catch {}
  }

  return {
    isSupported,
    permission,
    requestPermission,
    subscribeToPush,
    sendLocalNotification,
  }
}
