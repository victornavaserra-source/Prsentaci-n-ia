import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function ThermalPanel() {
  const [temp, setTemp] = useState(18)
  const [predicted, setPredicted] = useState(24)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPredicted(prev => {
        const target = temp + 3 + Math.random() * 4
        return +(target).toFixed(1)
      })
    }, 2200)
    return () => clearInterval(interval)
  }, [temp])

  const m = 1200
  const c = 1.005
  const deltaT = +(predicted - temp).toFixed(1)
  const Q = Math.round(m * c * deltaT)
  const barW = Math.min(100, (temp / 40) * 100)
  const predW = Math.min(100, (predicted / 40) * 100)

  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full">
      <span
        className="eyebrow mx-auto"
        style={{ borderColor: 'rgba(0,212,255,0.3)', color: 'rgba(0,212,255,0.8)', background: 'rgba(0,212,255,0.06)' }}
      >
        Panel A — Climatización
      </span>

      <div className="flex flex-col items-center gap-1.5">
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            color: 'rgba(255,255,255,0.92)',
            fontStyle: 'italic',
            textShadow: '0 0 24px rgba(0,212,255,0.25)',
            letterSpacing: '-0.01em',
          }}
        >
          Q = m · c · ΔT
        </span>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-xs font-inter text-white/30 mt-0.5">
          <span><em style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.55)' }}>Q</em> = calor (kJ)</span>
          <span><em style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.55)' }}>m</em> = masa (kg)</span>
          <span><em style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.55)' }}>c</em> = calor específico</span>
          <span><em style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.55)' }}>ΔT</em> = variación temp.</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between text-xs font-inter text-white/40">
          <span>T. actual: <span style={{ color: '#00d4ff' }}>{temp}°C</span></span>
          <span>IA predice: <span style={{ color: '#8b5cf6' }}>{predicted}°C</span></span>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div
            animate={{ width: `${barW}%` }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="absolute h-full rounded-full"
            style={{ background: 'rgba(0,212,255,0.5)', left: 0 }}
          />
          <motion.div
            animate={{ left: `${predW}%` }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-0 w-1 h-full rounded-full"
            style={{ background: '#8b5cf6', boxShadow: '0 0 8px rgba(139,92,246,0.9)', transform: 'translateX(-50%)' }}
          />
        </div>
        <input
          type="range" min={10} max={35} value={temp}
          onChange={e => setTemp(+e.target.value)}
          className="w-full"
        />
      </div>

      <div
        className="rounded-xl px-4 py-2.5 flex items-center justify-between"
        style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}
      >
        <span className="font-inter text-xs text-white/35">Calor a anticipar:</span>
        <span
          className="font-orbitron font-black text-sm"
          style={{ color: '#00d4ff', textShadow: '0 0 12px rgba(0,212,255,0.5)' }}
        >
          {Q.toLocaleString()} kJ
        </span>
      </div>

      <p className="font-inter text-xs text-white/25 text-center leading-relaxed">
        La IA predice ΔT cruzando datos meteorológicos y calcula Q con antelación para evitar picos de consumo
      </p>
    </div>
  )
}

function JoulePanel() {
  const [intensity, setIntensity] = useState(85)
  const [optimizedI, setOptimizedI] = useState(85)
  const [optimizing, setOptimizing] = useState(false)
  const [done, setDone] = useState(false)

  const R = 0.5
  const t = 3600
  const E_raw = Math.round((intensity ** 2) * R * t / 1000)
  const E_opt = Math.round((optimizedI ** 2) * R * t / 1000)
  const savings = intensity !== optimizedI ? Math.round(((E_raw - E_opt) / E_raw) * 100) : 0

  useEffect(() => {
    setOptimizedI(intensity)
    setDone(false)
    setOptimizing(false)
  }, [intensity])

  function handleOptimize() {
    if (optimizing || done) return
    setOptimizing(true)
    const target = Math.round(intensity * 0.63)
    let cur = intensity
    const step = setInterval(() => {
      cur = cur - (cur - target) * 0.12
      setOptimizedI(Math.round(cur))
      if (Math.abs(cur - target) < 1) {
        clearInterval(step)
        setOptimizedI(target)
        setOptimizing(false)
        setDone(true)
      }
    }, 40)
  }

  const maxE = Math.round((150 ** 2) * R * t / 1000)

  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
      <span
        className="eyebrow mx-auto"
        style={{ borderColor: 'rgba(139,92,246,0.3)', color: 'rgba(167,139,250,0.8)', background: 'rgba(139,92,246,0.06)' }}
      >
        Panel B — Red Eléctrica
      </span>

      <div className="flex flex-col items-center gap-1.5">
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            color: 'rgba(255,255,255,0.92)',
            fontStyle: 'italic',
            textShadow: '0 0 24px rgba(139,92,246,0.25)',
            letterSpacing: '-0.01em',
          }}
        >
          E = I² · R · t
        </span>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-xs font-inter text-white/30 mt-0.5">
          <span><em style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.55)' }}>E</em> = energía disipada</span>
          <span><em style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.55)' }}>I</em> = intensidad (A)</span>
          <span><em style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.55)' }}>R</em> = resistencia (Ω)</span>
          <span><em style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.55)' }}>t</em> = tiempo (s)</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between text-xs font-inter text-white/40">
          <span>Intensidad: <span style={{ color: '#8b5cf6' }}>{intensity} A</span></span>
          {done && (
            <span>IA → <span style={{ color: '#10b981' }}>{optimizedI} A</span></span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-inter text-white/25 w-14 flex-shrink-0">Sin IA</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(E_raw / maxE) * 100}%`, background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.4)' }}
              />
            </div>
            <span className="text-xs font-orbitron text-white/35 w-16 text-right flex-shrink-0">{E_raw.toLocaleString()} kJ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-inter text-white/25 w-14 flex-shrink-0">Con IA</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                animate={{ width: `${(E_opt / maxE) * 100}%` }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="h-full rounded-full"
                style={{ background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.4)' }}
              />
            </div>
            <span className="text-xs font-orbitron w-16 text-right flex-shrink-0" style={{ color: done ? '#10b981' : 'rgba(255,255,255,0.3)' }}>
              {E_opt.toLocaleString()} kJ
            </span>
          </div>
        </div>

        <input
          type="range" min={40} max={150} value={intensity}
          onChange={e => setIntensity(+e.target.value)}
          className="w-full"
        />
      </div>

      <button
        onClick={handleOptimize}
        className="py-2.5 px-4 rounded-xl font-orbitron text-xs font-bold tracking-wider transition-all duration-300"
        style={{
          background: done ? 'rgba(16,185,129,0.12)' : optimizing ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.15)',
          border: `1px solid ${done ? 'rgba(16,185,129,0.4)' : 'rgba(139,92,246,0.35)'}`,
          color: done ? '#10b981' : optimizing ? 'rgba(167,139,250,0.6)' : '#a78bfa',
          cursor: done || optimizing ? 'default' : 'pointer',
        }}
      >
        {done
          ? `✓ OPTIMIZADO — —${savings}% pérdidas`
          : optimizing
          ? '▶ OPTIMIZANDO...'
          : '▶ ACTIVAR IA — MINIMIZAR JOULE'}
      </button>

      <p className="font-inter text-xs text-white/25 text-center leading-relaxed">
        La IA controla I para minimizar E disipada como calor — reducir I 37% = —60% en pérdidas (I²)
      </p>
    </div>
  )
}

export function Slide09Applications1() {
  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-14 gap-8">
        <span className="ghost-num">09</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-7">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Aplicaciones Físicas</span>
            <h2 className="slide-title gradient-text text-center">IA en energía</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ThermalPanel />
            <JoulePanel />
          </div>

          <p className="font-inter text-xs text-white/20 text-center tracking-widest uppercase">
            Optimización energética · Menos picos · Menos pérdidas · Más eficiencia
          </p>
        </div>
      </div>

      <aside className="notes">
        • Panel A: Q = m·c·ΔT — la IA predice ΔT cruzando datos meteorológicos y sensoriales, y calcula con antelación el calor Q necesario. Evita picos de consumo anticipando la demanda.
        • Panel B: E = I²·R·t — la energía disipada como calor (efecto Joule) crece con el cuadrado de I. Reducir I un 37% reduce pérdidas ~60%. La IA controla I en tiempo real en la red.
        • Aplicaciones reales: climatización de edificios inteligentes, gestión de redes eléctricas, trenes de alta velocidad.
        • La clave: la IA no "sabe" física — aplica patrones sobre millones de mediciones para predecir y optimizar.
      </aside>
    </section>
  )
}
