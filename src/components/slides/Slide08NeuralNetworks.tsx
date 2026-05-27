import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'

const LAYERS = [
  { nodes: 4, label: 'Entrada', color: '#00d4ff' },
  { nodes: 6, label: 'Oculta 1', color: '#6366f1' },
  { nodes: 6, label: 'Oculta 2', color: '#8b5cf6' },
  { nodes: 5, label: 'Oculta 3', color: '#a78bfa' },
  { nodes: 2, label: 'Salida', color: '#10b981' },
]

type Pulse = { edgeId: number; progress: number }

function NeuralNetwork3D({ active }: { active: boolean }) {
  const [activePulses, setActivePulses] = useState<Pulse[]>([])
  const [litNodes, setLitNodes] = useState<Set<string>>(new Set())
  const rafRef = useRef<number | null>(null)

  const W = 480, H = 200
  const PAD_X = 44, PAD_Y = 22

  const layerX = LAYERS.map((_, i) => PAD_X + (i / (LAYERS.length - 1)) * (W - PAD_X * 2))

  const nodePos: [number, number][][] = LAYERS.map((layer, li) => {
    const x = layerX[li]
    const totalH = H - PAD_Y * 2
    return Array.from({ length: layer.nodes }, (_, ni) => {
      const y = layer.nodes === 1
        ? H / 2
        : PAD_Y + (ni / (layer.nodes - 1)) * totalH
      return [x, y] as [number, number]
    })
  })

  type Edge = { x1: number; y1: number; x2: number; y2: number; id: number; layerFrom: number; nodeFrom: number; nodeTo: number }
  const edges: Edge[] = []
  let edgeId = 0
  for (let li = 0; li < LAYERS.length - 1; li++) {
    nodePos[li].forEach(([x1, y1], ni) => {
      nodePos[li + 1].forEach(([x2, y2], nj) => {
        edges.push({ x1, y1, x2, y2, id: edgeId++, layerFrom: li, nodeFrom: ni, nodeTo: nj })
      })
    })
  }

  useEffect(() => {
    if (!active) {
      setActivePulses([])
      setLitNodes(new Set())
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    let pulseQueue: { edgeId: number; startTime: number }[] = []
    const PULSE_SPEED = 0.0018
    const SPAWN_INTERVAL = 280

    let lastSpawn = 0

    function spawnWave(now: number) {
      const firstLayerEdges = edges.filter(e => e.layerFrom === 0)
      firstLayerEdges.forEach(e => {
        pulseQueue.push({ edgeId: e.id, startTime: now + Math.random() * 80 })
      })
    }

    function tick(now: number) {
      if (now - lastSpawn > SPAWN_INTERVAL) {
        spawnWave(now)
        lastSpawn = now
      }

      const newPulses: Pulse[] = []
      const newLit = new Set<string>()

      pulseQueue = pulseQueue.filter(p => p.startTime <= now)

      pulseQueue.forEach(p => {
        const progress = Math.min(1, (now - p.startTime) * PULSE_SPEED)
        newPulses.push({ edgeId: p.edgeId, progress })
        const edge = edges[p.edgeId]
        if (edge) {
          newLit.add(`${edge.layerFrom}-${edge.nodeFrom}`)
          if (progress > 0.7) newLit.add(`${edge.layerFrom + 1}-${edge.nodeTo}`)
        }
        if (progress >= 1) {
          // cascade to next layer
          const completedEdge = edges[p.edgeId]
          if (completedEdge && completedEdge.layerFrom < LAYERS.length - 2) {
            const nextEdges = edges.filter(e => e.layerFrom === completedEdge.layerFrom + 1 && e.nodeFrom === completedEdge.nodeTo)
            nextEdges.forEach(e => {
              if (!pulseQueue.find(pq => pq.edgeId === e.id && pq.startTime > now - 50)) {
                pulseQueue.push({ edgeId: e.id, startTime: now })
              }
            })
          }
        }
      })

      pulseQueue = pulseQueue.filter(p => {
        const progress = (now - p.startTime) * PULSE_SPEED
        return progress < 1
      })

      setActivePulses(newPulses.filter(p => p.progress < 1))
      setLitNodes(newLit)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [active])

  const pulseMap = new Map<number, number>()
  activePulses.forEach(p => pulseMap.set(p.edgeId, p.progress))

  return (
    <div
      style={{
        perspective: '900px',
        perspectiveOrigin: '50% 40%',
        width: '100%',
      }}
    >
      <div
        style={{
          transform: 'rotateX(22deg) rotateY(-8deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease',
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 190, overflow: 'visible' }}>
          <defs>
            {LAYERS.map((layer, li) => (
              <radialGradient key={li} id={`nodeGrad${li}`} cx="40%" cy="35%">
                <stop offset="0%" stopColor={layer.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={layer.color} stopOpacity="0.3" />
              </radialGradient>
            ))}
            <filter id="glow3d">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="nodeglow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {edges.map(e => {
            const progress = pulseMap.get(e.id)
            const isActive = progress !== undefined
            const layerColor = LAYERS[e.layerFrom].color
            return (
              <g key={e.id}>
                <line
                  x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                  stroke={isActive ? layerColor : 'rgba(255,255,255,0.04)'}
                  strokeWidth={isActive ? 1.2 : 0.6}
                  style={{ transition: 'stroke 0.1s, stroke-width 0.1s' }}
                />
                {isActive && progress !== undefined && (() => {
                  const px = e.x1 + (e.x2 - e.x1) * progress
                  const py = e.y1 + (e.y2 - e.y1) * progress
                  return (
                    <circle cx={px} cy={py} r={3.5}
                      fill={layerColor}
                      style={{ filter: `drop-shadow(0 0 6px ${layerColor})` }}
                    />
                  )
                })()}
              </g>
            )
          })}

          {/* Nodes */}
          {LAYERS.map((layer, li) =>
            nodePos[li].map(([x, y], ni) => {
              const key = `${li}-${ni}`
              const isLit = litNodes.has(key)
              const r = li === 0 ? 10 : li === LAYERS.length - 1 ? 12 : 9
              return (
                <g key={key}>
                  {/* Shadow/depth */}
                  <ellipse cx={x + 3} cy={y + 4} rx={r * 0.9} ry={r * 0.45}
                    fill="rgba(0,0,0,0.35)"
                    style={{ filter: 'blur(3px)' }}
                  />
                  {/* Outer glow */}
                  {isLit && (
                    <circle cx={x} cy={y} r={r + 6}
                      fill="none"
                      stroke={layer.color}
                      strokeWidth="1"
                      opacity="0.25"
                      style={{ filter: 'blur(4px)' }}
                    />
                  )}
                  {/* Node body */}
                  <circle cx={x} cy={y} r={r}
                    fill={isLit ? `url(#nodeGrad${li})` : `${layer.color}18`}
                    stroke={isLit ? layer.color : `${layer.color}50`}
                    strokeWidth={isLit ? 1.5 : 0.8}
                    style={{
                      filter: isLit ? `drop-shadow(0 0 8px ${layer.color})` : 'none',
                      transition: 'all 0.15s',
                    }}
                  />
                  {/* Highlight */}
                  <ellipse cx={x - r * 0.3} cy={y - r * 0.3} rx={r * 0.3} ry={r * 0.2}
                    fill="rgba(255,255,255,0.25)"
                  />
                </g>
              )
            })
          )}
        </svg>
      </div>
    </div>
  )
}

interface Props { active: boolean }

export function Slide08NeuralNetworks({ active }: Props) {
  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-6 md:px-12 gap-7">
        <span className="ghost-num">08</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Redes Neuronales</span>
            <h2 className="slide-title gradient-text text-center">El cerebro artificial</h2>
          </div>

          <Card
            className="w-full overflow-hidden relative"
            style={{
              background: 'rgba(0,0,0,0.92)',
              border: '1px solid rgba(0,212,255,0.15)',
              height: 280,
              boxShadow: '0 0 60px rgba(0,212,255,0.08)',
            }}
          >
            <Spotlight fill="#00d4ff" className="opacity-30" />
            <div className="relative z-10 h-full grid grid-cols-2">
              <div className="flex flex-col justify-center p-7 gap-4">
                <p className="font-inter text-white/70 text-sm leading-relaxed">
                  Las redes neuronales son sistemas de capas de nodos matemáticos conectados entre sí.
                </p>
                <ul className="flex flex-col gap-2">
                  {[
                    'Inspiradas en neuronas biológicas',
                    'Aprenden ajustando el peso de cada conexión',
                    'Reconocen imágenes, texto, voz y más',
                    'GPT-4 tiene ~1.8 billones de parámetros',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs font-inter text-white/50">
                      <span style={{ color: '#00d4ff', marginTop: 1 }}>▹</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative overflow-hidden">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>

          <div className="glass-card p-5" style={{ border: '1px solid rgba(0,212,255,0.12)' }}>
            <div className="text-xs font-orbitron text-white/30 tracking-widest uppercase mb-3 text-center">
              Arquitectura 3D — propagación de señal en tiempo real
            </div>
            <NeuralNetwork3D active={active} />
            <div className="flex gap-5 justify-center mt-3">
              {LAYERS.map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                  <span className="font-inter text-white/35 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <aside className="notes">
        • Una red neuronal artificial imita la estructura del cerebro: neuronas conectadas en capas.
        • Cada conexión tiene un peso que se ajusta durante el entrenamiento.
        • La información entra por la capa de entrada, se transforma en capas ocultas, y sale por la capa de salida.
        • GPT-4 tiene 1.8 billones de parámetros — esos son los pesos de la red, ajustados con billones de textos.
      </aside>
    </section>
  )
}
