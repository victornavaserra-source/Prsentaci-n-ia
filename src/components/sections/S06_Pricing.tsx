import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, MoveRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PLANS = [
  {
    name: 'Básico',
    price: '369€',
    description: 'Detección estándar de huella de carbono',
    popular: false,
    cta: 'Empezar ahora',
    features: [
      'Análisis completo de emisiones',
      'Informe PDF descargable',
      'Recomendaciones básicas de reducción',
      'Soporte por email',
    ],
  },
  {
    name: 'Avanzado',
    price: '469€',
    description: 'Detección compleja con más variables',
    popular: true,
    cta: 'Empezar ahora',
    features: [
      'Todo lo del plan Básico',
      'Análisis por departamentos',
      'Plan de reducción personalizado',
      'Informe certificado oficial',
      'Soporte prioritario 9:00–18:00',
    ],
  },
  {
    name: 'Empresa',
    price: 'Contactar',
    description: 'Para empresas con múltiples sedes o necesidades especiales',
    popular: false,
    cta: 'Hablar con nosotros',
    features: [
      'Todo lo del plan Avanzado',
      'Integración con ERP/software propio',
      'Gestor dedicado',
      'Actualizaciones normativas incluidas',
      'Formación al equipo',
    ],
  },
]

export function S06_Pricing() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      id="precios"
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-24 relative"
    >
      <div className="max-w-5xl w-full mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18 }}
          className="mb-4"
        >
          <span className="inline-block text-[10px] font-jakarta font-medium tracking-widest uppercase text-emerald-400/70 mb-4">
            Precios
          </span>
          <h2 className="font-jakarta font-bold text-3xl md:text-5xl text-white tracking-tighter leading-tight">
            Sin sorpresas.{' '}
            <span className="text-emerald-400">Sin intermediarios.</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18, delay: 0.08 }}
          className="text-white/40 text-sm mb-12 font-jakarta"
        >
          La competencia cobra entre 500€ y 50.000€ por el mismo servicio.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 65, damping: 18, delay: i * 0.1 }}
              className={[
                'relative rounded-2xl border p-7 flex flex-col gap-6 card-hover',
                plan.popular
                  ? 'border-emerald-500/40 bg-emerald-500/[0.04] shadow-[inset_0_1px_0_rgba(16,185,129,0.12),0_0_0_1px_rgba(16,185,129,0.12)]'
                  : 'border-white/[0.07] bg-[#060e08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
              ].join(' ')}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-500 text-white text-[10px] font-jakarta font-bold px-3 py-1 rounded-full tracking-wide uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                    Más popular
                  </span>
                </div>
              )}

              <div>
                <p className="font-jakarta font-semibold text-white/60 text-sm mb-2">{plan.name}</p>
                <p className={`font-jakarta font-bold tracking-tighter leading-none mb-2 ${plan.price === 'Contactar' ? 'text-3xl' : 'text-4xl'} ${plan.popular ? 'text-emerald-400' : 'text-white'}`}>
                  {plan.price}
                </p>
                <p className="text-white/40 text-xs leading-snug">{plan.description}</p>
              </div>

              <ul className="flex flex-col gap-2.5 flex-1">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/12 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={2.5} />
                    </span>
                    <span className="text-white/60 text-sm leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'default' : 'outline'}
                className={`w-full gap-2 ${plan.popular ? 'bg-emerald-500 hover:bg-emerald-400' : ''}`}
              >
                {plan.cta}
                <MoveRight className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
