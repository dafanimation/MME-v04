// src/components/3d/entities/herramientas/Tijeras3D.jsx
// src/components/3d/entities/herramientas/Tijeras3D.jsx
// src/components/3d/entities/herramientas/Tijeras3D.jsx
import React, { useState } from 'react';
import { Box, Cylinder, Torus, Edges } from '@react-three/drei';
import { COLORS } from '../../core/config';

export const Tijeras3D = ({
  position,
  rotation = [0, 0, 0],
  onClick,
  isSelected = false,
  yOffset = 0,
}) => {
  const [hovered, setHovered] = useState(false);
  const metalColor = isSelected ? COLORS.selected : (hovered ? '#c0c0c0' : '#a0a0a0');
  const handleColor = '#3a3a3a';
  const bladeColor = '#d0d0d0';

  // La parte más baja de los anillos está en y ≈ -0.12 (radio 0.08 - grosor 0.025/2)
  const BASE_Y_OFFSET = 0.12;

  // Coordenadas relativas al grupo principal (sin offset)
  const handleBaseY = -0.05;     // centro vertical de los anillos y brazos
  const pivotY = 0.05;           // eje central (tornillo)
  const bladeBaseY = 0.05;       // base de las hojas (conecta con el eje)

  return (
    <group
      position={[position.x, position.y + yOffset + BASE_Y_OFFSET, position.z]}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* ==================== MANGO IZQUIERDO ==================== */}
      <group>
        {/* Anillo (torus) */}
        <Torus args={[0.08, 0.025, 16, 48]} position={[-0.22, handleBaseY, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={handleColor} metalness={0.5} roughness={0.6} />
        </Torus>
        {/* Brazo recto (conecta anillo con el eje) */}
        <Box args={[0.16, 0.04, 0.04]} position={[-0.12, handleBaseY, 0]} rotation={[0, 0, -0.15]}>
          <meshStandardMaterial color={handleColor} metalness={0.5} roughness={0.5} />
        </Box>
      </group>

      {/* ==================== MANGO DERECHO ==================== */}
      <group>
        <Torus args={[0.08, 0.025, 16, 48]} position={[0.22, handleBaseY, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={handleColor} metalness={0.5} roughness={0.6} />
        </Torus>
        <Box args={[0.16, 0.04, 0.04]} position={[0.12, handleBaseY, 0]} rotation={[0, 0, 0.15]}>
          <meshStandardMaterial color={handleColor} metalness={0.5} roughness={0.5} />
        </Box>
      </group>

      {/* ==================== HOJA IZQUIERDA (triángulo alargado) ==================== */}
      <group>
        {/* Base de la hoja (prisma que se conecta al eje) */}
        <Box args={[0.18, 0.03, 0.06]} position={[-0.07, bladeBaseY + 0.02, 0]} rotation={[0, 0, 0.35]}>
          <meshStandardMaterial color={bladeColor} metalness={0.9} roughness={0.2} />
          <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
        </Box>
        {/* Punta triangular (segundo segmento más delgado) */}
        <Box args={[0.10, 0.02, 0.04]} position={[-0.16, bladeBaseY + 0.09, 0]} rotation={[0, 0, 0.55]}>
          <meshStandardMaterial color={bladeColor} metalness={0.9} roughness={0.2} />
        </Box>
      </group>

      {/* ==================== HOJA DERECHA ==================== */}
      <group>
        <Box args={[0.18, 0.03, 0.06]} position={[0.07, bladeBaseY + 0.02, 0]} rotation={[0, 0, -0.35]}>
          <meshStandardMaterial color={bladeColor} metalness={0.9} roughness={0.2} />
          <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
        </Box>
        <Box args={[0.10, 0.02, 0.04]} position={[0.16, bladeBaseY + 0.09, 0]} rotation={[0, 0, -0.55]}>
          <meshStandardMaterial color={bladeColor} metalness={0.9} roughness={0.2} />
        </Box>
      </group>

      {/* ==================== EJE CENTRAL (tornillo) ==================== */}
      <Cylinder args={[0.045, 0.045, 0.08, 12]} position={[0, pivotY, 0]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#777777" metalness={0.7} roughness={0.3} />
      </Cylinder>
      {/* Cabeza del tornillo */}
      <Cylinder args={[0.065, 0.065, 0.02, 8]} position={[0, pivotY + 0.045, 0]}>
        <meshStandardMaterial color="#aaaaaa" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.065, 0.065, 0.02, 8]} position={[0, pivotY - 0.045, 0]}>
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
      </Cylinder>
    </group>
  );
};

export default Tijeras3D;