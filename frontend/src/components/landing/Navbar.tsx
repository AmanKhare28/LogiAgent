import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Features',     href: '#features'     },
  { label: 'How It Works', href: '#how-it-works'  },
  { label: 'Demo',         href: '#demo'          },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position:       'fixed',
        top: 0, left: 0, right: 0,
        zIndex:         100,
        height:         '64px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '0 clamp(24px, 5vw, 80px)',
        background:     scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom:   scrolled ? '1px solid var(--border)' : 'none',
        transition:     'background 0.35s ease, backdrop-filter 0.35s ease, border 0.35s ease',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{
        fontWeight: 700, fontSize: '20px',
        color: 'var(--text-primary)', textDecoration: 'none',
        letterSpacing: '0.04em',
      }}>
        LogiAgent<span style={{ color: 'var(--accent)' }}>.</span>
      </Link>

      {/* Desktop nav */}
      <div className="nav-desktop-links"
           style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        {NAV_LINKS.map(({ label, href }) => (
          <a key={label} href={href} style={{
            fontSize: '13px', fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--text-secondary)', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >{label}</a>
        ))}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{
            background:   'none',
            border:       '1px solid var(--border)',
            borderRadius: '50%',
            width: '36px', height: '36px',
            cursor:       'pointer',
            display:      'flex', alignItems: 'center', justifyContent: 'center',
            color:        'var(--text-primary)',
            fontSize:     '15px',
            transition:   'border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.transform   = 'scale(1.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform   = 'scale(1)';
          }}
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>

        {/* CTA */}
        <Link to="/chat" style={{
          background:     'var(--accent)',
          color:          'var(--cream)',
          padding:        '10px 24px',
          borderRadius:   'var(--radius)',
          fontSize:       '13px', fontWeight: 600,
          letterSpacing:  '0.08em', textTransform: 'uppercase',
          textDecoration: 'none',
          transition:     'background 0.25s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-warm)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
        >Chat</Link>
      </div>
    </motion.nav>
  );
}
