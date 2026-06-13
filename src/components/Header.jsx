import { useContext } from "react"
import { ThemeContext } from "../ThemeContext"
import {Link} from 'react-router-dom'

function Header() {
  const theme = useContext(ThemeContext)  // ← call it here, store in variable

  return (
    <header className="header">
      <nav>
       <Link to="/">Home</Link> <br></br>
       <Link to="/about">About</Link>
      </nav>
      <h1>Your Journal</h1>
      <p>A space for your thoughts</p>
      <p>Current theme: {theme}</p>
    </header>
  )
}

export default Header
