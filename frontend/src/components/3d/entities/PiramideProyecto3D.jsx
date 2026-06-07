// ============================================================
// ARCHIVO: PiramideProyecto3D.jsx
// DESCRIPCIÓN: Componente 3D para proyectos (pirámides)
// VERSIÓN: 2.1 - Corregido (ConeGeometry → Cone + mesh)
// ============================================================

import React, { useState } from 'react'
import { Html } from '@react-three/drei'
import { PROYECTO, COLORS } from '../core/config'

export const PiramideProyecto3D = ({ 
  proyecto, position, isSelected = false, onClick 
}) => {
  const [hovered, setHovered] = useState(false)
  
  const fillColor = isSelected ? COLORS.selected : PROYECTO.colorFill
  const yPosition = PROYECTO.height / 2
  
  return (
    <group
      position={[position.x, yPosition, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(proyecto, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Cono / Pirámide usando mesh con coneGeometry */}
      <mesh>
        <coneGeometry args={[PROYECTO.radius, PROYECTO.height, 32]} />
        <meshStandardMaterial 
          color={fillColor} 
          transparent 
          opacity={PROYECTO.opacity} 
          emissive={fillColor} 
          emissiveIntensity={hovered || isSelected ? 0.3 : 0} 
        />
      </mesh>
      
      {/* Borde opcional para mejor visibilidad */}
      <mesh position={[0, -PROYECTO.height / 2 + 0.02, 0]}>
        <ringGeometry args={[PROYECTO.radius - 0.03, PROYECTO.radius + 0.02, 32]} />
        <meshStandardMaterial color={fillColor} emissive={fillColor} emissiveIntensity={0.5} />
      </mesh>
      
      {(hovered || isSelected) && (
        <Html position={[0, PROYECTO.height / 2 + 0.2, 0]} center>
          <div style={tooltipStyle(fillColor)}>
            🏗️ <strong>{proyecto.name}</strong><br />
            Estado: {proyecto.status}<br />
            {proyecto.participants?.length || 0} participantes
          </div>
        </Html>
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
  textAlign: 'center',
  whiteSpace: 'nowrap',
})

export default PiramideProyecto3D
