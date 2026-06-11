// ============================================================
// ARCHIVO: Usuario3D.jsx
// DESCRIPCIÓN: Componente 3D para usuarios alrededor de la mesa
// VERSIÓN: 2.0 - Optimizado
// ============================================================

import React, { useState } from 'react'
import { Sphere, Edges, Text, Html } from '@react-three/drei'
import { USUARIO, USER_Y, COLORS } from '../core/config'

export const Usuario3D = ({ 
  user, position, isActive = true, isSelected = false, onClick 
}) => {
  const [hovered, setHovered] = useState(false)
  
  const sphereColor = isSelected ? COLORS.selected : USUARIO.colorFill
  const emissiveIntensity = isSelected ? 0.4 : (hovered ? 0.2 : 0)
  
  return (
    <group
      position={[position.x, USER_Y, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(user, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Sphere args={[USUARIO.radius, 32, 32]}>
        <meshStandardMaterial
          color={sphereColor}
          emissive={USUARIO.colorFill}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={isActive ? USUARIO.opacity : 0.3}
        />
      </Sphere>
      
      {(hovered || isSelected) && (
        <Html position={[0, 0.25, 0]} center>
          <div style={tooltipStyle(isSelected ? COLORS.selected : USUARIO.colorEdge)}>
            <strong>{user.name}</strong><br />
            {user.email && <span style={{ fontSize: '9px' }}>{user.email}</span>}
            {user.group && <div style={{ fontSize: '8px', color: '#aaa' }}>Grupo: {user.group}</div>}
          </div>
        </Html>
      )}
    </group>
  )
}

const tooltipStyle = (color) => ({
  background: 'rgba(0,0,0,0.85)', color, padding: '4px 10px',
  borderRadius: '6px', fontSize: '10px', border: `1px solid ${color}`, textAlign: 'center',
})

export default Usuario3D
