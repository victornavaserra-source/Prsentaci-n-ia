import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Leaf, Shield, Clock, Euro } from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'

const FEATURES = [
  {
    icon: Leaf,
    title: '100% automatizado con IA',
    description: 'Lee tus facturas y consumos sin intervención manual. Cero horas de consultoría.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8',
  },
  {
    icon: Shield,
    title: 'Cumplimiento legal garantizado',
    description: 'Adaptado a la normativa española 2026 y registro del Ministerio de Transición Ecológica.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/8',
  },
  {
    icon: Clock,
    title: 'De 40 horas a 4 horas',
    description: 'Lo que antes tardabas semanas, ahora lo tienes en horas. Tu tiempo vale.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/8',
  },
  {
    icon: Euro,
    title: 'Precio imbatible',
    description: 'Hasta 100× más barato que las soluciones enterprise. Sin letra pequeña.',
    color: 'text-lime-400',
    bg: 'bg-lime-500/8',
  },
]

const DEMAND_DATA = [
  { year: '2026', obligadas: 500, soluciones: 52 },
  { year: '2027', obligadas: 820, soluciones: 83 },
  { year: '2028', obligadas: 1280, soluciones: 157 },
  { year: '2029', obligadas: 1940, soluciones: 263 },
  { year: '2030', obligadas: 3200, soluciones: 410 },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#060e08] border border-white/10 rounded-xl px-4 py-3 shadow-lg">
        <p className="font-jakarta font-semibold text-white text-xs mb-2">{label}</p>
        {payload.map(p => (
          <p key={p.name} className="text-xs" style={{ color: p.color }}>
            {p.name}: {p.value.toLocaleString('es-ES')}K empresas
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function S07_WhyUs() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      id="por-que"
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-24 relative"
    >
      <div className="max-w-6xl w-full mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18 }}
          className="mb-12"
        >
          <span className="inline-block text-[10px] font-jakarta font-medium tracking-widest uppercase text-emerald-400/70 mb-4">
            Ventajas
          </span>
          <h2 className="font-jakarta font-bold text-3xl md:text-5xl text-white tracking-tighter leading-tight">
            Construido para{' '}
            <span className="text-emerald-400">PYMEs españolas</span>
          </h2>
        </motion.div>

        {/* 2×2 feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 65, damping: 18, delay: i * 0.09 }}
              className="card-hover rounded-2xl border border-white/[0.07] bg-[#060e08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-6 flex gap-4"
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${feature.bg} border border-white/[0.06] flex items-center justify-center`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-jakarta font-semibold text-white text-sm mb-1.5">{feature.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Demand chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ type: 'spring', stiffness: 65, damping: 18, delay: 0.38 }}
          className="rounded-2xl border border-white/[0.07] bg-[#060e08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-6 md:p-8"
        >
          <div className="mb-6">
            <h4 className="font-jakarta font-semibold text-white text-sm">Demanda prevista 2026–2030</h4>
            <p className="text-white/40 text-xs mt-0.5">Miles de empresas (eje Y × 1.000)</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEMAND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={value => (
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Inter' }}>
                      {value === 'obligadas' ? 'Empresas obligadas' : 'Soluciones disponibles'}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="obligadas"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#10b981' }}
                />
                <Line
                  type="monotone"
                  dataKey="soluciones"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ fill: '#0ea5e9', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#0ea5e9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-white/25 text-xs mt-3 text-center font-jakarta">
            La brecha entre demanda y oferta representa una oportunidad de 3.2M empresas sin solución
          </p>
        </motion.div>
      </div>
    </section>
  )
}
