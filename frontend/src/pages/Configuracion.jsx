// ============================================================
// ARCHIVO: Configuracion.jsx
// DESCRIPCIÓN: Página de configuración del sistema
// AUTOR: Sistema MME
// VERSIÓN: 1.0
// FECHA: 2026-06-04
// ============================================================
// Este componente gestiona:
// - Diseño de recursos (colores por estado)
// - Información del sistema (versión, backend, frontend, BD)
// - Sincronización con Google Drive (admin)
// - Documentación de ayuda editable (admin)
// - Credenciales por defecto y variables de entorno (admin)
// ============================================================
// ESTRUCTURA DE LA PÁGINA:
// 1. Resource Design Tab: Configuración visual de colores
// 2. System Info: Información técnica del sistema (solo admin)
// 3. Google Drive Sync: Importación de Excel (solo admin)
// 4. Help Docs: Documentación editable por secciones
// 5. Credentials & .env: Referencia de configuración (solo admin)
// ============================================================

import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

// ✅ CORREGIDO: Ir a components/menus/MenuAdmin (subir uno, luego entrar a components/menus)
import MenuAdmin from '../components/menus/MenuAdmin'

// ✅ CORRECTO: Subir un nivel para llegar a src/services/
import { api } from '../services/api'

// ✅ CORRECTO: Subir un nivel para llegar a src/services/
import { isAdmin } from '../services/auth'
// ============================================
// DOCUMENTACIÓN POR DEFECTO
// ============================================
// Texto inicial de ayuda que se muestra a los usuarios
const DEFAULT_HELP_DOCS = {
  usuarios: `# Ajuda usuaris

- Login: POST /api/auth/login
- Token JWT: Bearer a cada peticio
- Veure meus recursos: GET /api/resources/my
- Autoassignar recurs: POST /api/resources/self-assign
- Alliberar recurs propi: POST /api/resources/release
`,
  grupos: `# Ajuda grups (mode informatiu)

- Objectiu: associar alumnes, recursos i mesa de projecte.
- Estat recomanat: planificacio -> desenvolupament -> exposicio -> completat.
- Revisio admin: comprovar recursos assignats i enllacos Drive per mesa.
`,
  apiMetodos: `# Metodes funcionals API

Auth
- POST /api/auth/login

Recursos
- GET /api/resources
- GET /api/resources/my
- POST /api/resources/self-assign
- POST /api/resources/assign
- POST /api/resources/release
- GET /api/resources/assignments/current

Admin
- GET /api/admin/whitelist
- POST /api/admin/whitelist
- DELETE /api/admin/whitelist/:email
`,
}

// ============================================
// COMPONENTE: InfoCard
// ============================================
// Tarjeta de información para mostrar datos del sistema
const InfoCard = ({ icon, label, value }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <span style={{ fontSize: '2rem' }}>{icon}</span>
    <div>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>{label}</p>
      <p style={{ fontWeight: 700, fontSize: '1rem' }}>{value}</p>
    </div>
  </div>
)

// ============================================
// COMPONENTE PRINCIPAL: Configuracion
// ============================================
const Configuracion = () => {
  // Hook para leer parámetros de la URL (ej: ?tab=resource-design)
  const [searchParams] = useSearchParams()
  const userIsAdmin = isAdmin()
  
  // Pestaña activa: resource-design o vacío (general)
  const activeTab = String(searchParams.get('tab') || '')

  // Estados para sincronización Drive
  const [syncMsg, setSyncMsg] = useState('')
  const [syncLoading, setSyncLoading] = useState(false)

  // Estados para documentación de ayuda
  const [helpDocs, setHelpDocs] = useState(DEFAULT_HELP_DOCS)
  const [helpHistory, setHelpHistory] = useState([])
  const [helpSavedMsg, setHelpSavedMsg] = useState('')
  const [helpLoading, setHelpLoading] = useState(false)

  // Secciones de ayuda disponibles
  const helpSections = useMemo(() => ([
    { key: 'usuarios', title: 'Ajuda per usuaris', description: 'Instruccions de treball per alumnat i usuaris BiP.' },
    { key: 'grupos', title: 'Ajuda per grups', description: 'Normes de treball i revisio de projectes de grup.' },
    { key: 'apiMetodos', title: 'Metodes API (informatiu)', description: 'Resum editable de endpoints funcionals i permisos.' },
  ]), [])

  // ============================================
  // EFECTOS: Cargar datos al montar
  // ============================================
  // Cargar documentación de ayuda desde el backend
  useEffect(() => {
    const loadHelpDocs = async () => {
      setHelpLoading(true)
      try {
        const [docs, history] = await Promise.all([
          api.getHelpDocs(),
          api.getHelpDocsHistory(),
        ])
        if (docs && typeof docs === 'object') {
          setHelpDocs((prev) => ({ ...prev, ...docs }))
        }
        if (Array.isArray(history)) {
          setHelpHistory(history)
        }
      } catch {
        setHelpSavedMsg('⚠️ No s\'ha pogut carregar l\'ajuda compartida')
      } finally {
        setHelpLoading(false)
      }
    }

    loadHelpDocs()
  }, [])

  // ============================================
  // HANDLERS
  // ============================================

  // Guardar documentación de ayuda
  const handleSaveHelp = async () => {
    try {
      const result = await api.saveHelpDocs(helpDocs)
      const history = await api.getHelpDocsHistory()
      if (Array.isArray(history)) {
        setHelpHistory(history)
      }
      setHelpSavedMsg(result?.message || '✅ Ajuda guardada per revisions d\'admin')
    } catch {
      setHelpSavedMsg('⚠️ No s\'ha pogut guardar l\'ajuda')
    }
  }

  // Restaurar documentación a valores por defecto
  const handleResetHelp = async () => {
    setHelpDocs(DEFAULT_HELP_DOCS)
    try {
      await api.saveHelpDocs(DEFAULT_HELP_DOCS)
      const history = await api.getHelpDocsHistory()
      if (Array.isArray(history)) {
        setHelpHistory(history)
      }
      setHelpSavedMsg('♻️ Plantilla d\'ajuda restaurada')
    } catch {
      setHelpSavedMsg('⚠️ Plantilla restaurada localment, però no s\'ha pogut enviar al servidor')
    }
  }

  // Exportar documentación como archivo Markdown
  const handleExportHelp = async () => {
    try {
      const result = await api.exportHelpDocsMarkdown()
      const markdown = result?.markdown || ''
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const stamp = new Date().toISOString().slice(0, 10)
      a.href = url
      a.download = `help-docs-${stamp}.md`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setHelpSavedMsg('📄 Export markdown generat correctament')
    } catch {
      setHelpSavedMsg('⚠️ No s\'ha pogut exportar l\'ajuda en markdown')
    }
  }

  // Sincronizar con Google Drive (importar Excel)
  const handleSync = async () => {
    setSyncLoading(true)
    try {
      const result = await api.importExcel(new FormData())
      setSyncMsg(result?.message || '⚠️ Error de sincronització')
    } catch {
      setSyncMsg('⚠️ Sincronització no disponible')
    }
    setSyncLoading(false)
  }

  return (
    <div>
      <MenuAdmin />
      <div style={{ padding: '28px' }}>
        <h2 style={{ color: 'var(--cyan)', marginBottom: '24px' }}>
          {activeTab === 'resource-design' 
            ? '🎨 Disseny de Recursos'        // Pestaña de diseño de recursos
            : userIsAdmin 
              ? '⚙️ Configuració del Sistema'  // Pestaña general (admin)
              : '❓ Ajuda i documentació'}     // Pestaña general (usuario)
        </h2>

        {/* ============================================ */}
        {/* TAB: DISEÑO DE RECURSOS */}
        {/* ============================================ */}
        {activeTab === 'resource-design' && (
          <div className="card" style={{ marginBottom: '20px', display: 'grid', gap: '12px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 }}>
              Configuració visual de targetes de recurs, esquemes de color i presentació al mapa 3D.
            </p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                { label: 'Color estat: disponible', value: '#00ff88' },
                { label: 'Color estat: assignat', value: '#00d4ff' },
                { label: 'Color estat: reparació', value: '#ff4444' },
                { label: 'Color estat: revisió', value: '#ffaa44' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', minWidth: '220px' }}>{label}</span>
                  <span style={{ width: '18px', height: '18px', borderRadius: '4px', background: value, display: 'inline-block' }} />
                  <code style={{ fontSize: '12px', color: value }}>{value}</code>
                </div>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', margin: 0 }}>
              Edició de colors en properes versions (V0.5). Configuració guardada a CSS variables.
            </p>
          </div>
        )}

        {/* ============================================ */}
        {/* SECCIÓN: INFORMACIÓN DEL SISTEMA (solo admin) */}
        {/* ============================================ */}
        {activeTab !== 'resource-design' && userIsAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          <InfoCard icon="🚀" label="Versió" value="Servidor Recursos V0.3" />
          <InfoCard icon="🟢" label="Backend" value="NestJS · Port 3000" />
          <InfoCard icon="⚛️" label="Frontend" value="React + Vite · Port 5173" />
          <InfoCard icon="💾" label="Base de dades" value="SQLite (better-sqlite3)" />
        </div>
        )}

        {/* ============================================ */}
        {/* SECCIÓN: SINCRONIZACIÓN DRIVE (solo admin) */}
        {/* ============================================ */}
        {activeTab !== 'resource-design' && userIsAdmin && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--cyan)', marginBottom: '14px' }}>🔄 Sincronització Google Drive</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px', fontSize: '0.9rem' }}>
            Importa recursos automàticament des d'un Google Sheet. Configura <code>GOOGLE_DRIVE_CREDENTIALS</code> al <code>.env</code> per activar.
          </p>
          {syncMsg && <div className="alert alert-info" style={{ marginBottom: '14px' }}>{syncMsg}</div>}
          <button className="btn btn-primary" onClick={handleSync} disabled={syncLoading}>
            {syncLoading ? '⏳ Sincronitzant...' : '🔄 Iniciar sincronització'}
          </button>
        </div>
        )}

        {/* ============================================ */}
        {/* SECCIÓN: DOCUMENTACIÓN DE AYUDA */}
        {/* ============================================ */}
        {activeTab !== 'resource-design' && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--cyan)', marginBottom: '14px' }}>
            📘 {userIsAdmin ? 'Ajuda editable (Admin Master)' : 'Documentació i instruccions'}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '14px', fontSize: '0.9rem' }}>
            {userIsAdmin
              ? "Aquest bloc és per documentar instruccions i mètodes funcionals d'API per usuaris i grups durant revisions."
              : "Instruccions d'ús del sistema, fluix de treball i endpoints disponibles."}
          </p>

          {helpLoading && (
            <div className="alert alert-info" style={{ marginBottom: '12px' }}>⏳ Carregant ajuda compartida...</div>
          )}

          <div style={{ display: 'grid', gap: '14px' }}>
            {helpSections.map((section) => (
              <div key={section.key} style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ color: '#9fe6ff', marginBottom: '6px', fontSize: '0.95rem' }}>{section.title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '8px', fontSize: '0.8rem' }}>{section.description}</p>
                {userIsAdmin ? (
                <textarea
                  value={helpDocs[section.key] || ''}
                  onChange={(e) => setHelpDocs((prev) => ({ ...prev, [section.key]: e.target.value }))}
                  rows={9}
                  style={{
                    width: '100%',
                    background: 'rgba(15,20,35,0.9)',
                    color: '#d8eaff',
                    border: '1px solid rgba(0,212,255,0.25)',
                    borderRadius: '8px',
                    padding: '10px',
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '0.8rem',
                    resize: 'vertical',
                  }}
                />
                ) : (
                <pre style={{
                  background: 'rgba(15,20,35,0.9)',
                  color: '#d8eaff',
                  border: '1px solid rgba(0,212,255,0.15)',
                  borderRadius: '8px',
                  padding: '10px',
                  fontFamily: 'Consolas, Monaco, monospace',
                  fontSize: '0.8rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                }}>
                  {helpDocs[section.key] || '(sense contingut)'}
                </pre>
                )}
              </div>
            ))}
          </div>

          {userIsAdmin && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleSaveHelp}>💾 Guardar ajuda</button>
            <button className="btn" onClick={handleResetHelp}>♻️ Restaurar plantilla</button>
            <button className="btn" onClick={handleExportHelp}>📄 Exportar markdown</button>
          </div>
          )}
          {helpSavedMsg && (
            <div className="alert alert-info" style={{ marginTop: '12px' }}>{helpSavedMsg}</div>
          )}

          {/* Historial de revisiones de ayuda */}
          <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
            <h4 style={{ color: '#9fe6ff', marginBottom: '8px', fontSize: '0.9rem' }}>Historial de revisions</h4>
            {helpHistory.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>Sense revisions registrades.</p>
            ) : (
              <div style={{ display: 'grid', gap: '6px' }}>
                {helpHistory.slice(0, 10).map((item, idx) => (
                  <div key={`${item.timestamp}-${idx}`} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px',
                    flexWrap: 'wrap',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '6px',
                    padding: '8px'
                  }}>
                    <span style={{ color: '#d8eaff', fontSize: '0.8rem' }}>{item.updatedBy || 'admin'}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>{item.timestamp}</span>
                    <span style={{ color: '#9bb9d8', fontSize: '0.76rem', width: '100%' }}>{item.summary}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* ============================================ */}
        {/* SECCIÓN: CREDENCIALES Y .ENV (solo admin) */}
        {/* ============================================ */}
        {activeTab !== 'resource-design' && userIsAdmin && (
        <>
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--cyan)', marginBottom: '14px' }}>🔐 Credencials per defecte</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Email Admin Master', value: 'Definit a ADMIN_EMAIL del .env' },
              { label: 'Contrasenya inicial', value: 'admin123 (canvia-la en producció)' },
              { label: 'Codi màgic (NestJS)', value: 'MAGIC_CODE del .env' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', minWidth: '200px' }}>{row.label}</span>
                <code>{row.value}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Referencia de variables de entorno */}
        <div className="card">
          <h3 style={{ color: 'var(--cyan)', marginBottom: '14px' }}>📄 Variables d'entorn (.env)</h3>
          <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', overflow: 'auto' }}>
{`PORT=3000
JWT_SECRET=clau_secreta_...
ADMIN_EMAIL=admin@mme.cat
MAGIC_CODE=123456
BASE_URL=http://localhost:3000

# Google Drive (opcional)
GOOGLE_DRIVE_CREDENTIALS=...
DRIVE_FOLDER_ID=...`}
          </pre>
        </div>
        </>
        )}
      </div>
    </div>
  )
}

export default Configuracion
