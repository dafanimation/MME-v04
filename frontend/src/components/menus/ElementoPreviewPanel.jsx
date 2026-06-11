import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Pc3D } from '../3d/entities/Pc3D'
import { Portatil3D } from '../3d/entities/Portatil3D'
import { Pantalla3D } from '../3d/entities/Pantalla3D'
import { Impresora3D } from '../3d/entities/Impresora3D'
import { Hdd3D } from '../3d/entities/Hdd3D'
import { Usuario3D } from '../3d/entities/Usuario3D'
import { Estanteria3D } from '../3d/entities/Estanteria3D'
import { Armario3D } from '../3d/entities/Armario3D'
import { CuboActividad3D } from '../3d/entities/CuboActividad3D'
import { PiramideProyecto3D } from '../3d/entities/PiramideProyecto3D'
import { CajaHerramientas3D } from '../3d/entities/CajaHerramientas3D'

const AVAILABLE_ENTITIES = [
  { type: 'pc', label: '🖥️ PC', color: '#00ff88' },
  { type: 'portatil', label: '💻 Portátil', color: '#a855f7' },
  { type: 'pantalla', label: '🖵 Pantalla', color: '#2d8cff' },
  { type: 'impresora', label: '🖨️ Impresora', color: '#9ba3ad' },
  { type: 'hdd', label: '💾 Disco Duro', color: '#ff4444' },
  { type: 'usuario', label: '👤 Usuario', color: '#00d4ff' },
  { type: 'estanteria', label: '📚 Estantería', color: '#4dabff' },
  { type: 'armario', label: '🗄️ Armario', color: '#3a7abf' },
  { type: 'actividad', label: '📘 Actividad', color: '#ffaa44' },
  { type: 'proyecto', label: '🏗️ Proyecto', color: '#00d4ff' },
  { type: 'herramienta', label: '🔧 Caja herramientas', color: '#d4a056' },
]

const defaultArmario = {
  id: 1,
  num: 1,
  label: 'Armario Demo',
  tipo: 'principal',
  niveles: 6,
  capacidadTotal: 24,
  position: { x: 0, z: 0 },
}

const getEntityComponent = (entity, position) => {
  switch (entity.type) {
    case 'pc':
      return <Pc3D pc={{ id: entity.id, code: entity.label, status: 'available' }} position={position} />
    case 'portatil':
      return <Portatil3D portatil={{ id: entity.id, code: entity.label, status: 'available' }} position={position} />
    case 'pantalla':
      return <Pantalla3D pantalla={{ id: entity.id, status: 'available' }} position={position} />
    case 'impresora':
      return <Impresora3D impresora={{ id: entity.id, code: entity.label, status: 'available' }} position={position} />
    case 'hdd':
      return <Hdd3D hdd={{ id: entity.id, capacidadGB: 256, tipo: 'SSD', status: 'available' }} position={position} />
    case 'usuario':
      return <Usuario3D user={{ id: entity.id, name: entity.label, email: '', group: '' }} position={position} />
    case 'estanteria':
      return <Estanteria3D estanteria={{ id: entity.id, label: entity.label || 'Estantería', capacidadTotal: entity.capacidadTotal || 6 }} position={position} />
    case 'armario':
      return <Armario3D armario={defaultArmario} position={{ x: 0, z: 0 }} baldas={[]} consumibles={[]} />
    case 'actividad':
      return <CuboActividad3D id={entity.id} position={position} />
    case 'proyecto':
      return <PiramideProyecto3D id={entity.id} position={position} />
    case 'herramienta':
      return <CajaHerramientas3D id={entity.id} position={position} />
    default:
      return null
  }
}

export const ElementoPreviewPanel = () => {
  const [createdEntities, setCreatedEntities] = useState([])
  const [selectedType, setSelectedType] = useState(AVAILABLE_ENTITIES[0].type)
  const [selectedEntityId, setSelectedEntityId] = useState(null)

  const selectedEntity = createdEntities.find((item) => item.id === selectedEntityId) || null

  const handleCreateEntity = () => {
    const entityConfig = AVAILABLE_ENTITIES.find((item) => item.type === selectedType)
    if (!entityConfig) return

    const nextId = Date.now()
    const newEntity = {
      id: nextId,
      type: entityConfig.type,
      label: `${entityConfig.label} ${createdEntities.length + 1}`,
    }
    setCreatedEntities([...createdEntities, newEntity])
    setSelectedEntityId(nextId)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,212,255,0.15)', background: 'rgba(10,10,26,0.95)' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
        <h3 style={{ margin: 0, color: '#00d4ff', fontSize: '14px' }}>🧩 Vista de elemento</h3>
        <p style={{ margin: '6px 0 0 0', color: '#aaa', fontSize: '12px' }}>Selecciona un tipo para ver el render 3D.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 340px) minmax(0, 1fr)', flex: 1, minHeight: 0 }}>
        <aside style={{ borderRight: '1px solid rgba(255,255,255,0.08)', padding: '16px', overflowY: 'auto', minHeight: 0 }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            {AVAILABLE_ENTITIES.map((entity) => (
              <button
                key={entity.type}
                onClick={() => setSelectedType(entity.type)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  textAlign: 'left',
                  background: selectedType === entity.type ? 'rgba(0,212,255,0.15)' : 'transparent',
                  border: `1px solid ${selectedType === entity.type ? '#00d4ff' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {entity.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleCreateEntity}
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
              color: '#111',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ➕ Crear {AVAILABLE_ENTITIES.find((item) => item.type === selectedType)?.label}
          </button>
        </aside>

        <div style={{ position: 'relative', minHeight: 0, minWidth: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#00d4ff' }}>Vista 3D</h4>
              <p style={{ margin: '6px 0 0 0', color: '#aaa', fontSize: '11px' }}>{selectedEntity ? `${selectedEntity.label} (${selectedEntity.type})` : 'Crea y selecciona una entidad.'}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#aaa' }}>
              <span>Creada: {createdEntities.length}</span>
              <span>Seleccionada: {selectedEntity ? 'Sí' : 'No'}</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 'calc(100% - 62px)' }}>
            <Canvas camera={{ position: [2.2, 1.8, 3], fov: 50 }} style={{ width: '100%', height: '100%' }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[3, 4, 2]} intensity={0.7} />
              <pointLight position={[-3, 3, -3]} intensity={0.3} />
              <gridHelper args={[6, 12, '#2a3a5a', '#1a2a3a']} position={[0, -0.01, 0]} />
              {selectedEntity && getEntityComponent(selectedEntity, { x: 0, y: 0.01, z: 0 })}
              <OrbitControls
                enablePan
                enableZoom
                enableRotate
                enableDamping
                dampingFactor={0.08}
                autoRotate={false}
                target={[0, 0, 0]}
                maxPolarAngle={Math.PI / 2.2}
                makeDefault
              />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElementoPreviewPanel
