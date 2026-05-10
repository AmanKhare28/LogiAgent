import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const STATS = [
  { target: 2,   suffix: '',    label: 'AI Tools',       sub: 'RAG + Freight Calculator' },
  { target: 16,  suffix: '+',   label: 'Logistics Hubs', sub: 'Global city network'      },
  { target: 100, suffix: 'ms',  label: 'RAG Retrieval',  sub: 'FAISS similarity search'  },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 45));
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function StatsBar() {
  return (
    <section style={{
      background: 'var(--accent)',
      padding:    'var(--sp-lg) clamp(24px, 5vw, 80px)',
    }}>
      <div style={{
        maxWidth:            'var(--max-width)',
        margin:              '0 auto',
        display:             'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap:                 '40px',
        textAlign:           'center',
      }}>
        {STATS.map(s => (
          <div key={s.label}>
            <div style={{
              fontSize:   'clamp(52px, 6.5vw, 84px)',
              fontWeight: 700,
              color:      'var(--cream)',
              lineHeight: 1,
            }}>
              <CountUp target={s.target} suffix={s.suffix} />
            </div>
            <div style={{
              fontSize:  '17px', fontWeight: 600,
              color:     'var(--cream)', marginTop: '10px', opacity: 0.9,
            }}>{s.label}</div>
            <div style={{
              fontSize: '13px', color: 'var(--cream)',
              marginTop: '4px', opacity: 0.55,
            }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
