// src/components/3d/entities/herramientas/AlicatesPicoDeLoro3D.jsx
// DESCRIPCIÓN: Modelo 3D simplificado de alicates de pico de loro, con interacción de selección y hover
// FUNCIÓN: Renderiza un modelo 3D de alicates con materiales metálicos, y cambia de color al seleccionar o hacer hover
import React, { useState } from 'react';
import { Box, Edges, Cylinder } from '@react-three/drei';
import { COLORS } from '../../core/config';

export const AlicatesPicoDeLoro3D = ({ 
  position, 
  rotation = [0, 0, 0], 
  onClick, 
  isSelected = false,
  // Permite un offset vertical adicional (como en Impresora3D)
  yOffset = 0 
}) => {
  const [hovered, setHovered] = useState(false);
  const color = isSelected ? COLORS.selected : (hovered ? '#ccaa88' : '#aa8866');
  
  // Desplazamiento vertical para que la parte más baja (mango) quede exactamente en Y=0
  // Originalmente los mangos iban de -0.11 a +0.11, cabezal desde 0.06, etc.
  // Subimos todo +0.11 para que el punto más bajo sea 0.
  const BASE_Y_OFFSET = 0.11;

  return (
    <group 
      position={[position.x, position.y + yOffset, position.z]} 
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Mangos (cilíndricos) */}
      <Cylinder args={[0.04, 0.04, 0.22, 8]} position={[-0.1, 0 + BASE_Y_OFFSET, 0]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Cylinder>
      <Cylinder args={[0.04, 0.04, 0.22, 8]} position={[0.1, 0 + BASE_Y_OFFSET, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Cylinder>
      
      {/* Cabezal central */}
      <Box args={[0.14, 0.1, 0.1]} position={[0, 0.06 + BASE_Y_OFFSET, 0]}>
        <meshStandardMaterial color="#ccaa88" metalness={0.6} roughness={0.2} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Box>
      
      {/* Pico superior curvo */}
      <Box args={[0.08, 0.04, 0.12]} position={[0, 0.14 + BASE_Y_OFFSET, 0.05]} rotation={[0.4, 0, 0]}>
        <meshStandardMaterial color="#bb9966" metalness={0.7} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Box>
      <Box args={[0.05, 0.03, 0.08]} position={[0, 0.18 + BASE_Y_OFFSET, 0.1]} rotation={[0.6, 0, 0]}>
        <meshStandardMaterial color="#aa8855" metalness={0.8} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Box>
      
      {/* Pico inferior */}
      <Box args={[0.08, 0.04, 0.12]} position={[0, 0.10 + BASE_Y_OFFSET, 0.04]} rotation={[-0.2, 0, 0]}>
        <meshStandardMaterial color="#bb9966" metalness={0.7} />
        <Edges color="#ffffff" threshold={15} lineWidth={0.5} />
      </Box>
      
      {/* Eje central */}
      <Cylinder args={[0.03, 0.03, 0.06, 6]} position={[0, 0.08 + BASE_Y_OFFSET, 0.02]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
      </Cylinder>
    </group>
  );
};

export default AlicatesPicoDeLoro3D;