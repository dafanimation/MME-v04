// ============================================================
// ARCHIVO: src/components/3d/entities/CajaHerramientas3D.jsx
// DESCRIPCIÓN: Componente 3D para caja de herramientas independiente
// FUNCIÓN: Renderiza una caja que puede estar en armario o sobre mesa
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Text, Html } from '@react-three/drei'

const CAJA_CONFIG = {
  width: 0.18,
  height: 0.08,
  depth: 0.22,
  color: '#d4a056',
  bordeColor: '#b8860b',
}

export const CajaHerramientas3D = ({
  id,
  position,
  isSelected = false,
  isAssigned = false,
  assignedMesa = null,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false)
  const { width, height, depth } = CAJA_CONFIG

  const getColor = () => {
    if (isAssigned) return '#ffaa44'
    if (isSelected) return '#ffaa44'
    if (hovered) return '#e8b860'
    return CAJA_CONFIG.color
  }

  return (
    <group
      position={[position.x, position.y, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(id, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[width, height, depth]}>
        <meshStandardMaterial color={getColor()} roughness={0.4} metalness={0.1} />
        <Edges color={CAJA_CONFIG.bordeColor} threshold={15} />
      </Box>
      
      <Box args={[width + 0.01, 0.01, depth + 0.01]} position={[0, height / 2 + 0.005, 0]}>
        <meshStandardMaterial color="#c49040" metalness={0.3} />
      </Box>
      
      <Box args={[0.06, 0.02, 0.03]} position={[0, height / 2 + 0.015, depth / 2 + 0.01]}>
        <meshStandardMaterial color="#aa7733" metalness={0.5} />
      </Box>
      
      {(hovered || isSelected) && (
        <Html position={[0, height + 0.08, 0]} center>
          <div style={tooltipStyle}>
            📦 Caja #{id}
            {isAssigned && assignedMesa && (
              <span style={{ color: '#88ff88' }}> · Asignada a Mesa {assignedMesa}</span>
            )}
            {!isAssigned && <span style={{ color: '#88ff88' }}> · Disponible</span>}
          </div>
        </Html>
      )}
    </group>
  )
}

const tooltipStyle = {
  background: 'rgba(0,0,0,0.85)',
  color: '#ffaa44',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '8px',
  border: '1px solid #ffaa44',
  whiteSpace: 'nowrap',
}

export default CajaHerramientas3D