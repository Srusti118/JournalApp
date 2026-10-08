import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { username, bearer } from 'better-auth/plugins'
import mongoose from 'mongoose'
import { config } from './constants.js'

const client = mongoose.connection.getClient()
const db = client.db()

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || config.jwtSecret,
  baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${config.port}`,
  trustedOrigins: Array.from(
    new Set(
      [
        ...config.corsOrigins,
        config.clientUrl,
        process.env.CLIENT_URL,
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:4173',
      ]
        .filter(Boolean)
        .map((origin) => origin.replace(/\/+$/, ''))
    )
  ),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    storeStateStrategy: 'database',
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
    skipStateCookieCheck: true,
  },
  socialProviders: {
    ...(config.google.clientId && config.google.clientSecret
      ? {
          google: {
            clientId: config.google.clientId,
            clientSecret: config.google.clientSecret,
            prompt: 'select_account',
          },
        }
      : {}),
  },
  plugins: [
    username(),
    bearer(),
  ],
  advanced: {
    trustedProxyHeaders: true,
    useSecureCookies: process.env.NODE_ENV === 'production',
    defaultCookieAttributes: process.env.NODE_ENV === 'production'
      ? {
          sameSite: 'none',
          secure: true,
          httpOnly: true,
        }
      : {
          sameSite: 'lax',
          secure: false,
          httpOnly: true,
        },
  },
})

export default auth
