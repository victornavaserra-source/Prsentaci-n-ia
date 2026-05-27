import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const STEPS = [
  { label: 'DATOS', sub: 'Entradas de entrenamiento', color: '#00d4ff' },
  { label: 'PREDICCIÓN', sub: 'Salida del modelo', color: '#8b5cf6' },
  { label: 'ERROR', sub: 'Real vs Predicho', color: '#ef4444' },
  { label: 'AJUSTE', sub: 'Actualiza los pesos', color: '#10b981' },
]

// Smooth exponential decay with slight noise
function genLoss() {
  const pts: { epoch: number; error: number }[] = []
  for (let i = 0; i <= 60; i++) {
    const noise = (Math.random() - 0.5) * 0.035
    pts.push({ epoch: i, error: +(Math.max(0.04, 0.92 * Math.exp(-i * 0.075) + noise)).toFixed(3) })
  }
  return pts
}

const LOSS_DATA = genLoss()

interface Props { active: boolean }

// Custom tooltip
const LossTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-xs font-orbitron">
      <span style={{ color: '#00d4ff' }}>Error: {payload[0].value}</span>
    </div>
  )
}

export function Slide07MachineLearning({ active }: Props) {
  const [step, setStep] = useState(0)
  const [showChart, setShowChart] = useState(false)
  const [chartData, setChartData] = useState<typeof LOSS_DATA>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) {
      setStep(0); setShowChart(false); setChartData([])
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => setStep(s => (s + 1) % STEPS.length), 900)
    const t = setTimeout(() => {
      setShowChart(true)
      // Animate chart drawing by adding points progressively
      let i = 0
      const addPt = setInterval(() => {
        i++
        setChartData(LOSS_DATA.slice(0, i))
        if (i >= LOSS_DATA.length) clearInterval(addPt)
      }, 40)
    }, 600)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      clearTimeout(t)
    }
  }, [active])

  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-14 gap-8">
        <span className="ghost-num">07</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-7">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Machine Learning</span>
            <h2 className="slide-title gradient-text text-center">Cómo aprende una IA</h2>
          </div>

          {/* Training cycle */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-center flex-wrap gap-2">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <motion.div
                    animate={step === i
                      ? { borderColor: `${s.color}60`, background: `${s.color}12`, scale: 1.06 }
                      : { borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', scale: 1 }
                    }
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl"
                    style={{ border: '1px solid rgba(255,255,255,0.07)', minWidth: 110 }}
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

          {/* Loss chart */}
          <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-orbitron text-white/30 tracking-widest uppercase">Curva de pérdida (loss)</span>
              <span className="eyebrow text-xs">Error ↓ con cada iteración</span>
            </div>

            <AnimatePresence>
              {showChart && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ height: 140 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <XAxis
                        dataKey="epoch"
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: 'Inter' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                        tickLine={false}
                        label={{ value: 'Épocas', position: 'insideBottomRight', fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: 'Inter' }}
                      />
                      <YAxis
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: 'Inter' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                        tickLine={false}
                        domain={[0, 1]}
                        tickCount={4}
                      />
                      <Tooltip content={<LossTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="error"
                        stroke="#00d4ff"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, fill: '#00d4ff', strokeWidth: 0 }}
                        style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.6))' }}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="font-inter text-white/35 text-xs text-center">
              El modelo mejora con cada ejemplo que ve — la curva nunca llega a cero perfectamente
            </p>
          </div>
        </div>
      </div>

      <aside className="notes">
        • El entrenamiento es un ciclo: datos → predicción → medir error → ajustar pesos.
        • El "error" se llama función de pérdida (loss). Mide cuánto se equivocó el modelo.
        • El ajuste usa descenso de gradiente: avanza en la dirección que reduce el error.
        • Con millones de repeticiones, el error baja progresivamente — el modelo aprende.
        • La curva nunca llega a 0: siempre hay un mínimo error residual (overfitting vs underfitting).
      </aside>
    </section>
  )
}
