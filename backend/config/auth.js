import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { username, bearer } from 'better-auth/plugins'
import { MongoClient } from 'mongodb'
import { config } from './constants.js'

const client = new MongoClient(config.mongoUri)
const db = client.db()

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret: process.env.BETTER_AUTH_SECRET || config.jwtSecret,
  baseURL: `http://localhost:${config.port}`,
  trustedOrigins: config.corsOrigins,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(config.google.clientId && config.google.clientSecret
      ? {
          google: {
            clientId: config.google.clientId,
            clientSecret: config.google.clientSecret,
          },
        }
      : {}),
  },
  plugins: [
    username(),
    bearer(),
  ],
})

export default auth
