// Este componente representa un módulo de RAM en 3D, con un diseño personalizado y un tooltip que muestra su capacidad y frecuencia. 
// El SVG se carga como textura para el plano que representa la RAM, y se maneja el estado de hover para 
// cambiar el color del marco decorativo. Si hay un error al cargar la textura, se muestra un emoji de cerebro como fallback.
// El componente acepta props para la posición, rotación, función de clic, estado de selección, y detalles de la RAM como capacidad, frecuencia y marca.
// Puedes personalizar el SVG cambiando el valor de fill en el path, o incluso reemplazándolo por otro diseño.
// Asegúrate de tener las dependencias necesarias instaladas, como react-three/drei y three, para que este componente funcione correctamente.
// MME: 2024-06-01
// REVISIÓN: 2024-06-01 - Creación del componente Ram3D con SVG personalizado y tooltip informativo. Manejo de estados de hover y selección. Implementación de fallback para errores de textura.
// src/components/3d/entities/Ram3D.jsx
import React, { useState, useEffect } from 'react';
import { Box, Html, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../core/config';

// SVG con color verde personalizado (puedes cambiar el valor de fill)
const ramSvgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 257.309 257.309"><path fill="#00ff66" 
d="M0,107.154h10.761c4.419,0,8,3.582,8,8s-3.581,8-8,8H0v16.502h10.761c4.419,0,8,3.582,8,8c0,4.418-3.581,8-8,8H0v11.998 h37.463v-3.725c0-2.225,1.805-4.025,4.024-4.025c2.221,0,4.025,1.801,4.025,4.025v3.725h37.283v-3.725 c0-2.225,1.805-4.025,4.025-4.025c2.22,0,4.024,1.801,4.024,4.025v3.725h34.393v-8h6.832v8h34.393v-3.725 c0-2.225,1.805-4.025,4.024-4.025c2.221,0,4.025,1.801,4.025,4.025v3.725h37.283v-3.725c0-2.225,1.805-4.025,4.025-4.025 c2.22,0,4.024,1.801,4.024,4.025v3.725h37.463v-11.998h-10.761c-4.419,0-8-3.582-8-8c0-4.418,3.581-8,8-8h10.761v-16.502h-10.761 c-4.419,0-8-3.582-8-8s3.581-8,8-8h10.761v-17.5H0V107.154z M203.987,104.654h17.334v40.667h-17.334V104.654z M173.987,104.654 h17.334v40.667h-17.334V104.654z M143.987,104.654h17.334v40.667h-17.334V104.654z M95.987,104.654h17.334v40.667H95.987V104.654z  M65.987,104.654h17.334v40.667H65.987V104.654z M35.987,104.654h17.334v40.667H35.987V104.654z"/></svg>`;


export const Ram3D = ({
  position = { x: 0, y: 0, z: 0 },
  rotation = [0, 0, 0],
  onClick,
  isSelected = false,
  yOffset = 0,
  capacidadGB = 8,
  frecuenciaMHz = 3200,
  marca = 'DDR4',
}) => {
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);
  const [textureError, setTextureError] = useState(false);
  const BASE_Y_OFFSET = 0.1;

  const color = isSelected ? COLORS.selected : (hovered ? '#dd8833' : '#aa6633');

  useEffect(() => {
    const svgBlob = new Blob([ramSvgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 256, 256);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      setTexture(tex);
      URL.revokeObjectURL(url);
    };
    img.onerror = (err) => {
      console.error('Error cargando SVG:', err);
      setTextureError(true);
      URL.revokeObjectURL(url);
    };
    img.src = url;
    return () => {
      if (texture) texture.dispose();
    };
  }, []);

  return (
    <group
      position={[position.x, position.y + yOffset + BASE_Y_OFFSET, position.z]}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >

      {/* Icono fijo (sin billboard) */}
      <group position={[0, 0.08, 0]}>
        {!textureError && texture ? (
          <Plane args={[0.8, 0.8]} position={[0, 0, 0]}>
            <meshStandardMaterial map={texture} transparent side={2} />
          </Plane>
        ) : (
          <Html position={[0, 0, 0]} center>
            <div style={{ fontSize: '50px', filter: 'drop-shadow(0 0 5px #ffaa44)' }}>🧠</div>
          </Html>
        )}
        {/* Marco decorativo */}
        <Box args={[0.58, 0.13, 0.025]} position={[0, 0.011, -0.001]}>
          <meshStandardMaterial color={color} metalness={0.5} transparent opacity={0.8} />
        </Box>
        <Html position={[0, -0.45, 0]} center>
          <div style={{ fontSize: '10px', color: '#ccc', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
            {capacidadGB}GB
          </div>
        </Html>
      </group>

      {/* Tooltip */}
      {(hovered || isSelected) && (
        <Html position={[0, 0.45, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.85)',
            color: '#ffaa44',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '10px',
            border: '1px solid #ffaa44',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}>
            🧠 {marca}<br/>{capacidadGB} GB · {frecuenciaMHz} MHz
          </div>
        </Html>
      )}
    </group>
  );
};

export default Ram3D;