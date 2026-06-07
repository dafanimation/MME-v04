const normalizeType = (value) => String(value || '').trim().toLowerCase()

const isRotationValid45 = (value) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return true
  const normalized = ((numeric % 360) + 360) % 360
  return normalized % 45 === 0
}

const getAllowedSurfacesByType = (type) => {
  if (type.includes('portatil') || type.includes('laptop')) {
    return ['mesa']
  }
  if (type.includes('pantalla') || type.includes('monitor')) {
    return ['mesa']
  }
  if (type.includes('pc')) {
    return ['mesa', 'estanteria']
  }
  if (type.includes('impressora') || type.includes('impresora') || type.includes('printer')) {
    return ['mesa', 'estanteria', 'armario']
  }
  return ['mesa', 'estanteria', 'armario']
}

export const evaluateSalaTestPlacement = ({ selectedResource, selectedRenderLocation, positionedResources = [] }) => {
  if (!selectedResource) {
    return { ok: false, issues: ['Selecciona un recurso para validar.'], warnings: [], freeMesaSlots: null }
  }

  const location = selectedRenderLocation || selectedResource.location || null
  if (!location || !Number.isFinite(Number(location.x)) || !Number.isFinite(Number(location.z))) {
    return { ok: false, issues: ['El recurso no tiene posicion de test valida.'], warnings: [], freeMesaSlots: null }
  }

  const normalizedType = normalizeType(selectedResource.type)
  const locationType = normalizeType(location.type || location.tipo || 'mesa')
  const placement = normalizeType(location.placement || 'surface')
  const issues = []
  const warnings = []

  const allowedSurfaces = getAllowedSurfacesByType(normalizedType)
  if (!allowedSurfaces.includes(locationType)) {
    issues.push(`Tipo de superficie no valida para ${selectedResource.type || 'recurso'} (${locationType || 'desconocida'}).`)
  }

  if ((normalizedType.includes('portatil') || normalizedType.includes('pantalla')) && placement !== 'surface') {
    issues.push('Portatil/Pantalla debe ir en superficie de mesa.')
  }

  const rotationY = Number(location.rotationY || 0)
  if (!isRotationValid45(rotationY)) {
    issues.push('La orientacion debe respetar pasos de 45 grados.')
  }

  const selectedX = Number(location.x)
  const selectedZ = Number(location.z)

  let nearestDistance = Number.POSITIVE_INFINITY
  let overlapCount = 0
  let mesaOccupancy = 0
  let mesaCapacity = null

  const selectedMesa = Number(location.mesaId || location.num)
  const hasMesa = Number.isFinite(selectedMesa) && selectedMesa > 0

  positionedResources.forEach((resource) => {
    if (!resource || resource.id === selectedResource.id) return
    const renderLocation = resource.renderLocation || resource.location
    if (!renderLocation) return
    const rx = Number(renderLocation.x)
    const rz = Number(renderLocation.z)
    if (!Number.isFinite(rx) || !Number.isFinite(rz)) return

    const dx = rx - selectedX
    const dz = rz - selectedZ
    const distance = Math.sqrt((dx * dx) + (dz * dz))
    nearestDistance = Math.min(nearestDistance, distance)

    if (distance < 0.12) {
      overlapCount += 1
    }

    if (hasMesa) {
      const resourceMesa = Number(renderLocation.mesaId || renderLocation.num)
      if (Number.isFinite(resourceMesa) && resourceMesa === selectedMesa) {
        mesaOccupancy += 1
      }
    }
  })

  if (overlapCount > 0) {
    issues.push('Hay solape con otro recurso en la posicion seleccionada.')
  }

  const minDistance = normalizedType.includes('portatil') ? 0.25 : 0.35
  if (Number.isFinite(nearestDistance) && nearestDistance < minDistance) {
    warnings.push(`Proximidad baja con otro recurso (${nearestDistance.toFixed(2)}).`)
  }

  if (hasMesa) {
    mesaCapacity = 8
    const freeMesaSlots = Math.max(0, mesaCapacity - mesaOccupancy)
    if (freeMesaSlots <= 0) {
      issues.push(`Mesa ${selectedMesa} sin slots libres para nuevos elementos.`)
    }

    return {
      ok: issues.length === 0,
      issues,
      warnings,
      freeMesaSlots,
      mesa: selectedMesa,
      occupancy: mesaOccupancy,
      capacity: mesaCapacity,
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    warnings,
    freeMesaSlots: null,
    mesa: null,
    occupancy: null,
    capacity: null,
  }
}
