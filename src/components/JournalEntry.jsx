import { useState, useContext } from 'react'
import styles from './JournalEntry.module.css'
import { ThemeContext } from '../ThemeContext'

function JournalEntry({ _id, title, createdAt, body, onDelete }) {
  const [count, setCount] = useState(0)
  const theme = useContext(ThemeContext)
  const dark = theme === 'dark'

  const handleLike = () => setCount(prev => prev + 1)

  // Format date from MongoDB timestamp
  const formattedDate = new Date(createdAt).toLocaleDateString()

  return (
    <div className={`${styles.card} ${dark ? styles.cardDark : ''}`}>
      <span className={`${styles.date} ${dark ? styles.dateDark : ''}`}>{formattedDate}</span>
      <h2 className={`${styles.title} ${dark ? styles.titleDark : ''}`}>{title}</h2>
      <p className={`${styles.body} ${dark ? styles.bodyDark : ''}`}>{body}</p>
      <div className={styles.actions}>
        <button
          className={`${styles.likeBtn} ${dark ? styles.likeBtnDark : ''}`}
          onClick={handleLike}
        >
          ❤️ {count}
        </button>
        {count > 0 && (
          <span className={`${styles.liked} ${dark ? styles.likedDark : ''}`}>Liked!</span>
        )}
        <button
          className={`${styles.deleteBtn} ${dark ? styles.deleteBtnDark : ''}`}
          onClick={() => onDelete(_id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default JournalEntry
