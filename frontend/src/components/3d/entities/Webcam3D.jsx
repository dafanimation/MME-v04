// ============================================================
// ARCHIVO: src/components/3d/entities/Webcam3D.jsx
// DESCRIPCIÓN: Componente 3D para cámara web con reconocimiento facial
// VERSIÓN: 1.0
// FECHA: 2026-06-06
// ============================================================

// src/components/3d/entities/Webcam3D.jsx
import React, { useState } from 'react';
import { Sphere, Cone, Cylinder, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../core/config';

export const Webcam3D = ({
  position,
  rotation = [0, 0, 0],
  onClick,
  isSelected = false,
  yOffset = 0,
  isActive = false,
  currentUser = null,
}) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const sphereColor = isSelected ? COLORS.selected : (hovered ? '#aaaaaa' : '#888888');
  const coneColor = '#333333';
  const baseColor = '#555555';
  const BASE_Y_OFFSET = 0.08;

  const handleClick = (e) => {
    e.stopPropagation();
    navigate('/capture');
    onClick?.(e);
  };

  return (
    <group
      position={[position.x, position.y + yOffset + BASE_Y_OFFSET, position.z]}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Cylinder args={[0.06, 0.06, 0.02, 8]} position={[0, -0.08, 0]}>
        <meshStandardMaterial color={baseColor} metalness={0.3} roughness={0.6} />
      </Cylinder>
      <Sphere args={[0.08, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color={sphereColor} metalness={0.4} roughness={0.3} />
      </Sphere>
      <Cone args={[0.035, 0.05, 16]} position={[0, 0, 0.09]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color={coneColor} metalness={0.8} roughness={0.1} />
      </Cone>
      <Sphere args={[0.01, 8, 8]} position={[0.05, 0.05, 0.085]}>
        <meshStandardMaterial
          color={isActive ? '#00ff88' : '#ff4444'}
          emissive={isActive ? '#00ff88' : '#440000'}
          emissiveIntensity={0.6}
        />
      </Sphere>
      {hovered && (
        <Html position={[0, 0.12, 0]} center>
          <div style={tooltipStyle}>📸 Clic para capturar foto</div>
        </Html>
      )}
    </group>
  );
};

const tooltipStyle = {
  background: 'rgba(0,0,0,0.8)',
  color: '#ffaa44',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '10px',
  whiteSpace: 'nowrap',
  border: '1px solid #ffaa44',
};

export default Webcam3D