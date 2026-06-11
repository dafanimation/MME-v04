// src/components/3d/entities/herramientas/Alicates3D.jsx
import React, { useState } from 'react';
import { Box, Edges } from '@react-three/drei';

export const Alicates3D = ({ position, rotation = [0, 0, 0], onClick, isSelected = false }) => {
  const [hovered, setHovered] = useState(false);
  const color = isSelected ? '#ff44b7' : (hovered ? '#ccaa88' : '#aa8866');
  
  return (
    <group 
      position={position} 
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Mango izquierdo */}
      <Box args={[0.18, 0.04, 0.06]} position={[-0.1, 0, 0]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Box>
      
      {/* Mango derecho */}
      <Box args={[0.18, 0.04, 0.06]} position={[0.1, 0, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Box>
      
      {/* Cabezal */}
      <Box args={[0.12, 0.08, 0.08]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#ccaa88" metalness={0.6} roughness={0.2} />
      </Box>
      
      {/* Pico curvo */}
      <Box args={[0.06, 0.04, 0.1]} position={[0, 0.12, 0.04]} rotation={[0.2, 0, 0]}>
        <meshStandardMaterial color="#bb9966" metalness={0.7} />
      </Box>
    </group>
  );
};

export default Alicates3D;