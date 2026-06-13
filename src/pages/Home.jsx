import EntryForm from '../components/EntryForm'
import JournalEntry from '../components/JournalEntry'

const Home = ({ entries, addEntry, deleteEntry }) => {
  return (
    <>
      <EntryForm onAddEntry={addEntry} />
      {entries.map(entry => (
        <JournalEntry key={entry.id} {...entry} onDelete={deleteEntry} />
      ))}
    </>
  )
}

export default Home
