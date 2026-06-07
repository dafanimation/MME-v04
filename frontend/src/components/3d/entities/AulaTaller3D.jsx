// ============================================================
// ARCHIVO: src/components/3d/entities/AulaTaller3D.jsx
// DESCRIPCIÓN: Configuración del aula taller con 9 mesas
// VERSIÓN: 1.0
// FECHA: 2026-06-06
// ============================================================

import React from 'react'
import { Mesa3D } from './Mesa3D'

// Configuración de las 9 mesas del aula taller
export const MESAS_AULA = [
  { id: 1, x: -3.5, z: -2.5, label: 'Mesa 1 - Grupo A', color: '#ff8a1f' },
  { id: 2, x: 0, z: -2.5, label: 'Mesa 2 - Grupo B', color: '#ff8a1f' },
  { id: 3, x: 3.5, z: -2.5, label: 'Mesa 3 - Grupo C', color: '#ff8a1f' },
  { id: 4, x: -3.5, z: 0, label: 'Mesa 4 - Grupo D', color: '#ff8a1f' },
  { id: 5, x: 0, z: 0, label: 'Mesa 5 - Grupo E (Central)', color: '#ffaa44' },
  { id: 6, x: 3.5, z: 0, label: 'Mesa 6 - Grupo F', color: '#ff8a1f' },
  { id: 7, x: -3.5, z: 2.5, label: 'Mesa 7 - Grupo G', color: '#ff8a1f' },
  { id: 8, x: 0, z: 2.5, label: 'Mesa 8 - Grupo H', color: '#ff8a1f' },
  { id: 9, x: 3.5, z: 2.5, label: 'Mesa 9 - Grupo I', color: '#ff8a1f' },
]

// Posiciones de usuarios alrededor de cada mesa
export const POSICIONES_USUARIO_POR_MESA = {
  1: { x: -3.5, z: -2.5 },
  2: { x: 0, z: -2.5 },
  3: { x: 3.5, z: -2.5 },
  4: { x: -3.5, z: 0 },
  5: { x: 0, z: 0 },
  6: { x: 3.5, z: 0 },
  7: { x: -3.5, z: 2.5 },
  8: { x: 0, z: 2.5 },
  9: { x: 3.5, z: 2.5 },
}

// Componente que renderiza todas las mesas del aula
export const AulaTaller3D = ({
  mesas = MESAS_AULA,
  recursosPorMesa = {},
  usuariosPorMesa = {},
  selectedMesa = null,
  onMesaClick,
}) => {
  return (
    <group>
      {mesas.map((mesa) => (
        <Mesa3D
          key={`mesa-${mesa.id}`}
          mesa={mesa}
          position={{ x: mesa.x, z: mesa.z }}
          isSelected={selectedMesa === mesa.id}
          onClick={(e) => onMesaClick?.(mesa.id, e)}
          pcsCount={recursosPorMesa[mesa.id]?.pcs?.length || 0}
          usuariosCount={usuariosPorMesa[mesa.id]?.length || 0}
        />
      ))}
    </group>
  )
}

export default AulaTaller3D