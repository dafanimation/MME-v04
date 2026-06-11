// src/components/3d/entities/herramientas/DestornilladorTorx3D.jsx
// src/components/3d/entities/herramientas/DestornilladorPlano3D.jsx
// src/components/3d/entities/herramientas/DestornilladorPlano3D.jsx
import React, { useState } from 'react';
import { Box, Cylinder, Edges } from '@react-three/drei';
import { COLORS } from '../../core/config';

export const DestornilladorTorx3D = ({
  position,
  rotation = [0, 0, 0],
  onClick,
  isSelected = false,
  yOffset = 0,
}) => {
  const [hovered, setHovered] = useState(false);
  const handleColor = isSelected ? COLORS.selected : (hovered ? '#dd8833' : '#cc7722');
  const shaftColor = '#dddddd';
  const tipColor = '#bbbbbb';

  // La parte más baja del mango (cilindro) está en y = -0.12 (centro - altura/2)
  const BASE_Y_OFFSET = 0.12;

  return (
    <group
      position={[position.x, position.y + yOffset + BASE_Y_OFFSET, position.z]}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* ========== MANGO (cilindro con estrías) ========== */}
      {/* Cuerpo principal del mango */}
      <Cylinder args={[0.055, 0.055, 0.24, 12]} position={[0, -0.02, 0]}>
        <meshStandardMaterial color={handleColor} metalness={0.3} roughness={0.5} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Cylinder>
      
      {/* Detalles de agarre (anillos alrededor) */}
      <Cylinder args={[0.06, 0.06, 0.04, 12]} position={[0, -0.12, 0]}>
        <meshStandardMaterial color="#22a6aa" metalness={0.2} roughness={0.6} />
      </Cylinder>
      <Cylinder args={[0.06, 0.06, 0.04, 12]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#22a6aa" metalness={0.2} roughness={0.6} />
      </Cylinder>

      {/* ========== VÁSTAGO METÁLICO ========== */}
      <Cylinder args={[0.022, 0.022, 0.18, 8]} position={[0, 0.14, 0]}>
        <meshStandardMaterial color={shaftColor} metalness={0.9} roughness={0.1} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Cylinder>

      {/* ========== PUNTA PLANA (cuña) ========== */}
      {/* Base de la punta (ensanchamiento) */}
      <Box args={[0.045, 0.025, 0.045]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color={tipColor} metalness={0.85} roughness={0.2} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Box>
      {/* Cuña plana (prisma triangular) – simulada con un box estrecho y aplanado */}
      <Box args={[0.06, 0.015, 0.04]} position={[0, 0.275, 0]}>
        <meshStandardMaterial color={tipColor} metalness={0.9} roughness={0.15} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Box>
      <Box args={[0.05, 0.008, 0.035]} position={[0, 0.29, 0]}>
        <meshStandardMaterial color={tipColor} metalness={0.9} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Box>

      {/* Pequeño reborde entre vástago y punta */}
      <Cylinder args={[0.03, 0.03, 0.01, 6]} position={[0, 0.235, 0]}>
        <meshStandardMaterial color="#999999" metalness={0.7} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />

      </Cylinder>
    </group>
  );
};

export default DestornilladorTorx3D;