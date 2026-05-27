import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Spotlight } from '@/components/ui/spotlight'

const SPAM_MAP: Record<string, number> = {
  gratis: 95, dinero: 88, premio: 82, oferta: 78, urgente: 72,
  descuento: 65, ganaste: 91, click: 60, promoción: 58, exclusivo: 50,
  trabajo: 12, reunión: 5, proyecto: 8, informe: 4, gracias: 3,
  hola: 6, adjunto: 15, propuesta: 10, agenda: 3, contrato: 18,
}

function getScore(word: string): number | null {
  const w = word.toLowerCase().trim()
  if (!w) return null
  if (SPAM_MAP[w] !== undefined) return SPAM_MAP[w]
  if (['!', '$', '%', '€', '¡'].some(c => word.includes(c))) return 68
  return 22
}

function NeuralNetSvg({ active }: { active: boolean }) {
  const layers = [[0, 1, 2], [3, 4, 5, 6, 7], [8, 9, 10, 11], [12, 13]]
  const positions: Record<number, [number, number]> = {}
  let nodeId = 0
  const W = 280, H = 200

  layers.forEach((layer, li) => {
    const x = (li / (layers.length - 1)) * (W - 40) + 20
    layer.forEach((_, ni) => {
      const y = (ni / (layer.length - 1)) * (H - 40) + 20
      positions[nodeId++] = [x, y]
    })
  })

  const connections: [number, number][] = []
  let startIdx = 0
  for (let li = 0; li < layers.length - 1; li++) {
    const layerA = layers[li]
    const layerB = layers[li + 1]
    layerA.forEach((_, ai) => {
      layerB.forEach((_, bi) => {
        if (Math.random() > 0.2) connections.push([startIdx + ai, startIdx + layerA.length + bi])
      })
    })
    startIdx += layerA.length
  }

  const [pulseNode, setPulseNode] = useState(0)
  const totalNodes = Object.keys(positions).length

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setPulseNode(n => (n + 1) % totalNodes), 180)
    return () => clearInterval(id)
  }, [active, totalNodes])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
      {connections.map(([a, b], i) => (
        <line key={i}
          x1={positions[a][0]} y1={positions[a][1]}
          x2={positions[b][0]} y2={positions[b][1]}
          stroke="rgba(0,212,255,0.12)" strokeWidth="1"
        />
      ))}
      {Object.entries(positions).map(([id, [x, y]]) => {
        const n = parseInt(id)
        const isActive = n === pulseNode || n === (pulseNode + 1) % totalNodes
        return (
          <g key={id}>
            {isActive && <circle cx={x} cy={y} r={14} fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1" className="animate-pulse-slow" />}
            <circle cx={x} cy={y} r={7}
              fill={isActive ? 'rgba(0,212,255,0.9)' : 'rgba(0,212,255,0.1)'}
              stroke={isActive ? '#00d4ff' : 'rgba(0,212,255,0.35)'}
              strokeWidth="1"
              style={{ transition: 'all 200ms', filter: isActive ? 'drop-shadow(0 0 6px rgba(0,212,255,0.9))' : 'none' }}
            />
          </g>
        )
      })}
    </svg>
  )
}

function SpamDetector() {
  const [word, setWord] = useState('')
  const score = getScore(word)
  const barColor = score === null ? '#6366f1' : score > 65 ? '#ef4444' : score > 35 ? '#f59e0b' : '#10b981'
  const label = score === null ? '' : score > 65 ? 'SPAM' : score > 35 ? 'SOSPECHOSO' : 'LEGÍTIMO'

  return (
    <div className="flex flex-col gap-3">
      <input
        value={word}
        onChange={e => setWord(e.target.value)}
        placeholder="Escribe una palabra..."
        className="w-full px-4 py-2.5 rounded-lg text-white font-inter text-sm outline-none transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.85rem',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
      />
      <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          animate={{ width: score !== null ? `${score}%` : '0%' }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="h-full rounded-full"
          style={{ background: barColor, boxShadow: `0 0 12px ${barColor}80` }}
        />
      </div>
      <div className="flex justify-between text-xs font-inter">
        <span className="text-white/35">Probabilidad de spam</span>
        <AnimatePresence mode="wait">
          {score !== null && (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="font-orbitron font-bold text-xs"
              style={{ color: barColor, textShadow: `0 0 10px ${barColor}` }}
            >
              {score}% — {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Slide06AIModels() {
  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-14 gap-7">
        <span className="ghost-num">06</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Modelos de IA</span>
            <h2 className="slide-title gradient-text text-center">¿Qué es un modelo de IA?</h2>
          </div>

          {/* Paradigm shift strip */}
          <div
            className="rounded-2xl px-5 py-4 grid grid-cols-2 gap-0 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Left: rules-based */}
            <div className="flex flex-col gap-2 pr-6">
              <div className="text-xs font-orbitron text-white/25 tracking-widest uppercase mb-1">Antes — reglas escritas</div>
              <div
                className="rounded-lg px-3 py-2 font-mono text-xs leading-relaxed"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}
              >
                <span style={{ color: '#f59e0b' }}>IF</span> correo contiene{' '}
                <span style={{ color: '#10b981' }}>"oferta"</span>{' '}
                <span style={{ color: '#f59e0b' }}>→</span>{' '}
                <span style={{ color: '#ef4444' }}>SPAM</span>
                <br />
                <span style={{ color: '#f59e0b' }}>IF</span> correo contiene{' '}
                <span style={{ color: '#10b981' }}>"gratis"</span>{' '}
                <span style={{ color: '#f59e0b' }}>→</span>{' '}
                <span style={{ color: '#ef4444' }}>SPAM</span>
                <br />
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>// ¿y "descuento exclusivo"?</span>
              </div>
              <div className="text-xs font-inter text-white/25 italic">Humanos escriben las reglas</div>
            </div>

            {/* Divider arrow */}
            <div className="absolute left-1/2 top-0 bottom-0 flex items-center justify-center" style={{ transform: 'translateX(-50%)', zIndex: 10 }}>
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={{ x: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="font-orbitron text-base font-bold"
                  style={{ color: '#8b5cf6', textShadow: '0 0 12px rgba(139,92,246,0.7)' }}
                >
                  →
                </motion.div>
                <div className="text-xs font-inter text-white/15" style={{ fontSize: '0.55rem', letterSpacing: '0.1em' }}>ML</div>
              </div>
            </div>

            {/* Right: ML */}
            <div className="flex flex-col gap-2 pl-6">
              <div className="text-xs font-orbitron tracking-widest uppercase mb-1" style={{ color: 'rgba(0,212,255,0.45)' }}>
                Después — la máquina aprende
              </div>
              <div
                className="rounded-lg px-3 py-2 text-xs leading-relaxed font-inter"
                style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)', color: 'rgba(255,255,255,0.55)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00d4ff' }} />
                  <span>1M emails etiquetados</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b5cf6' }} />
                  <span>Entrenamiento → patrones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
                  <span style={{ color: '#10b981' }}>La máquina descubre las reglas</span>
                </div>
              </div>
              <div className="text-xs font-inter text-white/25 italic">Incluye casos que nadie imaginó</div>
            </div>
          </div>

          {/* Two columns */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass-card p-5 flex flex-col gap-4">
              <div className="text-xs font-inter text-white/30 tracking-widest uppercase">Modelo científico</div>
              <div className="flex items-center justify-center py-3">
                <span style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                  color: 'rgba(255,255,255,0.85)',
                  fontStyle: 'italic',
                  textShadow: '0 0 20px rgba(255,255,255,0.15)',
                }}>
                  F = ma
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-inter text-sm text-white/70 font-semibold">Diseñado por humanos</div>
                <div className="font-inter text-xs text-white/35 leading-relaxed">
                  Reglas explícitas · Ecuaciones · Determinista
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px" style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.25), transparent)',
              transform: 'translateX(-50%)',
            }} />

            <div className="glass-card-cyan p-5 flex flex-col gap-4">
              <div className="text-xs font-inter tracking-widest uppercase" style={{ color: 'rgba(0,212,255,0.5)' }}>Modelo de IA</div>
              <NeuralNetSvg active={true} />
              <div className="flex flex-col gap-1">
                <div className="font-inter text-sm text-white/70 font-semibold">Aprendido de los datos</div>
                <div className="font-inter text-xs text-white/35 leading-relaxed">
                  Patrones implícitos · Estadística · Probabilístico
                </div>
              </div>
            </div>
          </div>

          {/* Spam detector */}
          <div className="relative bezel-outer">
            <div className="bezel-inner p-4">
              <Spotlight fill="rgba(0,212,255,0.08)" />
              <div className="relative z-10 flex flex-col gap-3">
                <div className="text-xs font-orbitron text-white/30 tracking-widest uppercase">Demo — Detector de spam</div>
                <SpamDetector />
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="notes">
        • El cambio de paradigma: antes programábamos reglas explícitas (IF...THEN). El problema: el mundo real tiene demasiadas excepciones.
        • El machine learning invierte la lógica: en vez de "humanos escriben reglas", le damos datos etiquetados y el modelo descubre las reglas solo.
        • Un modelo científico como F=ma fue diseñado explícitamente — funciona perfectamente para fenómenos físicos simples.
        • Un modelo de IA aprende de millones de ejemplos — funciona para problemas donde las reglas son demasiado complejas para escribirlas.
        • El detector de spam no tiene reglas escritas: aprendió qué palabras son sospechosas de los datos.
      </aside>
    </section>
  )
}
