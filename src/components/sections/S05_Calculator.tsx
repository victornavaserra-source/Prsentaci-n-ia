import { useRef, useState, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'

const SECTORS = ['Hostelería', 'Transporte', 'Retail', 'Construcción', 'Otro']

const SECTOR_MULTIPLIERS: Record<string, number> = {
  Hostelería: 1.3,
  Transporte: 1.8,
  Retail: 0.85,
  Construcción: 1.5,
  Otro: 1.0,
}

const COLORS = ['#10b981', '#0ea5e9', '#84cc16', '#f59e0b', '#8b5cf6']

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#060e08] border border-white/10 rounded-xl px-4 py-2.5 shadow-lg">
        <p className="font-jakarta font-semibold text-white text-sm">{payload[0].name}</p>
        <p className="text-white/60 text-xs">{payload[0].value.toFixed(1)} t CO₂/año</p>
      </div>
    )
  }
  return null
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="text-white/60 text-sm font-jakarta">{label}</label>
        <span className="text-white font-jakarta font-semibold text-sm tabular-nums">
          {unit === '€' ? `${value.toLocaleString('es-ES')}${unit}` : `${value} ${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-[10px] text-white/25 font-jakarta">
        <span>{unit === '€' ? `${min}${unit}` : `${min} ${unit}`}</span>
        <span>{unit === '€' ? `${max.toLocaleString('es-ES')}${unit}` : `${max} ${unit}`}</span>
      </div>
    </div>
  )
}

export function S05_Calculator() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const [sector, setSector] = useState('Otro')
  const [employees, setEmployees] = useState(25)
  const [energy, setEnergy] = useState(1200)
  const [vehicles, setVehicles] = useState(3)

  const chartData = useMemo(() => {
    const mult = SECTOR_MULTIPLIERS[sector] ?? 1
    const energiaTons = (energy / 0.15) * 0.233 * 12 / 1000 * mult
    const transporteTons = vehicles * 2.1 * mult
    const oficinaTons = employees * 0.9 * mult
    const residuosTons = employees * 0.18 * mult
    const proveedoresTons = (energiaTons + transporteTons) * 0.22

    return [
      { name: 'Energía', value: Math.round(energiaTons * 10) / 10 },
      { name: 'Transporte', value: Math.round(transporteTons * 10) / 10 },
      { name: 'Oficina', value: Math.round(oficinaTons * 10) / 10 },
      { name: 'Residuos', value: Math.round(residuosTons * 10) / 10 },
      { name: 'Proveedores', value: Math.round(proveedoresTons * 10) / 10 },
    ]
  }, [sector, employees, energy, vehicles])

  const totalTons = useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData]
  )

  return (
    <section
      ref={ref}
      id="calculadora"
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-24 relative"
    >
      <div className="max-w-6xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18 }}
          className="mb-12"
        >
          <span className="inline-block text-[10px] font-jakarta font-medium tracking-widest uppercase text-emerald-400/70 mb-4">
            Calcula
          </span>
          <h2 className="font-jakarta font-bold text-3xl md:text-5xl text-white tracking-tighter leading-tight">
            Estima tu huella{' '}
            <span className="text-emerald-400">ahora</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ type: 'spring', stiffness: 65, damping: 18, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Controls */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#060e08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-7 flex flex-col gap-7">
            {/* Sector */}
            <div>
              <p className="text-white/60 text-sm font-jakarta mb-3">Sector de actividad</p>
              <div className="flex flex-wrap gap-2">
                {SECTORS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSector(s)}
                    className={[
                      'px-3.5 py-1.5 rounded-lg text-sm font-jakarta font-medium transition-all duration-150 ease-out active:scale-[0.97]',
                      sector === s
                        ? 'bg-emerald-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                        : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.07] border border-white/[0.07]',
                    ].join(' ')}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Slider
              label="Empleados"
              value={employees}
              min={1}
              max={250}
              unit="personas"
              onChange={setEmployees}
            />
            <Slider
              label="Factura energética mensual"
              value={energy}
              min={0}
              max={5000}
              unit="€"
              onChange={setEnergy}
            />
            <Slider
              label="Vehículos de empresa"
              value={vehicles}
              min={0}
              max={50}
              unit="vehículos"
              onChange={setVehicles}
            />
          </div>

          {/* Chart + Result */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#060e08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-7 flex flex-col items-center justify-between gap-6">
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={600}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} fillOpacity={0.88} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Inter' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center">
              <p className="text-white/40 text-xs font-jakarta uppercase tracking-widest mb-1">
                Estimación anual
              </p>
              <p className="font-jakarta font-bold text-4xl text-white tracking-tighter">
                {totalTons.toFixed(1)}{' '}
                <span className="text-emerald-400 text-2xl">t CO₂</span>
              </p>
              <p className="text-white/40 text-sm mt-1.5 max-w-xs mx-auto">
                Tu empresa genera aproximadamente{' '}
                <span className="text-white/70">{totalTons.toFixed(1)} toneladas</span> de CO₂ al año
              </p>
            </div>

            <Button
              size="lg"
              className="w-full gap-2 bg-emerald-500 hover:bg-emerald-400"
            >
              Obtener análisis completo por 369€
              <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
