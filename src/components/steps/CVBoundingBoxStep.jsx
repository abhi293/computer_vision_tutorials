import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CVBoundingBoxStep() {
  // Bounding box state [x_center, y_center, width, height] (normalized 0-1)
  const [box, setBox] = useState({ xc: 0.5, yc: 0.5, w: 0.3, h: 0.4 })
  const [isDragging, setIsDragging] = useState(false)
  
  const containerRef = useRef(null)

  // Handle dragging the box center
  const onPointerDown = (e) => {
    setIsDragging(true)
    e.target.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    
    // Calculate new center based on pointer position relative to container
    let newXc = (e.clientX - rect.left) / rect.width
    let newYc = (e.clientY - rect.top) / rect.height
    
    // Clamp to keep the box entirely inside the image
    const halfW = box.w / 2
    const halfH = box.h / 2
    newXc = Math.max(halfW, Math.min(1 - halfW, newXc))
    newYc = Math.max(halfH, Math.min(1 - halfH, newYc))

    setBox({ ...box, xc: newXc, yc: newYc })
  }

  const onPointerUp = (e) => {
    setIsDragging(false)
    e.target.releasePointerCapture(e.pointerId)
  }

  // Handle resizing via sliders
  const handleResize = (dim, val) => {
    const newVal = parseFloat(val)
    let { xc, yc, w, h } = box
    if (dim === 'w') {
      w = newVal
      xc = Math.max(w/2, Math.min(1 - w/2, xc)) // Adjust center if resize pushes it out
    } else {
      h = newVal
      yc = Math.max(h/2, Math.min(1 - h/2, yc))
    }
    setBox({ xc, yc, w, h })
  }

  // Formatting for display
  const fmt = (num) => num.toFixed(2)

  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto', paddingBottom: '6rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="badge badge-pink" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Object Detection</span>
        <h2>The <span className="gradient-text">Bounding Box</span> Tensor</h2>
        <p style={{ marginTop: '0.75rem', maxWidth: 700 }}>
          How does an AI output the location of an object? Not as a picture, but as a <strong>1D Tensor (Vector)</strong>. 
          A standard detection is represented as <code>[x_center, y_center, width, height, confidence, class_id]</code>.
        </p>
      </motion.div>

      <div style={{ display: 'flex', gap: '4rem', marginTop: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Interactive Image Area */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Drag the box around the "Car". Use sliders to adjust size.
          </div>
          
          <div 
            ref={containerRef}
            style={{ 
              position: 'relative', width: '100%', aspectRatio: '4/3', 
              background: 'url("https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80") center/cover',
              borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {/* The Draggable Bounding Box */}
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{
                position: 'absolute',
                left: `${(box.xc - box.w / 2) * 100}%`,
                top: `${(box.yc - box.h / 2) * 100}%`,
                width: `${box.w * 100}%`,
                height: `${box.h * 100}%`,
                border: '3px solid var(--accent3)',
                backgroundColor: isDragging ? 'rgba(255, 107, 157, 0.2)' : 'rgba(255, 107, 157, 0.1)',
                cursor: isDragging ? 'grabbing' : 'grab',
                boxShadow: isDragging ? '0 0 20px rgba(255, 107, 157, 0.6)' : 'none',
                transition: isDragging ? 'none' : 'background-color 0.2s, box-shadow 0.2s',
                touchAction: 'none' // Prevent scrolling on mobile while dragging
              }}
            >
              <div style={{ 
                position: 'absolute', top: -25, left: -3, 
                background: 'var(--accent3)', color: '#000', 
                padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold',
                borderRadius: '4px 4px 4px 0'
              }}>
                Car 0.98
              </div>
              {/* x,y axis lines for center */}
              <div style={{position:'absolute', top:'50%', left:0, width:'100%', height:1, background:'rgba(255,255,255,0.3)'}} />
              <div style={{position:'absolute', top:0, left:'50%', width:1, height:'100%', background:'rgba(255,255,255,0.3)'}} />
              <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:6, height:6, borderRadius:'50%', background:'white'}} />
            </div>
          </div>

          {/* Size Sliders */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ flex: 1, display: 'flex', flexDirection: 'column', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Width (w)
              <input type="range" min="0.1" max="0.9" step="0.05" value={box.w} onChange={(e) => handleResize('w', e.target.value)} style={{ accentColor: 'var(--accent3)' }}/>
            </label>
            <label style={{ flex: 1, display: 'flex', flexDirection: 'column', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Height (h)
              <input type="range" min="0.1" max="0.9" step="0.05" value={box.h} onChange={(e) => handleResize('h', e.target.value)} style={{ accentColor: 'var(--accent3)' }}/>
            </label>
          </div>
        </div>

        {/* The Live Tensor Representation */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>The Resulting Tensor</h3>
            <div style={{ 
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
              background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--accent3)'
            }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                Shape: [6] (Rank-1 Tensor)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                <span style={{ color: 'var(--text-secondary)' }}>[</span>
                <span style={{ color: '#fff', width: '3.5rem' }}>{fmt(box.xc)}</span><span style={{ color: 'var(--text-secondary)' }}>,</span>
                <span style={{ color: '#fff', width: '3.5rem' }}>{fmt(box.yc)}</span><span style={{ color: 'var(--text-secondary)' }}>,</span>
                <span style={{ color: 'var(--accent4)', width: '3.5rem' }}>{fmt(box.w)}</span><span style={{ color: 'var(--text-secondary)' }}>,</span>
                <span style={{ color: 'var(--accent4)', width: '3.5rem' }}>{fmt(box.h)}</span><span style={{ color: 'var(--text-secondary)' }}>,</span>
                <span style={{ color: 'var(--accent5)', width: '3.5rem' }}>0.98</span><span style={{ color: 'var(--text-secondary)' }}>,</span>
                <span style={{ color: 'var(--accent1)' }}>2</span>
                <span style={{ color: 'var(--text-secondary)' }}>]</span>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', fontSize: '0.85rem' }}>
              <div><span style={{ color: '#fff', fontWeight:'bold' }}>x, y:</span> Center Coordinates (Normalized 0 to 1)</div>
              <div><span style={{ color: 'var(--accent4)', fontWeight:'bold' }}>w, h:</span> Width & Height (Normalized 0 to 1)</div>
              <div><span style={{ color: 'var(--accent5)', fontWeight:'bold' }}>0.98:</span> Confidence Score (98% sure)</div>
              <div><span style={{ color: 'var(--accent1)', fontWeight:'bold' }}>2:</span> Class ID (e.g., 0=Person, 1=Bike, 2=Car)</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
