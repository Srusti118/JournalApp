import { useContext } from "react"
import { ThemeContext } from "../ThemeContext"
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

function Header({ onToggleTheme, user, onLogout }) {
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
        {user ? (
          <>
            <span className={`${styles.userInfo} ${dark ? styles.userInfoDark : ''}`}>
              Welcome, {user.username}
            </span>
            <button
              onClick={onLogout}
              className={`${styles.logoutBtn} ${dark ? styles.logoutBtnDark : ''}`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`${styles.link} ${dark ? styles.linkDark : ''}`}>Login</Link>
            <Link to="/register" className={`${styles.link} ${dark ? styles.linkDark : ''}`}>Register</Link>
          </>
        )}
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
