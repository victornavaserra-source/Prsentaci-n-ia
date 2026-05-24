import { ChevronDown } from 'lucide-react'
import { Hero } from '@/components/ui/animated-hero'

interface S01Props {
  onNavigate: (id: string) => void
}

function CO2Molecule() {
  return (
    <div
      className="absolute right-[6%] top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block animate-float"
      style={{ opacity: 0.12 }}
    >
      <svg width="280" height="200" viewBox="0 0 280 200" fill="none">
        {/* Bond O-C */}
        <line x1="60" y1="100" x2="130" y2="100" stroke="#10b981" strokeWidth="3" strokeOpacity="0.6" />
        {/* Bond C-O */}
        <line x1="150" y1="100" x2="220" y2="100" stroke="#10b981" strokeWidth="3" strokeOpacity="0.6" />
        {/* Double bond lines */}
        <line x1="60" y1="94" x2="130" y2="94" stroke="#84cc16" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="150" y1="94" x2="220" y2="94" stroke="#84cc16" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="60" y1="106" x2="130" y2="106" stroke="#84cc16" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="150" y1="106" x2="220" y2="106" stroke="#84cc16" strokeWidth="1.5" strokeOpacity="0.4" />
        {/* O atom left */}
        <circle cx="40" cy="100" r="28" fill="#0ea5e9" fillOpacity="0.15" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.5" />
        <text x="40" y="105" textAnchor="middle" fill="#0ea5e9" fillOpacity="0.7" fontSize="16" fontWeight="700" fontFamily="Inter">O</text>
        {/* C atom center */}
        <circle cx="140" cy="100" r="22" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" />
        <text x="140" y="105" textAnchor="middle" fill="#10b981" fillOpacity="0.9" fontSize="14" fontWeight="700" fontFamily="Inter">C</text>
        {/* O atom right */}
        <circle cx="240" cy="100" r="28" fill="#0ea5e9" fillOpacity="0.15" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.5" />
        <text x="240" y="105" textAnchor="middle" fill="#0ea5e9" fillOpacity="0.7" fontSize="16" fontWeight="700" fontFamily="Inter">O</text>
        {/* Subscript 2 */}
        <text x="268" y="125" fill="#10b981" fillOpacity="0.5" fontSize="12" fontFamily="Inter">2</text>
      </svg>
    </div>
  )
}

export function S01_Hero({ onNavigate }: S01Props) {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col overflow-hidden"
    >
      {/* Radial glow top-center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.07) 0%, transparent 65%)',
        }}
      />

      <CO2Molecule />

      <div className="flex-1 relative z-10">
        <Hero
          onCalculate={() => onNavigate('calculadora')}
          onPlanes={() => onNavigate('precios')}
        />
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8">
        <button
          onClick={() => onNavigate('problema')}
          className="flex flex-col items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors duration-200 group"
        >
          <span className="text-[10px] font-jakarta tracking-widest uppercase">Descubrir</span>
          <ChevronDown className="w-4 h-4 animate-bounce-slow group-hover:text-emerald-400 transition-colors" />
        </button>
      </div>
    </section>
  )
}
