// ============================================================
// ARCHIVO: Usuario3D.jsx
// DESCRIPCIÓN: Componente 3D para usuarios alrededor de la mesa
// VERSIÓN: 2.0 - Optimizado
// ============================================================
// src/components/3d/entities/Usuario3D.jsx
// Este componente representa a un usuario como una esfera con su nombre encima.
// El color de la esfera se basa en el avatarColor del usuario o se genera aleatoriamente.
// Al hacer hover o seleccionar, muestra un tooltip con información adicional.
// El componente es interactivo y puede recibir eventos de click para mostrar detalles o acciones relacionadas con el usuario.
// ============================================================
// REVISIONES:
// 2.0 - Optimización de colores y estilos, añadido tooltip con email y grupo, mejor manejo de eventos
// ============================================================

import React, { useState, useMemo } from 'react';
import { Sphere, Edges, Text, Html } from '@react-three/drei';
import { USUARIO, USER_Y, COLORS } from '../core/config';

// Función para generar color aleatorio (si no tiene avatarColor)
const getRandomColor = () => {
  const hue = Math.random();
  return `hsl(${hue * 360}, 70%, 60%)`;
};

export const Usuario3D = ({
  user,
  position,
  isActive = true,
  isSelected = false,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);

  // Color del usuario: si tiene avatarColor lo usa, sino uno aleatorio (memorizado)
  const userColor = useMemo(() => {
    if (user.avatarColor) return user.avatarColor;
    // Generar un color basado en el email para consistencia entre sesiones
    if (user.email) {
      const hue = (user.email.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360) / 360;
      return `hsl(${hue * 360}, 70%, 60%)`;
    }
    return getRandomColor();
  }, [user.avatarColor, user.email]);

  const sphereColor = isSelected ? COLORS.selected : userColor;
  const emissiveIntensity = isSelected ? 0.4 : (hovered ? 0.2 : 0);

  return (
    <group
      position={[position.x, position.y ?? USER_Y, position.z]}  // ← usa position.y si existe, si no USER_Y
      onClick={(e) => { e.stopPropagation(); onClick?.(user, e); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Esfera principal */}
      <Sphere args={[USUARIO.radius, 32, 32]}>
        <meshStandardMaterial
          color={sphereColor}
          emissive={sphereColor}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={isActive ? USUARIO.opacity : 0.3}
        />
      </Sphere>

      {/* Texto con el nombre (sobre la esfera) */}
      <Text
        position={[0, USUARIO.radius + 0.08, 0]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {user.name?.split(' ')[0] || 'Usuario'}
      </Text>

      {/* Tooltip al hover */}
      {(hovered || isSelected) && (
        <Html position={[0, USUARIO.radius + 0.25, 0]} center>
          <div style={tooltipStyle(isSelected ? COLORS.selected : sphereColor)}>
            <strong>{user.name}</strong><br />
            {user.email && <span style={{ fontSize: '9px' }}>{user.email}</span>}
            {user.group && <div style={{ fontSize: '8px', color: '#aaa' }}>Grupo: {user.group}</div>}
          </div>
        </Html>
      )}
    </group>
  );
};

const tooltipStyle = (color) => ({
  background: 'rgba(0,0,0,0.85)',
  color,
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '10px',
  border: `1px solid ${color}`,
  textAlign: 'center',
  whiteSpace: 'nowrap',
});

export default Usuario3D;