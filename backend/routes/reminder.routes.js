import express from 'express'
import reminderController from '../controllers/reminder.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public route: Retrieve VAPID public key for browser push registration
router.get('/vapid-key', reminderController.getVapidKey)

// Protected routes require authentication
router.use(protect)

router.get('/', reminderController.getReminder)
router.post('/', reminderController.saveReminder)
router.post('/test', reminderController.sendTest)

export { router as reminderRouter }
export default router
