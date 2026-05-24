import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'

function solarKwh(angle: number): number {
  return +(Math.sin((angle * Math.PI) / 180) * 100).toFixed(1)
}

function SolarCard() {
  const [angle, setAngle] = useState(45)
  const kwh = solarKwh(angle)
  const sunY = 90 - angle * 0.55

  const barData = [
    { h: '6am', v: +(kwh * 0.15).toFixed(0) },
    { h: '9am', v: +(kwh * 0.5).toFixed(0) },
    { h: '12pm', v: kwh },
    { h: '3pm', v: +(kwh * 0.7).toFixed(0) },
    { h: '6pm', v: +(kwh * 0.2).toFixed(0) },
  ]

  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full" style={{ borderColor: 'rgba(251,191,36,0.2)' }}>
      <span className="eyebrow mx-auto" style={{ borderColor: 'rgba(251,191,36,0.3)', color: 'rgba(251,191,36,0.8)', background: 'rgba(251,191,36,0.06)' }}>
        Panel Solar
      </span>

      {/* SVG */}
      <svg viewBox="0 0 200 110" className="w-full" style={{ height: 90 }}>
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020818" />
            <stop offset="100%" stopColor="#0a1628" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(251,191,36,0.8)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0)" />
          </radialGradient>
        </defs>
        {/* Sun */}
        <circle cx={100} cy={sunY} r={20} fill="url(#sunGlow)" />
        <circle cx={100} cy={sunY} r={9} fill="#FBBF24" style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.9))' }} />
        {/* Rays */}
        {Array.from({ length: 8 }, (_, i) => {
          const rad = (i / 8) * Math.PI * 2
          return <line key={i} x1={100} y1={sunY} x2={100 + Math.cos(rad) * 16} y2={sunY + Math.sin(rad) * 16}
            stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        })}
        {/* Sunlight angle line */}
        <line x1={100} y1={sunY} x2={100} y2={90} stroke="rgba(251,191,36,0.2)" strokeWidth="1" strokeDasharray="4 3" />
        {/* Ground */}
        <line x1={0} y1={90} x2={200} y2={90} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        {/* Panel */}
        <rect x={75} y={80} width={50} height={6} rx="2" fill="rgba(0,212,255,0.7)"
          style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.5))' }} />
        {/* kWh label */}
        <text x={100} y={107} textAnchor="middle" fill="rgba(251,191,36,0.7)" fontSize="9" fontFamily="Orbitron">
          {kwh} kWh
        </text>
      </svg>

      {/* Slider */}
      <div className="flex flex-col gap-1.5">
        <input type="range" min={0} max={90} value={angle} onChange={e => setAngle(+e.target.value)} />
        <div className="flex justify-between text-xs font-inter text-white/40">
          <span>Ángulo solar: <span style={{ color: '#FBBF24' }}>{angle}°</span></span>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ height: 70 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <XAxis dataKey="h" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 8 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8 }} tickLine={false} axisLine={false} domain={[0, 105]} />
            <Tooltip
              content={({ active, payload }) =>
                active && payload?.length
                  ? <div className="glass-card px-2 py-1 text-xs font-orbitron" style={{ color: '#FBBF24' }}>{payload[0].value} kWh</div>
                  : null
              }
            />
            <Bar dataKey="v" radius={[2, 2, 0, 0]}>
              {barData.map((_entry, i) => (
                <Cell key={i} fill={i === 2 ? '#FBBF24' : 'rgba(251,191,36,0.35)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="font-inter text-xs text-white/30 text-center">La IA predice producción según radiación</p>
    </div>
  )
}

function TurbineCard() {
  const [speed, setSpeed] = useState(15)
  const status = speed < 4 ? 'APAGADA' : speed > 30 ? 'EMERGENCIA' : 'GENERANDO'
  const statusColor = speed < 4 ? 'rgba(255,255,255,0.3)' : speed > 30 ? '#ef4444' : '#10b981'
  const kw = speed < 4 ? 0 : speed > 30 ? 0 : Math.round((speed / 30) * 1500)
  const spinDur = speed < 4 || speed > 30 ? '0s' : `${Math.max(0.5, 4 - speed * 0.1)}s`
  const spinning = speed >= 4 && speed <= 30

  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
      <span className="eyebrow mx-auto" style={{ borderColor: 'rgba(16,185,129,0.3)', color: 'rgba(52,211,153,0.8)', background: 'rgba(16,185,129,0.06)' }}>
        Turbina Eólica
      </span>

      <div className="flex justify-center">
        <svg viewBox="0 0 120 110" width="120" height="100">
          {/* Tower */}
          <polygon points="56,40 64,40 68,100 52,100" fill="rgba(255,255,255,0.12)" />
          {/* Hub */}
          <circle cx="60" cy="38" r="7" fill={statusColor} style={{ filter: `drop-shadow(0 0 8px ${statusColor})` }} />
          {/* Blades */}
          <g style={{ transformOrigin: '60px 38px', animation: spinning ? `spin ${spinDur} linear infinite` : 'none' }}>
            {[0, 120, 240].map(deg => (
              <ellipse key={deg} cx="60" cy="18" rx="4.5" ry="21"
                fill={`${statusColor}cc`}
                style={{ transformOrigin: '60px 38px', transform: `rotate(${deg}deg)`, filter: `drop-shadow(0 0 3px ${statusColor}80)` }} />
            ))}
          </g>
          {/* kW label */}
          <text x="60" y="108" textAnchor="middle" fill={statusColor} fontSize="9" fontFamily="Orbitron">
            {kw > 0 ? `${kw} kW` : '—'}
          </text>
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <input type="range" min={0} max={50} value={speed} onChange={e => setSpeed(+e.target.value)} />
        <div className="flex justify-between text-xs font-inter">
          <span className="text-white/40">Viento: <span style={{ color: '#00d4ff' }}>{speed} m/s</span></span>
          <span className="font-orbitron font-bold text-xs" style={{ color: statusColor }}>{status}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {[
          { label: '< 4 m/s', info: 'Sin viento suficiente', color: 'rgba(255,255,255,0.25)' },
          { label: '4–30 m/s', info: 'Zona óptima de generación', color: '#10b981' },
          { label: '> 30 m/s', info: 'Parada de emergencia', color: '#ef4444' },
        ].map(({ label, info, color }) => (
          <div key={label} className="flex items-center gap-2 text-xs font-inter">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="font-bold" style={{ color, minWidth: 60 }}>{label}</span>
            <span className="text-white/30">{info}</span>
          </div>
        ))}
      </div>

      <p className="font-inter text-xs text-white/30 text-center">La IA decide cuándo encender y apagar</p>
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
            <span className="eyebrow">Aplicaciones Reales</span>
            <h2 className="slide-title gradient-text text-center">IA en energías renovables</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SolarCard />
            <TurbineCard />
          </div>

          <p className="font-inter text-xs text-white/25 text-center tracking-widest uppercase">
            La IA optimiza la producción energética en tiempo real · Más eficiencia · Menos residuos
          </p>
        </div>
      </div>

      <aside className="notes">
        • El panel solar: la IA predice cuánta energía generará según el ángulo del sol y las nubes.
        • La turbina: la IA decide cuándo encender, cuándo parar, y cómo orientar las palas.
        • En el mundo real, estas IAs procesan datos de sensores cada pocos segundos.
        • En España, el 50% de la electricidad ya proviene de renovables gestionadas por IA.
      </aside>
    </section>
  )
}
