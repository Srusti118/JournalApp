import reminderService from '../services/reminder.service.js'

export const getVapidKey = (req, res) => {
  const publicKey = reminderService.getVapidPublicKey()
  res.json({
    success: true,
    data: { publicKey },
  })
}

export const getReminder = async (req, res, next) => {
  try {
    const reminder = await reminderService.getReminderForUser(req.user._id)
    res.json({
      success: true,
      data: { reminder },
    })
  } catch (error) {
    next(error)
  }
}

export const saveReminder = async (req, res, next) => {
  try {
    const { time, days, subscription, enabled } = req.body

    if (!time) {
      return res.status(400).json({
        success: false,
        message: 'Reminder time (HH:mm) is required',
      })
    }

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({
        success: false,
        message: 'Valid push subscription is required',
      })
    }

    const reminder = await reminderService.upsertReminder(req.user._id, {
      time,
      days,
      subscription,
      enabled,
    })

    res.json({
      success: true,
      data: { reminder },
    })
  } catch (error) {
    next(error)
  }
}

export const sendTest = async (req, res, next) => {
  try {
    await reminderService.sendTestReminder(req.user._id)
    res.json({
      success: true,
      message: 'Test notification sent successfully',
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getVapidKey,
  getReminder,
  saveReminder,
  sendTest,
}
