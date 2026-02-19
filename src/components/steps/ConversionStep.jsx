import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MatrixGrid from '../MatrixGrid.jsx'

/* ─────────────────────────────────────────────────
   CONVERSION STEP
   Walks through five concrete ways a 2D matrix
   becomes a higher-rank tensor, with animated
   step-by-step explanation for each technique.
───────────────────────────────────────────────── */

const TECHNIQUES = [
  {
    id: 'expand',
    icon: '📦',
    title: 'np.expand_dims — Add an Axis',
    colour: '#6c63ff',
    badge: 'badge-purple',
    steps: [
      {
        label: 'Start: 2D Matrix',
        desc: 'We begin with a simple 3×4 matrix of shape (3, 4). It has 2 axes (rank 2).',
        code: 'M = np.array([[1,2,3,4],[5,6,7,8],[9,10,11,12]])\nM.shape  # (3, 4)',
        visual: 'matrix',
      },
      {
        label: 'expand_dims(M, axis=0)',
        desc: 'Insert a new axis at position 0. Shape goes from (3,4) → (1,3,4). We now have rank 3.',
        code: 'T = np.expand_dims(M, axis=0)\nT.shape  # (1, 3, 4)',
        visual: 'tensor1',
      },
      {
        label: 'expand_dims(M, axis=2)',
        desc: 'Or insert at the end. Shape (3,4) → (3,4,1). Still rank 3 — a "column" tensor.',
        code: 'T2 = np.expand_dims(M, axis=2)\nT2.shape  # (3, 4, 1)',
        visual: 'tensor2',
      },
      {
        label: 'Stack multiple copies',
        desc: 'Stack 3 copies along axis 0 to get a proper (3,3,4) tensor — like 3 colour channels.',
        code: 'T3 = np.stack([M, M, M], axis=0)\nT3.shape  # (3, 3, 4)',
        visual: 'tensor3',
      },
    ],
  },
  {
    id: 'reshape',
    icon: '🔄',
    title: 'np.reshape — Reshape into Tensor',
    colour: '#00d4ff',
    badge: 'badge-cyan',
    steps: [
      {
        label: 'Start: 2D Matrix (4×6)',
        desc: 'A 4×6 matrix has 24 elements total. Reshape can reinterpret these same 24 values in any shape.',
        code: 'M = np.arange(24).reshape(4, 6)\nM.shape  # (4, 6)',
        visual: 'matrix46',
      },
      {
        label: 'Reshape to (2, 3, 4)',
        desc: 'Same 24 values, now arranged as rank-3 tensor: 2 slices × 3 rows × 4 cols. 2×3×4 = 24 ✓',
        code: 'T = M.reshape(2, 3, 4)\nT.shape  # (2, 3, 4)',
        visual: 'reshaped_234',
      },
      {
        label: 'Reshape to (2, 2, 2, 3)',
        desc: 'Same data, rank-4! 2×2×2×3 = 24 ✓. The total element count must stay the same.',
        code: 'T2 = M.reshape(2, 2, 2, 3)\nT2.shape  # (2, 2, 2, 3)\nT2.ndim   # 4',
        visual: 'reshaped_2223',
      },
    ],
  },
  {
    id: 'stack',
    icon: '📚',
    title: 'np.stack — Stack Matrices into Tensor',
    colour: '#ff6b9d',
    badge: 'badge-pink',
    steps: [
      {
        label: 'Three Separate Matrices',
        desc: 'We have three individual 3×3 matrices: R, G, B colour channels of a tiny image.',
        code: 'R = np.array([[...]])  # shape (3,3)\nG = np.array([[...]])  # shape (3,3)\nB = np.array([[...]])  # shape (3,3)',
        visual: 'three_mats',
      },
      {
        label: 'np.stack([R, G, B], axis=0)',
        desc: 'Stack along axis 0 → new shape (3, 3, 3). Three 3×3 matrices become a single tensor.',
        code: 'img = np.stack([R, G, B], axis=0)\nimg.shape  # (3, 3, 3)\n# axis 0 = channel, 1 = row, 2 = col',
        visual: 'stacked_300',
      },
      {
        label: 'np.stack([R, G, B], axis=2) — HWC format',
        desc: 'Stack along axis 2 → shape (3, 3, 3) but channels-last (H, W, C). Standard in TensorFlow.',
        code: 'img_hwc = np.stack([R, G, B], axis=2)\nimg_hwc.shape  # (3, 3, 3)\n# axis 2 = channel (channels-last)',
        visual: 'stacked_hwc',
      },
    ],
  },
  {
    id: 'batch',
    icon: '🎯',
    title: 'Batching — Matrix → Rank-4 Tensor',
    colour: '#ffd166',
    badge: 'badge-gold',
    steps: [
      {
        label: 'Single Image Matrix',
        desc: 'A single greyscale image is a 28×28 matrix — shape (28, 28).',
        code: 'img = np.zeros((28, 28))\nimg.shape  # (28, 28)  ← rank 2',
        visual: 'single_img',
      },
      {
        label: 'Add channel dimension',
        desc: 'For neural networks we add a channel axis: (28,28) → (28,28,1) or (1,28,28).',
        code: 'img_c = img[..., np.newaxis]\nimg_c.shape  # (28, 28, 1)  ← rank 3',
        visual: 'img_channel',
      },
      {
        label: 'Add batch dimension',
        desc: 'Wrap in a batch: (28,28,1) → (1,28,28,1) — one image in a batch of size 1.',
        code: 'batch1 = img_c[np.newaxis, ...]\nbatch1.shape  # (1, 28, 28, 1)  ← rank 4',
        visual: 'batch1',
      },
      {
        label: 'Real training batch',
        desc: 'Load 32 images and stack them: shape (32,28,28,1). This is what a GPU processes at once!',
        code: 'batch = np.stack(images, axis=0)\nbatch.shape  # (32, 28, 28, 1)\n# batch_size × H × W × C',
        visual: 'batch32',
      },
    ],
  },
]

// ── tiny visual components ──────────────────────────────
const MATRIX_3x4 = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
const M4x6 = Array.from({length:4}, (_,r)=>Array.from({length:6}, (_,c)=>r*6+c))

function SmallMatrix({ data, colour, label, offset={x:0,y:0}, small=false }) {
  const sz = small ? 28 : 36
  return (
    <div style={{display:'flex', flexDirection:'column', gap:3, transform:`translate(${offset.x}px,${offset.y}px)`}}>
      {label && <div style={{fontSize:'0.7rem', color:'var(--text-secondary)', marginBottom:2}}>{label}</div>}
      {data.map((row,r) => (
        <div key={r} style={{display:'flex', gap:3}}>
          {row.map((v,c) => (
            <div key={c} style={{
              width:sz, height:sz, borderRadius:4,
              background:`${colour}22`, border:`1px solid ${colour}55`,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:colour, fontFamily:"'JetBrains Mono',monospace", fontWeight:600,
              fontSize: sz<32 ? '0.6rem' : '0.72rem',
            }}>{v}</div>
          ))}
        </div>
      ))}
    </div>
  )
}

function TensorSliceStack({ depth=3, rows=3, cols=4, colour, sliceOffset=14, small=false }) {
  const sz = small ? 22 : 28
  const data = Array.from({length:rows}, (_,r)=>Array.from({length:cols}, (_,c)=>(r*cols+c+1)))
  return (
    <div style={{position:'relative', width: cols*sz+(depth-1)*sliceOffset+cols*3+20, height: rows*sz+(depth-1)*sliceOffset+rows*3+20}}>
      {Array.from({length:depth}, (_,di) => (
        <div key={di} style={{
          position:'absolute',
          left: (depth-1-di)*sliceOffset,
          top:  (depth-1-di)*sliceOffset,
          display:'flex', flexDirection:'column', gap:3,
        }}>
          {data.map((row,r) => (
            <div key={r} style={{display:'flex', gap:3}}>
              {row.map((v,c) => (
                <div key={c} style={{
                  width:sz, height:sz, borderRadius:4,
                  background: di===depth-1 ? `${colour}33` : `${colour}14`,
                  border:`1px solid ${colour}${di===depth-1?'88':'44'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: di===depth-1 ? colour : `${colour}88`,
                  fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:'0.6rem',
                }}>{di===depth-1?v:'·'}</div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function VisualForStep({ id, stepIdx, colour }) {
  const visuals = {
    'expand-0': () => <SmallMatrix data={MATRIX_3x4} colour={colour} label="M shape (3,4)"/>,
    'expand-1': () => <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
      <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>T shape (1,3,4) — 1 slice</span>
      <TensorSliceStack depth={1} rows={3} cols={4} colour={colour}/>
    </div>,
    'expand-2': () => <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
      <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>T2 shape (3,4,1) — column tensor</span>
      <TensorSliceStack depth={3} rows={4} cols={1} colour={colour} sliceOffset={10}/>
    </div>,
    'expand-3': () => <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
      <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>T3 shape (3,3,4) — 3 channel slices</span>
      <TensorSliceStack depth={3} rows={3} cols={4} colour={colour}/>
    </div>,
    'reshape-0': () => <SmallMatrix data={M4x6} colour={colour} label="M shape (4,6)" small/>,
    'reshape-1': () => <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
      <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>T shape (2,3,4)</span>
      <TensorSliceStack depth={2} rows={3} cols={4} colour={colour}/>
    </div>,
    'reshape-2': () => (
      <div style={{display:'flex', gap:6, alignItems:'center', flexWrap:'wrap', justifyContent:'center'}}>
        {[0,1].map(b => (
          <div key={b} style={{display:'flex', flexDirection:'column', gap:4}}>
            {[0,1].map(d => (
              <div key={d} style={{
                padding:'0.3rem', borderRadius:6,
                background:`${colour}${b===0&&d===0?'22':'0e'}`,
                border:`1px solid ${colour}44`,
                display:'flex', gap:3,
              }}>
                {Array.from({length:6}, (_,i) => (
                  <div key={i} style={{
                    width:18, height:18, borderRadius:3,
                    background:`${colour}33`, border:`1px solid ${colour}66`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:colour, fontSize:'0.5rem', fontFamily:"'JetBrains Mono',monospace",
                    fontWeight:600,
                  }}>{b*12+d*6+i+1}</div>
                ))}
              </div>
            ))}
          </div>
        ))}
        <div style={{fontSize:'0.7rem', color:'var(--text-secondary)', width:'100%', textAlign:'center'}}>shape (2,2,2,3)</div>
      </div>
    ),
    'stack-0': () => (
      <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center'}}>
        {['R','G','B'].map((ch, ci) => (
          <SmallMatrix key={ci} data={[[ci+1,ci+2,ci+3],[ci+4,ci+5,ci+6],[ci+7,ci+8,ci+9]]}
            colour={['#ff5555','#55ff55','#5555ff'][ci]} label={ch} small/>
        ))}
      </div>
    ),
    'stack-1': () => <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
      <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>img shape (3,3,3) — channels first</span>
      <TensorSliceStack depth={3} rows={3} cols={3} colour={colour}/>
    </div>,
    'stack-2': () => <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
      <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>img_hwc shape (3,3,3) — channels last</span>
      <TensorSliceStack depth={3} rows={3} cols={3} colour={colour} sliceOffset={10}/>
    </div>,
    'batch-0': () => (
      <div style={{
        width:84, height:84, background:`${colour}15`, border:`1px dashed ${colour}55`,
        borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
        color:'var(--text-secondary)', fontSize:'0.7rem', fontFamily:"'JetBrains Mono',monospace",
      }}>28×28</div>
    ),
    'batch-1': () => <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
      <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>shape (28,28,1)</span>
      <TensorSliceStack depth={1} rows={4} cols={4} colour={colour}/>
    </div>,
    'batch-2': () => <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
      <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>shape (1,28,28,1)</span>
      <TensorSliceStack depth={1} rows={4} cols={4} colour={colour}/>
    </div>,
    'batch-3': () => (
      <div style={{display:'flex', gap:3, alignItems:'flex-end'}}>
        {Array.from({length:6}, (_,i) => (
          <div key={i} style={{
            width:16, height:28+i*4, borderRadius:3,
            background:`${colour}${i===5?'44':'22'}`, border:`1px solid ${colour}66`,
          }}/>
        ))}
        <span style={{fontSize:'0.65rem',color:'var(--text-secondary)',marginLeft:4}}>32 images</span>
      </div>
    ),
  }
  const key = `${id}-${stepIdx}`
  const Vis = visuals[key]
  return Vis ? <Vis/> : <div style={{color:'var(--text-secondary)', fontSize:'0.8rem'}}>Visual coming...</div>
}

export default function ConversionStep() {
  const [techIdx, setTechIdx] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const tech = TECHNIQUES[techIdx]
  const step = tech.steps[stepIdx]

  const selectTech = (i) => { setTechIdx(i); setStepIdx(0) }

  return (
    <div style={{padding:'2rem', maxWidth:1000, margin:'0 auto', paddingBottom:'6rem'}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <span className="badge badge-teal" style={{marginBottom:'0.5rem',display:'inline-block'}}>Core Concept</span>
        <h2>Matrix <span className="gradient-text">→ Tensor</span> Conversion</h2>
        <p style={{marginTop:'0.75rem', maxWidth:620}}>
          There are several ways to turn a 2D matrix into a higher-rank tensor.
          Each technique is used in different real-world scenarios.
          Walk through each step-by-step below.
        </p>
      </motion.div>

      {/* technique tabs */}
      <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'1.5rem'}}>
        {TECHNIQUES.map((t,i) => (
          <motion.button key={i} whileTap={{scale:0.97}}
            onClick={() => selectTech(i)}
            style={{
              display:'flex', alignItems:'center', gap:'0.4rem',
              padding:'0.5rem 1rem', borderRadius:20, border:'1px solid',
              borderColor: i===techIdx ? t.colour : 'rgba(255,255,255,0.1)',
              background: i===techIdx ? t.colour+'22' : 'transparent',
              color: i===techIdx ? t.colour : 'var(--text-secondary)',
              cursor:'pointer', fontSize:'0.82rem', fontWeight:600,
              transition:'all 0.2s', fontFamily:'Inter,sans-serif',
            }}
          ><span>{t.icon}</span><span>{t.title.split(' — ')[0]}</span></motion.button>
        ))}
      </div>

      {/* step progress */}
      <div style={{
        display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'1.5rem',
        padding:'0.75rem 1rem', borderRadius:12,
        background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
      }}>
        {tech.steps.map((s,i) => (
          <button key={i}
            onClick={() => setStepIdx(i)}
            style={{
              display:'flex', alignItems:'center', gap:'0.4rem',
              padding:'0.3rem 0.7rem', borderRadius:8,
              border: `1px solid ${i<=stepIdx ? tech.colour+'66' : 'rgba(255,255,255,0.08)'}`,
              background: i===stepIdx ? tech.colour+'22' : i<stepIdx ? tech.colour+'0e' : 'transparent',
              color: i===stepIdx ? tech.colour : i<stepIdx ? tech.colour+'88' : 'rgba(255,255,255,0.3)',
              cursor:'pointer', fontSize:'0.75rem', fontWeight:600,
              transition:'all 0.2s', fontFamily:'Inter,sans-serif', flex:1,
            }}
          >
            <span style={{
              width:18, height:18, borderRadius:'50%', fontSize:'0.65rem', fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center',
              background: i<=stepIdx ? tech.colour+'44' : 'rgba(255,255,255,0.06)',
              color: i<=stepIdx ? tech.colour : 'rgba(255,255,255,0.3)',
              flexShrink:0,
            }}>{i+1}</span>
            <span style={{display:'none', '@media(min-width:600px)':{display:'block'}}}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* main content */}
      <AnimatePresence mode="wait">
        <motion.div key={`${techIdx}-${stepIdx}`}
          initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-10}}
          transition={{duration:0.3}}
          style={{marginTop:'1.5rem', display:'flex', gap:'2rem', flexWrap:'wrap', alignItems:'flex-start'}}
        >
          {/* visual */}
          <div style={{
            flex:'0 0 auto',
            padding:'1.5rem', borderRadius:16,
            background: `${tech.colour}0a`,
            border:`1px solid ${tech.colour}33`,
            minWidth:200, display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem',
          }}>
            <div style={{fontSize:'0.78rem', color:'var(--text-secondary)'}}>Step {stepIdx+1}: Visualisation</div>
            <VisualForStep id={tech.id} stepIdx={stepIdx} colour={tech.colour}/>

            {/* step arrows */}
            <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem'}}>
              <motion.button
                whileTap={{scale:0.95}}
                disabled={stepIdx===0}
                onClick={() => setStepIdx(s => s-1)}
                style={{
                  width:36, height:36, borderRadius:'50%',
                  border:`1px solid ${tech.colour}44`,
                  background:'transparent', cursor:'pointer',
                  color: stepIdx===0 ? 'rgba(255,255,255,0.2)' : tech.colour,
                  fontSize:'1rem',
                }}
              >←</motion.button>
              <motion.button
                whileTap={{scale:0.95}}
                disabled={stepIdx===tech.steps.length-1}
                onClick={() => setStepIdx(s => s+1)}
                style={{
                  width:36, height:36, borderRadius:'50%',
                  border:`1px solid ${tech.colour}44`,
                  background: stepIdx===tech.steps.length-1 ? 'transparent' : `${tech.colour}22`,
                  cursor:'pointer',
                  color: stepIdx===tech.steps.length-1 ? 'rgba(255,255,255,0.2)' : tech.colour,
                  fontSize:'1rem',
                }}
              >→</motion.button>
            </div>
          </div>

          {/* explanation */}
          <div style={{flex:1, minWidth:280, display:'flex', flexDirection:'column', gap:'1rem'}}>
            <div>
              <h3 style={{color: tech.colour}}>{step.label}</h3>
              <p style={{marginTop:'0.5rem'}}>{step.desc}</p>
            </div>
            <div className="code-block" style={{fontSize:'0.8rem'}}>
              {step.code}
            </div>

            {/* operation context */}
            <div style={{
              padding:'0.75rem 1rem', borderRadius:10,
              background:`${tech.colour}0a`, border:`1px solid ${tech.colour}22`,
            }}>
              <strong style={{color:'var(--text-primary)', fontSize:'0.85rem'}}>{tech.icon} {tech.title}</strong>
              <p style={{fontSize:'0.8rem', marginTop:'0.25rem', color:'var(--text-secondary)'}}>
                {tech.id === 'expand' && 'expand_dims inserts a new axis of size 1, increasing the rank without changing any values.'}
                {tech.id === 'reshape' && 'reshape rearranges the same data into a new shape. Total element count must stay identical.'}
                {tech.id === 'stack' && 'stack creates a new axis and concatenates arrays along it — perfect for combining channels.'}
                {tech.id === 'batch' && 'Batching is how raw data (images, text, signals) becomes the rank-4 inputs that GPUs process.'}
              </p>
            </div>

            {/* key formula */}
            <div style={{
              padding:'0.75rem 1rem', borderRadius:10,
              background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
              fontFamily:"'JetBrains Mono',monospace", fontSize:'0.8rem', color:'var(--text-secondary)',
            }}>
              {tech.id === 'expand' && <>rank before: <strong style={{color:tech.colour}}>2</strong> → rank after: <strong style={{color:'var(--accent5)'}}>3</strong></>}
              {tech.id === 'reshape' && <>total elements preserved: <strong style={{color:tech.colour}}>∏(shape)</strong> = const</>}
              {tech.id === 'stack' && <>n matrices → <strong style={{color:tech.colour}}>1 tensor</strong>  (new axis inserted)</>}
              {tech.id === 'batch' && <>rank chain: <strong style={{color:tech.colour}}>2 → 3 → 4</strong>  (B × H × W × C)</>}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
