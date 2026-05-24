import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'

type Phase = 'moving' | 'detect' | 'brake' | 'stop' | 'resume'

interface Props { active: boolean }

const REACTION_DATA = [
  { label: 'Humano', ms: 250, color: '#f59e0b' },
  { label: 'IA', ms: 12, color: '#00d4ff' },
]

export function Slide10Applications2({ active }: Props) {
  const [phase, setPhase] = useState<Phase>('moving')
  const [carX, setCarX] = useState(5)
  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animFrame = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearAll = () => {
    if (phaseTimer.current) clearTimeout(phaseTimer.current)
    if (animFrame.current) clearInterval(animFrame.current)
  }

  useEffect(() => {
    if (!active) {
      clearAll()
      setPhase('moving')
      setCarX(5)
      return
    }

    const runSequence = () => {
      setPhase('moving')
      setCarX(5)

      // Move car from 5% to 55%
      let x = 5
      animFrame.current = setInterval(() => {
        x += 0.35
        setCarX(x)
        if (x >= 55) {
          clearInterval(animFrame.current!)
          setPhase('detect')
          phaseTimer.current = setTimeout(() => {
            setPhase('brake')
            // Slow the car
            let bx = x
            animFrame.current = setInterval(() => {
              bx += 0.12
              setCarX(bx)
              if (bx >= 65) {
                clearInterval(animFrame.current!)
                setPhase('stop')
                phaseTimer.current = setTimeout(() => {
                  setPhase('resume')
                  let rx = bx
                  animFrame.current = setInterval(() => {
                    rx += 0.4
                    setCarX(rx)
                    if (rx >= 95) {
                      clearInterval(animFrame.current!)
                      phaseTimer.current = setTimeout(runSequence, 800)
                    }
                  }, 30)
                }, 2000)
              }
            }, 30)
          }, 800)
        }
      }, 25)
    }

    runSequence()
    return clearAll
  }, [active])

  const showObstacle = phase !== 'resume'
  const radarColor = phase === 'detect' || phase === 'brake' ? '#ef4444' : '#00d4ff'
  const statusLabel = phase === 'moving' ? null : phase === 'detect' ? 'DETECTADO' : phase === 'brake' ? 'FRENANDO' : phase === 'stop' ? 'DETENIDO' : null
  const statusColor = phase === 'detect' ? '#ef4444' : phase === 'brake' ? '#f59e0b' : phase === 'stop' ? '#10b981' : '#00d4ff'

  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-14 gap-8">
        <span className="ghost-num">10</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-7">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Aplicaciones Reales</span>
            <h2 className="slide-title gradient-text text-center">Vehículo autónomo</h2>
          </div>

          {/* Road animation */}
          <div className="bezel-outer">
            <div className="bezel-inner" style={{ padding: '1.5rem', position: 'relative', height: 160 }}>
              {/* Road */}
              <div style={{
                position: 'absolute', left: 24, right: 24, top: '50%',
                height: 50, transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8,
              }}>
                {/* Road markings */}
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} style={{
                    position: 'absolute', left: `${5 + i * 8}%`, top: '50%',
                    width: '4%', height: 2, transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.12)', borderRadius: 1,
                  }} />
                ))}
              </div>

              {/* Radar arcs */}
              {[1, 2, 3].map(i => (
                <motion.div key={i}
                  animate={{
                    opacity: [0.6, 0],
                    scale: [1, 1.5 + i * 0.4],
                  }}
                  transition={{ duration: 1.5, delay: i * 0.35, repeat: Infinity, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    left: `${carX + 2.5}%`,
                    top: '50%',
                    width: 40, height: 40,
                    borderRadius: '50%',
                    border: `1px solid ${radarColor}`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                  }}
                />
              ))}

              {/* Car */}
              <motion.div
                animate={{ left: `${carX}%` }}
                transition={{ duration: 0 }}
                style={{
                  position: 'absolute', top: '50%',
                  transform: 'translateY(-50%)',
                  width: 52, height: 28,
                }}
              >
                <svg viewBox="0 0 52 28" width="52" height="28">
                  <rect x="2" y="8" width="48" height="16" rx="4" fill="rgba(0,212,255,0.8)"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.6))' }} />
                  <rect x="10" y="3" width="28" height="10" rx="3" fill="rgba(0,212,255,0.5)" />
                  <circle cx="12" cy="24" r="4" fill="rgba(255,255,255,0.6)" />
                  <circle cx="40" cy="24" r="4" fill="rgba(255,255,255,0.6)" />
                  {/* Headlight */}
                  <circle cx="49" cy="16" r="2" fill="#ffffee" style={{ filter: 'drop-shadow(0 0 4px #ffffff)' }} />
                </svg>
              </motion.div>

              {/* Obstacle */}
              <AnimatePresence>
                {showObstacle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute', left: '70%', top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 28, height: 36,
                      background: phase === 'detect' ? '#ef4444' : 'rgba(239,68,68,0.7)',
                      borderRadius: 4,
                      border: '2px solid #ef4444',
                      boxShadow: '0 0 20px rgba(239,68,68,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: '#fff', fontSize: 18 }}>⚠</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status label */}
              <AnimatePresence>
                {statusLabel && (
                  <motion.div
                    key={statusLabel}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute', top: 8, right: 24,
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '0.7rem', fontWeight: 900,
                      color: statusColor,
                      letterSpacing: '0.15em',
                      textShadow: `0 0 15px ${statusColor}`,
                    }}
                  >
                    {statusLabel}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom: reaction time comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <div className="glass-card p-5 flex flex-col gap-3">
              <div className="text-xs font-orbitron text-white/30 tracking-widest uppercase">Tiempo de reacción</div>
              <div style={{ height: 90 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REACTION_DATA} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 300]} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="label" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'Inter' }} tickLine={false} axisLine={false} />
                    <Tooltip content={({ active, payload }) =>
                      active && payload?.length
                        ? <div className="glass-card px-2 py-1 text-xs font-orbitron" style={{ color: (payload[0].payload as typeof REACTION_DATA[0]).color }}>{payload[0].value} ms</div>
                        : null
                    } />
                    <Bar dataKey="ms" radius={[0, 3, 3, 0]}>
                      {REACTION_DATA.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-5 flex flex-col gap-3">
              <div className="font-orbitron font-black text-4xl" style={{ color: '#00d4ff', textShadow: '0 0 30px rgba(0,212,255,0.5)' }}>12 ms</div>
              <p className="font-inter text-white/50 text-sm leading-relaxed">
                La IA detecta y responde 20× más rápido que un humano.
              </p>
              <p className="font-inter text-white/30 text-xs">
                No se cansa · No se distrae · No tiene lag de percepción
              </p>
            </div>
          </div>

          <p className="font-inter text-xs text-white/25 text-center">
            La IA predice colisiones antes de que ocurran usando sensores LiDAR + visión + radar
          </p>
        </div>
      </div>

      <aside className="notes">
        • Un coche autónomo procesa datos de cámaras, LiDAR y radar en milisegundos.
        • La IA predice si habrá colisión y actúa ANTES de que el humano pudiera reaccionar.
        • El tiempo de reacción humano es 250ms; el de la IA, 12ms — 20 veces más rápido.
        • El vehículo no solo detecta obstáculos: también predice la trayectoria de peatones y otros coches.
      </aside>
    </section>
  )
}
