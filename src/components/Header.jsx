import { useContext } from "react"
import { ThemeContext } from "../ThemeContext"

function Header() {
  const theme = useContext(ThemeContext)  // ← call it here, store in variable

  return (
    <header className="header">
      <h1>Your Journal</h1>
      <p>A space for your thoughts</p>
      <p>Current theme: {theme}</p>
    </header>
  )
}

export default Header
