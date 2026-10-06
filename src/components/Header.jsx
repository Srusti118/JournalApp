import { useContext } from 'react'
import { ThemeContext } from '../ThemeContext'
import { Link } from 'react-router-dom'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import styles from './Header.module.css'

export function Header({ onToggleTheme, user, onLogout }) {
  const theme = useContext(ThemeContext)
  const isDark = theme === 'dark'
  const { isInstallable, handleInstallClick } = useInstallPrompt()

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <div className={styles.brandIcon} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a10 10 0 0 1-10-10C2 6.477 6.477 2 12 2z" />
            <path d="M12 6v12" />
            <path d="M8 10c2-2 6-2 8 0" />
            <path d="M8 14c2-2 6-2 8 0" />
          </svg>
        </div>
        <div className={styles.brandText}>
          <h1 className={styles.title}>Sanctuary</h1>
          <p className={styles.subtitle}>A safe space for your thoughts</p>
        </div>
      </Link>

      <nav className={styles.nav}>
        {user ? (
          <>
            <div className={styles.userInfo}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username || 'User avatar'}
                  className={styles.avatar}
                />
              ) : (
                <span className={styles.avatarFallback}>
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
              <span>{user.username}</span>
            </div>
            <button
              onClick={onLogout}
              className={styles.logoutBtn}
              type="button"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>Sign in</Link>
            <Link to="/register" className={styles.link}>Register</Link>
          </>
        )}

        <Link to="/about" className={styles.link}>About</Link>

        {isInstallable && (
          <button
            onClick={handleInstallClick}
            className={styles.installBtn}
            type="button"
            aria-label="Install Sanctuary app"
            title="Install Sanctuary app"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Install</span>
          </button>
        )}

        <button
          onClick={onToggleTheme}
          className={styles.toggleBtn}
          type="button"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </nav>
    </header>
  )
}

export default Header
