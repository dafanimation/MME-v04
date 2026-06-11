// src/components/3d/entities/herramientas/Multimetro3D.jsx
import React, { useState } from 'react';
import { Box, Cylinder, Edges } from '@react-three/drei';
import { COLORS } from '../../core/config';

export const Multimetro3D = ({
  position,
  rotation = [0, 0, 0],
  onClick,
  isSelected = false,
  yOffset = 0,
}) => {
  const [hovered, setHovered] = useState(false);
  const bodyColor = isSelected ? COLORS.selected : (hovered ? '#dddddd' : '#c0c0c0');
  const screenColor = '#2a6e3a';
  const knobColor = '#333333';
  const portColor = '#222222';

  // La parte más baja de la carcasa (caja) está en y = -0.1 (mitad de altura)
  const BASE_Y_OFFSET = 0.1;

  return (
    <group
      position={[position.x, position.y + yOffset + BASE_Y_OFFSET, position.z]}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Cuerpo principal */}
      <Box args={[0.36, 0.2, 0.14]} position={[0, 0, 0]}>
        <meshStandardMaterial color={bodyColor} metalness={0.2} roughness={0.5} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Box>

      {/* Pantalla LCD */}
      <Box args={[0.26, 0.1, 0.02]} position={[0, 0.04, 0.071]} color={screenColor}>
        <meshStandardMaterial color={screenColor} emissive="#1a4a2a" emissiveIntensity={0.3} metalness={0.1} />
      </Box>
      {/* Marco de la pantalla */}
      <Box args={[0.28, 0.12, 0.01]} position={[0, 0.04, 0.073]}>
        <meshStandardMaterial color="#555555" metalness={0.5} />
      </Box>

      {/* Selector giratorio (dial) */}
      <Cylinder args={[0.07, 0.07, 0.03, 30]} position={[-0.1, -0.04, 0.072]} rotation={[30, 0, 0]}>
        <meshStandardMaterial color={knobColor} metalness={0.3} roughness={0.6} />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.02, 16]} position={[-0.1, -0.035, 0.073]}>
        <meshStandardMaterial color="#666666" metalness={0.4} />
      </Cylinder>

      {/* Pulsador / botón rojo */}
      <Cylinder args={[0.03, 0.03, 0.025, 8]} position={[0.12, 0.01, 0.072]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#cc3333" metalness={0.2} roughness={0.4} />
      </Cylinder>

      {/* Conectores (jack) */}
      <Cylinder args={[0.02, 0.02, 0.06, 8]} position={[-0.15, -0.08, 0.071]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color={portColor} metalness={0.1} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.06, 8]} position={[0.02, -0.08, 0.071]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color={portColor} metalness={0.1} />
      </Cylinder>

      {/* Etiquetas o detalles (opcional) */}
      <Box args={[0.04, 0.01, 0.01]} position={[0.15, 0.05, 0.072]}>
        <meshStandardMaterial color="#ffaa44" />
      </Box>
    </group>
  );
};

export default Multimetro3D;