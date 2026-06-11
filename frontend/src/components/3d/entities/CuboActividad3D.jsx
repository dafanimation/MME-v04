// ============================================================
// ARCHIVO: CuboActividad3D.jsx
// DESCRIPCIÓN: Componente 3D para actividades UD (cubos)
// VERSIÓN: 2.0 - Optimizado
// ============================================================
// src/components/3d/entities/CuboActividad3D.jsx
// src/components/3d/entities/CuboActividad3D.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Edges, Text, Html } from '@react-three/drei';
import { COLORS } from '../core/config';

// Mapa de colores por UD (tonos pastel)
const UD_COLORS = {
  UD01: '#ff8c42', // naranja
  UD02: '#f9c74f', // amarillo
  UD03: '#90be6d', // verde claro
  UD04: '#577590', // azul grisáceo
  UD05: '#9c89b8', // morado
  UD06: '#ef476f', // rosa
  default: '#70a9a1',
};

export const CuboActividad3D = ({
  actividad,
  position,
  isSelected = false,
  onClick,
  estado = 'pendiente', // 'pendiente', 'completada', 'verificada'
}) => {
  const [hovered, setHovered] = useState(false);
  const [emissiveIntensity, setEmissiveIntensity] = useState(0);
  const requestRef = useRef();

  // Determinar color base según UD y estado
  let baseColor = UD_COLORS[actividad.udCode] || UD_COLORS.default;
  if (estado === 'completada') baseColor = '#4caf50'; // verde
  if (estado === 'verificada') baseColor = '#2196f3'; // azul

  const fillColor = isSelected ? COLORS.selected : (hovered ? '#ffffff' : baseColor);
  const edgeColor = hovered ? COLORS.hover : COLORS.gridLine;

  // Animación de halo intermitente para actividades verificadas
  useEffect(() => {
    if (estado === 'verificada') {
      let direction = 1;
      let value = 0.2;
      const animate = () => {
        value += direction * 0.02;
        if (value >= 0.8) direction = -1;
        if (value <= 0.2) direction = 1;
        setEmissiveIntensity(value);
        requestRef.current = requestAnimationFrame(animate);
      };
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    } else {
      setEmissiveIntensity(0);
    }
  }, [estado]);

  // Tamaño del cubo (0.6 unidades ≈ 24cm)
  const size = 0.6;
  const yPosition = size / 2; // centro del cubo

  return (
    <group
      position={[position.x, yPosition, position.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(actividad, e);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Cubo principal */}
      <Box args={[size, size, size]}>
        <meshStandardMaterial
          color={fillColor}
          emissive={estado === 'verificada' ? '#ffffff' : '#000000'}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.85}
        />
        <Edges color={edgeColor} threshold={15} lineWidth={1.5} />
      </Box>

      {/* Texto identificativo en la cara frontal (Z positiva) */}
      <Text
        position={[0, 0, size / 2 + 0.01]}
        fontSize={0.12}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {actividad.codigoCorto || actividad.udCode}
      </Text>

      {/* Texto en la cara superior (opcional) */}
      <Text
        position={[0, size / 2 + 0.05, 0]}
        fontSize={0.08}
        color="#fff"
        anchorX="center"
        anchorY="middle"
      >
        {actividad.title?.substring(0, 12) || ''}
      </Text>

      {/* Tooltip al hover */}
      {(hovered || isSelected) && (
        <Html position={[0, size / 2 + 0.2, 0]} center>
          <div style={tooltipStyle}>
            📘 <strong>{actividad.udCode}</strong> – {actividad.title}
            <br />
            Estado: {estado === 'verificada' ? '✅ Verificada' : estado === 'completada' ? '✔️ Completada' : '⏳ Pendiente'}
            <br />
            Progreso: {actividad.progreso || 0}%
          </div>
        </Html>
      )}
    </group>
  );
};

const tooltipStyle = {
  background: 'rgba(0,0,0,0.85)',
  color: '#ffaa44',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '10px',
  border: '1px solid #ffaa44',
  textAlign: 'center',
  whiteSpace: 'nowrap',
};

export default CuboActividad3D;