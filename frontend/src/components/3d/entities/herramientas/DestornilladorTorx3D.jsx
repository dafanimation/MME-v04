// src/components/3d/entities/herramientas/DestornilladorTorx3D.jsx
import React, { useState } from 'react';
import { Box, Cylinder, Edges } from '@react-three/drei';

export const DestornilladorTorx3D = ({ position, rotation = [0, 0, 0], onClick, isSelected = false }) => {
  const [hovered, setHovered] = useState(false);
  const color = isSelected ? '#ffaa44' : (hovered ? '#dd8833' : '#cc7722');
  
  return (
    <group 
      position={position} 
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Mango */}
      <Cylinder args={[0.05, 0.05, 0.2, 8]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </Cylinder>
      
      {/* Vástago */}
      <Cylinder args={[0.02, 0.02, 0.15, 6]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#dddddd" metalness={0.9} roughness={0.1} />
      </Cylinder>
      
      {/* Punta Torx (estrella) */}
      <Box args={[0.04, 0.04, 0.06]} position={[0, 0.18, 0]}>
        <meshStandardMaterial color="#cccccc" metalness={0.8} />
      </Box>
    </group>
  );
};

export default DestornilladorTorx3D;