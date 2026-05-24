import { Hero } from '@/components/ui/animated-hero'
import { NeuralNetBg } from '@/components/NeuralNetBg'

interface Props {
  onScrollDown?: () => void
  onJumpToConclusions?: () => void
}

export function Slide01Cover({ onScrollDown, onJumpToConclusions }: Props) {
  return (
    <section>
      {/* Three.js neural network in background */}
      <NeuralNetBg />
      {/* Radial gradient overlay to darken edges */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(2,8,24,0.7) 100%)',
        }}
      />
      <Hero onScrollDown={onScrollDown} onJumpToConclusions={onJumpToConclusions} />
      <aside className="notes">
        • Buenos días. Hoy voy a explicar cómo funciona realmente una IA por dentro.
        • No la magia que vemos en películas, sino las matemáticas y la física reales.
        • El título resume el viaje: desde el mundo físico hasta las decisiones digitales.
        • Seguiremos 12 pasos, cada uno construye sobre el anterior.
      </aside>
    </section>
  )
}
