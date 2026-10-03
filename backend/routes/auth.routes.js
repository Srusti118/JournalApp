import express from 'express'
import authController from '../controllers/auth.controller.js'
import { protect, verifyCsrf } from '../middleware/auth.middleware.js'
import {
  registerValidation,
  loginValidation,
} from '../middleware/validation.js'

const router = express.Router()

// Public routes
router.post('/register', registerValidation, authController.register)
router.post('/login', loginValidation, authController.login)
router.post('/refresh-token', verifyCsrf, authController.refreshToken)
router.post('/logout', verifyCsrf, authController.logout)

// Google OAuth routes
router.get('/google', authController.googleAuth)
router.get('/google/callback', authController.googleCallback)

// Protected routes
router.get('/me', protect, authController.getMe)

export { router as authRouter }
export default router

