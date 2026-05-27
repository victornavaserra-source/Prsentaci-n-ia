import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Audio Card ─────────────────────────────────────── */
const SAMPLE_VALUES = [18432, -12800, 29100, -4096, 21760, -31000, 9216, 14336]

function AudioCard() {
  const [sampleIdx, setSampleIdx] = useState(0)
  const [scanX, setScanX] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setSampleIdx(i => (i + 1) % SAMPLE_VALUES.length)
      setScanX(x => (x + 1) % 100)
    }, 600)
    return () => clearInterval(id)
  }, [])

  const W = 260, H = 90
  // Draw a complex multi-frequency wave
  const pts = Array.from({ length: W + 1 }, (_, x) => {
    const t = x / W
    const y = H / 2
      + Math.sin(t * Math.PI * 4) * 22
      + Math.sin(t * Math.PI * 11) * 10
      + Math.sin(t * Math.PI * 17) * 5
    return `${x},${y.toFixed(1)}`
  }).join(' ')

  const sample = SAMPLE_VALUES[sampleIdx]
  const isPositive = sample > 0

  return (
    <div style={{
      borderRadius: 20,
      border: '1px solid rgba(0,212,255,0.2)',
      background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,212,255,0.04) 100%)',
      backdropFilter: 'blur(16px)',
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      boxShadow: '0 0 50px rgba(0,212,255,0.1)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#00d4ff',
            boxShadow: '0 0 10px #00d4ff',
            animation: 'pulse 1s infinite',
          }} />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem', color: 'rgba(0,212,255,0.8)', letterSpacing: '0.2em', fontWeight: 700 }}>
            AUDIO · ADC
          </span>
        </div>
        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>
          44,100 Hz · 16-bit
        </span>
      </div>

      {/* Oscilloscope */}
      <div style={{ position: 'relative', background: 'rgba(0,0,0,0.5)', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,212,255,0.08)' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 90, display: 'block' }}>
          {/* Grid lines */}
          {[H / 4, H / 2, 3 * H / 4].map(y => (
            <line key={y} x1={0} y1={y} x2={W} y2={y} stroke="rgba(0,212,255,0.06)" strokeWidth="1" />
          ))}
          <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="rgba(0,212,255,0.06)" strokeWidth="1" />

          {/* Glow wave */}
          <polyline points={pts} fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="5" />
          {/* Main wave */}
          <polyline points={pts} fill="none" stroke="#00d4ff" strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.9))' }} />

          {/* Scan line */}
          <line
            x1={scanX * W / 100} y1={0} x2={scanX * W / 100} y2={H}
            stroke="rgba(0,212,255,0.5)" strokeWidth="1"
            style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.8))' }}
          />
        </svg>
      </div>

      {/* Sample readout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>
            Muestra actual
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={sample}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: isPositive ? '#00d4ff' : '#ef4444',
                textShadow: `0 0 14px ${isPositive ? 'rgba(0,212,255,0.7)' : 'rgba(239,68,68,0.7)'}`,
              }}
            >
              {sample > 0 ? '+' : ''}{sample.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </div>
        <div style={{ height: 2, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${Math.abs(sample) / 32768 * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{ height: '100%', background: isPositive ? '#00d4ff' : '#ef4444', borderRadius: 99, boxShadow: `0 0 8px ${isPositive ? '#00d4ff' : '#ef4444'}` }}
          />
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
          Onda sonora → muestra → número entero
        </p>
      </div>
    </div>
  )
}

/* ── Vision Card ─────────────────────────────────────── */
const PIXEL_COLS = 7
const PIXEL_ROWS = 7
const TOTAL_PIXELS = PIXEL_COLS * PIXEL_ROWS

const PIXEL_DATA: { r: number; g: number; b: number }[] = Array.from({ length: TOTAL_PIXELS }, (_, i) => {
  // Create a gradient pattern that looks like an image
  const row = Math.floor(i / PIXEL_COLS)
  const col = i % PIXEL_COLS
  const dist = Math.sqrt((row - 3) ** 2 + (col - 3) ** 2) / 4.2
  const r = Math.round(80 + (1 - dist) * 120)
  const g = Math.round(30 + col * 22)
  const b = Math.round(180 - row * 15)
  return { r: Math.min(255, r), g: Math.min(255, g), b: Math.min(255, b) }
})

function VisionCard({ active }: { active: boolean }) {
  const [filled, setFilled] = useState(0)
  const [hoveredPixel, setHoveredPixel] = useState<number | null>(null)
  const [scanRow, setScanRow] = useState(-1)

  useEffect(() => {
    if (!active) { setFilled(0); setScanRow(-1); return }
    let idx = 0
    const timer = setInterval(() => {
      idx++
      setFilled(idx)
      setScanRow(Math.floor((idx - 1) / PIXEL_COLS))
      if (idx >= TOTAL_PIXELS) { clearInterval(timer); setScanRow(-1) }
    }, 40)
    return () => clearInterval(timer)
  }, [active])

  const featured = hoveredPixel !== null ? PIXEL_DATA[hoveredPixel] : PIXEL_DATA[24]

  return (
    <div style={{
      borderRadius: 20,
      border: '1px solid rgba(139,92,246,0.25)',
      background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(99,102,241,0.05) 100%)',
      backdropFilter: 'blur(16px)',
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      boxShadow: '0 0 50px rgba(99,102,241,0.12)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', boxShadow: '0 0 10px #8b5cf6' }} />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem', color: 'rgba(139,92,246,0.9)', letterSpacing: '0.2em', fontWeight: 700 }}>
            VISIÓN · RGB
          </span>
        </div>
        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>
          {PIXEL_COLS}×{PIXEL_ROWS} px
        </span>
      </div>

      {/* Grid + RGB readout side by side */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
        {/* Pixel grid */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PIXEL_COLS}, 20px)`, gap: 3, flexShrink: 0 }}>
          {PIXEL_DATA.map(({ r, g, b }, i) => {
            const row = Math.floor(i / PIXEL_COLS)
            const isRevealed = i < filled
            const isHovered = hoveredPixel === i
            const isScanning = row === scanRow
            return (
              <motion.div
                key={i}
                onMouseEnter={() => setHoveredPixel(i)}
                onMouseLeave={() => setHoveredPixel(null)}
                animate={{
                  opacity: isRevealed ? 1 : 0.1,
                  scale: isHovered ? 1.3 : 1,
                }}
                style={{
                  width: 20, height: 20,
                  borderRadius: 3,
                  backgroundColor: isRevealed ? `rgb(${r},${g},${b})` : 'rgba(255,255,255,0.05)',
                  boxShadow: isHovered
                    ? `0 0 12px rgba(${r},${g},${b},0.9)`
                    : isScanning
                    ? `0 0 6px rgba(${r},${g},${b},0.5)`
                    : 'none',
                  cursor: 'pointer',
                  border: isHovered ? `1px solid rgba(255,255,255,0.6)` : '1px solid transparent',
                }}
              />
            )
          })}
        </div>

        {/* RGB readout */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={hoveredPixel ?? 24}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
            >
              {[
                { ch: 'R', val: featured.r, color: '#ef4444' },
                { ch: 'G', val: featured.g, color: '#22c55e' },
                { ch: 'B', val: featured.b, color: '#3b82f6' },
              ].map(({ ch, val, color }) => (
                <div key={ch} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem', color: `${color}cc`, fontWeight: 700 }}>{ch}</span>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem', color, fontWeight: 900 }}>{val}</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      animate={{ width: `${val / 255 * 100}%` }}
                      style={{ height: '100%', borderRadius: 99, background: color, boxShadow: `0 0 6px ${color}` }}
                    />
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: 4, padding: '4px 8px', borderRadius: 6,
                background: `rgb(${featured.r},${featured.g},${featured.b})`,
                textAlign: 'center',
                fontFamily: '"JetBrains Mono", monospace', fontSize: '0.6rem',
                color: 'rgba(0,0,0,0.8)', fontWeight: 700,
              }}>
                #{featured.r.toString(16).padStart(2, '0')}{featured.g.toString(16).padStart(2, '0')}{featured.b.toString(16).padStart(2, '0')}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
        Píxeles → valores RGB (0–255) → matriz numérica
      </p>
    </div>
  )
}

/* ── Binary Card ─────────────────────────────────────── */
const DECODE_CHARS = ['H', 'O', 'L', 'A']
const DECODE_STEPS = DECODE_CHARS.map(ch => {
  const code = ch.charCodeAt(0)
  return {
    char: ch,
    decimal: code,
    binary: code.toString(2).padStart(8, '0'),
  }
})

function BinaryCard({ active }: { active: boolean }) {
  const [charIdx, setCharIdx] = useState(0)
  const [bitStep, setBitStep] = useState(0)

  useEffect(() => {
    if (!active) { setCharIdx(0); setBitStep(0); return }
    let bit = 0
    const bitTimer = setInterval(() => {
      bit++
      if (bit >= 8) {
        bit = 0
        setBitStep(0)
        setCharIdx(c => (c + 1) % DECODE_CHARS.length)
      } else {
        setBitStep(bit)
      }
    }, 160)
    return () => clearInterval(bitTimer)
  }, [active])

  const current = DECODE_STEPS[charIdx]

  return (
    <div style={{
      borderRadius: 20,
      border: '1px solid rgba(16,185,129,0.2)',
      background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(16,185,129,0.04) 100%)',
      backdropFilter: 'blur(16px)',
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      boxShadow: '0 0 50px rgba(16,185,129,0.1)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem', color: 'rgba(16,185,129,0.9)', letterSpacing: '0.2em', fontWeight: 700 }}>
            LENGUAJE · ASCII
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {DECODE_CHARS.map((_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: i === charIdx ? '#10b981' : 'rgba(255,255,255,0.12)',
              boxShadow: i === charIdx ? '0 0 8px #10b981' : 'none',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* Terminal */}
      <div style={{
        background: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        border: '1px solid rgba(16,185,129,0.15)',
        padding: '16px 18px',
        fontFamily: '"JetBrains Mono", monospace',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {/* Character */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', minWidth: 52 }}>char</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={current.char}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.4 }}
              style={{
                fontSize: '2.2rem', fontWeight: 900, color: '#ffffff',
                textShadow: '0 0 20px rgba(255,255,255,0.5)',
                lineHeight: 1,
              }}
            >
              {current.char}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Decimal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', minWidth: 52 }}>ascii</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={current.decimal}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{
                fontSize: '1.5rem', fontWeight: 900,
                color: '#f59e0b',
                textShadow: '0 0 16px rgba(245,158,11,0.7)',
                lineHeight: 1,
              }}
            >
              {current.decimal}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Binary bits revealed one by one */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', minWidth: 52 }}>binary</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {current.binary.split('').map((bit, i) => {
              const isRevealed = i <= bitStep
              return (
                <motion.span
                  key={`${charIdx}-${i}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: isRevealed ? 1 : 0.15, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    fontSize: '1.1rem', fontWeight: 900,
                    color: bit === '1' ? '#10b981' : 'rgba(255,255,255,0.35)',
                    textShadow: bit === '1' && isRevealed ? '0 0 10px rgba(16,185,129,0.8)' : 'none',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {bit}
                </motion.span>
              )
            })}
          </div>
        </div>
      </div>

      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
        Carácter → código ASCII → bits (0 y 1)
      </p>
    </div>
  )
}

/* ── Slide ───────────────────────────────────────────── */
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
              <AudioCard />
            </div>
            <div className="fragment" data-fragment-index="1">
              <VisionCard active={fragmentVisible >= 2} />
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
