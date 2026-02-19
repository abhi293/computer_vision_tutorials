import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ──────────────────────────────────────────────
   PLAYGROUND STEP
   Interactive: build your own matrix/tensor,
   see shape, rank, and element count live.
────────────────────────────────────────────── */

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }

function makeData(rows, cols, fillType, seed=1) {
  return Array.from({length:rows}, (_,r) =>
    Array.from({length:cols}, (_,c) => {
      if (fillType==='zeros') return 0
      if (fillType==='ones')  return 1
      if (fillType==='range') return r*cols+c+1
      if (fillType==='random') return Math.floor((Math.abs(Math.sin((r*cols+c+1)*seed*123.456)))*99)+1
      if (fillType==='identity') return r===c?1:0
      return r*cols+c+1
    })
  )
}

function TensorPreview({ data, colour, depth=1, sliceOffset=12 }) {
  const rows = data.length
  const cols = data[0]?.length ?? 0
  const cellSz = Math.max(20, Math.min(40, Math.floor(200 / Math.max(rows, cols, 1))))
  return (
    <div style={{position:'relative', display:'inline-block',
      width: cols*(cellSz+3)+(depth-1)*sliceOffset+20,
      height: rows*(cellSz+3)+(depth-1)*sliceOffset+20,
    }}>
      {Array.from({length:depth}, (_,di) => (
        <div key={di} style={{
          position:'absolute',
          left:(depth-1-di)*sliceOffset,
          top: (depth-1-di)*sliceOffset,
          display:'flex', flexDirection:'column', gap:3,
        }}>
          {data.map((row,r) => (
            <div key={r} style={{display:'flex', gap:3}}>
              {row.map((v,c) => (
                <div key={c} style={{
                  width:cellSz, height:cellSz, borderRadius:4,
                  background: di===depth-1 ? `${colour}33` : `${colour}0e`,
                  border:`1px solid ${colour}${di===depth-1?'88':'33'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: di===depth-1 ? colour : `${colour}55`,
                  fontFamily:"'JetBrains Mono',monospace", fontWeight:600,
                  fontSize: cellSz<28 ? '0.55rem' : '0.72rem',
                }}>{di===depth-1?v:'·'}</div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const FILL_TYPES = [
  {id:'range',   label:'Range',   desc:'1,2,3…'},
  {id:'zeros',   label:'Zeros',   desc:'0,0,0…'},
  {id:'ones',    label:'Ones',    desc:'1,1,1…'},
  {id:'random',  label:'Random',  desc:'rand'},
  {id:'identity',label:'Identity',desc:'eye'},
]

const OPERATIONS = [
  {id:'none',       label:'Raw Matrix',       icon:'🔲', rankDelta:0},
  {id:'expand_0',   label:'expand_dims(0)',   icon:'📦', rankDelta:1,
   note:'Add axis at position 0 → (1, m, n)'},
  {id:'expand_2',   label:'expand_dims(-1)',  icon:'📦', rankDelta:1,
   note:'Add axis at end → (m, n, 1)'},
  {id:'stack3',     label:'Stack ×3',         icon:'📚', rankDelta:1,
   note:'Stack 3 copies → (3, m, n)'},
  {id:'batch',      label:'Batch of 8',       icon:'🎯', rankDelta:2,
   note:'(8, m, n) — standard training batch'},
]

export default function PlaygroundStep() {
  const [rows,     setRows]     = useState(3)
  const [cols,     setCols]     = useState(4)
  const [fill,     setFill]     = useState('range')
  const [seed,     setSeed]     = useState(1)
  const [opId,     setOp]       = useState('none')
  const [clickedCell, setClicked] = useState(null)

  const data = useMemo(() => makeData(rows, cols, fill, seed), [rows, cols, fill, seed])

  const op = OPERATIONS.find(o => o.id===opId)

  const shapeInfo = useMemo(() => {
    const base = [rows, cols]
    let shape, depth=1
    if      (opId==='expand_0')  { shape=[1,rows,cols]; depth=1 }
    else if (opId==='expand_2')  { shape=[rows,cols,1]; depth=1 }
    else if (opId==='stack3')    { shape=[3,rows,cols]; depth=3 }
    else if (opId==='batch')     { shape=[8,rows,cols]; depth=8 }
    else                          { shape=base; depth=1 }
    const rank = shape.length
    const total = shape.reduce((a,b)=>a*b,1)
    return {shape, rank, total, depth}
  }, [rows, cols, opId])

  const colour = ['#6c63ff','#00d4ff','#ff6b9d','#ffd166','#06d6a0'][shapeInfo.rank-2] || '#6c63ff'

  return (
    <div style={{padding:'2rem', maxWidth:1000, margin:'0 auto', paddingBottom:'6rem'}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <span className="badge badge-teal" style={{marginBottom:'0.5rem',display:'inline-block'}}>Interactive</span>
        <h2>🎮 <span className="gradient-text">Playground</span></h2>
        <p style={{marginTop:'0.75rem', maxWidth:620}}>
          Build your own matrix, apply tensor operations, and watch the shape and rank change live!
        </p>
      </motion.div>

      <div style={{display:'flex', gap:'2rem', marginTop:'2rem', flexWrap:'wrap', alignItems:'flex-start'}}>

        {/* LEFT: controls */}
        <div style={{flex:'0 0 auto', display:'flex', flexDirection:'column', gap:'1.25rem', minWidth:260}}>

          {/* rows / cols sliders */}
          <div className="card" style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <strong style={{color:'var(--text-primary)'}}>Matrix Dimensions</strong>

            {[
              {label:'Rows (m)', val:rows, set:setRows, min:1, max:6},
              {label:'Cols (n)', val:cols, set:setCols, min:1, max:8},
            ].map(({label,val,set,min,max}) => (
              <div key={label}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:'0.4rem'}}>
                  <span style={{color:'var(--text-secondary)'}}>{label}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace", color:colour, fontWeight:700}}>{val}</span>
                </div>
                <input type="range" min={min} max={max} value={val}
                  onChange={e => set(Number(e.target.value))}
                  style={{
                    width:'100%', accentColor:colour,
                    cursor:'pointer', height:4,
                  }}
                />
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.65rem', color:'rgba(255,255,255,0.2)', marginTop:'0.15rem'}}>
                  <span>{min}</span><span>{max}</span>
                </div>
              </div>
            ))}
          </div>

          {/* fill type */}
          <div className="card">
            <strong style={{color:'var(--text-primary)', display:'block', marginBottom:'0.75rem'}}>Fill Values</strong>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.4rem'}}>
              {FILL_TYPES.map(f => (
                <button key={f.id}
                  onClick={() => { setFill(f.id); setSeed(s => s+1) }}
                  style={{
                    padding:'0.4rem 0.6rem', borderRadius:8, border:'1px solid',
                    borderColor: fill===f.id ? colour : 'rgba(255,255,255,0.08)',
                    background: fill===f.id ? `${colour}22` : 'transparent',
                    color: fill===f.id ? colour : 'var(--text-secondary)',
                    cursor:'pointer', fontSize:'0.78rem', fontWeight:600,
                    fontFamily:'Inter,sans-serif', transition:'all 0.2s',
                    display:'flex', flexDirection:'column', alignItems:'flex-start',
                  }}
                >
                  <span>{f.label}</span>
                  <span style={{fontSize:'0.65rem', opacity:0.6}}>{f.desc}</span>
                </button>
              ))}
              <button
                onClick={() => setSeed(s => s+1)}
                style={{
                  padding:'0.4rem 0.6rem', borderRadius:8, border:'1px solid rgba(255,255,255,0.08)',
                  background:'transparent', color:'var(--text-secondary)',
                  cursor:'pointer', fontSize:'0.78rem', fontFamily:'Inter,sans-serif',
                  transition:'all 0.2s',
                }}
              >🔀 Re-roll</button>
            </div>
          </div>

          {/* operation */}
          <div className="card">
            <strong style={{color:'var(--text-primary)', display:'block', marginBottom:'0.75rem'}}>
              Apply Operation
            </strong>
            <div style={{display:'flex', flexDirection:'column', gap:'0.4rem'}}>
              {OPERATIONS.map(o => (
                <button key={o.id}
                  onClick={() => setOp(o.id)}
                  style={{
                    padding:'0.5rem 0.75rem', borderRadius:8, border:'1px solid',
                    borderColor: opId===o.id ? colour : 'rgba(255,255,255,0.08)',
                    background: opId===o.id ? `${colour}22` : 'transparent',
                    color: opId===o.id ? colour : 'var(--text-secondary)',
                    cursor:'pointer', fontSize:'0.8rem', fontWeight:600,
                    fontFamily:'Inter,sans-serif', transition:'all 0.2s',
                    display:'flex', alignItems:'center', gap:'0.5rem', textAlign:'left',
                  }}
                >
                  <span>{o.icon}</span>
                  <div>
                    <div>{o.label}</div>
                    {o.note && opId===o.id && (
                      <div style={{fontSize:'0.68rem', fontWeight:400, opacity:0.7, marginTop:1}}>{o.note}</div>
                    )}
                  </div>
                  {o.rankDelta>0 && (
                    <span style={{marginLeft:'auto', fontSize:'0.68rem', opacity:0.6}}>
                      +{o.rankDelta}D
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: visualisation + stats */}
        <div style={{flex:1, minWidth:300, display:'flex', flexDirection:'column', gap:'1.25rem'}}>

          {/* live stats bar */}
          <AnimatePresence mode="wait">
            <motion.div key={`${rows}-${cols}-${opId}`}
              initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}}
              style={{
                padding:'1rem 1.25rem', borderRadius:16,
                background:`${colour}10`, border:`1px solid ${colour}44`,
                display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center',
              }}
            >
              {[
                {label:'Shape',  val:`(${shapeInfo.shape.join(', ')})` },
                {label:'Rank',   val:shapeInfo.rank },
                {label:'Elements', val:shapeInfo.total },
                {label:'Type',   val:shapeInfo.rank===2?'Matrix':'Tensor' },
              ].map((s,i) => (
                <div key={i} style={{display:'flex', flexDirection:'column', gap:2, minWidth:70}}>
                  <div style={{fontSize:'0.68rem', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em'}}>
                    {s.label}
                  </div>
                  <div style={{
                    fontFamily:"'JetBrains Mono',monospace", fontWeight:700,
                    fontSize:'1rem', color:colour,
                  }}>{s.val}</div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* tensor visualisation */}
          <div style={{
            padding:'1.5rem', borderRadius:16, minHeight:200,
            background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)',
            display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem',
          }}>
            <div style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>
              {opId==='none' ? 'Your matrix' : `After ${op.label}`} — click a cell to inspect
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${rows}-${cols}-${fill}-${seed}-${opId}`}
                initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}}
                exit={{opacity:0, scale:0.9}}
                transition={{type:'spring', stiffness:300}}
              >
                <TensorPreview
                  data={data}
                  colour={colour}
                  depth={Math.min(shapeInfo.depth, 4)}
                  sliceOffset={opId==='none' ? 0 : 14}
                />
              </motion.div>
            </AnimatePresence>

            {/* clicked info */}
            <AnimatePresence>
              {clickedCell && (
                <motion.div
                  initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{
                    padding:'0.4rem 0.9rem', borderRadius:8,
                    background:`${colour}22`, border:`1px solid ${colour}44`,
                    fontFamily:"'JetBrains Mono',monospace", fontSize:'0.8rem', color:colour,
                  }}
                >
                  [{clickedCell.r},{clickedCell.c}] = {clickedCell.val}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* generated numpy code */}
          <div className="code-block" style={{fontSize:'0.76rem'}}>
            <span className="code-comment"># Auto-generated NumPy code</span>{'\n'}
            M = np.{fill==='random'?'random.randint(1, 100, ':fill==='zeros'?'zeros(':fill==='ones'?'ones(':fill==='identity'?`eye(`:`arange(1, ${rows*cols+1}).reshape(`}
            {fill==='identity' ? `${Math.min(rows,cols)})` : `(${rows}, ${cols})`}{fill==='random'?')':fill==='range'?')':''}{'\n'}
            {'\n'}
            {opId === 'expand_0' && `T = np.expand_dims(M, axis=0)  # (1,${rows},${cols})\n`}
            {opId === 'expand_2' && `T = np.expand_dims(M, axis=-1) # (${rows},${cols},1)\n`}
            {opId === 'stack3'   && `T = np.stack([M, M, M], axis=0) # (3,${rows},${cols})\n`}
            {opId === 'batch'    && `T = np.tile(M[np.newaxis], (8,1,1)) # (8,${rows},${cols})\n`}
            result.<span className="code-fn">shape</span>  <span className="code-comment"># ({shapeInfo.shape.join(', ')})</span>{'\n'}
            result.<span className="code-fn">ndim</span>   <span className="code-comment"># {shapeInfo.rank}</span>
          </div>

          {/* congrats if all explored */}
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
            style={{
              padding:'1rem 1.25rem', borderRadius:12,
              background:'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(6,214,160,0.08))',
              border:'1px solid rgba(108,99,255,0.2)',
              display:'flex', gap:'0.75rem', alignItems:'center',
            }}
          >
            <span style={{fontSize:'1.4rem'}}>🎉</span>
            <div>
              <strong style={{color:'var(--accent5)'}}>You've completed the tutorial!</strong>
              <p style={{fontSize:'0.82rem', marginTop:'0.25rem'}}>
                You now understand scalars, vectors, matrices, tensors, rank, shape,
                and how to convert between them. Go build something amazing! 🚀
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
