const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const RefreshToken = require("../models/refreshToken.model");
const { config } = require("../config/constants");

// Generate access token (JWT)
function generateAccessToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, {
    algorithm: config.jwtAlgorithm,
    expiresIn: config.accessTokenExpiry,
  });
}

// Generate refresh token (stored in DB)
async function generateRefreshToken(userId) {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.refreshTokenExpiryDays);

  await RefreshToken.create({
    token,
    user: userId,
    expiresAt,
  });

  return token;
}

// Generate CSRF token
function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Verify access token
function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret, {
    algorithms: [config.jwtAlgorithm],
  });
}

// Verify refresh token exists in DB
async function verifyRefreshToken(token) {
  const storedToken = await RefreshToken.findOne({ token });
  return storedToken;
}

// Delete refresh token
async function deleteRefreshToken(token) {
  return RefreshToken.deleteOne({ token });
}

// Get cookie options for refresh token
function getRefreshCookieOptions() {
  return {
    ...config.cookieOptions,
    maxAge: config.refreshTokenExpiryDays * 24 * 60 * 60 * 1000,
  };
}

// Get cookie options for CSRF token (not httpOnly, so JS can read it)
function getCsrfCookieOptions() {
  return {
    ...config.cookieOptions,
    httpOnly: false,
    maxAge: config.csrfTokenExpiryDays * 24 * 60 * 60 * 1000,
  };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken,
  verifyAccessToken,
  verifyRefreshToken,
  deleteRefreshToken,
  getRefreshCookieOptions,
  getCsrfCookieOptions,
};