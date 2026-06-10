import {useState} from 'react'

function JournalEntry({title,date,body}) {

  const[count , setCount] = useState(0);

  const handlelike = () => {
    setCount(prev => prev+1)
  }
  
  return (
    <div className="entry-card">
      <span className="entry-date">{date}</span>
      <h2 className="entry-title">{title}</h2>
      <p className="entry-body">{body}</p>
      <button onClick={handlelike}> ❤️ {count} </button>
    </div>
  )

}


export default JournalEntry
