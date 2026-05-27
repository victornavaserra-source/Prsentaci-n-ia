import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const STEPS = [
  { label: 'DATOS', sub: 'Entradas de entrenamiento', color: '#00d4ff' },
  { label: 'PREDICCIÓN', sub: 'Salida del modelo', color: '#8b5cf6' },
  { label: 'ERROR', sub: 'Real vs Predicho', color: '#ef4444' },
  { label: 'AJUSTE', sub: 'Actualiza los pesos', color: '#10b981' },
]

// Pre-computed loss landscape curve points (parabola-like with ripples)
function getLandscapeY(t: number): number {
  // t: 0–1, returns normalized loss (0–1)
  const base = 0.82 * Math.exp(-t * 3.5)
  const ripple = 0.06 * Math.sin(t * 12) * Math.exp(-t * 2.5)
  return Math.max(0.04, base + ripple)
}

const N_CURVE = 120
const SVG_W = 480
const SVG_H = 160
const PAD_L = 40
const PAD_R = 20
const PAD_T = 20
const PAD_B = 30

function tToSvg(t: number): [number, number] {
  const x = PAD_L + t * (SVG_W - PAD_L - PAD_R)
  const loss = getLandscapeY(t)
  const y = PAD_T + (1 - loss) * (SVG_H - PAD_T - PAD_B)
  return [x, y]
}

const CURVE_PATH = (() => {
  const pts = Array.from({ length: N_CURVE + 1 }, (_, i) => tToSvg(i / N_CURVE))
  return 'M ' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L ')
})()

// Descent steps: t values along the curve
const DESCENT_T = [0.04, 0.1, 0.17, 0.27, 0.38, 0.5, 0.63, 0.75, 0.85, 0.93]
const DESCENT_PTS = DESCENT_T.map(t => tToSvg(t))

interface Props { active: boolean }

function GradientDescentViz({ active }: { active: boolean }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [trailPts, setTrailPts] = useState<number[]>([0])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) {
      setStepIdx(0); setTrailPts([0])
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    setStepIdx(0); setTrailPts([0])
    timerRef.current = setInterval(() => {
      setStepIdx(prev => {
        const next = prev + 1
        if (next >= DESCENT_PTS.length) {
          setTimeout(() => {
            setStepIdx(0); setTrailPts([0])
          }, 1200)
          if (timerRef.current) clearInterval(timerRef.current)
          setTimeout(() => {
            setStepIdx(0); setTrailPts([0])
            timerRef.current = setInterval(() => {
              setStepIdx(p => {
                const n = p + 1
                setTrailPts(t => [...t, n])
                if (n >= DESCENT_PTS.length - 1) {
                  if (timerRef.current) clearInterval(timerRef.current)
                  setTimeout(() => { setStepIdx(0); setTrailPts([0]) }, 1400)
                }
                return n
              })
            }, 420)
          }, 1400)
          return prev
        }
        setTrailPts(t => [...t, next])
        return next
      })
    }, 420)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [active])

  const [cx, cy] = DESCENT_PTS[stepIdx]
  const isAtValley = stepIdx >= DESCENT_PTS.length - 1
  const [vx, vy] = DESCENT_PTS[DESCENT_PTS.length - 1]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs font-orbitron text-white/25 tracking-wider uppercase">
        <span>Paisaje de pérdida (loss landscape)</span>
        <span style={{ color: isAtValley ? '#10b981' : 'rgba(255,255,255,0.2)' }}>
          {isAtValley ? '✓ Convergencia' : `Paso ${stepIdx + 1}/${DESCENT_PTS.length}`}
        </span>
      </div>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ height: SVG_H, overflow: 'visible' }}>
        <defs>
          <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="valleyGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Fill under curve */}
        <path
          d={CURVE_PATH + ` L ${SVG_W - PAD_R},${SVG_H - PAD_B} L ${PAD_L},${SVG_H - PAD_B} Z`}
          fill="rgba(139,92,246,0.06)"
        />

        {/* Curve */}
        <path d={CURVE_PATH} fill="none" stroke="url(#curveGrad)" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px rgba(139,92,246,0.5))' }} />

        {/* Valley glow */}
        <ellipse cx={vx} cy={vy} rx={30} ry={18} fill="url(#valleyGlow)" />

        {/* Valley label */}
        <text x={vx} y={vy + 22} textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="Orbitron, sans-serif" opacity="0.7">
          Error mínimo ★
        </text>

        {/* Start label */}
        <text x={DESCENT_PTS[0][0]} y={DESCENT_PTS[0][1] - 16} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7.5" fontFamily="Inter, sans-serif">
          Inicio (parámetros aleatorios)
        </text>

        {/* Axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={SVG_H - PAD_B} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1={PAD_L} y1={SVG_H - PAD_B} x2={SVG_W - PAD_R} y2={SVG_H - PAD_B} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <text x={PAD_L - 6} y={PAD_T + 4} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="Inter, sans-serif" transform={`rotate(-90, ${PAD_L - 14}, ${SVG_H / 2})`}>Pérdida (loss)</text>
        <text x={SVG_W - PAD_R} y={SVG_H - PAD_B + 14} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="Inter, sans-serif">Épocas →</text>

        {/* Trail */}
        {trailPts.slice(0, -1).map((ptIdx) => {
          const [tx, ty] = DESCENT_PTS[ptIdx]
          const [nx, ny] = DESCENT_PTS[ptIdx + 1] || DESCENT_PTS[ptIdx]
          return (
            <line key={ptIdx} x1={tx} y1={ty} x2={nx} y2={ny}
              stroke="rgba(0,212,255,0.35)" strokeWidth="1.5" strokeDasharray="3 2"
            />
          )
        })}

        {/* Gradient arrows at each trail step */}
        {trailPts.slice(0, -1).map((ptIdx) => {
          const [ax, ay] = DESCENT_PTS[ptIdx]
          const [bx, by] = DESCENT_PTS[ptIdx + 1] || DESCENT_PTS[ptIdx]
          const dx = bx - ax, dy = by - ay
          const len = Math.sqrt(dx * dx + dy * dy)
          if (len < 0.1) return null
          const mx = ax + dx * 0.55, my = ay + dy * 0.55
          const ux = dx / len, uy = dy / len
          const arrowSize = 5
          return (
            <polygon key={`arr-${ptIdx}`}
              points={`${mx + ux * arrowSize},${my + uy * arrowSize} ${mx - uy * arrowSize * 0.5 - ux * arrowSize * 0.5},${my + ux * arrowSize * 0.5 - uy * arrowSize * 0.5} ${mx + uy * arrowSize * 0.5 - ux * arrowSize * 0.5},${my - ux * arrowSize * 0.5 - uy * arrowSize * 0.5}`}
              fill="rgba(0,212,255,0.5)"
            />
          )
        })}

        {/* "Gradiente descendiente" label on first arrow */}
        {trailPts.length >= 2 && (() => {
          const [ax, ay] = DESCENT_PTS[0]
          const [bx, by] = DESCENT_PTS[1]
          return (
            <text x={(ax + bx) / 2 + 8} y={(ay + by) / 2 - 6} fill="rgba(0,212,255,0.5)" fontSize="7.5" fontFamily="Inter, sans-serif">
              ↙ Gradiente descendiente
            </text>
          )
        })()}

        {/* Current position dot */}
        <motion.circle
          cx={cx} cy={cy} r={isAtValley ? 10 : 7}
          fill={isAtValley ? 'rgba(16,185,129,0.9)' : 'rgba(0,212,255,0.9)'}
          style={{ filter: isAtValley ? 'drop-shadow(0 0 10px #10b981)' : 'drop-shadow(0 0 8px rgba(0,212,255,0.8))' }}
        />
        <motion.circle
          cx={cx} cy={cy}
          animate={{ r: [isAtValley ? 14 : 12, isAtValley ? 20 : 18], opacity: [0.4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          fill="none"
          stroke={isAtValley ? '#10b981' : '#00d4ff'}
          strokeWidth="1.5"
        />
      </svg>

      <p className="font-inter text-white/30 text-xs text-center">
        "Estás en la cima de una montaña con niebla. Das un paso donde baja la pendiente. Repites hasta el valle."
      </p>
    </div>
  )
}

export function Slide07MachineLearning({ active }: Props) {
  const [step, setStep] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) {
      setStep(0)
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => setStep(s => (s + 1) % STEPS.length), 900)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [active])

  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-14 gap-8">
        <span className="ghost-num">07</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Machine Learning</span>
            <h2 className="slide-title gradient-text text-center">Cómo aprende una IA</h2>
          </div>

          {/* Training cycle */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-center flex-wrap gap-2">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <motion.div
                    animate={step === i
                      ? { borderColor: `${s.color}60`, background: `${s.color}12`, scale: 1.06 }
                      : { borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', scale: 1 }
                    }
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl"
                    style={{ border: '1px solid rgba(255,255,255,0.07)', minWidth: 100 }}
                  >
                    <motion.div
                      animate={{ width: step === i ? 8 : 4, height: step === i ? 8 : 4 }}
                      className="rounded-full mb-1"
                      style={{ background: step === i ? s.color : 'rgba(255,255,255,0.2)', boxShadow: step === i ? `0 0 12px ${s.color}` : 'none' }}
                    />
                    <span className="font-orbitron text-xs font-black tracking-wider" style={{ color: step === i ? s.color : 'rgba(255,255,255,0.25)', transition: 'color 0.25s' }}>
                      {s.label}
                    </span>
                    <span className="text-center font-inter text-white/25" style={{ fontSize: '0.58rem' }}>{s.sub}</span>
                  </motion.div>
                  {i < STEPS.length - 1 && (
                    <motion.span
                      animate={{ opacity: step === i ? 1 : 0.15, color: step === i ? s.color : '#ffffff' }}
                      className="text-xl font-light hidden md:block"
                    >
                      →
                    </motion.span>
                  )}
                </div>
              ))}
              <div className="ml-2 text-white/20 text-xs font-inter hidden md:flex items-center gap-1">
                <span style={{ fontSize: '1rem' }}>↺</span> loop
              </div>
            </div>
          </div>

          {/* Gradient descent mountain */}
          <div className="glass-card p-5">
            <GradientDescentViz active={active} />
          </div>
        </div>
      </div>

      <aside className="notes">
        • El entrenamiento es un ciclo: datos → predicción → medir error → ajustar pesos.
        • Metáfora de la montaña: estás en la cima con niebla total. No ves nada. Solo sientes la inclinación del suelo bajo tus pies. Das un paso donde baja la pendiente. Repites millones de veces. Llegas al valle = error mínimo.
        • Eso es el descenso de gradiente: en cada paso, el modelo calcula en qué dirección debe mover sus parámetros para reducir el error.
        • El gradiente es el "suelo inclinado" — indica la dirección de mayor descenso.
        • Con millones de repeticiones, el error baja progresivamente — el modelo "aprende".
        • La curva nunca llega a 0: siempre hay un mínimo residual (underfitting vs overfitting).
      </aside>
    </section>
  )
}
