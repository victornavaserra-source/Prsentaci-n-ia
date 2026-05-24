import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GRID_CELLS = 64
const PIXEL_INTENSITIES = Array.from({ length: GRID_CELLS }, () => 0.3 + Math.random() * 0.6)

function SineWaveCard() {
  return (
    <div className="glass-card p-6 h-full flex flex-col items-center gap-5 glow-cyan" style={{ borderColor: 'rgba(0,212,255,0.15)' }}>
      <span className="eyebrow">Audio</span>
      <svg viewBox="0 0 220 80" className="w-full" style={{ height: 80 }} fill="none">
        {/* Glow layer */}
        <path
          d="M0,40 C27,8 54,72 80,40 C107,8 134,72 160,40 C187,8 214,72 240,40"
          stroke="rgba(0,212,255,0.15)" strokeWidth="6" fill="none"
        />
        {/* Main wave */}
        <path
          d="M0,40 C27,8 54,72 80,40 C107,8 134,72 160,40 C187,8 214,72 240,40"
          stroke="#00d4ff" strokeWidth="2"
          strokeDasharray="12 4"
          className="animate-sine-move"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.8))' }}
        />
        {/* Sample dots */}
        {[0, 40, 80, 120, 160, 200].map((x, i) => {
          const t = x / 220
          const y = 40 + Math.sin(t * Math.PI * 2.5) * 30
          return (
            <circle key={i} cx={x} cy={y} r="3.5"
              fill="#00d4ff"
              style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.9))' }}
            />
          )
        })}
      </svg>
      <p className="font-inter text-sm text-white/70 text-center leading-relaxed">
        Onda sonora → muestras → números
      </p>
    </div>
  )
}

function PixelGridCard({ active }: { active: boolean }) {
  const [filled, setFilled] = useState(0)
  useEffect(() => {
    if (!active) { setFilled(0); return }
    let idx = 0
    const timer = setInterval(() => { idx++; setFilled(idx); if (idx >= GRID_CELLS) clearInterval(timer) }, 22)
    return () => clearInterval(timer)
  }, [active])

  return (
    <div className="glass-card p-6 h-full flex flex-col items-center gap-5" style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
      <span className="eyebrow" style={{ borderColor: 'rgba(99,102,241,0.3)', color: 'rgba(139,92,246,0.8)', background: 'rgba(99,102,241,0.06)' }}>Visión</span>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(8, 1fr)', width: 112, height: 112 }}>
        {Array.from({ length: GRID_CELLS }).map((_, i) => (
          <div
            key={i}
            className="rounded-[2px] transition-all duration-200"
            style={{
              backgroundColor: i < filled
                ? `rgba(99,102,241,${PIXEL_INTENSITIES[i]})`
                : 'rgba(255,255,255,0.04)',
              boxShadow: i < filled ? '0 0 4px rgba(99,102,241,0.5)' : 'none',
            }}
          />
        ))}
      </div>
      <p className="font-inter text-sm text-white/70 text-center leading-relaxed">
        Píxeles → valores RGB → matriz
      </p>
    </div>
  )
}

const BINARY_STEPS = [
  { text: 'A', color: '#ffffff', size: '2.5rem', font: 'Orbitron, sans-serif' },
  { text: '65', color: '#f59e0b', size: '2.5rem', font: 'Orbitron, sans-serif' },
  { text: '01000001', color: '#00d4ff', size: '1rem', font: '"JetBrains Mono", monospace' },
]

function BinaryCard({ active }: { active: boolean }) {
  const [step, setStep] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) { setStep(0); return }
    timerRef.current = setInterval(() => setStep(s => (s + 1) % BINARY_STEPS.length), 1400)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [active])

  const s = BINARY_STEPS[step]

  return (
    <div className="glass-card p-6 h-full flex flex-col items-center gap-5" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
      <span className="eyebrow" style={{ borderColor: 'rgba(16,185,129,0.3)', color: 'rgba(52,211,153,0.8)', background: 'rgba(16,185,129,0.06)' }}>Lenguaje</span>
      <div className="flex flex-col items-center justify-center" style={{ height: 80, gap: 8 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.7, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(8px)' }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            style={{
              fontFamily: s.font, fontSize: s.size,
              color: s.color, fontWeight: 900,
              textShadow: `0 0 20px ${s.color}80`,
              letterSpacing: step === 2 ? '0.12em' : 'normal',
              lineHeight: 1,
            }}
          >
            {s.text}
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-1.5 mt-2">
          {BINARY_STEPS.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
              style={{ backgroundColor: i === step ? '#00d4ff' : 'rgba(255,255,255,0.15)' }}
            />
          ))}
        </div>
      </div>
      <p className="font-inter text-sm text-white/70 text-center leading-relaxed">
        Letra → ASCII → binario
      </p>
    </div>
  )
}

export function Slide03Digitalization() {
  const [fragmentVisible, setFragmentVisible] = useState(0)

  useEffect(() => {
    function onShown(e: Event) {
      const ce = e as CustomEvent
      const idx = ce.detail?.fragment?.dataset?.fragmentIndex
      if (idx !== undefined) setFragmentVisible(parseInt(idx) + 1)
    }
    document.addEventListener('fragmentshown', onShown)
    return () => document.removeEventListener('fragmentshown', onShown)
  }, [])

  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-14 gap-10">
        <span className="ghost-num">03</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-8">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Digitalización</span>
            <h2 className="slide-title gradient-text text-center">De la realidad al número</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="fragment" data-fragment-index="0">
              <SineWaveCard />
            </div>
            <div className="fragment" data-fragment-index="1">
              <PixelGridCard active={fragmentVisible >= 2} />
            </div>
            <div className="fragment" data-fragment-index="2">
              <BinaryCard active={fragmentVisible >= 3} />
            </div>
          </div>

          <div className="fragment text-center" data-fragment-index="3">
            <p
              className="font-orbitron font-bold text-lg"
              style={{ color: '#00d4ff', textShadow: '0 0 30px rgba(0,212,255,0.6)' }}
            >
              Los ordenadores solo entienden{' '}
              <span style={{ color: '#ffffff' }}>números</span>
            </p>
          </div>
        </div>
      </div>

      <aside className="notes">
        • El primer paso es convertir la realidad física en números que el ordenador pueda procesar.
        • Sonido: se muestrea la amplitud de la onda miles de veces por segundo.
        • Imagen: cada píxel tiene un valor RGB entre 0 y 255 — son solo números.
        • Texto: cada carácter tiene un código numérico (ASCII/Unicode) que se codifica en bits.
      </aside>
    </section>
  )
}
