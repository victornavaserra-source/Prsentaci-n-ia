import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─── Config ───────────────────────────────────────────────────────────────────

const NET = [4, 6, 6, 3]
const LAYER_X = [-3.5, -1.1, 1.1, 3.5]
const PHASE_START = [0, 900, 1900, 2900]
const STAGGER = 120
const RESET_AT = 3800
const CYCLE_MS = 4800

// ─── Three.js Panel ───────────────────────────────────────────────────────────

function NeuralNet3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let cleanupFn: (() => void) | null = null
    const deferRaf = requestAnimationFrame(() => {
      const W = mount.clientWidth  || 600
      const H = mount.clientHeight || 500

      // ── Renderer ────────────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      mount.appendChild(renderer.domElement)
      Object.assign(renderer.domElement.style, {
        position: 'absolute', inset: '0', width: '100%', height: '100%',
      })

      // ── Scene ────────────────────────────────────────────────────────────────
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100)
      camera.position.set(0, 2, 8)

      scene.add(new THREE.AmbientLight(0x0a1628, 1))
      const dir = new THREE.DirectionalLight(0xffffff, 0.6)
      dir.position.set(5, 5, 5)
      scene.add(dir)
      const corePl = new THREE.PointLight(0x00d4ff, 2, 10)
      corePl.position.set(0, 0, 2)
      scene.add(corePl)

      // ── Node positions ───────────────────────────────────────────────────────
      function nodeZ(li: number, n: number) {
        return (((li * 11 + n * 17) % 37) / 37) * 5.0 - 2.5
      }
      const nodePos: THREE.Vector3[][] = NET.map((count, li) =>
        Array.from({ length: count }, (_, n) => new THREE.Vector3(
          LAYER_X[li],
          (n - (count - 1) / 2) * 1.0,
          nodeZ(li, n),
        ))
      )

      // ── Nodes ─────────────────────────────────────────────────────────────────
      const CYAN = new THREE.Color(0x00d4ff)
      const WHITE = new THREE.Color(0xffffff)

      const sphereGeo = new THREE.SphereGeometry(0.22, 20, 20)
      const glowGeo = new THREE.SphereGeometry(0.45, 12, 12)
      const outerGeo = new THREE.SphereGeometry(0.7, 10, 10)

      interface NodeData {
        mat: THREE.MeshPhongMaterial
        glowMat: THREE.MeshBasicMaterial
        outerMat: THREE.MeshBasicMaterial
        pl: THREE.PointLight
        activation: number
      }

      const nodeData: NodeData[][] = []

      for (let li = 0; li < NET.length; li++) {
        const layer: NodeData[] = []
        for (let n = 0; n < NET[li]; n++) {
          const pos = nodePos[li][n]

          const mat = new THREE.MeshPhongMaterial({
            color: 0x0a1628, emissive: CYAN, emissiveIntensity: 0.04, shininess: 100,
          })
          const mesh = new THREE.Mesh(sphereGeo, mat)
          mesh.position.copy(pos)
          scene.add(mesh)

          const glowMat = new THREE.MeshBasicMaterial({
            color: 0x00d4ff, transparent: true, opacity: 0, depthWrite: false, side: THREE.BackSide,
          })
          const glow = new THREE.Mesh(glowGeo, glowMat)
          glow.position.copy(pos)
          scene.add(glow)

          const outerMat = new THREE.MeshBasicMaterial({
            color: 0x00d4ff, transparent: true, opacity: 0, depthWrite: false, side: THREE.BackSide,
          })
          const outer = new THREE.Mesh(outerGeo, outerMat)
          outer.position.copy(pos)
          scene.add(outer)

          const pl = new THREE.PointLight(0x00d4ff, 0, 3)
          pl.position.copy(pos)
          scene.add(pl)

          layer.push({ mat, glowMat, outerMat, pl, activation: 0 })
        }
        nodeData.push(layer)
      }

      // ── Tubes ─────────────────────────────────────────────────────────────────
      interface TubeData {
        mat: THREE.MeshBasicMaterial
        fromLayer: number; fromNode: number
        toLayer: number; toNode: number
        prevActive: boolean
      }
      const tubeData: TubeData[] = []

      for (let li = 0; li < NET.length - 1; li++) {
        for (let a = 0; a < NET[li]; a++) {
          for (let b = 0; b < NET[li + 1]; b++) {
            const curve = new THREE.CatmullRomCurve3([nodePos[li][a], nodePos[li + 1][b]])
            const geo = new THREE.TubeGeometry(curve, 4, 0.018, 5, false)
            const mat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.12 })
            scene.add(new THREE.Mesh(geo, mat))
            tubeData.push({ mat, fromLayer: li, fromNode: a, toLayer: li + 1, toNode: b, prevActive: false })
          }
        }
      }

      // ── Particles ─────────────────────────────────────────────────────────────
      interface Particle { mesh: THREE.Mesh; fromLayer: number; fromNode: number; toLayer: number; toNode: number; t: number }
      const pGeo = new THREE.SphereGeometry(0.075, 8, 8)
      const pool: Particle[] = []
      const active: Particle[] = []

      function acquire(td: TubeData): Particle {
        const p = pool.pop()
        if (p) {
          p.fromLayer = td.fromLayer; p.fromNode = td.fromNode
          p.toLayer = td.toLayer; p.toNode = td.toNode
          p.t = 0; p.mesh.visible = true; return p
        }
        const m = new THREE.Mesh(pGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }))
        scene.add(m)
        return { mesh: m, fromLayer: td.fromLayer, fromNode: td.fromNode, toLayer: td.toLayer, toNode: td.toNode, t: 0 }
      }
      function release(p: Particle) { p.mesh.visible = false; pool.push(p) }

      // ── Camera orbit ──────────────────────────────────────────────────────────
      let theta = 0

      // ── Animation ─────────────────────────────────────────────────────────────
      let loopRaf: number
      const t0 = performance.now()

      function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

      const loop = () => {
        loopRaf = requestAnimationFrame(loop)

        const elapsed = performance.now() - t0
        const cycleTime = elapsed % CYCLE_MS
        const isReset = cycleTime >= RESET_AT

        // Full camera orbit — makes 3D depth obvious
        theta += 0.006
        const phi = 0.35
        const dist = 8.5
        camera.position.set(
          dist * Math.sin(theta) * Math.cos(phi),
          dist * Math.sin(phi),
          dist * Math.cos(theta) * Math.cos(phi),
        )
        camera.lookAt(0, 0, 0)

        // Node activations
        for (let li = 0; li < NET.length; li++) {
          for (let n = 0; n < NET[li]; n++) {
            const activateAt = PHASE_START[li] + n * STAGGER
            const shouldBeActive = !isReset && cycleTime >= activateAt
            const nd = nodeData[li][n]
            nd.activation = lerp(nd.activation, shouldBeActive ? 1 : 0, 0.12)
            const a = nd.activation

            nd.mat.emissiveIntensity = 0.04 + a * 1.2
            nd.mat.emissive.copy(CYAN)
            nd.glowMat.opacity = a * 0.42
            nd.outerMat.opacity = a * 0.15
            nd.pl.intensity = a * 4
          }
        }

        // Tube activations + particles
        for (const td of tubeData) {
          const fromAct = nodeData[td.fromLayer][td.fromNode].activation
          const toPhaseStarted = !isReset && cycleTime >= PHASE_START[td.toLayer]
          const isActive = fromAct > 0.5 && toPhaseStarted

          if (isActive && !td.prevActive) active.push(acquire(td))
          td.prevActive = isActive

          const targetOp = isActive ? 0.9 : 0.12
          td.mat.opacity = lerp(td.mat.opacity, targetOp, 0.1)
          if (td.mat.opacity > 0.4) {
            td.mat.color.lerp(WHITE, 0.08)
          } else {
            td.mat.color.lerp(CYAN, 0.08)
          }
        }

        // Move particles
        const done: Particle[] = []
        for (const p of active) {
          p.t += 1 / (0.45 * 60)
          if (p.t >= 1) { done.push(p); continue }
          p.mesh.position.lerpVectors(nodePos[p.fromLayer][p.fromNode], nodePos[p.toLayer][p.toNode], p.t)
        }
        for (const p of done) { active.splice(active.indexOf(p), 1); release(p) }

        renderer.render(scene, camera)
      }
      loop()

      const ro = new ResizeObserver(() => {
        const nW = mount.clientWidth, nH = mount.clientHeight
        if (!nW || !nH) return
        camera.aspect = nW / nH
        camera.updateProjectionMatrix()
        renderer.setSize(nW, nH)
      })
      ro.observe(mount)

      cleanupFn = () => {
        cancelAnimationFrame(loopRaf)
        ro.disconnect()
        sphereGeo.dispose(); glowGeo.dispose(); outerGeo.dispose(); pGeo.dispose()
        renderer.dispose()
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      }
    })

    return () => {
      cancelAnimationFrame(deferRaf)
      cleanupFn?.()
    }
  }, [])

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0 }}>
      <div style={{
        position: 'absolute', bottom: 14, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around', pointerEvents: 'none',
      }}>
        {[
          { label: 'ENTRADA',  color: 'rgba(0,212,255,0.7)' },
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
    </div>
  )
}

// ─── Slide ────────────────────────────────────────────────────────────────────

interface Props { active: boolean }

export function Slide08NeuralNetworks({ active: _active }: Props) {
  return (
    <section>
      <div className="relative w-full h-[100dvh] flex items-center justify-center px-6 md:px-12">
        <span className="ghost-num">08</span>

        {/* Full-width two-column layout */}
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
                { label: 'Capas', text: 'Entrada → capas ocultas → salida' },
                { label: 'Escala', text: 'GPT-4 tiene ~1.8 billones de parámetros' },
                { label: 'Dominio', text: 'Imágenes, texto, voz, código y más' },
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
                La propagación de señal que ves en tiempo real a la derecha replica exactamente cómo un modelo procesa información: capa por capa, hasta producir una respuesta.
              </p>
            </div>
          </div>

          {/* Right: Three.js 3D network — full height */}
          <div style={{
            position: 'relative',
            height: 520,
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid rgba(0,212,255,0.18)',
            background: 'rgba(0,4,20,0.85)',
            boxShadow: '0 0 80px rgba(0,212,255,0.12), inset 0 1px 0 rgba(0,212,255,0.08)',
          }}>
            <NeuralNet3D />
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
