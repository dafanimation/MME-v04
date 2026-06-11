// src/pages/ActividadesView.jsx
// ============================================================
// ARCHIVO: src/pages/ActividadesView.jsx
// DESCRIPCIÓN: Vista 3D de actividades por UD
// RUTAS: /actividades → Vista 3D de actividades agrupadas por UD
// VERSION: 1.0 - Implementación inicial
// ============================================================
// REVISIONES:
// 1.0 - Implementación inicial con carga de actividades desde API, agrupación por UD, y visualización en cubos 3D con estados de progreso.
// ============================================================
// src/pages/ActividadesView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { GridSuelo } from '../components/3d/core/GridSuelo';
import { CuboActividad3D } from '../components/3d/entities/CuboActividad3D';
import { Usuario3D } from '../components/3d/entities/Usuario3D';
import MenuAdmin from '../components/menus/MenuAdmin';
import { api } from '../services/api';
import { getUser } from '../services/auth';
import ActividadModal from '../components/activities/ActividadModal';

const UD_COLUMNS = {
  UD01: -2.5,
  UD02: -1.0,
  UD03: 0.5,
  UD04: 2.0,
  UD05: 3.5,
  UD06: 5.0,
};

const ActividadesView = () => {
  const [actividades, setActividades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const currentUser = getUser();

  const cargarActividades = async () => {
    try {
      const data = await api.getUdActivities({ limit: 50 });
      const acts = Array.isArray(data) ? data : data?.data || [];
      const actsConProgreso = await Promise.all(acts.map(async (act) => {
        try {
          const progress = await api.getMyActivityProgress(act.id);
          return {
            ...act,
            estado: progress?.status === 'completed' ? 'completada' : (progress?.status === 'validated' ? 'verificada' : 'pendiente'),
            progreso: progress?.progress || 0,
          };
        } catch {
          return { ...act, estado: 'pendiente', progreso: 0 };
        }
      }));
      setActividades(actsConProgreso);
    } catch (error) {
      console.error('Error cargando actividades:', error);
      const { getActividades } = await import('../services/actividadesService');
      const localActs = getActividades();
      setActividades(localActs.map(act => ({ ...act, estado: 'pendiente', progreso: 0 })));
    }
  };

  const cargarUsuarios = async () => {
    try {
      const users = await api.getUsers({ limit: 50 });
      setUsuarios(Array.isArray(users) ? users : users?.data || []);
    } catch (error) {
      if (currentUser) setUsuarios([currentUser]);
    }
  };

  useEffect(() => {
    cargarActividades();
    cargarUsuarios();
  }, []);

  const handleActividadClick = (actividad) => {
    setSelectedActividad(actividad);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActividad(null);
    cargarActividades(); // refrescar progreso
  };

  // Agrupar actividades por UD y calcular posición Y de cada cubo
  const actividadesPorUD = {};
  actividades.forEach(act => {
    if (!actividadesPorUD[act.udCode]) actividadesPorUD[act.udCode] = [];
    actividadesPorUD[act.udCode].push(act);
  });
  for (const ud in actividadesPorUD) {
    actividadesPorUD[ud].sort((a, b) => (a.codigoCorto || '').localeCompare(b.codigoCorto || ''));
  }

  // Calcular la posición (x, y, z) de cada actividad
  const actividadPositions = useMemo(() => {
    const positions = {};
    for (const udCode in actividadesPorUD) {
      const list = actividadesPorUD[udCode];
      const x = UD_COLUMNS[udCode] ?? 0;
      let y = 0.3; // centro del primer cubo (base 0 + altura/2)
      list.forEach(act => {
        positions[act.id] = { x, y, z: 0 };
        y += 0.65;
      });
    }
    return positions;
  }, [actividadesPorUD]);

  // Asignar usuarios a actividades (distribución equitativa)
  const usuariosPorActividad = useMemo(() => {
    const asignaciones = {};
    if (actividades.length === 0) return asignaciones;
    usuarios.forEach((user, idx) => {
      const actIdx = idx % actividades.length;
      const actId = actividades[actIdx].id;
      if (!asignaciones[actId]) asignaciones[actId] = [];
      asignaciones[actId].push(user);
    });
    return asignaciones;
  }, [actividades, usuarios]);

  const renderActividades = () => {
    const elements = [];
    for (const udCode in actividadesPorUD) {
      const list = actividadesPorUD[udCode];
      const x = UD_COLUMNS[udCode] ?? 0;
      let y = 0.3;
      list.forEach((act) => {
        elements.push(
          <CuboActividad3D
            key={act.id}
            actividad={act}
            position={{ x, y, z: 0 }}
            estado={act.estado}
            onClick={handleActividadClick}
          />
        );
        y += 0.65;
      });
    }
    return elements;
  };

  const renderUsuariosPorActividad = () => {
    const elements = [];
    for (const actId in usuariosPorActividad) {
      const users = usuariosPorActividad[actId];
      const posAct = actividadPositions[actId];
      if (!posAct) continue;
      // Colocar usuarios delante del cubo (eje Z positivo), en fila horizontal (eje X) o profundidad?
      // Usaremos profundidad (Z) para que no solapen con otros usuarios de la misma columna
      const startZ = 0.6; // delante del cubo
      const stepZ = 0.5;
      users.forEach((user, idx) => {
        elements.push(
          <Usuario3D
            key={user.id || idx}
            user={user}
            position={{ x: posAct.x, y: 0.15, z: startZ + idx * stepZ }}
            isActive={user.isActive !== false}
            onClick={(u) => console.log('Usuario clickeado:', u)}
          />
        );
      });
    }
    return elements;
  };

  const gridSize = 12;
  const gridLabel = `Grid: ${gridSize} x ${gridSize} unidades (1 unidad = 40 cm)`;

  return (
    <div>
      <MenuAdmin />
      <div style={{ height: 'calc(100vh - 60px)', position: 'relative', background: '#050510' }}>
        <Canvas camera={{ position: [3, 4, 5], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 8, 5]} intensity={0.8} />
          <directionalLight position={[3, 5, 2]} intensity={0.5} />
          
          <GridSuelo width={gridSize} depth={gridSize} />
          <Text position={[0, 0.02, -gridSize/2 + 0.5]} fontSize={0.1} color="#7fd7ff" anchorX="center">
            {gridLabel}
          </Text>
          <Text position={[0, 0.02, gridSize/2 - 0.5]} fontSize={0.1} color="#ffcc55" anchorX="center">
            Actividades por UD
          </Text>

          {renderActividades()}
          {renderUsuariosPorActividad()}

          <OrbitControls
            enableZoom
            enablePan
            enableRotate
            enableDamping
            dampingFactor={0.05}
            autoRotate={false}
            zoomSpeed={1.2}
            rotateSpeed={1.0}
            target={[0, 2, 0]}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>

        <button
          onClick={() => window.location.href = '/dashboard'}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 100,
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid #00d4ff',
            borderRadius: '6px',
            color: '#00d4ff',
            cursor: 'pointer',
          }}
        >
          ← Volver al Dashboard
        </button>
      </div>

      {showModal && selectedActividad && (
        <ActividadModal
          actividad={selectedActividad}
          onClose={handleCloseModal}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default ActividadesView;