import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'

// ─── Three.js 3D Neural Network ───────────────────────────────────────────────

const NET = [4, 6, 6, 3]
const LAYER_X = [-3, -1, 1, 3]
const PHASE_START = [0, 800, 1800, 2800]   // ms when each layer starts activating
const STAGGER = 150                          // ms between nodes in same layer
const RESET_AT = 3600                        // ms when everything starts decaying
const CYCLE_MS = 4400                        // ms per full cycle

const CYAN_COLOR = new THREE.Color(0x00d4ff)
const WHITE_COLOR = new THREE.Color(0xffffff)

function NeuralNet3DPanel() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Wait one frame for layout so clientWidth is real
    let rafId: number
    let cleanupFn: (() => void) | null = null

    rafId = requestAnimationFrame(() => {
      const W = mount.clientWidth || 640
      const H = mount.clientHeight || 420

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
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100)
      camera.position.set(0, 0, 7)

      scene.add(new THREE.AmbientLight(0x0a1628, 0.5))
      const dir = new THREE.DirectionalLight(0xffffff, 0.8)
      dir.position.set(5, 5, 5)
      scene.add(dir)
      const centerPL = new THREE.PointLight(0x00d4ff, 2, 8)
      centerPL.position.set(0, 0, 2)
      scene.add(centerPL)

      // ── Node positions ───────────────────────────────────────────────────────
      function nodeZ(li: number, n: number) {
        // Deterministic but varied Z in range [-1.5, 1.5]
        return (((li * 7 + n * 13) % 31) / 31) * 3.0 - 1.5
      }
      const nodePos: THREE.Vector3[][] = NET.map((count, li) =>
        Array.from({ length: count }, (_, n) => new THREE.Vector3(
          LAYER_X[li],
          (n - (count - 1) / 2) * 0.9,
          nodeZ(li, n),
        ))
      )

      // ── Node meshes ──────────────────────────────────────────────────────────
      const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16)
      const wireGeo = new THREE.WireframeGeometry(sphereGeo)

      interface NodeData {
        mat: THREE.MeshPhongMaterial
        pl: THREE.PointLight
        glowMesh: THREE.Mesh
        glowMat: THREE.MeshBasicMaterial
        activation: number
        glowT: number
        glowDir: number
      }
      const nodeData: NodeData[][] = []

      for (let li = 0; li < NET.length; li++) {
        const layer: NodeData[] = []
        for (let n = 0; n < NET[li]; n++) {
          const pos = nodePos[li][n]

          const mat = new THREE.MeshPhongMaterial({
            color: 0x0a1628, emissive: 0x001830, emissiveIntensity: 1, shininess: 100,
          })
          const mesh = new THREE.Mesh(sphereGeo, mat)
          mesh.position.copy(pos)
          scene.add(mesh)

          const wireMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.2 })
          const wire = new THREE.LineSegments(wireGeo, wireMat)
          wire.position.copy(pos)
          scene.add(wire)

          const pl = new THREE.PointLight(0x00d4ff, 0, 2)
          pl.position.copy(pos)
          scene.add(pl)

          const glowGeo = new THREE.SphereGeometry(0.35, 10, 10)
          const glowMat = new THREE.MeshBasicMaterial({
            color: 0x00d4ff, transparent: true, opacity: 0, depthWrite: false, side: THREE.BackSide,
          })
          const glowMesh = new THREE.Mesh(glowGeo, glowMat)
          glowMesh.position.copy(pos)
          scene.add(glowMesh)

          layer.push({ mat, pl, glowMesh, glowMat, activation: 0, glowT: 0.8, glowDir: 1 })
        }
        nodeData.push(layer)
      }

      // ── Tube connections ─────────────────────────────────────────────────────
      interface TubeData {
        mat: THREE.MeshBasicMaterial
        fromLayer: number; fromNode: number
        toLayer: number; toNode: number
        prevActive: boolean
      }
      const tubeData: TubeData[] = []
      const tubesByFrom: TubeData[][] = NET.map(() => [])

      for (let li = 0; li < NET.length - 1; li++) {
        for (let a = 0; a < NET[li]; a++) {
          for (let b = 0; b < NET[li + 1]; b++) {
            const curve = new THREE.CatmullRomCurve3([nodePos[li][a], nodePos[li + 1][b]])
            const tubeGeo = new THREE.TubeGeometry(curve, 4, 0.012, 5, false)
            const mat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.08 })
            scene.add(new THREE.Mesh(tubeGeo, mat))
            const td: TubeData = { mat, fromLayer: li, fromNode: a, toLayer: li + 1, toNode: b, prevActive: false }
            tubeData.push(td)
            tubesByFrom[li].push(td)
          }
        }
      }

      // ── Particle pool ────────────────────────────────────────────────────────
      interface Particle { mesh: THREE.Mesh; fromLayer: number; fromNode: number; toLayer: number; toNode: number; t: number }
      const pGeo = new THREE.SphereGeometry(0.06, 6, 6)
      const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const pool: Particle[] = []
      const active: Particle[] = []

      function acquire(td: TubeData): Particle {
        const p = pool.pop()
        if (p) {
          p.fromLayer = td.fromLayer; p.fromNode = td.fromNode
          p.toLayer = td.toLayer; p.toNode = td.toNode
          p.t = 0; p.mesh.visible = true
          return p
        }
        const mesh = new THREE.Mesh(pGeo, pMat.clone())
        scene.add(mesh)
        return { mesh, fromLayer: td.fromLayer, fromNode: td.fromNode, toLayer: td.toLayer, toNode: td.toNode, t: 0 }
      }
      function release(p: Particle) { p.mesh.visible = false; pool.push(p) }

      // ── Animation loop ───────────────────────────────────────────────────────
      let loopRafId: number
      const cycleStart = performance.now()

      function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

      const loop = () => {
        loopRafId = requestAnimationFrame(loop)

        const now = performance.now()
        const elapsed = now - cycleStart
        const cycleTime = elapsed % CYCLE_MS
        const isReset = cycleTime >= RESET_AT

        // Camera gentle orbit
        camera.position.x = Math.sin(elapsed * 0.0004) * 0.8
        camera.position.y = Math.cos(elapsed * 0.0003) * 0.4
        camera.lookAt(0, 0, 0)

        // ── Node activations ────────────────────────────────────────────────
        for (let li = 0; li < NET.length; li++) {
          for (let n = 0; n < NET[li]; n++) {
            const activateAt = PHASE_START[li] + n * STAGGER
            const shouldBeActive = !isReset && cycleTime >= activateAt
            const nd = nodeData[li][n]
            nd.activation = lerp(nd.activation, shouldBeActive ? 1 : 0, 0.15)
            const a = nd.activation

            // emissive lerp
            nd.mat.emissive.copy(new THREE.Color(0x001830).lerp(CYAN_COLOR, a))
            nd.pl.intensity = a * 3

            // Glow pulse
            if (a > 0.05) {
              nd.glowT += nd.glowDir * 0.025
              if (nd.glowT > 1.4) nd.glowDir = -1
              if (nd.glowT < 0.8) nd.glowDir = 1
              nd.glowMesh.scale.setScalar(nd.glowT)
              nd.glowMat.opacity = a * 0.16
            } else {
              nd.glowMat.opacity = 0
            }
          }
        }

        // ── Tube activations + particle spawn ───────────────────────────────
        for (const td of tubeData) {
          const fromAct = nodeData[td.fromLayer][td.fromNode].activation
          const toPhaseStarted = !isReset && cycleTime >= PHASE_START[td.toLayer]
          const isActive = fromAct > 0.5 && toPhaseStarted

          // Spawn particle on activation edge
          if (isActive && !td.prevActive) {
            active.push(acquire(td))
          }
          td.prevActive = isActive

          // Lerp tube opacity + color
          const targetOpacity = isActive ? 0.85 : 0.08
          td.mat.opacity = lerp(td.mat.opacity, targetOpacity, 0.12)
          if (td.mat.opacity > 0.35) {
            td.mat.color.lerp(WHITE_COLOR, 0.08)
          } else {
            td.mat.color.lerp(CYAN_COLOR, 0.08)
          }
        }

        // ── Move particles ───────────────────────────────────────────────────
        const toRelease: Particle[] = []
        for (const p of active) {
          p.t += 1 / (0.4 * 60) // 400ms at 60fps
          if (p.t >= 1) { toRelease.push(p); continue }
          p.mesh.position.lerpVectors(nodePos[p.fromLayer][p.fromNode], nodePos[p.toLayer][p.toNode], p.t)
        }
        for (const p of toRelease) { active.splice(active.indexOf(p), 1); release(p) }

        renderer.render(scene, camera)
      }
      loop()

      // Resize
      const ro = new ResizeObserver(() => {
        const nW = mount.clientWidth, nH = mount.clientHeight
        if (!nW || !nH) return
        camera.aspect = nW / nH
        camera.updateProjectionMatrix()
        renderer.setSize(nW, nH)
      })
      ro.observe(mount)

      cleanupFn = () => {
        cancelAnimationFrame(loopRafId)
        ro.disconnect()
        sphereGeo.dispose(); wireGeo.dispose(); pGeo.dispose(); pMat.dispose()
        renderer.dispose()
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      }
    })

    return () => {
      cancelAnimationFrame(rafId)
      cleanupFn?.()
    }
  }, [])

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', pointerEvents: 'none' }}>
        {[
          { label: 'ENTRADA',  color: 'rgba(0,212,255,0.5)' },
          { label: 'OCULTA 1', color: 'rgba(99,102,241,0.5)' },
          { label: 'OCULTA 2', color: 'rgba(139,92,246,0.5)' },
          { label: 'SALIDA',   color: 'rgba(16,185,129,0.5)' },
        ].map(({ label, color }) => (
          <span key={label} style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, letterSpacing: '0.12em', color, textTransform: 'uppercase' }}>
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
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-6 md:px-12 gap-5">
        <span className="ghost-num">08</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Redes Neuronales</span>
            <h2 className="slide-title gradient-text text-center">El cerebro artificial</h2>
          </div>

          {/* Info + Spline */}
          <Card className="w-full overflow-hidden relative" style={{
            background: 'rgba(0,0,0,0.92)', border: '1px solid rgba(0,212,255,0.15)',
            height: 230, boxShadow: '0 0 60px rgba(0,212,255,0.08)',
          }}>
            <Spotlight fill="#00d4ff" className="opacity-30" />
            <div className="relative z-10 h-full grid grid-cols-2">
              <div className="flex flex-col justify-center p-7 gap-3">
                <p className="font-inter text-white/70 text-sm leading-relaxed">
                  Las redes neuronales son sistemas de capas de nodos matemáticos conectados entre sí.
                </p>
                <ul className="flex flex-col gap-1.5">
                  {['Inspiradas en neuronas biológicas', 'Aprenden ajustando el peso de cada conexión', 'Reconocen imágenes, texto, voz y más', 'GPT-4 tiene ~1.8 billones de parámetros'].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs font-inter text-white/50">
                      <span style={{ color: '#00d4ff', marginTop: 1 }}>▹</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative overflow-hidden">
                <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
              </div>
            </div>
          </Card>

          {/* Three.js panel */}
          <div className="relative rounded-2xl overflow-hidden" style={{ height: 420, border: '1px solid rgba(0,212,255,0.15)', background: 'rgba(0,4,20,0.8)' }}>
            <NeuralNet3DPanel />
            <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none" style={{ zIndex: 2 }}>
              <span className="font-orbitron text-[0.6rem] tracking-widest uppercase" style={{ color: 'rgba(0,212,255,0.35)' }}>
                Arquitectura 3D — Propagación de señal en tiempo real
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
