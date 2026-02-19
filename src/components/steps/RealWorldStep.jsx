import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─────────────────────────────────────────
   RealWorldStep
   Five real-world domains where tensors live
──────────────────────────────────────────*/

const DOMAINS = [
  {
    icon: '🖼️',
    title: 'Computer Vision — Images',
    colour: '#6c63ff',
    badge: 'badge-purple',
    sections: [
      {
        label: 'Grayscale image',
        shape: '(H, W)',
        rank: 2,
        desc: 'A single channel — pure matrix. Each value is a brightness 0–255.',
        vis: (c) => (
          <div style={{display:'grid', gridTemplateColumns:'repeat(6,24px)', gap:3}}>
            {[12,45,200,180,90,30,50,210,255,240,110,40,80,190,245,220,100,35].map((v,i) =>(
              <div key={i} style={{
                width:24, height:24, borderRadius:3,
                background:`rgba(${v},${v},${v},0.9)`,
                border:`1px solid ${c}33`, flexShrink:0,
              }}/>
            ))}
          </div>
        ),
      },
      {
        label: 'RGB image',
        shape: '(H, W, 3)',
        rank: 3,
        desc: 'Three channels: Red, Green, Blue. A 2D matrix per channel, stacked along axis 2.',
        vis: (c) => (
          <div style={{display:'flex', gap:8}}>
            {[['R','255,50,50'],['G','50,200,50'],['B','50,100,255']].map(([ch,rgb],ci) => (
              <div key={ci} style={{display:'flex', flexDirection:'column', gap:2, alignItems:'center'}}>
                <span style={{fontSize:'0.65rem', color:`rgba(${rgb},0.9)`, fontWeight:700}}>{ch}</span>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3,18px)', gap:2}}>
                  {Array.from({length:9}, (_,i) => (
                    <div key={i} style={{
                      width:18, height:18, borderRadius:2,
                      background:`rgba(${rgb},${0.3+i*0.07})`,
                      border:`1px solid rgba(${rgb},0.5)`,
                    }}/>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        label: 'Batch of RGB images',
        shape: '(N, H, W, 3)',
        rank: 4,
        desc: 'N images batched together. This is what a neural network truly processes — rank-4.',
        vis: (c) => (
          <div style={{display:'flex', gap:6, alignItems:'flex-end'}}>
            {Array.from({length:5}, (_,i) => (
              <div key={i} style={{
                width:28+i*4, height:28+i*4,
                background:`${c}${i===4?'33':'18'}`,
                border:`1px solid ${c}${i===4?'88':'44'}`,
                borderRadius:5, flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'0.55rem', color:`${c}88`, fontFamily:"'JetBrains Mono',monospace",
              }}>N{i+1}</div>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    icon: '📝',
    title: 'NLP — Text & Language',
    colour: '#00d4ff',
    badge: 'badge-cyan',
    sections: [
      {
        label: 'Token IDs (sentence)',
        shape: '(seq_len,)',
        rank: 1,
        desc: 'A sentence → list of integer token IDs. Vector of length = number of tokens.',
        vis: (c) => (
          <div style={{display:'flex', gap:4, flexWrap:'wrap'}}>
            {['Hello','world','!'].map((w,i) => (
              <div key={i} style={{
                padding:'0.25rem 0.5rem', borderRadius:6,
                background:`${c}22`, border:`1px solid ${c}55`,
                color:c, fontSize:'0.7rem', fontFamily:"'JetBrains Mono',monospace",
                display:'flex', flexDirection:'column', alignItems:'center', gap:1,
              }}>
                <span style={{fontSize:'0.75rem',fontFamily:'Inter,sans-serif',fontWeight:600}}>{w}</span>
                <span style={{fontSize:'0.6rem', color:'rgba(255,255,255,0.4)'}}>{[4312,2088,0][i]}</span>
              </div>
            ))}
          </div>
        ),
      },
      {
        label: 'Token + Embeddings',
        shape: '(seq_len, d_model)',
        rank: 2,
        desc: 'Each token is embedded into a d_model-dimensional vector → matrix of shape (seq, d).',
        vis: (c) => (
          <div style={{display:'flex', flexDirection:'column', gap:3}}>
            {['Hello','world','!'].map((w,i) => (
              <div key={i} style={{display:'flex', gap:1, alignItems:'center'}}>
                <span style={{fontSize:'0.6rem', width:36, color:'var(--text-secondary)',fontFamily:'Inter,sans-serif'}}>{w}</span>
                {Array.from({length:8}, (_,j) => (
                  <div key={j} style={{
                    width:16, height:16, borderRadius:2,
                    background:`${c}${Math.random()>0.5?'44':'22'}`,
                    border:`1px solid ${c}44`,
                  }}/>
                ))}
                <span style={{fontSize:'0.5rem',color:'rgba(255,255,255,0.2)', marginLeft:2}}>d=768</span>
              </div>
            ))}
          </div>
        ),
      },
      {
        label: 'Batch of sequences',
        shape: '(B, seq_len, d_model)',
        rank: 3,
        desc: 'Batch B sentences together → rank-3 tensor. The input to a Transformer block.',
        vis: (c) => (
          <div style={{position:'relative', width:120, height:80}}>
            {[2,1,0].map(bi => (
              <div key={bi} style={{
                position:'absolute', left:bi*10, top:bi*10,
                width:90, height:55,
                background:`${c}${bi===2?'22':'0e'}`, border:`1px solid ${c}${bi===2?'66':'33'}`,
                borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'0.6rem', color:`${c}88`, fontFamily:"'JetBrains Mono',monospace",
              }}>seq×d</div>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    icon: '🔊',
    title: 'Audio — Sound Signals',
    colour: '#ff6b9d',
    badge: 'badge-pink',
    sections: [
      {
        label: 'Raw waveform',
        shape: '(samples,)',
        rank: 1,
        desc: 'A raw audio signal is a 1D vector of amplitude values sampled at e.g. 44100 Hz.',
        vis: (c) => (
          <svg width={150} height={50}>
            {Array.from({length:30}, (_,i) => {
              const h = 10 + Math.abs(Math.sin(i*0.7))*20
              return <rect key={i} x={i*5} y={(50-h)/2} width={3} height={h}
                fill={c} opacity={0.4+i*0.02} rx={1}/>
            })}
          </svg>
        ),
      },
      {
        label: 'Spectrogram',
        shape: '(freq_bins, time_steps)',
        rank: 2,
        desc: 'STFT converts 1D audio → 2D spectrogram: frequency × time matrix. Classic ML input.',
        vis: (c) => (
          <div style={{display:'grid', gridTemplateColumns:'repeat(10,12px)', gap:1}}>
            {Array.from({length:50}, (_,i) => {
              const intensity = Math.max(0, 1 - i*0.02 + Math.random()*0.3)
              return <div key={i} style={{
                width:12, height:12, borderRadius:1,
                background:`${c}`, opacity:intensity*0.9,
              }}/>
            })}
          </div>
        ),
      },
      {
        label: 'Multi-channel audio batch',
        shape: '(B, channels, samples)',
        rank: 3,
        desc: 'Stereo audio (2 channels) batched for ML: rank-3 tensor (B, 2, T).',
        vis: (c) => (
          <div style={{display:'flex', flexDirection:'column', gap:4}}>
            {['L','R'].map((ch,ci) => (
              <div key={ci} style={{display:'flex', gap:2, alignItems:'center'}}>
                <span style={{fontSize:'0.65rem', width:14, color:c, fontWeight:700}}>{ch}</span>
                {Array.from({length:14}, (_,i) => {
                  const h = 4+Math.abs(Math.sin(i*0.8+ci))*12
                  return <div key={i} style={{
                    width:6, height:h, borderRadius:1,
                    background:`${c}66`, alignSelf:'center',
                  }}/>
                })}
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    icon: '🧠',
    title: 'Deep Learning — Neural Nets',
    colour: '#ffd166',
    badge: 'badge-gold',
    sections: [
      {
        label: 'Weight matrix (Dense layer)',
        shape: '(in_features, out_features)',
        rank: 2,
        desc: 'A fully-connected layer has a weight matrix W. Output = X @ W + b.',
        vis: (c) => (
          <div style={{display:'flex', flexDirection:'column', gap:3}}>
            {Array.from({length:4}, (_,r) => (
              <div key={r} style={{display:'flex', gap:3}}>
                {Array.from({length:6}, (_,cl) => (
                  <div key={cl} style={{
                    width:18, height:18, borderRadius:3,
                    background:`${c}${Math.random()>0.5?'44':'22'}`,
                    border:`1px solid ${c}44`,
                  }}/>
                ))}
              </div>
            ))}
            <span style={{fontSize:'0.6rem',color:'var(--text-secondary)',fontFamily:"'JetBrains Mono',monospace"}}>W: (4, 6)</span>
          </div>
        ),
      },
      {
        label: 'Conv filter (2D)',
        shape: '(out_ch, in_ch, kH, kW)',
        rank: 4,
        desc: 'A 2D convolutional layer has rank-4 weight tensors: out_ch × in_ch × kernel_H × kernel_W.',
        vis: (c) => (
          <div style={{display:'flex', gap:4}}>
            {[0,1,2].map(f => (
              <div key={f} style={{
                width:40, height:40, borderRadius:6,
                background:`${c}${f===0?'33':'18'}`, border:`1px solid ${c}${f===0?'77':'33'}`,
                display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, padding:3,
              }}>
                {Array.from({length:9},(_,i) => (
                  <div key={i} style={{background:`${c}55`, borderRadius:1}}/>
                ))}
              </div>
            ))}
            <span style={{fontSize:'0.55rem',color:'var(--text-secondary)',alignSelf:'flex-end',fontFamily:"'JetBrains Mono',monospace"}}>3×3 kernel</span>
          </div>
        ),
      },
      {
        label: 'Attention scores (Transformer)',
        shape: '(batch, heads, seq, seq)',
        rank: 4,
        desc: 'Multi-head attention produces a rank-4 tensor of attention weights — the "focus" of each head.',
        vis: (c) => (
          <div style={{display:'flex', gap:4, alignItems:'center'}}>
            {Array.from({length:4}, (_,h) => (
              <div key={h} style={{
                width:30, height:30, borderRadius:4,
                background:`${c}${h===0?'44':'22'}`, border:`1px solid ${c}55`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'0.55rem', color:c, fontFamily:"'JetBrains Mono',monospace", fontWeight:700,
              }}>H{h+1}</div>
            ))}
            <span style={{fontSize:'0.6rem',color:'var(--text-secondary)'}}>4 heads</span>
          </div>
        ),
      },
    ],
  },
]

export default function RealWorldStep() {
  const [domIdx, setDomIdx] = useState(0)
  const [secIdx, setSecIdx] = useState(0)
  const dom = DOMAINS[domIdx]
  const sec = dom.sections[secIdx]

  const switchDom = (i) => { setDomIdx(i); setSecIdx(0) }

  return (
    <div style={{padding:'2rem', maxWidth:980, margin:'0 auto', paddingBottom:'6rem'}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <span className="badge badge-teal" style={{marginBottom:'0.5rem',display:'inline-block'}}>Real World</span>
        <h2>Tensors in the <span className="gradient-text">Real World</span></h2>
        <p style={{marginTop:'0.75rem', maxWidth:620}}>
          Tensors aren't just math — they <em>are</em> the data in modern AI, signal processing, and scientific computing.
          Explore how matrices step up in rank to represent real things.
        </p>
      </motion.div>

      {/* domain tabs */}
      <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'1.5rem'}}>
        {DOMAINS.map((d,i) => (
          <motion.button key={i} whileTap={{scale:0.97}}
            onClick={() => switchDom(i)}
            style={{
              display:'flex', alignItems:'center', gap:'0.4rem',
              padding:'0.5rem 1rem', borderRadius:12, border:'1px solid',
              borderColor: i===domIdx ? d.colour : 'rgba(255,255,255,0.08)',
              background: i===domIdx ? `${d.colour}22` : 'transparent',
              color: i===domIdx ? d.colour : 'var(--text-secondary)',
              cursor:'pointer', fontSize:'0.82rem', fontWeight:600,
              transition:'all 0.2s', fontFamily:'Inter,sans-serif',
            }}
          ><span>{d.icon}</span><span>{d.title.split(' — ')[0]}</span></motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={domIdx}
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}
          style={{marginTop:'2rem'}}
        >
          {/* rank progression of this domain */}
          <div style={{
            display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap',
          }}>
            {dom.sections.map((s,i) => (
              <motion.button key={i} whileTap={{scale:0.97}}
                onClick={() => setSecIdx(i)}
                style={{
                  flex:1, minWidth:150,
                  padding:'0.7rem 1rem', borderRadius:12, border:'1px solid',
                  borderColor: i===secIdx ? dom.colour : 'rgba(255,255,255,0.08)',
                  background: i===secIdx ? `${dom.colour}15` : 'rgba(255,255,255,0.02)',
                  cursor:'pointer', textAlign:'left',
                  fontFamily:'Inter,sans-serif', transition:'all 0.2s',
                }}
              >
                <div style={{fontSize:'0.7rem', color: i===secIdx?dom.colour:'rgba(255,255,255,0.3)', fontWeight:700, marginBottom:2}}>
                  Rank {s.rank}
                </div>
                <div style={{fontSize:'0.8rem', color: i===secIdx?'var(--text-primary)':'var(--text-secondary)', fontWeight:600}}>
                  {s.label}
                </div>
                <div style={{
                  fontFamily:"'JetBrains Mono',monospace", fontSize:'0.7rem',
                  color: i===secIdx?dom.colour:'rgba(255,255,255,0.25)', marginTop:2,
                }}>{s.shape}</div>
              </motion.button>
            ))}
          </div>

          {/* section detail */}
          <AnimatePresence mode="wait">
            <motion.div key={secIdx}
              initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0}}
              style={{display:'flex', gap:'2rem', flexWrap:'wrap', alignItems:'flex-start'}}
            >
              <div style={{
                flex:'0 0 auto',
                padding:'1.5rem', borderRadius:16,
                background:`${dom.colour}0a`, border:`1px solid ${dom.colour}33`,
                minWidth:180, display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem',
              }}>
                <div style={{fontSize:'0.75rem', color:'var(--text-secondary)'}}>Shape: {sec.shape}</div>
                {sec.vis(dom.colour)}
                <span className={`badge ${dom.badge}`} style={{fontSize:'0.7rem'}}>Rank {sec.rank}</span>
              </div>

              <div style={{flex:1, minWidth:260, display:'flex', flexDirection:'column', gap:'1rem'}}>
                <div>
                  <h3 style={{color:dom.colour}}>{sec.label}</h3>
                  <p style={{marginTop:'0.5rem'}}>{sec.desc}</p>
                </div>

                {/* shape breakdown */}
                <div style={{
                  padding:'0.75rem 1rem', borderRadius:10,
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
                }}>
                  <strong style={{color:'var(--text-primary)', fontSize:'0.85rem'}}>Shape breakdown</strong>
                  <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'0.5rem'}}>
                    {sec.shape.replace(/[()]/g,'').split(',').map((dim,i) => (
                      <div key={i} style={{
                        padding:'0.25rem 0.6rem', borderRadius:6,
                        background:`${dom.colour}22`, border:`1px solid ${dom.colour}44`,
                        fontFamily:"'JetBrains Mono',monospace", fontSize:'0.75rem', color:dom.colour,
                      }}>axis {i}: {dim.trim()}</div>
                    ))}
                  </div>
                </div>

                <div style={{
                  padding:'0.75rem 1rem', borderRadius:10,
                  background:`${dom.colour}08`, border:`1px solid ${dom.colour}22`,
                  fontSize:'0.82rem', color:'var(--text-secondary)',
                }}>
                  💡 In <strong style={{color:dom.colour}}>PyTorch / TensorFlow</strong>, this tensor can be created with{' '}
                  <code style={{fontFamily:"'JetBrains Mono',monospace", color:dom.colour}}>
                    torch.zeros({sec.shape})
                  </code>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
