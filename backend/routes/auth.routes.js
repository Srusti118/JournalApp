const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')
const {
  registerValidation,
  loginValidation,
} = require('../middleware/validation')

router.post('/register', registerValidation, authController.register)
router.post('/login', loginValidation, authController.login)
router.post('/refresh-token', authController.refreshToken)
router.post('/logout', authController.logout)
router.get('/google', authController.googleAuth)
router.get('/google/callback', authController.googleCallback)
router.get('/me', protect, authController.getMe)

module.exports = router
