import Header from "./components/Header";
import "./App.css";
import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import useLocalStorage from './hooks/useLocalStorage'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'

const App = () => {
  const [entries, setEntries] = useLocalStorage('journal-entries', [])
  const [theme, setTheme] = useState("light")

  const addEntry = (newEntry) => {
    setEntries(prev => [...prev, newEntry])
  }

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
  }

  useEffect(() => {
    document.title = `My Journal (${entries.length} entries)`
  }, [entries])

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`app ${theme}`}>
        <div className="appInner">
          <Header onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
          <Routes>
            <Route path="/" element={<Home entries={entries} addEntry={addEntry} deleteEntry={deleteEntry} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
