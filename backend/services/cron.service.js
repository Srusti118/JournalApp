import cron from 'node-cron'
import { Reminder } from '../models/reminder.model.js'
import { sendNotificationToSubscription } from './reminder.service.js'

export const initCron = () => {
  // Run every minute: * * * * *
  const job = cron.schedule('* * * * *', async () => {
    try {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const currentTime = `${hours}:${minutes}`
      const currentDay = now.getDay()
      const currentDate = now.toISOString().slice(0, 10)

      const activeReminders = await Reminder.find({
        enabled: true,
        time: currentTime,
        days: currentDay,
        lastSentDate: { $ne: currentDate },
      })

      if (!activeReminders.length) return

      for (const reminder of activeReminders) {
        try {
          const payload = {
            title: 'DearDiary — Daily Reflection',
            body: 'It is time for your daily mindful reflection. Open DearDiary to write your thoughts.',
            icon: '/icon-192.png',
            badge: '/icon.svg',
            tag: 'deardiary-scheduled-reflection',
            timestamp: Date.now(),
          }

          await sendNotificationToSubscription(reminder.subscription, payload)

          reminder.lastSentDate = currentDate
          await reminder.save()
        } catch (error) {
          // If the push subscription is expired or unsubscribed (HTTP 410 or 404), disable it
          if (error.statusCode === 410 || error.statusCode === 404) {
            reminder.enabled = false
            await reminder.save()
          }
        }
      }
    } catch {}
  })

  return job
}

export default { initCron }
