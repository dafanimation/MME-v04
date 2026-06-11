// ============================================================
// ARCHIVO: src/components/3d/core/GridSuelo.jsx
// DESCRIPCIÓN: Componente 3D para el grid del suelo
// VERSIÓN: 3.0 - Corregido
// ============================================================
// Este componente utiliza el Grid de @react-three/drei para crear un suelo cuadriculado
// que ayuda a la orientación espacial en la sala.
// ESCALA: 1 celda = 0.4 unidades = 40cm (referencia AulaTaller3D)
// ============================================================
// ============================================================
// GridSuelo.jsx - Versión con líneas muy visibles
// ============================================================

import React from 'react';
import { Grid } from '@react-three/drei';
import { ESCALA } from './escala.config';

export const GridSuelo = ({ 
  width = 4,
  depth = 4,
  position = [0, 0, 0]
}) => {
  const cellSize = ESCALA.CELL_SIZE;
  const gridWidth = width * cellSize;
  const gridDepth = depth * cellSize;
  
  return (
    <Grid
      position={position}
      args={[gridWidth, gridDepth]}
      cellSize={cellSize}
      cellThickness={1}        // ← Más grueso (antes 0.04)
      cellColor="#ffffff"
      sectionSize={5}
      sectionThickness={1}      // ← Más grueso (antes 0.08)
      sectionColor="#ffffff"
      fadeDistance={5}
      fadeStrength={1.5}
      followCamera={false}
      infiniteGrid={true}
    />
  );
};

export default GridSuelo;