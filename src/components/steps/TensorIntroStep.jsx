import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/* ──────────────────────────────────────
   CSS 3D CUBE TENSOR VISUALISATION
   A rank-3 tensor rendered as stacked
   "depth slices" with perspective
────────────────────────────────────── */

const DEPTH_COLOURS = [
  { face:'rgba(108,99,255,0.35)', edge:'rgba(108,99,255,0.7)' },
  { face:'rgba(0,212,255,0.25)',  edge:'rgba(0,212,255,0.6)' },
  { face:'rgba(255,107,157,0.25)',edge:'rgba(255,107,157,0.6)' },
  { face:'rgba(255,209,102,0.25)',edge:'rgba(255,209,102,0.6)' },
]

function TensorCube({ shape, rotX, rotY }) {
  const [d, r, c] = shape
  const sliceW = 24 * c
  const sliceH = 24 * r
  const offset = 18   // z-spacing per slice

  return (
    <div style={{
      width: sliceW + d * offset + 40,
      height: sliceH + d * offset + 40,
      perspective: 800,
      perspectiveOrigin: '50% 50%',
    }}>
      <div style={{
        position:'relative',
        transformStyle:'preserve-3d',
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transition:'transform 0.05s linear',
        width: sliceW, height: sliceH,
        marginTop: d * offset / 2,
        marginLeft: d * offset / 2,
      }}>
        {Array.from({length: d}, (_, di) => {
          const pal = DEPTH_COLOURS[di % DEPTH_COLOURS.length]
          const cells = Array.from({length: r}, (_, ri) =>
            Array.from({length: c}, (_, ci) => ((di + ri + ci) * 7 + 3) % 10)
          )
          return (
            <div key={di} style={{
              position:'absolute',
              width: sliceW, height: sliceH,
              background: pal.face,
              border: `1.5px solid ${pal.edge}`,
              borderRadius: 6,
              transform: `translateZ(${di * offset}px)`,
              display:'grid',
              gridTemplateColumns: `repeat(${c}, 24px)`,
              padding: 2, gap: 2,
            }}>
              {cells.flat().map((v, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.6rem', fontFamily:"'JetBrains Mono',monospace",
                  color: pal.edge, fontWeight:600,
                  background:'rgba(0,0,0,0.15)', borderRadius:3,
                }}>{v}</div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TensorIntroStep() {
  const [rotX, setRotX] = useState(-25)
  const [rotY, setRotY] = useState(35)
  const [drag, setDrag]  = useState(null)
  const [shapeIdx, setShape] = useState(0)

  const shapes = [
    { shape:[3,3,3], label:'3×3×3 Tensor', desc:'Rank 3 — depth × rows × cols' },
    { shape:[4,3,3], label:'4×3×3 Tensor', desc:'4 depth slices — like 4 stacked matrices' },
    { shape:[3,4,4], label:'3×4×4 Tensor', desc:'Like 3 colour channels in a small image' },
    { shape:[2,3,4], label:'2×3×4 Tensor', desc:'Batch of 2, 3 rows, 4 cols' },
  ]
  const current = shapes[shapeIdx]

  const onMouseDown = (e) => setDrag({x:e.clientX, y:e.clientY, rx:rotX, ry:rotY})
  const onMouseMove = (e) => {
    if (!drag) return
    setRotX(drag.rx - (e.clientY - drag.y) * 0.5)
    setRotY(drag.ry + (e.clientX - drag.x) * 0.5)
  }
  const onUp = () => setDrag(null)

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onUp) }
  })

  return (
    <div style={{padding:'2rem', maxWidth:1000, margin:'0 auto', paddingBottom:'6rem'}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <span className="badge badge-gold" style={{marginBottom:'0.5rem',display:'inline-block'}}>Rank N · Generalisation</span>
        <h2>What is a <span className="gradient-text">Tensor</span>?</h2>
        <p style={{marginTop:'0.75rem', maxWidth:620}}>
          A tensor is the <strong style={{color:'var(--accent4)'}}>N‑dimensional generalisation</strong> of scalars, vectors, and matrices.
          Where a matrix has 2 axes, a tensor can have <em>any number of axes</em> (rank / order).
          Drag the cube below to feel its 3D structure!
        </p>
      </motion.div>

      <div style={{display:'flex', gap:'3rem', marginTop:'2rem', flexWrap:'wrap', alignItems:'flex-start'}}>

        {/* 3D cube */}
        <div style={{flex:'0 0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem'}}>
          <div style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>
            Drag to rotate 👇
          </div>
          <div
            onMouseDown={onMouseDown}
            style={{cursor: drag ? 'grabbing' : 'grab', userSelect:'none'}}
          >
            <TensorCube shape={current.shape} rotX={rotX} rotY={rotY} />
          </div>

          {/* shape selector */}
          <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', justifyContent:'center'}}>
            {shapes.map((s,i) => (
              <button key={i}
                onClick={() => setShape(i)}
                style={{
                  padding:'0.3rem 0.7rem', borderRadius:20, border:'1px solid',
                  borderColor: i===shapeIdx ? 'var(--accent4)' : 'rgba(255,255,255,0.1)',
                  background: i===shapeIdx ? 'rgba(255,209,102,0.15)' : 'transparent',
                  color: i===shapeIdx ? 'var(--accent4)' : 'var(--text-secondary)',
                  cursor:'pointer', fontSize:'0.75rem', fontWeight:600,
                  transition:'all 0.2s', fontFamily:'Inter,sans-serif',
                }}
              >{s.label}</button>
            ))}
          </div>

          <div style={{
            textAlign:'center', fontFamily:"'JetBrains Mono',monospace",
            fontSize:'0.82rem', color:'var(--accent4)',
            padding:'0.5rem 1rem', background:'rgba(255,209,102,0.1)',
            border:'1px solid rgba(255,209,102,0.25)', borderRadius:8,
          }}>
            shape = ({current.shape.join(', ')})<br/>
            <span style={{color:'var(--text-secondary)',fontFamily:'Inter,sans-serif',fontSize:'0.78rem'}}>{current.desc}</span>
          </div>
        </div>

        {/* explanations */}
        <div style={{flex:1, minWidth:280, display:'flex', flexDirection:'column', gap:'1rem'}}>
          {[
            {icon:'🧊', title:'Stacked matrices', body:'A rank-3 tensor = a stack of matrices. Imagine flipping pages of a book — each page is a matrix (rank-2 slice).'},
            {icon:'📷', title:'Colour images', body:'An RGB image is a rank-3 tensor of shape (H, W, 3). Three 2D matrices — one for Red, Green, Blue.'},
            {icon:'🎬', title:'Video', body:'A video = rank-4 tensor: (frames, H, W, channels). Adding the time axis promotes rank-3 → rank-4.'},
            {icon:'🤖', title:'Neural networks', body:'Training batches are rank-4 tensors: (batch_size, H, W, channels). The most common tensor in deep learning.'},
          ].map((c,i) => (
            <motion.div key={i} className="card"
              initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.1+i*0.1}}
              style={{display:'flex', gap:'0.75rem', padding:'0.8rem 1rem'}}
            >
              <span style={{fontSize:'1.3rem'}}>{c.icon}</span>
              <div>
                <strong style={{color:'var(--text-primary)', fontSize:'0.88rem'}}>{c.title}</strong>
                <p style={{fontSize:'0.82rem', marginTop:'0.2rem'}}>{c.body}</p>
              </div>
            </motion.div>
          ))}

          <div className="code-block" style={{fontSize:'0.78rem'}}>
            <span className="code-comment"># Rank-3 tensor in NumPy</span>{'\n'}
            T = np.random.rand(<span className="code-val">{current.shape.join(', ')}</span>){'\n'}
            T.ndim   <span className="code-comment"># {current.shape.length}</span>{'\n'}
            T.shape  <span className="code-comment"># ({current.shape.join(', ')})</span>{'\n'}
            T[<span className="code-val">0</span>]    <span className="code-comment"># first {current.shape[1]}×{current.shape[2]} matrix slice</span>
          </div>
        </div>
      </div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}}
        style={{marginTop:'2rem', padding:'1rem 1.5rem', borderRadius:12,
          background:'rgba(255,209,102,0.06)', border:'1px solid rgba(255,209,102,0.2)',
          display:'flex', gap:'1rem', alignItems:'center'}}>
        <span style={{fontSize:'1.4rem'}}>💬</span>
        <div>
          <strong style={{color:'var(--accent4)'}}>The Big Idea</strong>
          <p style={{fontSize:'0.9rem', marginTop:'0.25rem'}}>
            <strong>Scalar ⊂ Vector ⊂ Matrix ⊂ Tensor</strong><br/>
            Each is a special case of the next. A matrix is <em>just</em> a rank‑2 tensor.
            Tensors unify all of these under one coherent framework.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
