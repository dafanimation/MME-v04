// frontend/src/components/FichaRecurso.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// ✅ CORREGIDO: Subir 2 niveles para llegar a src/services/
import { api } from '../../services/api'

// ✅ CORREGIDO: Ir a la carpeta menus (subir uno, luego entrar a menus)
import MenuAdmin from '../menus/MenuAdmin'

// ✅ CORRECTO: Misma carpeta ui
import { buildPersistedLocation, formatLocationLabel, getLocationOptions } from './LocationSelector'

// ✅ CORREGIDO: Subir 2 niveles para llegar a src/services/
import { getUser, isAdmin } from '../../services/auth'

// ✅ CORRECTO: Misma carpeta ui
import { UserTypeBadge } from './UserTypeBadge'
// ============================================================
// FichaRecurso.jsx - Ficha detallada de un recurso
// ============================================================
// FUNCIONALIDADES:
// 1. Visualización completa de datos del recurso (RAM, CPU, OS, etc.)
// 2. Gestión de asignación/liberación (admin + BIP)
// 3. Control de ubicación (sala + posición detallada)
// 4. Historial local (localStorage) para recurso PCA001
// 5. Edición de enlace Drive
// 6. Cambio de estado (available, assigned, occupied, etc.)
//
// MEJORAS PENDIENTES PARA TEST:
// - [ ] Sincronizar historial con backend (no solo localStorage)
// - [ ] Añadir confirmación antes de cambios de estado
// - [ ] Mejorar feedback visual de carga (skeleton loader)
// - [ ] Validar formato de enlace Drive (regex)
// - [ ] Soportar SALATEST en selector de sala
// - [ ] Añadir paginación al historial si > 100 entradas
// - [ ] Implementar búsqueda de usuario por email en asignación
// - [ ] Mostrar errores de API más descriptivos
// ============================================================
const STATUS_BADGE = {
  available: { cls: 'badge-available', label: '✅ Disponible' },
  assigned: { cls: 'badge-assigned', label: '🔴 Assignat' },
  occupied: { cls: 'badge-occupied', label: '🔒 Ocupat' },
  maintenance: { cls: 'badge-maintenance', label: '🟡 Reparació' },
  review: { cls: 'badge-review', label: '👀 Revisar' },
}

const STATUS_OPTIONS = ['available', 'assigned', 'occupied', 'maintenance', 'review']

const buildResourceHistoryKey = (code) => `mme.resource.history.v1.${String(code || '').toUpperCase()}`

const parseJson = (raw, fallback) => {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const FichaRecurso = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = getUser()
  const userIsAdmin = isAdmin()
  const userGroup = String(currentUser?.group || currentUser?.grup || '').toUpperCase()
  const userRole = String(currentUser?.role || currentUser?.rol || '').toLowerCase()
  const userIsBiP = userGroup === 'BIP' || userRole === 'bip'
  const canManageAssignment = userIsAdmin || userIsBiP
  const [recurs, setRecurs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [updating, setUpdating] = useState(false)
  const [whitelistEmails, setWhitelistEmails] = useState([])
  const [assignUserEmail, setAssignUserEmail] = useState('')
  const [locationRoom, setLocationRoom] = useState('AULA')
  const [locationValue, setLocationValue] = useState('')
  const [driveLinkDraft, setDriveLinkDraft] = useState('')
  const [historyEntries, setHistoryEntries] = useState([])
  const [storageLocations, setStorageLocations] = useState([])

  useEffect(() => {
    loadRecurs()
  }, [id])

  useEffect(() => {
    if (!canManageAssignment) return
    api.getWhitelist().then((list) => {
      setWhitelistEmails(Array.isArray(list) ? list.filter(Boolean) : [])
    }).catch(() => {
      setWhitelistEmails([])
    })
  }, [canManageAssignment])

  useEffect(() => {
    api.getStorageLocations()
      .then((rows) => setStorageLocations(Array.isArray(rows) ? rows : []))
      .catch(() => setStorageLocations([]))
  }, [])

  useEffect(() => {
    if (!recurs) return
    setAssignUserEmail(recurs.assignedUser?.email || recurs.assignedToUser?.email || recurs.userEmail || recurs.user_email || '')

    const room = String(recurs.location?.room || 'AULA').toUpperCase()
    setLocationRoom(room)
    const dynamicStorageOptions = storageLocations
      .filter((location) => Number.isFinite(Number(location.coordinates?.x)) && Number.isFinite(Number(location.coordinates?.z)))
      .map((location) => ({
        value: `storage:${location.id}`,
        type: String(location.type || 'ESTANTERIA').toLowerCase() === 'armario' ? 'armario' : 'estanteria',
        estId: `SL-${location.id}`,
        room: String(location.room || 'AULA').toUpperCase(),
        x: Number(location.coordinates.x),
        z: Number(location.coordinates.z),
        placement: 'surface',
        anchor: 'center',
        label: `${String(location.room || 'AULA').toUpperCase()} · ${location.label || `${location.type || 'Storage'} ${location.zone || ''}`.trim()}`,
      }))
      .filter((location) => location.room === room)
    const options = [...getLocationOptions(room).all, ...dynamicStorageOptions]
    const byValue = options.find((opt) => (
      recurs.location?.mesaId && opt.mesaId === Number(recurs.location.mesaId)
    ))
    const byCoords = options.find((opt) => (
      typeof recurs.location?.x === 'number' && typeof recurs.location?.z === 'number' &&
      Math.abs(opt.x - recurs.location.x) < 0.05 && Math.abs(opt.z - recurs.location.z) < 0.05
    ))
    setLocationValue((byCoords || byValue)?.value || '')
    setDriveLinkDraft(recurs.driveLink || '')

    const historyKey = buildResourceHistoryKey(recurs.code)
    const saved = parseJson(window.localStorage.getItem(historyKey), [])
    setHistoryEntries(Array.isArray(saved) ? saved : [])
  }, [recurs, storageLocations])

  const appendHistoryEntry = (type, details) => {
    if (!recurs?.code) return

    const nextEntry = {
      at: new Date().toISOString(),
      type,
      details,
      actor: String(currentUser?.email || 'unknown'),
    }

    setHistoryEntries((prev) => {
      const next = [nextEntry, ...prev].slice(0, 100)
      window.localStorage.setItem(buildResourceHistoryKey(recurs.code), JSON.stringify(next))
      return next
    })
  }

  const loadRecurs = async () => {
    setLoading(true)
    try {
      const data = await api.getResource(id)
      setRecurs(data)
    } catch (err) {
      console.error('Error carregant recurs:', err)
    }
    setLoading(false)
  }

  const handleAssignar = async (emailOverride = null) => {
    const email = emailOverride != null ? emailOverride : assignUserEmail
    const selected = getLocationOptions(locationRoom).all.find((option) => option.value === locationValue)
    const locationPayload = selected ? buildPersistedLocation(selected, recurs.code) : undefined
    setUpdating(true)
    try {
      if (!email) {
        if (locationPayload) {
          await api.updateResource(recurs.id, { location: locationPayload })
        }
        await api.releaseResource(recurs.code)
        appendHistoryEntry('release', 'Recurs alliberat des de fitxa')
        setMsg('✅ Recurs alliberat')
      } else {
        await api.assignResource(recurs.code, email, locationPayload)
        appendHistoryEntry('assign', `Assignat a ${email}`)
        setMsg('✅ Recurs assignat correctament')
      }
      await loadRecurs()
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setMsg('❌ Error en l\'assignació')
    }
    setUpdating(false)
  }

  const handleAlliberar = async () => {
    if (!confirm('Alliberar aquest recurs?')) return
    setUpdating(true)
    try {
      const updated = await api.releaseResource(recurs.code)
      if (updated?.id) {
        setRecurs(updated)
        appendHistoryEntry('release', 'Recurs alliberat manualment')
        setMsg('✅ Recurs alliberat')
        setTimeout(() => setMsg(''), 3000)
      }
    } catch (err) {
      setMsg('❌ Error alliberant recurs')
    }
    setUpdating(false)
  }

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true)
    try {
      const updated = await api.updateResource(recurs.id, { status: newStatus })
      if (updated?.id) {
        setRecurs(updated)
        appendHistoryEntry('status', `Estat canviat a ${newStatus}`)
        setMsg(`✅ Estat canviat a ${newStatus}`)
        setTimeout(() => setMsg(''), 3000)
      }
    } catch (err) {
      setMsg('❌ Error actualitzant estat')
    }
    setUpdating(false)
  }

  const handleUpdateLocation = async () => {
    const selected = getLocationOptions(locationRoom).all.find((option) => option.value === locationValue)
    if (!selected) {
      setMsg('❌ Selecciona una posició abans de desar')
      setTimeout(() => setMsg(''), 2500)
      return
    }

    const location = buildPersistedLocation(selected, recurs.code)
    if (!location) {
      setMsg('❌ Posició no valida')
      setTimeout(() => setMsg(''), 2500)
      return
    }

    setUpdating(true)
    try {
      await api.updateResource(recurs.id, { location })
      await loadRecurs()
      appendHistoryEntry('location', `Ubicacio actualitzada a ${locationRoom} / ${locationValue}`)
      setMsg('✅ Ubicació actualitzada')
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setMsg('❌ Error actualitzant ubicació')
    }
    setUpdating(false)
  }

  const handleUpdateDriveLink = async () => {
    setUpdating(true)
    try {
      await api.updateResource(recurs.id, { driveLink: driveLinkDraft.trim() || null })
      await loadRecurs()
      appendHistoryEntry('drive', driveLinkDraft.trim() ? 'Drive link actualitzat' : 'Drive link eliminat')
      setMsg('✅ Enllac Drive actualitzat')
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setMsg('❌ Error actualitzant enllac Drive')
    }
    setUpdating(false)
  }

  if (loading) return <div><MenuAdmin /><p className="loading">⏳ Carregant...</p></div>
  if (!recurs) return <div><MenuAdmin /><p className="empty">Recurs no trobat</p></div>

  const statusInfo = STATUS_BADGE[recurs.status] || { cls: '', label: recurs.status }
  const assignedEmail = String(recurs.assignedUser?.email || recurs.assignedToUser?.email || recurs.userEmail || recurs.user_email || '').toLowerCase()
  const isOwnedByCurrentUser = !!currentUser?.email && assignedEmail === String(currentUser.email).toLowerCase()
  const canEditLocation = userIsAdmin || isOwnedByCurrentUser
  const dynamicRoomStorageOptions = storageLocations
    .filter((location) => Number.isFinite(Number(location.coordinates?.x)) && Number.isFinite(Number(location.coordinates?.z)))
    .map((location) => ({
      value: `storage:${location.id}`,
      type: String(location.type || 'ESTANTERIA').toLowerCase() === 'armario' ? 'armario' : 'estanteria',
      estId: `SL-${location.id}`,
      room: String(location.room || 'AULA').toUpperCase(),
      x: Number(location.coordinates.x),
      z: Number(location.coordinates.z),
      placement: 'surface',
      anchor: 'center',
      label: `${String(location.room || 'AULA').toUpperCase()} · ${location.label || `${location.type || 'Storage'} ${location.zone || ''}`.trim()}`,
    }))
    .filter((location) => location.room === locationRoom)
  const locationOptions = [...getLocationOptions(locationRoom).all, ...dynamicRoomStorageOptions]
  const isPca001 = String(recurs.code || '').toUpperCase() === 'PCA001'

  const usageStats = historyEntries.reduce((acc, item) => {
    const key = String(item.type || 'other')
    acc.total += 1
    acc.byType[key] = (acc.byType[key] || 0) + 1
    return acc
  }, { total: 0, byType: {} })

  return (
    <div>
      <MenuAdmin />
      <div style={{ padding: '28px', maxWidth: '800px', margin: '0 auto' }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
          ← Tornar
        </button>

        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <code style={{ fontSize: '1rem' }}>{recurs.code}</code>
              <h2 style={{ color: 'var(--cyan)', marginTop: '8px', fontSize: '1.6rem' }}>{recurs.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{recurs.type}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <span className={`badge ${statusInfo.cls}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                {statusInfo.label}
              </span>
              <select
                value={recurs.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                disabled={updating}
                style={{
                  padding: '4px 8px',
                  background: '#0f0f1a',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '11px'
                }}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {msg && <div className="alert alert-success" style={{ marginBottom: '16px' }}>{msg}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div className="card" style={{ padding: '14px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '4px' }}>💾 RAM</p>
              <p style={{ fontWeight: 600 }}>{recurs.ram || '—'}</p>
            </div>
            <div className="card" style={{ padding: '14px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '4px' }}>🖥️ CPU</p>
              <p style={{ fontWeight: 600 }}>{recurs.cpu || '—'}</p>
            </div>
            <div className="card" style={{ padding: '14px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '4px' }}>💻 Sistema</p>
              <p style={{ fontWeight: 600 }}>{recurs.os || '—'}</p>
            </div>
            <div className="card" style={{ padding: '14px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '4px' }}>💿 Emmagatzematge</p>
              <p style={{ fontWeight: 600 }}>{recurs.storage || '—'}</p>
            </div>
            <div className="card" style={{ padding: '14px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '4px' }}>📍 Ubicació</p>
              <p style={{ fontWeight: 600 }}>{formatLocationLabel(recurs.location)}</p>
            </div>
            <div className="card" style={{ padding: '14px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '4px' }}>👤 Assignat a</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <select
                  value={assignUserEmail}
                  onChange={(e) => setAssignUserEmail(e.target.value)}
                  disabled={updating || !canManageAssignment}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    background: '#0f0f1a',
                    border: '1px solid #33415c',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '11px',
                  }}
                >
                  <option value="">Sense assignar</option>
                  {[...(new Set([...(whitelistEmails || []), assignUserEmail].filter(Boolean)))].map((email) => (
                    <option key={`assign-${email}`} value={email}>{email}</option>
                  ))}
                </select>
                {(recurs.assignedUser || recurs.assignedToUser) && (
                  <UserTypeBadge user={recurs.assignedUser || recurs.assignedToUser} />
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: '#8dd6ff' }}>Sala</label>
              <select
                value={locationRoom}
                onChange={(e) => {
                  setLocationRoom(e.target.value)
                  setLocationValue('')
                }}
                disabled={updating || !canEditLocation}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: '#0f0f1a',
                  border: '1px solid #33415c',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '11px',
                }}
              >
                <option value="AULA">AULA</option>
                <option value="SALAPRU">SALAPRU</option>
              </select>
            </div>
            <div className="field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: '#8dd6ff' }}>Posició detallada</label>
              <select
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                disabled={updating || !canEditLocation}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: '#0f0f1a',
                  border: '1px solid #33415c',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '11px',
                }}
              >
                <option value="">Selecciona posició</option>
                {locationOptions.map((option) => (
                  <option key={`loc-${option.value}`} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {recurs.description && (
            <div style={{ marginTop: '18px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>📝 Descripció</p>
              <p>{recurs.description}</p>
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {canManageAssignment && (
              <button className="btn btn-primary" onClick={() => handleAssignar(assignUserEmail)} disabled={updating}>
                {assignUserEmail ? '📌 Assignar' : '🧹 Deixar sense assignar'}
              </button>
            )}
            {!canManageAssignment && recurs.status !== 'available' && (
              <button className="btn btn-danger" onClick={handleAlliberar} disabled={updating || !isOwnedByCurrentUser}>🔓 Alliberar</button>
            )}
            <button className="btn btn-ghost" onClick={handleUpdateLocation} disabled={updating || !canEditLocation}>📍 Actualitzar posició</button>
            {recurs.driveLink && (
              <a href={recurs.driveLink} target="_blank" rel="noopener noreferrer" className="btn btn-cyan">
                📂 Obrir fitxa Drive
              </a>
            )}
          </div>

          <div style={{ marginTop: '14px', display: 'grid', gap: '8px' }}>
            <label style={{ fontSize: '11px', color: '#8dd6ff' }}>🔗 Enllac Drive</label>
            <input
              value={driveLinkDraft}
              onChange={(e) => setDriveLinkDraft(e.target.value)}
              placeholder="https://docs.google.com/..."
              disabled={updating || !canManageAssignment}
              style={{
                width: '100%',
                padding: '8px 10px',
                background: '#0f0f1a',
                border: '1px solid #33415c',
                borderRadius: '6px',
                color: 'white',
                fontSize: '11px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn btn-ghost" onClick={handleUpdateDriveLink} disabled={updating || !canManageAssignment}>💾 Guardar enllac Drive</button>
              {!!driveLinkDraft && (
                <a href={driveLinkDraft} target="_blank" rel="noopener noreferrer" className="btn btn-cyan">🔎 Obrir draft</a>
              )}
            </div>
          </div>
        </div>

        {recurs.qrCode && (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>🔲 Codi QR del recurs</p>
            <code style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>{recurs.qrCode}</code>
          </div>
        )}

        {isPca001 && (
          <div className="card" style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
            <h3 style={{ color: '#9fe6ff', margin: 0 }}>PCA001 · Historial i estadistiques</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              <div className="stat-card">
                <div style={{ fontSize: '11px' }}>Events totals</div>
                <strong style={{ color: '#d8f5ff', fontSize: '18px' }}>{usageStats.total}</strong>
              </div>
              {Object.entries(usageStats.byType).map(([type, count]) => (
                <div key={`usage-${type}`} className="stat-card" style={{ borderColor: '#345d80' }}>
                  <div style={{ fontSize: '11px' }}>{type}</div>
                  <strong style={{ color: '#bde7ff', fontSize: '18px' }}>{count}</strong>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gap: '7px' }}>
              {historyEntries.length === 0 && (
                <div style={{ color: '#8baecc', fontSize: '12px' }}>No hi ha historial registrat encara.</div>
              )}
              {historyEntries.slice(0, 12).map((entry, idx) => (
                <div key={`history-row-${idx}`} style={{ border: '1px solid rgba(125,212,255,0.18)', borderRadius: '8px', padding: '7px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', fontSize: '11px' }}>
                    <strong style={{ color: '#d6eeff' }}>{entry.type}</strong>
                    <span style={{ color: '#8aa7bf' }}>{new Date(entry.at).toLocaleString()}</span>
                  </div>
                  <div style={{ color: '#b5d7f2', fontSize: '11px', marginTop: '4px' }}>{entry.details}</div>
                  <div style={{ color: '#6f8ba3', fontSize: '10px', marginTop: '3px' }}>Actor: {entry.actor}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FichaRecurso