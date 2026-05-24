import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'

// 2D neural network diagram with animated pulses
const LAYERS = [
  { nodes: 3, label: 'Entrada', color: '#00d4ff' },
  { nodes: 5, label: 'Oculta 1', color: '#6366f1' },
  { nodes: 4, label: 'Oculta 2', color: '#8b5cf6' },
  { nodes: 2, label: 'Salida', color: '#10b981' },
]

function NeuralDiagram({ active }: { active: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [pulseEdge, setPulseEdge] = useState(0)

  const W = 380, H = 160
  const layerX = LAYERS.map((_, i) => (i / (LAYERS.length - 1)) * (W - 60) + 30)

  const nodePos: [number, number][][] = LAYERS.map((layer, li) => {
    const x = layerX[li]
    return Array.from({ length: layer.nodes }, (_, ni) => {
      const y = (ni / (layer.nodes - 1 || 1)) * (H - 40) + 20
      return [x, y] as [number, number]
    })
  })

  type Edge = { x1: number; y1: number; x2: number; y2: number; id: number }
  const edges: Edge[] = []
  let edgeId = 0
  for (let li = 0; li < LAYERS.length - 1; li++) {
    nodePos[li].forEach(([x1, y1]) => {
      nodePos[li + 1].forEach(([x2, y2]) => {
        edges.push({ x1, y1, x2, y2, id: edgeId++ })
      })
    })
  }

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setPulseEdge(e => (e + 1) % edges.length), 80)
    return () => clearInterval(id)
  }, [active, edges.length])

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 130 }}>
        {edges.map(e => (
          <line key={e.id}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={e.id === pulseEdge ? '#00d4ff' : 'rgba(255,255,255,0.06)'}
            strokeWidth={e.id === pulseEdge ? 1.5 : 0.8}
            style={{ transition: 'stroke 0.05s, stroke-width 0.05s', filter: e.id === pulseEdge ? 'drop-shadow(0 0 4px rgba(0,212,255,0.8))' : 'none' }}
          />
        ))}
        {LAYERS.map((layer, li) =>
          nodePos[li].map(([x, y], ni) => (
            <g key={`${li}-${ni}`}>
              <circle cx={x} cy={y} r={9} fill={`${layer.color}15`} stroke={`${layer.color}60`} strokeWidth={1} />
              <circle cx={x} cy={y} r={4.5} fill={layer.color}
                style={{ filter: `drop-shadow(0 0 5px ${layer.color})` }} />
            </g>
          ))
        )}
      </svg>
      <div className="flex gap-6 justify-center">
        {LAYERS.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="font-inter text-white/30 text-xs">{label}</span>
          </div>
        ))}
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

          {/* Main card with Spline */}
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
              {/* Left: text */}
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
              {/* Right: Spline 3D */}
              <div className="relative overflow-hidden">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>

          {/* 2D diagram */}
          <div className="glass-card p-5">
            <div className="text-xs font-orbitron text-white/25 tracking-widest uppercase mb-4 text-center">
              Arquitectura simplificada — pulso de activación en tiempo real
            </div>
            <NeuralDiagram active={active} />
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
