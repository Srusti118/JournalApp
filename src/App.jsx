import Header from "./components/Header";
import "./App.css";
import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/notes"

const App = () => {
  const [entries, setEntries] = useState([])
  const [theme, setTheme] = useState("light")
  const [loading, setLoading] = useState(true)

  // Fetch entries from backend on mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        setEntries(data)
      } catch (error) {
        console.error("Failed to fetch entries:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [])

  const addEntry = async (newEntry) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry)
      })
      const data = await res.json()
      setEntries(prev => [data, ...prev])
    } catch (error) {
      console.error("Failed to add entry:", error)
    }
  }

  const deleteEntry = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      setEntries(prev => prev.filter(entry => entry._id !== id))
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
          <Header onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
          {loading ? (
            <p style={{textAlign: 'center', marginTop: '2rem'}}>Loading entries...</p>
          ) : (
            <Routes>
              <Route path="/" element={<Home entries={entries} addEntry={addEntry} deleteEntry={deleteEntry} />} />
              <Route path="/about" element={<About />} />
            </Routes>
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
