import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react'
import { authClient } from '../services/authClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { data: session, isPending, error } = authClient.useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isPending) {
      setLoading(false)
    }
  }, [isPending])

  // Format user object for consistent consumption across the app
  const user = useMemo(() => {
    if (!session?.user) return null
    return {
      ...session.user,
      id: session.user.id,
      _id: session.user.id,
      name: session.user.name || '',
      username: session.user.username || session.user.name || session.user.email,
      avatar: session.user.image || session.user.avatar || '',
    }
  }, [session])

  // Login with Better Auth
  const login = useCallback(async ({ email, password }) => {
    const res = await authClient.signIn.email({
      email,
      password,
    })

    if (res?.error) {
      const err = new Error(res.error.message || 'Login failed')
      err.code = res.error.code
      throw err
    }

    return res?.data?.user
  }, [])

  // Register with Better Auth
  const register = useCallback(async ({ username, email, password }) => {
    const res = await authClient.signUp.email({
      email,
      password,
      name: username,
      username,
    })

    if (res?.error) {
      const err = new Error(res.error.message || 'Registration failed')
      err.code = res.error.code
      throw err
    }

    return res?.data?.user
  }, [])

  // Logout with Better Auth
  const logout = useCallback(async () => {
    await authClient.signOut()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || isPending,
        error,
        login,
        register,
        logout,
        authClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default useAuth