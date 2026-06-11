// frontend/src/components/auth/PrivateRoute.jsx
// ============================================================
// ARCHIVO: src/components/auth/PrivateRoute.jsx
// DESCRIPCIÓN: Componente de ruta privada para proteger rutas de autenticación
// RUTAS: N/A (se usa como wrapper en rutas protegidas)
// ============================================================

import React from 'react'
import { Navigate } from 'react-router-dom'
import { getUser, isAuthenticated, isAdmin } from '../../services/auth'

const PrivateRoute = ({ children, requiredRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (!requiredRole) {
    return children
  }

  const user = getUser()
  const role = String(user?.role || user?.rol || '').toLowerCase()
  const canAccess = requiredRole === 'admin'
    ? isAdmin()
    : role === requiredRole

  return canAccess ? children : <Navigate to="/dashboard" replace />
}

export default PrivateRoute
