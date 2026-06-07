// ============================================================
// ARCHIVO: Portatil3D.jsx
// DESCRIPCIÓN: Componente 3D para portátiles
// VERSIÓN: 2.0 - Optimizado
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Text, Html } from '@react-three/drei'
import { PORTATIL, getColorByStatus, COLORS } from '../core/config'

export const Portatil3D = ({ 
  portatil, position, isSelected = false, onClick 
}) => {
  const [hovered, setHovered] = useState(false)
  
  const statusColor = getColorByStatus(PORTATIL, portatil.status)
  const finalColor = isSelected ? COLORS.selected : statusColor
  const yPosition = 0.1
  
  return (
    <group
      position={[position.x, yPosition, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(portatil, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[PORTATIL.width, PORTATIL.height, PORTATIL.depth]}>
        <meshStandardMaterial color={finalColor} transparent opacity={PORTATIL.opacity} />
        <Edges color={hovered ? COLORS.hover : PORTATIL.colorEdge} threshold={15} />
      </Box>
      
      <Text position={[0, -0.1, 0]} fontSize={0.05} color="white" anchorX="center">
        {portatil.code?.slice(0, 5) || 'LAP'}
      </Text>
      
      {(hovered || isSelected) && (
        <Html position={[0, 0.2, 0]} center>
          <div style={tooltipStyle(finalColor)}>
            💻 {portatil.code}<br />
            Estado: {portatil.status}
          </div>
        </Html>
      )}
    </group>
  )
}

const tooltipStyle = (color) => ({
  background: 'rgba(0,0,0,0.85)', color, padding: '4px 10px',
  borderRadius: '6px', fontSize: '9px', border: `1px solid ${color}`, textAlign: 'center',
})

export default Portatil3D
