import webpush from 'web-push'
import { Reminder } from '../models/reminder.model.js'
import { config } from '../config/constants.js'

// Initialize web-push with VAPID credentials if available
if (config.vapid.publicKey && config.vapid.privateKey) {
  webpush.setVapidDetails(
    config.vapid.mailto,
    config.vapid.publicKey,
    config.vapid.privateKey
  )
}

export const getVapidPublicKey = () => {
  return config.vapid.publicKey
}

export const getReminderForUser = async (userId) => {
  return await Reminder.findOne({ user: userId })
}

export const upsertReminder = async (userId, data) => {
  const { time, days, subscription, enabled } = data

  const reminder = await Reminder.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      time,
      days: Array.isArray(days) ? days : [0, 1, 2, 3, 4, 5, 6],
      subscription,
      enabled: enabled !== undefined ? enabled : true,
    },
    { new: true, upsert: true, runValidators: true }
  )

  return reminder
}

export const sendNotificationToSubscription = async (subscription, payload) => {
  const stringifiedPayload = typeof payload === 'string' ? payload : JSON.stringify(payload)
  return await webpush.sendNotification(subscription, stringifiedPayload)
}

export const sendTestReminder = async (userId) => {
  const reminder = await Reminder.findOne({ user: userId })
  if (!reminder || !reminder.subscription) {
    const error = new Error('No push subscription found for this user')
    error.status = 404
    throw error
  }

  const payload = {
    title: 'Sanctuary — Reminder Test',
    body: 'Your scheduled reminder is configured and working perfectly!',
    icon: '/icon-192.png',
    badge: '/icon.svg',
    tag: 'sanctuary-test-reminder',
    timestamp: Date.now(),
  }

  return await sendNotificationToSubscription(reminder.subscription, payload)
}

export default {
  getVapidPublicKey,
  getReminderForUser,
  upsertReminder,
  sendNotificationToSubscription,
  sendTestReminder,
}
