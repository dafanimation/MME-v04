// ============================================================
// ARCHIVO: Pantalla3D.jsx
// DESCRIPCIÓN: Componente 3D para pantallas sobre PCs
// VERSIÓN: 2.0 - Optimizado
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Html } from '@react-three/drei'
import { PANTALLA, PC_Y, PC, getColorByStatus, COLORS } from '../core/config'

export const Pantalla3D = ({ 
  pantalla, position, pcId, indice = 0, isSelected = false, onClick 
}) => {
  const [hovered, setHovered] = useState(false)
  
  const offsetX = indice === 0 ? -0.12 : 0.12
  const statusColor = getColorByStatus(PANTALLA, pantalla.status)
  const finalColor = isSelected ? COLORS.selected : statusColor
  const yPosition = PC_Y + PC.height / 2 + PANTALLA.height / 2 + 0.02
  
  return (
    <group
      position={[position.x + offsetX, yPosition, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(pantalla, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[PANTALLA.width, PANTALLA.height, PANTALLA.depth]}>
        <meshStandardMaterial color={finalColor} transparent opacity={PANTALLA.opacity} />
        <Edges color={hovered ? COLORS.hover : PANTALLA.colorEdge} threshold={15} />
      </Box>
      
      {(hovered || isSelected) && (
        <Html position={[0, 0.3, 0]} center>
          <div style={tooltipStyle(finalColor)}>
            🖵 Pantalla {indice + 1}<br />
            Estado: {pantalla.status}
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

export default Pantalla3D
