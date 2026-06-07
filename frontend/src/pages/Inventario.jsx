// frontend/src/pages/Inventario.jsx
// ============================================================
// ARCHIVO: src/pages/Inventario.jsx
// DESCRIPCIÓN: Página de inventario de recursos
// RUTAS: /inventario
// FUNCIONES:
// - Muestra una tabla con los recursos disponibles
// - Permite filtrar por estado y tipo
// - Permite crear, eliminar y asignar recursos (según permisos)
// - Integración con ubicaciones dinámicas para asignación
// ============================================================   
                          
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MenuAdmin from '../components/menus/MenuAdmin'
import { api } from '../services/api'
import { getUser, isAdmin } from '../services/auth'
import { buildPersistedLocation, formatLocationLabel, getLocationOptions } from '../components/ui/LocationSelector'
const ESTATS = ['', 'available', 'assigned', 'occupied', 'shared', 'maintenance', 'review', 'recycle']
const TIPUS  = ['', 'PC', 'Laptop', 'Tablet', 'Projector', 'Altre']

const STATUS_LABEL = {
  available:   'Disponible',
  assigned:    'Assignat',
  occupied:    'Ocupat',
  shared:      'Compartit',
  maintenance: 'Reparació',
  review:      'Revisió',
  recycle:     'Reciclatge',
}

const Inventario = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentUser = getUser()
  const userIsAdmin = isAdmin()
  const userGroup = String(currentUser?.group || currentUser?.grup || '').toUpperCase()
  const userRole = String(currentUser?.role || currentUser?.rol || '').toLowerCase()
  const userIsBiP = userGroup === 'BIP' || userRole === 'bip'
  const canManageAssignments = userIsAdmin || userIsBiP
  const [recursos, setRecursos] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(() => ({
    status: String(searchParams.get('status') || ''),
    type: String(searchParams.get('type') || ''),
  }))
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', name: '', type: 'PC', status: 'available', ram: '', cpu: '', os: '', storage: '' })
  const [msg, setMsg] = useState('')
  const [whitelistEmails, setWhitelistEmails] = useState([])
  const [locationByResource, setLocationByResource] = useState({})
  const [storageLocations, setStorageLocations] = useState([])

  const aulaLocationOptions = getLocationOptions('AULA').all
  const salapruLocationOptions = getLocationOptions('SALAPRU').all
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
  const allLocationOptions = [...aulaLocationOptions, ...salapruLocationOptions, ...dynamicStorageOptions]

  const loadRecursos = useCallback(async () => {
    setLoading(true)
    const data = await api.getResources(filters)
    if (data) setRecursos(Array.isArray(data) ? data : data.data || [])
    setLoading(false)
  }, [filters])

  useEffect(() => { loadRecursos() }, [loadRecursos])

  useEffect(() => {
    if (!canManageAssignments) return
    api.getWhitelist().then((data) => {
      const list = Array.isArray(data) ? data.filter(Boolean) : []
      setWhitelistEmails(list)
    }).catch(() => {
      setWhitelistEmails([])
    })
  }, [canManageAssignments])

  useEffect(() => {
    api.getStorageLocations()
      .then((rows) => setStorageLocations(Array.isArray(rows) ? rows : []))
      .catch(() => setStorageLocations([]))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const payload = {
      code: form.code,
      name: form.name,
      type: form.type,
      status: form.status,
      ram: form.ram || undefined,
      cpu: form.cpu || undefined,
      os: form.os || undefined,
      storage: form.storage || undefined,
    }
    const result = await api.createResource(payload)
    if (result?.id) {
      setMsg('✅ Recurs creat'); setShowForm(false)
      setForm({ code: '', name: '', type: 'PC', status: 'available', ram: '', cpu: '', os: '', storage: '' })
      loadRecursos()
    } else {
      setMsg('❌ Error creant el recurs')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  const handleDelete = async (id) => {
    if (!confirm('Eliminar aquest recurs?')) return
    await api.deleteResource(id)
    loadRecursos()
  }

  const handleSelfAssign = async (r) => {
    const selectedLocationValue = locationByResource[r.id] || ''
    const selectedLocation = allLocationOptions.find((option) => option.value === selectedLocationValue)
    try {
      const locationPayload = selectedLocation ? buildPersistedLocation(selectedLocation, r.code) : undefined
      await api.selfAssignResource(r.code, locationPayload || undefined)
      setMsg(`✅ Recurs ${r.code} autoassignat a tu`)
      loadRecursos()
    } catch (err) {
      const errMsg = String(err?.message || err || '')
      setMsg(`❌ ${errMsg.includes('409') || errMsg.includes('ja') ? 'Ja assignat o no disponible' : 'Error autoassignant'}`)
    }
    setTimeout(() => setMsg(''), 3500)
  }

  const handleAssignFromWhitelist = async (resource, email) => {
    const selectedLocationValue = locationByResource[resource.id] || ''
    const selectedLocation = allLocationOptions.find((option) => option.value === selectedLocationValue)
    try {
      const locationPayload = selectedLocation ? buildPersistedLocation(selectedLocation, resource.code) : undefined

      if (!email) {
        if (locationPayload) {
          await api.updateResource(resource.id, { location: locationPayload })
        }
        await api.releaseResource(resource.code)
        setMsg(`✅ Recurs ${resource.code} alliberat`)
      } else {
        await api.assignResource(resource.code, email, locationPayload)
        setMsg(`✅ Recurs ${resource.code} assignat a ${email}`)
      }
      loadRecursos()
    } catch (err) {
      const errMsg = String(err?.message || err || '')
      setMsg(`❌ ${errMsg || 'No s ha pogut actualitzar l assignacio'}`)
    }
    setTimeout(() => setMsg(''), 3500)
  }

  return (
    <div>
      <MenuAdmin />
      <div style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'var(--cyan)' }}>📦 Inventari de Recursos</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel·lar' : '➕ Nou Recurs'}
          </button>
        </div>

        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '16px' }}>{msg}</div>}

        {showForm && (
          <form onSubmit={handleCreate} className="card" style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            {[
              { key: 'code', label: 'Codi', placeholder: 'A-0001', required: true },
              { key: 'name',  label: 'Nom',  placeholder: 'PC Alumne 01', required: true },
              { key: 'ram',  label: 'RAM',  placeholder: '8 GB' },
              { key: 'cpu',  label: 'CPU',  placeholder: 'Intel i5' },
              { key: 'os', label: 'Sistema op.', placeholder: 'Windows 11' },
              { key: 'storage', label: 'Emm.', placeholder: '256 GB SSD' },
            ].map(f => (
              <div key={f.key} className="field">
                <label>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                  placeholder={f.placeholder} required={f.required} />
              </div>
            ))}
            <div className="field">
              <label>Tipus</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {TIPUS.filter(Boolean).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Estat</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                {ESTATS.filter(Boolean).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">✅ Crear recurs</button>
            </div>
          </form>
        )}

        {/* Active filter banner */}
        {filters.status && (
          <div style={{
            marginBottom: '12px',
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
          }}>
            <span style={{ color: '#7dd4ff' }}>Filtrant per estat: <strong>{STATUS_LABEL[filters.status] || filters.status}</strong></span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{recursos.length} recurs{recursos.length !== 1 ? 'os' : ''}</span>
            <button
              onClick={() => setFilters((f) => ({ ...f, status: '' }))}
              style={{ marginLeft: 'auto', padding: '3px 8px', background: 'transparent', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '6px', color: '#7dd4ff', cursor: 'pointer', fontSize: '11px' }}
            >
              × Netejar filtre
            </button>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            style={{ padding: '8px 13px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '8px', color: 'white', outline: 'none', flex: 1, minWidth: '150px' }}>
            <option value="" style={{ background: '#16213e' }}>Tots els estats</option>
            {ESTATS.filter(Boolean).map((s) => (
              <option key={s} value={s} style={{ background: '#16213e' }}>{STATUS_LABEL[s] || s}</option>
            ))}
          </select>
          <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            style={{ padding: '8px 13px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '8px', color: 'white', outline: 'none', flex: 1, minWidth: '150px' }}>
            {TIPUS.map((t) => <option key={t} value={t} style={{ background: '#16213e' }}>{t || 'Tots els tipus'}</option>)}
          </select>
        </div>

        {loading ? <p className="loading">⏳ Carregant...</p> : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Codi</th><th>Nom</th><th>Tipus</th><th>Estat</th><th>RAM</th><th>CPU</th><th>Assignat a</th><th>Posició</th><th>Posició nova</th><th>Accions</th></tr>
              </thead>
              <tbody>
                {recursos.map((r) => {
                  const assignedEmail = r.user_email || r.assignedUser?.email || r.assignedToUser?.email || r.userEmail || ''
                  return (
                  <tr key={r.id}>
                    <td>
                      <button
                        onClick={() => navigate(`/recursos/${r.id}`)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--cyan)',
                          cursor: 'pointer',
                          fontFamily: 'monospace',
                          fontSize: '0.92rem',
                          textDecoration: 'underline',
                          padding: 0,
                        }}
                        title="Obrir fitxa del recurs"
                      >
                        {r.code}
                      </button>
                    </td>
                    <td style={{ cursor: 'pointer', color: 'var(--cyan)' }} onClick={() => navigate(`/recursos/${r.id}`)}>
                      <span>{r.name}</span>
                      {r.driveLink && (
                        <span title="Recurs amb fitxa Drive" style={{ marginLeft: '6px', color: '#00d4ff', fontSize: '0.82rem' }}>📂</span>
                      )}
                    </td>
                    <td>{r.type}</td>
                    <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                    <td>{r.ram || '–'}</td>
                    <td>{r.cpu || '–'}</td>
                    <td style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', minWidth: '220px' }}>
                      {canManageAssignments ? (
                        <select
                          value={assignedEmail}
                          onChange={(e) => handleAssignFromWhitelist(r, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '5px 7px',
                            background: '#0f0f1a',
                            border: '1px solid #33415c',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '11px',
                          }}
                        >
                          <option value="">Sense assignar</option>
                          {[...(new Set([...(whitelistEmails || []), assignedEmail].filter(Boolean)))].map((email) => (
                            <option key={`${r.id}-assign-${email}`} value={email}>{email}</option>
                          ))}
                        </select>
                      ) : (assignedEmail || '–')}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#9ab8cc' }}>
                      {r.location ? formatLocationLabel(r.location) : '–'}
                    </td>
                    <td>
                      <select
                        value={locationByResource[r.id] || ''}
                        onChange={(e) => setLocationByResource((prev) => ({ ...prev, [r.id]: e.target.value }))}
                        style={{
                          minWidth: '210px',
                          padding: '5px 7px',
                          background: '#0f0f1a',
                          border: '1px solid #33415c',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '11px',
                        }}
                      >
                        <option value="">Sense canvi</option>
                        <optgroup label="AULA">
                          {aulaLocationOptions.map((opt) => (
                            <option key={`${r.id}-loc-a-${opt.value}`} value={opt.value}>{opt.label}</option>
                          ))}
                        </optgroup>
                        <optgroup label="SALAPRU">
                          {salapruLocationOptions.map((opt) => (
                            <option key={`${r.id}-loc-s-${opt.value}`} value={opt.value}>{opt.label}</option>
                          ))}
                        </optgroup>
                        {dynamicStorageOptions.length > 0 && (
                          <optgroup label="STORAGE DINAMIC">
                            {dynamicStorageOptions.map((opt) => (
                              <option key={`${r.id}-loc-d-${opt.value}`} value={opt.value}>{opt.label}</option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </td>
                    <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button className="btn" style={{ padding: '5px 10px', fontSize: '0.82rem', background: 'rgba(255,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(255,68,68,0.28)', borderRadius: '6px' }}
                        onClick={() => handleDelete(r.id)}>🗑️</button>
                      <button className="btn" style={{ padding: '5px 10px', fontSize: '0.82rem', background: 'var(--cyan-dim)', color: 'var(--cyan)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '6px' }}
                        onClick={() => navigate(`/recursos/${r.id}`)}>👁️</button>
                      {r.driveLink && (
                        <a
                          href={r.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn"
                          style={{
                            padding: '5px 10px',
                            fontSize: '0.82rem',
                            background: 'rgba(0, 212, 255, 0.08)',
                            color: '#00d4ff',
                            border: '1px solid rgba(0,212,255,0.3)',
                            borderRadius: '6px',
                            textDecoration: 'none',
                          }}
                          title="Obrir fitxa Drive"
                        >
                          📂
                        </a>
                      )}
                      {!userIsAdmin && r.status === 'available' && (
                        <button className="btn" style={{ padding: '5px 10px', fontSize: '0.82rem', background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '6px' }}
                          title="Autoassignar recurs a mi"
                          onClick={() => handleSelfAssign(r)}>🙋</button>
                      )}
                    </td>
                  </tr>
                  )
                })}
                {recursos.length === 0 && <tr><td colSpan="10" className="empty">No hi ha recursos</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inventario
