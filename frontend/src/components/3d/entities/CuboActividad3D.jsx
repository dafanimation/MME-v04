// ============================================================
// ARCHIVO: CuboActividad3D.jsx
// DESCRIPCIÓN: Componente 3D para actividades UD (cubos)
// VERSIÓN: 2.0 - Optimizado
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Text, Html } from '@react-three/drei'
import { ACTIVIDAD, COLORS } from '../core/config'

export const CuboActividad3D = ({ 
  actividad, position, isSelected = false, onClick 
}) => {
  const [hovered, setHovered] = useState(false)
  
  const fillColor = isSelected ? COLORS.selected : ACTIVIDAD.colorFill
  const edgeColor = hovered ? COLORS.hover : ACTIVIDAD.colorEdge
  const yPosition = ACTIVIDAD.size / 2
  
  return (
    <group
      position={[position.x, yPosition, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(actividad, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[ACTIVIDAD.size, ACTIVIDAD.size, ACTIVIDAD.size]}>
        <meshStandardMaterial color={fillColor} transparent opacity={ACTIVIDAD.opacity} />
        <Edges color={edgeColor} threshold={15} lineWidth={1.5} />
      </Box>
      
      {(hovered || isSelected) && (
        <Html position={[0, 0.4, 0]} center>
          <div style={tooltipStyle(edgeColor)}>
            📘 {actividad.udCode}<br />
            {actividad.title}<br />
            Progreso: {actividad.progreso || 0}%
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

export default CuboActividad3D
