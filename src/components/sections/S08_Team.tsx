import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const TEAM = [
  {
    name: 'Paula Casbas',
    role: 'Comunicación y cliente',
    initials: 'PC',
    gradient: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-300',
    skills: ['Creatividad', 'Planificación', 'Empatía'],
  },
  {
    name: 'Víctor Navarro',
    role: 'Estrategia y cierre',
    initials: 'VN',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-300',
    skills: ['Visión', 'Iniciativa', 'Trabajo en equipo'],
  },
  {
    name: 'Diego García',
    role: 'Energía y sostenibilidad',
    initials: 'DG',
    gradient: 'from-sky-500/20 to-blue-500/10',
    border: 'border-sky-500/20',
    text: 'text-sky-300',
    skills: ['Ética sostenible', 'Finanzas', 'Motivación'],
  },
]

export function S08_Team() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      id="equipo"
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
            El equipo
          </span>
          <h2 className="font-jakarta font-bold text-3xl md:text-5xl text-white tracking-tighter leading-tight">
            Quiénes somos
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18, delay: 0.07 }}
          className="text-white/45 text-base mb-14 font-jakarta max-w-md"
        >
          Tres estudiantes de Zaragoza con una misión clara: hacer la sostenibilidad accesible para todas las empresas.
        </motion.p>

        {/* Team cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 65, damping: 18, delay: i * 0.1 }}
              className="card-hover rounded-2xl border border-white/[0.07] bg-[#060e08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-7 flex flex-col gap-5"
            >
              {/* Avatar */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.gradient} border ${member.border} flex items-center justify-center`}>
                <span className={`font-jakarta font-bold text-base ${member.text}`}>
                  {member.initials}
                </span>
              </div>

              <div>
                <h3 className="font-jakarta font-bold text-white text-base leading-tight">{member.name}</h3>
                <p className="text-white/45 text-sm mt-0.5">{member.role}</p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {member.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-white/50 text-[11px] font-jakarta"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Company info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18, delay: 0.35 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-white/50 text-sm font-jakarta">
              Sociedad Limitada · 3 socios · 33,3% cada uno
            </p>
          </div>
          <p className="text-white/35 text-sm font-jakarta pl-4 sm:pl-0">
            Av. Juan Pablo II, 35 — Zaragoza
          </p>
        </motion.div>
      </div>
    </section>
  )
}
