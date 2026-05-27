import { NeuralNetBg } from '@/components/NeuralNetBg'

interface Props { active: boolean }

export function Slide08NeuralNetworks({ active: _active }: Props) {
  return (
    <section>
      <div className="relative w-full h-[100dvh] flex items-center justify-center px-6 md:px-12">
        <span className="ghost-num">08</span>

        <div className="relative z-10 w-full max-w-6xl grid grid-cols-2 gap-8 items-center">

          {/* Left: info */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Redes Neuronales</span>
              <h2 className="slide-title gradient-text">El cerebro artificial</h2>
            </div>

            <p className="font-inter text-white/65 text-sm leading-relaxed">
              Sistemas de capas de nodos matemáticos conectados entre sí, inspirados en las neuronas del cerebro.
            </p>

            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'Aprendizaje', text: 'Ajustan el peso de cada conexión con datos' },
                { label: 'Capas',       text: 'Entrada → capas ocultas → salida' },
                { label: 'Escala',      text: 'GPT-4 tiene ~1.8 billones de parámetros' },
                { label: 'Dominio',     text: 'Imágenes, texto, voz, código y más' },
              ].map(({ label, text }) => (
                <li key={label} className="flex items-start gap-3">
                  <span style={{
                    fontFamily: 'Orbitron, sans-serif', fontSize: 9,
                    letterSpacing: '0.12em', color: '#00d4ff',
                    background: 'rgba(0,212,255,0.1)',
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: 4, padding: '2px 6px', marginTop: 1,
                    whiteSpace: 'nowrap',
                  }}>
                    {label.toUpperCase()}
                  </span>
                  <span className="font-inter text-white/60 text-sm leading-snug">{text}</span>
                </li>
              ))}
            </ul>

            <div style={{
              marginTop: 8, padding: '14px 18px',
              background: 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 12,
            }}>
              <p className="font-inter text-xs leading-relaxed" style={{ color: 'rgba(0,212,255,0.8)' }}>
                La propagación que ves en tiempo real replica exactamente cómo un modelo procesa información: capa por capa, hasta producir una respuesta.
              </p>
            </div>
          </div>

          {/* Right: 3D neural network — same component that works on Slide01 */}
          <div style={{
            position: 'relative', height: 520, borderRadius: 20, overflow: 'hidden',
            border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,4,20,0.9)',
            boxShadow: '0 0 80px rgba(0,212,255,0.12)',
          }}>
            <NeuralNetBg mode="panel" showLabels={false} />
            <div style={{
              position: 'absolute', bottom: 14, left: 0, right: 0,
              display: 'flex', justifyContent: 'space-around', pointerEvents: 'none', zIndex: 2,
            }}>
              {[
                { label: 'ENTRADA',  color: 'rgba(0,212,255,0.7)'  },
                { label: 'OCULTA 1', color: 'rgba(99,102,241,0.7)' },
                { label: 'OCULTA 2', color: 'rgba(139,92,246,0.7)' },
                { label: 'SALIDA',   color: 'rgba(16,185,129,0.7)' },
              ].map(({ label, color }) => (
                <span key={label} style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: 10,
                  letterSpacing: '0.14em', color, textTransform: 'uppercase',
                }}>
                  {label}
                </span>
              ))}
            </div>
            <div style={{
              position: 'absolute', top: 12, left: 0, right: 0,
              display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 2,
            }}>
              <span style={{
                fontFamily: 'Orbitron, sans-serif', fontSize: 9,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'rgba(0,212,255,0.4)',
              }}>
                Arquitectura 3D — propagación en tiempo real
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
