// frontend/src/pages/Usuarios.jsx
// ============================================================ 
// ARCHIVO: src/pages/Usuarios.jsx
// DESCRIPCIÓN: Página de administración de usuarios
// RUTAS: /usuarios
// ============================================================
    
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuAdmin from '../components/menus/MenuAdmin'
import { api } from '../services/api'
import { UserTypeBadge } from '../components/ui/UserTypeBadge'
import { getUser, isAdmin } from '../services/auth'

const TABS = [
  { id: 'list', label: '👥 Usuaris' },
  { id: 'whitelist', label: '📄 Llista blanca' },
  { id: 'add', label: '➕ Afegir usuari' },
  { id: 'edit', label: '✏️ Editar usuari' },
]

const EMPTY_NEW_USER = { email: '', name: '', group: '', role: 'user', active: true }

const Usuarios = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentUser = getUser()
  const userIsAdmin = isAdmin()

  const activeTab = useMemo(() => {
    const tab = String(searchParams.get('tab') || '').toLowerCase()
    if (TABS.some((t) => t.id === tab)) return tab
    return 'list'
  }, [searchParams])

  const [usuarios, setUsuarios] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [whitelist, setWhitelist] = useState([])
  const [loadingWhitelist, setLoadingWhitelist] = useState(false)
  const [msg, setMsg] = useState('')
  const [newUser, setNewUser] = useState(EMPTY_NEW_USER)
  const [saving, setSaving] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [editTarget, setEditTarget] = useState(null)
  const [editPatch, setEditPatch] = useState({})

  const notify = useCallback((text) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 3500)
  }, [])

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const data = await api.getUsers()
      setUsuarios(Array.isArray(data) ? data : data?.data || [])
    } catch {
      notify('❌ Error carregant usuaris')
    } finally {
      setLoadingUsers(false)
    }
  }, [notify])

  const loadWhitelist = useCallback(async () => {
    setLoadingWhitelist(true)
    try {
      const data = await api.getWhitelist()
      setWhitelist(Array.isArray(data) ? data : data?.data || [])
    } catch {
      notify('❌ Error carregant llista blanca')
    } finally {
      setLoadingWhitelist(false)
    }
  }, [notify])

  useEffect(() => { loadUsers() }, [loadUsers])

  useEffect(() => {
    if (activeTab === 'whitelist') loadWhitelist()
  }, [activeTab, loadWhitelist])

  const setTab = (id) => {
    const params = new URLSearchParams(searchParams)
    if (id === 'list') params.delete('tab')
    else params.set('tab', id)
    setSearchParams(params)
  }

  const handleDeleteUser = async (id, email) => {
    if (!confirm(`Eliminar l'usuari ${email}?`)) return
    try {
      await api.deleteUser(id)
      setUsuarios((prev) => prev.filter((u) => u.id !== id))
      notify('✅ Usuari eliminat')
    } catch (err) {
      notify(`❌ ${err?.message || 'Error eliminant'}`)
    }
  }

  const handleToggleActive = async (user) => {
    try {
      await api.updateUser(user.id, { active: !user.active })
      setUsuarios((prev) => prev.map((u) => u.id === user.id ? { ...u, active: !u.active } : u))
      notify(`✅ Usuari ${!user.active ? 'activat' : 'desactivat'}`)
    } catch (err) {
      notify(`❌ ${err?.message || 'Error actualitzant'}`)
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.name) { notify('❌ Email i nom obligatoris'); return }
    setSaving(true)
    try {
      await api.createUser(newUser)
      notify('✅ Usuari creat')
      setNewUser(EMPTY_NEW_USER)
      await loadUsers()
    } catch (err) {
      notify(`❌ ${err?.message || 'Error creant usuari'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleAddToWhitelist = async () => {
    const email = newEmail.trim().toLowerCase()
    if (!email) { notify('❌ Email obligatori'); return }
    try {
      await api.addToWhitelist(email)
      notify('✅ Email afegit a la llista blanca')
      setNewEmail('')
      await loadWhitelist()
    } catch (err) {
      notify(`❌ ${err?.message || 'Error afegint'}`)
    }
  }

  const handleRemoveFromWhitelist = async (email) => {
    if (!confirm(`Desactivar ${email} de la llista blanca?`)) return
    try {
      await api.removeFromWhitelist(email)
      notify('✅ Entrada desactivada')
      await loadWhitelist()
    } catch (err) {
      notify(`❌ ${err?.message || 'Error eliminant'}`)
    }
  }

  const handleStartEdit = (user) => {
    setEditTarget(user)
    setEditPatch({ role: user.role, active: user.active, group: user.group || '', name: user.name || '' })
    setTab('edit')
  }

  const handleSaveEdit = async () => {
    if (!editTarget) return
    setSaving(true)
    try {
      await api.updateUser(editTarget.id, editPatch)
      notify('✅ Usuari actualitzat')
      setEditTarget(null)
      setEditPatch({})
      await loadUsers()
      setTab('list')
    } catch (err) {
      notify(`❌ ${err?.message || 'Error actualitzant'}`)
    } finally {
      setSaving(false)
    }
  }

  const INPUT = { padding: '8px', borderRadius: '8px', border: '1px solid #335579', background: '#0f1d34', color: '#e5f3ff', fontSize: '13px' }
  const SELECT = { ...INPUT }
  const BTN_PRIMARY = { padding: '8px 14px', borderRadius: '8px', border: '1px solid #3d6a90', background: '#1a3c5a', color: '#d3eeff', cursor: 'pointer', fontSize: '12px' }
  const BTN_DANGER = { padding: '5px 9px', borderRadius: '6px', border: '1px solid #8f4444', background: '#4a1a1a', color: '#ffd0d0', cursor: 'pointer', fontSize: '11px' }
  const BTN_GHOST = { padding: '5px 9px', borderRadius: '6px', border: '1px solid #335579', background: 'transparent', color: '#9fd6ff', cursor: 'pointer', fontSize: '11px' }

  return (
    <div>
      <MenuAdmin />
      <div style={{ padding: '24px' }}>
        <h2 style={{ color: 'var(--cyan)', margin: '0 0 16px' }}>👥 Gestió d'Usuaris</h2>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(125,212,255,0.2)', marginBottom: '16px', flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '7px 14px',
              borderRadius: '8px 8px 0 0',
              border: `1px solid rgba(125,212,255,${activeTab === t.id ? '0.5' : '0.15'})`,
              borderBottom: activeTab === t.id ? '1px solid transparent' : '1px solid rgba(125,212,255,0.15)',
              background: activeTab === t.id ? 'rgba(0,212,255,0.1)' : 'rgba(0,0,0,0.3)',
              color: activeTab === t.id ? '#7dd4ff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: activeTab === t.id ? 600 : 400,
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {msg && (
          <div style={{
            marginBottom: '14px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: msg.startsWith('✅') ? 'rgba(0,200,100,0.12)' : 'rgba(255,80,80,0.12)',
            border: `1px solid ${msg.startsWith('✅') ? 'rgba(0,200,100,0.3)' : 'rgba(255,80,80,0.3)'}`,
            color: msg.startsWith('✅') ? '#7be0a0' : '#ff9a9a',
            fontSize: '13px',
          }}>
            {msg}
          </div>
        )}

        {/* === TAB: Llista usuaris === */}
        {activeTab === 'list' && (
          <div>
            <div style={{ marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{usuarios.length} usuari{usuarios.length !== 1 ? 's' : ''}</span>
              <button style={BTN_GHOST} onClick={() => setTab('add')}>➕ Afegir usuari</button>
            </div>

            {loadingUsers ? (
              <p style={{ color: '#8fb4d4' }}>Carregant...</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Nom</th><th>Email</th><th>Rol</th><th>Grup</th><th>Actiu</th><th>Accions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id}>
                        <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{u.id}</td>
                        <td>{u.name || '–'}</td>
                        <td style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>{u.email}</td>
                        <td><UserTypeBadge user={u} size="small" /></td>
                        <td>{u.group || '–'}</td>
                        <td>
                          <span style={{ color: u.active ? '#7be0a0' : '#ff9a9a', fontSize: '12px' }}>
                            {u.active ? '✅' : '❌'}
                          </span>
                        </td>
                        <td style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          <button style={BTN_GHOST} onClick={() => handleStartEdit(u)}>✏️</button>
                          <button style={BTN_GHOST} onClick={() => handleToggleActive(u)}>
                            {u.active ? '🔴' : '🟢'}
                          </button>
                          {u.role !== 'admin' && u.id !== currentUser?.id && (
                            <button style={BTN_DANGER} onClick={() => handleDeleteUser(u.id, u.email)}>🗑️</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {usuarios.length === 0 && (
                      <tr><td colSpan="7" className="empty">No hi ha usuaris</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* === TAB: Llista blanca === */}
        {activeTab === 'whitelist' && (
          <div style={{ display: 'grid', gap: '14px', maxWidth: '700px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddToWhitelist()}
                placeholder="Email per afegir..."
                style={{ ...INPUT, minWidth: '240px' }}
              />
              <button style={BTN_PRIMARY} onClick={handleAddToWhitelist}>Afegir a llista blanca</button>
            </div>

            {loadingWhitelist ? (
              <p style={{ color: '#8fb4d4' }}>Carregant llista blanca...</p>
            ) : (
              <div style={{ display: 'grid', gap: '6px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  {whitelist.length} entrada{whitelist.length !== 1 ? 's' : ''} · actives: {whitelist.filter((w) => w.isActive).length}
                </div>
                {whitelist.map((w) => (
                  <div key={`wl-${w.id}`} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    border: `1px solid rgba(125,212,255,${w.isActive ? '0.2' : '0.06'})`,
                    borderRadius: '8px',
                    background: w.isActive ? 'rgba(10,17,30,0.85)' : 'rgba(5,10,20,0.6)',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ display: 'grid', gap: '2px' }}>
                      <span style={{ color: w.isActive ? '#d7efff' : 'rgba(255,255,255,0.35)', fontSize: '13px' }}>{w.email}</span>
                      {w.academicYear && (
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                          {w.academicYear}{w.module ? ` · ${w.module}` : ''}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: w.isActive ? '#7be0a0' : '#ff9a9a', border: `1px solid ${w.isActive ? '#7be0a0' : '#ff9a9a'}44`, borderRadius: '999px', padding: '1px 7px' }}>
                        {w.isActive ? 'Actiu' : 'Inactiu'}
                      </span>
                      {w.isActive && (
                        <button style={BTN_DANGER} onClick={() => handleRemoveFromWhitelist(w.email)}>Desactivar</button>
                      )}
                    </div>
                  </div>
                ))}
                {whitelist.length === 0 && (
                  <p style={{ color: '#8fb4d4', fontSize: '13px' }}>Llista blanca buida.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* === TAB: Afegir usuari === */}
        {activeTab === 'add' && (
          <div style={{ maxWidth: '500px', display: 'grid', gap: '12px' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', margin: 0 }}>
              L'email ha d'existir a la llista blanca per poder registrar-se. Afegeix l'usuari manualment si és necessari.
            </p>

            {[
              { key: 'email', label: 'Email *', type: 'email', placeholder: 'alumne@iesjoanramis.org' },
              { key: 'name', label: 'Nom *', type: 'text', placeholder: 'Nom complet' },
              { key: 'group', label: 'Grup', type: 'text', placeholder: 'Ex: SMX1A, BIP...' },
            ].map(({ key, label, type, placeholder }) => (
              <label key={key} style={{ display: 'grid', gap: '4px', color: '#cde5ff', fontSize: '12px' }}>
                {label}
                <input
                  type={type}
                  value={newUser[key]}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={INPUT}
                />
              </label>
            ))}

            <label style={{ display: 'grid', gap: '4px', color: '#cde5ff', fontSize: '12px' }}>
              Rol
              <select value={newUser.role} onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))} style={SELECT}>
                <option value="user">user</option>
                <option value="bip">bip</option>
                <option value="admin">admin</option>
              </select>
            </label>

            <label style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#cde5ff', fontSize: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={newUser.active} onChange={(e) => setNewUser((prev) => ({ ...prev, active: e.target.checked }))} />
              Compte actiu
            </label>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={BTN_PRIMARY} onClick={handleCreateUser} disabled={saving}>
                {saving ? 'Creant...' : 'Crear usuari'}
              </button>
              <button style={BTN_GHOST} onClick={() => setNewUser(EMPTY_NEW_USER)}>Netejar</button>
            </div>
          </div>
        )}

        {/* === TAB: Editar usuari === */}
        {activeTab === 'edit' && (
          <div style={{ display: 'grid', gap: '14px', maxWidth: '500px' }}>
            {!editTarget ? (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '12px' }}>
                  Selecciona un usuari de la llista per editar:
                </p>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {usuarios.map((u) => (
                    <button key={u.id} onClick={() => handleStartEdit(u)} style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(125,212,255,0.2)',
                      background: 'rgba(10,17,30,0.85)',
                      color: '#d7efff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      fontSize: '12px',
                    }}>
                      <span style={{ opacity: 0.5, fontSize: '11px', minWidth: '24px' }}>#{u.id}</span>
                      <span>{u.name || u.email}</span>
                      <span style={{ opacity: 0.5, fontSize: '11px' }}>{u.email}</span>
                      <span style={{ marginLeft: 'auto', opacity: 0.5 }}>[{u.role}]</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <strong style={{ color: '#d7efff' }}>Editant: {editTarget.email}</strong>
                  <button style={{ ...BTN_GHOST, marginLeft: 'auto' }} onClick={() => { setEditTarget(null); setEditPatch({}) }}>
                    ← Tornar
                  </button>
                </div>

                <label style={{ display: 'grid', gap: '4px', color: '#cde5ff', fontSize: '12px' }}>
                  Nom
                  <input value={editPatch.name || ''} onChange={(e) => setEditPatch((p) => ({ ...p, name: e.target.value }))} style={INPUT} />
                </label>
                <label style={{ display: 'grid', gap: '4px', color: '#cde5ff', fontSize: '12px' }}>
                  Grup
                  <input value={editPatch.group || ''} onChange={(e) => setEditPatch((p) => ({ ...p, group: e.target.value }))} style={INPUT} />
                </label>
                <label style={{ display: 'grid', gap: '4px', color: '#cde5ff', fontSize: '12px' }}>
                  Rol
                  <select value={editPatch.role || 'user'} onChange={(e) => setEditPatch((p) => ({ ...p, role: e.target.value }))} style={SELECT}>
                    <option value="user">user</option>
                    <option value="bip">bip</option>
                    <option value="admin">admin</option>
                  </select>
                </label>
                <label style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#cde5ff', fontSize: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!editPatch.active} onChange={(e) => setEditPatch((p) => ({ ...p, active: e.target.checked }))} />
                  Compte actiu
                </label>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={BTN_PRIMARY} onClick={handleSaveEdit} disabled={saving}>
                    {saving ? 'Guardant...' : 'Guardar canvis'}
                  </button>
                  <button style={BTN_GHOST} onClick={() => { setEditTarget(null); setEditPatch({}) }}>Cancel·lar</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Usuarios
