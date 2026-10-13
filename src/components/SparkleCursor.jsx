import { useEffect, useRef } from 'react'

const COLORS = ['#FFB65E', '#FFD66B', '#FA8D85', '#B9A4FF', '#FFF4C2']
const MAX_PARTICLES = 90
const SPAWN_DISTANCE = 7

// Draws a small four-point sparkle centered at (0, 0).
const drawSparkle = (ctx, size) => {
  const inner = size * 0.28
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.quadraticCurveTo(inner, -inner, size, 0)
  ctx.quadraticCurveTo(inner, inner, 0, size)
  ctx.quadraticCurveTo(-inner, inner, -size, 0)
  ctx.quadraticCurveTo(-inner, -inner, 0, -size)
  ctx.fill()
}

const SparkleCursor = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reducedMotion.matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const particles = []
    let frame = 0
    let last = null

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = (x, y) => {
      if (particles.length >= MAX_PARTICLES) particles.shift()
      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.5 + 0.2,
        size: Math.random() * 3.5 + 2.5,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.08,
        life: 1,
        decay: Math.random() * 0.015 + 0.018,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    }

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i]
        p.life -= p.decay
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.spin
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        drawSparkle(ctx, p.size * (0.4 + p.life * 0.6))
        ctx.restore()
      }
      frame = particles.length ? window.requestAnimationFrame(tick) : 0
    }

    const handleMove = (event) => {
      if (event.pointerType !== 'mouse') return
      if (document.documentElement.dataset.cursor === 'plain') {
        last = null
        return
      }
      // Trail from the middle of the star cursor rather than its tip.
      const x = event.clientX
      const y = event.clientY + 14
      if (!last) last = { x, y }
      const distance = Math.hypot(x - last.x, y - last.y)
      if (distance < SPAWN_DISTANCE) return
      const steps = Math.min(Math.floor(distance / SPAWN_DISTANCE), 4)
      for (let i = 1; i <= steps; i += 1) {
        spawn(last.x + ((x - last.x) * i) / steps, last.y + ((y - last.y) * i) / steps)
      }
      last = { x, y }
      if (!frame) frame = window.requestAnimationFrame(tick)
    }

    const handleLeave = () => { last = null }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handleMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', handleLeave)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handleMove)
      document.documentElement.removeEventListener('pointerleave', handleLeave)
    }
  }, [])

  return <canvas className="sparkle-cursor" ref={canvasRef} aria-hidden="true" />
}

export default SparkleCursor
