import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Simulating 5 frames of video
const FRAMES = [
    { img: 'https://images.unsplash.com/photo-1516084478160-c32f8b5aab54?auto=format&fit=crop&q=80', box: { x: 20, y: 50 }, t: 0 },
    { img: 'https://images.unsplash.com/photo-1516084478160-c32f8b5aab54?auto=format&fit=crop&q=80', box: { x: 40, y: 51 }, t: 1 },
    { img: 'https://images.unsplash.com/photo-1516084478160-c32f8b5aab54?auto=format&fit=crop&q=80', box: { x: 60, y: 52 }, t: 2 },
    { img: 'https://images.unsplash.com/photo-1516084478160-c32f8b5aab54?auto=format&fit=crop&q=80', box: { x: 80, y: 53 }, t: 3 },
    { img: 'https://images.unsplash.com/photo-1516084478160-c32f8b5aab54?auto=format&fit=crop&q=80', box: { x: 100, y: 54 }, t: 4 },
]

export default function CVTrackingStep() {
    const [frameIdx, setFrameIdx] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    // Auto-play the timeline
    useEffect(() => {
        let timer;
        if (isPlaying) {
            timer = setInterval(() => {
                setFrameIdx((prev) => (prev + 1) % FRAMES.length)
            }, 800)
        }
        return () => clearInterval(timer)
    }, [isPlaying])

    return (
        <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto', paddingBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="badge badge-purple" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Object Tracking</span>
                <h2>Adding the <span className="gradient-text">Dimension of Time</span></h2>
                <p style={{ marginTop: '0.75rem', maxWidth: 800 }}>
                    Tracking objects in video requires adding the <strong>Time</strong> axis.
                    A video is a sequence of images (frames). If an image is a Rank-3 tensor, a batch of video frames is a massive <strong>Rank-4 Tensor</strong>:
                    <code>[Time, Height, Width, Channels]</code>.
                </p>
            </motion.div>

            <div style={{ display: 'flex', gap: '3rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>

                {/* The "Video" Player */}
                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>

                    <div style={{ position: 'relative', width: 450, height: 300, background: '#111', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>

                        {/* Base Image (Static for simulation, we pan the box) */}
                        <img
                            src={FRAMES[frameIdx].img}
                            alt="Video frame"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }}
                        />

                        {/* Simulated Tracked Box */}
                        <motion.div
                            animate={{ left: `${FRAMES[frameIdx].box.x}%`, top: `${FRAMES[frameIdx].box.y}%` }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            style={{
                                position: 'absolute', width: 40, height: 30, transform: 'translate(-50%, -50%)',
                                border: '3px solid var(--accent1)', boxShadow: '0 0 15px rgba(108, 99, 255, 0.5)',
                                background: 'rgba(108, 99, 255, 0.2)'
                            }}
                        />
                        {/* ID Tag */}
                        <motion.div
                            animate={{ left: `${FRAMES[frameIdx].box.x}%`, top: `${FRAMES[frameIdx].box.y}%` }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            style={{ position: 'absolute', marginTop: -30, marginLeft: -20, background: 'var(--accent1)', color: '#fff', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '4px 4px 4px 0' }}
                        >
                            ID: 42
                        </motion.div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', width: 450 }}>
                        <button
                            className={`btn ${isPlaying ? 'btn-outline' : 'btn-primary'}`}
                            onClick={() => setIsPlaying(!isPlaying)}
                            style={{ flex: 1 }}
                        >
                            {isPlaying ? '⏸ Pause' : '▶ Play Sequence'}
                        </button>
                    </div>

                    {/* Timeline slider */}
                    <div style={{ width: 450, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>t=0</span>
                        <input
                            type="range" min="0" max={FRAMES.length - 1}
                            value={frameIdx}
                            onChange={(e) => { setFrameIdx(Number(e.target.value)); setIsPlaying(false) }}
                            style={{ flex: 1, accentColor: 'var(--accent1)' }}
                        />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>t={FRAMES.length - 1}</span>
                    </div>

                </div>

                {/* Stacked Tensor Visualization */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>The Tracked Tensor Sequence</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid var(--card-border)' }}>

                        {FRAMES.map((f, i) => {
                            const isActive = i === frameIdx
                            return (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '0.75rem', background: isActive ? 'rgba(108, 99, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${isActive ? 'var(--accent1)' : 'transparent'}`, borderRadius: 8,
                                    transition: 'all 0.2s', opacity: isActive ? 1 : 0.6
                                }}>
                                    <div style={{ fontWeight: 'bold', color: isActive ? 'white' : 'var(--text-secondary)', width: 40 }}>
                                        T={f.t}
                                    </div>
                                    <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.85rem', color: isActive ? 'var(--accent4)' : 'var(--text-secondary)' }}>
                                        [x:{f.box.x.toFixed(1)}, y:{f.box.y.toFixed(1)}, ID:42]
                                    </div>
                                    {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent1)', boxShadow: '0 0 10px var(--accent1)' }} />}
                                </div>
                            )
                        })}
                    </div>

                    <div className="card" style={{ marginTop: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>
                            Notice how the x-coordinate smoothly interpolates over the <code>Time</code> dimension. By evaluating the Rank-2 tensor slice <code>[Time, BoundingBox]</code> over several frames, AI can calculate velocity and predict where the object will be next!
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
