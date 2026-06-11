// src/components/3d/core/AutoCenter.jsx
// DESCRIPCIÓN: Componente que centra automáticamente su contenido 3D en el eje Y
// FUNCIÓN: Ajusta la posición de los objetos hijos para que su base quede en y=0

import React, { useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'

// Envuelve un objeto 3D y ajusta su posición vertical para que
// la coordenada mínima Y del bounding box quede en y=0 (centro de la base).
// Esto permite renderizar cualquier componente 3D y que su "base" quede alineada
// con el plano del suelo cuando se coloque el group padre en y=0.
const AutoCenter = ({ children }) => {
  const innerRef = useRef(null)

  useLayoutEffect(() => {
    const node = innerRef.current
    if (!node) return

    const compute = () => {
      try {
        const box = new THREE.Box3().setFromObject(node, true)
        if (!box.isEmpty()) {
          const minY = box.min.y
          // Mover los hijos hacia arriba para que la mínima Y sea 0
          node.position.y -= minY
        }
      } catch (err) {
        // fallbacks: no interrumpir la app
        // eslint-disable-next-line no-console
        console.warn('AutoCenter: error computing bounding box', err)
      }
    }

    // Ejecutar en el próximo frame y después con un pequeño retardo para cubrir
    // casos donde la geometría o texturas se cargan asíncronamente.
    const rafId = requestAnimationFrame(compute)
    const toId = setTimeout(compute, 60)
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(toId)
    }
  }, [children])

  return (
    <group>
      <group ref={innerRef}>{children}</group>
    </group>
  )
}

export default AutoCenter
