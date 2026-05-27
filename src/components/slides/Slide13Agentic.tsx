import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Brain, Layers, Eye, Phone, PhoneOff, Mic } from 'lucide-react'
import { AutonomousAgent3D } from '@/components/AutonomousAgent3D'

const VAPI_PUBLIC_KEY = (import.meta.env.VITE_VAPI_PUBLIC_KEY as string) || '5d3e7926-3cdd-477b-8bc8-736a093bb48d'
const VAPI_ASSISTANT_ID = (import.meta.env.VITE_VAPI_ASSISTANT_ID as string) || 'c5c43d40-74b0-436c-af8c-60f47aaacf26'
const VAPI_DEMO_URL = 'https://vapi.ai?demo=true&shareKey=5d3e7926-3cdd-477b-8bc8-736a093bb48d&assistantId=c5c43d40-74b0-436c-af8c-60f47aaacf26'

type CallState = 'idle' | 'connecting' | 'active' | 'ended'
interface Props { active: boolean }

const STEPS = [
  { label: 'Percepción',   sub: 'Sensores · Input',      color: '#00d4ff', icon: '👁' },
  { label: 'Razonamiento', sub: 'Procesa contexto',       color: '#6366f1', icon: '🧠' },
  { label: 'Planificación',sub: 'Define pasos',           color: '#8b5cf6', icon: '📋' },
  { label: 'Acción',       sub: 'APIs · Herramientas',    color: '#a78bfa', icon: '⚡' },
  { label: 'Memoria',      sub: 'RAG · Historial',        color: '#c4b5fd', icon: '💾' },
]

const TOOLS: Record<number, string[]> = {
  0: ['Vision', 'NLP', 'Audio'],
  1: ['LLM', 'CoT', 'Context'],
  2: ['Goals', 'Subtasks', 'Priority'],
  3: ['Web', 'Code', 'DB'],
  4: ['Embed', 'Store', 'Retrieve'],
}

const N = STEPS.length
const CX = 170, CY = 148, R_ORBIT = 96, R_OUTER = 130

function stepAngle(i: number) { return (-Math.PI / 2) + (i / N) * Math.PI * 2 }
function stepXY(i: number, r = R_ORBIT) {
  const a = stepAngle(i)
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

export function AgentCycle({ active }: { active: boolean }) {
  const rafRef = useRef<number | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)  // 0-1 within current step

  useEffect(() => {
    if (!active) { setActiveStep(0); setProgress(0); return }
    const STEP_MS = 950
    let start = performance.now()
    let step = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const p = (elapsed % STEP_MS) / STEP_MS
      const s = Math.floor(elapsed / STEP_MS) % N
      if (s !== step) { step = s; setActiveStep(s) }
      setProgress(p)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [active])

  // Pulse particle position: travels from activeStep to next
  const a1 = stepAngle(activeStep)
  const a2 = stepAngle((activeStep + 1) % N)
  let da = a2 - a1
  if (da > Math.PI) da -= 2 * Math.PI
  if (da < -Math.PI) da += 2 * Math.PI
  const pulseA = a1 + da * progress
  const pulse = { x: CX + R_ORBIT * Math.cos(pulseA), y: CY + R_ORBIT * Math.sin(pulseA) }
  const activeColor = STEPS[activeStep].color

  // Arc path from step i to step i+1 (clockwise, short arc)
  function arcPath(i: number) {
    const p1 = stepXY(i)
    const p2 = stepXY((i + 1) % N)
    return `M ${p1.x} ${p1.y} A ${R_ORBIT} ${R_ORBIT} 0 0 1 ${p2.x} ${p2.y}`
  }

  return (
    <div className="flex flex-col items-center w-full">
      <svg viewBox="0 0 340 296" className="w-full" style={{ maxWidth: 340 }}>
        <defs>
          {STEPS.map((s, i) => (
            <radialGradient key={i} id={`ng${i}`} cx="40%" cy="35%">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.25" />
            </radialGradient>
          ))}
          <radialGradient id="centerGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </radialGradient>
          <filter id="bloom">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Orbit track */}
        <circle cx={CX} cy={CY} r={R_ORBIT}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 3" />

        {/* Radial spokes from center to each node */}
        {STEPS.map((s, i) => {
          const { x, y } = stepXY(i)
          const isActive = activeStep === i
          return (
            <line key={i}
              x1={CX} y1={CY} x2={x} y2={y}
              stroke={isActive ? s.color : 'rgba(255,255,255,0.04)'}
              strokeWidth={isActive ? 1 : 0.5}
              style={{ transition: 'all 0.3s' }}
            />
          )
        })}

        {/* Arcs between steps */}
        {STEPS.map((_, i) => {
          const isActive = activeStep === i
          return (
            <path key={i} d={arcPath(i)}
              fill="none"
              stroke={isActive ? STEPS[i].color : 'rgba(255,255,255,0.08)'}
              strokeWidth={isActive ? 2 : 0.8}
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s', filter: isActive ? `drop-shadow(0 0 4px ${STEPS[i].color})` : 'none' }}
            />
          )
        })}

        {/* Traveling pulse particle */}
        <circle cx={pulse.x} cy={pulse.y} r={5.5}
          fill={activeColor}
          style={{ filter: `drop-shadow(0 0 10px ${activeColor})` }}
        />
        <circle cx={pulse.x} cy={pulse.y} r={10}
          fill={activeColor} opacity="0.15"
        />

        {/* Tool labels in outer ring */}
        {TOOLS[activeStep].map((tool, ti) => {
          const baseAngle = stepAngle(activeStep)
          const spread = 0.32
          const a = baseAngle + (ti - 1) * spread
          const tx = CX + R_OUTER * Math.cos(a)
          const ty = CY + R_OUTER * Math.sin(a)
          return (
            <text key={ti} x={tx} y={ty}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="7.5" fontFamily="Inter, sans-serif"
              fill={activeColor} opacity="0.7"
            >
              {tool}
            </text>
          )
        })}

        {/* Step nodes */}
        {STEPS.map((s, i) => {
          const { x, y } = stepXY(i)
          const isActive = activeStep === i
          const nr = isActive ? 22 : 16
          // Label position: push outward
          const a = stepAngle(i)
          const lx = CX + (R_ORBIT + 34) * Math.cos(a)
          const ly = CY + (R_ORBIT + 34) * Math.sin(a)
          const subly = CY + (R_ORBIT + 46) * Math.sin(a)
          return (
            <g key={i} style={{ transition: 'all 0.3s' }}>
              {/* Outer glow ring on active */}
              {isActive && (
                <circle cx={x} cy={y} r={nr + 8}
                  fill={`${s.color}12`}
                  stroke={s.color} strokeWidth="0.5" opacity="0.5"
                  style={{ filter: `drop-shadow(0 0 12px ${s.color})` }}
                />
              )}
              {/* Node body */}
              <circle cx={x} cy={y} r={nr}
                fill={isActive ? `url(#ng${i})` : `${s.color}18`}
                stroke={s.color}
                strokeWidth={isActive ? 1.8 : 0.8}
                style={{
                  filter: isActive ? `drop-shadow(0 0 10px ${s.color})` : 'none',
                  transition: 'all 0.35s',
                }}
              />
              {/* Icon */}
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={isActive ? 14 : 11}>
                {s.icon}
              </text>
              {/* Labels outside orbit */}
              <text x={lx} y={ly - 5}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={isActive ? 9 : 8}
                fontFamily="Orbitron, sans-serif"
                fontWeight="bold"
                fill={isActive ? s.color : 'rgba(255,255,255,0.4)'}
                style={{ transition: 'all 0.3s' }}
              >
                {s.label}
              </text>
              <text x={lx} y={subly + 3}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="6.5" fontFamily="Inter, sans-serif"
                fill={isActive ? `${s.color}90` : 'rgba(255,255,255,0.2)'}
                style={{ transition: 'all 0.3s' }}
              >
                {s.sub}
              </text>
            </g>
          )
        })}

        {/* Central brain — 3 concentric rings + core */}
        <circle cx={CX} cy={CY} r={38}
          fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="1"
        />
        <circle cx={CX} cy={CY} r={28}
          fill="rgba(0,212,255,0.05)"
          stroke={activeColor} strokeWidth="1"
          style={{ filter: `drop-shadow(0 0 8px ${activeColor})`, transition: 'all 0.4s' }}
        />
        <circle cx={CX} cy={CY} r={18}
          fill="url(#centerGrad)"
          style={{ filter: `drop-shadow(0 0 16px ${activeColor})`, transition: 'all 0.4s' }}
        />
        {/* AI label */}
        <text x={CX} y={CY - 3}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fontFamily="Orbitron, sans-serif" fontWeight="900"
          fill="white" opacity="0.95"
        >
          AI
        </text>
        <text x={CX} y={CY + 8}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="6" fontFamily="Inter, sans-serif"
          fill="rgba(255,255,255,0.5)"
        >
          AGENTE
        </text>
      </svg>

      {/* Step label strip */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 mt-1"
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: activeColor, boxShadow: `0 0 8px ${activeColor}` }} />
        <span className="font-orbitron text-xs font-bold" style={{ color: activeColor }}>
          {STEPS[activeStep].label}
        </span>
        <span className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          — {STEPS[activeStep].sub}
        </span>
      </motion.div>
    </div>
  )
}

const CAPS = [
  { icon: Brain, label: 'Planificación de tareas', sub: 'Descompone objetivos complejos en pasos', color: '#8b5cf6' },
  { icon: Layers, label: 'Memoria de contexto', sub: 'Recuerda toda la conversación', color: '#00d4ff' },
  { icon: Eye, label: 'Comprensión multimodal', sub: 'Texto, voz, imágenes, documentos', color: '#10b981' },
]

export function Slide13Agentic({ active }: Props) {
  const [callState, setCallState] = useState<CallState>('idle')
  const [audioLevel, setAudioLevel] = useState<number[]>(Array(22).fill(2))
  const vapiRef = useRef<any>(null)
  const audioIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) endCall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  async function startCall() {
    setCallState('connecting')
    try {
      const { default: Vapi } = await import('@vapi-ai/web')
      const vapi = new Vapi(VAPI_PUBLIC_KEY)
      vapiRef.current = vapi
      vapi.on('call-start', () => {
        setCallState('active')
        startAudioVisualization()
      })
      vapi.on('call-end', () => {
        setCallState('ended')
        stopAudioVisualization()
      })
      vapi.on('volume-level', (level: number) => {
        setAudioLevel(prev => [...prev.slice(1), Math.max(3, level * 55)])
      })
      await vapi.start(VAPI_ASSISTANT_ID)
    } catch (err) {
      console.error('Vapi SDK error, opening demo URL:', err)
      setCallState('idle')
      window.open(VAPI_DEMO_URL, '_blank', 'noopener')
    }
  }

  function endCall() {
    if (vapiRef.current) { vapiRef.current.stop(); vapiRef.current = null }
    stopAudioVisualization()
    setCallState('idle')
    setAudioLevel(Array(22).fill(2))
  }

  function startAudioVisualization() {
    audioIntervalRef.current = setInterval(() => {
      setAudioLevel(() => Array(22).fill(0).map(() => 2 + Math.random() * 28))
    }, 80)
  }

  function stopAudioVisualization() {
    if (audioIntervalRef.current) { clearInterval(audioIntervalRef.current); audioIntervalRef.current = null }
  }

  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-8 md:px-14 gap-6">
        <span className="ghost-num">12</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2">
            <span className="eyebrow">La Nueva Frontera</span>
            <h2 className="slide-title gradient-text text-center">Sistemas Agénticos</h2>
            <p className="font-inter text-white/35 text-sm text-center">De modelos aislados a agentes autónomos</p>
          </div>

          {/* 3D Agent visualization — main element */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              height: 340,
              border: '1px solid rgba(139,92,246,0.2)',
              background: 'rgba(0,2,12,0.7)',
            }}
          >
            <AutonomousAgent3D />
            <div className="absolute top-3 left-0 right-0 flex justify-center z-10 pointer-events-none">
              <span className="font-orbitron text-[0.6rem] tracking-widest uppercase"
                style={{ color: 'rgba(139,92,246,0.5)' }}>
                Arquitectura — Agente Autónomo en Tiempo Real
              </span>
            </div>
          </div>

          {/* Bot vs Capabilities row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Bot tradicional */}
            <div className="glass-card p-4 flex flex-col gap-2">
              <div className="text-xs font-orbitron text-white/25 tracking-widest uppercase text-center">Bot tradicional</div>
              <div className="flex items-center justify-center gap-2">
                {['Entrada', '→', 'IF/ELSE', '→', 'Respuesta fija'].map((s, i) => (
                  <span key={i} className="text-xs font-inter"
                    style={{ color: i % 2 === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.45)',
                             background: i % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'none',
                             padding: i % 2 === 0 ? '2px 8px' : '0',
                             borderRadius: 6 }}>
                    {s}
                  </span>
                ))}
              </div>
              <div className="font-inter text-xs text-white/20 text-center">Árbol de decisión fijo — frágil, sin contexto</div>
            </div>

            {/* Capability cards */}
            <div className="flex flex-col gap-2">
              {CAPS.map(({ icon: Icon, label, sub, color }) => (
                <div key={label} className="glass-card p-2.5 flex items-center gap-2.5" style={{ borderColor: `${color}18` }}>
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
                    <Icon size={12} color={color} />
                  </div>
                  <div>
                    <div className="font-inter text-xs font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</div>
                    <div className="font-inter text-[0.65rem] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vapi Live Demo */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.18)' }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="eyebrow"
                  style={{ borderColor: 'rgba(0,212,255,0.3)', color: 'rgba(0,212,255,0.8)', background: 'rgba(0,212,255,0.06)' }}
                >
                  DEMO EN VIVO
                </span>
                <span className="font-inter text-xs text-white/30">
                  Agente de voz construido con IA · conversación natural en tiempo real
                </span>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {(callState === 'idle' || callState === 'ended') && (
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={startCall}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-orbitron font-bold text-sm tracking-wider cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(139,92,246,0.18))',
                      border: '1px solid rgba(0,212,255,0.4)',
                      color: '#00d4ff',
                      boxShadow: '0 0 20px rgba(0,212,255,0.12)',
                    }}
                  >
                    <Phone size={15} />
                    {callState === 'ended' ? '↺ REINICIAR LLAMADA' : '▶ INICIAR LLAMADA EN VIVO'}
                  </motion.button>
                )}

                {callState === 'connecting' && (
                  <motion.div
                    animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-orbitron font-bold text-sm"
                    style={{ border: '1px solid rgba(251,191,36,0.4)', color: '#FBBF24' }}
                  >
                    <Mic size={15} />
                    CONECTANDO...
                  </motion.div>
                )}

                {callState === 'active' && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-end gap-0.5" style={{ height: 34 }}>
                      {audioLevel.map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: h }}
                          transition={{ duration: 0.07 }}
                          style={{
                            width: 5, borderRadius: 99, minHeight: 3,
                            background: `rgba(0,212,255,${0.35 + (h / 55) * 0.65})`,
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={endCall}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl font-orbitron font-bold text-xs tracking-wider cursor-pointer"
                      style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#ef4444' }}
                    >
                      <PhoneOff size={13} />
                      ■ FINALIZAR LLAMADA
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <motion.div
                    animate={callState === 'active' ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: callState === 'active' ? '#10b981' : callState === 'connecting' ? '#FBBF24' : 'rgba(255,255,255,0.15)',
                      boxShadow: callState === 'active' ? '0 0 8px #10b981' : 'none',
                    }}
                  />
                  <span className="text-xs font-inter text-white/35">
                    {callState === 'idle' ? 'Listo para conectar' : callState === 'connecting' ? 'Iniciando...' : callState === 'active' ? 'En llamada' : 'Llamada finalizada'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="notes">
        • Lo que ha cambiado radicalmente en los últimos 3 años: la capacidad de conectar modelos en sistemas que planifican, recuerdan y actúan de forma autónoma. Eso es lo que hace el momento actual cualitativamente diferente.
        • Un bot tradicional sigue árboles de decisión fijos — frágil ante cualquier variación. Un agente autónomo percibe, razona, planifica, actúa y recuerda, en ciclo continuo.
        • Las 3 capacidades clave: planificación de tareas (descompone objetivos complejos), memoria de contexto (recuerda toda la conversación), comprensión multimodal (entiende texto, voz, imágenes).
        • DEMO: este agente de voz fue construido con IA. Puede mantener una conversación, responder preguntas y adaptarse al contexto en tiempo real.
      </aside>
    </section>
  )
}
