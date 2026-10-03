import authService from '../services/auth.service.js'
import oauthService from '../services/oauth.service.js'
import { config } from '../config/constants.js'
import {
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken,
  verifyRefreshToken,
  deleteRefreshToken,
  getRefreshCookieOptions,
  getCsrfCookieOptions,
} from '../services/token.service.js'
import { AppError } from '../middleware/errorHandler.js'

// Register new user
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    const user = await authService.registerUser(username, email, password)

    const accessToken = generateAccessToken(user._id)
    const refreshToken = await generateRefreshToken(user._id)
    const csrfToken = generateCsrfToken()

    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions())
    res.cookie('csrfToken', csrfToken, getCsrfCookieOptions())

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        accessToken,
        csrfToken,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await authService.loginUser(email, password)

    const accessToken = generateAccessToken(user._id)
    const refreshToken = await generateRefreshToken(user._id)
    const csrfToken = generateCsrfToken()

    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions())
    res.cookie('csrfToken', csrfToken, getCsrfCookieOptions())

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        accessToken,
        csrfToken,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Refresh access token
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      return next(new AppError('Refresh token required', 401, 'NO_REFRESH_TOKEN'))
    }

    const storedToken = await verifyRefreshToken(refreshToken)
    if (!storedToken) {
      res.clearCookie('refreshToken', { path: '/' })
      res.clearCookie('csrfToken', { path: '/' })
      return next(new AppError('Invalid refresh token', 403, 'INVALID_REFRESH_TOKEN'))
    }

    // Delete old refresh token (rotation)
    await deleteRefreshToken(refreshToken)

    // Generate new tokens
    const accessToken = generateAccessToken(storedToken.user)
    const newRefreshToken = await generateRefreshToken(storedToken.user)
    const csrfToken = generateCsrfToken()

    // Set new cookies
    res.cookie('refreshToken', newRefreshToken, getRefreshCookieOptions())
    res.cookie('csrfToken', csrfToken, getCsrfCookieOptions())

    res.json({
      success: true,
      data: {
        accessToken,
        csrfToken,
      },
    })
  } catch (error) {
    res.clearCookie('refreshToken', { path: '/' })
    res.clearCookie('csrfToken', { path: '/' })
    next(new AppError('Invalid refresh token', 403, 'INVALID_REFRESH_TOKEN'))
  }
}

// Logout user
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (refreshToken) {
      await deleteRefreshToken(refreshToken)
    }

    // Clear cookies
    res.clearCookie('refreshToken', { path: '/' })
    res.clearCookie('csrfToken', { path: '/' })

    res.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    next(error)
  }
}

// Get current user
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user._id)

    res.json({
      success: true,
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}

// Google OAuth initiate
export const googleAuth = (req, res) => {
  if (!config.google.clientId || !config.google.clientSecret) {
    return res.status(500).json({
      success: false,
      message: 'Google OAuth is not configured on the server. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env',
      code: 'GOOGLE_AUTH_NOT_CONFIGURED',
    })
  }

  const authUrl = oauthService.getGoogleAuthUrl()
  res.redirect(authUrl)
}

// Google OAuth callback
export const googleCallback = async (req, res, next) => {
  try {
    const { code, error } = req.query

    if (error) {
      return res.redirect(`${config.clientUrl}/login?error=${encodeURIComponent(error)}`)
    }

    if (!code) {
      return res.redirect(`${config.clientUrl}/login?error=no_code`)
    }

    const tokens = await oauthService.exchangeCodeForTokens(code)
    const profile = await oauthService.getGoogleUserInfo(tokens.access_token)
    const user = await oauthService.findOrCreateGoogleUser(profile)

    const accessToken = generateAccessToken(user._id)
    const refreshToken = await generateRefreshToken(user._id)
    const csrfToken = generateCsrfToken()

    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions())
    res.cookie('csrfToken', csrfToken, getCsrfCookieOptions())

    res.redirect(`${config.clientUrl}/auth/callback?token=${accessToken}&csrf=${csrfToken}`)
  } catch (err) {
    const message = err.message || 'Google authentication failed'
    res.redirect(`${config.clientUrl}/login?error=${encodeURIComponent(message)}`)
  }
}

export default {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  googleAuth,
  googleCallback,
}