import {useState} from 'react'

function JournalEntry({id, title, date, body, onDelete}) {

  const[count , setCount] = useState(0);

  const handleLike = () => {
    setCount(prev => prev+1);
    
  }
  
  return (
    <div className="entry-card">
      <span className="entry-date">{date}</span>
      <h2 className="entry-title">{title}</h2>
      <p className="entry-body">{body}</p>
      <button onClick={handleLike}> ❤️ {count} </button>
      {count>0 && <p>Liked!</p>}
       <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  )

}


export default JournalEntry
