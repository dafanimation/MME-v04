// ============================================================   
// ARCHIVO: // frontend/src/pages/MiActividad.jsx
// DESCRIPCIÓN: Página de seguimiento de actividad del usuario
// RUTAS: /mi-actividad
// FUNCIONES:
// - Muestra UDs pendientes y completadas del usuario
// - Permite marcar UDs como completadas o pendientes
// - Panel de validación BIP para usuarios con rol de validación
// - Simulación de entrega y revisión de actividad
// - Exportación de reporte de actividad en JSON
// ============================================================
          

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MenuAdmin from '../components/menus/MenuAdmin'
import { api } from '../services/api'
import { getUser, isAdmin } from '../services/auth'
import { getUdTemplate } from '../data/udActivityTemplates'


const BASE_UDS = ['UD01', 'UD02', 'UD03', 'UD04', 'UD05', 'UD06']

const buildStorageKey = (email) => `mme.my-activity.state.v1.${String(email || 'anon').toLowerCase()}`
const buildProgressStorageKey = (email) => `mme.my-activity.progress.v1.${String(email || 'anon').toLowerCase()}`

const parseJson = (raw, fallback) => {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const normalizeState = (value) => (value === 'completed' ? 'completed' : 'pending')

const downloadJson = (filename, payload) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

const BipValidationPanel = ({ udCode, onUdChange }) => {
  const [records, setRecords] = useState([])
  const [bipLoading, setBipLoading] = useState(false)
  const [bipError, setBipError] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [gradeInputs, setGradeInputs] = useState({})
  const [noteInputs, setNoteInputs] = useState({})
  const [reasonInputs, setReasonInputs] = useState({})

  const loadRecords = useCallback(async () => {
    if (!udCode) return
    setBipLoading(true)
    setBipError('')
    try {
      const data = await api.getAllActivityProgress(udCode)
      setRecords(Array.isArray(data) ? data : [])
    } catch (err) {
      setBipError(String(err?.message || 'Error carregant progrés dels alumnes'))
      setRecords([])
    } finally {
      setBipLoading(false)
    }
  }, [udCode])

  useEffect(() => { loadRecords() }, [loadRecords])

  const handleValidate = async (record) => {
    const grade = parseFloat(gradeInputs[record.id] ?? record.autoScore ?? '')
    const notes = noteInputs[record.id] || ''
    try {
      await api.validateStudentProgress(udCode, record.userId, { grade: isNaN(grade) ? null : grade, notes })
      setActionMsg(`✅ ${record.userEmail || record.userId} validat`)
      loadRecords()
    } catch (err) {
      setActionMsg(`❌ Error: ${err?.message || 'No s\'ha pogut validar'}`)
    }
    setTimeout(() => setActionMsg(''), 3500)
  }

  const handleReturn = async (record) => {
    const reason = reasonInputs[record.id] || ''
    try {
      await api.returnStudentProgress(udCode, record.userId, { reason })
      setActionMsg(`↩️ ${record.userEmail || record.userId} retornat per correccions`)
      loadRecords()
    } catch (err) {
      setActionMsg(`❌ Error: ${err?.message || 'No s\'ha pogut retornar'}`)
    }
    setTimeout(() => setActionMsg(''), 3500)
  }

  const statusColor = { submitted: '#ffe0aa', validated: '#9bf0be', returned: '#ffb3b3', in_progress: '#a7ddff', pending: '#ccc' }

  return (
    <div style={{ border: '1px solid rgba(255,180,50,0.3)', borderRadius: '10px', padding: '16px', background: 'rgba(20,12,3,0.85)', display: 'grid', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <strong style={{ color: '#ffd07a', fontSize: '15px' }}>🤖 Panell de validació BIP</strong>
        <select
          value={udCode}
          onChange={(e) => onUdChange(e.target.value)}
          style={{ padding: '6px 10px', background: '#160e03', border: '1px solid rgba(255,180,50,0.35)', borderRadius: '8px', color: '#ffd07a' }}
        >
          {BASE_UDS.map((ud) => <option key={ud} value={ud}>{ud}</option>)}
        </select>
      </div>

      {actionMsg && (
        <div style={{ padding: '8px 12px', borderRadius: '7px', background: 'rgba(255,180,50,0.1)', border: '1px solid rgba(255,180,50,0.3)', color: '#ffd07a', fontSize: '12px' }}>
          {actionMsg}
        </div>
      )}

      {bipLoading && <p style={{ color: '#b8943e', fontSize: '12px' }}>⏳ Carregant progrés dels alumnes...</p>}
      {!bipLoading && bipError && <p style={{ color: '#ff9a9a', fontSize: '12px' }}>{bipError}</p>}

      {!bipLoading && !bipError && records.length === 0 && (
        <p style={{ color: '#9c8244', fontSize: '12px' }}>Sense registres de progrés per {udCode}.</p>
      )}

      {!bipLoading && records.length > 0 && (
        <div style={{ display: 'grid', gap: '10px' }}>
          {records.map((record) => (
            <div key={record.id || record.userId} style={{ border: '1px solid rgba(255,180,50,0.2)', borderRadius: '8px', padding: '10px', background: 'rgba(0,0,0,0.4)', display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ color: '#f0d890', fontSize: '12px' }}>{record.userEmail || record.userName || `User ${record.userId}`}</span>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', border: '1px solid rgba(255,180,50,0.3)', color: statusColor[record.status] || '#ccc' }}>
                  {record.status || 'draft'}
                </span>
              </div>

              <div style={{ fontSize: '11px', color: '#b0924a', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span>Passos: {record.stepsCompleted ?? '?'}/{record.stepsTotal ?? '?'}</span>
                {record.autoScore != null && <span>Auto-nota: {record.autoScore}</span>}
                {record.grade != null && <span>Nota final: {record.grade}</span>}
                {record.submittedAt && <span>Enviat: {new Date(record.submittedAt).toLocaleString()}</span>}
              </div>

              {(record.status === 'submitted' || record.status === 'in_progress') && (
                <div style={{ display: 'grid', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      placeholder="Nota (0-10)"
                      value={gradeInputs[record.id] ?? ''}
                      onChange={(e) => setGradeInputs((p) => ({ ...p, [record.id]: e.target.value }))}
                      style={{ width: '90px', padding: '5px', borderRadius: '6px', border: '1px solid #6b5220', background: '#120d03', color: '#ffe0a0', fontSize: '11px' }}
                    />
                    <input
                      type="text"
                      placeholder="Notes de validació"
                      value={noteInputs[record.id] || ''}
                      onChange={(e) => setNoteInputs((p) => ({ ...p, [record.id]: e.target.value }))}
                      style={{ flex: 1, minWidth: '120px', padding: '5px', borderRadius: '6px', border: '1px solid #6b5220', background: '#120d03', color: '#ffe0a0', fontSize: '11px' }}
                    />
                    <button
                      onClick={() => handleValidate(record)}
                      style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #5a8a5a', background: '#1e3d1e', color: '#9bf0be', cursor: 'pointer', fontSize: '11px' }}
                    >
                      ✅ Validar
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Motiu del retorn"
                      value={reasonInputs[record.id] || ''}
                      onChange={(e) => setReasonInputs((p) => ({ ...p, [record.id]: e.target.value }))}
                      style={{ flex: 1, minWidth: '160px', padding: '5px', borderRadius: '6px', border: '1px solid #6b5220', background: '#120d03', color: '#ffe0a0', fontSize: '11px' }}
                    />
                    <button
                      onClick={() => handleReturn(record)}
                      style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #8a5a5a', background: '#3d1e1e', color: '#ffb3b3', cursor: 'pointer', fontSize: '11px' }}
                    >
                      ↩️ Retornar
                    </button>
                  </div>
                </div>
              )}

              {record.status === 'validated' && (
                <div style={{ fontSize: '11px', color: '#9bf0be' }}>
                  Validat{record.reviewedAt ? ` · ${new Date(record.reviewedAt).toLocaleDateString()}` : ''}{record.notes ? ` · ${record.notes}` : ''}
                </div>
              )}

              {record.status === 'returned' && (
                <div style={{ fontSize: '11px', color: '#ffb3b3' }}>
                  Retornat per correccions{record.returnReason ? `: ${record.returnReason}` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={loadRecords} style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid rgba(255,180,50,0.3)', background: 'transparent', color: '#ffd07a', cursor: 'pointer', fontSize: '11px', alignSelf: 'start' }}>
        🔄 Recarregar
      </button>
    </div>
  )
}

const MiActividad = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const user = getUser()
  const userEmail = String(user?.email || '').toLowerCase()
  const userIsAdmin = isAdmin()
  const userRole = String(user?.role || user?.rol || '').toLowerCase()
  const userGroup = String(user?.group || user?.grup || '').toUpperCase()
  const canValidate = userIsAdmin || userRole === 'bip' || userGroup === 'BIP'
  const bipMode = canValidate && String(searchParams.get('bip') || '').toLowerCase() === 'validate'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resourceCount, setResourceCount] = useState(0)
  const [activityMeta, setActivityMeta] = useState({})
  const [activityState, setActivityState] = useState({})
  const [selectedUdCode, setSelectedUdCode] = useState('UD01')
  const [activityProgress, setActivityProgress] = useState({})

  const stateFilter = useMemo(() => {
    const value = String(searchParams.get('state') || '').toLowerCase()
    return value === 'completed' ? 'completed' : 'pending'
  }, [searchParams])

  const udFilter = useMemo(() => {
    return String(searchParams.get('ud') || '').toUpperCase()
  }, [searchParams])

  const storageKey = useMemo(() => buildStorageKey(userEmail), [userEmail])
  const progressStorageKey = useMemo(() => buildProgressStorageKey(userEmail), [userEmail])

  useEffect(() => {
    const saved = parseJson(window.localStorage.getItem(storageKey), {})
    setActivityState(saved)
  }, [storageKey])

  useEffect(() => {
    const saved = parseJson(window.localStorage.getItem(progressStorageKey), {})
    setActivityProgress(saved)
  }, [progressStorageKey])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(activityState))
  }, [storageKey, activityState])

  useEffect(() => {
    window.localStorage.setItem(progressStorageKey, JSON.stringify(activityProgress))
  }, [progressStorageKey, activityProgress])

  useEffect(() => {
    if (!udFilter) return
    setSelectedUdCode(udFilter)
  }, [udFilter])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [resourcesResp, aulaElementsResp, salaPruElementsResp, salaTestElementsResp] = await Promise.all([
        api.getResources({ limit: 500 }),
        api.getSpaceElements({ room: 'AULA' }),
        api.getSpaceElements({ room: 'SALAPRU' }),
        api.getSpaceElements({ room: 'SALATEST' }),
      ])

      const resources = Array.isArray(resourcesResp) ? resourcesResp : (resourcesResp?.data || [])
      const aulaElements = Array.isArray(aulaElementsResp) ? aulaElementsResp : []
      const salaPruElements = Array.isArray(salaPruElementsResp) ? salaPruElementsResp : []
      const salaTestElements = Array.isArray(salaTestElementsResp) ? salaTestElementsResp : []
      const allElements = [...aulaElements, ...salaPruElements, ...salaTestElements]

      const myResources = resources.filter((resource) => {
        const assigned = String(resource.assignedUser?.email || resource.user_email || '').toLowerCase()
        return !!userEmail && assigned === userEmail
      })
      setResourceCount(myResources.length)

      const meta = {}

      BASE_UDS.forEach((udCode) => {
        meta[udCode] = {
          udCode,
          source: 'base',
          projectName: '',
          mesaNum: '',
          room: '',
          resourceCodes: [],
        }
      })

      allElements.forEach((item) => {
        const assignment = item?.assignment || {}
        const owner = String(assignment.userEmail || '').toLowerCase()
        const udCode = String(assignment.activityCode || '').toUpperCase()
        if (!owner || owner !== userEmail || !udCode) return

        if (!meta[udCode]) {
          meta[udCode] = {
            udCode,
            source: 'space-element',
            projectName: String(assignment.projectName || ''),
            mesaNum: String(assignment.mesaNum || ''),
            room: String(item.room || ''),
            resourceCodes: [],
          }
        }
      })

      myResources.forEach((resource) => {
        const code = String(resource.code || '').toUpperCase()
        const udCode = String(resource.location?.activityCode || '').toUpperCase()
        if (!udCode) return

        if (!meta[udCode]) {
          meta[udCode] = {
            udCode,
            source: 'resource-location',
            projectName: '',
            mesaNum: String(resource.location?.mesaId || resource.location?.num || ''),
            room: String(resource.location?.room || ''),
            resourceCodes: [],
          }
        }

        if (code && !meta[udCode].resourceCodes.includes(code)) {
          meta[udCode].resourceCodes.push(code)
        }
      })

      setActivityMeta(meta)
    } catch (err) {
      setError(String(err?.message || 'Error cargando actividades de usuario'))
    } finally {
      setLoading(false)
    }
  }, [userEmail])

  useEffect(() => {
    load()
  }, [load])

  const activities = useMemo(() => {
    return Object.values(activityMeta)
      .sort((a, b) => a.udCode.localeCompare(b.udCode))
      .map((activity) => {
        const state = normalizeState(activityState[activity.udCode])
        return { ...activity, state }
      })
  }, [activityMeta, activityState])

  const visibleActivities = useMemo(() => {
    return activities.filter((activity) => activity.state === stateFilter)
  }, [activities, stateFilter])

  const selectedTemplate = useMemo(() => getUdTemplate(selectedUdCode), [selectedUdCode])

  const selectedProgress = useMemo(() => {
    return activityProgress[selectedUdCode] || { steps: {}, submittedAt: '', autoScore: null, status: 'draft', reviewedAt: '' }
  }, [activityProgress, selectedUdCode])

  const selectedProgressStats = useMemo(() => {
    if (!selectedTemplate) {
      return { total: 0, completed: 0, percent: 0 }
    }
    const total = selectedTemplate.steps.length
    const completed = selectedTemplate.steps.filter((step) => selectedProgress.steps?.[step.id]?.completed).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percent }
  }, [selectedTemplate, selectedProgress])

  const stats = useMemo(() => {
    const total = activities.length
    const completed = activities.filter((activity) => activity.state === 'completed').length
    const pending = total - completed
    const withResources = activities.filter((activity) => activity.resourceCodes.length > 0).length
    return {
      total,
      completed,
      pending,
      withResources,
      assignedResources: resourceCount,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }, [activities, resourceCount])

  const setStateFilter = (state) => {
    const params = new URLSearchParams(searchParams)
    params.set('state', state)
    setSearchParams(params)
  }

  const toggleActivityState = (udCode) => {
    setActivityState((prev) => {
      const current = normalizeState(prev[udCode])
      const next = current === 'completed' ? 'pending' : 'completed'
      return { ...prev, [udCode]: next }
    })
  }

  const updateStepProgress = (udCode, stepId, patch) => {
    setActivityProgress((prev) => {
      const currentByUd = prev[udCode] || { steps: {}, submittedAt: '', autoScore: null, status: 'draft', reviewedAt: '' }
      const currentStep = currentByUd.steps?.[stepId] || {}
      return {
        ...prev,
        [udCode]: {
          ...currentByUd,
          steps: {
            ...(currentByUd.steps || {}),
            [stepId]: {
              ...currentStep,
              ...patch,
            },
          },
        },
      }
    })
  }

  const submitSimulation = () => {
    if (!selectedTemplate) return
    const total = selectedTemplate.steps.length
    const completed = selectedTemplate.steps.filter((step) => selectedProgress.steps?.[step.id]?.completed).length
    const score = total > 0 ? Number(((completed / total) * 10).toFixed(1)) : 0
    setActivityProgress((prev) => ({
      ...prev,
      [selectedUdCode]: {
        ...(prev[selectedUdCode] || { steps: {} }),
        submittedAt: new Date().toISOString(),
        autoScore: score,
        status: 'submitted',
      },
    }))
    if (score >= 6) {
      setActivityState((prev) => ({ ...prev, [selectedUdCode]: 'completed' }))
    }
  }

  const markReviewedSimulation = () => {
    setActivityProgress((prev) => ({
      ...prev,
      [selectedUdCode]: {
        ...(prev[selectedUdCode] || { steps: {} }),
        reviewedAt: new Date().toISOString(),
        status: 'reviewed',
      },
    }))
  }

  const exportSimulationReport = () => {
    if (!selectedTemplate) return
    const activity = activities.find((item) => item.udCode === selectedUdCode) || null
    const report = {
      generatedAt: new Date().toISOString(),
      user: {
        email: user?.email || '',
        name: user?.name || user?.nombre || '',
      },
      activity: {
        udCode: selectedUdCode,
        title: selectedTemplate.title,
        statement: selectedTemplate.statement,
        timeline: selectedTemplate.timeline || null,
        requiredResources: selectedTemplate.requiredResources || [],
        evaluationMethods: selectedTemplate.evaluationMethods || [],
        projectName: activity?.projectName || '',
        mesaNum: activity?.mesaNum || '',
        room: activity?.room || '',
      },
      progress: {
        completed: selectedProgressStats.completed,
        total: selectedProgressStats.total,
        percent: selectedProgressStats.percent,
        status: selectedProgress.status || 'draft',
        submittedAt: selectedProgress.submittedAt || '',
        reviewedAt: selectedProgress.reviewedAt || '',
        autoScore: selectedProgress.autoScore,
      },
      steps: selectedTemplate.steps.map((step) => {
        const state = selectedProgress.steps?.[step.id] || {}
        return {
          id: step.id,
          title: step.title,
          instruction: step.instruction,
          completed: !!state.completed,
          evidence: state.evidence || '',
          value: state.value || '',
        }
      }),
    }

    const safeUser = String(user?.email || 'usuario').replace(/[^a-z0-9-_@.]+/gi, '_')
    downloadJson(`${selectedUdCode}-delivery-${safeUser}.json`, report)
  }

  return (
    <div>
      <MenuAdmin />

      <div style={{ padding: '20px' }}>
        <h2 style={{ color: '#7dd4ff', marginBottom: '10px' }}>
          {bipMode ? '🤖 Validació d\'activitats (BIP)' : 'Mi actividad'}
        </h2>
        <p style={{ color: '#8fb4d4', marginTop: 0, marginBottom: '14px', fontSize: '13px' }}>
          {bipMode
            ? 'Valida o retorna les activitats enviades pels alumnes.'
            : 'Seguimiento de UDs pendientes/completadas y resumen de actividad del usuario.'}
        </p>

        {bipMode && (
          <BipValidationPanel
            udCode={selectedUdCode}
            onUdChange={setSelectedUdCode}
          />
        )}

        {bipMode && (
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={() => { const p = new URLSearchParams(searchParams); p.delete('bip'); setSearchParams(p) }}
              style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #395579', background: '#17283f', color: '#d9e9ff', cursor: 'pointer', fontSize: '12px' }}
            >
              ← Tornar a la meva activitat
            </button>
          </div>
        )}

        {bipMode ? null : (<>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div className="stat-card" style={{ minWidth: '110px' }}>
            <div style={{ fontSize: '11px' }}>Total UDs</div>
            <div style={{ fontSize: '18px', color: '#d8f3ff', fontWeight: 700 }}>{stats.total}</div>
          </div>
          <div className="stat-card" style={{ minWidth: '110px', borderColor: '#2f6a43' }}>
            <div style={{ fontSize: '11px' }}>Completadas</div>
            <div style={{ fontSize: '18px', color: '#93f2b6', fontWeight: 700 }}>{stats.completed}</div>
          </div>
          <div className="stat-card" style={{ minWidth: '110px', borderColor: '#70524f' }}>
            <div style={{ fontSize: '11px' }}>Pendientes</div>
            <div style={{ fontSize: '18px', color: '#ffc4b9', fontWeight: 700 }}>{stats.pending}</div>
          </div>
          <div className="stat-card" style={{ minWidth: '110px', borderColor: '#2f5c79' }}>
            <div style={{ fontSize: '11px' }}>Con recursos</div>
            <div style={{ fontSize: '18px', color: '#a7ddff', fontWeight: 700 }}>{stats.withResources}</div>
          </div>
          <div className="stat-card" style={{ minWidth: '110px', borderColor: '#2f5c79' }}>
            <div style={{ fontSize: '11px' }}>Recursos asignados</div>
            <div style={{ fontSize: '18px', color: '#a7ddff', fontWeight: 700 }}>{stats.assignedResources}</div>
          </div>
          <div className="stat-card" style={{ minWidth: '110px', borderColor: '#3f4f76' }}>
            <div style={{ fontSize: '11px' }}>Progreso</div>
            <div style={{ fontSize: '18px', color: '#d6deff', fontWeight: 700 }}>{stats.progress}%</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setStateFilter('pending')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #395579',
              background: stateFilter === 'pending' ? '#2c3f60' : '#17283f',
              color: '#d9e9ff',
              cursor: 'pointer',
            }}
          >
            Ver pendientes
          </button>
          <button
            onClick={() => setStateFilter('completed')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #39654e',
              background: stateFilter === 'completed' ? '#244535' : '#173a2d',
              color: '#d5ffe6',
              cursor: 'pointer',
            }}
          >
            Ver completadas
          </button>
        </div>

        {loading && <p style={{ color: '#a2c6e3' }}>Cargando actividades...</p>}
        {!loading && error && <p style={{ color: '#ff9a9a' }}>{error}</p>}

        {!loading && !error && (
          <div style={{ display: 'grid', gap: '10px' }}>
            {visibleActivities.map((activity) => {
              const firstResourceCode = activity.resourceCodes[0] || ''
              return (
                <div
                  key={activity.udCode}
                  style={{
                    border: '1px solid rgba(125, 212, 255, 0.22)',
                    borderRadius: '10px',
                    padding: '10px',
                    background: 'rgba(10, 17, 30, 0.85)',
                    display: 'grid',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <strong style={{ color: '#d7efff' }}>{activity.udCode}</strong>
                    <span style={{ fontSize: '11px', color: activity.state === 'completed' ? '#9bf0be' : '#ffd0c8' }}>
                      {activity.state === 'completed' ? 'Completada' : 'Pendiente'}
                    </span>
                    {activityProgress[activity.udCode]?.status === 'submitted' && (
                      <span style={{ fontSize: '10px', color: '#ffe0aa', border: '1px solid rgba(255, 206, 120, 0.4)', borderRadius: '999px', padding: '2px 7px' }}>
                        Enviada
                      </span>
                    )}
                    {activityProgress[activity.udCode]?.status === 'reviewed' && (
                      <span style={{ fontSize: '10px', color: '#9de0ba', border: '1px solid rgba(123, 220, 160, 0.4)', borderRadius: '999px', padding: '2px 7px' }}>
                        Revisada
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '12px', color: '#a8c4de', display: 'grid', gap: '4px' }}>
                    <div>Origen: {activity.source}</div>
                    <div>Proyecto: {activity.projectName || 'Sin proyecto asociado'}</div>
                    <div>Mesa: {activity.mesaNum || 'Sin mesa'}</div>
                    <div>Sala: {activity.room || 'Sin sala'}</div>
                    <div>Recursos: {activity.resourceCodes.length > 0 ? activity.resourceCodes.join(', ') : 'Sin recursos detectados'}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => toggleActivityState(activity.udCode)}
                      style={{
                        padding: '5px 9px',
                        borderRadius: '7px',
                        border: '1px solid #355a7d',
                        background: '#1a2f4a',
                        color: '#dbecff',
                        cursor: 'pointer',
                        fontSize: '11px',
                      }}
                    >
                      {activity.state === 'completed' ? 'Marcar pendiente' : 'Marcar completada'}
                    </button>

                    <button
                      onClick={() => setSelectedUdCode(activity.udCode)}
                      style={{
                        padding: '5px 9px',
                        borderRadius: '7px',
                        border: '1px solid #335a76',
                        background: selectedUdCode === activity.udCode ? '#2b4a60' : '#162a3d',
                        color: '#d3eeff',
                        cursor: 'pointer',
                        fontSize: '11px',
                      }}
                    >
                      Abrir ficha
                    </button>

                    {firstResourceCode && (
                      <button
                        onClick={() => navigate(`/dashboard?activity=${encodeURIComponent(activity.udCode)}&resourceCode=${encodeURIComponent(firstResourceCode)}`)}
                        style={{
                          padding: '5px 9px',
                          borderRadius: '7px',
                          border: '1px solid #3f6e8f',
                          background: '#18384f',
                          color: '#b8ebff',
                          cursor: 'pointer',
                          fontSize: '11px',
                        }}
                      >
                        Localizar recurso en mapa
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {visibleActivities.length === 0 && (
              <div style={{ color: '#9cb8d2', fontSize: '12px' }}>
                No hay actividades en este estado.
              </div>
            )}

            {selectedTemplate && (
              <div
                style={{
                  border: '1px solid rgba(125, 212, 255, 0.25)',
                  borderRadius: '10px',
                  padding: '12px',
                  background: 'rgba(8, 15, 27, 0.92)',
                  display: 'grid',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <strong style={{ color: '#d7efff' }}>{selectedTemplate.code} · {selectedTemplate.title}</strong>
                  <span style={{ color: '#9fd6ff', fontSize: '12px' }}>
                    Progreso {selectedProgressStats.completed}/{selectedProgressStats.total} ({selectedProgressStats.percent}%)
                  </span>
                </div>

                <div style={{ color: '#9dc2df', fontSize: '12px' }}>{selectedTemplate.statement}</div>

                <div style={{ display: 'grid', gap: '3px', fontSize: '11px', color: '#a8c9e5' }}>
                  <div>Inicio: {selectedTemplate.timeline?.startDate || '-'}</div>
                  <div>Entrega: {selectedTemplate.timeline?.dueDate || '-'}</div>
                  <div>Recursos requeridos: {(selectedTemplate.requiredResources || []).join(', ') || '-'}</div>
                </div>

                {!!selectedTemplate.evaluationMethods?.length && (
                  <div style={{ display: 'grid', gap: '3px', fontSize: '11px', color: '#9dc2df' }}>
                    {selectedTemplate.evaluationMethods.map((method) => (
                      <div key={`${selectedTemplate.code}-${method}`}>• {method}</div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gap: '8px' }}>
                  {selectedTemplate.steps.map((step) => {
                    const stepState = selectedProgress.steps?.[step.id] || {}
                    return (
                      <div key={step.id} style={{ border: '1px solid rgba(125, 212, 255, 0.18)', borderRadius: '8px', padding: '8px', display: 'grid', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <input
                            type="checkbox"
                            checked={!!stepState.completed}
                            onChange={(e) => updateStepProgress(selectedUdCode, step.id, { completed: e.target.checked })}
                          />
                          <strong style={{ color: '#d8f2ff', fontSize: '12px' }}>{step.title}</strong>
                        </div>
                        <div style={{ color: '#a6c9e5', fontSize: '11px' }}>{step.instruction}</div>

                        {(step.evidenceType === 'text' || step.evidenceType === 'image') && (
                          <input
                            value={stepState.evidence || ''}
                            onChange={(e) => updateStepProgress(selectedUdCode, step.id, { evidence: e.target.value })}
                            placeholder={step.evidenceType === 'image' ? 'URL o referencia de imagen' : 'Nota/evidencia del paso'}
                            style={{ padding: '6px', borderRadius: '7px', border: '1px solid #36577a', background: '#0f1d34', color: '#e4f4ff', fontSize: '11px' }}
                          />
                        )}

                        {step.evidenceType === 'number' && (
                          <input
                            type="number"
                            value={stepState.value || ''}
                            onChange={(e) => updateStepProgress(selectedUdCode, step.id, { value: e.target.value })}
                            placeholder={`Valor (${step.unit || ''})`}
                            style={{ padding: '6px', borderRadius: '7px', border: '1px solid #36577a', background: '#0f1d34', color: '#e4f4ff', fontSize: '11px' }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={submitSimulation}
                    style={{
                      padding: '7px 11px',
                      borderRadius: '8px',
                      border: '1px solid #3f6b8f',
                      background: '#1a3f5d',
                      color: '#d7efff',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    Simular envio y evaluacion
                  </button>

                  <button
                    onClick={markReviewedSimulation}
                    style={{
                      padding: '7px 11px',
                      borderRadius: '8px',
                      border: '1px solid #4d7a65',
                      background: '#1f4a3c',
                      color: '#d7ffef',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    Marcar revisada
                  </button>

                  <button
                    onClick={exportSimulationReport}
                    style={{
                      padding: '7px 11px',
                      borderRadius: '8px',
                      border: '1px solid #48678d',
                      background: '#1a3554',
                      color: '#d7ebff',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    Exportar informe JSON
                  </button>

                  {selectedUdCode === 'UD01' && (
                    <button
                      onClick={() => navigate('/sala-test-ud01')}
                      style={{
                        padding: '7px 11px',
                        borderRadius: '8px',
                        border: '1px solid #3f6f8f',
                        background: '#18384f',
                        color: '#b8ebff',
                        cursor: 'pointer',
                        fontSize: '11px',
                      }}
                    >
                      Abrir Sala Test UD01
                    </button>
                  )}

                  {selectedProgress.submittedAt && (
                    <span style={{ color: '#9de0ba', fontSize: '11px' }}>
                      Ultimo envio: {new Date(selectedProgress.submittedAt).toLocaleString()} · Nota auto: {selectedProgress.autoScore ?? '-'} · Estado: {selectedProgress.status || 'draft'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </>)}
      </div>
    </div>
  )
}

export default MiActividad
