import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, Calendar, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CONTACTS = [
  {
    icon: Mail,
    title: 'Solicitar presupuesto',
    subtitle: 'contacto@impactozero.es',
    description: 'Te respondemos en menos de 24h',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8',
    border: 'border-emerald-500/15',
  },
  {
    icon: Phone,
    title: 'Llamar ahora',
    subtitle: '+34 976 43 21 87',
    description: 'Horario 9:00–18:00 L–V',
    color: 'text-sky-400',
    bg: 'bg-sky-500/8',
    border: 'border-sky-500/15',
  },
  {
    icon: Calendar,
    title: 'Reservar reunión',
    subtitle: 'Presencial o videollamada',
    description: 'Venimos a verte con nuestra presentación',
    color: 'text-lime-400',
    bg: 'bg-lime-500/8',
    border: 'border-lime-500/15',
  },
]

const FOOTER_LINKS = [
  'Política de privacidad',
  'LOPD 3/2018',
  'impactozero.es',
]

export function S09_Contact() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      id="contacto"
      className="min-h-[100dvh] flex flex-col relative overflow-hidden"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(16,185,129,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 relative z-10">
        <div className="max-w-4xl w-full mx-auto text-center">
          {/* Big CTA */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ type: 'spring', stiffness: 65, damping: 18 }}
            className="mb-6"
          >
            <span className="inline-block text-[10px] font-jakarta font-medium tracking-widest uppercase text-emerald-400/70 mb-6">
              Contacto
            </span>
            <h2 className="font-jakarta font-bold text-4xl md:text-6xl text-white tracking-tighter leading-tight mb-5">
              ¿Lista tu empresa
              <br />
              para el{' '}
              <span className="text-emerald-400">cambio?</span>
            </h2>
            <p className="text-white/45 text-base max-w-md mx-auto leading-relaxed font-jakarta">
              La normativa entra en vigor en 2026.{' '}
              <span className="text-white/65">Cada mes que esperas es un mes de riesgo.</span>
            </p>
          </motion.div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
            {CONTACTS.map((contact, i) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ type: 'spring', stiffness: 65, damping: 18, delay: i * 0.1 }}
                className={`card-hover rounded-2xl border ${contact.border} bg-[#060e08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-6 text-left flex flex-col gap-4`}
              >
                <div className={`w-10 h-10 rounded-xl ${contact.bg} border ${contact.border} flex items-center justify-center`}>
                  <contact.icon className={`w-5 h-5 ${contact.color}`} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-jakarta font-semibold text-white text-sm mb-1">{contact.title}</h3>
                  <p className={`font-jakarta font-medium text-sm ${contact.color} mb-1`}>{contact.subtitle}</p>
                  <p className="text-white/40 text-xs">{contact.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 70, damping: 18, delay: 0.3 }}
          >
            <Button
              size="xl"
              className="bg-emerald-500 hover:bg-emerald-400 gap-3 animate-pulse-soft"
              onClick={() => window.open('mailto:contacto@impactozero.es')}
            >
              Contactar ahora
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <Leaf className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-jakarta font-bold text-white text-sm">IMPACTO ZERO</span>
              <span className="text-white/30 text-xs ml-2 font-jakarta">Tu huella. Nuestra misión.</span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-1">
            {FOOTER_LINKS.map((link, i) => (
              <span key={link} className="flex items-center">
                <button className="text-white/35 hover:text-white/60 text-xs font-jakarta transition-colors duration-150 px-2">
                  {link}
                </button>
                {i < FOOTER_LINKS.length - 1 && (
                  <span className="text-white/15 text-xs">·</span>
                )}
              </span>
            ))}
          </nav>

          <p className="text-white/25 text-xs font-jakarta">
            © 2026 Impacto Zero S.L. — Zaragoza, España
          </p>
        </div>
      </footer>
    </section>
  )
}
