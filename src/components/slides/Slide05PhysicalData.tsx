import { useState } from 'react'

function wavelengthToRGB(nm: number): [number, number, number] {
  let r = 0, g = 0, b = 0
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1 }
  else if (nm >= 440 && nm < 490) { g = (nm - 440) / 50; b = 1 }
  else if (nm >= 490 && nm < 510) { g = 1; b = -(nm - 510) / 20 }
  else if (nm >= 510 && nm < 580) { r = (nm - 510) / 70; g = 1 }
  else if (nm >= 580 && nm < 645) { r = 1; g = -(nm - 645) / 65 }
  else if (nm >= 645 && nm <= 780) { r = 1 }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function colorLabel(nm: number): string {
  if (nm < 450) return 'Violeta'
  if (nm < 495) return 'Azul'
  if (nm < 570) return 'Verde'
  if (nm < 590) return 'Amarillo'
  if (nm < 620) return 'Naranja'
  return 'Rojo'
}

function SoundCard() {
  const [freq, setFreq] = useState(440)
  const W = 240, H = 72
  const norm = (freq - 20) / (20000 - 20)
  const period = Math.max(5, 55 - norm * 50)
  const pts = Array.from({ length: W + 1 }, (_, x) => {
    const y = H / 2 + Math.sin((x / period) * Math.PI * 2) * (H / 2.6)
    return `${x},${y.toFixed(1)}`
  }).join(' ')

  const label = freq < 250 ? 'Graves (bajo)' : freq < 2000 ? 'Medios (voz)' : 'Agudos'

  return (
    <div className="glass-card p-5 h-full flex flex-col gap-4" style={{ borderColor: 'rgba(0,212,255,0.15)' }}>
      <span className="eyebrow text-center mx-auto">Sonido</span>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 72 }}>
        <polyline points={pts} fill="none" stroke="#00d4ff" strokeWidth="1.8"
          style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.7))' }} />
      </svg>
      <div className="flex flex-col gap-2">
        <input type="range" min={20} max={20000} value={freq} onChange={e => setFreq(+e.target.value)} />
        <div className="flex justify-between text-xs font-inter">
          <span className="text-white/40">Frecuencia</span>
          <span className="font-orbitron font-bold" style={{ color: '#00d4ff' }}>{freq.toLocaleString()} Hz</span>
        </div>
        <p className="text-white/30 text-xs font-inter text-center">{label}</p>
      </div>
    </div>
  )
}

function LightCard() {
  const [nm, setNm] = useState(520)
  const [r, g, b] = wavelengthToRGB(nm)
  const color = `rgb(${r},${g},${b})`
  const label = colorLabel(nm)

  return (
    <div className="glass-card p-5 h-full flex flex-col gap-4" style={{ borderColor: `rgba(${r},${g},${b},0.25)` }}>
      <span className="eyebrow mx-auto" style={{ borderColor: `rgba(${r},${g},${b},0.4)`, color: `rgba(${r},${g},${b},0.9)`, background: `rgba(${r},${g},${b},0.08)` }}>Luz</span>
      {/* Spectrum preview */}
      <div className="w-full rounded-xl relative overflow-hidden" style={{ height: 72 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, #7b00d4,#0000ff,#00d4ff,#00ff00,#ffff00,#ff8800,#ff0000)',
          opacity: 0.25,
        }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 30px ${color}, 0 0 60px ${color}40` }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <input type="range" min={380} max={700} value={nm} onChange={e => setNm(+e.target.value)} />
        <div className="flex justify-between text-xs font-inter">
          <span className="text-white/40">Longitud de onda</span>
          <span className="font-orbitron font-bold" style={{ color }}>{nm} nm</span>
        </div>
        <p className="text-xs font-inter text-center font-semibold" style={{ color }}>{label}</p>
      </div>
    </div>
  )
}

type WindMode = 'CALMA' | 'MODERADO' | 'TORMENTA'
const WIND_MODES: { mode: WindMode; speed: string; color: string; kw: string }[] = [
  { mode: 'CALMA', speed: '2 m/s', color: 'rgba(255,255,255,0.3)', kw: '0 kW' },
  { mode: 'MODERADO', speed: '14 m/s', color: '#10b981', kw: '850 kW' },
  { mode: 'TORMENTA', speed: '35 m/s', color: '#ef4444', kw: '— PARADA' },
]

function WindCard() {
  const [mode, setMode] = useState<WindMode>('MODERADO')
  const info = WIND_MODES.find(m => m.mode === mode)!
  const spinDur = mode === 'CALMA' ? '0s' : mode === 'TORMENTA' ? '0s' : '2s'
  const spinning = mode === 'MODERADO'

  return (
    <div className="glass-card p-5 h-full flex flex-col gap-4" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
      <span className="eyebrow mx-auto" style={{ borderColor: 'rgba(16,185,129,0.3)', color: 'rgba(52,211,153,0.8)', background: 'rgba(16,185,129,0.06)' }}>Viento</span>
      <div className="flex justify-center" style={{ height: 72 }}>
        <svg viewBox="0 0 80 80" width="70" height="70">
          <rect x="37" y="42" width="6" height="28" rx="2" fill="rgba(255,255,255,0.18)" />
          <circle cx="40" cy="40" r="4.5" fill={info.color} style={{ filter: `drop-shadow(0 0 6px ${info.color})` }} />
          <g style={{ transformOrigin: '40px 40px', animation: spinning ? `spin ${spinDur} linear infinite` : 'none' }}>
            {[0, 120, 240].map(deg => (
              <ellipse key={deg} cx="40" cy="25" rx="3" ry="14" fill={`${info.color}cc`}
                style={{ transformOrigin: '40px 40px', transform: `rotate(${deg}deg)` }} />
            ))}
          </g>
        </svg>
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        {WIND_MODES.map(({ mode: m }) => (
          <button key={m} onClick={() => setMode(m)}
            className="text-xs font-orbitron px-3 py-1.5 rounded-full transition-all duration-200"
            style={{
              border: `1px solid ${m === mode ? info.color : 'rgba(255,255,255,0.1)'}`,
              color: m === mode ? info.color : 'rgba(255,255,255,0.3)',
              background: m === mode ? `${info.color}15` : 'transparent',
              fontSize: '0.55rem', letterSpacing: '0.1em',
            }}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-white/40 text-xs font-inter">{info.speed}</span>
        <span className="font-orbitron text-xs font-bold" style={{ color: info.color }}>{info.kw}</span>
      </div>
    </div>
  )
}

export function Slide05PhysicalData() {
  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-14 gap-10">
        <span className="ghost-num">05</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-8">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Datos físicos</span>
            <h2 className="slide-title gradient-text text-center">Representación digital del mundo</h2>
            <p className="font-inter text-white/35 text-sm tracking-wider">— Interactúa con los controles —</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SoundCard />
            <LightCard />
            <WindCard />
          </div>

          <p className="text-center font-inter text-white/30 text-xs tracking-widest uppercase">
            Los sensores físicos convierten el mundo en señales eléctricas · Los ADC las convierten en números
          </p>
        </div>
      </div>

      <aside className="notes">
        • Los sensores físicos convierten fenómenos del mundo real en señales eléctricas.
        • Un micrófono mide variaciones de presión del aire y las convierte en voltaje.
        • Un fotosensor detecta la longitud de onda de la luz — eso da el color.
        • El ADC (convertidor analógico-digital) transforma cada señal en un número binario.
      </aside>
    </section>
  )
}
