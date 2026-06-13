import { useContext } from "react"
import { ThemeContext } from "../ThemeContext"
import { Link } from 'react-router-dom'

function Header() {
  const theme = useContext(ThemeContext)

  return (
    <header className="flex items-center justify-between py-4 mb-6 border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Your Journal</h1>
        <p className="text-sm text-gray-400">A space for your thoughts</p>
      </div>
      <nav className="flex gap-4 items-center">
        <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">Home</Link>
        <Link to="/about" className="text-gray-600 hover:text-gray-900 text-sm">About</Link>
        <span className="text-xs text-gray-400 capitalize">{theme} mode</span>
      </nav>
    </header>
  )
}

export default Header
