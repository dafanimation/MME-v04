// ============================================================
// ARCHIVO: src/components/ui/UserTypeBadge.jsx
// DESCRIPCIÓN: Badge visual para mostrar el tipo de usuario
// FUNCIÓN: Muestra icono + label según rol/grupo (admin, BIP, SOX, MME)
// PROPS:
//   - user: Objeto con role y/o group
//   - size: 'small' (default) o 'large'
// ============================================================

import React from 'react'

/**
 * Configuración visual para cada tipo de usuario
 * icon: emoji representativo
 * label: texto descriptivo
 * color: color del borde y texto
 * bg: color de fondo con opacidad
 */
const BADGE_TYPES = {
  admin:    { icon: '👑', label: 'Admin Master',  color: '#00d4ff', bg: 'rgba(0,212,255,0.15)' },
  bip:      { icon: '🤖', label: 'Usuari BIP',    color: '#ff8800', bg: 'rgba(255,136,0,0.15)' },
  sox:      { icon: '📡', label: 'Usuari SOX',    color: '#ff4444', bg: 'rgba(255,68,68,0.15)' },
  user:     { icon: '🔧', label: 'Usuari MME',    color: '#00ff88', bg: 'rgba(0,255,136,0.15)' },
  default:  { icon: '👤', label: 'Convidat',      color: '#888888', bg: 'rgba(136,136,136,0.15)' },
}

/**
 * Determina el tipo de usuario según role y group
 * @param {Object} user - Datos del usuario
 * @returns {string} Tipo: 'admin', 'bip', 'sox', 'user', 'default'
 */
const resolveType = (user) => {
  const role  = String(user?.role || user?.rol || '').toLowerCase()
  const group = String(user?.group || user?.grup || '').toUpperCase()

  // Prioridad: admin > BIP > SOX > user > default
  if (role === 'admin' || role === 'admin_master' || role === 'admin master') return 'admin'
  if (role === 'bip' || group === 'BIP') return 'bip'
  if (group.includes('SOX')) return 'sox'
  if (role === 'user') return 'user'
  return 'default'
}

/**
 * Componente Badge para mostrar tipo de usuario
 * @param {Object} user - Usuario a evaluar
 * @param {string} size - 'small' (12px) o 'large' (14px)
 */
export const UserTypeBadge = ({ user, size = 'small' }) => {
  const type = resolveType(user)
  const info = BADGE_TYPES[type]
  const fontSize = size === 'small' ? '10px' : '12px'
  const padding  = size === 'small' ? '2px 6px' : '4px 10px'

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding,
      borderRadius: '999px',        // Forma de píldora
      background: info.bg,
      color: info.color,
      border: `1px solid ${info.color}33`, // 20% opacidad
      fontSize,
      fontWeight: 600,
    }}>
      <span>{info.icon}</span>
      <span>{info.label}</span>
    </span>
  )
}