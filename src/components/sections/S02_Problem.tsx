import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FileWarning, Clock, TrendingDown } from 'lucide-react'

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 70, damping: 18 },
  },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

function ProblemCard({
  icon: Icon,
  tag,
  title,
  description,
  iconColor = 'text-emerald-400',
  large = false,
}: {
  icon: React.ElementType
  tag: string
  title: string
  description: string
  iconColor?: string
  large?: boolean
}) {
  return (
    <div
      className={`card-hover rounded-2xl border border-white/[0.07] bg-[#060e08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${large ? 'p-8 md:p-10' : 'p-6'}`}
    >
      <div className={`${large ? 'mb-6' : 'mb-4'} inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07]`}>
        <Icon className={`${large ? 'w-5 h-5' : 'w-4 h-4'} ${iconColor}`} strokeWidth={1.8} />
      </div>
      {large && (
        <div className="mb-3">
          <span className="text-[10px] font-jakarta font-medium tracking-widest uppercase text-white/30">{tag}</span>
        </div>
      )}
      <div className={`font-jakarta font-bold text-white ${large ? 'text-5xl md:text-6xl leading-none mb-3' : 'text-2xl leading-none mb-2'}`}>
        {title}
      </div>
      <p className={`text-white/50 leading-relaxed ${large ? 'text-base max-w-xs' : 'text-sm'}`}>
        {description}
      </p>
    </div>
  )
}

export function S02_Problem() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      id="problema"
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden"
    >
      {/* Subtle glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.04) 0%, transparent 65%)' }}
      />

      <div className="max-w-6xl w-full mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12 md:mb-16">
            <span className="inline-block text-[10px] font-jakarta font-medium tracking-widest uppercase text-emerald-400/70 mb-4">
              El problema
            </span>
            <h2 className="font-jakarta font-bold text-3xl md:text-5xl text-white tracking-tighter leading-tight max-w-2xl">
              Desde 2026, no reportar tu huella puede costarte{' '}
              <span className="text-red-400">250.000€</span>
            </h2>
          </motion.div>

          {/* Asymmetric grid: large left card + 2 stacked right — not the banned 3-equal-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
            {/* Large featured card: 3/5 width */}
            <motion.div variants={itemVariants} className="md:col-span-3">
              <ProblemCard
                icon={FileWarning}
                tag="Regulación"
                title="250.000€"
                description="La nueva normativa obliga a las PYMEs proveedoras de grandes empresas a reportar sus emisiones de CO2. Las multas por incumplimiento pueden llegar a esta cifra."
                iconColor="text-red-400"
                large
              />
            </motion.div>

            {/* Two stacked cards: 2/5 width */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <motion.div variants={itemVariants} className="flex-1">
                <ProblemCard
                  icon={Clock}
                  tag="Tiempo"
                  title="40 h/semana"
                  description="Calcular la huella de carbono manualmente consume 40 horas a la semana que no tienes."
                  iconColor="text-amber-400"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="flex-1">
                <ProblemCard
                  icon={TrendingDown}
                  tag="Coste"
                  title="5.000–50.000€"
                  description="Las soluciones enterprise actuales son inaccesibles para la mayoría de PYMEs."
                  iconColor="text-sky-400"
                />
              </motion.div>
            </div>
          </div>

          {/* Bold stat */}
          <motion.div
            variants={itemVariants}
            className="text-center pt-6 border-t border-white/[0.06]"
          >
            <p className="font-jakarta text-white/40 text-sm mb-1 uppercase tracking-widest text-[10px]">
              Empresas afectadas en España
            </p>
            <p className="font-jakarta font-bold text-4xl md:text-5xl text-white tracking-tighter">
              3<span className="text-emerald-400">.2</span> millones de PYMEs
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
