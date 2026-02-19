import { useState } from 'react'
import { motion } from 'framer-motion'

const ROWS = [
  { attr:'Definition',
    matrix:'Rectangular 2D array of numbers; m rows × n columns.',
    tensor:'N-dimensional generalisation of scalars, vectors & matrices.',
  },
  { attr:'Rank / ndim',
    matrix:'Always rank 2 (exactly 2 axes).',
    tensor:'Can be rank 0, 1, 2, 3, 4 … N — any number of axes.',
  },
  { attr:'Shape notation',
    matrix:'(m, n) — always exactly two numbers.',
    tensor:'(d₁, d₂, …, dₙ) — any number of dimensions.',
  },
  { attr:'Special cases',
    matrix:'1×n = row vector; m×1 = column vector; n×n = square matrix.',
    tensor:'Rank-0 = scalar; Rank-1 = vector; Rank-2 = matrix.',
  },
  { attr:'Indexing',
    matrix:'M[i, j] — always exactly two indices.',
    tensor:'T[i₁, i₂, …, iₙ] — one index per axis.',
  },
  { attr:'Multiplication',
    matrix:'Matrix multiply (m,k)×(k,n)→(m,n). Inner dims must match.',
    tensor:'Tensor contraction — generalises mat-mul to any pair of axes.',
  },
  { attr:'Transpose',
    matrix:'Mᵀ swaps rows and cols. Shape (m,n)→(n,m).',
    tensor:'np.transpose(T, axes) permutes any subset of axes.',
  },
  { attr:'Storage',
    matrix:'Stored as contiguous 2D block of numbers in memory.',
    tensor:'Stored as contiguous N-D block; strides describe each axis.',
  },
  { attr:'Real world',
    matrix:'Linear transforms, spreadsheets, system of equations, images (1 channel).',
    tensor:'RGB images, video, NLP batches, neural network weights, MRI scans.',
  },
  { attr:'Libraries',
    matrix:'numpy.matrix (deprecated), numpy.ndarray with ndim=2.',
    tensor:'numpy.ndarray, torch.Tensor, tf.Tensor — native multi-dim.',
  },
]

export default function ComparisonStep() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div style={{padding:'2rem', maxWidth:1000, margin:'0 auto', paddingBottom:'6rem'}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <span className="badge badge-purple" style={{marginBottom:'0.5rem',display:'inline-block'}}>Summary</span>
        <h2>Matrix <span className="gradient-text">vs</span> Tensor</h2>
        <p style={{marginTop:'0.75rem', maxWidth:600}}>
          A side-by-side comparison of every key attribute. Hover or tap any row to highlight it.
          Remember: <em>every matrix is a tensor</em>, but not every tensor is a matrix.
        </p>
      </motion.div>

      {/* one-liner hero */}
      <motion.div
        initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2}}
        style={{
          marginTop:'1.5rem',
          padding:'1.25rem 1.5rem', borderRadius:16,
          background:'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(0,212,255,0.08))',
          border:'1px solid rgba(108,99,255,0.25)',
          display:'flex', alignItems:'center', justifyContent:'center', gap:'1.5rem',
          flexWrap:'wrap', textAlign:'center',
        }}
      >
        <div>
          <div style={{fontSize:'2rem', marginBottom:'0.25rem'}}>🔲</div>
          <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--accent3)'}}>Matrix</div>
          <div style={{fontSize:'0.82rem', color:'var(--text-secondary)', marginTop:'0.25rem'}}>Rank 2 tensor</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'0.78rem', color:'var(--accent3)', marginTop:'0.25rem'}}>shape: (m, n)</div>
        </div>
        <div style={{fontSize:'2.5rem', color:'var(--text-secondary)'}}>⊂</div>
        <div>
          <div style={{fontSize:'2rem', marginBottom:'0.25rem'}}>🧊</div>
          <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--accent4)'}}>Tensor</div>
          <div style={{fontSize:'0.82rem', color:'var(--text-secondary)', marginTop:'0.25rem'}}>Rank N generalisation</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'0.78rem', color:'var(--accent4)', marginTop:'0.25rem'}}>shape: (d₁,…,dₙ)</div>
        </div>
      </motion.div>

      {/* comparison table */}
      <div style={{marginTop:'2rem', borderRadius:16, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)'}}>
        {/* header */}
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 2fr 2fr',
          background:'rgba(255,255,255,0.04)',
          padding:'0.75rem 1.25rem', gap:'1rem',
          borderBottom:'1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{fontWeight:700, fontSize:'0.85rem', color:'var(--text-secondary)'}}>Attribute</div>
          <div style={{fontWeight:700, fontSize:'0.85rem', color:'var(--accent3)', display:'flex', alignItems:'center', gap:'0.4rem'}}>
            🔲 Matrix
          </div>
          <div style={{fontWeight:700, fontSize:'0.85rem', color:'var(--accent4)', display:'flex', alignItems:'center', gap:'0.4rem'}}>
            🧊 Tensor
          </div>
        </div>

        {ROWS.map((row,i) => (
          <motion.div
            key={i}
            onHoverStart={() => setHighlight(i)}
            onHoverEnd={() => setHighlight(null)}
            initial={{opacity:0, y:10}}
            animate={{opacity:1, y:0}}
            transition={{delay:i*0.05}}
            style={{
              display:'grid', gridTemplateColumns:'1fr 2fr 2fr',
              padding:'0.75rem 1.25rem', gap:'1rem',
              background: highlight===i
                ? 'rgba(108,99,255,0.08)'
                : i%2===0 ? 'rgba(255,255,255,0.01)' : 'transparent',
              borderBottom:'1px solid rgba(255,255,255,0.04)',
              cursor:'default', transition:'background 0.2s',
            }}
          >
            <div style={{
              fontWeight:700, fontSize:'0.82rem', color:'var(--text-primary)',
              display:'flex', alignItems:'flex-start', paddingTop:'0.1rem',
            }}>{row.attr}</div>
            <div style={{fontSize:'0.82rem', color:'var(--text-secondary)', lineHeight:1.6}}>
              {row.matrix}
            </div>
            <div style={{fontSize:'0.82rem', color:'var(--text-secondary)', lineHeight:1.6}}>
              {row.tensor}
            </div>
          </motion.div>
        ))}
      </div>

      {/* key takeaways */}
      <motion.div
        initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.6}}
        style={{marginTop:'2rem', display:'flex', gap:'1rem', flexWrap:'wrap'}}
      >
        {[
          {icon:'✅', text:'A matrix IS a rank-2 tensor.', colour:'var(--accent5)'},
          {icon:'⚠️', text:'A tensor is NOT always a matrix (rank can be ≠ 2).', colour:'var(--accent4)'},
          {icon:'🔑', text:'Tensors generalise — same math, more dimensions.', colour:'var(--accent2)'},
          {icon:'📦', text:'In code, both are just N-D arrays (ndarray, Tensor).', colour:'var(--accent1)'},
        ].map((t,i) => (
          <div key={i} style={{
            flex:'1 1 200px',
            padding:'0.75rem 1rem', borderRadius:12,
            background:'rgba(255,255,255,0.03)',
            border:`1px solid rgba(255,255,255,0.07)`,
            display:'flex', gap:'0.6rem', alignItems:'flex-start',
            fontSize:'0.82rem', lineHeight:1.5,
          }}>
            <span>{t.icon}</span>
            <span style={{color:t.colour}}>{t.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
