// ============================================================
// ARCHIVO: src/components/3d/entities/Webcam3D.jsx
// DESCRIPCIÓN: Componente 3D para cámara web con reconocimiento facial
// VERSIÓN: 1.0
// FECHA: 2026-06-06
// ============================================================

import React, { useState, useRef, useEffect } from 'react'
import { Box, Sphere, Text, Html, Plane } from '@react-three/drei'
import { COLORS } from '../core/config'

export const Webcam3D = ({
  position,
  isActive = false,
  isSelected = false,
  onDetectUser,
  currentUser = null,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false)
  const [detected, setDetected] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const fillColor = isSelected ? COLORS.selected : (isActive ? '#00ff88' : '#888888')
  const edgeColor = hovered ? COLORS.hover : fillColor
  const lenteColor = isActive ? '#44aaff' : '#335577'

  // Iniciar cámara al activar
  useEffect(() => {
    if (!isActive) return

    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setStreaming(true)
        }
      } catch (err) {
        console.error('Error accediendo a la cámara:', err)
      }
    }

    iniciarCamara()

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }, [isActive])

  // Simular detección facial periódica
  useEffect(() => {
    if (!isActive) return

    const intervalo = setInterval(() => {
      // Simulación de detección de usuario
      if (currentUser) {
        setDetected(true)
        onDetectUser?.(currentUser)
      }
    }, 5000)

    return () => clearInterval(intervalo)
  }, [isActive, currentUser, onDetectUser])

  return (
    <group
      position={[position.x, 0.3, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(e) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base de la cámara */}
      <Box args={[0.15, 0.05, 0.12]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Cuerpo de la cámara */}
      <Box args={[0.12, 0.08, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color={fillColor} metalness={0.5} roughness={0.2} />
        <Edges color={edgeColor} threshold={15} lineWidth={0.5} />
      </Box>
      
      {/* Lente de la cámara */}
      <Sphere args={[0.035, 32, 32]} position={[0, 0, 0.06]}>
        <meshStandardMaterial color={lenteColor} metalness={0.9} roughness={0.1} emissive={isActive ? '#2266aa' : '#000'} emissiveIntensity={isActive ? 0.5 : 0} />
      </Sphere>
      
      {/* Anillo de la lente */}
      <Sphere args={[0.04, 32, 32]} position={[0, 0, 0.06]}>
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} wireframe />
      </Sphere>
      
      {/* LED de actividad */}
      <Sphere args={[0.008, 16, 16]} position={[0.05, 0.04, 0.07]}>
        <meshStandardMaterial color={isActive ? '#ff3333' : '#333333'} emissive={isActive ? '#ff0000' : '#000'} emissiveIntensity={isActive ? 0.8 : 0} />
      </Sphere>
      
      {/* Pantalla de streaming (si está activa) */}
      {isActive && streaming && (
        <Html position={[0, 0.15, 0]} center>
          <div style={videoStyle}>
            <video ref={videoRef} autoPlay playsInline muted style={videoInnerStyle} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div style={detectBadgeStyle}>
              {detected ? '✅ Usuario detectado' : '🔄 Detectando...'}
            </div>
          </div>
        </Html>
      )}
      
      {/* Tooltip */}
      {(hovered || isSelected) && (
        <Html position={[0, 0.2, 0]} center>
          <div style={tooltipStyle(edgeColor)}>
            🎥 Cámara de seguridad
            {isActive && <span style={{ color: '#88ff88' }}> · Activa</span>}
            {detected && <span style={{ color: '#88ff88' }}> · Usuario presente</span>}
          </div>
        </Html>
      )}
    </group>
  )
}

const videoStyle = {
  background: '#111',
  borderRadius: '8px',
  padding: '4px',
  border: '1px solid #00d4ff',
  boxShadow: '0 0 10px rgba(0,212,255,0.3)',
}

const videoInnerStyle = {
  width: '160px',
  height: '120px',
  borderRadius: '4px',
  background: '#000',
}

const detectBadgeStyle = {
  position: 'absolute',
  bottom: '8px',
  left: '8px',
  background: 'rgba(0,0,0,0.7)',
  color: '#00ff88',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '10px',
}

const tooltipStyle = (color) => ({
  background: 'rgba(0,0,0,0.85)',
  color: color,
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '9px',
  border: `1px solid ${color}`,
  whiteSpace: 'nowrap',
})

export default Webcam3D