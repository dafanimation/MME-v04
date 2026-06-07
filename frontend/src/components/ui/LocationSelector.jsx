import React, { useMemo } from 'react'

const RESOURCE_ANCHOR_BY_UI_ANCHOR = {
  center: 6,
  corner1: 0,
  corner2: 2,
  corner3: 3,
  corner4: 5,
}

const getEntityHash = (value) => {
  const text = String(value || '')
  let hash = 0
  for (let idx = 0; idx < text.length; idx += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(idx)
    hash |= 0
  }
  return Math.abs(hash)
}

export const getRenderAnchorIndex = (location, resourceSeed = '') => {
  if (!location || typeof location !== 'object') return null

  const direct = Number(location.renderAnchorIndex)
  if (Number.isFinite(direct)) return Math.abs(Math.round(direct)) % 8

  const byAnchor = RESOURCE_ANCHOR_BY_UI_ANCHOR[String(location.anchor || '').toLowerCase()]
  if (Number.isFinite(byAnchor)) return byAnchor

  if (location.mesaId || location.num) {
    return getEntityHash(resourceSeed || location.label || location.mesaId || location.num) % 8
  }

  return null
}

export const buildPersistedLocation = (location, resourceSeed = '') => {
  if (!location || typeof location !== 'object') return null

  if (!Number.isFinite(location.x) || !Number.isFinite(location.z)) return null

  const renderAnchorIndex = getRenderAnchorIndex(location, resourceSeed)

  return {
    type: location.type,
    tipo: location.type || location.tipo,
    x: Number(location.x),
    z: Number(location.z),
    label: location.label,
    mesaId: Number.isFinite(Number(location.mesaId)) ? Number(location.mesaId) : (Number.isFinite(Number(location.num)) ? Number(location.num) : undefined),
    num: Number.isFinite(Number(location.num)) ? Number(location.num) : (Number.isFinite(Number(location.mesaId)) ? Number(location.mesaId) : undefined),
    estId: location.estId,
    room: location.room,
    placement: location.placement,
    anchor: location.anchor,
    renderAnchorIndex,
  }
}

const MESAS = [
  { num: 1, x: -5, z: -3, label: 'Taula 1 - Zona A' },
  { num: 2, x: -1.5, z: -3, label: 'Taula 2 - Zona B' },
  { num: 3, x: 2, z: -3, label: 'Taula 3 - Zona C' },
  { num: 4, x: -5, z: 0, label: 'Taula 4 - Zona D' },
  { num: 5, x: -1.5, z: 0, label: 'Taula 5 - Zona E' },
  { num: 6, x: 2, z: 0, label: 'Taula 6 - Zona F' },
  { num: 7, x: -5, z: 3, label: 'Taula 7 - Zona G' },
  { num: 8, x: -1.5, z: 3, label: 'Taula 8 - Zona H' },
  { num: 9, x: 2, z: 3, label: 'Taula 9 - Zona I' },
]

const ESTANTERIAS = [
  { id: 'E1', x: -6, z: -4.5, label: 'Estanteria Nord - Fila 1', fila: 1 },
  { id: 'E2', x: -6, z: -3, label: 'Estanteria Nord - Fila 2', fila: 2 },
  { id: 'E3', x: -6, z: -1.5, label: 'Estanteria Nord - Fila 3', fila: 3 },
  { id: 'E4', x: -6, z: 0, label: 'Estanteria Nord - Fila 4', fila: 4 },
  { id: 'E5', x: -6, z: 1.5, label: 'Estanteria Nord - Fila 5', fila: 5 },
  { id: 'E6', x: -6, z: 3, label: 'Estanteria Nord - Fila 6', fila: 6 },
]

const SALAPRU_MESAS = [
  { num: 1, x: 0, z: 0, label: 'SALAPRU - Taula 1' },
]

const SALAPRU_STORAGE = [
  { id: 'PRU-E1', x: 0, z: -1.8, label: 'SALAPRU - Estanteria principal', fila: 1 },
]

const SALATEST_MESAS = [
  { num: 1, x: -1, z: -0.5, label: 'SALATEST - Taula 1' },
  { num: 2, x: 1, z: -0.5, label: 'SALATEST - Taula 2' },
  { num: 3, x: -1, z: 1, label: 'SALATEST - Taula 3' },
  { num: 4, x: 1, z: 1, label: 'SALATEST - Taula 4' },
]

const SALATEST_STORAGE = [
  { id: 'TEST-E1', x: -2.5, z: -1, label: 'SALATEST - Estanteria fija 1', fila: 1 },
  { id: 'TEST-A1', x: 2.5, z: -1, label: 'SALATEST - Armario fijo 1', fila: 1 },
]

const MESA_SURFACE_OFFSETS = [
  { key: 'center', label: 'Superficie - Centre', dx: 0, dz: 0 },
  { key: 'corner1', label: 'Superficie - Esquina 1', dx: -0.35, dz: -0.25 },
  { key: 'corner2', label: 'Superficie - Esquina 2', dx: 0.35, dz: -0.25 },
  { key: 'corner3', label: 'Superficie - Esquina 3', dx: -0.35, dz: 0.25 },
  { key: 'corner4', label: 'Superficie - Esquina 4', dx: 0.35, dz: 0.25 },
]

const MESA_INSIDE_OFFSETS = [
  { key: 'center', label: 'Dins mesa - Centre', dx: 0, dz: 0 },
  { key: 'corner1', label: 'Dins mesa - Esquina 1', dx: -0.2, dz: -0.15 },
  { key: 'corner2', label: 'Dins mesa - Esquina 2', dx: 0.2, dz: -0.15 },
  { key: 'corner3', label: 'Dins mesa - Esquina 3', dx: -0.2, dz: 0.15 },
  { key: 'corner4', label: 'Dins mesa - Esquina 4', dx: 0.2, dz: 0.15 },
]

const getRoomEntities = (room = 'AULA') => {
  const roomKey = String(room || 'AULA').toUpperCase()
  if (roomKey === 'SALAPRU') {
    return {
      mesas: SALAPRU_MESAS,
      estanterias: SALAPRU_STORAGE,
    }
  }
  if (roomKey === 'SALATEST') {
    return {
      mesas: SALATEST_MESAS,
      estanterias: SALATEST_STORAGE,
    }
  }
  return {
    mesas: MESAS,
    estanterias: ESTANTERIAS,
  }
}

export const getLocationOptions = (room = 'AULA') => {
  const entities = getRoomEntities(room)
  const mesaOptions = entities.mesas.flatMap((mesa) => {
    const options = []

    MESA_SURFACE_OFFSETS.forEach((offset) => {
      options.push({
        value: `mesa:${mesa.num}:surface:${offset.key}`,
        type: 'mesa',
        mesaId: mesa.num,
        room: String(room || 'AULA').toUpperCase(),
        placement: 'surface',
        anchor: offset.key,
        x: mesa.x + offset.dx,
        z: mesa.z + offset.dz,
        label: `${mesa.label} - ${offset.label}`,
      })
    })

    MESA_INSIDE_OFFSETS.forEach((offset) => {
      options.push({
        value: `mesa:${mesa.num}:inside:${offset.key}`,
        type: 'mesa',
        mesaId: mesa.num,
        room: String(room || 'AULA').toUpperCase(),
        placement: 'inside',
        anchor: offset.key,
        x: mesa.x + offset.dx,
        z: mesa.z + offset.dz,
        label: `${mesa.label} - ${offset.label}`,
      })
    })

    return options
  })

  const storageOptions = entities.estanterias.map((est) => ({
    value: `estanteria:${est.id}`,
    type: 'estanteria',
    estId: est.id,
    room: String(room || 'AULA').toUpperCase(),
    x: est.x,
    z: est.z,
    fila: est.fila,
    placement: 'surface',
    anchor: 'center',
    label: est.label,
  }))

  return {
    mesas: mesaOptions,
    estanterias: storageOptions,
    all: [...mesaOptions, ...storageOptions],
  }
}

const findNearestByCoords = (items, x, z) => {
  if (typeof x !== 'number' || typeof z !== 'number') return null

  return items.reduce((closest, item) => {
    const distance = Math.abs(item.x - x) + Math.abs(item.z - z)
    if (!closest || distance < closest.distance) {
      return { item, distance }
    }
    return closest
  }, null)?.item || null
}

export const normalizeLocation = (location) => {
  if (!location) return null

  if (location.type && (location.mesaId || location.estId)) {
    return location
  }

  const type = location.type || location.tipo

  const room = String(location.room || 'AULA').toUpperCase()
  const entities = getRoomEntities(room)

  if (type === 'mesa') {
    const mesaId = location.mesaId || location.num || location.value
    const mesa = mesaId ? entities.mesas.find((m) => m.num === parseInt(mesaId, 10)) : findNearestByCoords(entities.mesas, location.x, location.z)
    if (mesa) {
      return {
        type: 'mesa',
        value: `mesa:${mesa.num}`,
        label: location.label || mesa.label,
        x: typeof location.x === 'number' ? location.x : mesa.x,
        z: typeof location.z === 'number' ? location.z : mesa.z,
        mesaId: mesa.num,
        room,
        placement: location.placement || 'surface',
        anchor: location.anchor || 'center',
      }
    }
  }

  if (type === 'estanteria' || type === 'pared' || type === 'armari') {
    const legacyRow = location.estId || location.id || location.fila || location.prestatge
    const estId = typeof legacyRow === 'number' ? `E${legacyRow}` : legacyRow
    const estanteria = estId ? entities.estanterias.find((e) => e.id === estId) : findNearestByCoords(entities.estanterias, location.x, location.z)
    if (estanteria) {
      return {
        type: 'estanteria',
        value: `estanteria:${estanteria.id}`,
        label: location.label || estanteria.label,
        x: typeof location.x === 'number' ? location.x : estanteria.x,
        z: typeof location.z === 'number' ? location.z : estanteria.z,
        estId: estanteria.id,
        fila: estanteria.fila,
        room,
      }
    }
  }

  const mesaByCoords = findNearestByCoords(entities.mesas, location.x, location.z)
  if (mesaByCoords && Math.abs(mesaByCoords.x - location.x) <= 1 && Math.abs(mesaByCoords.z - location.z) <= 1) {
    return {
      type: 'mesa',
      value: `mesa:${mesaByCoords.num}`,
      label: location.label || mesaByCoords.label,
      x: location.x,
      z: location.z,
      mesaId: mesaByCoords.num,
      room,
      placement: location.placement || 'surface',
      anchor: location.anchor || 'center',
    }
  }

  const estanteriaByCoords = findNearestByCoords(entities.estanterias, location.x, location.z)
  if (estanteriaByCoords) {
    return {
      type: 'estanteria',
      value: `estanteria:${estanteriaByCoords.id}`,
      label: location.label || estanteriaByCoords.label,
      x: location.x,
      z: location.z,
      estId: estanteriaByCoords.id,
      fila: estanteriaByCoords.fila,
      room,
    }
  }

  return null
}

export const normalizeCurrentLocation = normalizeLocation

export const formatLocationLabel = (currentLocation) => {
  if (!currentLocation) return 'No assignada'

  const normalizedLocation = normalizeLocation(currentLocation)
  if (normalizedLocation?.label) {
    return normalizedLocation.label
  }

  if (currentLocation.label) {
    return currentLocation.label
  }

  const type = currentLocation.type || currentLocation.tipo
  if (type === 'mesa' && (currentLocation.mesaId || currentLocation.value)) {
    const placement = currentLocation.placement ? ` · ${currentLocation.placement}` : ''
    const anchor = currentLocation.anchor ? ` · ${currentLocation.anchor}` : ''
    const mesa = currentLocation.mesaId || currentLocation.value
    return `Taula ${mesa}${placement}${anchor}`
  }
  if (type === 'pared' && currentLocation.fila && currentLocation.posicio) {
    return `Paret F${currentLocation.fila} P${currentLocation.posicio}`
  }
  if (type === 'armari' && currentLocation.prestatge) {
    return `Armari P${currentLocation.prestatge}`
  }

  if (typeof currentLocation.x === 'number' && typeof currentLocation.z === 'number') {
    return `${type || 'ubicacio'} (${currentLocation.x}, ${currentLocation.z})`
  }

  return 'No assignada'
}

export const LocationSelector = ({ onSelect, currentLocation, disabled, room: roomProp = null }) => {
  const room = useMemo(() => {
    if (roomProp) return String(roomProp).toUpperCase()
    if (!currentLocation) return 'AULA'
    return String(currentLocation.room || 'AULA').toUpperCase()
  }, [currentLocation, roomProp])
  const locationOptions = useMemo(() => getLocationOptions(room), [room])
  const normalizedCurrent = useMemo(() => normalizeLocation(currentLocation), [currentLocation])
  const selectedValue = useMemo(() => {
    if (!normalizedCurrent) return ''
    const found = locationOptions.all.find((option) => {
      if (option.type !== normalizedCurrent.type) return false
      if (option.type === 'mesa') {
        return (
          option.mesaId === normalizedCurrent.mesaId &&
          option.placement === (normalizedCurrent.placement || 'surface') &&
          option.anchor === (normalizedCurrent.anchor || 'center')
        )
      }
      return option.estId === normalizedCurrent.estId
    })

    return found?.value || ''
  }, [normalizedCurrent, locationOptions])

  return (
    <div>
      <label style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px', display: 'block' }}>
        📍 Selecciona una ubicació ({room}):
      </label>
      <select
        value={selectedValue}
        onChange={(e) => {
          const value = e.target.value
          if (!value) return
          const selected = locationOptions.all.find((option) => option.value === value)
          if (selected && onSelect) {
            onSelect({
              type: selected.type,
              x: selected.x,
              z: selected.z,
              label: selected.label,
              mesaId: selected.mesaId,
              estId: selected.estId,
              fila: selected.fila,
              room: selected.room,
              placement: selected.placement,
              anchor: selected.anchor,
            })
          }
        }}
        disabled={disabled}
        style={{ width: '100%', padding: '6px', background: '#0f0f1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '11px' }}
      >
        <option value="">-- Selecciona --</option>
        <optgroup label="Taules">
          {locationOptions.mesas.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Estanteries">
          {locationOptions.estanterias.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </optgroup>
      </select>

      {(normalizedCurrent || currentLocation) && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#8dd6ff' }}>
          📍 Actual: {normalizedCurrent?.label || currentLocation.label || `${currentLocation.type || currentLocation.tipo} (${currentLocation.x}, ${currentLocation.z})`}
        </div>
      )}
    </div>
  )
}
