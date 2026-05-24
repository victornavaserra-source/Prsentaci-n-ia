import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props { active: boolean }

export function Slide04Sampling({ active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const phaseRef = useRef(0)
  const scanRef = useRef(0)
  const [showSamples, setShowSamples] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) {
      setShowSamples(false)
      setCount(0)
      phaseRef.current = 0
      scanRef.current = 0
      return
    }
    const t1 = setTimeout(() => setShowSamples(true), 600)
    // Count up to 44100
    let n = 0
    const t2 = setInterval(() => {
      n += 1100
      setCount(Math.min(n, 44100))
      if (n >= 44100) clearInterval(t2)
    }, 60)
    return () => { clearTimeout(t1); clearInterval(t2) }
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    setSize()

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      const midY = H / 2
      const halfW = W * 0.45
      const gap = W * 0.1

      ctx.clearRect(0, 0, W, H)

      // === LEFT: Analog wave ===
      const wave = (x: number, phase: number) =>
        midY + Math.sin((x / halfW) * Math.PI * 3 + phase) * (H * 0.35)

      // Glow
      ctx.save()
      ctx.shadowColor = 'rgba(0,212,255,0.5)'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.strokeStyle = '#00d4ff'
      ctx.lineWidth = 2
      for (let x = 0; x <= halfW; x++) {
        const y = wave(x, phaseRef.current)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.restore()

      // Scanning line on left
      if (showSamples) {
        const scanX = (scanRef.current % 1) * halfW
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 4])
        ctx.moveTo(scanX, 0)
        ctx.lineTo(scanX, H)
        ctx.stroke()
        ctx.setLineDash([])

        // Sample point at scan
        const sy = wave(scanX, phaseRef.current)
        ctx.beginPath()
        ctx.fillStyle = '#ffffff'
        ctx.arc(scanX, sy, 4, 0, Math.PI * 2)
        ctx.fill()

        // Arrow to right half
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0,212,255,0.4)'
        ctx.lineWidth = 1
        ctx.moveTo(halfW + 8, midY)
        ctx.lineTo(halfW + gap - 8, midY)
        ctx.stroke()
      }

      // === RIGHT: Digital discrete bars ===
      const numSamples = 14
      const rightX = halfW + gap
      const rightW = W - rightX

      for (let i = 0; i <= numSamples; i++) {
        const sampleX = (i / numSamples) * halfW
        const sampleY = wave(sampleX, phaseRef.current)
        const barH = midY - sampleY
        const barX = rightX + (i / numSamples) * (rightW - 4)

        const alpha = showSamples ? 1 : 0

        // Bar
        ctx.fillStyle = `rgba(0,212,255,${alpha * 0.2})`
        ctx.fillRect(barX - 3, Math.min(midY, sampleY), 6, Math.abs(barH))

        // Top dot
        ctx.beginPath()
        ctx.fillStyle = `rgba(0,212,255,${alpha})`
        ctx.arc(barX, sampleY, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Baseline
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      ctx.moveTo(0, midY)
      ctx.lineTo(W, midY)
      ctx.stroke()

      phaseRef.current += 0.018
      if (showSamples) scanRef.current += 0.006

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [showSamples])

  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-16 gap-10">
        <span className="ghost-num">04</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-8 items-center">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Muestreo</span>
            <h2 className="slide-title gradient-text text-center">El proceso de muestreo</h2>
          </div>

          {/* Labels */}
          <div className="w-full flex gap-4 text-xs font-inter">
            <div className="flex-1 text-center text-white/40 tracking-widest uppercase">Señal analógica</div>
            <div style={{ width: '10%' }} />
            <div className="flex-1 text-center" style={{ color: 'rgba(0,212,255,0.6)' }}>Señal digital</div>
          </div>

          {/* Canvas */}
          <div className="bezel-outer w-full">
            <div className="bezel-inner w-full" style={{ padding: '1.5rem' }}>
              <canvas ref={canvasRef} className="w-full" style={{ height: 200 }} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 w-full">
            {[
              { value: showSamples ? `${count.toLocaleString()}` : '0', unit: 'Hz', label: 'CD Audio' },
              { value: '8.3M', unit: 'px', label: 'Imagen 4K' },
              { value: '1M', unit: 'pts/s', label: 'Radar LiDAR' },
            ].map(({ value, unit, label }) => (
              <div key={label} className="glass-card p-4 flex flex-col items-center gap-1">
                <div className="font-orbitron font-black" style={{ color: '#00d4ff', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', textShadow: '0 0 20px rgba(0,212,255,0.5)' }}>
                  {value} <span style={{ fontSize: '0.55em', color: 'rgba(0,212,255,0.6)' }}>{unit}</span>
                </div>
                <div className="text-white/35 text-xs font-inter tracking-wider uppercase">{label}</div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {showSamples && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-inter text-white/45 text-sm text-center"
              >
                Teorema de Nyquist: muestrear al menos{' '}
                <span style={{ color: '#00d4ff' }}>el doble</span> de la frecuencia máxima
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <aside className="notes">
        • El muestreo convierte una señal continua (analógica) en valores discretos (digitales).
        • El Teorema de Nyquist: hay que muestrear al menos el doble de la frecuencia máxima.
        • Un CD usa 44.100 muestras por segundo, suficiente para el oído humano (hasta 20kHz).
        • La línea que barre de izquierda a derecha captura el valor de la onda en cada instante.
      </aside>
    </section>
  )
}
