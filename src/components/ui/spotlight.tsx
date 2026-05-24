import { useEffect, useRef } from 'react'

interface SpotlightProps {
  className?: string
  fill?: string
}

export function Spotlight({ className = '', fill = 'rgba(0,212,255,0.08)' }: SpotlightProps) {
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
      el!.style.background = `radial-gradient(480px circle at ${x}px ${y}px, ${fill}, transparent 70%)`
    }
    parent.addEventListener('mousemove', onMove)
    return () => parent.removeEventListener('mousemove', onMove)
  }, [fill])

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 z-[1] ${className}`}
      style={{ background: `radial-gradient(480px circle at 50% 30%, ${fill}, transparent 70%)` }}
    />
  )
}
