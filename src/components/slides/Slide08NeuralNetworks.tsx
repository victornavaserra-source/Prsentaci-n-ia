import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'
import { NeuralNetBg } from '@/components/NeuralNetBg'

interface Props { active: boolean }

export function Slide08NeuralNetworks({ active: _active }: Props) {
  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-6 md:px-12 gap-7">
        <span className="ghost-num">08</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Redes Neuronales</span>
            <h2 className="slide-title gradient-text text-center">El cerebro artificial</h2>
          </div>

          {/* Top card: info + Spline */}
          <Card
            className="w-full overflow-hidden relative"
            style={{
              background: 'rgba(0,0,0,0.92)',
              border: '1px solid rgba(0,212,255,0.15)',
              height: 260,
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

          {/* Bottom card: Three.js neural net 3D */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              height: 210,
              border: '1px solid rgba(0,212,255,0.12)',
              background: 'rgba(0,0,0,0.55)',
            }}
          >
            <NeuralNetBg mode="panel" showLabels />
            {/* Label strip */}
            <div
              className="absolute bottom-0 left-0 right-0 flex justify-between px-6 pb-3 z-10"
              style={{ pointerEvents: 'none' }}
            >
              <span className="font-orbitron text-[0.55rem] tracking-widest text-white/25 uppercase">
                Entrada
              </span>
              <span className="font-orbitron text-[0.55rem] tracking-widest text-white/20 uppercase">
                Capas ocultas
              </span>
              <span className="font-orbitron text-[0.55rem] tracking-widest text-white/25 uppercase">
                Salida
              </span>
            </div>
            {/* Top label */}
            <div className="absolute top-3 left-0 right-0 flex justify-center z-10" style={{ pointerEvents: 'none' }}>
              <span className="font-orbitron text-[0.6rem] tracking-widest text-white/25 uppercase">
                Propagación de señal en tiempo real
              </span>
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
