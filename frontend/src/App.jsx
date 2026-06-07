// ============================================================
// ARCHIVO: src/App.jsx
// DESCRIPCIÓN: Punto de entrada principal de la aplicación
// RUTAS: Basadas en la estructura actual del proyecto
// VERSIÓN: 2.1
// FECHA: 2026-06-06
// ============================================================
// 
// RUTAS DISPONIBLES:
// /login          → Página de login
// /dashboard      → Dashboard principal con mapa 3D
// /inventario     → Gestión de inventario
// /recurso/:id    → Ficha detallada de recurso
// /mi-actividad   → Actividades del usuario
// /mi-perfil      → Perfil del usuario
// /configuracion  → Configuración (solo admin)
// /usuarios       → Gestión de usuarios (solo admin)
// /armario/:id    → Vista dedicada de armario (solo admin)
// /               → Redirige a /dashboard
//
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ============================================
// IMPORTS DE COMPONENTES
// ============================================

// Autenticación
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';

// Páginas principales
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import MiActividad from './pages/MiActividad';
import MiPerfil from './pages/MiPerfil';
import Configuracion from './pages/Configuracion';
import Usuarios from './pages/Usuarios';

// Componentes UI
import FichaRecurso from './components/ui/FichaRecurso';

// ✅ NUEVA: Vista dedicada de armarios
import ArmarioView from './pages/ArmarioView';

// Estilos globales
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login público */}
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard protegido */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        {/* Inventario protegido */}
        <Route 
          path="/inventario" 
          element={
            <PrivateRoute>
              <Inventario />
            </PrivateRoute>
          } 
        />
        
        {/* Ficha de recurso protegida */}
        <Route 
          path="/recurso/:id" 
          element={
            <PrivateRoute>
              <FichaRecurso />
            </PrivateRoute>
          } 
        />
        
        {/* Mis actividades protegidas */}
        <Route 
          path="/mi-actividad" 
          element={
            <PrivateRoute>
              <MiActividad />
            </PrivateRoute>
          } 
        />
        
        {/* Mi perfil protegido */}
        <Route 
          path="/mi-perfil" 
          element={
            <PrivateRoute>
              <MiPerfil />
            </PrivateRoute>
          } 
        />
        
        {/* Configuración (solo admin) */}
        <Route 
          path="/configuracion" 
          element={
            <PrivateRoute requiredRole="admin">
              <Configuracion />
            </PrivateRoute>
          } 
        />
        
        {/* Gestión de usuarios (solo admin) */}
        <Route 
          path="/usuarios" 
          element={
            <PrivateRoute requiredRole="admin">
              <Usuarios />
            </PrivateRoute>
          } 
        />
        
        {/* ✅ NUEVA: Vista dedicada de armarios (solo admin) */}
        <Route 
          path="/armario/:id" 
          element={
            <PrivateRoute requiredRole="admin">
              <ArmarioView />
            </PrivateRoute>
          } 
        />
        
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;