import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TIMELINE = [
  { from: 'Realidad física', to: 'datos digitales', color: '#00d4ff' },
  { from: 'Datos', to: 'patrones', color: '#33b8ff' },
  { from: 'Patrones', to: 'modelos', color: '#6366f1' },
  { from: 'Modelos', to: 'predicciones', color: '#8b5cf6' },
  { from: 'Predicciones', to: 'decisiones', color: '#a78bfa' },
]

function Confetti({ run }: { run: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!run) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const COLORS = ['#00d4ff', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ffffff']
    const particles = Array.from({ length: 120 }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: -(Math.random() * 12 + 4),
      r: Math.random() * 6 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 1,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
    }))

    let rafId: number
    const gravity = 0.35

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let allDone = true
      particles.forEach(p => {
        if (p.opacity <= 0) return
        allDone = false
        p.vy += gravity
        p.x += p.vx
        p.y += p.vy
        p.opacity -= 0.012
        p.rotation += p.rotSpeed
        ctx.save()
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6)
        ctx.restore()
      })
      if (!allDone) rafId = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    draw()
    return () => cancelAnimationFrame(rafId)
  }, [run])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }}
    />
  )
}

interface Props { active: boolean }

export function Slide12Conclusions({ active }: Props) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [showFinal, setShowFinal] = useState(false)
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    if (!active) {
      setVisibleLines(0); setShowFinal(false); setConfetti(false)
      return
    }
    let i = 0
    const t = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= TIMELINE.length) {
        clearInterval(t)
        setTimeout(() => {
          setShowFinal(true)
          setTimeout(() => setConfetti(true), 500)
        }, 700)
      }
    }, 500)
    return () => clearInterval(t)
  }, [active])

  return (
    <section>
      <Confetti run={confetti} />

      {/* Intensified particle glow for final slide */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,255,0.06) 0%, rgba(124,58,237,0.04) 50%, transparent 80%)',
      }} />

      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-10 md:px-16 gap-10">
        <span className="ghost-num">12</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-10">

          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Conclusiones</span>
            <h2 className="slide-title gradient-text text-center">El camino completo</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* Timeline */}
            <div className="flex flex-col gap-3">
              {TIMELINE.map(({ from, to, color }, i) => (
                <AnimatePresence key={i}>
                  {i < visibleLines && (
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', duration: 0.6, bounce: 0.1 }}
                      className="flex items-center gap-3"
                    >
                      {/* Dot */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          background: color,
                          boxShadow: `0 0 15px ${color}, 0 0 30px ${color}60`,
                        }}
                      />

                      {/* From */}
                      <span className="font-orbitron font-bold text-sm" style={{ color, minWidth: 120 }}>
                        {from}
                      </span>

                      {/* Arrow line */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.2, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        style={{
                          flex: 1, height: 1,
                          background: `linear-gradient(90deg, ${color}80, ${color}20)`,
                          transformOrigin: 'left',
                        }}
                      />
                      <span style={{ color, fontSize: '0.7rem', opacity: 0.6 }}>→</span>

                      {/* To */}
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="font-inter text-sm font-semibold text-white/70 text-right"
                        style={{ minWidth: 90 }}
                      >
                        {to}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>

            {/* Final message */}
            <AnimatePresence>
              {showFinal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', duration: 0.8, bounce: 0.1 }}
                  className="flex flex-col gap-6 items-center text-center"
                >
                  <div>
                    <div
                      className="font-orbitron font-black"
                      style={{
                        fontSize: 'clamp(2rem, 5vw, 4rem)',
                        background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        textShadow: 'none',
                        lineHeight: 1.1,
                      }}
                    >
                      La IA no es magia.
                    </div>
                    <div className="font-inter text-white/60 text-lg mt-3 leading-relaxed">
                      Son matemáticas, datos<br />y diseño humano.
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    {[
                      { label: 'Matemáticas', detail: 'Álgebra lineal, cálculo, probabilidad' },
                      { label: 'Datos', detail: 'Millones de ejemplos del mundo real' },
                      { label: 'Diseño humano', detail: 'Arquitecturas, objetivos, valores éticos' },
                    ].map(({ label, detail }) => (
                      <div key={label} className="glass-card px-4 py-2.5 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00d4ff' }} />
                        <div className="text-left">
                          <span className="font-orbitron text-xs font-bold text-white/80">{label}</span>
                          <span className="font-inter text-xs text-white/35 ml-2">{detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <motion.p
                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="font-orbitron text-white/25 tracking-[0.2em] uppercase text-xs"
                  >
                    Gracias · Preguntas
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <aside className="notes">
        • Hemos recorrido el camino completo: señal física → datos → patrones → modelo → decisión.
        • La IA no es inteligencia en el sentido humano — es optimización estadística a gran escala.
        • Todo lo que hace la IA puede explicarse con física y matemáticas que habéis estudiado.
        • La responsabilidad de diseñarla bien es nuestra — los sesgos, los errores, los valores éticos.
      </aside>
    </section>
  )
}
