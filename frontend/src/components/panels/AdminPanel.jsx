// ============================================================
// ARCHIVO: src/components/panels/AdminPanel.jsx
// DESCRIPCIÓN: Panel de administración para gestionar recursos, usuarios y asignaciones
// RUTA RELATIVA: ../../services/auth, ../../services/api, ../../hooks/useSessionTimeout
// FUNCIÓN: CRUD de recursos, gestión de usuarios, asignaciones, importación Excel
// ============================================================

import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
// ✅ CORREGIDO: Ruta correcta a services (sube dos niveles)
import { getUser, isAdmin, logout } from '../../services/auth'
import { api } from '../../services/api'
import { useSessionTimeout } from '../../hooks/useSessionTimeout'
// ✅ CORREGIDO: Ruta correcta a styles
import '../../styles/AdminPanel.css'

// Constantes para etiquetas de estado
const STATUS_LABELS = {
  available: '✅ Disponible',
  shared: '🟡 Compartit',
  occupied: '🔴 Ocupat',
}

const AdminPanel = () => {
  const navigate = useNavigate()
  const user = getUser()
  const userIsAdmin = isAdmin()
  const timeLeft = useSessionTimeout(userIsAdmin)

  // Estado de pestaña activa
  const [activeTab, setActiveTab] = useState('inventari')

  // Recursos
  const [resources, setResources] = useState([])
  const [resLoading, setResLoading] = useState(false)
  const [resFilters, setResFilters] = useState({ type: '', status: '', page: 1, limit: 20 })
  const [resTotal, setResTotal] = useState(0)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newRes, setNewRes] = useState({ code: '', name: '', type: 'PC', status: 'available' })

  // Usuarios
  const [users, setUsers] = useState([])

  // Asignaciones
  const [assignments, setAssignments] = useState([])

  // Importación
  const [excelFile, setExcelFile] = useState(null)
  const [importMsg, setImportMsg] = useState('')

  // Cargar recursos con filtros
  const loadResources = useCallback(async () => {
    setResLoading(true)
    const data = await api.getResources(resFilters)
    if (data) {
      setResources(Array.isArray(data) ? data : data.data || [])
      setResTotal(data.total || (Array.isArray(data) ? data.length : 0))
    }
    setResLoading(false)
  }, [resFilters])

  // Efecto para cargar datos según pestaña activa
  useEffect(() => {
    if (activeTab === 'inventari') loadResources()
    else if (activeTab === 'usuaris') api.getUsers().then((d) => d && setUsers(Array.isArray(d) ? d : d.data || []))
    else if (activeTab === 'assignacions') api.getAssignments().then((d) => d && setAssignments(Array.isArray(d) ? d : d.data || []))
  }, [activeTab, loadResources])

  // Crear nuevo recurso
  const handleCreateResource = async (e) => {
    e.preventDefault()
    await api.createResource(newRes)
    setShowCreateForm(false)
    setNewRes({ code: '', name: '', type: 'PC', status: 'available' })
    loadResources()
  }

  // Eliminar recurso
  const handleDeleteResource = async (id) => {
    if (!confirm('Eliminar aquest recurs?')) return
    await api.deleteResource(id)
    loadResources()
  }

  // Liberar recurso asignado
  const handleRelease = async (code) => {
    if (!confirm('Alliberar aquest recurs?')) return
    await api.releaseResource(code)
    api.getAssignments().then((d) => d && setAssignments(Array.isArray(d) ? d : d.data || []))
  }

  // Importar desde Excel
  const handleImport = async (e) => {
    e.preventDefault()
    if (!excelFile) return
    setImportMsg('⏳ Important...')
    const fd = new FormData()
    fd.append('file', excelFile)
    const result = await api.importExcel(fd)
    setImportMsg(result?.message || '✅ Importació completada')
  }

  // Cerrar sesión
  const handleLogout = () => { logout(); navigate('/login') }

  // Cálculo de paginación
  const totalPages = Math.ceil(resTotal / resFilters.limit) || 1

  // Pestañas disponibles
  const TABS = [
    { id: 'inventari', label: '📦 Inventari' },
    { id: 'usuaris', label: '👥 Usuaris' },
    { id: 'assignacions', label: '🔗 Assignacions' },
    { id: 'importar', label: '📊 Importar' },
  ]

  return (
    <div className="ap">
      {/* Header */}
      <header className="ap-header">
        <div className="ap-header-left">
          <span>🎛️</span>
          <div>
            <h1>Panel Admin Master</h1>
            <p>Servidor Recursos MME – V0.3</p>
          </div>
        </div>
        <div className="ap-header-right">
          {!userIsAdmin && (
            <div className={`timer ${timeLeft <= 15 ? 'warn' : ''}`}>⏱️ {timeLeft}s</div>
          )}
          <span className="user-chip">{userIsAdmin ? '👑' : '👤'} {user?.name || user?.email?.split('@')[0]}</span>
          <button className="btn-logout" onClick={handleLogout}>🚪 Sortir</button>
        </div>
      </header>

      {/* Navegación de pestañas */}
      <nav className="ap-tabs">
        {TABS.map((t) => (
          <button 
            key={t.id} 
            className={`ap-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Contenido principal */}
      <main className="ap-content">

        {/* ── PESTAÑA: INVENTARIO ── */}
        {activeTab === 'inventari' && (
          <section>
            <div className="sec-header">
              <h2>📦 Inventari de Recursos</h2>
              <button className="btn-cyan" onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? '✕ Cancel·lar' : '➕ Nou Recurs'}
              </button>
            </div>

            {/* Formulario de creación inline */}
            {showCreateForm && (
              <form onSubmit={handleCreateResource} className="inline-form">
                <input 
                  placeholder="Codi (ex: A-0001)" 
                  value={newRes.code}
                  onChange={(e) => setNewRes({ ...newRes, code: e.target.value })} 
                  required 
                />
                <input 
                  placeholder="Nom del recurs" 
                  value={newRes.name}
                  onChange={(e) => setNewRes({ ...newRes, name: e.target.value })} 
                  required 
                />
                <select value={newRes.type} onChange={(e) => setNewRes({ ...newRes, type: e.target.value })}>
                  <option value="PC">PC</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Projector">Projector</option>
                </select>
                <button type="submit" className="btn-cyan">✅ Crear</button>
              </form>
            )}

            {/* Filtros */}
            <div className="filters">
              <select 
                value={resFilters.type}
                onChange={(e) => setResFilters({ ...resFilters, type: e.target.value, page: 1 })}
              >
                <option value="">Tots els tipus</option>
                <option value="PC">PC</option>
                <option value="Laptop">Laptop</option>
                <option value="Tablet">Tablet</option>
              </select>
              <select 
                value={resFilters.status}
                onChange={(e) => setResFilters({ ...resFilters, status: e.target.value, page: 1 })}
              >
                <option value="">Tots els estats</option>
                <option value="available">Disponible</option>
                <option value="shared">Compartit</option>
                <option value="occupied">Ocupat</option>
              </select>
            </div>

            {/* Tabla de recursos */}
            {resLoading ? (
              <p className="loading">⏳ Carregant...</p>
            ) : (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Codi</th><th>Nom</th><th>Tipus</th><th>Estat</th>
                      <th>RAM</th><th>CPU</th><th>Accions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((r) => (
                      <tr key={r.id}>
                        <td><code>{r.code}</code></td>
                        <td>{r.name}</td>
                        <td>{r.type}</td>
                        <td><span className={`badge badge-${r.status}`}>{STATUS_LABELS[r.status] || r.status}</span></td>
                        <td>{r.ram || '–'}</td>
                        <td>{r.cpu || '–'}</td>
                        <td>
                          <button className="btn-del" onClick={() => handleDeleteResource(r.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                    {resources.length === 0 && (
                      <tr><td colSpan="7" className="empty-cell">No hi ha recursos</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  disabled={resFilters.page <= 1}
                  onClick={() => setResFilters((f) => ({ ...f, page: f.page - 1 }))}
                >◀</button>
                <span>Pàg. {resFilters.page} / {totalPages}</span>
                <button 
                  disabled={resFilters.page >= totalPages}
                  onClick={() => setResFilters((f) => ({ ...f, page: f.page + 1 }))}
                >▶</button>
              </div>
            )}
          </section>
        )}

        {/* ── PESTAÑA: USUARIOS ── */}
        {activeTab === 'usuaris' && (
          <section>
            <div className="sec-header"><h2>👥 Gestió d'Usuaris</h2></div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr><th>ID</th><th>Nom</th><th>Email</th><th>Rol</th><th>Grup</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge badge-${u.role}`}>{u.role === 'admin' ? '👑 Admin' : '👤 Usuari'}</span></td>
                      <td>{u.group || '–'}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="5" className="empty-cell">No hi ha usuaris</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── PESTAÑA: ASIGNACIONES ── */}
        {activeTab === 'assignacions' && (
          <section>
            <div className="sec-header"><h2>🔗 Assignacions Actives</h2></div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr><th>Recurs</th><th>Codi</th><th>Usuari</th><th>Data</th><th>Acció</th></tr>
                </thead>
                <tbody>
                  {assignments.map((a, i) => (
                    <tr key={i}>
                      <td>{a.resourceName || a.name || '–'}</td>
                      <td><code>{a.resourceCode || a.code}</code></td>
                      <td>{a.userEmail || a.email || '–'}</td>
                      <td>{a.assignedAt ? new Date(a.assignedAt).toLocaleDateString('ca') : '–'}</td>
                      <td>
                        <button className="btn-release" onClick={() => handleRelease(a.resourceCode || a.code)}>
                          🔓 Alliberar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {assignments.length === 0 && (
                    <tr><td colSpan="5" className="empty-cell">No hi ha assignacions actives</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── PESTAÑA: IMPORTAR EXCEL ── */}
        {activeTab === 'importar' && (
          <section>
            <div className="sec-header"><h2>📊 Importar des d'Excel</h2></div>
            <form onSubmit={handleImport} className="import-form">
              <div className="field-v">
                <label>📁 Fitxer Excel (.xlsx)</label>
                <input 
                  type="file" 
                  accept=".xlsx,.xls"
                  onChange={(e) => setExcelFile(e.target.files[0])} 
                  required 
                />
              </div>
              <button type="submit" className="btn-cyan">📊 Importar</button>
              {importMsg && <div className="import-msg">{importMsg}</div>}
            </form>
          </section>
        )}

      </main>
    </div>
  )
}

export default AdminPanel