import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// A simple 6x6 grid representing an image (e.g. grayscale values)
const IMAGE_SIZE = 6
const FILTER_SIZE = 3

const INITIAL_IMAGE = [
    [1, 1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1, 1],
]

// A vertical edge detector filter
const FILTER = [
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1]
]

export default function CVConvolutionStep() {
    const [filterPos, setFilterPos] = useState({ r: 0, c: 0 })
    const [outputGrid, setOutputGrid] = useState(
        Array(IMAGE_SIZE - FILTER_SIZE + 1).fill().map(() =>
            Array(IMAGE_SIZE - FILTER_SIZE + 1).fill(null)
        )
    )
    const [isPlaying, setIsPlaying] = useState(false)

    const outputSize = IMAGE_SIZE - FILTER_SIZE + 1

    // Calculate the convolution output for a specific position
    const computeValue = (r, c) => {
        let sum = 0
        for (let i = 0; i < FILTER_SIZE; i++) {
            for (let j = 0; j < FILTER_SIZE; j++) {
                sum += INITIAL_IMAGE[r + i][c + j] * FILTER[i][j]
            }
        }
        return sum
    }

    // Auto-play the sliding window
    useEffect(() => {
        let timer;
        if (isPlaying) {
            timer = setInterval(() => {
                setFilterPos(prev => {
                    let nextC = prev.c + 1
                    let nextR = prev.r
                    if (nextC >= outputSize) {
                        nextC = 0
                        nextR = prev.r + 1
                    }
                    if (nextR >= outputSize) {
                        // Reached the end, stop and show full output briefly before restarting
                        setIsPlaying(false)
                        return { r: 0, c: 0 }
                    }
                    return { r: nextR, c: nextC }
                })
            }, 800) // Speed of sliding
        }
        return () => clearInterval(timer)
    }, [isPlaying, outputSize])

    // Update output grid when position changes
    useEffect(() => {
        if (!isPlaying && filterPos.r === 0 && filterPos.c === 0) return // Don't clear immediately on stop if we want to reset

        setOutputGrid(prev => {
            const newGrid = prev.map(row => [...row])
            // Only set if not already set or if we are animating
            newGrid[filterPos.r][filterPos.c] = computeValue(filterPos.r, filterPos.c)
            return newGrid
        })
    }, [filterPos, isPlaying])

    const restart = () => {
        setOutputGrid(
            Array(outputSize).fill().map(() => Array(outputSize).fill(null))
        )
        setFilterPos({ r: 0, c: 0 })
        setIsPlaying(true)
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto', paddingBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="badge badge-teal" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Computer Vision</span>
                <h2><span className="gradient-text">Convolutions</span> over Tensors</h2>
                <p style={{ marginTop: '0.75rem', maxWidth: 800 }}>
                    How do AI models "see" edges and shapes? They use a <strong>Filter</strong> (a small matrix/tensor) and
                    slide it across the Image Tensor. At each step, it multiplies the numbers and sums them up (Dot Product)
                    to create a new <strong>Feature Map</strong> tensor.
                </p>
            </motion.div>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>

                {/* Input Image */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        Input Image Tensor <br /><span style={{ fontSize: '0.8rem' }}>(6 × 6)</span>
                    </h3>
                    <div style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${IMAGE_SIZE}, 40px)`, gap: 4 }}>
                            {INITIAL_IMAGE.flatMap((row, r) =>
                                row.map((val, c) => {
                                    const inWindow = r >= filterPos.r && r < filterPos.r + FILTER_SIZE &&
                                        c >= filterPos.c && c < filterPos.c + FILTER_SIZE

                                    return (
                                        <div key={`${r}-${c}`} style={{
                                            width: 40, height: 40,
                                            background: val === 1 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)',
                                            color: val === 1 ? 'black' : 'rgba(255,255,255,0.5)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontFamily: 'monospace', borderRadius: 4,
                                            transition: 'background 0.3s',
                                            position: 'relative'
                                        }}>
                                            {val}

                                            {/* Highlight sliding window */}
                                            {inWindow && (
                                                <div style={{
                                                    position: 'absolute', inset: 0,
                                                    backgroundColor: 'rgba(6, 214, 160, 0.3)',
                                                    border: '2px solid var(--accent5)',
                                                    borderRadius: 4, zIndex: 10,
                                                    pointerEvents: 'none'
                                                }} />
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* The Math Concept */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 1rem' }}>
                    <div style={{ fontSize: '2rem', color: 'var(--accent5)' }}>⊗</div>
                    <div style={{ margin: '1rem 0', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Filter Tensor (3×3)<br />"Vertical Edge Detector"</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 30px)', gap: 2, background: 'rgba(0,0,0,0.5)', padding: 4, borderRadius: 6, border: '1px solid var(--accent5)' }}>
                            {FILTER.flat().map((v, i) => (
                                <div key={i} style={{
                                    width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: v === 1 ? 'rgba(255,255,255,0.2)' : v === -1 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.05)',
                                    color: v === 1 ? '#00d4ff' : v === -1 ? '#ff6b9d' : 'var(--text-secondary)',
                                    fontFamily: 'monospace', fontSize: '0.8rem', borderRadius: 2
                                }}>{v}</div>
                            ))}
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', color: 'var(--accent5)' }}>=</div>
                </div>

                {/* Output Feature Map */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        Output Feature Map <br /><span style={{ fontSize: '0.8rem' }}>(4 × 4)</span>
                    </h3>
                    <div style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${outputSize}, 40px)`, gap: 4 }}>
                            {outputGrid.flatMap((row, r) =>
                                row.map((val, c) => {
                                    const isActive = r === filterPos.r && c === filterPos.c
                                    return (
                                        <div key={`${r}-${c}`} style={{
                                            width: 40, height: 40,
                                            background: val !== null
                                                ? val > 0 ? 'rgba(0, 212, 255, 0.4)' : val < 0 ? 'rgba(255, 107, 157, 0.4)' : 'rgba(255,255,255,0.1)'
                                                : 'rgba(0,0,0,0.4)',
                                            color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontFamily: 'monospace', borderRadius: 4,
                                            border: isActive ? '2px solid var(--accent5)' : '1px solid transparent',
                                            boxShadow: isActive ? '0 0 15px var(--accent5)' : 'none',
                                            transition: 'all 0.2s'
                                        }}>
                                            {val !== null ? val : ''}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <button
                            className={`btn ${isPlaying ? 'btn-outline' : 'btn-primary'}`}
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? '⏸ Pause' : '▶ Play'} Animation
                        </button>
                        <button className="btn btn-outline" onClick={restart}>
                            🔄 Restart
                        </button>
                    </div>
                </div>

            </div>

            <div className="card" style={{ marginTop: '3rem' }}>
                <h4 style={{ color: 'var(--accent5)', marginBottom: '0.5rem' }}>What just happened?</h4>
                <p style={{ fontSize: '0.9rem' }}>
                    The filter slid across the image. Notice how the output is highly positive (blue) or highly negative (pink)
                    precisely where the colours change from white to black in the original image.
                    The tensor math naturally detected the vertical edge! In deep learning, millions of these filters are learned automatically.
                </p>
            </div>

        </div>
    )
}
