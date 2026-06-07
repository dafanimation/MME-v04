// frontend/src/components/auth/PrivateRoute.jsx
// ============================================================
// ARCHIVO: src/components/auth/PrivateRoute.jsx
// DESCRIPCIÓN: Componente de ruta privada para proteger rutas de autenticación
// RUTAS: N/A (se usa como wrapper en rutas protegidas)
// ============================================================

import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const isAuth = !!localStorage.getItem('mme_token')
  return isAuth ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
