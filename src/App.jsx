import Header from './components/Header'
import JournalEntry from './components/JournalEntry'
import './App.css'

const App = () => {
  return (
    <div className="app">
      <Header />
      <JournalEntry title="First Journal Entry" date="10 June" body="I started React"/>
      <JournalEntry title="Second Journal Entry" date="11 June" body="I had an icecream"/>
      
    </div>
  )
}

export default App
