import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'

// ─── Three.js Neural Network Panel ────────────────────────────────────────────

const NET_LAYERS = [4, 6, 6, 3]
const LAYER_X = [-3, -1, 1, 3]
const LAYER_COLORS = [0x00d4ff, 0x6366f1, 0x8b5cf6, 0x10b981]

// Total frames for each phase (at 60fps)
const PHASE_SCHEDULE = [
  { layer: 0, startMs: 0,    endMs: 700  },
  { layer: 1, startMs: 800,  endMs: 1800 },
  { layer: 2, startMs: 1800, endMs: 2800 },
  { layer: 3, startMs: 2800, endMs: 3600 },
]
const TOTAL_CYCLE_MS = 4400  // 3600 + 800 pause

function NeuralNet3DPanel() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth || 600
    const H = mount.clientHeight || 400

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'

    // ── Scene ────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100)
    camera.position.set(0, 0, 7)

    scene.add(new THREE.AmbientLight(0x0a1628, 0.5))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)
    const centerLight = new THREE.PointLight(0x00d4ff, 2, 8)
    centerLight.position.set(0, 0, 2)
    scene.add(centerLight)

    // ── Build node positions ─────────────────────────────────────────────────
    // Deterministic Z so layout doesn't shift on re-render
    function zForNode(li: number, n: number) {
      return ((li * 17 + n * 31) % 100) / 100 * 3.0 - 1.5
    }

    const nodePositions: THREE.Vector3[][] = NET_LAYERS.map((count, li) =>
      Array.from({ length: count }, (_, n) => {
        const x = LAYER_X[li]
        const y = (n - (count - 1) / 2) * 0.9
        const z = zForNode(li, n)
        return new THREE.Vector3(x, y, z)
      })
    )

    // ── Node meshes ──────────────────────────────────────────────────────────
    const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16)
    const wireGeo = new THREE.WireframeGeometry(sphereGeo)

    interface NodeObj {
      mesh: THREE.Mesh
      wire: THREE.LineSegments
      mat: THREE.MeshPhongMaterial
      glowMesh: THREE.Mesh
      glowMat: THREE.MeshBasicMaterial
      pointLight: THREE.PointLight
      activation: number  // 0-1
      glowScale: number
      glowDir: number
    }

    const nodeObjs: NodeObj[][] = nodePositions.map((layer, li) =>
      layer.map((pos) => {
        const mat = new THREE.MeshPhongMaterial({
          color: 0x0a1628,
          emissive: 0x001830,
          emissiveIntensity: 1,
          shininess: 100,
        })
        const mesh = new THREE.Mesh(sphereGeo, mat)
        mesh.position.copy(pos)
        scene.add(mesh)

        const wireMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.2 })
        const wire = new THREE.LineSegments(wireGeo, wireMat)
        wire.position.copy(pos)
        scene.add(wire)

        const glowMat = new THREE.MeshBasicMaterial({ color: LAYER_COLORS[li], transparent: true, opacity: 0, depthWrite: false })
        const glowMesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), glowMat)
        glowMesh.position.copy(pos)
        scene.add(glowMesh)

        const pl = new THREE.PointLight(LAYER_COLORS[li], 0, 2)
        pl.position.copy(pos)
        scene.add(pl)

        return { mesh, wire, mat, glowMesh, glowMat, pointLight: pl, activation: 0, glowScale: 0.8, glowDir: 1 }
      })
    )

    // ── Tube connections ─────────────────────────────────────────────────────
    interface TubeObj {
      mesh: THREE.Mesh
      mat: THREE.MeshBasicMaterial
      activation: number
      fromLayer: number
      fromNode: number
      toLayer: number
      toNode: number
    }

    const tubeObjs: TubeObj[] = []
    const tubesByFromLayer: TubeObj[][] = NET_LAYERS.map(() => [])

    for (let li = 0; li < NET_LAYERS.length - 1; li++) {
      for (let a = 0; a < NET_LAYERS[li]; a++) {
        for (let b = 0; b < NET_LAYERS[li + 1]; b++) {
          const pA = nodePositions[li][a]
          const pB = nodePositions[li + 1][b]
          const curve = new THREE.CatmullRomCurve3([pA, pB])
          const tubeGeo = new THREE.TubeGeometry(curve, 4, 0.012, 5, false)
          const mat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.08 })
          const mesh = new THREE.Mesh(tubeGeo, mat)
          scene.add(mesh)
          const obj: TubeObj = { mesh, mat, activation: 0, fromLayer: li, fromNode: a, toLayer: li + 1, toNode: b }
          tubeObjs.push(obj)
          tubesByFromLayer[li].push(obj)
        }
      }
    }

    // ── Particles ────────────────────────────────────────────────────────────
    interface Particle {
      mesh: THREE.Mesh
      mat: THREE.MeshBasicMaterial
      fromLayer: number
      fromNode: number
      toLayer: number
      toNode: number
      t: number
    }

    const particleGeo = new THREE.SphereGeometry(0.06, 6, 6)
    const particles: Particle[] = []
    const pool: Particle[] = []

    function acquireParticle(fromL: number, fromN: number, toL: number, toN: number): Particle {
      const p = pool.pop()
      if (p) {
        p.fromLayer = fromL; p.fromNode = fromN
        p.toLayer = toL; p.toNode = toN
        p.t = 0; p.mesh.visible = true
        p.mat.color.setHex(LAYER_COLORS[fromL])
        return p
      }
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const mesh = new THREE.Mesh(particleGeo, mat)
      scene.add(mesh)
      return { mesh, mat, fromLayer: fromL, fromNode: fromN, toLayer: toL, toNode: toN, t: 0 }
    }
    function releaseParticle(p: Particle) {
      p.mesh.visible = false
      pool.push(p)
    }

    // ── Animation state ──────────────────────────────────────────────────────
    const activatedNodes: boolean[][] = NET_LAYERS.map(c => Array(c).fill(false))
    const activatedLayers: boolean[] = Array(NET_LAYERS.length).fill(false)

    function resetAll() {
      for (let li = 0; li < NET_LAYERS.length; li++) {
        activatedNodes[li].fill(false)
        activatedLayers[li] = false
      }
      particles.forEach(releaseParticle)
      particles.length = 0
    }

    // ── RAF loop ─────────────────────────────────────────────────────────────
    let rafId: number
    let cycleStart = performance.now()
    const PARTICLE_SPEED = 0.018

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const now = performance.now()
      const t = now - cycleStart

      // Cycle reset
      if (t >= TOTAL_CYCLE_MS) {
        cycleStart = now
        resetAll()
        renderer.render(scene, camera)
        return
      }

      // Camera gentle orbit
      camera.position.x = Math.sin(t * 0.0004) * 0.8
      camera.position.y = Math.cos(t * 0.0003) * 0.4
      camera.lookAt(0, 0, 0)

      // Phase activation
      PHASE_SCHEDULE.forEach(({ layer, startMs, endMs }) => {
        if (t < startMs || t > endMs + 800) return
        if (activatedLayers[layer]) return
        activatedLayers[layer] = true
        // Stagger node activations within layer
        NET_LAYERS[layer]
        nodePositions[layer].forEach((_, n) => {
          const delay = n * 150
          setTimeout(() => {
            if (activatedNodes[layer][n]) return
            activatedNodes[layer][n] = true
            // Spawn particles to next layer
            if (layer < NET_LAYERS.length - 1) {
              tubesByFromLayer[layer]
                .filter(tb => tb.fromNode === n)
                .forEach(tb => {
                  const p = acquireParticle(layer, n, tb.toLayer, tb.toNode)
                  particles.push(p)
                  tb.activation = 1
                })
            }
          }, delay)
        })
      })

      // Update node states
      for (let li = 0; li < NET_LAYERS.length; li++) {
        for (let n = 0; n < NET_LAYERS[li]; n++) {
          const nd = nodeObjs[li][n]
          const isActive = activatedNodes[li][n]
          const targetAct = isActive ? 1 : 0
          nd.activation += (targetAct - nd.activation) * 0.12
          const act = nd.activation

          // Emissive lerp
          nd.mat.emissiveIntensity = 1
          const eColor = new THREE.Color(0x001830).lerp(new THREE.Color(LAYER_COLORS[li]), act)
          nd.mat.emissive = eColor

          // Point light
          nd.pointLight.intensity = act * 3

          // Glow pulse
          if (act > 0.1) {
            nd.glowScale += nd.glowDir * 0.02
            if (nd.glowScale > 1.4) nd.glowDir = -1
            if (nd.glowScale < 0.8) nd.glowDir = 1
            nd.glowMesh.scale.setScalar(nd.glowScale)
            nd.glowMat.opacity = act * 0.18
          } else {
            nd.glowMat.opacity = 0
          }
        }
      }

      // Update tube states
      tubeObjs.forEach(tb => {
        if (tb.activation > 0) {
          tb.activation = Math.max(0, tb.activation - 0.008)
          const a = tb.activation
          tb.mat.opacity = 0.08 + a * 0.77
          tb.mat.color.setHex(a > 0.3 ? 0xffffff : 0x00d4ff)
        } else {
          tb.mat.opacity = 0.08
          tb.mat.color.setHex(0x00d4ff)
        }
      })

      // Update particles
      const toRelease: Particle[] = []
      for (const p of particles) {
        p.t += PARTICLE_SPEED
        if (p.t >= 1) {
          toRelease.push(p)
        } else {
          const from = nodePositions[p.fromLayer][p.fromNode]
          const to = nodePositions[p.toLayer][p.toNode]
          p.mesh.position.lerpVectors(from, to, p.t)
        }
      }
      for (const p of toRelease) {
        particles.splice(particles.indexOf(p), 1)
        releaseParticle(p)
      }

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const ro = new ResizeObserver(() => {
      const nW = mount.clientWidth, nH = mount.clientHeight
      camera.aspect = nW / nH
      camera.updateProjectionMatrix()
      renderer.setSize(nW, nH)
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      sphereGeo.dispose()
      wireGeo.dispose()
      particleGeo.dispose()
      tubeObjs.forEach(tb => { tb.mesh.geometry.dispose(); tb.mat.dispose() })
      nodeObjs.flat().forEach(nd => {
        nd.mat.dispose(); nd.glowMat.dispose()
        nd.glowMesh.geometry.dispose()
      })
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0 }}>
      {/* HTML labels */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[
          { label: 'ENTRADA',  left: '8%',  color: 'rgba(0,212,255,0.55)' },
          { label: 'OCULTA 1', left: '35%', color: 'rgba(99,102,241,0.55)' },
          { label: 'OCULTA 2', left: '61%', color: 'rgba(139,92,246,0.55)' },
          { label: 'SALIDA',   left: '87%', color: 'rgba(16,185,129,0.55)' },
        ].map(({ label, left, color }) => (
          <span key={label} style={{
            position: 'absolute', bottom: 10, left,
            transform: 'translateX(-50%)',
            fontFamily: 'Orbitron, sans-serif', fontSize: 9,
            letterSpacing: '0.12em', color,
            textTransform: 'uppercase',
          }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Slide ─────────────────────────────────────────────────────────────────────

interface Props { active: boolean }

export function Slide08NeuralNetworks({ active: _active }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  return (
    <section>
      <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-6 md:px-12 gap-6">
        <span className="ghost-num">08</span>

        <div className="relative z-10 max-w-5xl w-full flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3">
            <span className="eyebrow">Redes Neuronales</span>
            <h2 className="slide-title gradient-text text-center">El cerebro artificial</h2>
          </div>

          {/* Info + Spline */}
          <Card className="w-full overflow-hidden relative" style={{
            background: 'rgba(0,0,0,0.92)',
            border: '1px solid rgba(0,212,255,0.15)',
            height: 240,
            boxShadow: '0 0 60px rgba(0,212,255,0.08)',
          }}>
            <Spotlight fill="#00d4ff" className="opacity-30" />
            <div className="relative z-10 h-full grid grid-cols-2">
              <div className="flex flex-col justify-center p-7 gap-3">
                <p className="font-inter text-white/70 text-sm leading-relaxed">
                  Las redes neuronales son sistemas de capas de nodos matemáticos conectados entre sí.
                </p>
                <ul className="flex flex-col gap-1.5">
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
                <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
              </div>
            </div>
          </Card>

          {/* Three.js neural net panel */}
          <div
            ref={panelRef}
            className="relative rounded-2xl overflow-hidden"
            style={{
              height: 420,
              border: '1px solid rgba(0,212,255,0.12)',
              background: 'rgba(0,4,16,0.7)',
            }}
          >
            <NeuralNet3DPanel />
            <div className="absolute top-3 left-0 right-0 flex justify-center z-10 pointer-events-none">
              <span className="font-orbitron text-[0.6rem] tracking-widest text-white/25 uppercase">
                Arquitectura 3D — propagación de señal en tiempo real
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
