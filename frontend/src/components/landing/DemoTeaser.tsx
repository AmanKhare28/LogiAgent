import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EASE = [0.22, 1, 0.36, 1] as const;

export function DemoTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();

  return (
    <section id="demo" ref={ref} style={{
      padding:    'var(--sp-xl) clamp(24px, 5vw, 80px)',
      background: 'var(--bg-secondary)',
      textAlign:  'center',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: EASE }}
        style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}
      >
        <h2 style={{
          fontSize:  'clamp(32px, 4.5vw, 60px)', fontWeight: 700,
          color:     'var(--text-primary)', marginBottom: '16px',
        }}>See It In Action</h2>
        <p style={{
          fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '56px',
        }}>Ask anything about global logistics. Get answers in seconds.</p>

        {/* Blurred chat preview */}
        <div style={{
          position:     'relative',
          maxWidth:     '680px', margin: '0 auto 56px',
          borderRadius: '14px', overflow: 'hidden',
          border:       '1px solid var(--border)',
          boxShadow:    '0 40px 96px rgba(67,88,146,0.14)',
        }}>
          <div style={{
            filter:        'blur(5px)',
            pointerEvents: 'none', userSelect: 'none',
            background:    'var(--bg-card)',
            padding:       '36px 28px',
          }}>
            {['What is the DDP Incoterm?', 'Freight from Delhi to Tokyo, 500kg, sea'].map(q => (
              <div key={q} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <div style={{
                  background: 'var(--accent)', color: 'var(--cream)',
                  borderRadius: '20px', padding: '12px 22px',
                  fontSize: '14px', maxWidth: '80%',
                }}>{q}</div>
              </div>
            ))}
            <div style={{
              background:   'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '18px 20px',
              fontSize: '14px', color: 'var(--text-secondary)',
              maxWidth: '80%', lineHeight: 1.65,
            }}>
              DDP (Delivered Duty Paid) means the seller bears all costs and risks
              involved in bringing the goods to the destination country...
            </div>
          </div>
          {/* Glass overlay */}
          <div style={{
            position:       'absolute', inset: 0,
            backdropFilter: 'blur(2px)',
            background:     'rgba(242,238,231,0.08)',
          }} />
        </div>

        <button
          onClick={() => navigate('/chat')}
          style={{
            background:    'var(--accent)', color: 'var(--cream)',
            border:        'none', borderRadius: 'var(--radius)',
            padding:       '18px 60px', fontSize: '16px',
            fontFamily:    'var(--font-base)', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            cursor:        'pointer',
            transition:    'background 0.3s ease, transform 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--accent-warm)';
            e.currentTarget.style.transform  = 'translateY(-3px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--accent)';
            e.currentTarget.style.transform  = 'translateY(0)';
          }}
        >
          Open Chat Interface →
        </button>
      </motion.div>
    </section>
  );
}
