import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Database, Brain } from 'lucide-react'

const FRAGMENTS = [
  {
    icon: AlertTriangle,
    color: '#ef4444',
    title: 'Los modelos cometen errores',
    body: 'Un modelo entrenado con datos sesgados reproducirá ese sesgo en sus predicciones.',
    index: 0,
  },
  {
    icon: Database,
    color: '#f97316',
    title: 'Heredan los sesgos de los datos',
    body: 'Si el dataset tiene prejuicios históricos, la IA los aprendirá y amplificará.',
    index: 1,
  },
  {
    icon: Brain,
    color: '#eab308',
    title: 'No comprenden. Reconocen patrones.',
    body: 'ChatGPT no "entiende" el lenguaje. Predice qué token viene después con estadística.',
    index: 2,
  },
]

export function Slide11Limits() {
  const [shown, setShown] = useState(-1)
  const [showFinal, setShowFinal] = useState(false)

  useEffect(() => {
    function onShown(e: Event) {
      const ce = e as CustomEvent
      const idx = ce.detail?.fragment?.dataset?.fragmentIndex
      if (idx !== undefined) {
        const n = parseInt(idx)
        setShown(n)
        if (n === 2) setTimeout(() => setShowFinal(true), 600)
      }
    }
    function onHidden(e: Event) {
      const ce = e as CustomEvent
      const idx = ce.detail?.fragment?.dataset?.fragmentIndex
      if (idx !== undefined) {
        const n = parseInt(idx)
        setShown(n - 1)
        if (n <= 2) setShowFinal(false)
      }
    }
    document.addEventListener('fragmentshown', onShown)
    document.addEventListener('fragmenthidden', onHidden)
    return () => {
      document.removeEventListener('fragmentshown', onShown)
      document.removeEventListener('fragmenthidden', onHidden)
    }
  }, [])

  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-14 gap-8">
        <span className="ghost-num" style={{ color: 'rgba(239,68,68,0.025)' }}>11</span>

        {/* Red ambient glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(239,68,68,0.04) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 max-w-4xl w-full flex flex-col gap-8">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow" style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.7)', background: 'rgba(239,68,68,0.06)' }}>
              Límites y Errores
            </span>
            <h2 className="slide-title text-center" style={{ color: '#ffffff' }}>La IA no piensa.<br />
              <span style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Predice.
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {FRAGMENTS.map(({ icon: Icon, color, title, body, index }) => (
              <div key={index} className="fragment" data-fragment-index={index}>
                <motion.div
                  animate={shown >= index ? { opacity: 1, x: 0 } : { opacity: 0.15, x: -10 }}
                  className="glass-card p-5 flex items-start gap-4"
                  style={{ borderColor: shown >= index ? `${color}25` : 'rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="flex-shrink-0 rounded-xl flex items-center justify-center"
                    style={{
                      width: 44, height: 44,
                      background: `${color}15`,
                      border: `1px solid ${color}35`,
                      boxShadow: shown >= index ? `0 0 20px ${color}30` : 'none',
                    }}
                  >
                    <Icon size={20} color={color} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="font-orbitron font-black text-sm" style={{ color: shown >= index ? color : 'rgba(255,255,255,0.3)' }}>
                      {title}
                    </div>
                    <p className="font-inter text-white/50 text-sm leading-relaxed">{body}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Final message fragment */}
          <div className="fragment" data-fragment-index={3}>
            <AnimatePresence>
              {showFinal && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  className="text-center py-4"
                >
                  <p
                    className="font-orbitron font-black leading-snug"
                    style={{
                      fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    "Entender esto es fundamental<br />
                    <span style={{
                      background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                      para usar la IA de manera responsable"
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <aside className="notes">
        • La IA comete errores — y con consecuencias reales en salud, justicia, contratación.
        • Los sesgos en los datos se amplifican: un sistema de selección de personal entrenado con datos históricos discriminará igual que en el pasado.
        • ChatGPT no "entiende" nada. Es un modelo de probabilidad sobre tokens — eso explica las alucinaciones.
        • Entender esto es fundamental: la IA es una herramienta poderosa, pero necesita supervisión humana.
      </aside>
    </section>
  )
}
