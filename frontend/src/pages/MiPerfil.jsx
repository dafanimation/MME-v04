// frontend/src/pages/MiPerfil.jsx
// ============================================================
// ARCHIVO: src/pages/MiPerfil.jsx
// DESCRIPCIÓN: Página de perfil de usuario con historial de recursos
// RUTAS: /mi-perfil
// ============================================================
    

import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuAdmin from '../components/menus/MenuAdmin'
import { api } from '../services/api'
import { getUser } from '../services/auth'

const buildProfileExtKey = (email) => `mme.user.profile.ext.v1.${String(email || 'anon').toLowerCase()}`

const parseJson = (raw, fallback) => {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const STATUS_LABELS = {
  available: { label: 'Disponible', color: '#7be0a0' },
  assigned: { label: 'Assignat a mi', color: '#7dd4ff' },
  occupied: { label: 'Ocupat', color: '#ffc97a' },
  maintenance: { label: 'Reparació', color: '#ff9a9a' },
  review: { label: 'Revisió', color: '#c9d4ff' },
  shared: { label: 'Compartit', color: '#d4c9ff' },
  recycle: { label: 'Reciclatge', color: '#aaa' },
}

const MiPerfil = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const user = getUser()
  const email = String(user?.email || '').toLowerCase()
  const extKey = useMemo(() => buildProfileExtKey(email), [email])

  const activeTab = useMemo(() => {
    const tab = String(searchParams.get('tab') || '').toLowerCase()
    return tab === 'historial' ? 'historial' : 'perfil'
  }, [searchParams])

  const [name, setName] = useState(String(user?.name || user?.nombre || ''))
  const [group, setGroup] = useState(String(user?.group || user?.grup || ''))
  const [bio, setBio] = useState('')
  const [linksText, setLinksText] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [myResources, setMyResources] = useState([])
  const [historialLoading, setHistorialLoading] = useState(false)
  const [historialError, setHistorialError] = useState('')

  useEffect(() => {
    const ext = parseJson(window.localStorage.getItem(extKey), { bio: '', links: [] })
    setBio(String(ext.bio || ''))
    setLinksText(Array.isArray(ext.links) ? ext.links.join('\n') : '')
  }, [extKey])

  useEffect(() => {
    if (activeTab !== 'historial') return
    setHistorialLoading(true)
    setHistorialError('')
    api.getMyResources()
      .then((data) => {
        setMyResources(Array.isArray(data) ? data : data?.data || [])
      })
      .catch((err) => {
        setHistorialError(String(err?.message || 'Error carregant recursos'))
      })
      .finally(() => setHistorialLoading(false))
  }, [activeTab])

  const links = useMemo(() => {
    return String(linksText || '')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }, [linksText])

  const saveProfile = async () => {
    setSaving(true)
    setMessage('')

    try {
      window.localStorage.setItem(extKey, JSON.stringify({ bio, links }))

      if (user?.id) {
        try {
          await api.updateUser(user.id, { name, group })
        } catch {
          // Keep local updates even when backend user patch fails.
        }
      }

      const localUser = parseJson(window.localStorage.getItem('mme_user'), {})
      const merged = {
        ...localUser,
        name,
        nombre: name,
        group,
        grup: group,
      }
      window.localStorage.setItem('mme_user', JSON.stringify(merged))

      setMessage('Perfil guardat correctament')
    } catch (err) {
      setMessage(String(err?.message || 'No s\'ha pogut guardar el perfil'))
    } finally {
      setSaving(false)
    }
  }

  const setTab = (tab) => {
    const params = new URLSearchParams(searchParams)
    if (tab === 'perfil') params.delete('tab')
    else params.set('tab', tab)
    setSearchParams(params)
  }

  const TAB_BTN = (tabId, label) => (
    <button
      onClick={() => setTab(tabId)}
      style={{
        padding: '7px 16px',
        borderRadius: '8px 8px 0 0',
        border: `1px solid rgba(125,212,255,${activeTab === tabId ? '0.5' : '0.15'})`,
        borderBottom: activeTab === tabId ? '1px solid transparent' : '1px solid rgba(125,212,255,0.15)',
        background: activeTab === tabId ? 'rgba(0,212,255,0.1)' : 'rgba(0,0,0,0.3)',
        color: activeTab === tabId ? '#7dd4ff' : 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: activeTab === tabId ? 600 : 400,
      }}
    >
      {label}
    </button>
  )

  return (
    <div>
      <MenuAdmin />

      <div style={{ padding: '20px', display: 'grid', gap: '12px' }}>
        <h2 style={{ color: '#7dd4ff', margin: 0 }}>El meu perfil</h2>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(125,212,255,0.2)', marginBottom: '4px' }}>
          {TAB_BTN('perfil', '🪪 Perfil')}
          {TAB_BTN('historial', '📜 Historial de recursos')}
        </div>

        {/* === PERFIL TAB === */}
        {activeTab === 'perfil' && (
        <div style={{
          border: '1px solid rgba(125, 212, 255, 0.24)',
          borderRadius: '0 10px 10px 10px',
          padding: '12px',
          background: 'rgba(11, 19, 34, 0.86)',
          display: 'grid',
          gap: '10px',
          maxWidth: '900px',
        }}>
          <div style={{ display: 'grid', gap: '3px', fontSize: '12px', color: 'rgba(255,255,255,0.45)', paddingBottom: '8px', borderBottom: '1px solid rgba(125,212,255,0.1)' }}>
            <div>Email: <span style={{ color: '#9fd6ff' }}>{user?.email || '-'}</span></div>
            <div>Rol: <span style={{ color: '#9fd6ff' }}>{user?.role || 'user'}</span></div>
          </div>

          <label style={{ display: 'grid', gap: '4px', color: '#cde5ff', fontSize: '12px' }}>
            Nom
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #335579', background: '#0f1d34', color: '#e5f3ff' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '4px', color: '#cde5ff', fontSize: '12px' }}>
            Grup
            <input
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #335579', background: '#0f1d34', color: '#e5f3ff' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '4px', color: '#cde5ff', fontSize: '12px' }}>
            Biografia curta
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #335579', background: '#0f1d34', color: '#e5f3ff' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '4px', color: '#cde5ff', fontSize: '12px' }}>
            Links externs de projecte (un per línia)
            <textarea
              value={linksText}
              onChange={(e) => setLinksText(e.target.value)}
              rows={6}
              placeholder="https://..."
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #335579', background: '#0f1d34', color: '#e5f3ff' }}
            />
          </label>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={saveProfile}
              disabled={saving}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid #3d6a90',
                background: saving ? '#3b4b5c' : '#1a3c5a',
                color: '#d3eeff',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Guardant...' : 'Guardar perfil'}
            </button>

            {message && <span style={{ fontSize: '12px', color: message.includes('correctament') ? '#9de7bc' : '#ffb7b7' }}>{message}</span>}
          </div>

          {links.length > 0 && (
          <div style={{ display: 'grid', gap: '6px' }}>
            <strong style={{ color: '#d6e9ff', fontSize: '12px' }}>Vista prèvia de links</strong>
            {links.map((link, idx) => (
              <a key={`profile-link-${idx}`} href={link} target="_blank" rel="noreferrer" style={{ color: '#7fd7ff', fontSize: '12px' }}>
                {link}
              </a>
            ))}
          </div>
          )}
        </div>
        )}

        {/* === HISTORIAL TAB === */}
        {activeTab === 'historial' && (
        <div style={{
          border: '1px solid rgba(125, 212, 255, 0.24)',
          borderRadius: '0 10px 10px 10px',
          padding: '12px',
          background: 'rgba(11, 19, 34, 0.86)',
          display: 'grid',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <strong style={{ color: '#d7efff' }}>Recursos assignats a mi</strong>
            <span style={{ fontSize: '11px', color: '#6fa8c8' }}>
              {email}
            </span>
          </div>

          {historialLoading && (
            <p style={{ color: '#8fb4d4', fontSize: '13px' }}>Carregant recursos...</p>
          )}
          {!historialLoading && historialError && (
            <p style={{ color: '#ff9a9a', fontSize: '13px' }}>{historialError}</p>
          )}
          {!historialLoading && !historialError && myResources.length === 0 && (
            <p style={{ color: '#8fb4d4', fontSize: '13px' }}>No tens cap recurs assignat.</p>
          )}

          {!historialLoading && myResources.length > 0 && (
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ fontSize: '11px', color: '#6fa8c8', marginBottom: '2px' }}>
              {myResources.length} recurs{myResources.length !== 1 ? 'os' : ''} assignat{myResources.length !== 1 ? 's' : ''}
            </div>
            {myResources.map((r) => {
              const statusInfo = STATUS_LABELS[r.status] || { label: r.status || '?', color: '#aaa' }
              return (
                <div key={`res-${r.id}`} style={{
                  border: '1px solid rgba(125,212,255,0.18)',
                  borderRadius: '8px',
                  padding: '10px',
                  background: 'rgba(10,17,30,0.85)',
                  display: 'grid',
                  gap: '6px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <strong style={{ color: '#d7efff', fontSize: '13px' }}>{r.code} · {r.name}</strong>
                    <span style={{ fontSize: '11px', color: statusInfo.color, border: `1px solid ${statusInfo.color}44`, borderRadius: '999px', padding: '2px 8px' }}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: '#a8c4de' }}>
                    <span>Tipus: {r.type || '-'}</span>
                    {r.location?.room && <span>Sala: {r.location.room}</span>}
                    {(r.location?.mesaId || r.location?.num) && <span>Mesa: {r.location.mesaId || r.location.num}</span>}
                    {r.location?.x != null && <span>Pos: ({r.location.x}, {r.location.z})</span>}
                  </div>
                  {r.qrCode && r.qrCode.startsWith('http') && (
                    <a href={r.qrCode} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#7fd7ff' }}>
                      🔗 Fitxa QR
                    </a>
                  )}
                  {r.driveLink && (
                    <a href={r.driveLink} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#9dd4ff' }}>
                      📁 Drive
                    </a>
                  )}
                </div>
              )
            })}
          </div>
          )}
        </div>
        )}
      </div>
    </div>
  )
}

export default MiPerfil
