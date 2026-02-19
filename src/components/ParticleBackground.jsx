import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 50

function rand(min, max) { return Math.random() * (max - min) + min }

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  rand(0, W),
      y:  rand(0, H),
      r:  rand(1, 3),
      vx: rand(-0.2, 0.2),
      vy: rand(-0.2, 0.2),
      alpha: rand(0.1, 0.5),
      hue: rand(180, 280),
    }))

    // grid lines
    const gridLines = []
    for (let i = 0; i < W; i += 80) gridLines.push({ x: i, vertical: true })
    for (let i = 0; i < H; i += 80) gridLines.push({ y: i, vertical: false })

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // subtle grid
      ctx.strokeStyle = 'rgba(108,99,255,0.04)'
      ctx.lineWidth = 1
      gridLines.forEach(l => {
        ctx.beginPath()
        if (l.vertical) { ctx.moveTo(l.x, 0); ctx.lineTo(l.x, H) }
        else             { ctx.moveTo(0, l.y); ctx.lineTo(W, l.y)  }
        ctx.stroke()
      })

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
        grd.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${p.alpha})`)
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  )
}
