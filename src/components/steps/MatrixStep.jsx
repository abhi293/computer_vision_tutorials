import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MatrixGrid from '../MatrixGrid.jsx'

const MATRICES = {
  identity: {
    data: [[1,0,0],[0,1,0],[0,0,1]],
    name: 'Identity Matrix I₃',
    colour: 0,
    note: 'Ones on the diagonal, zeros elsewhere. Multiplication by I leaves any matrix unchanged — the "1" of matrix algebra.',
  },
  magic: {
    data: [[2,7,6],[9,5,1],[4,3,8]],
    name: 'Magic Square (3×3)',
    colour: 1,
    note: 'Every row, column and diagonal sums to 15. A 3×3 magic square — fun example of structured numeric patterns.',
  },
  transform: {
    data: [[0,-1],[1,0]],
    name: 'Rotation 90°',
    colour: 2,
    note: 'Applying this as a linear map rotates 2D vectors by 90° counter-clockwise. Matrices encode geometric transformations.',
  },
  image: {
    data: [[50,200,50],[200,255,200],[50,200,50]],
    name: 'Grayscale Pixel Channel',
    colour: 3,
    note: 'A tiny 3×3 grayscale image — each number is a pixel intensity 0–255. Images ARE matrices (and tensors)!',
  },
}

export default function MatrixStep() {
  const [active, setActive]     = useState('identity')
  const [clicked, setClicked]   = useState(null)  // {r, c, val}
  const mat = MATRICES[active]

  return (
    <div style={{padding:'2rem', maxWidth:980, margin:'0 auto', paddingBottom:'6rem'}}>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <span className="badge badge-pink" style={{marginBottom:'0.5rem',display:'inline-block'}}>Rank 2 · Tensor</span>
        <h2>What is a <span className="gradient-text">Matrix</span>?</h2>
        <p style={{marginTop:'0.75rem', maxWidth:600}}>
          A matrix is a <strong style={{color:'var(--accent3)'}}>2‑dimensional rectangular array</strong> of numbers,
          arranged in <em>rows</em> and <em>columns</em>.
          In tensor language it is a <strong style={{color:'var(--accent1)'}}>rank‑2 tensor</strong> with shape (m, n).
        </p>
      </motion.div>

      {/* tab selector */}
      <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'1.5rem'}}>
        {Object.entries(MATRICES).map(([key, m]) => (
          <motion.button key={key} whileTap={{scale:0.97}}
            onClick={() => { setActive(key); setClicked(null) }}
            style={{
              padding:'0.4rem 1rem', borderRadius:20, border:'1px solid',
              borderColor: active===key ? 'var(--accent3)' : 'rgba(255,255,255,0.1)',
              background: active===key ? 'rgba(255,107,157,0.15)' : 'transparent',
              color: active===key ? 'var(--accent3)' : 'var(--text-secondary)',
              cursor:'pointer', fontSize:'0.82rem', fontWeight:600,
              transition:'all 0.2s', fontFamily:'Inter,sans-serif',
            }}
          >{m.name}</motion.button>
        ))}
      </div>

      <div style={{display:'flex', gap:'3rem', marginTop:'2rem', flexWrap:'wrap', alignItems:'flex-start'}}>

        {/* Matrix visual */}
        <div style={{flex:'0 0 auto', display:'flex', flexDirection:'column', gap:'1rem'}}>
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}}
              exit={{opacity:0, scale:0.9}} transition={{duration:0.3}}
            >
              <MatrixGrid
                data={mat.data}
                colourIdx={mat.colour}
                animate
                onCellClick={(r, c, val) => setClicked({r, c, val})}
              />
            </motion.div>
          </AnimatePresence>

          {/* clicked cell info */}
          <AnimatePresence>
            {clicked && (
              <motion.div
                initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0}}
                style={{
                  padding:'0.6rem 1rem', borderRadius:10,
                  background:'rgba(255,107,157,0.12)', border:'1px solid rgba(255,107,157,0.3)',
                  fontSize:'0.82rem', fontFamily:"'JetBrains Mono',monospace",
                  color:'var(--accent3)',
                }}
              >
                M[{clicked.r}, {clicked.c}] = <strong>{clicked.val}</strong>
                <span style={{color:'var(--text-secondary)', fontFamily:'Inter,sans-serif'}}>
                  {' '}← row {clicked.r}, col {clicked.c}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <p style={{fontSize:'0.78rem', color:'rgba(255,255,255,0.25)', maxWidth:240}}>
            Click any cell to inspect its index
          </p>
        </div>

        {/* anatomy panel */}
        <div style={{flex:1, minWidth:280, display:'flex', flexDirection:'column', gap:'1rem'}}>
          {/* note card */}
          <motion.div className="card"
            key={active}
            initial={{opacity:0, x:20}} animate={{opacity:1, x:0}}
            style={{borderColor:'rgba(255,107,157,0.25)', background:'rgba(255,107,157,0.06)'}}
          >
            <div style={{display:'flex', gap:'0.75rem'}}>
              <span style={{fontSize:'1.4rem'}}>📝</span>
              <div>
                <strong style={{color:'var(--accent3)'}}>{mat.name}</strong>
                <p style={{fontSize:'0.88rem', marginTop:'0.3rem'}}>{mat.note}</p>
              </div>
            </div>
          </motion.div>

          {/* anatomy facts */}
          {[
            {icon:'📐', title:'Shape (m × n)', body:'m rows × n columns. Shape is accessed as .shape in NumPy — e.g. (3, 3) or (2, 2).'},
            {icon:'🔢', title:'Indexing M[i, j]', body:'i selects the row (axis 0), j selects the column (axis 1). Zero-indexed.'},
            {icon:'🔄', title:'Transpose Mᵀ', body:'Swap rows and columns. M[i, j] → Mᵀ[j, i]. Shape (m,n) → (n,m).'},
            {icon:'✖️', title:'Matrix Multiply', body:'M × N: inner dims must match. (m,k)×(k,n) → (m,n). Not commutative!'},
          ].map((c,i) => (
            <motion.div key={i} className="card"
              initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.1+i*0.08}}
              style={{display:'flex', gap:'0.75rem', padding:'0.8rem 1rem'}}
            >
              <span style={{fontSize:'1.2rem'}}>{c.icon}</span>
              <div>
                <strong style={{color:'var(--text-primary)', fontSize:'0.88rem'}}>{c.title}</strong>
                <p style={{fontSize:'0.8rem', marginTop:'0.2rem'}}>{c.body}</p>
              </div>
            </motion.div>
          ))}

          <div className="code-block" style={{fontSize:'0.78rem'}}>
            M = np.array(<span className="code-val">{JSON.stringify(mat.data)}</span>){'\n'}
            M.ndim   <span className="code-comment"># 2</span>{'\n'}
            M.shape  <span className="code-comment"># ({mat.data.length}, {mat.data[0].length})</span>{'\n'}
            M.T      <span className="code-comment"># transpose</span>
          </div>
        </div>
      </div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}}
        style={{marginTop:'2rem', padding:'1rem 1.5rem', borderRadius:12,
          background:'rgba(255,107,157,0.07)', border:'1px solid rgba(255,107,157,0.2)',
          display:'flex', gap:'1rem', alignItems:'center'}}>
        <span style={{fontSize:'1.4rem'}}>💬</span>
        <div>
          <strong style={{color:'var(--accent3)'}}>Key Insight</strong>
          <p style={{fontSize:'0.9rem', marginTop:'0.25rem'}}>
            A matrix is a rank‑2 tensor. It extends vectors from 1D to 2D.
            The leap to <em>higher</em> dimensions — adding more axes — is precisely what defines a <strong>tensor</strong>.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
