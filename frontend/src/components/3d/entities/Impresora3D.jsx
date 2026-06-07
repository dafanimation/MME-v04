// ============================================================
// ARCHIVO: Impresora3D.jsx
// DESCRIPCIÓN: Componente 3D para impresoras
// VERSIÓN: 2.0 - Optimizado
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Text, Html } from '@react-three/drei'
import { IMPRESORA, getColorByStatus, COLORS } from '../core/config'

export const Impresora3D = ({ 
  impresora, position, isSelected = false, onClick 
}) => {
  const [hovered, setHovered] = useState(false)
  
  const statusColor = getColorByStatus(IMPRESORA, impresora.status)
  const finalColor = isSelected ? COLORS.selected : statusColor
  const yPosition = 0.12
  
  return (
    <group
      position={[position.x, yPosition, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(impresora, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[IMPRESORA.width, IMPRESORA.height, IMPRESORA.depth]}>
        <meshStandardMaterial color={finalColor} transparent opacity={IMPRESORA.opacity} />
        <Edges color={hovered ? COLORS.hover : IMPRESORA.colorEdge} threshold={15} />
      </Box>
      
      <Text position={[0, -0.12, 0]} fontSize={0.05} color="white" anchorX="center">
        {impresora.code?.slice(0, 5) || 'PRN'}
      </Text>
      
      {(hovered || isSelected) && (
        <Html position={[0, 0.25, 0]} center>
          <div style={tooltipStyle(finalColor)}>
            🖨️ {impresora.code}<br />
            Estado: {impresora.status}
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

export default Impresora3D
