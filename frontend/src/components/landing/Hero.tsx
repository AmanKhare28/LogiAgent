import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EASE = [0.22, 1, 0.36, 1] as const;
const WORDS = ['AI-Powered', 'Supply Chain', 'Intelligence.'];

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.14 } },
};

const word = {
  hidden: { opacity: 0, y: 48 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

function ChatMockup() {
  return (
    <svg viewBox="0 0 540 330" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={{ width: '100%', filter: 'drop-shadow(0 28px 56px rgba(67,88,146,0.20))' }}>
      <rect width="540" height="330" rx="14" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1.5"/>
      <rect width="540" height="44" rx="14" fill="var(--accent)" />
      <rect y="30" width="540" height="14" fill="var(--accent)" />
      <circle cx="22" cy="22" r="5.5" fill="rgba(255,255,255,0.35)" />
      <circle cx="40" cy="22" r="5.5" fill="rgba(255,255,255,0.35)" />
      <circle cx="58" cy="22" r="5.5" fill="rgba(255,255,255,0.35)" />
      <text x="270" y="27" textAnchor="middle" fill="rgba(255,255,255,0.9)"
            fontSize="12" fontFamily="system-ui" fontWeight="600">LogiAgent</text>
      {/* User msg */}
      <rect x="290" y="64" width="228" height="38" rx="19" fill="var(--accent)" />
      <text x="404" y="88" textAnchor="middle" fill="white" fontSize="12" fontFamily="system-ui">
        What is FOB Incoterm?
      </text>
      {/* Assistant msg */}
      <rect x="20" y="118" width="310" height="68" rx="12"
            fill="var(--bg-secondary)" stroke="var(--border)" strokeWidth="1"/>
      <text x="36" y="142" fill="var(--text-secondary)" fontSize="11.5" fontFamily="system-ui">
        FOB (Free on Board) means the seller
      </text>
      <text x="36" y="159" fill="var(--text-secondary)" fontSize="11.5" fontFamily="system-ui">
        delivers goods to the named port and
      </text>
      <text x="36" y="176" fill="var(--text-secondary)" fontSize="11.5" fontFamily="system-ui">
        risk transfers to the buyer there.
      </text>
      {/* Tool badge */}
      <rect x="20" y="196" width="52" height="16" rx="8" fill="var(--accent)" opacity="0.15"/>
      <text x="46" y="208" textAnchor="middle" fill="var(--accent)"
            fontSize="9" fontFamily="system-ui" fontWeight="600">⚡ rag</text>
      {/* User msg 2 */}
      <rect x="196" y="222" width="324" height="38" rx="19" fill="var(--accent)" />
      <text x="358" y="246" textAnchor="middle" fill="white" fontSize="11.5" fontFamily="system-ui">
        Freight Mumbai → London 200kg air
      </text>
      {/* Typing dots */}
      <rect x="20" y="272" width="64" height="34" rx="17"
            fill="var(--bg-secondary)" stroke="var(--border)" strokeWidth="1"/>
      <circle cx="38" cy="289" r="4" fill="var(--text-secondary)" />
      <circle cx="52" cy="289" r="4" fill="var(--text-secondary)" opacity="0.55"/>
      <circle cx="66" cy="289" r="4" fill="var(--text-secondary)" opacity="0.25"/>
    </svg>
  );
}

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section style={{
      minHeight:      '100vh',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      textAlign:      'center',
      padding:        'calc(64px + var(--sp-xl)) clamp(24px, 5vw, 80px) var(--sp-xl)',
      background:     'var(--bg-primary)',
      position:       'relative',
      overflow:       'hidden',
    }}>
      {/* Subtle radial gradient */}
      <div style={{
        position:   'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(67,88,146,0.07) 0%, transparent 70%)',
      }} />

      {/* Eyebrow pill */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{
          fontSize: '12px', fontWeight: 600,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: '28px',
          border: '1px solid var(--border)', borderRadius: '100px',
          padding: '6px 20px', display: 'inline-block',
        }}
      >
        LangGraph · FAISS · Groq LLM
      </motion.p>

      {/* Staggered headline */}
      <motion.h1
        variants={container} initial="hidden" animate="show"
        style={{
          fontSize:      'clamp(48px, 7.5vw, 100px)',
          fontWeight:    700, lineHeight: 1.04,
          maxWidth:      '900px', marginBottom: '32px',
          letterSpacing: '-0.02em',
        }}
      >
        {WORDS.map((line, i) => (
          <motion.span key={i} variants={word}
            style={{
              display: 'block',
              color: i === 2 ? 'var(--accent)' : 'var(--text-primary)',
            }}>
            {line}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.6 }}
        style={{
          fontSize:     'clamp(16px, 2vw, 20px)',
          color:        'var(--text-secondary)', lineHeight: 1.75,
          maxWidth:     '540px', marginBottom: '52px',
        }}
      >
        Ask logistics questions, calculate freight costs, and explore global
        supply chain knowledge — powered by a real LangGraph agent.
      </motion.p>

      {/* CTA button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        onClick={() => navigate('/chat')}
        style={{
          background:    'var(--accent)',
          color:         'var(--cream)',
          border:        'none',
          borderRadius:  'var(--radius)',
          padding:       '18px 56px',
          fontSize:      '16px',
          fontFamily:    'var(--font-base)',
          fontWeight:    700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor:        'pointer',
          animation:     'pulse-glow 2.5s ease-in-out 2s infinite',
          transition:    'background 0.3s ease, transform 0.2s ease',
          marginBottom:  '88px',
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
        Start Chatting →
      </motion.button>

      {/* Floating chat mockup */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.9, ease: EASE }}
        style={{
          width:     'min(560px, 92vw)',
          animation: 'float 4.5s ease-in-out infinite',
        }}
      >
        <ChatMockup />
      </motion.div>
    </section>
  );
}
