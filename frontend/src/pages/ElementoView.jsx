// src/pages/ElementoView.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

// Importar componentes 3D (mismos imports)
import { Pc3D } from '../components/3d/entities/Pc3D';
import { Portatil3D } from '../components/3d/entities/Portatil3D';
import { Pantalla3D } from '../components/3d/entities/Pantalla3D';
import { Impresora3D } from '../components/3d/entities/Impresora3D';
import { Hdd3D } from '../components/3d/entities/Hdd3D';
import { Usuario3D } from '../components/3d/entities/Usuario3D';
import { Estanteria3D } from '../components/3d/entities/Estanteria3D';
import { Armario3D } from '../components/3d/entities/Armario3D';
import { CuboActividad3D } from '../components/3d/entities/CuboActividad3D';
import { PiramideProyecto3D } from '../components/3d/entities/PiramideProyecto3D';
import { CajaHerramientas3D } from '../components/3d/entities/CajaHerramientas3D';
import { ArmarioPortatiles3D } from '../components/3d/entities/ArmarioPortatiles3D';
import { Webcam3D } from '../components/3d/entities/Webcam3D';
import { Puerta3D } from '../components/3d/Puerta3D';
import { Ventana3D } from '../components/3d/Ventana3D';

// --------------------------------------------------------------
// Mapa de tamaños (radio aproximado) para cada tipo de entidad
// Se usa para calcular la distancia de cámara óptima
// --------------------------------------------------------------
const ENTITY_SIZE_MAP = {
  pc: 0.5,
  portatil: 0.6,
  pantalla: 0.5,
  impresora: 0.7,
  hdd: 0.3,
  usuario: 0.4,
  estanteria: 1.0,
  armario: 1.2,
  armarioPortatil: 0.9,
  cuboActividad: 0.6,
  piramideProyecto: 0.7,
  cajaHerramientas: 0.3,
  webcam: 0.3,
  puerta: 1.0,
  ventana: 0.8,
};
const DEFAULT_DISTANCE = 3.0;
const BASE_DISTANCE = 2.5;
const DISTANCE_MULTIPLIER = 1.8;

// --------------------------------------------------------------
// Configuración de entidades (con posición)
// --------------------------------------------------------------
const ENTITIES = [
  { id: 'pc', label: '🖥️ PC', component: Pc3D, props: { pc: { id: 1, code: 'PC-01', status: 'available' }, position: { x: 0, y: -0.9, z: 0 } }, sizeKey: 'pc' },
  { id: 'portatil', label: '💻 Portátil', component: Portatil3D, props: { portatil: { id: 1, code: 'LAP-01', status: 'available' }, position: { x: 0, y: -0.05, z: 0 } }, sizeKey: 'portatil' },
  { id: 'pantalla', label: '🖵 Pantalla', component: Pantalla3D, props: { pantalla: { id: 1, status: 'available' }, position: { x: 0, y: -0.4, z: 0 } }, sizeKey: 'pantalla' },
  { id: 'impresora', label: '🖨️ Impresora', component: Impresora3D, props: { impresora: { id: 1, code: 'PRN-01', status: 'available' }, position: { x: 0, y: -0.1, z: 0 } }, sizeKey: 'impresora' },
  { id: 'hdd', label: '💾 Disco Duro', component: Hdd3D, props: { hdd: { id: 1, capacidadGB: 512, tipo: 'SSD', status: 'available' }, position: { x: 0, y: -0.7, z: 0 } }, sizeKey: 'hdd' },
  { id: 'usuario', label: '👤 Usuario', component: Usuario3D, props: { user: { id: 1, name: 'Alumno', email: 'test@test.com', group: 'MME' }, position: { x: 0, y: -0.7, z: 0 } }, sizeKey: 'usuario' },
  { id: 'estanteria', label: '📚 Estantería', component: Estanteria3D, props: { estanteria: { id: 1, label: 'Estantería Demo', capacidadTotal: 12 }, position: { x: 0, y: -0.7, z: 0 } }, sizeKey: 'estanteria' },
  { id: 'armario', label: '🗄️ Armario', component: Armario3D, props: { armario: { id: 1, num: 1, label: 'Armario Demo', tipo: 'principal', niveles: 6, capacidadTotal: 24, position: { x: 0, z: 0 } }, baldas: [], consumibles: [], position: { x: 0, y: -0.9, z: 0 } }, sizeKey: 'armario' },
  { id: 'armarioPortatil', label: '🔋 Armario Portátiles', component: ArmarioPortatiles3D, props: { armario: { id: 1, label: 'Armario Portátiles' }, portatiles: [], position: { x: 0, y: -0.6, z: 0 } }, sizeKey: 'armarioPortatil' },
  { id: 'cuboActividad', label: '📘 Actividad UD', component: CuboActividad3D, props: { actividad: { id: 1, udCode: 'UD01', title: 'Actividad de ejemplo', progreso: 75 }, position: { x: 0, y: -0.15, z: 0 } }, sizeKey: 'cuboActividad' },
  { id: 'piramideProyecto', label: '🏗️ Proyecto', component: PiramideProyecto3D, props: { proyecto: { id: 1, name: 'Proyecto IA', status: 'active', participants: [] }, position: { x: 0, y: -0.25, z: 0 } }, sizeKey: 'piramideProyecto' },
  { id: 'cajaHerramientas', label: '🔧 Caja Herramientas', component: CajaHerramientas3D, props: { id: 1, position: { x: 0, y: -0.05, z: 0 } }, sizeKey: 'cajaHerramientas' },
  { id: 'webcam', label: '🎥 Cámara', component: Webcam3D, props: { isActive: false, position: { x: 0, y: -0.2, z: 0 } }, sizeKey: 'webcam' },
  { id: 'puerta', label: '🚪 Puerta', component: Puerta3D, props: { position: { x: 0, z: 0 }, ancho: 0.8, alto: 2.0 }, sizeKey: 'puerta' },
  { id: 'ventana', label: '🪟 Ventana', component: Ventana3D, props: { position: { x: 0, z: 0 }, ancho: 1.2, alto: 1.5 }, sizeKey: 'ventana' },
];
// --------------------------------------------------------------
// Componente que ajusta la distancia de la cámara según el objeto
// --------------------------------------------------------------
const CameraFitter = ({ selectedId }) => {
  const { camera } = useThree();
  const entity = ENTITIES.find(e => e.id === selectedId);
  const sizeKey = entity?.sizeKey || 'pc';
  const objectSize = ENTITY_SIZE_MAP[sizeKey] || DEFAULT_DISTANCE;
  const idealDistance = BASE_DISTANCE + objectSize * DISTANCE_MULTIPLIER;
  // Guardamos la posición actual de la cámara para conservar la dirección
  const currentDirection = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(0, 0.5, 0)).normalize();
  
  useEffect(() => {
    // Calculamos la nueva posición manteniendo la dirección actual (si existe) o usando una dirección por defecto
    const center = new THREE.Vector3(0, 0.5, 0);
    let newPos;
    if (currentDirection.length() > 0.1) {
      newPos = center.clone().add(currentDirection.clone().multiplyScalar(idealDistance));
    } else {
      newPos = new THREE.Vector3(idealDistance, 1.5, idealDistance);
    }
    camera.position.copy(newPos);
    camera.lookAt(center);
    camera.updateMatrixWorld();
  }, [selectedId, camera, idealDistance, currentDirection]);
  
  return null;
};

// --------------------------------------------------------------
// Componente de escena dinámica
// --------------------------------------------------------------
const DynamicScene = ({ selectedId }) => {
  const entity = ENTITIES.find(e => e.id === selectedId);
  const Component = entity?.component;
  const props = entity?.props || {};
  if (!Component) return null;
  return (
    <group position={[0, 0, 0]}>
      <Component {...props} />
    </group>
  );
};

// --------------------------------------------------------------
// Componente principal
// --------------------------------------------------------------
const ElementoView = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('pc');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#050510' }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ color: '#00d4ff' }}>🧩 Catálogo 3D</h1>
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
          <Canvas camera={{ position: [3, 2, 3], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 8, 5]} intensity={0.8} />
            <directionalLight position={[3, 5, 2]} intensity={0.5} />
            <Grid position={[0, -0.01, 0]} args={[10, 10]} cellSize={0.5} cellThickness={0.5} cellColor="#2a3a5a" sectionSize={1} sectionThickness={1} sectionColor="#4a6a8a" fadeDistance={30} followCamera={false} />
            <axesHelper args={[2]} position={[0, 0, 0]} />
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