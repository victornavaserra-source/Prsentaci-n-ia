import { NeuralNetBg } from '@/components/NeuralNetBg'

interface Props { active: boolean }

export function Slide08NeuralNetworks({ active: _active }: Props) {
  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-6 md:px-12 gap-6">

        {/* Red neuronal como fondo completo — mismo patrón que Slide01 */}
        <NeuralNetBg mode="background" showLabels={false} className="absolute inset-0" />

        {/* Overlay oscuro para legibilidad */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,4,20,0.45) 0%, rgba(0,4,20,0.82) 100%)',
          pointerEvents: 'none',
        }} />

        <span className="ghost-num">08</span>

        <div className="relative z-10 max-w-4xl w-full flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Redes Neuronales</span>
            <h2 className="slide-title gradient-text">El cerebro artificial</h2>
          </div>

          <p className="font-inter text-white/60 text-sm leading-relaxed max-w-xl">
            Sistemas de capas de nodos matemáticos conectados entre sí, inspirados en las neuronas del cerebro humano.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
            {[
              { label: 'APRENDIZAJE', text: 'Ajustan pesos con datos' },
              { label: 'CAPAS',       text: 'Entrada → ocultas → salida' },
              { label: 'ESCALA',      text: 'GPT-4: ~1.8B parámetros' },
              { label: 'DOMINIO',     text: 'Imagen, texto, voz, código' },
            ].map(({ label, text }) => (
              <div key={label} style={{
                padding: '12px 14px', borderRadius: 12,
                background: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(0,212,255,0.18)',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{
                  fontFamily: 'Orbitron, sans-serif', fontSize: 8,
                  letterSpacing: '0.14em', color: '#00d4ff', marginBottom: 6,
                }}>
                  {label}
                </div>
                <div className="font-inter text-white/55 text-xs leading-snug">{text}</div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '14px 20px', borderRadius: 12,
            background: 'rgba(0,212,255,0.06)',
            border: '1px solid rgba(0,212,255,0.2)',
            backdropFilter: 'blur(10px)',
            maxWidth: 480,
          }}>
            <p className="font-inter text-xs leading-relaxed" style={{ color: 'rgba(0,212,255,0.85)' }}>
              La red que ves en tiempo real replica exactamente cómo un modelo procesa información: capa por capa, propagando señales hasta producir una respuesta.
            </p>
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
