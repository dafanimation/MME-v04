// src/pages/ElementoView.jsx
// DESCRIPCIÓN: Vista de catálogo 3D para mostrar todos los elementos disponibles
// FUNCIONALIDAD:
// - Muestra una lista de entidades 3D a la izquierda (PC, usuario, estantería, etc.)
// - Al seleccionar una entidad, se muestra su modelo 3D en el centro con información de dimensiones
// - La cámara se ajusta automáticamente para mostrar el objeto completo    
// - Permite rotar, hacer zoom y pan para inspeccionar el modelo
// - Botón para volver al dashboard
// REVISIONES: 
// - 1.0 (2026-06-06): Versión inicial con catálogo completo de entidades 3D
// NOTAS:
// - Usa datos de ejemplo para cada entidad (desde defaultProps) para mostrar modelos sin depender de la API  
// - Asegura que la cámara se posiciona a una distancia adecuada según el tamaño del objeto
// - El catálogo se genera dinámicamente a partir de los componentes 3D disponibles, lo que facilita la adición de nuevos elementos en el futuro
// - Se han eliminado logs de depuración para una versión más limpia (se pueden reactivar si es necesario)
// asegurarse que todos los elementos dentro del directorio entities 
// se resetan al origen de coordenadas. cuando se visualizan en la page/ElementoView.jsx 
// Dejando el centro de la base. Definimos centro de la base en cada entidad para  
// estandar de objetos 3D.

// VERSIÓN: 1.0
// FECHA: 2026-06-06
// ============================================================
// IMPORTACIONES  
// src/pages/ElementoView.jsx


// src/pages/ElementoView.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { GridSuelo } from '../components/3d/core/GridSuelo';
// Elimina import AutoCenter
import Entities from '../components/3d/entities';
import defaultEntityProps from '../components/3d/entities/defaultProps';

// --------------------------------------------------------------
// Mapa de tamaños (radio aproximado) para cada tipo de entidad
const ENTITY_SIZE_MAP = {
  pc: 0.5, portatil: 0.6, pantalla: 0.5, impresora: 0.7, hdd: 0.3,
  usuario: 0.4, estanteria: 1.0, armario: 1.2, armarioPortatil: 0.9,
  cuboActividad: 0.6, piramideProyecto: 0.7, cajaHerramientas: 0.3,
  webcam: 0.3, puerta: 1.0, ventana: 0.8,
};

const ENTITY_DIMENSIONS = {
  pc: { width: 0.5, height: 0.4, depth: 0.4 },
  portatil: { width: 0.6, height: 0.1, depth: 0.4 },
  pantalla: { width: 0.5, height: 0.4, depth: 0.08 },
  impresora: { width: 0.7, height: 0.35, depth: 0.4 },
  hdd: { width: 0.3, height: 0.15, depth: 0.12 },
  usuario: { width: 0.4, height: 0.8, depth: 0.4 },
  estanteria: { width: 1.0, height: 1.2, depth: 0.5 },
  armario: { width: 1.2, height: 1.8, depth: 0.8 },
  armarioPortatil: { width: 0.8, height: 1.0, depth: 0.5 },
  cuboActividad: { width: 0.6, height: 0.6, depth: 0.6 },
  piramideProyecto: { width: 0.7, height: 0.7, depth: 0.7 },
  cajaHerramientas: { width: 0.9, height: 0.4, depth: 0.4 },
  webcam: { width: 0.3, height: 0.3, depth: 0.3 },
  puerta: { width: 0.8, height: 2.0, depth: 0.1 },
  ventana: { width: 1.2, height: 1.5, depth: 0.05 },
};
const DEFAULT_DISTANCE = 3.0;
const BASE_DISTANCE = 2.5;
const DISTANCE_MULTIPLIER = 1.8;

// --------------------------------------------------------------
// Configuración dinámica de entidades
// --------------------------------------------------------------
const makeLabel = name => name.replace(/3D$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
const DEFAULT_POSITION = { x: 0, y: 0, z: 0 };

const inferSizeKey = (name) => {
  const n = name.toLowerCase();
  if (n.includes('armario')) return n.includes('portatil') ? 'armarioPortatil' : 'armario';
  if (n.includes('portatil')) return 'portatil';
  if (n.includes('pc')) return 'pc';
  if (n.includes('pantalla')) return 'pantalla';
  if (n.includes('impresora')) return 'impresora';
  if (n.includes('hdd')) return 'hdd';
  if (n.includes('usuario')) return 'usuario';
  if (n.includes('estanteria')) return 'estanteria';
  if (n.includes('cubo')) return 'cuboActividad';
  if (n.includes('piramide') || n.includes('proyecto')) return 'piramideProyecto';
  if (n.includes('caja') || n.includes('herramientas')) return 'cajaHerramientas';
  if (n.includes('webcam')) return 'webcam';
  return 'pc';
};

const ENTITIES = Object.keys(Entities).sort().map(key => {
  const sampleSrc = defaultEntityProps[key] || {};
  const sample = { ...sampleSrc };
  const lower = key.toLowerCase();

  // Fallbacks mínimos por tipo
  if (lower.includes('armario') && !sample.armario) sample.armario = { id: 1, num: 1, label: makeLabel(key) };
  if (lower.includes('portatil') && !sample.portatil) sample.portatil = { id: 1, code: 'LAP-01', status: 'available' };
  if (lower.includes('pc') && !lower.includes('pcr') && !sample.pc && !sample.pcs) sample.pc = { id: 1, code: 'PC-01', status: 'available' };
  if (lower.includes('pantalla') && !sample.pantalla) sample.pantalla = { id: 1, status: 'available' };
  if (lower.includes('impresora') && !sample.impresora) sample.impresora = { id: 1, code: 'PRN-01', status: 'available' };
  if (lower.includes('hdd') && !sample.hdd) sample.hdd = { id: 1, capacidadGB: 512, tipo: 'SSD', status: 'available' };
  if (lower.includes('usuario') && !sample.user) sample.user = { id: 1, name: 'Alumno', email: 'test@test.com', group: 'MME' };
  if ((lower.includes('caja') || lower.includes('herramienta')) && !sample.herramientas) sample.herramientas = [{ id: 1, nombre: 'Destornillador' }];
  if (lower.includes('cubo') && !sample.actividad) sample.actividad = { id: 1, udCode: 'UD01', title: 'Actividad demo', progreso: 50 };
  if ((lower.includes('piramide') || lower.includes('proyecto')) && !sample.proyecto) sample.proyecto = { id: 1, name: 'Proyecto demo', status: 'active', participants: [] };
  if (lower.includes('estanteria') && !sample.estanteria) sample.estanteria = { id: 1, label: 'Estantería demo', capacidadTotal: 12 };
  if (lower.includes('mesa')) {
    if (!('pcsCount' in sample)) sample.pcsCount = 1;
    if (!('usuariosCount' in sample)) sample.usuariosCount = 0;
  }
  if (lower.includes('webcam')) {
    if (!('isActive' in sample)) sample.isActive = false;
    if (!('currentUser' in sample)) sample.currentUser = null;
  }

  const pos = sample.position || DEFAULT_POSITION;
  const props = { ...sample, position: pos };
  const sizeKey = sample.sizeKey || inferSizeKey(key);
  return {
    id: key,
    label: makeLabel(key),
    component: Entities[key],
    props,
    sizeKey,
  };
});

const GRID_SIZE = 10;
const GRID_SCALE_LABEL = `Grid: ${GRID_SIZE} x ${GRID_SIZE} unidades (1 unidad = 40 cm)`;

// --------------------------------------------------------------
// Componente que ajusta la distancia de la cámara según el objeto
// --------------------------------------------------------------
const CameraFitter = ({ selectedId }) => {
  const { camera } = useThree();
  const entity = ENTITIES.find(e => e.id === selectedId);
  const sizeKey = entity?.sizeKey || 'pc';
  const objectSize = ENTITY_SIZE_MAP[sizeKey] || DEFAULT_DISTANCE;
  const idealDistance = BASE_DISTANCE + objectSize * DISTANCE_MULTIPLIER;

  useEffect(() => {
    // Mantener la dirección actual de la cámara (si existe)
    const center = new THREE.Vector3(0, 0.5, 0);
    const currentDirection = new THREE.Vector3().subVectors(camera.position, center).normalize();
    let newPos;
    if (currentDirection.length() > 0.1 && !isNaN(currentDirection.x)) {
      newPos = center.clone().add(currentDirection.multiplyScalar(idealDistance));
    } else {
      newPos = new THREE.Vector3(idealDistance, 1.5, idealDistance);
    }
    camera.position.copy(newPos);
    camera.lookAt(center);
    camera.updateMatrixWorld();
  }, [selectedId, camera, idealDistance]);

  return null;
};

// --------------------------------------------------------------
// Escena dinámica SIN AutoCenter (cada componente tiene su base en y=0)
// --------------------------------------------------------------
const DynamicScene = ({ selectedId }) => {
  const entity = ENTITIES.find(e => e.id === selectedId);
  const Component = entity?.component;
  const props = entity?.props || {};
  if (!Component) return null;
  return (
    <group position={[0, 0, 0]}>
      {/* Renderizado directo, sin AutoCenter */}
      <Component {...props} />
    </group>
  );
};

// --------------------------------------------------------------
// Componente principal
// --------------------------------------------------------------
const ElementoView = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(() => ENTITIES[0]?.id || null);
  const selectedDimensions = ENTITY_DIMENSIONS[selectedId] || { width: 0.5, height: 0.5, depth: 0.5 };
  const selectedDimensionsLabel = `Objeto: ${selectedDimensions.width.toFixed(1)} x ${selectedDimensions.height.toFixed(1)} x ${selectedDimensions.depth.toFixed(1)} unidades (≈ ${Math.round(selectedDimensions.width * 40)} x ${Math.round(selectedDimensions.height * 40)} x ${Math.round(selectedDimensions.depth * 40)} cm)`;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#050510' }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#00d4ff', margin: 0 }}>🧩 Catálogo 3D</h1>
          <div style={{ fontSize: '11px', color: '#99d4ff', marginTop: '4px' }}>{GRID_SCALE_LABEL}</div>
          <div style={{ fontSize: '11px', color: '#ffcc55', marginTop: '2px' }}>{selectedDimensionsLabel}</div>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #00d4ff', background: 'transparent', color: '#00d4ff', cursor: 'pointer' }}>← Volver</button>
      </div>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <aside style={{ width: '260px', borderRight: '1px solid rgba(0,212,255,0.2)', overflowY: 'auto', padding: '16px' }}>
          {ENTITIES.map(entity => (
            <button
              key={entity.id}
              onClick={() => setSelectedId(entity.id)}
              style={{
                display: 'block',
                width: '100%',
                marginBottom: '8px',
                padding: '8px',
                background: selectedId === entity.id ? 'rgba(0,212,255,0.2)' : 'transparent',
                border: '1px solid #00d4ff',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {entity.label}
            </button>
          ))}
        </aside>
        <main style={{ flex: 1 }}>
          <Canvas camera={{ position: [2, 10, 8], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[3, 7, 9]} intensity={1} />
            <directionalLight position={[3, 5, 2]} intensity={0.5} />
            <GridSuelo width={10} depth={10} />
            <Text position={[0, 0.02, -2.6]} fontSize={0.1} color="#7fd7ff" anchorX="center">
              {GRID_SCALE_LABEL}
            </Text>
            <Text position={[0, 0.02, 2.6]} fontSize={0.1} color="#ffcc55" anchorX="center">
              {selectedDimensionsLabel}
            </Text>
            <DynamicScene selectedId={selectedId} />
            <CameraFitter selectedId={selectedId} />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              enableDamping={true}
              dampingFactor={0.05}
              autoRotate={false}
              zoomSpeed={1.2}
              rotateSpeed={1.0}
              target={[0, 0.5, 0]}
            />
          </Canvas>
        </main>
      </div>
    </div>
  );
};

export default ElementoView;