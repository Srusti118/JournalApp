import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authApi } from '../services/api'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { handleAuthSuccess } = useAuth()

  const errorParam = searchParams.get('error')
  const token = searchParams.get('token')
  const initialError = errorParam
    ? decodeURIComponent(errorParam)
    : !token
      ? 'No authentication token received from Google'
      : ''

  const [errorMessage, setErrorMessage] = useState(initialError)

  useEffect(() => {
    if (initialError) return

    const csrf = searchParams.get('csrf')
    let isMounted = true

    const completeAuth = async () => {
      try {
        const data = await authApi.getMe(token)
        if (!isMounted) return

        handleAuthSuccess({
          user: data.user,
          accessToken: token,
          csrfToken: csrf || null,
        })
        navigate('/', { replace: true })
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || 'Failed to authenticate with Google')
        }
      }
    }

    completeAuth()

    return () => {
      isMounted = false
    }
  }, [initialError, token, searchParams, handleAuthSuccess, navigate])


  if (errorMessage) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2 style={{ color: '#e53e3e', marginBottom: '16px' }}>Authentication Error</h2>
        <p style={{ marginBottom: '24px' }}>{errorMessage}</p>
        <button
          type="button"
          onClick={() => navigate('/login', { replace: true })}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3182ce',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <p style={{ fontSize: '18px', color: '#718096' }}>Signing in with Google, please wait...</p>
    </div>
  )
}
