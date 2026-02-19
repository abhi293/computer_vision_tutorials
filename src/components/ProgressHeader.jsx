import { motion } from 'framer-motion'

export default function ProgressHeader({ steps, current, progress, visited, goTo }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(5,8,21,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '0.75rem 2rem',
    }}>
      {/* top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6c63ff,#00d4ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', boxShadow: '0 0 16px rgba(108,99,255,0.5)',
          }}>🧠</div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.03em' }}>
            Matrices <span style={{ color: 'var(--accent2)' }}>↔</span> Tensors
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Step {current + 1} of {steps.length}
          </span>
          <span style={{
            fontSize: '0.75rem', padding: '0.2rem 0.6rem',
            background: 'rgba(108,99,255,0.2)', borderRadius: 20,
            color: 'var(--accent1)', border: '1px solid rgba(108,99,255,0.3)',
          }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* progress bar */}
      <div className="progress-bar-track" style={{ marginBottom: '0.5rem' }}>
        <motion.div
          className="progress-bar-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* step pills (hidden on small screens, show on md+) */}
      <div style={{
        display: 'flex', gap: '0.3rem', flexWrap: 'wrap',
      }}>
        {steps.map((s, i) => {
          const isActive  = i === current
          const isVisited = visited.has(i) && i !== current
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.2rem 0.6rem',
                borderRadius: 20,
                border: isActive
                  ? '1px solid rgba(108,99,255,0.6)'
                  : '1px solid rgba(255,255,255,0.06)',
                background: isActive
                  ? 'rgba(108,99,255,0.2)'
                  : isVisited
                    ? 'rgba(0,212,255,0.05)'
                    : 'transparent',
                color: isActive
                  ? 'var(--accent1)'
                  : isVisited
                    ? 'var(--text-secondary)'
                    : 'rgba(255,255,255,0.3)',
                fontSize: '0.72rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <span>{s.icon}</span>
              <span style={{ display: 'none', '@media(min-width:600px)': { display: 'inline' } }}>{s.label}</span>
            </button>
          )
        })}
      </div>
    </header>
  )
}
