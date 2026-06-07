// ============================================================
// ARCHIVO: Ventana3D.jsx
// DESCRIPCIÓN: Componente 3D para ventanas en la pared
// AUTOR: Sistema MME
// VERSIÓN: 1.0
// FECHA: 2026-06-04
// ============================================================

import React from 'react'
import { Box, Edges } from '@react-three/drei'

export const Ventana3D = ({ position, ancho = 1.2, alto = 1.5 }) => {
  return (
    <group position={[position.x, alto / 2 + 0.8, position.z]}>
      {/* Marco de la ventana */}
      <Box args={[ancho + 0.1, alto + 0.1, 0.05]}>
        <meshStandardMaterial color="#8B7355" />
        <Edges color="#aa8866" threshold={15} />
      </Box>
      
      {/* Cristal */}
      <Box args={[ancho - 0.1, alto - 0.1, 0.02]} position={[0, 0, 0.03]}>
        <meshStandardMaterial 
          color="#88aacc" 
          transparent 
          opacity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      
      {/* Barra central (simulando ventana) */}
      <Box args={[0.05, alto, 0.04]} position={[0, 0, 0.04]}>
        <meshStandardMaterial color="#8B7355" />
      </Box>
    </group>
  )
}

export default Ventana3D