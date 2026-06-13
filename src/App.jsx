import Header from "./components/Header";
import JournalEntry from "./components/JournalEntry";
import "./App.css";
import EntryForm from "./components/EntryForm";
import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import useLocalStorage from './hooks/useLocalStorage'

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
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <Header />
        <EntryForm onAddEntry={addEntry} />
        {entries.map((entry) => (
          <JournalEntry key={entry.id} {...entry} onDelete={deleteEntry} />
        ))}
      </div>
    </ThemeContext.Provider>
  )
}

export default App
