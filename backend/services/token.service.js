import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { RefreshToken } from '../models/refreshToken.model.js'
import { config } from '../config/constants.js'

// Generate access token (JWT)
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    algorithm: config.jwtAlgorithm,
    expiresIn: config.accessTokenExpiry,
  })
}

// Generate refresh token (stored in DB)
export const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(64).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + config.refreshTokenExpiryDays)

  await RefreshToken.create({
    token,
    user: userId,
    expiresAt,
  })

  return token
}

// Generate CSRF token
export const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

// Verify access token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtSecret, {
    algorithms: [config.jwtAlgorithm],
  })
}

// Verify refresh token exists in DB
export const verifyRefreshToken = async (token) => {
  const storedToken = await RefreshToken.findOne({ token })
  return storedToken
}

// Delete refresh token
export const deleteRefreshToken = async (token) => {
  return RefreshToken.deleteOne({ token })
}

// Get cookie options for refresh token
export const getRefreshCookieOptions = () => {
  return {
    ...config.cookieOptions,
    maxAge: config.refreshTokenExpiryDays * 24 * 60 * 60 * 1000,
  }
}

// Get cookie options for CSRF token (not httpOnly, so JS can read it)
export const getCsrfCookieOptions = () => {
  return {
    ...config.cookieOptions,
    httpOnly: false,
    maxAge: config.csrfTokenExpiryDays * 24 * 60 * 60 * 1000,
  }
}

export default {
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken,
  verifyAccessToken,
  verifyRefreshToken,
  deleteRefreshToken,
  getRefreshCookieOptions,
  getCsrfCookieOptions,
}