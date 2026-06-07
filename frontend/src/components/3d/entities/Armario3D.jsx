// ============================================================
// ARCHIVO: src/components/3d/entities/Armario3D.jsx
// DESCRIPCIÓN: Componente 3D para armarios con recursos visibles
// VERSIÓN: 4.0 - Con configuración dinámica y apilamiento
// FECHA: 2026-06-06
// ============================================================

import React, { useState } from 'react'
import { Box, Edges, Text, Html } from '@react-three/drei'
import { ARMARIO, COLORS } from '../core/config'

// ============================================
// COMPONENTE: Recurso3D (caja genérica con apilamiento)
// ============================================
const Recurso3D = ({ 
  recurso, 
  position, 
  index,
  apilado = 0,        // Nivel de apilamiento (0 = base)
  isSelected = false,
  onClick 
}) => {
  const [hovered, setHovered] = useState(false)
  
  const getColor = () => {
    if (isSelected) return COLORS.selected
    if (hovered) return '#ffaa66'
    
    const tipo = recurso.tipo?.toLowerCase() || ''
    if (tipo.includes('pc')) return '#00ff88'
    if (tipo.includes('portatil') || tipo.includes('laptop')) return '#a855f7'
    if (tipo.includes('pantalla') || tipo.includes('monitor')) return '#2d8cff'
    if (tipo.includes('impresora')) return '#9ba3ad'
    if (tipo.includes('herramienta') || tipo.includes('caja')) return '#d4a056'
    return '#88aacc'
  }
  
  const getSize = () => {
    const tipo = recurso.tipo?.toLowerCase() || ''
    if (tipo.includes('portatil') || tipo.includes('laptop')) {
      return { width: 0.14, height: 0.04, depth: 0.2 }
    }
    if (tipo.includes('pantalla')) {
      return { width: 0.16, height: 0.12, depth: 0.05 }
    }
    if (tipo.includes('herramienta') || tipo.includes('caja')) {
      return { width: 0.12, height: 0.06, depth: 0.12 }
    }
    return { width: 0.12, height: 0.08, depth: 0.12 }
  }
  
  const size = getSize()
  const color = getColor()
  
  // Altura de apilamiento (8cm por objeto)
  const alturaApilamiento = 0.08
  const yOffset = apilado * alturaApilamiento
  
  // Distribución por filas y columnas para evitar solapamiento
  const recursosPorFila = 4
  const fila = Math.floor(index / recursosPorFila)
  const columna = index % recursosPorFila
  const offsetXFila = (columna - (recursosPorFila - 1) / 2) * 0.22
  const offsetX = offsetXFila
  const offsetZ = fila * 0.12 - 0.1
  
  return (
    <group
      position={[position.x, ARMARIO.height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(e) }}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
          if (editable) setShowConfig(true)  // ← AQUÍ se activa
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[size.width, size.height, size.depth]}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.4} 
          roughness={0.3}
          emissive={isSelected ? color : '#000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
        <Edges color={hovered ? COLORS.hover : '#ffffff'} threshold={15} lineWidth={0.5} />
      </Box>
      
      {hovered && (
        <Html position={[0, size.height / 2 + 0.08, 0]} center>
          <div style={recursoTooltipStyle}>
            <strong>{recurso.nombre || recurso.code}</strong>
            <span style={{ fontSize: '8px', color: '#aaa' }}> · {recurso.tipo || 'Recurso'}</span>
          </div>
        </Html>
      )}
    </group>
  )
}

// ============================================
// COMPONENTE: Consumible3D (cajita de color)
// ============================================
const Consumible3D = ({ 
  consumible, 
  position, 
  index,
  onClick 
}) => {
  const [hovered, setHovered] = useState(false)
  
  const coloresPastel = [
    '#ff9999', '#99ff99', '#9999ff', '#ffff99',
    '#ff99ff', '#99ffff', '#ffcc99', '#cc99ff',
  ]
  
  const color = coloresPastel[consumible.id % coloresPastel.length]
  const size = { width: 0.08, height: 0.06, depth: 0.08 }
  const offsetX = (index - 4) * 0.15
  const cantidad = consumible.cantidad || 1
  const showMultiple = cantidad > 1
  
  return (
    <group
      position={[position.x + offsetX, position.y, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(consumible, e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[size.width, size.height, size.depth]}>
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : color} 
          metalness={0.2} 
          roughness={0.5}
        />
        <Edges color={hovered ? COLORS.hover : '#ffffff'} threshold={15} lineWidth={0.3} />
      </Box>
      
      <Box args={[size.width + 0.01, 0.01, size.depth + 0.01]} position={[0, size.height / 2 + 0.005, 0]}>
        <meshStandardMaterial color={color} metalness={0.3} />
      </Box>
      
      {showMultiple && (
        <Html position={[0, -size.height / 2 - 0.05, 0]} center>
          <div style={cantidadStyle}>x{cantidad}</div>
        </Html>
      )}
      
      {hovered && (
        <Html position={[0, size.height / 2 + 0.1, 0]} center>
          <div style={recursoTooltipStyle}>
            <strong>{consumible.nombre}</strong>
            <span style={{ fontSize: '8px', color: '#aaa' }}> · {cantidad} uds</span>
          </div>
        </Html>
      )}
    </group>
  )
}

// ============================================
// COMPONENTE PRINCIPAL: Armario3D
// ============================================
export const Armario3D = ({ 
  armario, 
  position, 
  isSelected = false, 
  onClick,
  currentUser = null,
  baldas = [],
  consumibles = [],
  onRecursoClick = null,
  onConsumibleClick = null,
  // NUEVAS PROPS PARA CONFIGURACIÓN
  editable = false,           // Si el usuario puede editar
  onConfigChange = null,     // Callback cuando cambia la configuración
  capacidadPorNivel = [8, 8, 8, 8, 8, 4],  // Capacidad de cada balda
  alturaApilamiento = 0.08,   // Altura entre objetos apilados
}) => {
  const [hovered, setHovered] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [nuevaCapacidad, setNuevaCapacidad] = useState([...capacidadPorNivel])
  const [nuevaAltura, setNuevaAltura] = useState(alturaApilamiento)
  
  const fillColor = isSelected ? COLORS.selected : ARMARIO.colorFill
  const edgeColor = hovered ? COLORS.hover : ARMARIO.colorEdge
  
 // Reemplazar baldaPositions (4 niveles) con 6 niveles
const baldaPositions = [
  { y: ARMARIO.height * 0.45, nivel: 6, nombre: 'Superficie superior (Top)' },  // Nivel 6 - encima
  { y: ARMARIO.height * 0.25, nivel: 5, nombre: 'Balda 4' },                      // Nivel 5
  { y: ARMARIO.height * 0.05, nivel: 4, nombre: 'Balda 3' },                      // Nivel 4
  { y: -ARMARIO.height * 0.15, nivel: 3, nombre: 'Balda 2' },                     // Nivel 3
  { y: -ARMARIO.height * 0.35, nivel: 2, nombre: 'Balda 1' },                     // Nivel 2
  { y: -ARMARIO.height * 0.55, nivel: 1, nombre: 'Fondo inferior' },              // Nivel 1
]

// Actualizar capacidadPorNivel por defecto a 6 niveles
capacidadPorNivel = [8, 8, 8, 8, 8, 4]  // fondo, balda1, balda2, balda3, balda4, top
  
  const recursoZ = 0
  
  return (
    <group
      position={[position.x, ARMARIO.height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(e) }}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
          if (editable) setShowConfig(true)  // ← AQUÍ se activa
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Cuerpo principal */}
      <Box args={[ARMARIO.width, ARMARIO.height, ARMARIO.depth]}>
        <meshStandardMaterial color={fillColor} transparent opacity={ARMARIO.opacity} />
        <Edges color={edgeColor} threshold={15} lineWidth={1.2} />
      </Box>
      
      {/* Puertas transparentes */}
      {ARMARIO.tienePuertas && (
        <>
          <Box args={[ARMARIO.width * 0.5, ARMARIO.height, 0.04]} position={[-ARMARIO.width * 0.25, 0, ARMARIO.depth / 2 + 0.02]}>
            <meshStandardMaterial color="#88aacc" transparent opacity={0.3} />
            <Edges color="#aaccff" threshold={15} lineWidth={0.5} />
          </Box>
          <Box args={[ARMARIO.width * 0.5, ARMARIO.height, 0.04]} position={[ARMARIO.width * 0.25, 0, ARMARIO.depth / 2 + 0.02]}>
            <meshStandardMaterial color="#88aacc" transparent opacity={0.3} />
            <Edges color="#aaccff" threshold={15} lineWidth={0.5} />
          </Box>
        </>
      )}
      
      {/* Baldas y recursos con apilamiento */}
      {baldaPositions.map((balda, idx) => {
        const recursosBalda = baldas[idx]?.recursos || []
        const consumiblesBalda = consumibles.filter(c => c.balda === idx) || []
        
        return (
          <React.Fragment key={`balda-${idx}`}>
            {/* Balda con borde, sin relleno - 98% del ancho de la base */}
            <Box args={[ARMARIO.width * 0.98, 0.02, ARMARIO.depth * 0.98]} position={[0, balda.y, 0]}>
              <meshStandardMaterial 
                color="#88aacc" 
                transparent 
                opacity={0.12} 
                wireframe={true}
              />
              <Edges color="#aaccff" threshold={15} lineWidth={0.8} />
            </Box>
            
            {/* Renderizar recursos de la balda con apilamiento */}
            {recursosBalda.map((recurso, ridx) => {
              // Calcular cuántos objetos del mismo tipo hay antes
              const mismoTipo = recursosBalda.filter(r => r.tipo === recurso.tipo)
              const apilado = mismoTipo.findIndex(r => r.id === recurso.id)
              
              return (
                <Recurso3D
                  key={`recurso-${recurso.id || ridx}`}
                  recurso={recurso}
                  position={{ x: 0, y: balda.y + 0.06, z: recursoZ }}
                  index={ridx}
                  apilado={apilado}
                  onClick={(r, e) => onRecursoClick?.(r, armario.num, idx, e)}
                />
              )
            })}
            
            {consumiblesBalda.map((consumible, cidx) => (
              <Consumible3D
                key={`consumible-${consumible.id || cidx}`}
                consumible={consumible}
                position={{ x: 0, y: balda.y + 0.04, z: recursoZ }}
                index={cidx}
                onClick={(c, e) => onConsumibleClick?.(c, armario.num, idx, e)}
              />
            ))}
          </React.Fragment>
        )
      })}      
      
      {/* Etiqueta */}
      <Text position={[0, ARMARIO.height / 2 + 0.15, 0]} fontSize={0.08} color={edgeColor} anchorX="center">
        {armario.label || `Armario ${armario.num}`}
      </Text>
      
      {/* Tooltip al hover */}
      {(hovered || isSelected) && (
        <Html position={[0, ARMARIO.height / 2 + 0.4, 0]} center>
          <div style={armarioTooltipStyle(edgeColor)}>
            <strong>🗄️ {armario.label || `Armario ${armario.num}`}</strong><br />
            Capacidad: {capacidadPorNivel.reduce((a,b) => a + b, 0)} elementos<br />
            {ARMARIO.niveles} niveles • Puertas: {ARMARIO.tienePuertas ? 'Sí' : 'No'}
            {editable && (
              <div style={{ marginTop: '6px', fontSize: '8px', color: '#ffaa44' }}>
                ⚙️ Click derecho para configurar
              </div>
            )}
          </div>
        </Html>
      )}
      
      {/* Panel de configuración (solo visible para Admin Master y con showConfig true) */}
      {showConfig && editable && (
        <Html position={[0, ARMARIO.height / 2 + 0.9, 0]} center>
          <div style={configPanelStyle}>
            <div style={configHeaderStyle}>
              <strong>⚙️ Configuración del Armario</strong>
              <button onClick={() => setShowConfig(false)} style={configCloseStyle}>✕</button>
            </div>
            
            <div style={configSectionStyle}>
              <label style={configLabelStyle}>📦 Capacidad por nivel:</label>
              {nuevaCapacidad.map((cap, idx) => (
                <div key={idx} style={configRowStyle}>
                  <span style={configNivelStyle}>Nivel {idx + 1}:</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={cap}
                    onChange={(e) => {
                      const nuevos = [...nuevaCapacidad]
                      nuevos[idx] = parseInt(e.target.value) || 1
                      setNuevaCapacidad(nuevos)
                    }}
                    style={configInputStyle}
                  />
                  <span style={configUnidadStyle}>elementos</span>
                </div>
              ))}
            </div>
            
            <div style={configSectionStyle}>
              <label style={configLabelStyle}>📏 Altura de apilamiento:</label>
              <div style={configRowStyle}>
                <input
                  type="number"
                  step="0.01"
                  min="0.02"
                  max="0.2"
                  value={nuevaAltura}
                  onChange={(e) => setNuevaAltura(parseFloat(e.target.value) || 0.08)}
                  style={configInputStyle}
                />
                <span style={configUnidadStyle}>unidades (≈ cm)</span>
              </div>
            </div>
            
            <div style={configButtonContainerStyle}>
              <button 
                onClick={() => {
                  setNuevaCapacidad([...capacidadPorNivel])
                  setNuevaAltura(alturaApilamiento)
                  setShowConfig(false)
                }}
                style={configCancelStyle}
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  onConfigChange?.({ capacidadPorNivel: nuevaCapacidad, alturaApilamiento: nuevaAltura })
                  setShowConfig(false)
                }}
                style={configSaveStyle}
              >
                💾 Guardar configuración
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// ============================================
// ESTILOS
// ============================================
const armarioTooltipStyle = (color) => ({
  background: 'rgba(0,0,0,0.85)',
  color: color,
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '9px',
  border: `1px solid ${color}`,
  textAlign: 'center',
  minWidth: '160px',
})

const recursoTooltipStyle = {
  background: 'rgba(0,0,0,0.85)',
  color: '#fff',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '9px',
  border: '1px solid #00d4ff',
  whiteSpace: 'nowrap',
}

const cantidadStyle = {
  background: 'rgba(0,0,0,0.7)',
  color: '#ffaa44',
  padding: '1px 4px',
  borderRadius: '4px',
  fontSize: '8px',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
}

// Estilos para el panel de configuración
const configPanelStyle = {
  background: '#0a0a1a',
  border: '1px solid #00d4ff',
  borderRadius: '12px',
  padding: '16px',
  minWidth: '280px',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
}

const configHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid rgba(0,212,255,0.3)',
  color: '#00d4ff',
  fontSize: '12px',
}

const configCloseStyle = {
  background: 'none',
  border: 'none',
  color: '#ff6666',
  cursor: 'pointer',
  fontSize: '16px',
}

const configSectionStyle = {
  marginBottom: '16px',
}

const configLabelStyle = {
  display: 'block',
  color: '#7dd4ff',
  fontSize: '11px',
  marginBottom: '8px',
}

const configRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '6px',
}

const configNivelStyle = {
  width: '60px',
  fontSize: '11px',
  color: '#aaa',
}

const configInputStyle = {
  width: '60px',
  padding: '4px 8px',
  background: '#1a1a2e',
  border: '1px solid #00d4ff',
  borderRadius: '4px',
  color: 'white',
  fontSize: '11px',
  textAlign: 'center',
}

const configUnidadStyle = {
  fontSize: '10px',
  color: '#6fa8c8',
}

const configButtonContainerStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '16px',
  paddingTop: '12px',
  borderTop: '1px solid rgba(0,212,255,0.2)',
}

const configCancelStyle = {
  flex: 1,
  padding: '6px',
  background: 'rgba(255,68,68,0.15)',
  border: '1px solid #ff4444',
  borderRadius: '6px',
  color: '#ff8888',
  cursor: 'pointer',
  fontSize: '11px',
}

const configSaveStyle = {
  flex: 1,
  padding: '6px',
  background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
  border: 'none',
  borderRadius: '6px',
  color: '#1a1a2e',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: 'bold',
}

export default Armario3D