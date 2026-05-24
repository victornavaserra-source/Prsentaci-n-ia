import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const WORDS = ['datos', 'modelos', 'redes', 'predicciones', 'decisiones']

interface HeroProps {
  onScrollDown?: () => void
  onJumpToConclusions?: () => void
}

const ease = [0.23, 1, 0.32, 1] as const

export function Hero({ onScrollDown, onJumpToConclusions }: HeroProps) {
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="relative w-full flex flex-col justify-between font-inter"
      style={{ height: '100dvh', padding: 'clamp(2rem,4vw,4rem) clamp(2rem,6vw,6rem)', zIndex: 2 }}
    >
      {/* Top */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="flex justify-between items-center"
        style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontFamily: 'Orbitron, sans-serif' }}
      >
        <span>Física · Tecnología · 2025-26</span>
        <span>01 / 12</span>
      </motion.div>

      {/* Center block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem,3vw,2.5rem)' }}>

        {/* Rotating words line */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem 1rem' }}
        >
          <span
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.45)',
              fontSize: 'clamp(1rem, 2.5vw, 2rem)',
            }}
          >
            La IA funciona con
          </span>
          <div style={{ position: 'relative', minWidth: 'clamp(6rem,15vw,14rem)', height: 'clamp(1.4rem,3.5vw,2.8rem)', overflow: 'visible' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                transition={{ duration: 0.45, ease }}
                style={{
                  position: 'absolute',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 900,
                  color: '#00d4ff',
                  fontSize: 'clamp(1rem, 2.5vw, 2rem)',
                  textShadow: '0 0 30px rgba(0,212,255,0.7), 0 0 60px rgba(0,212,255,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                {WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease }}
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: '-0.045em',
            margin: 0,
          }}
        >
          <div
            style={{
              fontSize: 'clamp(2.5rem, 8.5vw, 9.5rem)',
              background: 'linear-gradient(135deg, #00d4ff 0%, #6366f1 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            De la realidad
          </div>
          <div style={{ fontSize: 'clamp(2.5rem, 8.5vw, 9.5rem)', color: 'rgba(255,255,255,0.12)' }}>
            física al digital
          </div>
        </motion.h1>

        {/* Rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1.1, ease }}
          style={{
            transformOrigin: 'left',
            height: 1,
            background: 'linear-gradient(90deg, rgba(0,212,255,0.4), rgba(124,58,237,0.2), transparent)',
          }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8, ease }}
          style={{
            color: 'rgba(255,255,255,0.38)',
            fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
            lineHeight: 1.7,
            maxWidth: '38rem',
            margin: 0,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Cómo convierte una máquina las señales físicas del mundo real en decisiones que parecen inteligentes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}
        >
          <button
            onClick={onScrollDown}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.7rem 1.5rem',
              background: '#00d4ff', color: '#020818',
              borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 700,
              fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.05em',
              boxShadow: '0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2)',
              transition: 'all 200ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(0,212,255,0.8), 0 0 80px rgba(0,212,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2)')}
          >
            Comenzar <ChevronRight size={15} />
          </button>
          <button
            onClick={onJumpToConclusions}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)',
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.12)',
              textUnderlineOffset: 4, transition: 'color 200ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
          >
            Ver conclusiones
          </button>
        </motion.div>
      </div>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1.2 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
      >
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.14)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em' }}>
          Víctor Navarro · Física · 2025-26
        </span>
        <motion.span
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase' }}
        >
          → para avanzar
        </motion.span>
      </motion.div>
    </div>
  )
}
