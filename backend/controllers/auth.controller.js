const authService = require('../services/auth.service')
const {
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken,
  verifyRefreshToken,
  deleteRefreshToken,
  getRefreshCookieOptions,
  getCsrfCookieOptions,
} = require('../services/token.service')
const { AppError } = require('../middleware/errorHandler')

// Register new user
exports.register = async (req, res, next) => {
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
exports.login = async (req, res, next) => {
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
exports.refreshToken = async (req, res, next) => {
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
exports.logout = async (req, res, next) => {
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
exports.getMe = async (req, res, next) => {
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