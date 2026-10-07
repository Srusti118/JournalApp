import { useContext, useState } from 'react'
import { ThemeContext } from '../ThemeContext'
import { Link } from 'react-router-dom'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { useNotifications } from '../hooks/useNotifications'
import { ReminderModal } from './ReminderModal'
import styles from './Header.module.css'

export function Header({ onToggleTheme, user, onLogout }) {
  const theme = useContext(ThemeContext)
  const isDark = theme === 'dark'
  const [isReminderOpen, setIsReminderOpen] = useState(false)
  const { isInstallable, handleInstallClick } = useInstallPrompt()
  const { permission, isSupported: notificationsSupported } = useNotifications()

  return (
    <>
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <div className={styles.brandIcon} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M8 7h8" />
            <path d="M8 11h8" />
            <path d="M8 15h5" />
            <path d="M16 2v7l2-1.5 2 1.5V2" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <div className={styles.brandText}>
          <h1 className={styles.title}>DearDiary</h1>
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
            aria-label="Install DearDiary app"
            title="Install DearDiary app"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Install</span>
          </button>
        )}

        {notificationsSupported && permission !== 'denied' && (
          <button
            onClick={() => setIsReminderOpen(true)}
            className={styles.notifyBtn}
            type="button"
            aria-label="Set daily journaling reminders"
            title="Set daily journaling reminders"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
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
    <ReminderModal
      isOpen={isReminderOpen}
      onClose={() => setIsReminderOpen(false)}
    />
    </>
  )
}

export default Header
