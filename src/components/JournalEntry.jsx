import {useState} from 'react'
import styles from './JournalEntry.module.css'

function JournalEntry({id, title, date, body, onDelete}) {

  const[count , setCount] = useState(0);

  const handleLike = () => {
    setCount(prev => prev+1);
  }
  
  return (
    <div className={styles.card}>
      <span className={styles.date}>{date}</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
      <div className={styles.actions}>
        <button className={styles.likeBtn} onClick={handleLike}>❤️ {count}</button>
        {count > 0 && <span className={styles.liked}>Liked!</span>}
        <button className={styles.deleteBtn} onClick={() => onDelete(id)}>Delete</button>
      </div>
    </div>
  )
}

export default JournalEntry
