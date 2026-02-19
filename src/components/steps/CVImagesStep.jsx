import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// A small recognizable 8x8 pixel art (e.g., a simple alien/space invader)
const IMAGE_DATA = [
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [0, 0, 0, 1, 1, 0, 0, 0],
]

// To make it interesting, we'll assign different colors
// 1 = main color (e.g. green/teal), 0 = background
const generateChannels = () => {
    const r = [], g = [], b = []
    for (let y = 0; y < 8; y++) {
        r[y] = []; g[y] = []; b[y] = []
        for (let x = 0; x < 8; x++) {
            if (IMAGE_DATA[y][x]) {
                // Alien color: Teal (R: 6, G: 214, B: 160)
                r[y][x] = 6; g[y][x] = 214; b[y][x] = 160
            } else {
                // Background: very dark blue
                r[y][x] = 5; g[y][x] = 8; b[y][x] = 21
            }
        }
    }
    return { r, g, b }
}

const CHANNELS = generateChannels()

export default function CVImagesStep() {
    const [rotX, setRotX] = useState(40)
    const [rotY, setRotY] = useState(-30)
    const [drag, setDrag] = useState(null)
    const [hoverPixel, setHoverPixel] = useState(null) // {x, y}
    const [expanded, setExpanded] = useState(false)

    const onMouseDown = (e) => setDrag({ x: e.clientX, y: e.clientY, rx: rotX, ry: rotY })
    const onMouseMove = (e) => {
        if (!drag) return
        setRotX(drag.rx - (e.clientY - drag.y) * 0.5)
        setRotY(drag.ry + (e.clientX - drag.x) * 0.5)
    }
    const onUp = () => setDrag(null)

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onUp)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onUp)
        }
    })

    const pixelSize = 24
    const offsetZ = expanded ? 80 : 20 // Distance between color channels

    return (
        <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto', paddingBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="badge badge-teal" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Computer Vision</span>
                <h2>Images as <span className="gradient-text">Tensors</span></h2>
                <p style={{ marginTop: '0.75rem', maxWidth: 700 }}>
                    In computer vision, a coloured digital image is not just a flat matrix. It is a <strong>Rank-3 Tensor</strong>.
                    It has Height, Width, and Depth (Color Channels). A standard RGB image has 3 depth slices: Red, Green, and Blue.
                </p>
            </motion.div>

            <div style={{ display: 'flex', gap: '4rem', marginTop: '3rem', flexWrap: 'wrap' }}>

                {/* 3D Visualization */}
                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <button
                            className={`btn ${expanded ? 'btn-outline' : 'btn-primary'}`}
                            onClick={() => setExpanded(false)}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                            Combined View
                        </button>
                        <button
                            className={`btn ${expanded ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setExpanded(true)}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                            Split RGB Channels
                        </button>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Drag to rotate • Hover a pixel
                    </div>

                    <div
                        onMouseDown={onMouseDown}
                        style={{
                            width: 300, height: 300,
                            perspective: 1000,
                            cursor: drag ? 'grabbing' : 'grab',
                            userSelect: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <div style={{
                            position: 'relative',
                            transformStyle: 'preserve-3d',
                            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                            width: 8 * pixelSize, height: 8 * pixelSize,
                            transition: drag ? 'none' : 'transform 0.1s linear'
                        }}>
                            {/* Blue Channel (Back) */}
                            <ChannelLayer
                                channel={CHANNELS.b} color="rgba(0,100,255,1)" name="Blue"
                                z={expanded ? -offsetZ : -2}
                                pixelSize={pixelSize} hoverPixel={hoverPixel} setHoverPixel={setHoverPixel}
                                showValues={expanded}
                            />

                            {/* Green Channel (Middle) */}
                            <ChannelLayer
                                channel={CHANNELS.g} color="rgba(0,255,100,1)" name="Green"
                                z={0}
                                pixelSize={pixelSize} hoverPixel={hoverPixel} setHoverPixel={setHoverPixel}
                                showValues={expanded}
                            />

                            {/* Red Channel (Front) */}
                            <ChannelLayer
                                channel={CHANNELS.r} color="rgba(255,50,50,1)" name="Red"
                                z={expanded ? offsetZ : 2}
                                pixelSize={pixelSize} hoverPixel={hoverPixel} setHoverPixel={setHoverPixel}
                                showValues={expanded}
                            />

                            {/* Actual Image (Only visible when not expanded, overlaid on front) */}
                            <div style={{
                                position: 'absolute',
                                width: '100%', height: '100%',
                                transform: `translateZ(${offsetZ + 10}px)`,
                                display: expanded ? 'none' : 'grid',
                                gridTemplateColumns: `repeat(8, ${pixelSize}px)`,
                                opacity: 0.9,
                                pointerEvents: 'none' // Let hover pass through to the channels
                            }}>
                                {CHANNELS.r.flat().map((_, i) => {
                                    const y = Math.floor(i / 8); const x = i % 8;
                                    const r = CHANNELS.r[y][x]; const g = CHANNELS.g[y][x]; const b = CHANNELS.b[y][x];
                                    return (
                                        <div key={i} style={{
                                            background: `rgb(${r},${g},${b})`,
                                            boxShadow: hoverPixel && hoverPixel.x === x && hoverPixel.y === y
                                                ? '0 0 10px white, inset 0 0 0 2px white' : 'inset 0 0 0 1px rgba(0,0,0,0.2)'
                                        }} />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Pixel Inspector</h3>
                        {hoverPixel ? (
                            <div>
                                <p style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                    Tensor Coordinate: <span style={{ color: 'white' }}>[c, y, x]</span>
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4d4d' }}>
                                        <span>Red Slice [0, {hoverPixel.y}, {hoverPixel.x}]:</span>
                                        <strong className="mono">{CHANNELS.r[hoverPixel.y][hoverPixel.x]}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4dff4d' }}>
                                        <span>Green Slice [1, {hoverPixel.y}, {hoverPixel.x}]:</span>
                                        <strong className="mono">{CHANNELS.g[hoverPixel.y][hoverPixel.x]}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4d4dff' }}>
                                        <span>Blue Slice [2, {hoverPixel.y}, {hoverPixel.x}]:</span>
                                        <strong className="mono">{CHANNELS.b[hoverPixel.y][hoverPixel.x]}</strong>
                                    </div>
                                </div>
                                <div style={{
                                    marginTop: '1.5rem', padding: '1rem', borderRadius: 8, textAlign: 'center',
                                    background: `rgb(${CHANNELS.r[hoverPixel.y][hoverPixel.x]}, ${CHANNELS.g[hoverPixel.y][hoverPixel.x]}, ${CHANNELS.b[hoverPixel.y][hoverPixel.x]})`,
                                    color: CHANNELS.g[hoverPixel.y][hoverPixel.x] > 128 ? 'black' : 'white',
                                    fontWeight: 'bold', textShadow: '0 0 4px rgba(0,0,0,0.5)'
                                }}>
                                    Resulting Color
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                Hover over the grid to inspect a pixel's tensor values.
                            </div>
                        )}
                    </div>

                    <div className="code-block" style={{ fontSize: '0.78rem' }}>
                        <span className="code-comment"># Loading an image as a tensor</span>{'\n'}
                        import torch{'\n'}
                        from torchvision.io import read_image{'\n\n'}
                        img_tensor = read_image(<span className="code-val">"alien.png"</span>){'\n'}
                        print(img_tensor.shape) <span className="code-comment"># torch.Size([3, 8, 8])</span>{'\n'}
                        {'\n'}
                        <span className="code-comment"># Accessing the exact red channel value of pixel (y=3, x=2)</span>{'\n'}
                        red_val = img_tensor[<span className="code-val">0</span>, <span className="code-val">3</span>, <span className="code-val">2</span>]
                    </div>
                </div>

            </div>
        </div>
    )
}

function ChannelLayer({ channel, color, name, z, pixelSize, hoverPixel, setHoverPixel, showValues }) {
    return (
        <div style={{
            position: 'absolute',
            width: '100%', height: '100%',
            transform: `translateZ(${z}px)`,
            display: 'grid',
            gridTemplateColumns: `repeat(8, ${pixelSize}px)`,
            background: 'rgba(0,0,0,0.8)',
            border: `2px solid ${color}`,
            boxShadow: `0 0 20px ${color.replace('1)', '0.2)')}`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
            {/* Label */}
            <div style={{
                position: 'absolute', top: -25, left: 0,
                color: color, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace',
                textShadow: '0 0 4px black',
                opacity: showValues ? 1 : 0, transition: 'opacity 0.3s'
            }}>
                {name} Channel (Slice)
            </div>

            {channel.flat().map((val, i) => {
                const y = Math.floor(i / 8)
                const x = i % 8
                const isHovered = hoverPixel && hoverPixel.x === x && hoverPixel.y === y

                // Map 0-255 to an opacity for visual effect in the slice
                const opacity = Math.max(0.1, val / 255)

                return (
                    <div
                        key={i}
                        onMouseEnter={() => setHoverPixel({ x, y })}
                        onMouseLeave={() => setHoverPixel(null)}
                        style={{
                            boxSizing: 'border-box',
                            border: isHovered ? `2px solid white` : `1px solid ${color.replace('1)', '0.3)')}`,
                            background: color.replace('1)', `${opacity})`),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '8px', fontFamily: 'monospace',
                            cursor: 'crosshair'
                        }}
                    >
                        {showValues && isHovered ? val : ''}
                    </div>
                )
            })}
        </div>
    )
}
