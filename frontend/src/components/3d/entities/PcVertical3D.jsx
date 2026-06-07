// ============================================================
// ARCHIVO: src/components/3d/entities/PcVertical3D.jsx
// DESCRIPCIÓN: PC en orientación vertical para armarios
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Text } from '@react-three/drei'
import { COLORS } from '../core/config'

export const PcVertical3D = ({ 
  pc, 
  position, 
  index,
  isSelected = false,
  onClick 
}) => {
  const [hovered, setHovered] = useState(false)
  
  // Orientación vertical (torre)
  const width = 0.12   // más estrecho
  const height = 0.22  // más alto
  const depth = 0.12
  
  const color = isSelected ? COLORS.selected : (hovered ? '#88ff88' : '#00ff88')
  
  // Posición X según índice
  const offsetX = (index - 3) * 0.22
  
  return (
    <group
      position={[position.x + offsetX, position.y + height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(pc, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Torre PC */}
      <Box args={[width, height, depth]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        <Edges color={hovered ? COLORS.hover : '#ffffff'} threshold={15} />
      </Box>
      
      {/* Detalle frontal (unidad óptica simulada) */}
      <Box args={[width * 0.6, 0.03, 0.02]} position={[0, -height * 0.2, depth / 2 + 0.01]}>
        <meshStandardMaterial color="#333" />
      </Box>
      
      {/* LED de encendido */}
      <Box args={[0.02, 0.02, 0.02]} position={[width * 0.3, -height * 0.35, depth / 2 + 0.02]}>
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
      </Box>
      
      {/* Etiqueta hover */}
      {hovered && (
        <Text position={[0, height / 2 + 0.08, 0]} fontSize={0.04} color="#00ff88" anchorX="center">
          {pc.code || 'PC'}
        </Text>
      )}
    </group>
  )
}

export default PcVertical3D