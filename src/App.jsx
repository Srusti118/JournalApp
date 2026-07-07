import Header from "./components/Header";
import "./App.css";
import { useEffect, useState, useCallback } from "react";
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
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"))
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"))

  // Update tokens in state and localStorage
  const updateTokens = useCallback((newAccessToken, newRefreshToken) => {
    setAccessToken(newAccessToken)
    setRefreshToken(newRefreshToken)
    localStorage.setItem("accessToken", newAccessToken)
    localStorage.setItem("refreshToken", newRefreshToken)
  }, [])

  // Refresh the access token using refresh token
  const refreshAccessToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken")
    if (!storedRefreshToken) {
      return null
    }

    try {
      const res = await fetch(`${AUTH_URL}/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefreshToken })
      })

      if (!res.ok) {
        return null
      }

      const data = await res.json()
      updateTokens(data.accessToken, data.refreshToken)
      return data.accessToken
    } catch (error) {
      console.error("Failed to refresh token:", error)
      return null
    }
  }, [updateTokens])

  // API fetch wrapper with auto-refresh
  const authFetch = useCallback(async (url, options = {}) => {
    const currentToken = localStorage.getItem("accessToken")
    
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
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
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
              ...options.headers
            }
          })
        }
      }
      
      // Refresh failed, logout
      handleLogout()
    }

    return res
  }, [refreshAccessToken])

  const handleLogout = async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken")
    
    // Notify backend to invalidate refresh token
    if (storedRefreshToken) {
      try {
        await fetch(`${AUTH_URL}/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: storedRefreshToken })
        })
      } catch (error) {
        console.error("Logout error:", error)
      }
    }

    localStorage.removeItem("user")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    setEntries([])
  }

  // Fetch entries from backend on mount (only if logged in)
  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    const fetchEntries = async () => {
      try {
        const res = await authFetch(API_URL)
        if (res.ok) {
          const data = await res.json()
          setEntries(data)
        }
      } catch (error) {
        console.error("Failed to fetch entries:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [accessToken])

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
