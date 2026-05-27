import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Database, Brain } from 'lucide-react'

const FRAGMENTS = [
  {
    icon: AlertTriangle,
    accent: '#ef4444',
    tag: '01 / ERROR',
    title: 'Los modelos cometen errores',
    body: 'Un modelo entrenado con datos sesgados reproducirá ese sesgo en sus predicciones.',
    index: 0,
  },
  {
    icon: Database,
    accent: '#f97316',
    tag: '02 / SESGO',
    title: 'Heredan los sesgos de los datos',
    body: 'Si el dataset tiene prejuicios históricos, la IA los aprendirá y amplificará.',
    index: 1,
  },
  {
    icon: Brain,
    accent: '#eab308',
    tag: '03 / ILUSIÓN',
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

        {/* Red ambient */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(239,68,68,0.07) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 max-w-4xl w-full flex flex-col gap-7">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow" style={{ borderColor: 'rgba(239,68,68,0.35)', color: 'rgba(239,68,68,0.8)', background: 'rgba(239,68,68,0.08)' }}>
              Límites y Errores
            </span>
            <h2 className="slide-title text-center" style={{ color: '#ffffff' }}>
              La IA no piensa.<br />
              <span style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Predice.
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {FRAGMENTS.map(({ icon: Icon, accent, tag, title, body, index }) => {
              const isActive = shown >= index
              return (
                <div key={index} className="fragment" data-fragment-index={index}>
                  <motion.div
                    animate={isActive
                      ? { opacity: 1, x: 0, borderColor: `${accent}35` }
                      : { opacity: 0.55, x: 0, borderColor: 'rgba(255,255,255,0.08)' }
                    }
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    style={{
                      borderRadius: 16,
                      border: '1px solid',
                      background: isActive
                        ? `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${accent}08 100%)`
                        : 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: isActive ? `0 0 40px ${accent}18, inset 0 1px 0 rgba(255,255,255,0.06)` : 'none',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                    }}
                  >
                    {/* Icon block */}
                    <motion.div
                      animate={isActive
                        ? { background: `${accent}18`, boxShadow: `0 0 28px ${accent}40`, borderColor: `${accent}50` }
                        : { background: 'rgba(255,255,255,0.04)', boxShadow: 'none', borderColor: 'rgba(255,255,255,0.1)' }
                      }
                      style={{
                        flexShrink: 0, width: 56, height: 56, borderRadius: 14,
                        border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Icon size={24} color={isActive ? accent : 'rgba(255,255,255,0.3)'} />
                    </motion.div>

                    {/* Text */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span
                          className="font-orbitron text-[0.6rem] font-bold tracking-[0.18em]"
                          style={{ color: isActive ? `${accent}90` : 'rgba(255,255,255,0.2)' }}
                        >
                          {tag}
                        </span>
                      </div>
                      <div
                        className="font-orbitron font-black"
                        style={{
                          fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                          lineHeight: 1.3,
                        }}
                      >
                        {title}
                      </div>
                      <p
                        className="font-inter leading-relaxed"
                        style={{
                          fontSize: 'clamp(0.8rem, 1.4vw, 0.92rem)',
                          color: isActive ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {body}
                      </p>
                    </div>

                    {/* Active indicator bar */}
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0 }}
                      style={{
                        flexShrink: 0, width: 3, height: 48, borderRadius: 99,
                        background: `linear-gradient(to bottom, ${accent}, ${accent}40)`,
                        boxShadow: `0 0 12px ${accent}`,
                        transformOrigin: 'top',
                      }}
                    />
                  </motion.div>
                </div>
              )
            })}
          </div>

          {/* Final message */}
          <div className="fragment" data-fragment-index={3}>
            <AnimatePresence>
              {showFinal && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  className="text-center py-2"
                >
                  <p
                    className="font-orbitron font-black leading-snug"
                    style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.4rem)', color: 'rgba(255,255,255,0.95)' }}
                  >
                    "Entender esto es fundamental para{' '}
                    <span style={{
                      background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                      usar la IA de manera responsable"
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
