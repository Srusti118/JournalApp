const { config } = require('../config/constants')
const User = require('../models/user.model')
const { AppError } = require('../middleware/errorHandler')

// Generate Google OAuth consent URL
const getGoogleAuthUrl = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: config.google.redirectUri,
    client_id: config.google.clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  }

  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}

// Exchange authorization code for Google access token
const exchangeCodeForTokens = async (code) => {
  const url = 'https://oauth2.googleapis.com/token'
  const values = {
    code,
    client_id: config.google.clientId,
    client_secret: config.google.clientSecret,
    redirect_uri: config.google.redirectUri,
    grant_type: 'authorization_code',
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(values).toString(),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new AppError(
      data.error_description || 'Failed to exchange authorization code with Google',
      400,
      'OAUTH_CODE_EXCHANGE_FAILED'
    )
  }

  return data
}

// Fetch user profile from Google using access token
const getGoogleUserInfo = async (accessToken) => {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new AppError(
      data.error_description || 'Failed to fetch user profile from Google',
      400,
      'OAUTH_USERINFO_FAILED'
    )
  }

  return data
}

// Find existing user by googleId or email, or create a new user record
const findOrCreateGoogleUser = async (profile) => {
  const { sub: googleId, email, name, picture: avatar } = profile

  if (!email) {
    throw new AppError('Google account does not provide an email address', 400, 'OAUTH_NO_EMAIL')
  }

  // 1. Check if user already exists with this googleId
  let user = await User.findOne({ googleId })
  if (user) {
    if (avatar && user.avatar !== avatar) {
      user.avatar = avatar
      await user.save()
    }
    return user
  }

  // 2. Check if user already exists with same email (link account)
  user = await User.findOne({ email: email.toLowerCase() })
  if (user) {
    user.googleId = googleId
    if (avatar && !user.avatar) {
      user.avatar = avatar
    }
    await user.save()
    return user
  }

  // 3. Create a unique username for the new user
  let baseUsername = (name || email.split('@')[0])
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .slice(0, 20)

  if (baseUsername.length < 3) {
    baseUsername = `user_${baseUsername}`
  }

  let username = baseUsername
  let counter = 1
  while (await User.findOne({ username })) {
    username = `${baseUsername.slice(0, 15)}_${counter}`
    counter += 1
  }

  // 4. Create new user without password (Google authenticated)
  user = await User.create({
    username,
    email: email.toLowerCase(),
    googleId,
    avatar: avatar || '',
  })

  return user
}

module.exports = {
  getGoogleAuthUrl,
  exchangeCodeForTokens,
  getGoogleUserInfo,
  findOrCreateGoogleUser,
}
