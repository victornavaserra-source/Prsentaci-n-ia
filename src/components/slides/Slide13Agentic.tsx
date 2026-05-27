import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Brain, Layers, Eye, Phone, PhoneOff, Mic } from 'lucide-react'

const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY as string
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID as string

type CallState = 'idle' | 'connecting' | 'active' | 'ended'
interface Props { active: boolean }

const CYCLE_STEPS = [
  { label: 'Percepción', color: '#00d4ff' },
  { label: 'Razonamiento', color: '#6366f1' },
  { label: 'Planificación', color: '#8b5cf6' },
  { label: 'Acción', color: '#a78bfa' },
  { label: 'Memoria', color: '#c4b5fd' },
]

function AgentCycle({ active }: { active: boolean }) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setActiveStep(s => (s + 1) % CYCLE_STEPS.length), 750)
    return () => clearInterval(id)
  }, [active])

  const cx = 70, cy = 68, r = 48
  const n = CYCLE_STEPS.length

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 140 136" width="140" height="136">
        {CYCLE_STEPS.map((step, i) => {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2
          const nextAngle = (((i + 1) % n) / n) * Math.PI * 2 - Math.PI / 2
          const x1 = cx + r * Math.cos(angle)
          const y1 = cy + r * Math.sin(angle)
          const x2 = cx + r * Math.cos(nextAngle)
          const y2 = cy + r * Math.sin(nextAngle)
          const isActive = activeStep === i
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isActive ? step.color : 'rgba(255,255,255,0.1)'}
                strokeWidth={isActive ? 2 : 1}
                style={{ transition: 'all 0.3s' }}
              />
              <circle cx={x1} cy={y1} r={isActive ? 9 : 6}
                fill={isActive ? `${step.color}25` : 'rgba(255,255,255,0.04)'}
                stroke={isActive ? step.color : 'rgba(255,255,255,0.18)'}
                strokeWidth="1.5"
                style={{ transition: 'all 0.3s', filter: isActive ? `drop-shadow(0 0 6px ${step.color})` : 'none' }}
              />
              <circle cx={x1} cy={y1} r={3}
                fill={isActive ? step.color : 'rgba(255,255,255,0.25)'}
                style={{ transition: 'all 0.3s' }}
              />
            </g>
          )
        })}
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize="22">🤖</text>
      </svg>
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
        className="font-orbitron text-xs font-bold text-center"
        style={{ color: CYCLE_STEPS[activeStep].color, minWidth: 100 }}
      >
        {CYCLE_STEPS[activeStep].label}
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
      console.error('Vapi error:', err)
      setCallState('idle')
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

          {/* Bot vs Agent comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 flex flex-col items-center gap-3">
              <div className="text-xs font-orbitron text-white/25 tracking-widest uppercase">Bot tradicional</div>
              <div className="flex flex-col items-center gap-1.5">
                {['Entrada', 'IF / ELSE', 'Respuesta fija'].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="px-4 py-1.5 rounded-lg text-xs font-inter font-semibold text-white/45 text-center"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', minWidth: 110 }}
                    >
                      {s}
                    </div>
                    {i < 2 && <div className="w-px h-2.5" style={{ background: 'rgba(255,255,255,0.12)' }} />}
                  </div>
                ))}
              </div>
              <div className="font-inter text-xs text-white/20 text-center">Árbol de decisión fijo</div>
            </div>

            <div
              className="glass-card p-4 flex flex-col items-center gap-3"
              style={{ borderColor: 'rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.04)' }}
            >
              <div className="text-xs font-orbitron tracking-widest uppercase" style={{ color: 'rgba(139,92,246,0.6)' }}>
                Agente Autónomo IA
              </div>
              <AgentCycle active={active} />
            </div>
          </div>

          {/* Capability cards */}
          <div className="grid grid-cols-3 gap-3">
            {CAPS.map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="glass-card p-3 flex items-start gap-2.5" style={{ borderColor: `${color}20` }}>
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                  style={{ background: `${color}12`, border: `1px solid ${color}28` }}
                >
                  <Icon size={14} color={color} />
                </div>
                <div>
                  <div className="font-inter text-xs font-semibold text-white/65 leading-tight">{label}</div>
                  <div className="font-inter text-xs text-white/28 leading-tight mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
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
