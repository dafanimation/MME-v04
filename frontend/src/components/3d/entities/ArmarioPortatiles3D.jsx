// ============================================================
// ARCHIVO: src/components/3d/entities/ArmarioPortatiles3D.jsx
// DESCRIPCIÓN: Armario pequeño para 10 portátiles con carga
// VERSIÓN: 1.0
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Text, Html, Plane } from '@react-three/drei'
import { COLORS } from '../core/config'

export const ArmarioPortatiles3D = ({
  armario,
  position,
  isSelected = false,
  onClick,
  portatiles = [],  // Array de portátiles { id, estado, bateria, asignadoA }
}) => {
  const [hovered, setHovered] = useState(false)
  const [puertasAbiertas, setPuertasAbiertas] = useState(false)

  const fillColor = isSelected ? COLORS.selected : '#5a7a9f'
  const edgeColor = hovered ? COLORS.hover : '#88aacc'

  // Dimensiones
  const ancho = 0.8
  const alto = 1.2
  const profundidad = 0.6

  // Posiciones de los 10 portátiles (2 columnas x 5 filas)
  const posicionesPortatiles = []
  for (let fila = 0; fila < 5; fila++) {
    for (let col = 0; col < 2; col++) {
      posicionesPortatiles.push({
        x: (col === 0 ? -0.25 : 0.25),
        y: -0.3 + (fila * 0.2),
        z: 0.25,
        slot: fila * 2 + col + 1
      })
    }
  }

  return (
    <group
      position={[position.x, alto / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(armario, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Cuerpo principal */}
      <Box args={[ancho, alto, profundidad]}>
        <meshStandardMaterial color={fillColor} transparent opacity={0.7} />
        <Edges color={edgeColor} threshold={15} lineWidth={1.2} />
      </Box>

      {/* Puerta transparente */}
      <Box args={[ancho * 0.9, alto * 0.85, 0.03]} position={[0, 0, profundidad / 2 + 0.02]}>
        <meshStandardMaterial color="#88aacc" transparent opacity={0.4} />
        <Edges color="#aaccff" threshold={15} lineWidth={0.5} />
      </Box>

      {/* LED de carga (arriba) */}
      <Box args={[0.1, 0.05, 0.05]} position={[0, alto / 2 - 0.08, profundidad / 2 + 0.05]}>
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
      </Box>

      {/* Representación de portátiles dentro (visibles si puerta abierta o seleccionado) */}
      {(puertasAbiertas || isSelected) && (
        <group>
          {posicionesPortatiles.map((pos, idx) => {
            const portatil = portatiles[idx]
            const estadoColor = portatil?.estado === 'cargando' ? '#ffaa44' : 
                               (portatil?.estado === 'cargado' ? '#00ff88' : '#888888')
            
            return (
              <group key={idx} position={[pos.x, pos.y, pos.z]}>
                {/* Portátil */}
                <Box args={[0.12, 0.03, 0.18]}>
                  <meshStandardMaterial color={estadoColor} metalness={0.3} />
                  <Edges color="#fff" threshold={15} lineWidth={0.3} />
                </Box>
                {/* LED de estado por slot */}
                <Box args={[0.02, 0.02, 0.02]} position={[0.08, 0.02, 0.1]}>
                  <meshStandardMaterial 
                    color={portatil?.bateria > 80 ? '#00ff88' : (portatil?.bateria > 20 ? '#ffaa44' : '#ff4444')} 
                  />
                </Box>
              </group>
            )
          })}
        </group>
      )}

      {/* Etiqueta */}
      <Text position={[0, alto / 2 + 0.12, 0]} fontSize={0.07} color={edgeColor} anchorX="center">
        {armario.label || `Armario Portátiles`}
      </Text>

      {/* Tooltip */}
      {(hovered || isSelected) && (
        <Html position={[0, alto / 2 + 0.3, 0]} center>
          <div style={tooltipStyle(edgeColor)}>
            🔋 {armario.label || 'Armario Portátiles'}<br />
            Capacidad: 10 portátiles<br />
            {portatiles.filter(p => p?.estado === 'cargado').length} cargados<br />
            {portatiles.filter(p => p?.estado === 'cargando').length} cargando
          </div>
        </Html>
      )}
    </group>
  )
}

const tooltipStyle = (color) => ({
  background: 'rgba(0,0,0,0.85)',
  color: color,
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '9px',
  border: `1px solid ${color}`,
  textAlign: 'center',
})

export default ArmarioPortatiles3D  