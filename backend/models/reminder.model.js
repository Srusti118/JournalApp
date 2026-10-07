import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    time: {
      type: String,
      required: [true, 'Reminder time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm 24-hour format'],
      index: true,
    },
    days: {
      type: [Number],
      default: [0, 1, 2, 3, 4, 5, 6],
    },
    subscription: {
      endpoint: {
        type: String,
        required: [true, 'Push subscription endpoint is required'],
      },
      keys: {
        p256dh: {
          type: String,
          required: true,
        },
        auth: {
          type: String,
          required: true,
        },
      },
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastSentDate: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

reminderSchema.index({ enabled: 1, time: 1 })

const Reminder = mongoose.model('Reminder', reminderSchema)

export { Reminder }
export default Reminder
