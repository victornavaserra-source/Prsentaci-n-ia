import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Brain, Scale } from 'lucide-react'

const FRAGMENTS = [
  {
    icon: Lock,
    accent: '#f59e0b',
    tag: '01 / PRIVACIDAD',
    title: 'Privacidad de datos',
    body: 'Los modelos requieren volúmenes masivos de información personal.',
    detail: 'Caso Cambridge Analytica: 87M de perfiles psicológicos usados sin consentimiento para influir en elecciones.',
    index: 0,
  },
  {
    icon: Brain,
    accent: '#f97316',
    tag: '02 / DEPENDENCIA',
    title: 'Dependencia cognitiva',
    body: 'Delegar sistemáticamente nuestro criterio en algoritmos pone en riesgo el pensamiento crítico.',
    detail: '¿Cuándo fue la última vez que navegaste sin GPS? El razonamiento y el diagnóstico siguen el mismo patrón.',
    index: 1,
  },
  {
    icon: Scale,
    accent: '#ef4444',
    tag: '03 / VACÍO LEGAL',
    title: 'Vacío legal y responsabilidad',
    body: 'Cuando un agente comete un error grave, ¿quién es responsable? Desarrolladores, empresas, usuarios — la línea es difusa.',
    detail: 'Los marcos legales avanzan mucho más lento que la tecnología.',
    index: 2,
  },
]

export function Slide14Ethics() {
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
        <span className="ghost-num" style={{ color: 'rgba(245,158,11,0.025)' }}>13</span>

        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(245,158,11,0.05) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 max-w-4xl w-full flex flex-col gap-7">
          <div className="flex flex-col items-center gap-3">
            <span
              className="eyebrow"
              style={{ borderColor: 'rgba(245,158,11,0.35)', color: 'rgba(245,158,11,0.8)', background: 'rgba(245,158,11,0.08)' }}
            >
              Ética y Responsabilidad
            </span>
            <h2 className="slide-title text-center" style={{ color: '#ffffff' }}>
              El poder trae{' '}
              <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                responsabilidad
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {FRAGMENTS.map(({ icon: Icon, accent, tag, title, body, detail, index }) => {
              const isActive = shown >= index
              return (
                <div key={index} className="fragment" data-fragment-index={index}>
                  <motion.div
                    animate={isActive
                      ? { opacity: 1, borderColor: `${accent}45` }
                      : { opacity: 0.75, borderColor: 'rgba(255,255,255,0.12)' }
                    }
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    style={{
                      borderRadius: 16,
                      border: '1px solid',
                      background: isActive
                        ? `linear-gradient(135deg, rgba(0,0,0,0.55) 0%, ${accent}10 100%)`
                        : 'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: isActive ? `0 0 40px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.07)` : 'none',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 20,
                    }}
                  >
                    <motion.div
                      animate={isActive
                        ? { background: `${accent}20`, boxShadow: `0 0 28px ${accent}50`, borderColor: `${accent}60` }
                        : { background: 'rgba(255,255,255,0.06)', boxShadow: 'none', borderColor: 'rgba(255,255,255,0.15)' }
                      }
                      style={{
                        flexShrink: 0, width: 56, height: 56, borderRadius: 13,
                        border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Icon size={24} color={isActive ? accent : 'rgba(255,255,255,0.45)'} />
                    </motion.div>

                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <span
                        className="font-orbitron text-[0.65rem] font-bold tracking-[0.18em]"
                        style={{ color: isActive ? accent : 'rgba(255,255,255,0.3)' }}
                      >
                        {tag}
                      </span>
                      <div
                        className="font-orbitron font-black"
                        style={{
                          fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
                          lineHeight: 1.3,
                        }}
                      >
                        {title}
                      </div>
                      <p
                        className="font-inter leading-relaxed"
                        style={{
                          fontSize: 'clamp(0.85rem, 1.5vw, 0.96rem)',
                          color: isActive ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {body}
                      </p>
                      {isActive && (
                        <p className="font-inter text-sm mt-1 leading-relaxed" style={{ color: `${accent}` }}>
                          ↳ {detail}
                        </p>
                      )}
                    </div>

                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0 }}
                      style={{
                        flexShrink: 0, width: 3, height: 50, borderRadius: 99,
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
                    style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.5rem)', color: 'rgba(255,255,255,0.95)' }}
                  >
                    "El desafío no es frenar la IA. Es{' '}
                    <span style={{
                      background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                      diseñarla con responsabilidad.
                    </span>"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <aside className="notes">
        • Privacidad: Cambridge Analytica usó 87 millones de perfiles psicológicos de Facebook, sin consentimiento, para influir en el Brexit y en las elecciones de EE.UU. de 2016.
        • Dependencia cognitiva: los estudios muestran que la navegación por GPS está atrofiando nuestra capacidad de orientación espacial. Este patrón se replica en razonamiento, escritura, diagnóstico médico.
        • Vacío legal: cuando un coche autónomo causa un accidente, ¿quién va a juicio? ¿El pasajero? ¿El fabricante? ¿El programador del algoritmo? No hay respuesta legal clara hoy.
        • El mensaje final: no se trata de frenar la IA, sino de construirla con criterios éticos desde el diseño — algo que solo pueden hacer las personas que la entienden.
      </aside>
    </section>
  )
}
