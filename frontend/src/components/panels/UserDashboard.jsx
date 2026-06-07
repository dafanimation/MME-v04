// ============================================================
// ARCHIVO: src/components/panels/UserDashboard.jsx
// DESCRIPCIÓN: Panel de usuario para gestionar recursos personales
// RUTA RELATIVA: ../../services/auth, ../../services/api, ../../hooks/useSessionTimeout
// FUNCIÓN: Ver recursos asignados, recursos disponibles, auto-asignación y liberación
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// ✅ CORREGIDO: Ruta correcta a services (sube dos niveles)
import { getUser, isAdmin, logout } from '../../services/auth'
import { api } from '../../services/api'
import { useSessionTimeout } from '../../hooks/useSessionTimeout'
// ✅ CORREGIDO: Ruta correcta a styles
import '../../styles/UserDashboard.css'

const UserDashboard = () => {
  const navigate = useNavigate()
  const user = getUser()
  const userIsAdmin = isAdmin()
  const timeLeft = useSessionTimeout(userIsAdmin)

  // Estado de pestaña activa
  const [tab, setTab] = useState('meus')
  
  // Estadísticas
  const [stats, setStats] = useState({ total_resources: 0, available_resources: 0, assigned_resources: 0 })
  
  // Recursos del usuario y disponibles
  const [myResources, setMyResources] = useState([])
  const [available, setAvailable] = useState([])
  const [loading, setLoading] = useState(false)

  // Cargar estadísticas al montar
  useEffect(() => {
    api.getStats().then((d) => d && setStats(d))
    loadMyResources()
  }, [])

  // Cargar datos según pestaña activa
  useEffect(() => {
    if (tab === 'meus') loadMyResources()
    else if (tab === 'disponibles') loadAvailable()
  }, [tab])

  // Cargar recursos asignados al usuario actual
  const loadMyResources = async () => {
    if (!user?.id) return
    setLoading(true)
    const data = await api.getUserResources(user.id)
    if (data) setMyResources(Array.isArray(data) ? data : data.data || [])
    setLoading(false)
  }

  // Cargar recursos disponibles para asignación
  const loadAvailable = async () => {
    setLoading(true)
    const data = await api.getResources({ status: 'available', limit: 50 })
    if (data) setAvailable(Array.isArray(data) ? data : data.data || [])
    setLoading(false)
  }

  // Liberar recurso asignado al usuario
  const handleRelease = async (code) => {
    if (!confirm('Alliberar aquest recurs?')) return
    await api.releaseResource(code)
    loadMyResources()
    api.getStats().then((d) => d && setStats(d))
  }

  // Auto-asignar recurso disponible
  const handleAssign = async (code) => {
    await api.assignResource(code, user.email)
    loadAvailable()
    loadMyResources()
    api.getStats().then((d) => d && setStats(d))
  }

  // Cerrar sesión
  const handleLogout = () => { logout(); navigate('/login') }

  // Iconos por estado
  const STATUS_ICON = { available: '✅', shared: '🟡', occupied: '🔴' }

  return (
    <div className="db">
      {/* Header */}
      <header className="db-header">
        <div className="db-header-left">
          <span>🖥️</span>
          <div>
            <h1>Panel d'Usuari</h1>
            <p>Servidor Recursos MME – V0.3</p>
          </div>
        </div>
        <div className="db-header-right">
          {!userIsAdmin && (
            <div className={`timer ${timeLeft <= 15 ? 'warn' : ''}`}>⏱️ {timeLeft}s</div>
          )}
          <span className="user-chip">👤 {user?.name || user?.email?.split('@')[0]}</span>
          <button className="btn-logout" onClick={handleLogout}>🚪 Sortir</button>
        </div>
      </header>

      {/* Tarjetas de estadísticas */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <span className="stat-val">{stats.total_resources}</span>
          <span className="stat-lbl">Total</span>
        </div>
        <div className="stat-card avail">
          <span className="stat-icon">✅</span>
          <span className="stat-val">{stats.available_resources}</span>
          <span className="stat-lbl">Disponibles</span>
        </div>
        <div className="stat-card occup">
          <span className="stat-icon">🔴</span>
          <span className="stat-val">{stats.assigned_resources}</span>
          <span className="stat-lbl">Ocupats</span>
        </div>
        <div className="stat-card mine">
          <span className="stat-icon">👤</span>
          <span className="stat-val">{myResources.length}</span>
          <span className="stat-lbl">Els meus</span>
        </div>
      </div>

      {/* Navegación de pestañas */}
      <nav className="db-tabs">
        <button 
          className={`db-tab ${tab === 'meus' ? 'active' : ''}`} 
          onClick={() => setTab('meus')}
        >
          📱 Els meus recursos
        </button>
        <button 
          className={`db-tab ${tab === 'disponibles' ? 'active' : ''}`} 
          onClick={() => setTab('disponibles')}
        >
          ✅ Recursos disponibles
        </button>
      </nav>

      {/* Contenido principal */}
      <main className="db-content">
        
        {/* ── MIS RECURSOS ── */}
        {tab === 'meus' && (
          <div>
            <h2>📱 Els meus Recursos</h2>
            {loading ? (
              <p className="loading">⏳ Carregant...</p>
            ) : myResources.length === 0 ? (
              <div className="empty-state">
                <p>📦 No tens cap recurs assignat</p>
                <button className="btn-cyan" onClick={() => setTab('disponibles')}>
                  Veure recursos disponibles
                </button>
              </div>
            ) : (
              <div className="res-grid">
                {myResources.map((r) => (
                  <div key={r.id} className="res-card">
                    <span className="res-code">{r.code}</span>
                    <span className="res-name">{r.name}</span>
                    <span className="res-type">{r.type}</span>
                    {r.ram && <span className="res-spec">💾 {r.ram}</span>}
                    {r.cpu && <span className="res-spec">🖥️ {r.cpu}</span>}
                    <button className="btn-release" onClick={() => handleRelease(r.code)}>
                      🔓 Alliberar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RECURSOS DISPONIBLES ── */}
        {tab === 'disponibles' && (
          <div>
            <h2>✅ Recursos Disponibles</h2>
            {loading ? (
              <p className="loading">⏳ Carregant...</p>
            ) : available.length === 0 ? (
              <p className="empty-state">No hi ha recursos disponibles ara mateix</p>
            ) : (
              <div className="res-grid">
                {available.map((r) => (
                  <div key={r.id} className="res-card avail">
                    <span className="res-code">{r.code}</span>
                    <span className="res-name">{r.name}</span>
                    <span className="res-type">{r.type}</span>
                    {r.ram && <span className="res-spec">💾 {r.ram}</span>}
                    {r.os && <span className="res-spec">💻 {r.os}</span>}
                    <button className="btn-assign" onClick={() => handleAssign(r.code)}>
                      📌 Agafar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
      </main>
    </div>
  )
}

export default UserDashboard