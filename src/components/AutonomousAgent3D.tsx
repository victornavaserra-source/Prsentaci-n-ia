import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const MODULES = [
  { label: 'PERCEPCIÓN',    color: 0x00d4ff, labelColor: '#00d4ff', orbitRadius: 2.2, labelPos: { top: '18%', left: '74%' } },
  { label: 'RAZONAMIENTO',  color: 0x8b5cf6, labelColor: '#8b5cf6', orbitRadius: 2.2, labelPos: { top: '72%', left: '72%' } },
  { label: 'PLANIFICACIÓN', color: 0x6366f1, labelColor: '#6366f1', orbitRadius: 2.2, labelPos: { top: '88%', left: '45%' } },
  { label: 'ACCIÓN',        color: 0x10b981, labelColor: '#10b981', orbitRadius: 2.2, labelPos: { top: '68%', left: '16%' } },
  { label: 'MEMORIA',       color: 0xf59e0b, labelColor: '#f59e0b', orbitRadius: 2.2, labelPos: { top: '18%', left: '20%' } },
]

const N_MODULES = MODULES.length

function modulePosition(index: number, time: number, r: number) {
  const a = (index * (Math.PI * 2 / N_MODULES)) + time * 0.0008
  return new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 0.7) * 0.6, Math.sin(a) * r * 0.5)
}

export function AutonomousAgent3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Same pattern as NeuralNetBg: use window dimensions as fallback
    const W = mount.clientWidth  || window.innerWidth
    const H = mount.clientHeight || window.innerHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100)
    camera.position.set(0, 1.5, 6)

    scene.add(new THREE.AmbientLight(0x050810, 0.4))
    const corePl = new THREE.PointLight(0x8b5cf6, 3, 5)
    corePl.position.set(0, 0, 0)
    scene.add(corePl)
    const accentPl = new THREE.PointLight(0x00d4ff, 1.5, 8)
    accentPl.position.set(3, 2, 2)
    scene.add(accentPl)

    const coreGeo = new THREE.IcosahedronGeometry(0.6, 1)
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x0a0a1a, emissive: 0x1a0a2e, emissiveIntensity: 1, shininess: 120,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    scene.add(coreMesh)

    const edgesGeo = new THREE.EdgesGeometry(coreGeo)
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.8 })
    const edges = new THREE.LineSegments(edgesGeo, edgesMat)
    scene.add(edges)

    const moduleGeos = [
      new THREE.OctahedronGeometry(0.22),
      new THREE.TetrahedronGeometry(0.25),
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.ConeGeometry(0.18, 0.35, 6),
      new THREE.TorusGeometry(0.18, 0.07, 8, 16),
    ]

    interface ModuleObj { mesh: THREE.Mesh; mat: THREE.MeshPhongMaterial; pointLight: THREE.PointLight; scale: number }

    const moduleObjs: ModuleObj[] = MODULES.map((mod, i) => {
      const mat = new THREE.MeshPhongMaterial({
        color: mod.color, emissive: mod.color, emissiveIntensity: 0.05, shininess: 80,
      })
      const mesh = new THREE.Mesh(moduleGeos[i], mat)
      scene.add(mesh)
      const pl = new THREE.PointLight(mod.color, 0, 3)
      scene.add(pl)
      return { mesh, mat, pointLight: pl, scale: 1.0 }
    })

    const spokeLines = MODULES.map((mod) => {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute([0,0,0, 0,0,0], 3))
      const mat = new THREE.LineBasicMaterial({ color: mod.color, transparent: true, opacity: 0.3 })
      const line = new THREE.Line(geo, mat)
      scene.add(line)
      return { line, geo }
    })

    const ringGeo = new THREE.BufferGeometry()
    ringGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Array((N_MODULES + 1) * 3).fill(0), 3))
    const ringMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })
    scene.add(new THREE.LineLoop(ringGeo, ringMat))

    const PARTICLES_PER_SPOKE = 20
    const pGeo = new THREE.SphereGeometry(0.04, 5, 5)
    interface Particle { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; t: number; modIndex: number }
    const activeParticles: Particle[] = []

    for (let i = 0; i < N_MODULES * PARTICLES_PER_SPOKE; i++) {
      const modIdx = i % N_MODULES
      const mat = new THREE.MeshBasicMaterial({ color: MODULES[modIdx].color })
      const mesh = new THREE.Mesh(pGeo, mat)
      scene.add(mesh)
      activeParticles.push({ mesh, mat, t: Math.random(), modIndex: modIdx })
    }

    let activeModuleIdx = 0
    const STEP_MS = 1200
    let lastStepTime = performance.now()
    let rafId: number
    const startTime = performance.now()

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const now = performance.now()
      const time = now - startTime

      if (now - lastStepTime >= STEP_MS) {
        activeModuleIdx = (activeModuleIdx + 1) % N_MODULES
        lastStepTime = now
      }

      camera.position.x = Math.sin(time * 0.0003) * 1.2
      camera.lookAt(0, 0, 0)

      coreMesh.rotation.y += 0.003
      coreMesh.rotation.x += 0.003
      edges.rotation.copy(coreMesh.rotation)
      const pulse = Math.sin(time * 0.002) * 0.05 + 1
      coreMesh.scale.setScalar(pulse)
      edges.scale.setScalar(pulse)

      const positions = MODULES.map((_, i) => modulePosition(i, time, MODULES[i].orbitRadius))

      moduleObjs.forEach((obj, i) => {
        const pos = positions[i]
        obj.mesh.position.copy(pos)
        obj.pointLight.position.copy(pos)
        obj.mesh.rotation.x += 0.012 + i * 0.003
        obj.mesh.rotation.y += 0.008 + i * 0.004
        obj.mesh.rotation.z += 0.006 + i * 0.002

        const isActive = i === activeModuleIdx
        const targetScale = isActive ? 1.6 : 1.0
        obj.scale += (targetScale - obj.scale) * 0.1
        obj.mesh.scale.setScalar(obj.scale)
        obj.mat.emissiveIntensity += ((isActive ? 1.0 : 0.05) - obj.mat.emissiveIntensity) * 0.1
        obj.pointLight.intensity += ((isActive ? 4 : 0) - obj.pointLight.intensity) * 0.1

        const spoke = spokeLines[i]
        const arr = spoke.geo.attributes.position.array as Float32Array
        arr[0] = 0; arr[1] = 0; arr[2] = 0
        arr[3] = pos.x; arr[4] = pos.y; arr[5] = pos.z
        spoke.geo.attributes.position.needsUpdate = true
      })

      const ringArr = ringGeo.attributes.position.array as Float32Array
      positions.forEach((pos, i) => {
        ringArr[i * 3] = pos.x; ringArr[i * 3 + 1] = pos.y; ringArr[i * 3 + 2] = pos.z
      })
      ringArr[N_MODULES * 3] = positions[0].x
      ringArr[N_MODULES * 3 + 1] = positions[0].y
      ringArr[N_MODULES * 3 + 2] = positions[0].z
      ringGeo.attributes.position.needsUpdate = true

      activeParticles.forEach(p => {
        p.t += 0.008
        if (p.t > 1) p.t -= 1
        p.mesh.position.lerpVectors(new THREE.Vector3(0, 0, 0), positions[p.modIndex], p.t)
      })

      renderer.render(scene, camera)
    }
    animate()

    const ro = new ResizeObserver(() => {
      const nW = mount.clientWidth, nH = mount.clientHeight
      if (!nW || !nH) return
      camera.aspect = nW / nH
      camera.updateProjectionMatrix()
      renderer.setSize(nW, nH)
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      coreGeo.dispose(); coreMat.dispose()
      edgesGeo.dispose(); edgesMat.dispose()
      moduleGeos.forEach(g => g.dispose())
      moduleObjs.forEach(o => o.mat.dispose())
      spokeLines.forEach(s => s.geo.dispose())
      ringGeo.dispose(); ringMat.dispose(); pGeo.dispose()
      activeParticles.forEach(p => p.mat.dispose())
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {MODULES.map((mod) => (
          <span key={mod.label} style={{
            position: 'absolute',
            top: mod.labelPos.top,
            left: mod.labelPos.left,
            transform: 'translate(-50%, -50%)',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 8,
            letterSpacing: '0.14em',
            color: mod.labelColor,
            textTransform: 'uppercase',
            opacity: 0.85,
            whiteSpace: 'nowrap',
          }}>
            {mod.label}
          </span>
        ))}
      </div>
    </div>
  )
}
