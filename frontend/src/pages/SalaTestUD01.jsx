// frontend/src/pages/SalaTestUD01.jsx
// ============================================================
// ARCHIVO: src/pages/SalaTestUD01.jsx
// DESCRIPCIÓN: Redirección a la vista de sala de pruebas UD01
// RUTAS: /salatest-ud01 → Redirige a /dashboard?room=SALATEST&activity=UD01&view=compact
// ============================================================

import React from 'react'
import { Navigate } from 'react-router-dom'

const SalaTestUD01 = () => {
  return <Navigate to="/dashboard?room=SALATEST&activity=UD01&view=compact" replace />
}

export default SalaTestUD01
