// ============================================================
// ARCHIVO: Hdd3D.jsx
// DESCRIPCIÓN: Componente 3D para discos duros dentro de PCs
// VERSIÓN: 2.0 - Optimizado
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Html } from '@react-three/drei'
import { HDD, PC_Y, getColorByStatus, COLORS } from '../core/config'

export const Hdd3D = ({ 
  hdd, position, pcId, indice = 0, isSelected = false, onClick 
}) => {
  const [hovered, setHovered] = useState(false)
  
  const offsetZ = indice === 0 ? -0.1 : 0.1
  const statusColor = getColorByStatus(HDD, hdd.status)
  const finalColor = isSelected ? COLORS.selected : statusColor
  const yPosition = PC_Y + HDD.posicionRelativa.y
  
  return (
    <group
      position={[position.x, yPosition, position.z + offsetZ]}
      onClick={(e) => { e.stopPropagation(); onClick?.(hdd, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[HDD.width, HDD.height, HDD.depth]}>
        <meshStandardMaterial color={finalColor} transparent opacity={HDD.opacity} />
        <Edges color={hovered ? COLORS.hover : HDD.colorEdge} threshold={15} />
      </Box>
      
      {(hovered || isSelected) && (
        <Html position={[0, 0.12, 0]} center>
          <div style={tooltipStyle(finalColor)}>
            💾 HDD {indice + 1}<br />
            {hdd.capacidadGB}GB • {hdd.tipo || 'SSD'}
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

export default Hdd3D
