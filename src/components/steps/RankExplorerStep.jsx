import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const RANKS = [
  {
    rank: 0,
    name: 'Scalar',
    shape: '()',
    ndim: 0,
    colour: '#6c63ff',
    badge: 'badge-purple',
    icon: '⚡',
    example: '42',
    desc: 'A single number. No axes. The most basic mathematical object.',
    useCases: ['Loss value','Learning rate','Temperature','Probability'],
    visual: (c) => (
      <div style={{
        width:80, height:80, borderRadius:'50%',
        background:`radial-gradient(circle at 35% 35%, ${c}55, ${c}11)`,
        border:`2px solid ${c}88`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'1.6rem', fontFamily:"'JetBrains Mono',monospace",
        fontWeight:700, color:c, boxShadow:`0 0 30px ${c}44`,
      }}>42</div>
    ),
  },
  {
    rank: 1,
    name: 'Vector',
    shape: '(n,)',
    ndim: 1,
    colour: '#00d4ff',
    badge: 'badge-cyan',
    icon: '➡️',
    example: '[1, 2, 3, 4]',
    desc: 'An ordered list of numbers along ONE axis. Has length n.',
    useCases: ['Feature vector','Word embedding','Velocity','1D signal'],
    visual: (c) => (
      <div style={{display:'flex', gap:6}}>
        {[1,2,3,4].map((v,i) => (
          <motion.div key={i} initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            style={{
              width:40, height:40, borderRadius:6,
              background:`${c}22`, border:`1px solid ${c}55`,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:c, fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:'0.85rem',
            }}>{v}</motion.div>
        ))}
      </div>
    ),
  },
  {
    rank: 2,
    name: 'Matrix',
    shape: '(m, n)',
    ndim: 2,
    colour: '#ff6b9d',
    badge: 'badge-pink',
    icon: '🔲',
    example: '[[1,2],[3,4]]',
    desc: 'Numbers arranged in ROWS × COLS — the classic 2D grid.',
    useCases: ['Image channel','Transformation','DataFrame','Correlation'],
    visual: (c) => (
      <div style={{display:'flex', flexDirection:'column', gap:4}}>
        {[[1,2,3],[4,5,6],[7,8,9]].map((row,r) => (
          <div key={r} style={{display:'flex', gap:4}}>
            {row.map((v,ci) => (
              <motion.div key={ci}
                initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}}
                transition={{delay:(r*3+ci)*0.04}}
                style={{
                  width:34, height:34, borderRadius:5,
                  background:`${c}22`, border:`1px solid ${c}55`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:c, fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:'0.78rem',
                }}>{v}</motion.div>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  {
    rank: 3,
    name: 'Rank-3 Tensor',
    shape: '(d, m, n)',
    ndim: 3,
    colour: '#ffd166',
    badge: 'badge-gold',
    icon: '🧊',
    example: 'image.shape = (224, 224, 3)',
    desc: 'Three axes: depth × rows × cols. Like stacked matrices.',
    useCases: ['RGB image','Time series batch','3D volumetric data','Conv layer'],
    visual: (c) => (
      <div style={{position:'relative', width:100, height:100}}>
        {[2,1,0].map(di => (
          <div key={di} style={{
            position:'absolute',
            left: di*8, top: di*8,
            width:64, height:64,
            background:`${c}${di===0?'33':'18'}`,
            border:`1.5px solid ${c}77`,
            borderRadius:6,
            display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:2, padding:4,
          }}>
            {Array.from({length:9}, (_,i) => (
              <div key={i} style={{
                background:`${c}22`, borderRadius:2,
                fontSize:'0.5rem', color:c, fontFamily:"'JetBrains Mono',monospace",
                display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600,
              }}>{(i+di*3)%10}</div>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  {
    rank: 4,
    name: 'Rank-4 Tensor',
    shape: '(b, d, m, n)',
    ndim: 4,
    colour: '#06d6a0',
    badge: 'badge-teal',
    icon: '🎬',
    example: 'batch.shape = (32, 224, 224, 3)',
    desc: 'Four axes: batch × depth × rows × cols — standard in deep learning.',
    useCases: ['Training batch','Video clip','4D MRI scan','Conv4D features'],
    visual: (c) => (
      <div style={{display:'flex', gap:6, alignItems:'center'}}>
        {[0,1,2].map(bi => (
          <div key={bi} style={{
            width:36, height:36, borderRadius:6,
            background:`${c}${bi===0?'33':'18'}`,
            border:`1.5px solid ${c}66`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:c, fontSize:'0.65rem', fontFamily:"'JetBrains Mono',monospace", fontWeight:700,
          }}>b{bi}</div>
        ))}
        <span style={{color:'var(--text-secondary)', fontSize:'0.85rem'}}>...</span>
      </div>
    ),
  },
]

export default function RankExplorerStep() {
  const [active, setActive] = useState(0)
  const cur = RANKS[active]

  return (
    <div style={{padding:'2rem', maxWidth:980, margin:'0 auto', paddingBottom:'6rem'}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <span className="badge badge-teal" style={{marginBottom:'0.5rem',display:'inline-block'}}>Rank / Order</span>
        <h2>Tensor <span className="gradient-text">Rank & Shape</span></h2>
        <p style={{marginTop:'0.75rem', maxWidth:600}}>
          The <strong style={{color:'var(--accent5)'}}>rank</strong> (or <em>order</em>) of a tensor is the number of
          <strong style={{color:'var(--accent2)'}}> axes (dimensions)</strong> it has.
          Select a rank below to explore its shape, visual form, and real-world uses.
        </p>
      </motion.div>

      {/* Rank selector — horizontal timeline */}
      <div style={{
        display:'flex', alignItems:'center', gap:0,
        marginTop:'2rem', position:'relative',
      }}>
        {/* connecting line */}
        <div style={{
          position:'absolute', left:20, right:20, top:'50%',
          height:2, background:'rgba(255,255,255,0.07)', zIndex:0, transform:'translateY(-50%)',
        }}/>
        {RANKS.map((r,i) => (
          <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative', zIndex:1}}>
            <motion.button
              whileHover={{scale:1.12}} whileTap={{scale:0.95}}
              onClick={()=>setActive(i)}
              style={{
                width:52, height:52, borderRadius:'50%',
                border:`2px solid ${i===active ? r.colour : 'rgba(255,255,255,0.15)'}`,
                background: i===active ? r.colour+'33' : 'rgba(5,8,21,0.9)',
                color: i===active ? r.colour : 'var(--text-secondary)',
                cursor:'pointer', fontSize:'1.2rem',
                boxShadow: i===active ? `0 0 24px ${r.colour}66` : 'none',
                transition:'all 0.3s',
              }}
            >{r.icon}</motion.button>
            <div style={{
              marginTop:'0.4rem', fontSize:'0.7rem', fontWeight:600,
              color: i===active ? r.colour : 'var(--text-secondary)',
              textAlign:'center',
            }}>Rank {r.rank}</div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}
          transition={{duration:0.35}}
          style={{
            marginTop:'2rem', display:'flex', gap:'2.5rem', flexWrap:'wrap', alignItems:'flex-start',
          }}
        >
          {/* visual */}
          <div style={{flex:'0 0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem'}}>
            <div style={{
              padding:'2rem', borderRadius:16,
              background: `${cur.colour}0a`,
              border:`1px solid ${cur.colour}33`,
              minWidth:160, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.75rem',
            }}>
              {cur.visual(cur.colour)}
              <div style={{fontFamily:"'JetBrains Mono',monospace", color:cur.colour, fontSize:'0.8rem', textAlign:'center'}}>
                shape: {cur.shape}
              </div>
            </div>
          </div>

          {/* text */}
          <div style={{flex:1, minWidth:260, display:'flex', flexDirection:'column', gap:'1rem'}}>
            <div>
              <div style={{display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem'}}>
                <h3 style={{color:cur.colour}}>{cur.name}</h3>
                <span className={`badge ${cur.badge}`}>ndim = {cur.ndim}</span>
              </div>
              <p>{cur.desc}</p>
            </div>

            <div>
              <strong style={{color:'var(--text-primary)', fontSize:'0.9rem'}}>Real-world use cases</strong>
              <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'0.5rem'}}>
                {cur.useCases.map((u,i) => (
                  <span key={i} className={`badge ${cur.badge}`} style={{fontSize:'0.73rem'}}>{u}</span>
                ))}
              </div>
            </div>

            <div className="code-block" style={{fontSize:'0.78rem'}}>
              <span className="code-comment"># Example</span>{'\n'}
              {cur.example}
            </div>

            {/* rank comparison row */}
            <div style={{
              display:'flex', gap:'0.4rem', alignItems:'center',
              padding:'0.75rem 1rem', borderRadius:10,
              background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
              flexWrap:'wrap',
            }}>
              {RANKS.map((r,i) => (
                <div key={i} style={{
                  display:'flex', flexDirection:'column', alignItems:'center',
                  padding:'0.2rem 0.5rem',
                  background: i===active ? `${r.colour}22` : 'transparent',
                  borderRadius:6,
                  transition:'background 0.3s',
                }}>
                  <span style={{fontSize:'0.65rem', color: i===active ? r.colour : 'var(--text-secondary)', fontWeight:i===active?700:400}}>
                    Rank {r.rank}
                  </span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'0.6rem', color:'rgba(255,255,255,0.3)'}}>
                    {r.shape}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
