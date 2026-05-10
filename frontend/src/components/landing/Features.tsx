import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  {
    icon: '🔍', title: 'RAG Knowledge Base',
    body: 'Semantic search over a curated logistics knowledge base using FAISS vector similarity. Retrieves the 4 most relevant document chunks per query.',
  },
  {
    icon: '📦', title: 'Freight Calculator',
    body: 'Haversine-distance cost estimator across 16+ global hubs. Supports air, sea, road, and rail with fuel surcharge baked in.',
  },
  {
    icon: '🧠', title: 'LangGraph Agent',
    body: 'Explicit state-machine routing — not a black-box chain. Every decision step is auditable, testable, and traceable.',
  },
  {
    icon: '⚡', title: 'Groq LLM Backend',
    body: 'Runs on llama-3.3-70b-versatile via Groq inference. Sub-second tool-call latency on the free tier — no credit card required.',
  },
];

function Card({ feat, index }: { feat: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -56 : 56 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 2) * 0.12, ease: EASE }}
      style={{
        background:   'var(--bg-card)',
        border:       '1px solid var(--border)',
        borderRadius: '10px',
        padding:      '36px 32px',
        cursor:       'default',
        transition:   'box-shadow 0.35s ease, transform 0.35s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = '0 20px 56px rgba(67,88,146,0.13)';
        el.style.transform  = 'translateY(-5px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = 'none';
        el.style.transform  = 'translateY(0)';
      }}
    >
      <div style={{ fontSize: '38px', marginBottom: '20px' }}>{feat.icon}</div>
      <h3 style={{
        fontSize: '20px', fontWeight: 700,
        color: 'var(--text-primary)', marginBottom: '12px',
      }}>{feat.title}</h3>
      <p style={{
        fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75,
      }}>{feat.body}</p>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" style={{
      padding:    'var(--sp-xl) clamp(24px, 5vw, 80px)',
      background: 'var(--bg-secondary)',
    }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <h2 style={{
          fontSize:  'clamp(32px, 4.5vw, 60px)', fontWeight: 700,
          textAlign: 'center', color: 'var(--text-primary)', marginBottom: '16px',
        }}>What It Can Do</h2>
        <p style={{
          textAlign: 'center', color: 'var(--text-secondary)',
          fontSize: '18px', marginBottom: '64px',
        }}>Two purpose-built AI tools. One clean interface.</p>
        <div className="feature-grid">
          {FEATURES.map((f, i) => <Card key={f.title} feat={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}
