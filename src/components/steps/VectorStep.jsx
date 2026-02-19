import { useState } from 'react'
import { motion } from 'framer-motion'

const VECTORS = [
  { data: [3, 1, 4, 1, 5], label: 'Row Vector (1D)', colour: '#00d4ff', desc: 'Shape: (5,)' },
  { data: [2, -1, 3],       label: '3D Position',    colour: '#6c63ff', desc: 'Shape: (3,)' },
  { data: [0.1, 0.7, 0.2],  label: 'Probability Distribution', colour: '#ff6b9d', desc: 'Shape: (3,) — must sum to 1' },
  { data: [255, 128, 64, 200], label: 'RGBA Pixel', colour: '#ffd166', desc: 'Shape: (4,)' },
]

function Arrow({ from, to, colour }) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.sqrt(dx*dx + dy*dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  return (
    <g>
      <motion.line
        x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        stroke={colour} strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength:0, opacity:0 }}
        animate={{ pathLength:1, opacity:1 }}
        transition={{ duration:0.8, ease:'easeOut' }}
      />
      <polygon
        points={`0,-5 10,0 0,5`}
        fill={colour}
        transform={`translate(${to.x},${to.y}) rotate(${angle})`}
      />
    </g>
  )
}

export default function VectorStep() {
  const [active, setActive] = useState(0)
  const vec = VECTORS[active]

  return (
    <div style={{ padding:'2rem', maxWidth:960, margin:'0 auto', paddingBottom:'6rem' }}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <span className="badge badge-cyan" style={{marginBottom:'0.5rem',display:'inline-block'}}>Rank 1 · Tensor</span>
        <h2>What is a <span className="gradient-text">Vector</span>?</h2>
        <p style={{marginTop:'0.75rem', maxWidth:560}}>
          A vector is an <strong style={{color:'var(--accent2)'}}>ordered list of numbers</strong> — a 1‑dimensional array.
          It has <em>magnitude</em> and optionally a <em>direction</em>.
          In tensor language it is a <strong style={{color:'var(--accent1)'}}>rank‑1 tensor</strong>.
        </p>
      </motion.div>

      {/* selector */}
      <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'1.5rem'}}>
        {VECTORS.map((v,i) => (
          <motion.button key={i} whileTap={{scale:0.95}}
            onClick={() => setActive(i)}
            style={{
              padding:'0.4rem 0.9rem', borderRadius:20, border:'1px solid',
              borderColor: i===active ? v.colour : 'rgba(255,255,255,0.1)',
              background: i===active ? v.colour+'22' : 'transparent',
              color: i===active ? v.colour : 'var(--text-secondary)',
              cursor:'pointer', fontSize:'0.8rem', fontWeight:600,
              transition:'all 0.2s', fontFamily:'Inter,sans-serif',
            }}
          >{v.label}</motion.button>
        ))}
      </div>

      <div style={{display:'flex', gap:'3rem', marginTop:'2rem', flexWrap:'wrap', alignItems:'flex-start'}}>
        {/* Visual: horizontal sequence of boxes */}
        <div style={{flex:'0 0 auto'}}>
          <div style={{fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:'0.5rem'}}>{vec.label}</div>
          <div style={{display:'flex', gap:6, alignItems:'center'}}>
            {/* bracket */}
            <svg width="10" height={60} viewBox="0 0 10 60" fill="none">
              <path d="M8 4 L3 4 L3 56 L8 56" stroke={vec.colour} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {vec.data.map((v, i) => (
              <motion.div
                key={i}
                initial={{opacity:0, y:-20, scale:0.5}}
                animate={{opacity:1, y:0, scale:1}}
                transition={{delay:i*0.07, type:'spring', stiffness:400}}
                style={{
                  width:52, height:52,
                  background: `${vec.colour}22`,
                  border:`1px solid ${vec.colour}55`,
                  borderRadius:8,
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  color:vec.colour,
                  fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:'0.9rem',
                  position:'relative',
                }}
              >
                {typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(1) : v}
                <div style={{position:'absolute', bottom:-18, fontSize:'0.65rem', color:'rgba(255,255,255,0.3)'}}>
                  [{i}]
                </div>
              </motion.div>
            ))}
            <svg width="10" height={60} viewBox="0 0 10 60" fill="none">
              <path d="M2 4 L7 4 L7 56 L2 56" stroke={vec.colour} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{marginTop:'1.5rem', fontSize:'0.75rem', color:'var(--text-secondary)', fontFamily:"'JetBrains Mono',monospace"}}>
            {vec.desc}
          </div>
        </div>

        {/* Arrow visualisation — only for position vector */}
        <div style={{flex:'0 0 auto'}}>
          <div style={{fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:'0.5rem'}}>Geometric interpretation</div>
          <svg width={220} height={220} style={{
            background:'rgba(255,255,255,0.03)',
            borderRadius:12, border:'1px solid rgba(255,255,255,0.06)',
          }}>
            {/* axes */}
            <line x1="20" y1="200" x2="200" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <line x1="20" y1="200" x2="20"  y2="20"  stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <text x="205" y="204" fill="rgba(255,255,255,0.3)" fontSize="11">x₁</text>
            <text x="22"  y="16"  fill="rgba(255,255,255,0.3)" fontSize="11">x₂</text>

            {/* vector arrow — use first two components */}
            <Arrow
              from={{x:20, y:200}}
              to  ={{
                x: 20 + Math.min(vec.data[0] ?? 1, 8) * 20,
                y: 200 - Math.min(Math.abs(vec.data[1] ?? 1), 8) * 20,
              }}
              colour={vec.colour}
            />
            <text
              x={20 + Math.min(vec.data[0]??1, 8)*20 + 6}
              y={200 - Math.min(Math.abs(vec.data[1]??1), 8)*20 - 6}
              fill={vec.colour} fontSize="11" fontWeight="600"
            >v</text>
          </svg>
        </div>

        {/* Facts */}
        <div style={{flex:1, minWidth:260, display:'flex', flexDirection:'column', gap:'0.75rem'}}>
          {[
            {icon:'📏', title:'One axis', body:'Shape is always (n,) — a single number n gives the length.'},
            {icon:'🔢', title:'Indexing', body:'v[i] accesses the i‑th element. Indices start at 0 in Python.'},
            {icon:'➕', title:'Operations', body:'Addition, dot product, scalar multiplication — all work element-wise along the single axis.'},
          ].map((c,i) => (
            <motion.div key={i} className="card"
              initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.2+i*0.1}}
              style={{display:'flex',gap:'0.75rem', padding:'0.9rem 1rem'}}
            >
              <span style={{fontSize:'1.3rem'}}>{c.icon}</span>
              <div><strong style={{color:'var(--text-primary)', fontSize:'0.9rem'}}>{c.title}</strong>
                <p style={{fontSize:'0.82rem', marginTop:'0.2rem'}}>{c.body}</p></div>
            </motion.div>
          ))}
          <div className="code-block" style={{fontSize:'0.78rem'}}>
            v = np.array([<span className="code-val">{vec.data.join(', ')}</span>]){'\n'}
            v.ndim   <span className="code-comment"># 1</span>{'\n'}
            v.shape  <span className="code-comment"># ({vec.data.length},)</span>{'\n'}
            v[<span className="code-val">0</span>]    <span className="code-comment"># {vec.data[0]}</span>
          </div>
        </div>
      </div>

      {/* insight */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.9}}
        style={{marginTop:'2rem', padding:'1rem 1.5rem', borderRadius:12,
          background:'rgba(0,212,255,0.07)', border:'1px solid rgba(0,212,255,0.2)',
          display:'flex', gap:'1rem', alignItems:'center'}}>
        <span style={{fontSize:'1.4rem'}}>💬</span>
        <div>
          <strong style={{color:'var(--accent2)'}}>Key Insight</strong>
          <p style={{fontSize:'0.9rem', marginTop:'0.25rem'}}>
            A vector is a rank‑1 tensor. It extends a scalar from 0D to 1D.
            A matrix will extend this again to 2D, and a tensor to N‑D.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
