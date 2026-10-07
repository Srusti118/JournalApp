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
  trustedOrigins: Array.from(new Set([...config.corsOrigins, config.clientUrl, process.env.CLIENT_URL].filter(Boolean))),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
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
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
  },
})

export default auth
