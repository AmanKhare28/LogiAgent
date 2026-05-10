import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  { num: '01', title: 'User Sends a Query',
    body: 'Natural-language question typed into the chat UI. No special syntax or commands required.' },
  { num: '02', title: 'LangGraph Routes',
    body: 'The Router Node sends the message and both tool schemas to the LLM. The LLM picks the right tool — or answers directly.' },
  { num: '03', title: 'Tool Executes',
    body: 'Either the FAISS RAG retriever or the deterministic Freight Calculator runs and returns structured data.' },
  { num: '04', title: 'LLM Synthesises Answer',
    body: 'Tool output flows back to the LLM, which composes a concise, accurate natural-language answer.' },
];

function Step({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const isLast = index === STEPS.length - 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EASE }}
      style={{ display: 'flex', gap: '28px' }}
    >
      {/* Left: node + connector line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 280, damping: 22, delay: index * 0.1 + 0.25 }}
          style={{
            flexShrink:     0,
            width:          '52px', height: '52px',
            borderRadius:   '50%',
            background:     'var(--accent)',
            display:        'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight:     700, fontSize: '13px',
            color:          'var(--cream)', letterSpacing: '0.05em',
            zIndex:         1,
          }}
        >{step.num}</motion.div>
        {!isLast && (
          <div style={{
            width: '2px', flexGrow: 1, minHeight: '40px',
            background: 'var(--border)', marginTop: '8px',
          }} />
        )}
      </div>

      {/* Right: text */}
      <div style={{ paddingBottom: isLast ? '0' : '52px', paddingTop: '10px' }}>
        <h3 style={{
          fontSize: '21px', fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: '10px',
        }}>{step.title}</h3>
        <p style={{
          fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75,
        }}>{step.body}</p>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" style={{
      padding:    'var(--sp-xl) clamp(24px, 5vw, 80px)',
      background: 'var(--bg-primary)',
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <h2 style={{
          fontSize:  'clamp(32px, 4.5vw, 60px)', fontWeight: 700,
          textAlign: 'center', color: 'var(--text-primary)', marginBottom: '16px',
        }}>How It Works</h2>
        <p style={{
          textAlign: 'center', color: 'var(--text-secondary)',
          fontSize: '18px', marginBottom: '72px',
        }}>Four steps from question to answer.</p>
        <div>
          {STEPS.map((s, i) => <Step key={s.num} step={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}
