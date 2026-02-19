import { motion } from 'framer-motion'

const floatAnim = {
  animate: { y: [0, -12, 0] },
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
}

function FloatingNumber({ value, x, y, delay, colour }) {
  return (
    <motion.div
      style={{
        position: 'absolute', left: x, top: y,
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: '1.2rem', fontWeight: 600,
        color: colour, opacity: 0.4,
        userSelect: 'none', pointerEvents: 'none',
      }}
      animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 3.5 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      {value}
    </motion.div>
  )
}

const FLOATING = [
  { value: '3.14', x: '5%',  y: '20%', delay: 0,   colour: '#6c63ff' },
  { value: '[2,4]', x: '85%', y: '15%', delay: 0.5, colour: '#00d4ff' },
  { value: '∇',    x: '10%', y: '70%', delay: 1,   colour: '#ff6b9d' },
  { value: '⊗',   x: '90%', y: '65%', delay: 1.5, colour: '#ffd166' },
  { value: '[[1,0],[0,1]]', x: '3%', y: '45%', delay: 0.8, colour: '#06d6a0' },
  { value: 'Σ',   x: '80%', y: '45%', delay: 1.2, colour: '#6c63ff' },
  { value: '42',  x: '50%', y: '8%',  delay: 0.3, colour: '#00d4ff' },
  { value: 'T[i,j,k]', x: '45%', y: '80%', delay: 1.8, colour: '#ff6b9d' },
]

export default function WelcomeStep({ onNext }) {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden',
    }}>
      {FLOATING.map((f, i) => <FloatingNumber key={i} {...f} />)}

      {/* hero icon */}
      <motion.div
        {...floatAnim}
        style={{
          width: 120, height: 120, borderRadius: '50%', marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(0,212,255,0.3))',
          border: '2px solid rgba(108,99,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3.5rem',
          boxShadow: '0 0 60px rgba(108,99,255,0.3), 0 0 120px rgba(0,212,255,0.15)',
        }}
      >
        🧮
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        style={{ textAlign: 'center', maxWidth: 700 }}
      >
        <h1>
          <span className="gradient-text">Matrices vs Tensors</span>
        </h1>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          A beautifully animated, step-by-step journey through one of the most
          fundamental ideas in linear algebra, machine learning, and physics.
        </p>

        {/* stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}
        >
          {[
            { label: '10 Lessons',       icon: '📚', colour: '#6c63ff' },
            { label: 'Visual Demos',     icon: '✨', colour: '#00d4ff' },
            { label: 'Interactive',      icon: '🎮', colour: '#ff6b9d' },
            { label: 'Beginner → Pro',   icon: '🚀', colour: '#ffd166' },
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -4 }}
              style={{
                padding: '0.7rem 1.2rem', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${s.colour}33`,
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                color: s.colour, fontWeight: 600, fontSize: '0.9rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
              {s.label}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: '2.5rem' }}
        >
          <button className="btn btn-primary" onClick={onNext} style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
            Begin the Journey →
          </button>
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
            Use ← → arrow keys to navigate between lessons
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
