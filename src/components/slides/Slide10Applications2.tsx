import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 'moving' | 'detect' | 'brake' | 'stop' | 'resume'
interface Props { active: boolean }

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
      clearAll(); setPhase('moving'); setCarX(5)
      return
    }
    const runSequence = () => {
      setPhase('moving'); setCarX(5)
      let x = 5
      animFrame.current = setInterval(() => {
        x += 0.35; setCarX(x)
        if (x >= 55) {
          clearInterval(animFrame.current!)
          setPhase('detect')
          phaseTimer.current = setTimeout(() => {
            setPhase('brake')
            let bx = x
            animFrame.current = setInterval(() => {
              bx += 0.1; setCarX(bx)
              if (bx >= 64) {
                clearInterval(animFrame.current!)
                setPhase('stop')
                phaseTimer.current = setTimeout(() => {
                  setPhase('resume')
                  let rx = bx
                  animFrame.current = setInterval(() => {
                    rx += 0.4; setCarX(rx)
                    if (rx >= 95) {
                      clearInterval(animFrame.current!)
                      phaseTimer.current = setTimeout(runSequence, 800)
                    }
                  }, 30)
                }, 2000)
              }
            }, 30)
          }, 700)
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
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-14 gap-6">
        <span className="ghost-num">10</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Aplicaciones Físicas</span>
            <h2 className="slide-title gradient-text text-center">Vehículo autónomo</h2>
          </div>

          {/* Road animation */}
          <div className="bezel-outer">
            <div className="bezel-inner" style={{ padding: '1.2rem', position: 'relative', height: 140 }}>
              <div style={{
                position: 'absolute', left: 20, right: 20, top: '50%',
                height: 48, transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8,
              }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} style={{
                    position: 'absolute', left: `${5 + i * 8}%`, top: '50%',
                    width: '4%', height: 2, transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.1)', borderRadius: 1,
                  }} />
                ))}
              </div>
              {[1, 2, 3].map(i => (
                <motion.div key={i}
                  animate={{ opacity: [0.6, 0], scale: [1, 1.5 + i * 0.4] }}
                  transition={{ duration: 1.5, delay: i * 0.35, repeat: Infinity, ease: 'easeOut' }}
                  style={{
                    position: 'absolute', left: `${carX + 2.5}%`, top: '50%',
                    width: 40, height: 40, borderRadius: '50%',
                    border: `1px solid ${radarColor}`, transform: 'translate(-50%, -50%)', pointerEvents: 'none',
                  }}
                />
              ))}
              <motion.div
                animate={{ left: `${carX}%` }}
                transition={{ duration: 0 }}
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 52, height: 28 }}
              >
                <svg viewBox="0 0 52 28" width="52" height="28">
                  <rect x="2" y="8" width="48" height="16" rx="4" fill="rgba(0,212,255,0.8)" style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.6))' }} />
                  <rect x="10" y="3" width="28" height="10" rx="3" fill="rgba(0,212,255,0.5)" />
                  <circle cx="12" cy="24" r="4" fill="rgba(255,255,255,0.6)" />
                  <circle cx="40" cy="24" r="4" fill="rgba(255,255,255,0.6)" />
                  <circle cx="49" cy="16" r="2" fill="#ffffee" style={{ filter: 'drop-shadow(0 0 4px #ffffff)' }} />
                </svg>
              </motion.div>
              <AnimatePresence>
                {showObstacle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute', left: '70%', top: '50%', transform: 'translate(-50%, -50%)',
                      width: 28, height: 36, background: phase === 'detect' ? '#ef4444' : 'rgba(239,68,68,0.7)',
                      borderRadius: 4, border: '2px solid #ef4444', boxShadow: '0 0 20px rgba(239,68,68,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: '#fff', fontSize: 18 }}>⚠</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {statusLabel && (
                  <motion.div
                    key={statusLabel} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute', top: 8, right: 20,
                      fontFamily: 'Orbitron, sans-serif', fontSize: '0.68rem', fontWeight: 900,
                      color: statusColor, letterSpacing: '0.15em', textShadow: `0 0 15px ${statusColor}`,
                    }}
                  >
                    {statusLabel}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Equations + data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* E = ½mv² */}
            <div className="glass-card p-4 flex flex-col gap-2">
              <div className="text-xs font-orbitron text-white/25 tracking-widest uppercase">Energía cinética</div>
              <div className="flex items-center justify-center py-1">
                <span style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
                  color: 'rgba(255,255,255,0.88)',
                  fontStyle: 'italic',
                  textShadow: '0 0 18px rgba(0,212,255,0.2)',
                }}>
                  E = ½ · m · v²
                </span>
              </div>
              <p className="font-inter text-xs text-white/35 text-center leading-relaxed">
                Duplicar velocidad = <span style={{ color: '#ef4444' }}>cuadruplicar impacto</span>
              </p>
            </div>

            {/* d = v²/(2a) */}
            <div className="glass-card p-4 flex flex-col gap-2">
              <div className="text-xs font-orbitron text-white/25 tracking-widest uppercase">Frenado mínimo</div>
              <div className="flex items-center justify-center py-1">
                <span style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
                  color: 'rgba(255,255,255,0.88)',
                  fontStyle: 'italic',
                  textShadow: '0 0 18px rgba(139,92,246,0.2)',
                }}>
                  d = v² / (2 · a)
                </span>
              </div>
              <p className="font-inter text-xs text-white/35 text-center leading-relaxed">
                A 120 km/h: <span style={{ color: '#00d4ff' }}>d &gt; 100 m</span> para frenar
              </p>
            </div>

            {/* 33 metros */}
            <div
              className="glass-card p-4 flex flex-col gap-2"
              style={{ borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.04)' }}
            >
              <div className="text-xs font-orbitron tracking-widest uppercase" style={{ color: 'rgba(239,68,68,0.6)' }}>
                El dato más impactante
              </div>
              <div className="flex flex-col gap-1.5 py-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                  <div className="flex-1">
                    <div className="font-orbitron text-xs text-white/60">Humano — ~1 seg</div>
                    <div className="mt-0.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: '100%', background: '#f59e0b', boxShadow: '0 0 6px rgba(245,158,11,0.5)' }} />
                    </div>
                    <div className="font-orbitron text-xs mt-0.5" style={{ color: '#ef4444' }}>
                      33 m a ciegas
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#00d4ff' }} />
                  <div className="flex-1">
                    <div className="font-orbitron text-xs text-white/60">IA — 12 ms</div>
                    <div className="mt-0.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        animate={{ width: ['4%', '4%'] }}
                        className="h-full rounded-full"
                        style={{ background: '#00d4ff', boxShadow: '0 0 6px rgba(0,212,255,0.5)' }}
                      />
                    </div>
                    <div className="font-orbitron text-xs mt-0.5" style={{ color: '#00d4ff' }}>
                      0.4 m
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="font-inter text-xs text-white/20 text-center">
            LiDAR + visión + radar · Predicción de trayectorias · 20× más rápido que el reflejo humano
          </p>
        </div>
      </div>

      <aside className="notes">
        • E = ½mv²: la energía cinética crece con el cuadrado de la velocidad. Pasar de 60 a 120 km/h no duplica el riesgo — lo cuadruplica.
        • d = v²/(2a): la distancia mínima de frenado también depende del cuadrado de la velocidad. A 120 km/h necesitas más de 100 m para frenar.
        • El dato más impactante: a 120 km/h, un humano avanza 33 metros completamente a ciegas durante el segundo que tarda en reaccionar. La IA reacciona en 12 ms — 0.4 metros.
        • El coche autónomo no solo ve más rápido — predice la trayectoria de peatones y otros vehículos con antelación, algo imposible para un humano.
      </aside>
    </section>
  )
}
