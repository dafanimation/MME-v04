// ============================================================
// ARCHIVO: src/components/menus/MenuInventarioArmario.jsx
// DESCRIPCIÓN: Menú flotante para gestionar inventario del armario
// PERMISOS: Solo Admin Master puede editar contenido
// VERSIÓN: 3.0 - Corregida
// FECHA: 2026-06-06
// ============================================================

import React, { useState, useRef, useEffect } from 'react'

// ============================================
// TIPOS DE RECURSOS DISPONIBLES
// ============================================
const TIPOS_RECURSOS = [
  { value: 'PC', label: '🖥️ PC', color: '#00ff88' },
  { value: 'Laptop', label: '💻 Portátil', color: '#a855f7' },
  { value: 'Portatil', label: '💻 Portátil', color: '#a855f7' },
  { value: 'Pantalla', label: '🖵 Pantalla', color: '#2d8cff' },
  { value: 'Monitor', label: '🖵 Monitor', color: '#2d8cff' },
  { value: 'Impresora', label: '🖨️ Impresora', color: '#9ba3ad' },
  { value: 'HDD', label: '💾 Disco Duro', color: '#ff4444' },
  { value: 'Proyector', label: '📽️ Proyector', color: '#ffaa44' },
  { value: 'Tablet', label: '📱 Tablet', color: '#44ffaa' },
  { value: 'Herramienta', label: '🔧 Caja herramientas', color: '#d4a056' },
]

export const MenuInventarioArmario = ({
  armario,
  baldas,
  onUpdateBalda,
  onAsignarRecurso,
  onRetirarRecurso,
  currentUser,
  position = { x: 100, y: 100 },
  onClose,
}) => {
  const [selectedBalda, setSelectedBalda] = useState(null)
  const [selectedRecurso, setSelectedRecurso] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [menuPosition, setMenuPosition] = useState(position)
  const [expandedBalda, setExpandedBalda] = useState(null)
  const [consumibles, setConsumibles] = useState([])
  const [nuevoConsumible, setNuevoConsumible] = useState('')
  const [nuevaCantidad, setNuevaCantidad] = useState(1)
  const [mensaje, setMensaje] = useState('')
  const [tipoRecursoSeleccionado, setTipoRecursoSeleccionado] = useState('PC')
  const dragOffset = useRef({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState('recursos')

  const userIsAdmin = currentUser?.role === 'admin' || currentUser?.role === 'admin_master'
  const puedeEditar = userIsAdmin

  // Cargar consumibles desde localStorage
  useEffect(() => {
    const savedConsumibles = localStorage.getItem(`armario_${armario.id}_consumibles`)
    if (savedConsumibles) {
      setConsumibles(JSON.parse(savedConsumibles))
    } else {
      setConsumibles([
        { id: 1, nombre: 'Alcohol isopropílico', cantidad: 5, balda: 1 },
        { id: 2, nombre: 'Desengrasante', cantidad: 3, balda: 1 },
        { id: 3, nombre: 'Estaño soldador', cantidad: 10, balda: 2 },
        { id: 4, nombre: 'Flux', cantidad: 2, balda: 2 },
        { id: 5, nombre: 'Pasta térmica', cantidad: 8, balda: 3 },
      ])
    }
  }, [armario.id])

  // Guardar consumibles
  const guardarConsumibles = (nuevosConsumibles) => {
    setConsumibles(nuevosConsumibles)
    localStorage.setItem(`armario_${armario.id}_consumibles`, JSON.stringify(nuevosConsumibles))
    mostrarMensaje('✅ Consumibles actualizados', 'success')
  }

  // Añadir consumible
  const handleAgregarConsumible = () => {
    if (!puedeEditar) return
    if (!nuevoConsumible.trim()) {
      mostrarMensaje('❌ Introduce un nombre', 'error')
      return
    }

    const nuevo = {
      id: Date.now(),
      nombre: nuevoConsumible.trim(),
      cantidad: nuevaCantidad,
      balda: 1,
    }

    guardarConsumibles([...consumibles, nuevo])
    setNuevoConsumible('')
    setNuevaCantidad(1)
    mostrarMensaje(`✅ Añadido: ${nuevo.nombre}`, 'success')
  }

  // Actualizar cantidad de consumible
  const handleUpdateCantidad = (id, nuevaCantidad) => {
    if (!puedeEditar) return
    const nuevosConsumibles = consumibles.map(c =>
      c.id === id ? { ...c, cantidad: Math.max(0, nuevaCantidad) } : c
    )
    guardarConsumibles(nuevosConsumibles)
  }

  // Eliminar consumible
  const handleEliminarConsumible = (id) => {
    if (!puedeEditar) return
    if (confirm('¿Eliminar este consumible?')) {
      guardarConsumibles(consumibles.filter(c => c.id !== id))
      mostrarMensaje('✅ Consumible eliminado', 'success')
    }
  }

  // Añadir recurso a balda (con selector de tipo)
  const handleAsignarRecursoConTipo = (baldaId) => {
    if (!puedeEditar) {
      mostrarMensaje('🔒 Solo Admin Master puede modificar', 'error')
      return
    }

    const tipoSeleccionado = TIPOS_RECURSOS.find(t => t.value === tipoRecursoSeleccionado)
    if (!tipoSeleccionado) return

    const nuevasBaldas = [...baldas]
    const balda = nuevasBaldas[baldaId]

    if (balda.recursos.length >= balda.capacidad) {
      mostrarMensaje(`📦 Balda llena (capacidad ${balda.capacidad})`, 'error')
      return
    }

    balda.recursos.push({
      id: Date.now(),
      code: `${tipoSeleccionado.value}-${balda.recursos.length + 1}`,
      nombre: `${tipoSeleccionado.label} ${balda.recursos.length + 1}`,
      tipo: tipoSeleccionado.value,
      asignadoA: null,
    })

    onUpdateBalda(nuevasBaldas)
    mostrarMensaje(`✅ Añadido ${tipoSeleccionado.label} a ${balda.nombre}`, 'success')
  }

  // Mostrar mensaje
  const mostrarMensaje = (texto, tipo = 'info') => {
    setMensaje(texto)
    setTimeout(() => setMensaje(''), 2000)
  }

  // Manejo de arrastre
  const handleMouseDown = (e) => {
    if (e.target.closest('.menu-header')) {
      setIsDragging(true)
      dragOffset.current = { x: e.clientX - menuPosition.x, y: e.clientY - menuPosition.y }
    }
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setMenuPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y })
      }
    }
    const handleMouseUp = () => setIsDragging(false)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  if (!armario) return null

  const totalRecursos = baldas?.reduce((acc, b) => acc + (b.recursos?.length || 0), 0) || 0
  const capacidadTotal = baldas?.reduce((acc, b) => acc + (b.capacidad || 0), 0) || 0
  const porcentajeOcupacion = capacidadTotal > 0 ? Math.round((totalRecursos / capacidadTotal) * 100) : 0

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
        zIndex: 10000,
        background: '#0a0a1a',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid #00d4ff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        width: '420px',
        maxHeight: '85vh',
        overflowY: 'auto',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {/* Cabecera */}
      <div className="menu-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(0,212,255,0.3)', cursor: 'grab', background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.05))', borderRadius: '16px 16px 0 0' }}>
        <div>
          <span style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 'bold' }}>🗄️ {armario.label || `Armario ${armario.num}`}</span>
          <div style={{ fontSize: '10px', color: '#6fa8c8' }}>{puedeEditar ? '🔓 Edición activa' : '🔒 Solo lectura'}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ff6666', cursor: 'pointer', fontSize: '18px' }}>✕</button>
      </div>

      {mensaje && (
        <div style={{ position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)', background: mensaje.includes('✅') ? 'rgba(0,255,136,0.2)' : 'rgba(255,68,68,0.2)', border: `1px solid ${mensaje.includes('✅') ? '#00ff88' : '#ff4444'}`, color: mensaje.includes('✅') ? '#00ff88' : '#ff8888', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', zIndex: 100, whiteSpace: 'nowrap' }}>
          {mensaje}
        </div>
      )}

      <div style={{ padding: '16px' }}>
        {/* Pestañas */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid rgba(0,212,255,0.2)' }}>
          <button onClick={() => setActiveTab('recursos')} style={{ padding: '8px 16px', border: 'none', background: activeTab === 'recursos' ? 'rgba(0,212,255,0.15)' : 'transparent', borderBottom: activeTab === 'recursos' ? '2px solid #00d4ff' : '2px solid transparent', color: activeTab === 'recursos' ? '#00d4ff' : '#aaa', cursor: 'pointer', fontSize: '12px' }}>
            📦 Recursos ({totalRecursos}/{capacidadTotal})
          </button>
          <button onClick={() => setActiveTab('consumibles')} style={{ padding: '8px 16px', border: 'none', background: activeTab === 'consumibles' ? 'rgba(0,212,255,0.15)' : 'transparent', borderBottom: activeTab === 'consumibles' ? '2px solid #00d4ff' : '2px solid transparent', color: activeTab === 'consumibles' ? '#00d4ff' : '#aaa', cursor: 'pointer', fontSize: '12px' }}>
            🧪 Consumibles ({consumibles.length})
          </button>
        </div>

        {/* Pestaña Recursos */}
        {activeTab === 'recursos' && (
          <>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '10px', marginBottom: '16px', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>📦 Ocupación</span>
                <span style={{ fontSize: '11px', color: porcentajeOcupacion >= 90 ? '#ff4444' : (porcentajeOcupacion >= 70 ? '#ffaa44' : '#00ff88') }}>{porcentajeOcupacion}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${porcentajeOcupacion}%`, height: '100%', background: porcentajeOcupacion >= 90 ? '#ff4444' : (porcentajeOcupacion >= 70 ? '#ffaa44' : '#00ff88') }} />
              </div>
            </div>

            {/* Selector de tipo de recurso */}
            {puedeEditar && (
              <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <select value={tipoRecursoSeleccionado} onChange={(e) => setTipoRecursoSeleccionado(e.target.value)} style={{ flex: 2, padding: '8px', background: '#0f0f1a', border: '1px solid #00d4ff', borderRadius: '6px', color: '#fff', fontSize: '11px' }}>
                  {TIPOS_RECURSOS.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Baldas */}
            {baldas?.map((balda, idx) => (
              <div key={idx} style={{ marginBottom: '8px', border: `1px solid ${expandedBalda === idx ? '#00d4ff' : 'rgba(0,212,255,0.2)'}`, borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: expandedBalda === idx ? 'rgba(0,212,255,0.1)' : 'rgba(0,0,0,0.3)', cursor: 'pointer' }} onClick={() => setExpandedBalda(expandedBalda === idx ? null : idx)}>
                  <div><span style={{ fontSize: '12px', color: '#d8eaff' }}>{balda.nombre}</span><span style={{ fontSize: '9px', color: '#6fa8c8', marginLeft: '8px' }}>Nivel {balda.nivel}</span></div>
                  <div><span style={{ fontSize: '10px', color: '#6fa8c8' }}>{balda.recursos?.length || 0}/{balda.capacidad || 8}</span><span style={{ fontSize: '12px', color: '#7dd4ff', marginLeft: '8px' }}>{expandedBalda === idx ? '▲' : '▼'}</span></div>
                </div>

                {expandedBalda === idx && (
                  <div style={{ padding: '10px', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
                    {balda.recursos?.length === 0 ? (
                      <div style={{ fontSize: '11px', color: '#6fa8c8', textAlign: 'center', padding: '16px' }}>🧹 Sin elementos</div>
                    ) : (
                      balda.recursos.map((recurso, ridx) => (
                        <div key={recurso.id || ridx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', margin: '4px 0', background: selectedRecurso === recurso.id ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => setSelectedRecurso(selectedRecurso === recurso.id ? null : recurso.id)}>
                          <div><span style={{ fontSize: '11px', color: '#d8eaff' }}>{recurso.nombre || recurso.code}</span><span style={{ fontSize: '9px', color: '#6fa8c8', marginLeft: '8px' }}>{recurso.tipo || 'Recurso'}</span></div>
                          <span style={{ fontSize: '10px', color: recurso.asignadoA ? '#ffaa44' : '#88ff88' }}>{recurso.asignadoA ? `👤 ${recurso.asignadoA}` : '✅ Disponible'}</span>
                        </div>
                      ))
                    )}

                    {puedeEditar && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
                        <button style={{ flex: 1, background: 'rgba(0,212,255,0.15)', border: '1px solid #00d4ff', borderRadius: '6px', color: '#00d4ff', padding: '6px', cursor: 'pointer', fontSize: '10px' }} onClick={() => handleAsignarRecursoConTipo(idx)}>📦 Añadir {TIPOS_RECURSOS.find(t => t.value === tipoRecursoSeleccionado)?.label || 'recurso'}</button>
                        <button style={{ flex: 1, background: 'rgba(0,212,255,0.15)', border: '1px solid #00d4ff', borderRadius: '6px', color: '#00d4ff', padding: '6px', cursor: 'pointer', fontSize: '10px', opacity: selectedRecurso ? 1 : 0.5 }} onClick={() => onRetirarRecurso?.(idx, selectedRecurso)} disabled={!selectedRecurso}>📤 Retirar</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Pestaña Consumibles */}
        {activeTab === 'consumibles' && (
          <>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '10px', marginBottom: '16px', border: '1px solid rgba(0,212,255,0.2)' }}>
              <span style={{ fontSize: '11px', color: '#aaa' }}>🧪 Total consumibles: {consumibles.length}</span>
              {consumibles.filter(c => c.cantidad <= 1).length > 0 && <div style={{ fontSize: '10px', color: '#ffaa44', marginTop: '5px' }}>⚠️ {consumibles.filter(c => c.cantidad <= 1).length} consumible(s) con stock bajo</div>}
            </div>

            {consumibles.map(consumible => (
              <div key={consumible.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', margin: '4px 0', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: `3px solid ${consumible.cantidad <= 1 ? '#ffaa44' : '#00d4ff'}` }}>
                <span style={{ fontSize: '11px', color: '#d8eaff' }}>{consumible.nombre}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {puedeEditar ? (
                    <>
                      <button style={{ width: '26px', height: '26px', background: 'rgba(0,212,255,0.2)', border: '1px solid #00d4ff', borderRadius: '4px', color: '#00d4ff', cursor: 'pointer' }} onClick={() => handleUpdateCantidad(consumible.id, consumible.cantidad - 1)}>-</button>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>{consumible.cantidad}</span>
                      <button style={{ width: '26px', height: '26px', background: 'rgba(0,212,255,0.2)', border: '1px solid #00d4ff', borderRadius: '4px', color: '#00d4ff', cursor: 'pointer' }} onClick={() => handleUpdateCantidad(consumible.id, consumible.cantidad + 1)}>+</button>
                      <button style={{ width: '26px', height: '26px', background: 'rgba(255,68,68,0.15)', border: '1px solid #ff4444', borderRadius: '4px', color: '#ff4444', cursor: 'pointer' }} onClick={() => handleEliminarConsumible(consumible.id)}>🗑️</button>
                    </>
                  ) : (
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{consumible.cantidad}</span>
                  )}
                </div>
              </div>
            ))}

            {puedeEditar && (
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(0,212,255,0.2)' }}>
                <strong style={{ color: '#7dd4ff', fontSize: '11px' }}>➕ Añadir consumible</strong>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input type="text" value={nuevoConsumible} onChange={(e) => setNuevoConsumible(e.target.value)} placeholder="Nombre" style={{ flex: 2, padding: '8px', background: '#0f0f1a', border: '1px solid #00d4ff', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
                  <input type="number" value={nuevaCantidad} onChange={(e) => setNuevaCantidad(parseInt(e.target.value) || 1)} min="1" style={{ width: '70px', padding: '8px', background: '#0f0f1a', border: '1px solid #00d4ff', borderRadius: '6px', color: '#fff', fontSize: '11px', textAlign: 'center' }} />
                  <button onClick={handleAgregarConsumible} style={{ background: 'linear-gradient(135deg, #00d4ff, #0099bb)', border: 'none', borderRadius: '6px', color: '#1a1a2e', padding: '8px 12px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>➕ Añadir</button>
                </div>
              </div>
            )}
          </>
        )}

        {!puedeEditar && <div style={{ marginTop: '16px', fontSize: '10px', color: '#ffaa44', textAlign: 'center', padding: '8px', background: 'rgba(255,170,0,0.1)', borderRadius: '8px' }}>🔒 Solo Admin Master puede modificar recursos y consumibles</div>}
      </div>
    </div>
  )
}

export default MenuInventarioArmario