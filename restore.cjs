// restore.cjs — AI Presentation design overhaul (v2)
// Design: Scientific Editorial Dark — Physics Lab meets TED Talk
const fs = require('fs')
const path = require('path')
const base = __dirname

function write(rel, content) {
  const full = path.join(base, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, content, 'utf8')
  console.log('✓', rel)
}

// ─── tailwind.config.js ──────────────────────────────────────────────────────
write('tailwind.config.js', `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#050810',
        cyan: { 300: '#33ddff', 400: '#00d4ff', 500: '#00aacc' },
        amber: { 400: '#FBBF24', 500: '#F59E0B' },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'sine-move': 'sineMove 3s linear infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
      },
      keyframes: {
        sineMove: {
          '0%': { strokeDashoffset: '60' },
          '100%': { strokeDashoffset: '0' },
        },
        pulseSlow: {
          '0%,100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
`)

// ─── index.html ──────────────────────────────────────────────────────────────
write('index.html', `<!doctype html>
<html lang="es" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>De la realidad fisica a la informacion digital</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Orbitron:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <style>html,body{margin:0;padding:0;background:#050810;overflow:hidden;}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`)

// ─── src/index.css ───────────────────────────────────────────────────────────
write('src/index.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Reveal.js overrides ─────────────────────────────────────────────── */
.reveal {
  font-family: 'Space Grotesk', sans-serif;
  background: transparent !important;
}
.reveal .slides { text-align: left; }
.reveal .slides section {
  position: relative;
  overflow: hidden;
  height: 100dvh;
  padding: 0 !important;
  top: 0 !important;
}
.reveal .progress { color: #00d4ff; height: 2px; }
.reveal .controls { color: #00d4ff; }
.reveal .controls button { opacity: 0.3; transition: opacity 200ms; }
.reveal .controls button:hover { opacity: 1; }

/* ── Ghost slide numbers ──────────────────────────────────────────────── */
.ghost-num {
  position: absolute;
  font-family: 'Orbitron', sans-serif;
  font-size: 28vw;
  font-weight: 900;
  color: rgba(255,255,255,0.022);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
  z-index: 0;
  line-height: 1;
  letter-spacing: -0.05em;
}

/* ── Eyebrow tags — flat, no glass ───────────────────────────────────── */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.18rem 0.6rem;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  border: 1px solid rgba(0,212,255,0.2);
  color: rgba(0,212,255,0.65);
  font-family: 'Space Grotesk', sans-serif;
}

/* ── Slide headings ───────────────────────────────────────────────────── */
.slide-h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 4.5vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.0;
  color: white;
  margin: 0;
}

/* ── Data cards — flat, no glass ─────────────────────────────────────── */
.data-card {
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  background: rgba(255,255,255,0.025);
  padding: 1.25rem 1.5rem;
}

/* ── Divider ──────────────────────────────────────────────────────────── */
.h-divider {
  width: 100%;
  height: 1px;
  background: rgba(255,255,255,0.07);
}

/* ── Monospace data ───────────────────────────────────────────────────── */
.mono-data {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: rgba(0,212,255,0.85);
  letter-spacing: 0.06em;
}

/* ── Diagram label ────────────────────────────────────────────────────── */
.diagram-label {
  font-size: 0.58rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.28);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
}

/* ── Sine wave animation ─────────────────────────────────────────────── */
@keyframes sineMove {
  from { stroke-dashoffset: 60; }
  to { stroke-dashoffset: 0; }
}
.animate-sine-move { animation: sineMove 3s linear infinite; }

/* ── Bezel (kept for slide compat) ───────────────────────────────────── */
.bezel-outer {
  padding: 1px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.02);
}
.bezel-inner {
  border-radius: 9px;
  background: rgba(0,0,0,0.4);
}

/* ── Glow text ───────────────────────────────────────────────────────── */
.glow-cyan-text {
  text-shadow: 0 0 16px rgba(0,212,255,0.45);
}

/* ── Loader ──────────────────────────────────────────────────────────── */
.loader {
  width: 2rem; height: 2rem;
  border: 2px solid rgba(0,212,255,0.15);
  border-top-color: #00d4ff;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Scrollbar hidden ─────────────────────────────────────────────────── */
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }
`)

// ─── src/App.tsx ──────────────────────────────────────────────────────────────
write('src/App.tsx', `import { useEffect, useRef, useState } from 'react'
import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'

import { SceneBackground } from '@/components/SceneBackground'

import { Slide01Cover } from '@/components/slides/Slide01Cover'
import { Slide02Question } from '@/components/slides/Slide02Question'
import { Slide03Digitalization } from '@/components/slides/Slide03Digitalization'
import { Slide04Sampling } from '@/components/slides/Slide04Sampling'
import { Slide05PhysicalData } from '@/components/slides/Slide05PhysicalData'
import { Slide06AIModels } from '@/components/slides/Slide06AIModels'
import { Slide07MachineLearning } from '@/components/slides/Slide07MachineLearning'
import { Slide08NeuralNetworks } from '@/components/slides/Slide08NeuralNetworks'
import { Slide09Applications1 } from '@/components/slides/Slide09Applications1'
import { Slide10Applications2 } from '@/components/slides/Slide10Applications2'
import { Slide11Limits } from '@/components/slides/Slide11Limits'
import { Slide12Conclusions } from '@/components/slides/Slide12Conclusions'

export default function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deckRef = useRef<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deck = new (Reveal as any)({
      transition: 'fade',
      transitionSpeed: 'default',
      controls: true,
      progress: true,
      hash: true,
      touch: true,
      embedded: false,
      center: false,
      width: '100%',
      height: '100%',
      margin: 0,
      minScale: 1,
      maxScale: 1,
      navigationMode: 'linear',
    })
    deck.initialize().then(() => {
      deckRef.current = deck
      deck.on('slidechanged', (e: { indexh: number }) => setCurrentSlide(e.indexh))
    })
    return () => {
      try { deck.destroy() } catch (_) {}
    }
  }, [])

  function goToSlide(index: number) {
    deckRef.current?.slide(index, 0, 0)
  }

  return (
    <div style={{ background: '#050810', width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      <SceneBackground />
      <div className="reveal" style={{ zIndex: 2, position: 'relative' }}>
        <div className="slides">
          <Slide01Cover
            onScrollDown={() => goToSlide(1)}
            onJumpToConclusions={() => goToSlide(11)}
          />
          <Slide02Question active={currentSlide === 1} />
          <Slide03Digitalization />
          <Slide04Sampling active={currentSlide === 3} />
          <Slide05PhysicalData />
          <Slide06AIModels />
          <Slide07MachineLearning active={currentSlide === 6} />
          <Slide08NeuralNetworks active={currentSlide === 7} />
          <Slide09Applications1 />
          <Slide10Applications2 active={currentSlide === 9} />
          <Slide11Limits />
          <Slide12Conclusions active={currentSlide === 11} />
        </div>
      </div>
    </div>
  )
}
`)

// ─── src/components/SceneBackground.tsx ──────────────────────────────────────
write('src/components/SceneBackground.tsx', `export function SceneBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {/* Fine dot grid — gives a physics-lab / oscilloscope feel */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dotgrid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.65" fill="rgba(0,212,255,0.11)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>
      {/* Ambient glow top-right */}
      <div style={{
        position: 'absolute', top: '-18%', right: '-12%',
        width: '62vw', height: '62vw', borderRadius: '50%', opacity: 0.055,
        background: 'radial-gradient(circle, #00d4ff 0%, transparent 68%)',
      }} />
      {/* Ambient glow bottom-left */}
      <div style={{
        position: 'absolute', bottom: '-22%', left: '-12%',
        width: '50vw', height: '50vw', borderRadius: '50%', opacity: 0.03,
        background: 'radial-gradient(circle, #6366f1 0%, transparent 68%)',
      }} />
    </div>
  )
}
`)

// Keep ParticleBackground as re-export alias for backward compat
write('src/components/ParticleBackground.tsx', `export { SceneBackground as ParticleBackground } from './SceneBackground'
`)

// ─── animated-hero.tsx — editorial cover, no rotating words ─────────────────
write('src/components/ui/animated-hero.tsx', `import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface HeroProps {
  onScrollDown?: () => void
  onJumpToConclusions?: () => void
}

function Hero({ onScrollDown, onJumpToConclusions }: HeroProps) {
  const ease = [0.23, 1, 0.32, 1] as const

  return (
    <div
      className="relative w-full flex flex-col justify-between font-grotesk"
      style={{ height: '100dvh', padding: 'clamp(2rem, 4vw, 4rem) clamp(2rem, 6vw, 6rem)' }}
    >
      {/* Top metadata */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1.2 }}
        style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '0.58rem', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
        }}
      >
        <span>Bachillerato · Física y Tecnología · 2026</span>
        <span>01 / 12</span>
      </motion.div>

      {/* Main title block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem,3vw,2.5rem)', margin: 'auto 0', padding: 'clamp(2rem,5vh,5rem) 0' }}>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease }}
          style={{ fontWeight: 700, textTransform: 'uppercase', lineHeight: 0.86, letterSpacing: '-0.045em', margin: 0 }}
        >
          <div style={{ fontSize: 'clamp(2.2rem,7.8vw,9rem)', color: '#ffffff' }}>
            De la realidad
          </div>
          <div style={{ fontSize: 'clamp(2.2rem,7.8vw,9rem)', color: '#00d4ff' }}>
            física
          </div>
          <div style={{ fontSize: 'clamp(2.2rem,7.8vw,9rem)', color: 'rgba(255,255,255,0.5)' }}>
            a la información
          </div>
          <div style={{ fontSize: 'clamp(2.2rem,7.8vw,9rem)', color: 'rgba(255,255,255,0.17)' }}>
            digital
          </div>
        </motion.h1>

        {/* Rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1.1, ease }}
          style={{ transformOrigin: 'left', height: '1px', background: 'rgba(255,255,255,0.09)' }}
        />

        {/* Question */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8, ease }}
          style={{
            color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(0.9rem,1.5vw,1.2rem)',
            lineHeight: 1.65, maxWidth: '36rem', margin: 0, fontWeight: 400,
          }}
        >
          Cómo convierte una máquina las señales físicas del mundo real
          en decisiones que parecen inteligentes.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}
        >
          <button
            onClick={onScrollDown}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.65rem 1.35rem', background: '#00d4ff', color: '#050810',
              borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
              transition: 'background 200ms, transform 160ms cubic-bezier(0.23,1,0.32,1)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#33ddff')}
            onMouseLeave={e => (e.currentTarget.style.background = '#00d4ff')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Comenzar
            <ChevronRight style={{ width: '0.9rem', height: '0.9rem' }} />
          </button>
          <button
            onClick={onJumpToConclusions}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', color: 'rgba(255,255,255,0.28)', fontFamily: 'inherit',
              textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.13)',
              textUnderlineOffset: '4px', transition: 'color 200ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
          >
            Ver conclusiones
          </button>
        </motion.div>
      </div>

      {/* Bottom author */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1.2 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
      >
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.16)', letterSpacing: '0.07em' }}>
          Marta Sertano Megías
        </span>
        <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          IA · Física · Procesamiento de Señales
        </span>
      </motion.div>
    </div>
  )
}

export { Hero }
`)

// ─── button.tsx ───────────────────────────────────────────────────────────────
write('src/components/ui/button.tsx', `import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-[160ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'rounded-[6px] bg-cyan-400 text-[#050810] font-semibold hover:bg-cyan-300',
        destructive: 'rounded-[6px] bg-red-500 text-white hover:bg-red-400',
        outline: 'rounded-[6px] border border-white/[0.12] bg-white/[0.03] text-white/75 hover:bg-white/[0.07] hover:text-white',
        secondary: 'rounded-[6px] bg-white/[0.06] text-white/75 hover:bg-white/[0.10]',
        ghost: 'text-white/45 hover:text-white/80 hover:bg-white/[0.04] rounded-[6px]',
        link: 'text-cyan-400 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-6 text-[0.88rem]',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
`)

// ─── card.tsx ─────────────────────────────────────────────────────────────────
write('src/components/ui/card.tsx', `import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-[10px] bg-white/[0.025] border border-white/[0.07]', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-xl font-bold leading-none tracking-tight font-grotesk', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-white/45 font-grotesk leading-relaxed', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`)

// ─── spotlight.tsx ────────────────────────────────────────────────────────────
write('src/components/ui/spotlight.tsx', `import { useEffect, useRef } from 'react'

interface SpotlightProps {
  className?: string
  fill?: string
}

export function Spotlight({ className = '', fill = 'rgba(0,212,255,0.08)' }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parent = el.parentElement
    if (!parent) return
    function onMove(e: MouseEvent) {
      const rect = parent!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el!.style.background = \`radial-gradient(480px circle at \${x}px \${y}px, \${fill}, transparent 70%)\`
    }
    parent.addEventListener('mousemove', onMove)
    return () => parent.removeEventListener('mousemove', onMove)
  }, [fill])

  return (
    <div
      ref={ref}
      className={\`pointer-events-none absolute inset-0 z-[1] \${className}\`}
      style={{ background: \`radial-gradient(480px circle at 50% 30%, \${fill}, transparent 70%)\` }}
    />
  )
}
`)

console.log('\n✅ AI Presentation v2 — design overhaul complete!')
