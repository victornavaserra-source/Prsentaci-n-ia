import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const CYAN = 0x00d4ff

// Network topology
const LAYERS = [4, 6, 6, 3]
const LAYER_X = [-5.5, -1.83, 1.83, 5.5]
const V_SPREAD = 4.0
const Z_SPREAD = 1.6

const INPUT_LABELS = ['Sonido', 'Imagen', 'Texto', 'Datos']
const OUTPUT_LABELS = ['Clasificar', 'Predecir', 'Generar']

// Timing constants
const PULSE_SPEED = 0.9     // progress units per second
const NODE_DECAY = 1.6      // activation decay per second
const WAVE_INTERVAL = 2.0   // seconds between waves

export interface NeuralNetBgProps {
  className?: string
  mode?: 'background' | 'panel'
  showLabels?: boolean
}

export function NeuralNetBg({ className, mode = 'background', showLabels }: NeuralNetBgProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const labelsRef = useRef<HTMLDivElement>(null)

  const displayLabels = showLabels ?? mode === 'background'

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth || window.innerWidth
    const H = mount.clientHeight || window.innerHeight

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = false
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    const camDist = mode === 'panel' ? 9.5 : 12
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100)
    camera.position.set(0, 0, camDist)

    // Lights
    const ambient = new THREE.AmbientLight(0x112244, 4)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0x00d4ff, 1.2)
    dirLight.position.set(6, 6, 6)
    scene.add(dirLight)

    // ── Network geometry ──────────────────────────────────────────────────────
    const group = new THREE.Group()
    scene.add(group)

    // Fixed seed-like positions with deterministic Z spread
    const nodePos: THREE.Vector3[][] = LAYERS.map((count, li) => {
      return Array.from({ length: count }, (_, n) => {
        const x = LAYER_X[li]
        const y = count === 1 ? 0 : (n / (count - 1) - 0.5) * V_SPREAD
        // Deterministic Z using a simple hash
        const zSeed = (li * 13 + n * 7) % 100 / 100 - 0.5
        const z = zSeed * Z_SPREAD * 2
        return new THREE.Vector3(x, y, z)
      })
    })

    // ── Nodes: main sphere + glow sphere ─────────────────────────────────────
    const mainGeo = new THREE.SphereGeometry(0.13, 20, 20)
    const glowGeo = new THREE.SphereGeometry(0.32, 12, 12)
    const outerGeo = new THREE.SphereGeometry(0.55, 10, 10)

    interface NodeData {
      main: THREE.Mesh
      glow: THREE.Mesh
      outer: THREE.Mesh
      activation: number
    }
    const nodes: NodeData[][] = nodePos.map((layer) =>
      layer.map((pos) => {
        const mainMat = new THREE.MeshPhongMaterial({
          color: CYAN,
          emissive: CYAN,
          emissiveIntensity: 0.04,
          transparent: true,
          opacity: 0.9,
          shininess: 150,
        })
        const main = new THREE.Mesh(mainGeo, mainMat)
        main.position.copy(pos)
        group.add(main)

        const glowMat = new THREE.MeshBasicMaterial({
          color: CYAN,
          transparent: true,
          opacity: 0,
          side: THREE.BackSide,
          depthWrite: false,
        })
        const glow = new THREE.Mesh(glowGeo, glowMat)
        glow.position.copy(pos)
        group.add(glow)

        const outerMat = new THREE.MeshBasicMaterial({
          color: CYAN,
          transparent: true,
          opacity: 0,
          side: THREE.BackSide,
          depthWrite: false,
        })
        const outer = new THREE.Mesh(outerGeo, outerMat)
        outer.position.copy(pos)
        group.add(outer)

        return { main, glow, outer, activation: 0 }
      })
    )

    // ── Edges ─────────────────────────────────────────────────────────────────
    interface EdgeData {
      line: THREE.Line
      mat: THREE.LineBasicMaterial
      fromLayer: number
      fromNode: number
      toLayer: number
      toNode: number
    }
    const edges: EdgeData[] = []
    const edgesByFromLayer: EdgeData[][] = LAYERS.map(() => [])

    for (let li = 0; li < LAYERS.length - 1; li++) {
      for (let a = 0; a < LAYERS[li]; a++) {
        for (let b = 0; b < LAYERS[li + 1]; b++) {
          const geo = new THREE.BufferGeometry().setFromPoints([nodePos[li][a], nodePos[li + 1][b]])
          const mat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.07 })
          const line = new THREE.Line(geo, mat)
          group.add(line)
          const edge: EdgeData = { line, mat, fromLayer: li, fromNode: a, toLayer: li + 1, toNode: b }
          edges.push(edge)
          edgesByFromLayer[li].push(edge)
        }
      }
    }

    // ── Pulse particle system ─────────────────────────────────────────────────
    interface Pulse {
      mesh: THREE.Mesh
      light: THREE.PointLight
      edge: EdgeData
      progress: number
    }

    const pulseGeo = new THREE.SphereGeometry(0.065, 8, 8)
    const pool: Pulse[] = []
    const active: Pulse[] = []
    const nodeSpawned: boolean[][] = LAYERS.map(count => Array(count).fill(false))

    function acquire(edge: EdgeData): Pulse {
      const p = pool.pop()
      if (p) {
        p.edge = edge
        p.progress = 0
        p.mesh.visible = true
        p.light.visible = true
        return p
      }
      const pmat = new THREE.MeshBasicMaterial({ color: CYAN })
      const mesh = new THREE.Mesh(pulseGeo, pmat)
      scene.add(mesh)
      const light = new THREE.PointLight(CYAN, 3, 2)
      scene.add(light)
      return { mesh, light, edge, progress: 0 }
    }
    function release(p: Pulse) {
      p.mesh.visible = false
      p.light.visible = false
      pool.push(p)
      p.edge.mat.opacity = 0.07
    }

    // ── Wave state ────────────────────────────────────────────────────────────
    let waveTimer = 0.8 // start first wave quickly
    let waveRunning = false

    function startWave() {
      waveRunning = true
      for (let li = 0; li < LAYERS.length; li++) nodeSpawned[li].fill(false)
      // Activate layer-0 nodes instantly
      nodes[0].forEach((nd, n) => {
        nd.activation = 1
        nodeSpawned[0][n] = true
      })
      // Spawn pulses layer 0 → 1
      edgesByFromLayer[0].forEach(e => active.push(acquire(e)))
    }

    // ── Camera orbit ──────────────────────────────────────────────────────────
    let autoTheta = 0

    // ── Labels (DOM overlay) ──────────────────────────────────────────────────
    const labelsEl = labelsRef.current
    const labelEls: HTMLElement[] = []

    if (displayLabels && labelsEl) {
      const inCount = Math.min(LAYERS[0], INPUT_LABELS.length)
      for (let n = 0; n < inCount; n++) {
        const el = document.createElement('span')
        el.textContent = INPUT_LABELS[n]
        el.style.cssText = [
          'position:absolute',
          'font-family:Inter,sans-serif',
          'font-size:11px',
          'color:rgba(0,212,255,0.5)',
          'pointer-events:none',
          'transform:translate(-110%,-50%)',
          'white-space:nowrap',
          'letter-spacing:0.06em',
          'transition:color 0.15s',
        ].join(';')
        labelsEl.appendChild(el)
        labelEls.push(el)
      }
      const outCount = Math.min(LAYERS[LAYERS.length - 1], OUTPUT_LABELS.length)
      for (let n = 0; n < outCount; n++) {
        const el = document.createElement('span')
        el.textContent = OUTPUT_LABELS[n]
        el.style.cssText = [
          'position:absolute',
          'font-family:Inter,sans-serif',
          'font-size:11px',
          'color:rgba(0,212,255,0.5)',
          'pointer-events:none',
          'transform:translate(12%,-50%)',
          'white-space:nowrap',
          'letter-spacing:0.06em',
          'transition:color 0.15s',
        ].join(';')
        labelsEl.appendChild(el)
        labelEls.push(el)
      }
    }

    const tmpVec = new THREE.Vector3()
    function toScreen(worldPos: THREE.Vector3) {
      tmpVec.copy(worldPos)
      group.localToWorld(tmpVec)
      tmpVec.project(camera)
      const cW = mount!.clientWidth
      const cH = mount!.clientHeight
      return { x: (tmpVec.x + 1) / 2 * cW, y: (1 - tmpVec.y) / 2 * cH }
    }

    // ── Animation loop ────────────────────────────────────────────────────────
    let rafId: number
    let prevTime = performance.now()

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const now = performance.now()
      const dt = Math.min((now - prevTime) / 1000, 0.05)
      prevTime = now

      // Camera orbit
      autoTheta += 0.00045
      const phi = mode === 'panel' ? 0.12 : 0.08
      camera.position.set(
        camDist * Math.sin(autoTheta) * Math.cos(phi),
        camDist * Math.sin(phi),
        camDist * Math.cos(autoTheta) * Math.cos(phi),
      )
      camera.lookAt(0, 0, 0)

      // Wave timer
      if (!waveRunning) {
        waveTimer += dt
        if (waveTimer >= WAVE_INTERVAL) {
          waveTimer = 0
          startWave()
        }
      }

      // Update pulses
      const toRelease: Pulse[] = []
      const toSpawn: EdgeData[] = []

      for (const pulse of active) {
        pulse.progress += dt * PULSE_SPEED
        if (pulse.progress >= 1) {
          toRelease.push(pulse)
          const { toLayer, toNode } = pulse.edge
          // Activate destination node
          nodes[toLayer][toNode].activation = 1
          // Cascade to next layer (once per node)
          if (toLayer < LAYERS.length - 1 && !nodeSpawned[toLayer][toNode]) {
            nodeSpawned[toLayer][toNode] = true
            edgesByFromLayer[toLayer]
              .filter(e => e.fromNode === toNode)
              .forEach(e => toSpawn.push(e))
          }
        } else {
          const from = nodePos[pulse.edge.fromLayer][pulse.edge.fromNode]
          const to = nodePos[pulse.edge.toLayer][pulse.edge.toNode]
          pulse.mesh.position.lerpVectors(from, to, pulse.progress)
          pulse.light.position.copy(pulse.mesh.position)
          pulse.edge.mat.opacity = 0.07 + pulse.progress * 0.58
        }
      }

      for (const p of toRelease) {
        active.splice(active.indexOf(p), 1)
        release(p)
      }
      for (const e of toSpawn) {
        active.push(acquire(e))
      }
      if (active.length === 0 && waveRunning) waveRunning = false

      // Node activation decay + material update
      for (let li = 0; li < LAYERS.length; li++) {
        for (let n = 0; n < LAYERS[li]; n++) {
          const nd = nodes[li][n]
          nd.activation = Math.max(0, nd.activation - dt * NODE_DECAY)
          const act = nd.activation
          ;(nd.main.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.04 + act * 0.92
          ;(nd.glow.material as THREE.MeshBasicMaterial).opacity = act * 0.38
          ;(nd.outer.material as THREE.MeshBasicMaterial).opacity = act * 0.14
        }
      }

      // Label positions
      if (displayLabels && labelsEl && labelEls.length > 0) {
        let idx = 0
        const inCount = Math.min(LAYERS[0], INPUT_LABELS.length)
        for (let n = 0; n < inCount; n++) {
          const { x, y } = toScreen(nodePos[0][n])
          const act = nodes[0][n].activation
          const el = labelEls[idx++]
          el.style.left = x + 'px'
          el.style.top = y + 'px'
          el.style.color = `rgba(0,212,255,${0.45 + act * 0.55})`
        }
        const lastLi = LAYERS.length - 1
        const outCount = Math.min(LAYERS[lastLi], OUTPUT_LABELS.length)
        for (let n = 0; n < outCount; n++) {
          const { x, y } = toScreen(nodePos[lastLi][n])
          const act = nodes[lastLi][n].activation
          const el = labelEls[idx++]
          el.style.left = x + 'px'
          el.style.top = y + 'px'
          el.style.color = `rgba(0,212,255,${0.45 + act * 0.55})`
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      const nW = mount.clientWidth
      const nH = mount.clientHeight
      camera.aspect = nW / nH
      camera.updateProjectionMatrix()
      renderer.setSize(nW, nH)
    })
    resizeObserver.observe(mount)

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      mainGeo.dispose()
      glowGeo.dispose()
      outerGeo.dispose()
      pulseGeo.dispose()
      edges.forEach(e => { e.line.geometry.dispose(); e.mat.dispose() })
      nodes.flat().forEach(nd => {
        ;(nd.main.material as THREE.Material).dispose()
        ;(nd.glow.material as THREE.Material).dispose()
        ;(nd.outer.material as THREE.Material).dispose()
      })
      ;[...active, ...pool].forEach(p => {
        ;(p.mesh.material as THREE.Material).dispose()
      })
      renderer.dispose()
      if (labelsEl) labelsEl.innerHTML = ''
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [mode, displayLabels])

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <div
        ref={labelsRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
      />
    </div>
  )
}
