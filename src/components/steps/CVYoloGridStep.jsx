import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GRID = 7 // 7x7 grid
const DEPTH = 30 // B*5 + C (e.g. 2 boxes * 5 + 20 classes)

export default function CVYoloGridStep() {
    const [activeCell, setActiveCell] = useState(null)

    // Create dummy data for the grid where one specific cell has a high confidence "dog"
    const getCellData = (r, c) => {
        if (r === 3 && c === 4) { // Target cell
            return {
                confidence: 0.89, class: 'Dog', bx: 0.4, by: 0.6, bw: 0.8, bh: 0.9,
                isTarget: true
            }
        }
        return {
            confidence: Math.random() * 0.1, class: 'Background', bx: 0, by: 0, bw: 0, bh: 0,
            isTarget: false
        }
    }

    const handleCellClick = (r, c) => {
        setActiveCell({ r, c, ...getCellData(r, c) })
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto', paddingBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="badge badge-gold" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Object Detection</span>
                <h2>The <span className="gradient-text">YOLO Grid</span> Tensor</h2>
                <p style={{ marginTop: '0.75rem', maxWidth: 700 }}>
                    Modern detectors like YOLO divide the image into an <code>S × S</code> grid.
                    Each cell predicts a 1D Vector (Depth). Thus, the entire output is a massive <strong>Rank-3 Tensor</strong>
                    of shape <code>[{GRID}, {GRID}, {DEPTH}]</code>.
                </p>
            </motion.div>

            <div style={{ display: 'flex', gap: '3rem', marginTop: '3rem', flexWrap: 'wrap' }}>

                {/* Interactive Image Grid Area */}
                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Click any cell to extract its depth tensor. Find the dog!
                    </div>

                    <div style={{
                        position: 'relative', width: 400, height: 400,
                        background: 'url("https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80") center/cover',
                        borderRadius: 8, overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        border: '2px solid rgba(255,209,102,0.3)' // gold theme
                    }}>
                        {/* The 7x7 Grid Overlay */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: `repeat(${GRID}, 1fr)`, gridTemplateRows: `repeat(${GRID}, 1fr)`,
                            width: '100%', height: '100%', position: 'absolute', inset: 0
                        }}>
                            {Array.from({ length: GRID * GRID }).map((_, i) => {
                                const r = Math.floor(i / GRID)
                                const c = i % GRID
                                const isActive = activeCell?.r === r && activeCell?.c === c
                                const isTarget = r === 3 && c === 4

                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleCellClick(r, c)}
                                        style={{
                                            border: '1px solid rgba(255, 209, 102, 0.4)',
                                            background: isActive
                                                ? 'rgba(255, 209, 102, 0.5)'
                                                : isTarget && !isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s', // Removed hover pseudo class via inline, simulating it below
                                        }}
                                        onMouseEnter={(e) => { if (!isActive) e.target.style.background = 'rgba(255, 209, 102, 0.2)' }}
                                        onMouseLeave={(e) => { if (!isActive) e.target.style.background = isTarget ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                                    />
                                )
                            })}
                        </div>

                        {/* Overlay the actual box prediction if target is active */}
                        <AnimatePresence>
                            {activeCell?.isTarget && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        position: 'absolute',
                                        left: '20%', top: '30%', width: '50%', height: '60%', // Hardcoded approx relative to image
                                        border: '4px solid #06d6a0', // teal success box
                                        boxShadow: '0 0 20px rgba(6, 214, 160, 0.6)',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <div style={{ position: 'absolute', top: -25, left: -4, background: '#06d6a0', color: '#000', padding: '2px 6px', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        Dog 89%
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Depth Slice Extraction Display */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent4)' }}>Tensor Slice Extraction</h3>

                        {activeCell ? (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Extracted <code>YOLO_Output[{activeCell.r}, {activeCell.c}, :]</code>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: 8 }}>
                                    {/* Visualizing 30 depth items as tiny blocks */}
                                    {Array.from({ length: DEPTH }).map((_, i) => {
                                        // Logic to colour the important bits of the depth vector
                                        let color = 'rgba(255,255,255,0.1)'
                                        let highlight = false
                                        if (activeCell.isTarget) {
                                            if (i === 4) { color = 'var(--accent5)'; highlight = true } // confidence
                                            else if (i < 4) { color = 'var(--accent4)'; highlight = true } // box coords
                                            else if (i === 12) { color = 'var(--accent1)'; highlight = true } // class ID for dog
                                        }

                                        return (
                                            <div key={i} style={{
                                                width: 14, height: 24, background: color,
                                                border: highlight ? '1px solid white' : 'none', borderRadius: 2
                                            }} title={`Index: ${i}`} />
                                        )
                                    })}
                                    <div style={{ width: '100%', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 4, textAlign: 'center' }}>
                                        Shape: [30] (Depth Array)
                                    </div>
                                </div>

                                <div style={{ background: activeCell.isTarget ? 'rgba(6,214,160,0.1)' : 'rgba(255,107,157,0.05)', padding: '1rem', borderRadius: 8, border: `1px solid ${activeCell.isTarget ? 'var(--accent5)' : 'rgba(255,107,157,0.2)'}` }}>
                                    <h4 style={{ marginBottom: '0.5rem', color: activeCell.isTarget ? 'var(--accent5)' : 'var(--text-secondary)' }}>
                                        {activeCell.isTarget ? '✅ Detection Found!' : '❌ Background Noise'}
                                    </h4>
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        <li><strong>Confidence:</strong> {activeCell.confidence.toFixed(2)}</li>
                                        <li><strong>Class:</strong> {activeCell.class}</li>
                                        {activeCell.isTarget && (
                                            <li style={{ color: 'var(--accent4)', marginTop: '0.5rem' }}>
                                                Box: <code>[{activeCell.bx}, {activeCell.by}, {activeCell.bw}, {activeCell.bh}]</code>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </motion.div>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
                                Waiting for cell selection...
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
