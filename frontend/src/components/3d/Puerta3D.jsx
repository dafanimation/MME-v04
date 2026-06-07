// ============================================================
// ARCHIVO: Puerta3D.jsx
// DESCRIPCIÓN: Componente 3D para la puerta de entrada
// AUTOR: Sistema MME
// VERSIÓN: 1.0
// FECHA: 2026-06-04
// ============================================================

import React from 'react'
import { Box, Edges } from '@react-three/drei'

export const Puerta3D = ({ position, ancho = 0.8, alto = 2.0 }) => {
  return (
    <group position={[position.x, alto / 2, position.z]}>
      {/* Hoja de la puerta */}
      <Box args={[ancho, alto, 0.08]}>
        <meshStandardMaterial color="#8B5A2B" metalness={0.1} roughness={0.7} />
        <Edges color="#aa7744" threshold={15} />
      </Box>
      
      {/* Tirador */}
      <Box args={[0.04, 0.12, 0.05]} position={[ancho / 2 - 0.12, 0.1, 0.05]}>
        <meshStandardMaterial color="#ddaa66" metalness={0.8} />
      </Box>
      
      {/* Bisagras */}
      <Box args={[0.05, 0.05, 0.05]} position={[-ancho / 2 + 0.03, 0.3, 0.05]}>
        <meshStandardMaterial color="#ddaa66" metalness={0.8} />
      </Box>
      <Box args={[0.05, 0.05, 0.05]} position={[-ancho / 2 + 0.03, -0.2, 0.05]}>
        <meshStandardMaterial color="#ddaa66" metalness={0.8} />
      </Box>
    </group>
  )
}

export default Puerta3D