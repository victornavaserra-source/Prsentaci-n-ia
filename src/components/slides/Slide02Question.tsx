import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Thermometer, Cpu, Sparkles } from 'lucide-react'

const LINES = [
  '¿Cómo pasa una máquina de recibir',
  'datos físicos del mundo real',
  'a tomar decisiones que parecen inteligentes?',
]

const PIPELINE = [
  {
    Icon: Thermometer,
    label: 'Señal Física',
    desc: 'Temperatura · Luz · Sonido · Presión',
    color: '#00d4ff',
    tag: '01',
  },
  {
    Icon: Cpu,
    label: 'Procesamiento',
    desc: 'Digitalización · Modelo · Cálculo',
    color: '#8b5cf6',
    tag: '02',
  },
  {
    Icon: Sparkles,
    label: 'Decisión',
    desc: 'Predicción · Clasificación · Acción',
    color: '#10b981',
    tag: '03',
  },
]

function useTypewriter(text: string, active: boolean, delay: number) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) { setDisplayed(''); setDone(false); return }
    let i = 0
    const start = () => {
      timerRef.current = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          if (timerRef.current) clearInterval(timerRef.current)
          setDone(true)
        }
      }, 38)
    }
    const t = setTimeout(start, delay)
    return () => { clearTimeout(t); if (timerRef.current) clearInterval(timerRef.current) }
  }, [active, text, delay])

  return { displayed, done }
}

interface Props { active: boolean }

export function Slide02Question({ active }: Props) {
  const line1 = useTypewriter(LINES[0], active, 300)
  const line2 = useTypewriter(LINES[1], active && line1.done, 200)
  const line3 = useTypewriter(LINES[2], active && line2.done, 200)
  const showIcons = active && line3.done

  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-20 gap-14">
        <span className="ghost-num">02</span>

        <div className="relative z-10 max-w-4xl w-full flex flex-col gap-12">

          <div className="flex justify-center">
            <span className="eyebrow">La pregunta central</span>
          </div>

          {/* Typewriter question */}
          <div className="flex flex-col gap-2 text-center min-h-[9rem]">
            {[line1, line2, line3].map(({ displayed }, i) => (
              <div key={i} style={{ minHeight: '2.5rem' }}>
                {displayed && (
                  <span
                    className="font-orbitron font-black"
                    style={{
                      fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)',
                      lineHeight: 1.25,
                      color: i === 2 ? 'rgba(255,255,255,0.4)' : i === 1 ? '#00d4ff' : '#ffffff',
                      textShadow: i === 1 ? '0 0 30px rgba(0,212,255,0.5)' : 'none',
                    }}
                  >
                    {displayed}
                    {i === 0 && !line1.done && <span className="animate-blink">|</span>}
                    {i === 1 && line1.done && !line2.done && <span className="animate-blink">|</span>}
                    {i === 2 && line2.done && !line3.done && <span className="animate-blink">|</span>}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Pipeline cards */}
          <AnimatePresence>
            {showIcons && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}
              >
                {PIPELINE.map(({ Icon, label, desc, color, tag }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    {/* Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.18, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                      style={{
                        flex: 1,
                        borderRadius: 18,
                        border: `1px solid ${color}30`,
                        background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${color}08 100%)`,
                        backdropFilter: 'blur(16px)',
                        boxShadow: `0 0 40px ${color}15, inset 0 1px 0 rgba(255,255,255,0.06)`,
                        padding: '22px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 14,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Step number */}
                      <div style={{
                        position: 'absolute', top: 12, right: 14,
                        fontFamily: 'Orbitron, sans-serif',
                        fontSize: '0.55rem', fontWeight: 700,
                        color: `${color}50`,
                        letterSpacing: '0.15em',
                      }}>
                        {tag}
                      </div>

                      {/* Corner accent */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0,
                        width: 40, height: 40,
                        background: `radial-gradient(circle at 0% 0%, ${color}20, transparent 70%)`,
                        borderRadius: '18px 0 0 0',
                      }} />

                      {/* Icon */}
                      <div style={{
                        width: 64, height: 64,
                        borderRadius: 18,
                        border: `1px solid ${color}40`,
                        background: `${color}12`,
                        boxShadow: `0 0 30px ${color}25, inset 0 1px 0 ${color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={26} color={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
                      </div>

                      {/* Label */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          fontFamily: 'Orbitron, sans-serif',
                          fontSize: 'clamp(0.75rem, 1.4vw, 0.95rem)',
                          fontWeight: 900,
                          color: '#ffffff',
                          letterSpacing: '0.04em',
                          textAlign: 'center',
                        }}>
                          {label}
                        </span>
                        <span style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.68rem',
                          color: 'rgba(255,255,255,0.4)',
                          textAlign: 'center',
                          lineHeight: 1.5,
                        }}>
                          {desc}
                        </span>
                      </div>

                      {/* Bottom glow line */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: '20%', right: '20%',
                        height: 1,
                        background: `linear-gradient(to right, transparent, ${color}60, transparent)`,
                      }} />
                    </motion.div>

                    {/* Arrow connector */}
                    {i < PIPELINE.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: i * 0.18 + 0.3, duration: 0.4 }}
                        style={{
                          flexShrink: 0, width: 32, display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: 4,
                        }}
                      >
                        <div style={{
                          width: '100%', height: 1,
                          background: `linear-gradient(to right, ${PIPELINE[i].color}40, ${PIPELINE[i + 1].color}40)`,
                        }} />
                        <div style={{
                          width: 0, height: 0,
                          borderLeft: `6px solid ${PIPELINE[i].color}60`,
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent',
                          marginLeft: 6,
                        }} />
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <aside className="notes">
        • Esta es la pregunta que guía todo el proyecto: el puente entre física e IA.
        • Los datos físicos son señales del mundo real: temperatura, luz, sonido, presión.
        • La IA los convierte en números, los procesa con matemáticas, y devuelve una decisión.
        • Veremos cada paso de esta transformación en las siguientes diapositivas.
      </aside>
    </section>
  )
}
