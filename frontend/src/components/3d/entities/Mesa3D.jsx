// ============================================================
// ARCHIVO: Mesa3D.jsx
// DESCRIPCIÓN: Componente 3D para la mesa principal
// VERSIÓN: 2.0 - Optimizado
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Text, Html } from '@react-three/drei'
import { MESA, MESA_Y, COLORS } from '../core/config'

export const Mesa3D = ({ 
  isSelected = false,
  onClick = null,
  pcsCount = 0,
  usuariosCount = 0,
}) => {
  const [hovered, setHovered] = useState(false)
  
  const mesaColor = isSelected ? COLORS.selected : MESA.colorFill
  const edgeColor = hovered ? COLORS.hover : MESA.colorEdge
  
  return (
    <group
      position={[MESA.x, MESA_Y, MESA.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[MESA.width, MESA.height, MESA.depth]}>
        <meshStandardMaterial
          color={mesaColor}
          transparent
          opacity={MESA.opacity}
          emissive={isSelected ? COLORS.selected : '#000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
        <Edges color={edgeColor} threshold={15} lineWidth={1.5} />
      </Box>
      
      <Text position={[0, MESA.height / 2 + 0.05, 0]} fontSize={0.1} color={edgeColor} anchorX="center" anchorY="middle">
        {MESA.nombre}
      </Text>
      
      {hovered && (
        <Html position={[0, MESA.height / 2 + 0.2, 0]} center>
          <div style={tooltipStyle(COLORS.selected)}>
            🖥️ PCs: {pcsCount}/{MESA.maxPcs} | 👤 Usuarios: {usuariosCount}/{MESA.maxUsuarios}
          </div>
        </Html>
      )}
      
      {isSelected && (
        <group position={[0, MESA.height / 2 + 0.35, 0]}>
          <Html center>
            <div style={panelStyle(COLORS.selected)}>
              <strong>📋 {MESA.nombre}</strong><br />
              Capacidad: {MESA.maxPcs} PCs máximo<br />
              Usuarios: {MESA.maxUsuarios} alrededor
            </div>
          </Html>
        </group>
      )}
    </group>
  )
}

const tooltipStyle = (color) => ({
  background: 'rgba(0,0,0,0.85)',
  color: color,
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '9px',
  border: `1px solid ${color}`,
  whiteSpace: 'nowrap',
})

const panelStyle = (color) => ({
  background: 'rgba(0,0,0,0.9)',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '10px',
  border: `1px solid ${color}`,
  textAlign: 'center',
})

export default Mesa3D
