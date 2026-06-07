// ============================================================
// ARCHIVO: Pc3D.jsx
// DESCRIPCIÓN: Componente 3D para PCs sobre la mesa
// VERSIÓN: 2.0 - Optimizado
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Text, Line, Html } from '@react-three/drei'
import { PC, PC_Y, MESA, MESA_Y, ESTADOS, getColorByStatus, COLORS } from '../core/config'

export const Pc3D = ({ 
  pc, position, isSelected, onClick, onUpdate 
}) => {
  const [hovered, setHovered] = useState(false)
  
  const dashLinePoints = [
    [position.x, PC_Y - 0.06, position.z],
    [position.x, MESA_Y + MESA.height / 2 + 0.02, position.z],
  ]
  
  const statusColor = getColorByStatus(PC, pc.status)
  
  return (
    <group
      position={[position.x, PC_Y, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(pc, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Line points={dashLinePoints} color={statusColor} lineWidth={1} dashed dashSize={0.04} gapSize={0.02} />
      
      <Box args={[PC.width, PC.height, PC.depth]}>
        <meshStandardMaterial
          color={statusColor}
          transparent
          opacity={PC.opacity}
          emissive={isSelected ? statusColor : '#000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
        <Edges color={hovered ? COLORS.hover : PC.colorEdge} threshold={15} />
      </Box>
      
      <Text position={[0, -0.1, 0]} fontSize={0.06} color="white" anchorX="center">
        {pc.code?.slice(0, 5) || 'PC'}
      </Text>
      
      {hovered && (
        <Html position={[0, 0.25, 0]} center>
          <div style={tooltipStyle(statusColor)}>
            <strong>{pc.code}</strong> • Estado: {pc.status || ESTADOS.AVAILABLE}
            {pc.assignedUser?.email && (
              <div style={{ fontSize: '8px', color: '#aaa' }}>Asignado a: {pc.assignedUser.email}</div>
            )}
          </div>
        </Html>
      )}
      
      {isSelected && (
        <group position={[0, 0.3, 0]}>
          <Html center>
            <div style={panelStyle(statusColor)}>
              🖥️ {pc.code}
              <select 
                value={pc.status}
                onChange={(e) => onUpdate?.({ status: e.target.value })}
                style={selectStyle}
              >
                <option value={ESTADOS.AVAILABLE}>Disponible</option>
                <option value={ESTADOS.ASSIGNED}>Asignado</option>
                <option value={ESTADOS.OCCUPIED}>Ocupado</option>
                <option value={ESTADOS.MAINTENANCE}>Mantenimiento</option>
              </select>
            </div>
          </Html>
        </group>
      )}
    </group>
  )
}

const tooltipStyle = (color) => ({
  background: 'rgba(0,0,0,0.85)', color, padding: '4px 10px',
  borderRadius: '6px', fontSize: '9px', border: `1px solid ${color}`, whiteSpace: 'nowrap',
})

const panelStyle = (color) => ({
  background: 'rgba(0,0,0,0.9)', padding: '5px 10px', borderRadius: '8px',
  fontSize: '9px', border: `1px solid ${color}`, whiteSpace: 'nowrap',
})

const selectStyle = {
  marginLeft: '8px', background: '#1a1a2e', color: 'white',
  border: '1px solid #00d4ff', borderRadius: '4px', fontSize: '9px',
}

export default Pc3D
