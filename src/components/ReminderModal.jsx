import { useState, useEffect } from 'react'
import { useNotifications } from '../hooks/useNotifications'
import { useAuthFetch } from '../hooks/useAuthFetch'
import styles from './ReminderModal.module.css'

const DAYS_OF_WEEK = [
  { label: 'Su', value: 0 },
  { label: 'Mo', value: 1 },
  { label: 'Tu', value: 2 },
  { label: 'We', value: 3 },
  { label: 'Th', value: 4 },
  { label: 'Fr', value: 5 },
  { label: 'Sa', value: 6 },
]

export const ReminderModal = ({ isOpen, onClose }) => {
  const [time, setTime] = useState('20:00')
  const [days, setDays] = useState([0, 1, 2, 3, 4, 5, 6])
  const [enabled, setEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const { isSupported, permission, requestPermission, subscribeToPush } = useNotifications()
  const authFetch = useAuthFetch()

  // Load existing reminder settings on open
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    const fetchExistingReminder = async () => {
      try {
        const res = await authFetch.get('/reminders')
        if (res.ok) {
          const data = await res.json()
          const reminder = data.data?.reminder
          if (reminder && isMounted) {
            setTime(reminder.time || '20:00')
            setDays(reminder.days || [0, 1, 2, 3, 4, 5, 6])
            setEnabled(reminder.enabled !== undefined ? reminder.enabled : true)
          }
        }
      } catch {}
    }

    fetchExistingReminder()
    return () => {
      isMounted = false
    }
  }, [isOpen, authFetch])

  if (!isOpen) return null

  const toggleDay = (dayValue) => {
    setDays((prev) => {
      if (prev.includes(dayValue)) {
        if (prev.length === 1) return prev // Keep at least one day
        return prev.filter((d) => d !== dayValue)
      }
      return [...prev, dayValue].sort()
    })
  }

  const handleSave = async () => {
    setLoading(true)
    setStatus(null)

    try {
      // 1. Ensure notification permission is granted
      let currentPermission = permission
      if (currentPermission !== 'granted') {
        currentPermission = await requestPermission()
      }

      if (currentPermission !== 'granted') {
        setStatus({
          type: 'error',
          message: 'Notification permission is required to receive reminders.',
        })
        setLoading(false)
        return
      }

      // 2. Fetch VAPID public key
      const vapidRes = await authFetch.get('/reminders/vapid-key')
      if (!vapidRes.ok) throw new Error('Failed to retrieve notification key')
      const vapidData = await vapidRes.json()
      const publicKey = vapidData.data?.publicKey

      // 3. Subscribe with browser PushManager
      const subscription = await subscribeToPush(publicKey)
      if (!subscription) throw new Error('Could not register device push subscription')

      // 4. Save to backend MongoDB
      const saveRes = await authFetch.post('/reminders', {
        time,
        days,
        enabled,
        subscription,
      })

      if (!saveRes.ok) throw new Error('Failed to save reminder settings')

      setStatus({
        type: 'success',
        message: `Reminder scheduled for ${time} daily!`,
      })

      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Error configuring reminder',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendTest = async () => {
    setLoading(true)
    setStatus(null)

    try {
      const res = await authFetch.post('/reminders/test', {})
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Test push failed')
      }

      setStatus({
        type: 'success',
        message: 'Test notification sent to your device!',
      })
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Could not send test push',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Daily Reflection Reminder</h2>
            <p className={styles.subtitle}>
              Set a dedicated time to pause and write in your journal.
            </p>
          </div>
          <button
            onClick={onClose}
            className={styles.closeBtn}
            type="button"
            aria-label="Close reminder modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="reminder-time">
            Reminder Time
          </label>
          <input
            id="reminder-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={styles.timeInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Repeat On</label>
          <div className={styles.daysGrid}>
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = days.includes(day.value)
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`${styles.dayBtn} ${isSelected ? styles.dayBtnSelected : ''}`}
                >
                  {day.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Enable Reminders</span>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className={styles.toggleCheckbox}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !isSupported}
            className={styles.saveBtn}
          >
            {loading ? 'Saving...' : 'Save Schedule'}
          </button>

          <button
            type="button"
            onClick={handleSendTest}
            disabled={loading || !isSupported}
            className={styles.testBtn}
          >
            Send Test Push Notification
          </button>
        </div>

        {status && (
          <p
            className={`${styles.statusMessage} ${
              status.type === 'success' ? styles.statusSuccess : styles.statusError
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  )
}

export default ReminderModal
