import { useEffect, useRef, useState } from 'react'
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
import { Slide13Agentic } from '@/components/slides/Slide13Agentic'
import { Slide14Ethics } from '@/components/slides/Slide14Ethics'
import { Slide12Conclusions } from '@/components/slides/Slide12Conclusions'

// Slide index map (0-based):
// 0  Slide01Cover
// 1  Slide02Question
// 2  Slide03Digitalization
// 3  Slide04Sampling
// 4  Slide05PhysicalData
// 5  Slide06AIModels
// 6  Slide07MachineLearning
// 7  Slide08NeuralNetworks
// 8  Slide09Applications1  (Energía)
// 9  Slide10Applications2  (Vehículos)
// 10 Slide11Limits
// 11 Slide13Agentic        (Sistemas agénticos)
// 12 Slide14Ethics         (Ética)
// 13 Slide12Conclusions    (Conclusiones)

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
            onJumpToConclusions={() => goToSlide(13)}
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
          <Slide13Agentic active={currentSlide === 11} />
          <Slide14Ethics />
          <Slide12Conclusions active={currentSlide === 13} />
        </div>
      </div>
    </div>
  )
}
