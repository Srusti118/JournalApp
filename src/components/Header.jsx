import { useContext } from "react"
import { ThemeContext } from "../ThemeContext"
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

function Header({ onToggleTheme }) {
  const theme = useContext(ThemeContext)
  const dark = theme === 'dark'

  return (
    <header className={`${styles.header} ${dark ? styles.headerDark : ''}`}>
      <div>
        <h1 className={`${styles.title} ${dark ? styles.titleDark : ''}`}>
          Your Journal
        </h1>
        <p className={`${styles.subtitle} ${dark ? styles.subtitleDark : ''}`}>
          A space for your thoughts
        </p>
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={`${styles.link} ${dark ? styles.linkDark : ''}`}>Home</Link>
        <Link to="/about" className={`${styles.link} ${dark ? styles.linkDark : ''}`}>About</Link>
        <button
          onClick={onToggleTheme}
          className={`${styles.toggleBtn} ${dark ? styles.toggleBtnDark : ''}`}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  )
}

export default Header
