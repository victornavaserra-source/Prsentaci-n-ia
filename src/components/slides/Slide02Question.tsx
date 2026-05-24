import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Thermometer, Cpu, Sparkles } from 'lucide-react'

const LINES = [
  '¿Cómo pasa una máquina de recibir',
  'datos físicos del mundo real',
  'a tomar decisiones que parecen inteligentes?',
]
const ICONS = [
  { Icon: Thermometer, label: 'Señal física' },
  { Icon: Cpu, label: 'Procesamiento' },
  { Icon: Sparkles, label: 'Decisión' },
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
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-20 gap-16">
        <span className="ghost-num">02</span>

        <div className="relative z-10 max-w-4xl w-full flex flex-col gap-14">

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
                    {/* Blinking cursor on current line */}
                    {i === 0 && !line1.done && <span className="animate-blink">|</span>}
                    {i === 1 && line1.done && !line2.done && <span className="animate-blink">|</span>}
                    {i === 2 && line2.done && !line3.done && <span className="animate-blink">|</span>}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Icons */}
          <AnimatePresence>
            {showIcons && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="grid grid-cols-3 gap-8"
              >
                {ICONS.map(({ Icon, label }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div
                      className="glass-card-cyan flex items-center justify-center"
                      style={{ width: 56, height: 56, boxShadow: '0 0 30px rgba(0,212,255,0.2)' }}
                    >
                      <Icon size={22} color="#00d4ff" />
                    </div>
                    <span className="font-inter text-xs text-white/40 tracking-wider uppercase">{label}</span>
                  </motion.div>
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
