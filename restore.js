// restore.js — fixes all hook-contaminated files for the AI presentation
const fs = require('fs')
const path = require('path')
const base = __dirname

function write(rel, content) {
  const full = path.join(base, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, content, 'utf8')
  console.log('✓', rel)
}

// ─── tailwind.config.js ────────────────────────────────────────────────────
write('tailwind.config.js', `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#050810',
        cyan: { 300: '#33ddff', 400: '#00d4ff', 500: '#00aacc' },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%,100%': { opacity: '1' },
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
    <title>De la realidad física a la información digital</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>html,body{margin:0;padding:0;background:#050810;}</style>
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
.reveal .slides {
  text-align: left;
}
.reveal .slides section {
  position: relative;
  overflow: hidden;
  height: 100dvh;
  padding: 0;
  top: 0 !important;
}
.reveal .progress {
  color: #00d4ff;
}
.reveal .controls {
  color: #00d4ff;
}

/* ── Ghost slide numbers ──────────────────────────────────────────────── */
.ghost-num {
  position: absolute;
  font-family: 'Orbitron', sans-serif;
  font-size: 28vw;
  font-weight: 900;
  color: rgba(255,255,255,0.025);
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  pointer-events: none;
  user-select: none;
  z-index: 0;
  line-height: 1;
}

/* ── Eyebrow tags ─────────────────────────────────────────────────────── */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border: 1px solid rgba(0,212,255,0.2);
  background: rgba(0,212,255,0.08);
  color: #00d4ff;
}

/* ── Double-bezel card ───────────────────────────────────────────────── */
.bezel-outer {
  padding: 3px;
  border-radius: 2rem;
  background: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
  box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
}
.bezel-inner {
  border-radius: calc(2rem - 3px);
  background: rgba(0,0,0,0.8);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.07);
}

/* ── Glow text ───────────────────────────────────────────────────────── */
.glow-cyan-text {
  text-shadow: 0 0 20px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2);
}

/* ── Loader spinner ──────────────────────────────────────────────────── */
.loader {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(0,212,255,0.2);
  border-top-color: #00d4ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Scrollbars ──────────────────────────────────────────────────────── */
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }
`)

// ─── src/App.tsx ──────────────────────────────────────────────────────────────
write('src/App.tsx', `import { useEffect, useRef, useState } from 'react'
import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'

import { ParticleBackground } from '@/components/ParticleBackground'

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
      transitionSpeed: 'slow',
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
      <ParticleBackground />
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

// ─── src/components/ParticleBackground.tsx ───────────────────────────────────
write('src/components/ParticleBackground.tsx', `import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  radius: number; opacity: number; color: string
}

const COLORS = [
  'rgba(0,212,255,',   // cyan
  'rgba(51,221,255,',  // light cyan
  'rgba(0,170,204,',   // deep cyan
]

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function initParticles() {
      if (!canvas) return
      particlesRef.current = Array.from({ length: 75 }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.4,
        opacity: Math.random() * 0.4 + 0.07,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const particles = particlesRef.current

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.08
            ctx.beginPath()
            ctx.strokeStyle = \`rgba(0,212,255,\${alpha})\`
            ctx.lineWidth = 0.5
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = \`\${p.color}\${p.opacity})\`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    const handleResize = () => { resize(); initParticles() }
    resize(); initParticles(); draw()
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
`)

// ─── src/components/ui/animated-hero.tsx ─────────────────────────────────────
write('src/components/ui/animated-hero.tsx', `import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MoveRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  onScrollDown?: () => void
  onJumpToConclusions?: () => void
}

function Hero({ onScrollDown, onJumpToConclusions }: HeroProps) {
  const [titleNumber, setTitleNumber] = useState(0)
  const titles = useMemo(
    () => ['datos', 'modelos', 'redes', 'predicciones', 'decisiones'],
    []
  )

  useEffect(() => {
    const id = setTimeout(() => {
      setTitleNumber(prev => (prev === titles.length - 1 ? 0 : prev + 1))
    }, 2000)
    return () => clearTimeout(id)
  }, [titleNumber, titles])

  return (
    <div className="w-full h-full flex items-center justify-center px-4" style={{ minHeight: '100dvh' }}>
      <div className="flex gap-8 items-center justify-center flex-col max-w-3xl">

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6, bounce: 0.12 }}
          className="eyebrow"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Proyecto de Investigación · Física &amp; IA
        </motion.div>

        <div className="flex gap-4 flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.7, bounce: 0.08, delay: 0.08 }}
            className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-orbitron font-bold text-white leading-[1.05]"
          >
            <span>La IA funciona con</span>
            <span className="relative flex w-full justify-center overflow-hidden md:pb-4 md:pt-2 mt-1">
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-extrabold text-cyan-400 glow-cyan-text"
                  initial={{ opacity: 0, y: -100 }}
                  transition={{ type: 'spring', stiffness: 55, damping: 16 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.7, bounce: 0.08, delay: 0.16 }}
            className="text-base md:text-lg leading-relaxed text-white/50 max-w-xl text-center font-grotesk"
          >
            ¿Cómo pasa una máquina de recibir datos físicos del mundo real
            a tomar decisiones que parecen inteligentes?{' '}
            <span className="text-white/75 font-medium">De la realidad física a la información digital.</span>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.7, bounce: 0.08, delay: 0.24 }}
          className="flex flex-row gap-3 flex-wrap justify-center"
        >
          <Button
            size="lg"
            className="gap-3 bg-cyan-400 text-black hover:bg-cyan-300 font-grotesk font-semibold animate-pulse-soft"
            onClick={onScrollDown}
          >
            Comenzar presentación
            <span className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center">
              <MoveRight className="w-3.5 h-3.5" />
            </span>
          </Button>
          <Button size="lg" variant="outline" className="font-grotesk" onClick={onJumpToConclusions}>
            Ver conclusiones
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/20 text-xs font-grotesk tracking-widest uppercase"
        >
          Marta Sertano · Bachillerato · 2026
        </motion.p>
      </div>
    </div>
  )
}

export { Hero }
`)

// ─── src/components/ui/button.tsx ────────────────────────────────────────────
write('src/components/ui/button.tsx', `import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-transform duration-[160ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:bg-cyan-300',
        destructive: 'bg-red-500 text-white hover:bg-red-400',
        outline: 'border border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm',
        secondary: 'bg-white/10 text-white hover:bg-white/15',
        ghost: 'text-white/70 hover:text-white hover:bg-white/5',
        link: 'text-cyan-400 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-7 text-base',
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

// ─── src/components/ui/card.tsx ──────────────────────────────────────────────
write('src/components/ui/card.tsx', `import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[2rem] bg-black/[0.85] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] backdrop-blur-xl',
        className
      )}
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
    <h3 ref={ref} className={cn('text-2xl font-bold leading-none tracking-tight font-orbitron', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-white/50 font-grotesk', className)} {...props} />
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

// ─── src/components/ui/spotlight.tsx ─────────────────────────────────────────
write('src/components/ui/spotlight.tsx', `import { useEffect, useRef } from 'react'

interface SpotlightProps {
  className?: string
  fill?: string
}

export function Spotlight({ className = '', fill = 'rgba(0,212,255,0.12)' }: SpotlightProps) {
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
      el!.style.background = \`radial-gradient(600px circle at \${x}px \${y}px, \${fill}, transparent 70%)\`
    }

    parent.addEventListener('mousemove', onMove)
    return () => parent.removeEventListener('mousemove', onMove)
  }, [fill])

  return (
    <div
      ref={ref}
      className={\`pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300 \${className}\`}
      style={{ background: \`radial-gradient(600px circle at 50% 30%, \${fill}, transparent 70%)\` }}
    />
  )
}
`)

console.log('\\n✅ All files restored for AI presentation!')
