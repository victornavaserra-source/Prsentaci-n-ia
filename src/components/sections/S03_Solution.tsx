import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'

const BULLETS = [
  'IA que lee tus facturas, consumos y operaciones',
  'Genera informes descargables en minutos',
  'Planes de reducción personalizados para tu empresa',
  'Disponible 24/7, sin conocimientos técnicos',
]

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 70, damping: 18, delay: i * 0.09 },
  }),
}

export function S03_Solution() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      id="solucion"
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-24 relative"
    >
      <div className="max-w-6xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18 }}
          className="mb-10"
        >
          <span className="inline-block text-[10px] font-jakarta font-medium tracking-widest uppercase text-emerald-400/70 mb-4">
            La solución
          </span>
          <h2 className="font-jakarta font-bold text-3xl md:text-5xl text-white tracking-tighter leading-tight">
            Impacto Zero lo hace{' '}
            <span className="text-emerald-400">automático</span>
          </h2>
        </motion.div>

        {/* 21st.dev-style card: Spotlight + Spline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.12 }}
        >
          <Card className="relative overflow-hidden bg-black/[0.96] border-white/[0.08] min-h-[420px] md:h-[500px]">
            <Spotlight
              className="absolute -top-40 left-0 w-full md:w-[700px] h-[600px]"
              fill="#10b981"
            />

            <div className="relative z-10 flex flex-col md:flex-row h-full">
              {/* Left: bullets */}
              <div className="md:w-[45%] p-8 md:p-12 flex flex-col justify-center gap-6">
                <div>
                  <h3 className="font-jakarta font-bold text-xl md:text-2xl text-white leading-tight mb-2">
                    Tecnología que trabaja por ti
                  </h3>
                  <p className="text-white/40 text-sm">
                    Sin configuración compleja. Sin consultores externos.
                  </p>
                </div>
                <ul className="flex flex-col gap-3.5">
                  {BULLETS.map((bullet, i) => (
                    <motion.li
                      key={i}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate={isInView ? 'visible' : 'hidden'}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={2.5} />
                      </span>
                      <span className="text-white/75 text-sm leading-snug">{bullet}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Right: Spline 3D */}
              <div className="md:w-[55%] h-64 md:h-full relative overflow-hidden">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
