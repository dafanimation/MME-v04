// ============================================================
// ARCHIVO: src/components/ui/Tile.jsx
// DESCRIPCIÓN: Baldosa 3D para representar recursos en el suelo
// FUNCIÓN: Cada tile representa un recurso con su geometría y color
// VERSIÓN: 2.0
// ============================================================
import React, { useState } from 'react'
import { Plane, Line, Text, Html, Edges } from '@react-three/drei'

const TILE_SIZE = 0.5

const STATUS_COLORS = {
  available: '#00ff88',
  assigned: '#00d4ff',
  occupied: '#ff4444',
  maintenance: '#ffaa00',
  review: '#aa66ff',
  recycle: '#888888',
}

const getInitials = (value) => {
  const text = String(value || '').trim()
  if (!text) return 'R'

  const cleaned = text
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const tokens = cleaned.split(' ')
  if (tokens.length === 1) {
    const compact = tokens[0].replace(/[^a-z0-9]/gi, '')
    if (!compact) return 'R'
    return compact.slice(0, 3).toUpperCase()
  }

  return tokens
    .filter(Boolean)
    .map((token) => token[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
}

export const Tile = React.memo(function Tile({
  x,
  z,
  resource,
  isHighlighted,
  onClick,
  onHover,
  isResourceSelected = false,
  isResourceLocated = false,
  blinkOn = true,
}) {
  const [hovered, setHovered] = useState(false)

  const normalizedType = String(resource?.type || '').toLowerCase()
  const renderType = normalizedType.includes('pc')
    ? 'pc'
    : (normalizedType.includes('pantalla') || normalizedType.includes('monitor'))
      ? 'pantalla'
      : (normalizedType.includes('impressora') || normalizedType.includes('impresora') || normalizedType.includes('printer'))
        ? 'impressora'
        : (normalizedType.includes('laptop') || normalizedType.includes('portatil') || normalizedType.includes('portàtil'))
          ? 'portatil'
          : 'other'

  const geometryByType = {
    pc: [0.5, 0.5, 0.5],
    pantalla: [0.5, 0.125, 0.5],
    impressora: [0.25, 0.5, 0.5],
    portatil: [0.25, 0.25, 0.0625],
    other: [0.45, 0.25, 0.45],
  }

  const edgeColorByType = {
    pc: STATUS_COLORS[resource?.status] || '#888888',
    pantalla: '#2d8cff',
    impressora: '#9ba3ad',
    portatil: '#a855f7',
    other: '#8aa0bf',
  }

  const dims = geometryByType[renderType]
  const edgeColor = edgeColorByType[renderType]
  const bodyY = dims[1] / 2 + 0.04
  const rotationYDeg = Number(resource?.renderLocation?.rotationY ?? resource?.location?.rotationY ?? 0)
  const rotationY = (Number.isFinite(rotationYDeg) ? rotationYDeg : 0) * Math.PI / 180
  const hoverLabel = getInitials(resource?.name || resource?.code || 'Recurs')
  const locateGlowColor = '#00ff88'
  const activeEdgeColor = isResourceLocated && blinkOn ? locateGlowColor : edgeColor

  const handleHover = (hovering) => {
    setHovered(hovering)
    if (onHover) onHover(hovering ? { x, z, resource } : null)
  }

  return (
    <group
      position={[x, -0.1, z]}
      onClick={resource ? ((event) => {
        event.stopPropagation()
        if (onClick) onClick(x, z)
      }) : undefined}
      onPointerOver={resource ? ((event) => {
        event.stopPropagation()
        handleHover(true)
      }) : undefined}
      onPointerOut={resource ? ((event) => {
        event.stopPropagation()
        handleHover(false)
      }) : undefined}
    >
      <Plane args={[TILE_SIZE, TILE_SIZE]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color={isHighlighted ? '#1a3a5e' : (hovered ? '#1a2a3e' : '#0a0a1a')}
          transparent
          opacity={0.7}
        />
      </Plane>

      <Line points={[[-TILE_SIZE / 2, 0, -TILE_SIZE / 2], [TILE_SIZE / 2, 0, -TILE_SIZE / 2]]} color="#333" lineWidth={0.5} />
      <Line points={[[-TILE_SIZE / 2, 0, TILE_SIZE / 2], [TILE_SIZE / 2, 0, TILE_SIZE / 2]]} color="#333" lineWidth={0.5} />
      <Line points={[[-TILE_SIZE / 2, 0, -TILE_SIZE / 2], [-TILE_SIZE / 2, 0, TILE_SIZE / 2]]} color="#333" lineWidth={0.5} />
      <Line points={[[TILE_SIZE / 2, 0, -TILE_SIZE / 2], [TILE_SIZE / 2, 0, TILE_SIZE / 2]]} color="#333" lineWidth={0.5} />

      {resource && (
        <group position={[0, bodyY, 0]} rotation={[0, rotationY, 0]}>
          <mesh>
            <boxGeometry args={dims} />
            <meshStandardMaterial
              color={renderType === 'pc' ? (STATUS_COLORS[resource.status] || '#888888') : activeEdgeColor}
              emissive={(isResourceSelected || isResourceLocated) ? activeEdgeColor : '#000000'}
              emissiveIntensity={isResourceLocated ? (blinkOn ? 0.85 : 0.08) : (isResourceSelected ? 0.35 : 0)}
              transparent
              opacity={renderType === 'pc' ? 0.35 : 0}
            />
            <Edges color={activeEdgeColor} threshold={15} />
          </mesh>
          <Text position={[0, -0.5, 0]} fontSize={0.08} color="white" anchorX="center">
            {resource.code}
          </Text>
        </group>
      )}

      {hovered && resource && (
        <Html position={[0, 0.25, 0]} center>
          <div
            style={{
              background: 'rgba(10, 14, 24, 0.96)',
              color: isResourceLocated ? '#98ffbf' : '#d8f5ff',
              padding: '3px 7px',
              borderRadius: '999px',
              fontSize: '10px',
              border: `1px solid ${isResourceLocated ? locateGlowColor : '#00d4ff'}`,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
            }}
          >
            {hoverLabel}
          </div>
        </Html>
      )}
    </group>
  )
})
