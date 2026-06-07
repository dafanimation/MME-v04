// ============================================================
// ARCHIVO: Estanteria3D.jsx
// DESCRIPCIÓN: Componente 3D para estanterías
// VERSIÓN: 2.0 - Optimizado
// ============================================================
// ============================================================
// ARCHIVO: src/components/3d/entities/Estanteria3D.jsx
// DESCRIPCIÓN: Componente 3D para estanterías
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Text, Html } from '@react-three/drei'
// ✅ CORREGIDO: importar desde core/config
import { ESTANTERIA, COLORS } from '../core/config'

export const Estanteria3D = ({ 
  estanteria, position, isSelected = false, onClick 
}) => {
  const [hovered, setHovered] = useState(false)
  
  const fillColor = isSelected ? COLORS.selected : ESTANTERIA.colorFill
  const edgeColor = hovered ? COLORS.hover : ESTANTERIA.colorEdge
  
  return (
    <group
      position={[position.x, ESTANTERIA.height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(estanteria, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[ESTANTERIA.width, ESTANTERIA.height, ESTANTERIA.depth]}>
        <meshStandardMaterial color={fillColor} transparent opacity={ESTANTERIA.opacity} />
        <Edges color={edgeColor} threshold={15} lineWidth={1} />
      </Box>
      
      <Text position={[0, ESTANTERIA.height / 2 + 0.1, 0]} fontSize={0.08} color={edgeColor} anchorX="center">
        {estanteria.label || 'Estantería'}
      </Text>
      
      {(hovered || isSelected) && (
        <Html position={[0, ESTANTERIA.height / 2 + 0.25, 0]} center>
          <div style={tooltipStyle(edgeColor)}>
            📚 {estanteria.label}<br />
            Capacidad: {estanteria.capacidadTotal || ESTANTERIA.capacidadTotal} elementos
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

export default Estanteria3D
