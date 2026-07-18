import Header from "./components/Header";
import "./App.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { ThemeContext } from "./ThemeContext";
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/notes"
const AUTH_URL = import.meta.env.VITE_API_URL?.replace("/notes", "/auth") || "http://localhost:5000/api/auth"

const App = () => {
  const [entries, setEntries] = useState([])
  const [theme, setTheme] = useState("light")
  const [loading, setLoading] = useState(true)
  
  // User persisted in localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })
  
  // Access token in MEMORY only (not persisted for security)
  const accessTokenRef = useRef(null)
  const [, forceRender] = useState(0)
  
  // CSRF token (can be in state, it's meant to be read by JS)
  const [csrfToken, setCsrfToken] = useState(() => localStorage.getItem("csrfToken"))

  const setAccessToken = useCallback((token) => {
    accessTokenRef.current = token
    forceRender(n => n + 1)
  }, [])

  const updateTokens = useCallback((accessToken, newCsrfToken) => {
    setAccessToken(accessToken)
    if (newCsrfToken) {
      setCsrfToken(newCsrfToken)
      localStorage.setItem("csrfToken", newCsrfToken)
    }
  }, [setAccessToken])

  // Refresh the access token using refresh token (sent via cookie)
  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await fetch(`${AUTH_URL}/refresh-token`, {
        method: "POST",
        credentials: "include",  // Send cookies
        headers: { "Content-Type": "application/json" }
      })

      if (!res.ok) {
        return null
      }

      const data = await res.json()
      updateTokens(data.accessToken, data.csrfToken)
      return data.accessToken
    } catch (error) {
      console.error("Failed to refresh token:", error)
      return null
    }
  }, [updateTokens])

  // API fetch wrapper with auto-refresh and CSRF
  const authFetch = useCallback(async (url, options = {}) => {
    const currentToken = accessTokenRef.current
    
    const res = await fetch(url, {
      ...options,
      credentials: "include",  // Send cookies (refresh token)
      headers: {
        "Content-Type": "application/json",
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        ...options.headers
      }
    })

    // If token expired, try to refresh
    if (res.status === 401) {
      const data = await res.clone().json().catch(() => ({}))
      
      if (data.code === "TOKEN_EXPIRED") {
        const newToken = await refreshAccessToken()
        
        if (newToken) {
          // Retry with new token
          return fetch(url, {
            ...options,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
              ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
              ...options.headers
            }
          })
        }
      }
      
      // Refresh failed, logout
      handleLogout()
    }

    return res
  }, [csrfToken, refreshAccessToken])

  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
    } catch (error) {
      console.error("Logout error:", error)
    }

    localStorage.removeItem("user")
    localStorage.removeItem("csrfToken")
    setUser(null)
    setAccessToken(null)
    setCsrfToken(null)
    setEntries([])
  }, [setAccessToken])

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      // Try to refresh token on mount (refresh token in cookie will be sent)
      const newToken = await refreshAccessToken()
      if (newToken) {
        // Fetch entries
        try {
          const res = await authFetch(API_URL)
          if (res.ok) {
            const data = await res.json()
            setEntries(data)
          }
        } catch (error) {
          console.error("Failed to fetch entries:", error)
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const addEntry = async (newEntry) => {
    try {
      const res = await authFetch(API_URL, {
        method: "POST",
        body: JSON.stringify(newEntry)
      })
      if (res.ok) {
        const data = await res.json()
        setEntries(prev => [data, ...prev])
      }
    } catch (error) {
      console.error("Failed to add entry:", error)
    }
  }

  const deleteEntry = async (id) => {
    try {
      const res = await authFetch(`${API_URL}/${id}`, { 
        method: "DELETE"
      })
      if (res.ok) {
        setEntries(prev => prev.filter(entry => entry._id !== id))
      }
    } catch (error) {
      console.error("Failed to delete entry:", error)
    }
  }

  useEffect(() => {
    document.title = `My Journal (${entries.length} entries)`
  }, [entries])

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`app ${theme}`}>
        <div className="appInner">
          <Header 
            onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            user={user}
            onLogout={handleLogout}
          />
          {loading ? (
            <p style={{textAlign: 'center', marginTop: '2rem'}}>Loading...</p>
          ) : (
            <Routes>
              <Route 
                path="/" 
                element={user ? <Home entries={entries} addEntry={addEntry} deleteEntry={deleteEntry} /> : <Navigate to="/login" />} 
              />
              <Route path="/about" element={<About />} />
              <Route 
                path="/login" 
                element={!user ? <Login setUser={setUser} updateTokens={updateTokens} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/register" 
                element={!user ? <Register setUser={setUser} updateTokens={updateTokens} /> : <Navigate to="/" />} 
              />
            </Routes>
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
