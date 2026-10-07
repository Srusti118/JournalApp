import { useState } from 'react'
import styles from './JournalEntry.module.css'

function JournalEntry({ _id, title, createdAt, body, isPendingSync, onEdit, onDelete }) {
  const [likes, setLikes] = useState(0)

  const handleLike = () => {
    setLikes((prev) => prev + 1)
  }

  // Format date gracefully
  const formattedDate = createdAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(createdAt))
    : 'Recent'

  // Estimate reading time
  const wordCount = body ? body.trim().split(/\s+/).length : 0
  const readTime = Math.max(1, Math.ceil(wordCount / 180))

  return (
    <article className={`${styles.card} ${isPendingSync ? styles.cardPending : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.metaInfo}>
          <time className={styles.date} dateTime={createdAt}>
            {formattedDate}
          </time>
          <span className={styles.dotSeparator} aria-hidden="true" />
          <span className={styles.readTime}>{readTime} min read</span>
          <span className={styles.dotSeparator} aria-hidden="true" />
          <span className={styles.readTime}>{wordCount} words</span>
          {isPendingSync && (
            <>
              <span className={styles.dotSeparator} aria-hidden="true" />
              <span
                className={styles.pendingBadge}
                title="Stored safely in offline browser storage. Will synchronize when online."
              >
                ⏳ Offline / Pending Sync
              </span>
            </>
          )}
        </div>
      </div>

      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>

      <footer className={styles.actions}>
        <button
          type="button"
          className={`${styles.likeBtn} ${likes > 0 ? styles.likeBtnActive : ''}`}
          onClick={handleLike}
          aria-label="Heart reflection"
        >
          <span className={styles.likeIcon} aria-hidden="true">
            {likes > 0 ? '❤️' : '🤍'}
          </span>
          <span>{likes}</span>
        </button>

        {onEdit && (
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => onEdit({ _id, title, body })}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => onDelete(_id)}
            title="Delete this reflection"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        )}
      </footer>
    </article>
  )
}

export default JournalEntry
