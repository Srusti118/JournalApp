import { Link } from 'react-router-dom'

const About = () => {
  return (
    <article
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '36px 40px',
        maxWidth: '580px',
        margin: '20px auto 0',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--accent-sage-light)',
            color: 'var(--accent-sage)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: '1.6rem',
            color: 'var(--text-main)',
            letterSpacing: '-0.01em',
          }}
        >
          About Sanctuary
        </h2>
      </div>

      <p
        style={{
          margin: '0 0 16px',
          color: 'var(--text-secondary)',
          lineHeight: '1.8',
          fontSize: '1rem',
        }}
      >
        Sanctuary is designed as a peaceful, distraction-free environment to record thoughts, track personal growth, and cultivate mindfulness.
      </p>

      <p
        style={{
          margin: '0 0 28px',
          color: 'var(--text-muted)',
          lineHeight: '1.75',
          fontSize: '0.94rem',
        }}
      >
        Everything you write is protected and stored securely. Whether capturing daily gratitude, processing complex feelings, or noting creative breakthroughs, this space is yours.
      </p>

      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--accent-sage)',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}
      >
        ← Return to reflections
      </Link>
    </article>
  )
}

export default About
