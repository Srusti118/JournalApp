import { useEffect, useState } from 'react'
import EntryForm from '../components/EntryForm'
import JournalEntry from '../components/JournalEntry'

const Home = ({ entries = [], addEntry, updateEntry, deleteEntry, loading: notesLoading }) => {
  const [editingEntry, setEditingEntry] = useState(null)
  const [quote, setQuote] = useState(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState(null)

  const fetchQuote = async () => {
    setQuoteLoading(true)
    setQuoteError(null)

    try {
      const res = await fetch('https://dummyjson.com/quotes/random')
      if (!res.ok) {
        throw new Error('Could not fetch daily inspiration')
      }
      const data = await res.json()
      setQuote(data)
    } catch (err) {
      setQuoteError(err.message)
    } finally {
      setQuoteLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  const handleStartEdit = (entry) => {
    setEditingEntry(entry)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpdate = async (id, data) => {
    await updateEntry(id, data)
    setEditingEntry(null)
  }

  return (
    <main>
      {/* Daily Inspiration / Reflection */}
      <section className="inspiration-section" aria-label="Daily Inspiration">
        <div className="inspiration-header">
          <span className="inspiration-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Daily Inspiration
          </span>
          <button
            className="inspiration-refresh-btn"
            onClick={fetchQuote}
            disabled={quoteLoading}
            type="button"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            Refresh
          </button>
        </div>

        {quoteLoading && (
          <p className="inspiration-loading">Drawing a thoughtful moment...</p>
        )}
        {quoteError && (
          <p className="inspiration-error">{quoteError}</p>
        )}
        {quote && !quoteLoading && (
          <blockquote className="inspiration-card">
            <p className="inspiration-quote">"{quote.quote}"</p>
            <cite className="inspiration-author">— {quote.author}</cite>
          </blockquote>
        )}
      </section>

      {/* Writing Form */}
      <EntryForm
        onAddEntry={addEntry}
        editingEntry={editingEntry}
        onUpdateEntry={handleUpdate}
        onCancelEdit={() => setEditingEntry(null)}
      />

      {/* Entries List or Empty State */}
      <section aria-label="Your Reflections">
        {entries.length === 0 && !notesLoading ? (
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h3 className="empty-state-title">A quiet moment for yourself</h3>
            <p className="empty-state-desc">
              Your sanctuary is currently clear. Take a gentle breath and pen your thoughts, gratitude, or reflections above.
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <JournalEntry
              key={entry._id || entry.tempId}
              {...entry}
              onEdit={handleStartEdit}
              onDelete={deleteEntry}
            />
          ))
        )}
      </section>
    </main>
  )
}

export default Home