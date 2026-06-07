// ============================================================
// ARCHIVO: src/components/ui/UserSphere.jsx
// DESCRIPCIÓN: Componente 3D para representar usuarios como esferas
// FUNCIÓN: Muestra una esfera 3D con color según rol, animación al seleccionar
// PROPS:
//   - user: Objeto con datos del usuario (name, email, role, group)
//   - position: { x, y, z } coordenadas 3D
//   - isSelected: boolean, resalta la esfera
//   - isActiveSession: boolean, muestra anillo verde alrededor
//   - onClick: callback al hacer clic
// ============================================================

import React, { useRef } from 'react'
import { Sphere, Text, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

/**
 * Obtiene las iniciales del usuario para mostrar en el tooltip
 * @param {Object} user - Datos del usuario
 * @returns {string} Iniciales (máx 3 caracteres)
 */
const getInitials = (user) => {
  const source = String(user?.name || user?.email || 'Usuari').trim()
  const cleaned = source.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  const tokens = cleaned.split(' ').filter(Boolean)
  
  if (tokens.length === 0) return 'U'
  if (tokens.length === 1) {
    const compact = tokens[0].replace(/[^a-z0-9]/gi, '')
    return (compact.slice(0, 2) || 'U').toUpperCase()
  }
  
  return tokens.map((token) => token[0]).join('').slice(0, 3).toUpperCase()
}

export const UserSphere = React.memo(function UserSphere({ 
  user,           // Datos del usuario
  position,       // { x, y, z } en el espacio 3D
  isSelected,     // Si está seleccionado (efecto de brillo)
  isActiveSession, // Si tiene sesión activa (anillo verde)
  onClick         // Callback al hacer clic
}) {
  const meshRef = useRef()
  
  // Color según rol/grupo: admin(cyan), BIP(naranja), otros(gris)
  const color = user.role === 'admin' 
    ? '#00d4ff'   // Cyan para admin
    : (user.group === 'BIP' 
      ? '#ff8800' // Naranja para BIP
      : '#888888') // Gris para usuarios normales
  
  const initials = getInitials(user)

  // Animación de parpadeo cuando está seleccionado
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      const blink = Math.sin(state.clock.elapsedTime * 5) * 0.3 + 0.7
      meshRef.current.material.emissiveIntensity = blink
    }
  })

  return (
    <group
      position={[position.x, position.y, position.z]}
      onClick={(event) => {
        event.stopPropagation()
        if (onClick) onClick(event)
      }}
    >
      {/* Anillo de sesión activa (verde) */}
      {isActiveSession && (
        <Sphere args={[0.29, 20, 20]}>
          <meshStandardMaterial
            color="#00ff88"
            emissive="#003f1f"
            emissiveIntensity={0.8}
            wireframe
            transparent
            opacity={0.9}
          />
        </Sphere>
      )}
      
      {/* Esfera principal del usuario */}
      <Sphere args={[0.2, 24, 24]} ref={meshRef}>
        <meshStandardMaterial
          color={color}
          emissive={isSelected ? color : '#000'}
          emissiveIntensity={isSelected ? 0.4 : 0}
          wireframe={!isSelected}
          transparent
          opacity={isSelected ? 1 : 0.75}
        />
      </Sphere>
      
      {/* Nombre debajo de la esfera */}
      <Text position={[0, -0.32, 0]} fontSize={0.08} color="white" anchorX="center">
        {user.name?.split(' ')[0] || user.email?.split('@')[0] || 'Usuari'}
      </Text>
      
      {/* Tooltip flotante con iniciales */}
      <Html position={[0, 0.34, 0]} center>
        <div
          style={{
            background: isActiveSession ? 'rgba(0, 63, 31, 0.94)' : 'rgba(10, 14, 24, 0.94)',
            color: isActiveSession ? '#8dffbf' : '#d8f5ff',
            padding: '3px 7px',
            borderRadius: '999px',
            fontSize: '10px',
            border: `1px solid ${isActiveSession ? '#00ff88' : '#00d4ff'}`,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}
        >
          {initials}
        </div>
      </Html>
    </group>
  )
})