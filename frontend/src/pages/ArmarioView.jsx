// ============================================================
// ARCHIVO: src/pages/ArmarioView.jsx
// DESCRIPCIÓN: Sala 3D dedicada a un armario específico
// RUTA: /armario/:id
// PERMISOS: Admin Master para edición, otros solo visualización
// VERSIÓN: 3.0 - Con configuración dinámica y apilamiento
// FECHA: 2026-06-06
// ============================================================
//
// FUNCIONALIDADES:
// 1. Visualización 3D del armario seleccionado
// 2. Botón "Abrir Inventario" en header
// 3. Gestión de inventario por baldas (solo Admin Master)
// 4. Asignación/retirada de recursos
// 5. Estado de carga para armario de portátiles
// 6. Persistencia de inventario en localStorage
// 7. Menú flotante centrado y arrastrable
// 8. Configuración dinámica (capacidad por nivel, altura apilamiento)
// 9. Apilamiento vertical de recursos
// 10. Click derecho en armario → abrir configuración (solo admin)
//
// ============================================================

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { getUser, isAdmin } from '../services/auth'
import MenuAdmin from '../components/menus/MenuAdmin'
import { Armario3D } from '../components/3d/entities/Armario3D'
import { ArmarioPortatiles3D } from '../components/3d/entities/ArmarioPortatiles3D'
import { MenuInventarioArmario } from '../components/menus/MenuInventarioArmario'
import '../styles/Dashboard.css'

// ============================================
// CONFIGURACIÓN DE ARMARIOS
// ============================================
const ARMARIOS_CONFIG = {
  1: { 
    tipo: 'principal', 
    label: 'Armario N1', 
    posicion: { x: 0, z: 0 }, 
    niveles: 6, 
    capacidadBalda: 8,
    color: '#3a7abf'
  },
  2: { 
    tipo: 'principal', 
    label: 'Armario N2', 
    posicion: { x: 0, z: 0 }, 
    niveles: 6, 
    capacidadBalda: 8,
    color: '#3a7abf'
  },
  3: { 
    tipo: 'principal', 
    label: 'Armario N3', 
    posicion: { x: 0, z: 0 }, 
    niveles: 6, 
    capacidadBalda: 8,
    color: '#3a7abf'
  },
  4: { 
    tipo: 'principal', 
    label: 'Armario S1', 
    posicion: { x: 0, z: 0 }, 
    niveles: 6, 
    capacidadBalda: 8,
    color: '#3a7abf'
  },
  5: { 
    tipo: 'principal', 
    label: 'Armario S2', 
    posicion: { x: 0, z: 0 }, 
    niveles: 6, 
    capacidadBalda: 8,
    color: '#3a7abf'
  },
  6: { 
    tipo: 'principal', 
    label: 'Armario S3', 
    posicion: { x: 0, z: 0 }, 
    niveles: 6, 
    capacidadBalda: 8,
    color: '#3a7abf'
  },
  7: { 
    tipo: 'portatiles', 
    label: 'Armario Portátiles (carga)', 
    posicion: { x: 0, z: 0 }, 
    capacidad: 10,
    color: '#5a7a9f'
  },
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const ArmarioView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getUser()
  const userIsAdmin = isAdmin()
  const armarioId = parseInt(id)
  
  const [armario, setArmario] = useState(null)
  const [baldas, setBaldas] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 100, y: 100 })
  const [loading, setLoading] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [recursosDisponibles, setRecursosDisponibles] = useState([])
  const [consumibles, setConsumibles] = useState([])
  
  // Configuración dinámica del armario
  const [capacidadPorNivel, setCapacidadPorNivel] = useState([8, 8, 8, 8])
  const [alturaApilamiento, setAlturaApilamiento] = useState(0.08)

  // Cargar configuración del armario
  useEffect(() => {
    const config = ARMARIOS_CONFIG[armarioId]
    if (!config) {
      navigate('/dashboard')
      return
    }
    
    setArmario({
      id: armarioId,
      num: armarioId,
      label: config.label,
      tipo: config.tipo,
      niveles: config.niveles || 4,
      capacidadTotal: config.tipo === 'principal' ? 32 : 10,
      position: config.posicion,
      color: config.color,
    })
    
    // Cargar inventario (desde localStorage)
    cargarInventario(armarioId, config)
    
    // Cargar recursos disponibles desde API
    cargarRecursosDisponibles()
    
    // Cargar consumibles desde localStorage
    cargarConsumibles(armarioId)
    
    // Cargar configuración guardada
    cargarConfiguracion(armarioId)
    
    setLoading(false)
  }, [armarioId, navigate])

  // Cargar configuración guardada
  const cargarConfiguracion = (id) => {
    const savedConfig = localStorage.getItem(`armario_${id}_config`)
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        if (config.capacidadPorNivel) setCapacidadPorNivel(config.capacidadPorNivel)
        if (config.alturaApilamiento) setAlturaApilamiento(config.alturaApilamiento)
      } catch (e) {
        console.error('Error cargando configuración:', e)
      }
    }
  }

  // Guardar configuración
  const guardarConfiguracion = (nuevaConfig) => {
    if (nuevaConfig.capacidadPorNivel) setCapacidadPorNivel(nuevaConfig.capacidadPorNivel)
    if (nuevaConfig.alturaApilamiento) setAlturaApilamiento(nuevaConfig.alturaApilamiento)
    localStorage.setItem(`armario_${armarioId}_config`, JSON.stringify(nuevaConfig))
    mostrarMensaje('✅ Configuración guardada', 'success')
  }

  // Cargar consumibles
  const cargarConsumibles = (id) => {
    const savedConsumibles = localStorage.getItem(`armario_${id}_consumibles`)
    if (savedConsumibles) {
      setConsumibles(JSON.parse(savedConsumibles))
    } else {
      const initialConsumibles = [
        { id: 1, nombre: 'Alcohol isopropílico', cantidad: 5, balda: 0 },
        { id: 2, nombre: 'Desengrasante', cantidad: 3, balda: 0 },
        { id: 3, nombre: 'Estaño soldador', cantidad: 10, balda: 1 },
        { id: 4, nombre: 'Flux', cantidad: 2, balda: 1 },
        { id: 5, nombre: 'Pasta térmica', cantidad: 8, balda: 2 },
      ]
      setConsumibles(initialConsumibles)
      localStorage.setItem(`armario_${id}_consumibles`, JSON.stringify(initialConsumibles))
    }
  }

  // Cargar inventario del armario
  const cargarInventario = (id, config) => {
    const savedInventory = localStorage.getItem(`armario_${id}_inventory`)
    if (savedInventory) {
      setBaldas(JSON.parse(savedInventory))
    } else {
      const initialBaldas = []
      const numBaldas = config.tipo === 'principal' ? (config.niveles || 4) : 1
      
      for (let i = 0; i < numBaldas; i++) {
        initialBaldas.push({
          id: i,
          nivel: i + 1,
          nombre: config.tipo === 'portatiles' ? 'Cargadores' : `Balda ${i + 1}`,
          capacidad: config.capacidadBalda || 8,
          recursos: [],
        })
      }
      setBaldas(initialBaldas)
    }
  }

  // Cargar recursos disponibles desde la API
  const cargarRecursosDisponibles = async () => {
    try {
      const { api } = await import('../services/api')
      const data = await api.getResources({ status: 'available', limit: 100 })
      if (data) {
        const recursos = Array.isArray(data) ? data : data.data || []
        setRecursosDisponibles(recursos)
      }
    } catch (error) {
      console.error('Error cargando recursos:', error)
      setRecursosDisponibles([
        { id: 1, code: 'PC-001', name: 'PC Principal', type: 'PC' },
        { id: 2, code: 'LAP-001', name: 'Portátil Dell', type: 'Laptop' },
        { id: 3, code: 'SCR-001', name: 'Pantalla 24"', type: 'Pantalla' },
        { id: 4, code: 'PRN-001', name: 'Impresora Laser', type: 'Impresora' },
        { id: 5, code: 'HDD-001', name: 'Disco SSD 1TB', type: 'HDD' },
      ])
    }
  }

  // Guardar inventario en localStorage
  const guardarInventario = (nuevasBaldas) => {
    setBaldas(nuevasBaldas)
    localStorage.setItem(`armario_${armarioId}_inventory`, JSON.stringify(nuevasBaldas))
    mostrarMensaje('✅ Inventario guardado correctamente', 'success')
  }

  // Añadir recurso a una balda
  const handleAsignarRecurso = (baldaId) => {
    if (!userIsAdmin) {
      mostrarMensaje('🔒 Solo Admin Master puede modificar el inventario', 'error')
      return
    }

    const recursoSeleccionado = recursosDisponibles[0]
    if (!recursoSeleccionado) {
      mostrarMensaje('❌ No hay recursos disponibles', 'error')
      return
    }

    const nuevasBaldas = [...baldas]
    const balda = nuevasBaldas[baldaId]
    
    if (balda.recursos.length >= capacidadPorNivel[baldaId]) {
      mostrarMensaje(`📦 Balda llena (capacidad ${capacidadPorNivel[baldaId]} elementos)`, 'error')
      return
    }
    
    balda.recursos.push({
      id: Date.now(),
      code: recursoSeleccionado.code,
      nombre: recursoSeleccionado.name,
      tipo: recursoSeleccionado.type,
      asignadoA: null,
      fechaAsignacion: null,
    })
    
    guardarInventario(nuevasBaldas)
    mostrarMensaje(`✅ Recurso ${recursoSeleccionado.code} añadido a ${balda.nombre}`, 'success')
  }

  // Retirar recurso de una balda
  const handleRetirarRecurso = (baldaId, recursoId) => {
    if (!userIsAdmin) {
      mostrarMensaje('🔒 Solo Admin Master puede modificar el inventario', 'error')
      return
    }

    if (!recursoId) {
      mostrarMensaje('❌ Selecciona un recurso para retirar', 'error')
      return
    }

    const nuevasBaldas = [...baldas]
    const balda = nuevasBaldas[baldaId]
    const recursoIndex = balda.recursos.findIndex(r => r.id === recursoId)
    
    if (recursoIndex === -1) {
      mostrarMensaje('❌ Recurso no encontrado en esta balda', 'error')
      return
    }
    
    const recurso = balda.recursos[recursoIndex]
    balda.recursos.splice(recursoIndex, 1)
    
    guardarInventario(nuevasBaldas)
    mostrarMensaje(`✅ Recurso ${recurso.code} retirado de ${balda.nombre}`, 'success')
  }

  // Mostrar mensaje temporal
  const mostrarMensaje = (texto, tipo = 'info') => {
    setMensaje(texto)
    setTimeout(() => setMensaje(''), 3000)
  }

  // Abrir inventario (centrado en pantalla)
  const abrirInventario = () => {
    setShowMenu(true)
    setMenuPosition({ 
      x: Math.max(100, (window.innerWidth - 420) / 2), 
      y: Math.max(50, (window.innerHeight - 500) / 2)
    })
  }

  // Cerrar inventario
  const cerrarInventario = () => {
    setShowMenu(false)
  }

  // Manejar clic en el armario (alternativa)
  const handleArmarioClick = (event) => {
    event.stopPropagation()
    abrirInventario()
  }

  if (loading) {
    return (
      <div>
        <MenuAdmin />
        <div className="loading" style={{ textAlign: 'center', padding: '50px' }}>
          ⏳ Cargando armario...
        </div>
      </div>
    )
  }

  return (
    <div>
      <MenuAdmin />
      
      {/* Header de la página */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 20px', 
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2a 100%)',
        borderBottom: '1px solid rgba(0,212,255,0.3)'
      }}>
        <div>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{
              background: 'rgba(0,212,255,0.15)',
              border: '1px solid #00d4ff',
              borderRadius: '6px',
              color: '#00d4ff',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              marginBottom: '10px'
            }}
          >
            ← Volver al Dashboard
          </button>
          <h2 style={{ color: '#00d4ff', margin: '5px 0 0 0' }}>
            🗄️ {armario?.label}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '5px' }}>
            {userIsAdmin ? '🔓 Modo edición (Admin Master)' : '🔒 Modo consulta'}
          </p>
        </div>
        
        {/* Botón para abrir inventario */}
        <div style={{ textAlign: 'right' }}>
          <button 
            onClick={abrirInventario}
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
              border: 'none',
              borderRadius: '8px',
              color: '#1a1a2e',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 'bold',
              marginBottom: '8px',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            📦 Abrir Inventario
          </button>
          <div style={{ fontSize: '12px', color: '#aaa' }}>
            📦 Capacidad total: {capacidadPorNivel.reduce((a,b) => a + b, 0)} elementos
          </div>
          <div style={{ fontSize: '11px', color: userIsAdmin ? '#00ff88' : '#ffaa44', marginTop: '5px' }}>
            {userIsAdmin ? '✅ Permisos completos' : '👁️ Solo visualización'}
          </div>
          {userIsAdmin && (
            <div style={{ fontSize: '10px', color: '#ffaa44', marginTop: '4px' }}>
              💡 Click derecho en el armario 3D → Configuración
            </div>
          )}
        </div>
      </div>

      {/* Mensaje flotante */}
      {mensaje && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: mensaje.includes('✅') ? 'rgba(0,255,136,0.2)' : 'rgba(255,68,68,0.2)',
          border: `1px solid ${mensaje.includes('✅') ? '#00ff88' : '#ff4444'}`,
          color: mensaje.includes('✅') ? '#00ff88' : '#ff8888',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          {mensaje}
        </div>
      )}

      {/* Mapa 3D */}
      <div className="mapa-3d-container" style={{ height: 'calc(100vh - 160px)' }}>
        <Canvas camera={{ position: [3, 2, 3], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 8, 5]} intensity={0.8} />
          <directionalLight position={[3, 5, 2]} intensity={0.5} />
          
          {/* Suelo de referencia */}
          <gridHelper args={[6, 20, '#2a3a5a', '#1a2a3a']} position={[0, -0.9, 0]} />
          
          {armario?.tipo === 'portatiles' ? (
            <ArmarioPortatiles3D
              armario={armario}
              position={armario.position}
              isSelected={showMenu}
              onClick={handleArmarioClick}
              portatiles={baldas[0]?.recursos || []}
            />
          ) : (
            <Armario3D
              armario={armario}
              position={armario.position}
              isSelected={showMenu}
              onClick={handleArmarioClick}
              currentUser={user}
              baldas={baldas}
              consumibles={consumibles}
              editable={userIsAdmin}
              capacidadPorNivel={capacidadPorNivel}
              alturaApilamiento={alturaApilamiento}
              onConfigChange={guardarConfiguracion}
              onRecursoClick={(recurso, armarioNum, baldaId, event) => {
                console.log('Recurso clickeado:', recurso)
                mostrarMensaje(`📦 Recurso: ${recurso.nombre || recurso.code}`, 'info')
              }}
              onConsumibleClick={(consumible, armarioNum, baldaId, event) => {
                console.log('Consumible clickeado:', consumible)
                mostrarMensaje(`🧪 Consumible: ${consumible.nombre} (${consumible.cantidad} uds)`, 'info')
              }}
            />
          )}
          
          <OrbitControls 
            enableZoom 
            enablePan 
            enableRotate 
            target={[0, 0.8, 0]}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>
      
      {/* Menú de inventario del armario */}
      {showMenu && (
        <MenuInventarioArmario
          armario={armario}
          baldas={baldas}
          onUpdateBalda={guardarInventario}
          onAsignarRecurso={handleAsignarRecurso}
          onRetirarRecurso={handleRetirarRecurso}
          currentUser={user}
          position={menuPosition}
          onClose={cerrarInventario}
        />
      )}
    </div>
  )
}

export default ArmarioView