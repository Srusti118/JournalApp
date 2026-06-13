import { useContext } from 'react'
import { ThemeContext } from '../ThemeContext'

const About = () => {
  const theme = useContext(ThemeContext)
  const dark = theme === 'dark'

  return (
    <div style={{
      background: dark ? '#3d1020' : '#fff5f7',
      border: `1px solid ${dark ? '#6b2a3a' : '#ffc0cc'}`,
      borderRadius: '16px',
      padding: '28px 32px',
      maxWidth: '520px',
      boxShadow: '0 2px 10px rgba(220, 80, 120, 0.07)'
    }}>
      <h2 style={{ margin: '0 0 12px', color: dark ? '#f5d0dc' : '#3d1a24', fontSize: '1.3rem' }}>
        About
      </h2>
      <p style={{ margin: 0, color: dark ? '#e0a8bc' : '#7a3050', lineHeight: '1.75', fontSize: '0.95rem' }}>
        This is my personal journal built while learning React.
        A safe space to write thoughts, track progress, and reflect.
      </p>
    </div>
  )
}

export default About
