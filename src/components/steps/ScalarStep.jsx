import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const examples = [
  { value: 42,    label: 'Count of items',     colour: '#6c63ff' },
  { value: -3.14, label: 'Temperature offset', colour: '#00d4ff' },
  { value: 0,     label: 'Zero (additive id.)',colour: '#ff6b9d' },
  { value: 1e5,   label: '100 000 (distance)',  colour: '#ffd166' },
]

export default function ScalarStep({ onNext, onPrev }) {
  const [active, setActive] = useState(0)

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto', paddingBottom: '6rem' }}>
      {/* Title */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
          <span className="badge badge-purple">Rank 0 · Tensor</span>
        </div>
        <h2>What is a <span className="gradient-text">Scalar</span>?</h2>
        <p style={{ marginTop: '0.75rem', maxWidth: 560 }}>
          A scalar is the simplest mathematical object — a <strong style={{color:'var(--accent2)'}}>single number</strong>.
          It has <em>magnitude</em> but no direction. In tensor language, a scalar is a
          <strong style={{color:'var(--accent1)'}}> rank‑0 tensor</strong> — it lives in 0 dimensions.
        </p>
      </motion.div>

      {/* Visual: big pulsing sphere */}
      <div style={{ display:'flex', gap:'3rem', marginTop:'2.5rem', flexWrap:'wrap', alignItems:'flex-start' }}>
        <div style={{ flex:'0 0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={examples[active].value}
              initial={{ scale:0.5, opacity:0, rotate:-10 }}
              animate={{ scale:1, opacity:1, rotate:0 }}
              exit={{ scale:1.3, opacity:0, rotate:10 }}
              transition={{ type:'spring', stiffness:300 }}
              style={{
                width:160, height:160, borderRadius:'50%',
                background: `radial-gradient(circle at 35% 35%, ${examples[active].colour}55, ${examples[active].colour}11)`,
                border:`2px solid ${examples[active].colour}66`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'2.5rem', fontFamily:"'JetBrains Mono',monospace", fontWeight:700,
                color: examples[active].colour,
                boxShadow:`0 0 40px ${examples[active].colour}44`,
              }}
            >
              {examples[active].value}
            </motion.div>
          </AnimatePresence>
          <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{examples[active].label}</p>
          <div style={{ display:'flex', gap:'0.5rem' }}>
            {examples.map((e,i) => (
              <motion.button
                key={i} whileHover={{scale:1.1}} whileTap={{scale:0.95}}
                onClick={() => setActive(i)}
                style={{
                  width:36, height:36, borderRadius:'50%',
                  border:`2px solid ${i===active?e.colour:'rgba(255,255,255,0.1)'}`,
                  background: i===active ? e.colour+'33' : 'transparent',
                  cursor:'pointer', color:e.colour,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:'0.75rem',
                  transition:'all 0.2s',
                }}
              >{e.value}</motion.button>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div style={{ flex:1, minWidth:280, display:'flex', flexDirection:'column', gap:'1rem' }}>
          {[
            { icon:'🔢', title:'Single value',   body:'A scalar holds exactly one number. No rows, no columns — just a value.' },
            { icon:'📐', title:'Zero dimensions', body:'Shape: () — empty tuple. No axes at all. It occupies a single point in mathematical space.' },
            { icon:'💡', title:'Everyday examples',body:'Speed: 60 km/h · Pressure: 101.3 kPa · Loss value in a neural network: 0.042' },
          ].map((card,i) => (
            <motion.div
              key={i} className="card"
              initial={{opacity:0, x:30}} animate={{opacity:1, x:0}}
              transition={{delay:0.2+i*0.12}}
              style={{ display:'flex', gap:'1rem' }}
            >
              <span style={{ fontSize:'1.5rem' }}>{card.icon}</span>
              <div>
                <strong style={{ color:'var(--text-primary)' }}>{card.title}</strong>
                <p style={{ marginTop:'0.25rem', fontSize:'0.9rem' }}>{card.body}</p>
              </div>
            </motion.div>
          ))}

          {/* code block */}
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}
            className="code-block"
          >
            <span className="code-comment"># Python / NumPy</span>{'\n'}
            <span className="code-key">import</span> numpy <span className="code-key">as</span> np{'\n\n'}
            scalar = np.<span className="code-fn">array</span>(<span className="code-val">42</span>){'\n'}
            <span className="code-fn">print</span>(scalar.ndim)   <span className="code-comment"># 0</span>{'\n'}
            <span className="code-fn">print</span>(scalar.shape)  <span className="code-comment"># ()</span>{'\n'}
            <span className="code-fn">print</span>(scalar)        <span className="code-comment"># 42</span>
          </motion.div>
        </div>
      </div>

      {/* quick quiz highlight */}
      <motion.div
        initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.8}}
        style={{
          marginTop:'2rem', padding:'1rem 1.5rem', borderRadius:12,
          background:'rgba(108,99,255,0.08)', border:'1px solid rgba(108,99,255,0.25)',
          display:'flex', gap:'1rem', alignItems:'center',
        }}
      >
        <span style={{fontSize:'1.5rem'}}>💬</span>
        <div>
          <strong style={{color:'var(--accent1)'}}>Key Insight</strong>
          <p style={{fontSize:'0.9rem', marginTop:'0.25rem'}}>
            Every scalar is a valid tensor (of rank 0). Tensors <em>generalise</em> scalars, vectors,
            and matrices — scalars are just the most basic case.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
