// ============================================================
// ARCHIVO: src/components/menus/MenuAdmin.jsx
// DESCRIPCIÓN: Menú principal de navegación con dropdowns
// RUTAS CORREGIDAS: ../../services/auth, ../../hooks/useSessionTimeout
// ============================================================

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// ✅ CORREGIDO: Subir 2 niveles (../../) para llegar a src/
import { getUser, isAdmin, logout } from '../../services/auth'
import { useSessionTimeout } from '../../hooks/useSessionTimeout'

// ✅ CORREGIDO: Ruta a CSS (está en src/styles/)
import '../../styles/MenuAdmin.css'

const Dropdown = ({ label, icon, items }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const currentRoute = `${location.pathname}${location.search}`

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div className="menu-dropdown" ref={ref}>
      <button className={`menu-dropdown-btn ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        {icon} {label} <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="menu-dropdown-list">
          {items.map((item) => (
            <button
              key={`${label}-${item.path}`}
              className={`menu-dropdown-item ${currentRoute === item.path ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path)
                setOpen(false)
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const MenuAdmin = () => {
  const navigate = useNavigate()
  const user = getUser()
  const userIsAdmin = isAdmin()
  const userGroup = String(user?.group || user?.grup || '').toUpperCase()
  const userRole = String(user?.role || user?.rol || '').toLowerCase()
  const userIsBiP = userGroup === 'BIP' || userRole === 'bip'
  const timeLeft = useSessionTimeout(userIsAdmin)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // ============================================
  // MENÚS BASE (todos los usuarios)
  // ============================================
  const baseMenus = useMemo(() => ([
    {
      label: 'Activitats', icon: '🗂️',
      items: [
        { path: '/actividades', icon: '📚', label: 'Actividades 3D' },
        { path: '/dashboard?section=activities&activity=UD01&year=2026', icon: '📘', label: 'UD01 · 2026' },
        { path: '/dashboard?section=activities&activity=UD02&year=2026', icon: '📙', label: 'UD02 · 2026' },
        { path: '/dashboard?section=activities&activity=UD03&year=2026', icon: '📒', label: 'UD03 · 2026' },
        { path: '/dashboard?section=activities&activity=UD04&year=2026', icon: '📔', label: 'UD04 · 2026' },
        { path: '/dashboard?section=activities&activity=UD05&year=2027', icon: '📗', label: 'UD05 · 2027' },
        { path: '/dashboard?section=activities&activity=UD06&year=2027', icon: '📕', label: 'UD06 · 2027' },
      ],
    },
    {
      label: 'Proyectos', icon: '📐',
      items: [
        { path: '/dashboard?section=projects&name=human-machine', icon: '🧠', label: 'Human Machine' },
        { path: '/dashboard?section=projects&name=robotica-aula', icon: '🤖', label: 'Robotica Aula' },
        { path: '/dashboard?section=projects&action=create', icon: '➕', label: 'Nuevo proyecto' },
        { path: '/dashboard?section=projects&action=edit', icon: '✏️', label: 'Editar proyecto' },
      ],
    },
    {
      label: 'Visualizacion', icon: '🖥️',
      items: [
        { path: '/admin-actividades', icon: '✏️', label: 'Gestión Actividades' },
        { path: '/dashboard?room=AULA&view=joint', icon: '🔀', label: 'Vista conjunta AULA' },
        { path: '/dashboard?room=SALAPRU&view=joint', icon: '🧪', label: 'Vista conjunta SALAPRU' },
        { path: '/dashboard?room=SALATEST&activity=UD01&view=joint', icon: '🧫', label: 'Sala Test UD01' },
        { path: '/dashboard?room=AULA&compact=1', icon: '🧱', label: 'Maximizar espacio' },
        ...(userIsAdmin ? [{ path: '/caja-herramientas', icon: '🔧', label: 'Sala gestión herramientas' }] : []),
      ],
    },
    {
      label: 'Recursos', icon: '📦',
      items: [
        { path: '/dashboard?room=AULA', icon: '🏫', label: 'Aula Taller' },
        { path: '/dashboard?room=SALAPRU', icon: '🧪', label: 'SALAPRU' },
        { path: '/inventario', icon: '📋', label: 'Inventario' },
      ],
    },
    {
      label: 'Usuario', icon: '👤',
      items: [
        { path: '/mi-actividad?state=pending', icon: '📌', label: 'Mis actividades (pendientes)' },
        { path: '/mi-actividad?state=completed', icon: '✅', label: 'Mis actividades (completadas)' },
        { path: '/mi-perfil', icon: '🪪', label: 'Mi perfil' },
        { path: '/mi-perfil?tab=historial', icon: '📜', label: 'Mi historial' },
        { path: '/configuracion?tab=help', icon: '❓', label: 'Ayuda' },
      ],
    },
  ]), [userIsAdmin])

  // ============================================
  // MENÚS EXTRA PARA BIP
  // ============================================
  const bipExtraMenus = useMemo(() => ([
    {
      label: 'BIP Eines', icon: '🧪',
      items: [
        { path: '/mi-actividad?state=pending&bip=validate', icon: '✅', label: 'Validar activitats' },
        { path: '/inventario', icon: '📊', label: 'Estadistiques recursos' },
        { path: '/inventario?status=review', icon: '🔍', label: 'Recursos per revisar' },
        { path: '/mi-perfil?tab=historial', icon: '📜', label: 'Historial de recursos' },
      ],
    },
  ]), [])

  // ============================================
  // MENÚS EXTRA PARA ADMIN MASTER
  // ============================================
  const adminExtraMenus = useMemo(() => ([
    {
      label: 'Gestion Usuarios', icon: '👥',
      items: [
        { path: '/usuarios', icon: '👥', label: 'Llista usuaris' },
        { path: '/usuarios?tab=whitelist', icon: '📄', label: 'Lista blanca' },
        { path: '/usuarios?tab=add', icon: '➕', label: 'Anadir usuario' },
        { path: '/usuarios?tab=edit', icon: '✏️', label: 'Editar usuario' },
      ],
    },
    {
      label: 'Gestion Almacenamiento', icon: '🗄️',
      items: [
        { path: '/armario/1', icon: '🗄️', label: 'Armario N1' },
        { path: '/armario/2', icon: '🗄️', label: 'Armario N2' },
        { path: '/armario/3', icon: '🗄️', label: 'Armario N3' },
        { path: '/armario/4', icon: '🗄️', label: 'Armario S1' },
        { path: '/armario/5', icon: '🗄️', label: 'Armario S2' },
        { path: '/armario/6', icon: '🗄️', label: 'Armario S3' },
        { path: '/armario/7', icon: '🔋', label: 'Armario Portátiles (carga)' },
      ],
    },
    {
      label: 'Config General', icon: '⚙️',
      items: [
        { path: '/admin-actividades', icon: '✏️', label: 'Gestión Actividades' },
        { path: '/elemento', icon: '🧩', label: 'Editor de elementos' },
        { path: '/capture', icon: '📸', label: 'Captura de imagen' },
        { path: '/configuracion?tab=resource-design', icon: '🎨', label: 'Diseno recursos' },
        { path: '/configuracion', icon: '🔧', label: 'Generales' },
      ],
    },
  ]), [])

  // ============================================
  // COMBINACIÓN DE MENÚS SEGÚN ROL
  // ============================================
  const menus = userIsAdmin
    ? [...baseMenus, ...bipExtraMenus, ...adminExtraMenus]
    : userIsBiP
      ? [...baseMenus, ...bipExtraMenus]
      : baseMenus

  return (
    <nav className="menu-admin">
      <div className="menu-top">
        <button
          className="menu-brand"
          onClick={() => navigate('/dashboard')}
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <span className="menu-brand-icon">🎛️</span>
          <div className="menu-brand-text">
            <h1>Servidor Recursos</h1>
            <p>Taller MME – V0.3</p>
          </div>
        </button>

        <div className="menu-right">
          {!userIsAdmin && (
            <div className={`menu-timer ${timeLeft <= 15 ? 'warn' : ''}`}>⏱️ {timeLeft}s</div>
          )}
          <span className="menu-user">
            {userIsAdmin ? '👑 Admin Master' : (userIsBiP ? '🤖 BiP' : '👤 Usuario')} · {user?.name || user?.nombre || user?.email?.split('@')[0]}
          </span>
          <button className="menu-logout" onClick={handleLogout}>🚪 Sortir</button>
        </div>
      </div>

      <div className="menu-nav">
        {menus.map((m) => (
          <Dropdown key={m.label} label={m.label} icon={m.icon} items={m.items} />
        ))}
      </div>
    </nav>
  )
}

export default MenuAdmin