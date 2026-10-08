import { createAuthClient } from 'better-auth/react'
import { usernameClient } from 'better-auth/client/plugins'

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl && /^https?:\/\//i.test(envUrl)) {
    return envUrl.replace(/\/api\/?$/, '')
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'http://localhost:5000'
}

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    usernameClient(),
  ],
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient

export default authClient
