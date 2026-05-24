import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Solución', id: 'solucion' },
  { label: 'Cómo funciona', id: 'como-funciona' },
  { label: 'Precios', id: 'precios' },
  { label: 'Equipo', id: 'equipo' },
]

interface NavbarProps {
  scrolled: boolean
  onNavigate: (id: string) => void
}

export function Navbar({ scrolled, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header
        className={cn(
          'fixed top-0.5 left-0 right-0 z-50 transition-all duration-300 ease-out-expo',
          scrolled
            ? 'bg-[#030a06]/90 backdrop-blur-md border-b border-white/[0.06]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] group-hover:bg-emerald-400 transition-colors duration-150">
              <Leaf className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-jakarta font-bold text-white tracking-tight text-sm">
              IMPACTO ZERO
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="px-4 py-2 text-sm text-white/60 hover:text-white font-medium font-jakarta rounded-lg hover:bg-white/[0.05] transition-all duration-150 ease-out-expo active:scale-[0.97]"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="hidden md:flex bg-emerald-500 text-white hover:bg-emerald-400"
              onClick={() => onNavigate('calculadora')}
            >
              Calcular mi huella
            </Button>
            <button
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#030a06]/95 backdrop-blur-md border-b border-white/[0.07] px-4 py-4 flex flex-col gap-1"
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => { onNavigate(link.id); setMobileOpen(false) }}
                className="text-left px-4 py-3 text-sm text-white/70 hover:text-white font-jakarta font-medium rounded-xl hover:bg-white/[0.05] transition-all duration-150"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 mt-1 border-t border-white/[0.07]">
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-400"
                onClick={() => { onNavigate('calculadora'); setMobileOpen(false) }}
              >
                Calcular mi huella
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
