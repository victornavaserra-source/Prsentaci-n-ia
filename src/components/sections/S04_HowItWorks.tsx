import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Upload, BarChart2, FileCheck, Loader2 } from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts'
import { Button } from '@/components/ui/button'

const STEPS = [
  {
    icon: Upload,
    number: '01',
    title: 'Sube tus datos',
    description: 'Facturas, consumos energéticos, transporte. Nuestra IA los lee automáticamente.',
  },
  {
    icon: BarChart2,
    number: '02',
    title: 'Calculamos tu huella',
    description: 'En minutos obtienes tu huella de carbono desglosada por categorías.',
  },
  {
    icon: FileCheck,
    number: '03',
    title: 'Informe oficial listo',
    description: 'Descarga tu informe certificado y compártelo con clientes o la Administración.',
  },
]

const DEMO_DATA = [
  { category: 'Energía', tons: 45, color: '#10b981' },
  { category: 'Transporte', tons: 30, color: '#0ea5e9' },
  { category: 'Residuos', tons: 15, color: '#84cc16' },
  { category: 'Proveedores', tons: 25, color: '#f59e0b' },
  { category: 'Oficina', tons: 10, color: '#8b5cf6' },
]

type DemoState = 'idle' | 'loading' | 'done'

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#060e08] border border-white/10 rounded-xl px-4 py-2.5">
        <p className="font-jakarta font-semibold text-white text-sm">{label}</p>
        <p className="text-white/60 text-xs">{payload[0].value} t CO₂</p>
      </div>
    )
  }
  return null
}

export function S04_HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [demoState, setDemoState] = useState<DemoState>('idle')

  function handleUpload() {
    setDemoState('loading')
    setTimeout(() => setDemoState('done'), 1600)
  }

  return (
    <section
      ref={ref}
      id="como-funciona"
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-24 relative"
    >
      <div className="max-w-5xl w-full mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18 }}
          className="mb-14 md:mb-16"
        >
          <span className="inline-block text-[10px] font-jakarta font-medium tracking-widest uppercase text-emerald-400/70 mb-4">
            El proceso
          </span>
          <h2 className="font-jakarta font-bold text-3xl md:text-5xl text-white tracking-tighter leading-tight">
            Tres pasos para ser{' '}
            <span className="text-emerald-400">sostenible</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative mb-16">
          {/* Connector line */}
          <div className="absolute top-8 left-0 right-0 hidden md:flex items-center px-[10%] pointer-events-none">
            <div className="flex-1 h-px border-t border-dashed border-white/[0.12]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ type: 'spring', stiffness: 65, damping: 18, delay: i * 0.12 }}
                className="flex flex-col items-center md:items-start text-center md:text-left"
              >
                {/* Icon circle */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#060e08] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-emerald-400" strokeWidth={1.6} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] font-jakarta font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-jakarta font-bold text-lg text-white mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-[220px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Demo widget */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ type: 'spring', stiffness: 65, damping: 18, delay: 0.4 }}
          className="rounded-2xl border border-white/[0.07] bg-[#060e08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-jakarta font-semibold text-white text-sm">Demo interactiva</h4>
              <p className="text-white/40 text-xs mt-0.5">Simulación del análisis de carbono</p>
            </div>
            {demoState === 'idle' && (
              <Button size="sm" onClick={handleUpload} className="gap-2">
                <Upload className="w-3.5 h-3.5" />
                Subir archivos
              </Button>
            )}
            {demoState === 'loading' && (
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                Analizando…
              </div>
            )}
            {demoState === 'done' && (
              <span className="text-emerald-400 text-xs font-jakarta font-medium">
                Análisis completo
              </span>
            )}
          </div>

          {demoState === 'idle' && (
            <div className="h-44 flex items-center justify-center border border-dashed border-white/[0.08] rounded-xl">
              <p className="text-white/25 text-sm font-jakarta">Sube tus facturas para comenzar</p>
            </div>
          )}

          {demoState === 'loading' && (
            <div className="h-44 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="loader" />
                <p className="text-white/40 text-xs font-jakarta">Procesando datos con IA…</p>
              </div>
            </div>
          )}

          {demoState === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
              className="h-52"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEMO_DATA} barSize={32}>
                  <XAxis
                    dataKey="category"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'Inter' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'Inter' }}
                    axisLine={false}
                    tickLine={false}
                    unit=" t"
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="tons" radius={[6, 6, 0, 0]}>
                    {DEMO_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
