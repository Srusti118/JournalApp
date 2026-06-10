import Header from './components/Header'
import JournalEntry from './components/JournalEntry'
import './App.css'

const App = () => {
  return (
    <div className="app">
      <Header />
      <main className="entries">
        <JournalEntry />
        <JournalEntry />
      </main>
    </div>
  )
}

export default App
