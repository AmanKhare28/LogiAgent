import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STACK = ['FastAPI', 'LangGraph', 'FAISS', 'Groq', 'React', 'TypeScript', 'Docker'];

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        background: 'var(--navy)',
        padding:    'var(--sp-lg) clamp(24px, 5vw, 80px) var(--sp-md)',
        color:      'var(--cream)',
      }}
    >
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        {/* Top row */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'flex-start',
          flexWrap:       'wrap',
          gap:            '40px',
          marginBottom:   '48px',
        }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>
              LogiAgent<span style={{ color: 'var(--tan)' }}>.</span>
            </div>
            <p style={{
              fontSize: '14px', color: 'rgba(242,238,231,0.55)',
              maxWidth: '320px', lineHeight: 1.7,
            }}>
              AI-powered supply chain assistant built with LangGraph, FAISS, and Groq.
              A portfolio project demonstrating modern full-stack AI engineering.
            </p>
          </div>
          <a
            href="https://github.com"
            target="_blank" rel="noopener noreferrer"
            style={{
              display:        'flex', alignItems: 'center', gap: '8px',
              color:          'rgba(242,238,231,0.65)',
              textDecoration: 'none', fontSize: '14px', fontWeight: 500,
              border:         '1px solid rgba(242,238,231,0.18)',
              padding:        '10px 22px', borderRadius: 'var(--radius)',
              transition:     'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color       = 'var(--cream)';
              e.currentTarget.style.borderColor = 'rgba(242,238,231,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color       = 'rgba(242,238,231,0.65)';
              e.currentTarget.style.borderColor = 'rgba(242,238,231,0.18)';
            }}
          >
            ⭐ View on GitHub
          </a>
        </div>

        {/* Tech stack pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '48px' }}>
          {STACK.map(tech => (
            <span key={tech} style={{
              fontSize:      '11px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding:       '6px 16px',
              border:        '1px solid rgba(188,170,138,0.28)',
              borderRadius:  '100px', color: 'var(--tan)',
            }}>{tech}</span>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop:  '1px solid rgba(242,238,231,0.08)',
          paddingTop: '24px', fontSize: '13px',
          color:      'rgba(242,238,231,0.35)', textAlign: 'center',
        }}>
          Built by Aman (Froggy) · Portfolio Project · {new Date().getFullYear()}
        </div>
      </div>
    </motion.footer>
  );
}
