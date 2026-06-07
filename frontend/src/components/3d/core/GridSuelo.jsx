// ============================================================
// ARCHIVO: src/components/3d/core/GridSuelo.jsx
// DESCRIPCIÓN: Componente 3D para el grid del suelo
// VERSIÓN: 2.0 - Optimizado
// ============================================================

import React from 'react'
import { Grid } from '@react-three/drei'
import { GRID, GRID_X_MIN, GRID_X_MAX, GRID_Z_MIN, GRID_Z_MAX, TILE_SIZE, GROUND_Y, COLORS } from './config'

export const GridSuelo = () => {
  return (
    <Grid
      position={[0, GROUND_Y, 0]}
      args={[GRID.width * TILE_SIZE, GRID.depth * TILE_SIZE]}
      cellSize={TILE_SIZE}
      cellThickness={0.02}
      cellColor={COLORS.gridLine}
      sectionSize={TILE_SIZE * 2}
      sectionThickness={0.04}
      sectionColor={COLORS.gridLine}
      fadeDistance={30}
      fadeStrength={1}
      followCamera={false}
    />
  )
}

export default GridSuelo