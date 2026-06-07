// ============================================================
// ARCHIVO: src/components/panels/AlumnoWorkflowPanel.jsx
// DESCRIPCIÓN: Panel de flujo de trabajo para alumnos
// RUTA RELATIVA: ../../services/auth (sube dos niveles)
// ============================================================

import React, { useEffect, useMemo, useState } from 'react'
// ✅ CORREGIDO: Ruta correcta a services/auth
import { getToken } from '../../services/auth'

const TASKS = [
  { id: 'resource-read', label: 'Leer datos del recurso asignado' },
  { id: 'drive-doc', label: 'Abrir y actualizar ficha en Drive' },
  { id: 'group-work', label: 'Registrar avance de trabajo en grupo' },
  { id: 'release-check', label: 'Revisar liberacion al cerrar sesion' },
]

const parseJwtPayload = (token) => {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return payload
  } catch {
    return null
  }
}

const formatExp = (expSeconds) => {
  if (!expSeconds || !Number.isFinite(expSeconds)) return 'No disponible'
  try {
    return new Date(expSeconds * 1000).toLocaleString()
  } catch {
    return 'No disponible'
  }
}

export const AlumnoWorkflowPanel = ({
  user,
  mode,
  onSelectMode,
  onSelectAvailable,
  onClearStatusFilter,
  onLocateResource,
  myResourcesCount,
  myAssignedResources = [],
  driveResourcesCount,
  availableResourcesCount,
  myMesa,
}) => {
  const tokenPayload = useMemo(() => parseJwtPayload(getToken()), [])
  const isTokenExpired = useMemo(() => {
    if (!tokenPayload?.exp) return false
    return tokenPayload.exp * 1000 <= Date.now()
  }, [tokenPayload])

  const storageKey = useMemo(() => {
    return `mme.student.tasks.${String(user?.email || 'anon')}`
  }, [user])

  const [tasksState, setTasksState] = useState({})

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          setTasksState(parsed)
          return
        }
      }
    } catch {
      // Ignore malformed data.
    }

    setTasksState({})
  }, [storageKey])

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(tasksState))
    } catch {
      // Ignore storage write errors.
    }
  }, [storageKey, tasksState])

  const completedCount = useMemo(() => {
    return TASKS.filter((t) => !!tasksState[t.id]).length
  }, [tasksState])

  return (
    <div style={{
      marginBottom: '16px',
      border: '1px solid rgba(0, 212, 255, 0.28)',
      borderRadius: '12px',
      background: 'rgba(12, 19, 35, 0.82)',
      padding: '12px',
      color: '#d9ecff',
      display: 'grid',
      gap: '10px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <strong style={{ color: '#7dd4ff' }}>Flujo alumno: recurso y proyecto</strong>
        <span style={{ fontSize: '11px', color: isTokenExpired ? '#ff8080' : '#8ee59d' }}>
          Token: {isTokenExpired ? 'caducado' : 'activo'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => onSelectMode('all')} style={{ padding: '6px 10px', background: mode === 'all' ? '#00d4ff' : '#1b2a42', border: '1px solid #35557f', borderRadius: '8px', color: mode === 'all' ? '#092032' : '#d9ecff', cursor: 'pointer', fontSize: '11px' }}>
          Todos ({myResourcesCount + availableResourcesCount})
        </button>
        <button onClick={() => onSelectMode('mine')} style={{ padding: '6px 10px', background: mode === 'mine' ? '#00d4ff' : '#1b2a42', border: '1px solid #35557f', borderRadius: '8px', color: mode === 'mine' ? '#092032' : '#d9ecff', cursor: 'pointer', fontSize: '11px' }}>
          Mis recursos ({myResourcesCount})
        </button>
        <button onClick={() => onSelectMode('drive')} style={{ padding: '6px 10px', background: mode === 'drive' ? '#00d4ff' : '#1b2a42', border: '1px solid #35557f', borderRadius: '8px', color: mode === 'drive' ? '#092032' : '#d9ecff', cursor: 'pointer', fontSize: '11px' }}>
          Con Drive ({driveResourcesCount})
        </button>
        <button onClick={onSelectAvailable} style={{ padding: '6px 10px', background: '#243a2f', border: '1px solid #3a6b55', borderRadius: '8px', color: '#bff5da', cursor: 'pointer', fontSize: '11px' }}>
          Disponibles ({availableResourcesCount})
        </button>
        <button onClick={onClearStatusFilter} style={{ padding: '6px 10px', background: '#38263a', border: '1px solid #694472', borderRadius: '8px', color: '#f1d8ff', cursor: 'pointer', fontSize: '11px' }}>
          Limpiar estado
        </button>
      </div>

      <div style={{ display: 'grid', gap: '6px', fontSize: '11px', color: '#a8c2dd' }}>
        <div>Mesa objetivo: <strong style={{ color: '#e1f1ff' }}>{myMesa || 'Sin mesa detectada'}</strong></div>
        <div>Token expira: <strong style={{ color: '#e1f1ff' }}>{formatExp(tokenPayload?.exp)}</strong></div>
        <div>Tareas del proyecto completadas: <strong style={{ color: '#e1f1ff' }}>{completedCount}/{TASKS.length}</strong></div>
      </div>

      <div style={{ display: 'grid', gap: '6px', borderTop: '1px solid rgba(125, 212, 255, 0.16)', paddingTop: '8px' }}>
        <div style={{ fontSize: '11px', color: '#8cc7ea' }}>
          Recursos asignados: <strong style={{ color: '#e1f1ff' }}>{myAssignedResources.length}</strong>
        </div>

        {myAssignedResources.length === 0 && (
          <div style={{ fontSize: '11px', color: '#7f9bb5' }}>
            No hay recursos asignados para localizar.
          </div>
        )}

        {myAssignedResources.map((resource) => (
          <div key={`workflow-locate-${resource.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: '#d8ecff', minWidth: '130px' }}>
              {resource.code || `ID-${resource.id}`}
            </span>
            <button
              onClick={() => onLocateResource && onLocateResource(resource.code, resource.location || null)}
              style={{
                padding: '5px 9px',
                background: '#17334a',
                border: '1px solid #3c6b8f',
                borderRadius: '8px',
                color: '#b8e8ff',
                cursor: 'pointer',
                fontSize: '10px',
              }}
              title="Obrir i centrar al mapa 3D"
            >
              Localitzar al mapa
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '4px' }}>
        {TASKS.map((task) => (
          <label key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={!!tasksState[task.id]}
              onChange={(e) => {
                setTasksState((prev) => ({ ...prev, [task.id]: e.target.checked }))
              }}
            />
            {task.label}
          </label>
        ))}
      </div>
    </div>
  )
}