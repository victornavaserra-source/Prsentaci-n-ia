import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function NeuralNetBg({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth || window.innerWidth
    const H = mount.clientHeight || window.innerHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.z = 7

    const group = new THREE.Group()
    scene.add(group)

    // Neural network layers: input → hidden1 → hidden2 → hidden3 → output
    const layers = [4, 7, 7, 6, 3]
    const layerSpacing = 2.8
    const positions: THREE.Vector3[] = []
    const layerBounds: number[] = []

    let nodeIdx = 0
    layers.forEach((count, li) => {
      layerBounds.push(nodeIdx)
      const x = (li / (layers.length - 1)) * (layerSpacing * (layers.length - 1)) - (layerSpacing * (layers.length - 1)) / 2
      for (let n = 0; n < count; n++) {
        const y = (n / (count - 1) - 0.5) * 4.5
        const z = (Math.random() - 0.5) * 1.2
        positions.push(new THREE.Vector3(x, y, z))
        nodeIdx++
      }
    })
    layerBounds.push(nodeIdx)

    // Connection lines
    for (let li = 0; li < layers.length - 1; li++) {
      const startA = layerBounds[li]
      const endA = layerBounds[li + 1]
      const startB = layerBounds[li + 1]
      const endB = layerBounds[li + 2]
      for (let a = startA; a < endA; a++) {
        for (let b = startB; b < endB; b++) {
          if (Math.random() > 0.25) {
            const geo = new THREE.BufferGeometry().setFromPoints([positions[a], positions[b]])
            const mat = new THREE.LineBasicMaterial({
              color: 0x00d4ff,
              transparent: true,
              opacity: 0.06 + Math.random() * 0.08,
            })
            group.add(new THREE.Line(geo, mat))
          }
        }
      }
    }

    // Nodes
    const sphereGeo = new THREE.SphereGeometry(0.07, 12, 12)
    positions.forEach((pos) => {
      const isCyan = Math.random() > 0.3
      const mat = new THREE.MeshBasicMaterial({
        color: isCyan ? 0x00d4ff : 0x7c3aed,
        transparent: true,
        opacity: 0.75 + Math.random() * 0.25,
      })
      const mesh = new THREE.Mesh(sphereGeo, mat)
      mesh.position.copy(pos)
      group.add(mesh)
    })

    let rafId: number
    let t = 0

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      t += 0.005
      group.rotation.y = Math.sin(t * 0.4) * 0.35
      group.rotation.x = Math.sin(t * 0.25) * 0.12
      renderer.render(scene, camera)
    }
    animate()

    const observer = new ResizeObserver(() => {
      const nW = mount.clientWidth
      const nH = mount.clientHeight
      camera.aspect = nW / nH
      camera.updateProjectionMatrix()
      renderer.setSize(nW, nH)
    })
    observer.observe(mount)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  )
}
