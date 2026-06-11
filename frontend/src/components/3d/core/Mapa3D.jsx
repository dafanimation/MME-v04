// ============================================================
// ARCHIVO: Mapa3D.jsx
// DESCRIPCIÓN: Componente principal del mapa 3D
// AUTOR: Sistema MME
// VERSIÓN: 4.0
// FECHA: 2026-06-04
// ============================================================
// Este componente orquesta todos los elementos 3D.
// Versión optimizada con arrays y listas para máxima fluidez.
// ============================================================
// frontend/src/components/3d/core/Mapa3D.jsx
// ============================================================
// ARCHIVO: src/components/3d/core/Mapa3D.jsx
// DESCRIPCIÓN: Componente principal del mapa 3D con Canvas
// RUTAS RELATIVAS: importa desde ./config y ../entities
// FUNCIÓN: Renderiza escena 3D con todos los elementos
// ============================================================

import React, { useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Core 3D
import { GridSuelo } from './GridSuelo';
import { 
  MESA, PC_POSITIONS, USER_POSITIONS, 
  ESTANTERIA_POSITIONS, ARMARIO_POSITIONS,
  DEFAULT_NEW_ELEMENT_POSITIONS,
  ESTADOS
} from './config';

// Entities 3D (ruta relativa a ../entities)
import { Mesa3D } from '../entities/Mesa3D';
import { Usuario3D } from '../entities/Usuario3D';
import { Pc3D } from '../entities/Pc3D';
import { Pantalla3D } from '../entities/Pantalla3D';
import { Hdd3D } from '../entities/Hdd3D';
import { Portatil3D } from '../entities/Portatil3D';
import { Impresora3D } from '../entities/Impresora3D';
import { Estanteria3D } from '../entities/Estanteria3D';
import { Armario3D } from '../entities/Armario3D';
import { CuboActividad3D } from '../entities/CuboActividad3D';
import { PiramideProyecto3D } from '../entities/PiramideProyecto3D';

// Menús (ruta relativa a ../../menus)
import { MenuFlotante } from '../../menus/MenuFlotante';
import { MenuElemento } from '../../menus/MenuElemento';

export const Mapa3D = ({
  recursos = [],
  usuarios = [],
  storageLocations = [],
  selectedResource = null,
  onRecursoClick,
  onUsuarioClick,
  room = 'SALATEST',
  currentUser = null,
}) => {
  // Estados para elementos temporales (modo TEST)
  const [tempPcs, setTempPcs] = useState([]);
  const [tempUsuarios, setTempUsuarios] = useState([]);
  const [tempPantallas, setTempPantallas] = useState([]);
  const [tempHdds, setTempHdds] = useState([]);
  const [tempPortatiles, setTempPortatiles] = useState([]);
  const [tempImpresoras, setTempImpresoras] = useState([]);
  const [tempEstanterias, setTempEstanterias] = useState([]);
  const [tempArmarios, setTempArmarios] = useState([]);
  const [tempActividades, setTempActividades] = useState([]);
  const [tempProyectos, setTempProyectos] = useState([]);
  
  // Estados para selección y menús
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showMenuFlotante, setShowMenuFlotante] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 100, y: 100 });
  
  // Límites
  const MAX_USUARIOS = USER_POSITIONS.length;
  const MAX_PCS = MESA.maxPcs;
  const MAX_ESTANTERIAS = ESTANTERIA_POSITIONS.length;
  const MAX_ARMARIOS = ARMARIO_POSITIONS.length;
  
  // Posicionamiento de elementos
  const positionedPcs = useMemo(() => {
    return tempPcs.map((pc, idx) => ({
      ...pc,
      renderPosition: PC_POSITIONS[idx % PC_POSITIONS.length],
    }));
  }, [tempPcs]);
  
  const positionedUsers = useMemo(() => {
    return tempUsuarios.map((user, idx) => ({
      ...user,
      renderPosition: USER_POSITIONS[idx % USER_POSITIONS.length],
    }));
  }, [tempUsuarios]);
  
  const positionedPantallas = useMemo(() => {
    return tempPantallas.map((pantalla) => {
      const pcPadre = positionedPcs.find(pc => pc.id === pantalla.pcId);
      if (!pcPadre) return { ...pantalla, visible: false };
      return { ...pantalla, renderPosition: pcPadre.renderPosition, visible: true };
    });
  }, [tempPantallas, positionedPcs]);
  
  const positionedHdds = useMemo(() => {
    return tempHdds.map((hdd) => {
      const pcPadre = positionedPcs.find(pc => pc.id === hdd.pcId);
      if (!pcPadre) return { ...hdd, visible: false };
      return { ...hdd, renderPosition: pcPadre.renderPosition, visible: true };
    });
  }, [tempHdds, positionedPcs]);
  
  const positionedEstanterias = useMemo(() => {
    return tempEstanterias.map((est, idx) => ({
      ...est,
      renderPosition: ESTANTERIA_POSITIONS[idx % ESTANTERIA_POSITIONS.length],
    }));
  }, [tempEstanterias]);
  
  const positionedArmarios = useMemo(() => {
    return tempArmarios.map((arm, idx) => ({
      ...arm,
      renderPosition: ARMARIO_POSITIONS[idx % ARMARIO_POSITIONS.length],
    }));
  }, [tempArmarios]);
  
  const positionedActividades = useMemo(() => {
    return tempActividades.map((act, idx) => ({
      ...act,
      renderPosition: DEFAULT_NEW_ELEMENT_POSITIONS[idx % DEFAULT_NEW_ELEMENT_POSITIONS.length],
    }));
  }, [tempActividades]);
  
  const positionedProyectos = useMemo(() => {
    return tempProyectos.map((proy, idx) => ({
      ...proy,
      renderPosition: DEFAULT_NEW_ELEMENT_POSITIONS[(idx + 3) % DEFAULT_NEW_ELEMENT_POSITIONS.length],
    }));
  }, [tempProyectos]);
  
  // Handlers de inserción
  const handleAddPC = useCallback(() => {
    if (tempPcs.length >= MAX_PCS) {
      alert(`Máximo ${MAX_PCS} PCs`);
      return;
    }
    setTempPcs([...tempPcs, {
      id: Date.now(),
      code: `PC-${String(tempPcs.length + 1).padStart(3, '0')}`,
      status: ESTADOS.AVAILABLE,
    }]);
  }, [tempPcs]);
  
  const handleAddUsuario = useCallback(() => {
    if (tempUsuarios.length >= MAX_USUARIOS) {
      alert(`Máximo ${MAX_USUARIOS} usuarios`);
      return;
    }
    setTempUsuarios([...tempUsuarios, {
      id: Date.now(),
      name: `Usuario_${tempUsuarios.length + 1}`,
      email: `user${tempUsuarios.length + 1}@test.local`,
      isActive: true,
      role: 'user',
      group: 'MME',
    }]);
  }, [tempUsuarios]);
  
  const handleAddPantalla = useCallback(() => {
    const pcConEspacio = positionedPcs.find(pc => {
      const count = tempPantallas.filter(p => p.pcId === pc.id).length;
      return count < 2;
    });
    if (!pcConEspacio) {
      alert('No hay PCs con espacio para más pantallas');
      return;
    }
    setTempPantallas([...tempPantallas, {
      id: Date.now(),
      pcId: pcConEspacio.id,
      status: ESTADOS.AVAILABLE,
    }]);
  }, [positionedPcs, tempPantallas]);
  
  const handleAddHDD = useCallback(() => {
    const pcConEspacio = positionedPcs.find(pc => {
      const count = tempHdds.filter(h => h.pcId === pc.id).length;
      return count < 2;
    });
    if (!pcConEspacio) {
      alert('No hay PCs con espacio para más discos duros');
      return;
    }
    setTempHdds([...tempHdds, {
      id: Date.now(),
      pcId: pcConEspacio.id,
      capacidadGB: 512,
      status: ESTADOS.AVAILABLE,
    }]);
  }, [positionedPcs, tempHdds]);
  
  const handleAddPortatil = useCallback(() => {
    setTempPortatiles([...tempPortatiles, {
      id: Date.now(),
      code: `LAP-${String(tempPortatiles.length + 1).padStart(3, '0')}`,
      status: ESTADOS.AVAILABLE,
    }]);
  }, [tempPortatiles]);
  
  const handleAddImpresora = useCallback(() => {
    setTempImpresoras([...tempImpresoras, {
      id: Date.now(),
      code: `PRN-${String(tempImpresoras.length + 1).padStart(3, '0')}`,
      status: ESTADOS.AVAILABLE,
    }]);
  }, [tempImpresoras]);
  
  const handleAddEstanteria = useCallback(() => {
    if (tempEstanterias.length >= MAX_ESTANTERIAS) {
      alert(`Máximo ${MAX_ESTANTERIAS} estanterías`);
      return;
    }
    setTempEstanterias([...tempEstanterias, {
      id: Date.now(),
      label: `Estantería ${tempEstanterias.length + 1}`,
    }]);
  }, [tempEstanterias]);
  
  const handleAddArmario = useCallback(() => {
    if (tempArmarios.length >= MAX_ARMARIOS) {
      alert(`Máximo ${MAX_ARMARIOS} armarios`);
      return;
    }
    setTempArmarios([...tempArmarios, {
      id: Date.now(),
      label: `Armario ${tempArmarios.length + 1}`,
    }]);
  }, [tempArmarios]);
  
  const handleAddActividad = useCallback(() => {
    setTempActividades([...tempActividades, {
      id: Date.now(),
      udCode: `UD${String(tempActividades.length + 1).padStart(2, '0')}`,
      title: `Actividad ${tempActividades.length + 1}`,
      status: ESTADOS.PENDING,
      progreso: 0,
    }]);
  }, [tempActividades]);
  
  const handleAddProyecto = useCallback(() => {
    setTempProyectos([...tempProyectos, {
      id: Date.now(),
      name: `Proyecto ${tempProyectos.length + 1}`,
      status: ESTADOS.ACTIVE,
    }]);
  }, [tempProyectos]);
  
  const handleClearAll = useCallback(() => {
    if (confirm('¿Eliminar todos los elementos?')) {
      setTempPcs([]);
      setTempUsuarios([]);
      setTempPantallas([]);
      setTempHdds([]);
      setTempPortatiles([]);
      setTempImpresoras([]);
      setTempEstanterias([]);
      setTempArmarios([]);
      setTempActividades([]);
      setTempProyectos([]);
      setSelectedElement(null);
    }
  }, []);
  
  const handleSelectElement = (element, type, event) => {
    setSelectedElement(element);
    setSelectedType(type);
    if (event?.clientX) {
      setMenuPosition({ x: event.clientX + 10, y: event.clientY - 50 });
    }
  };
  
  const handleUpdateElement = (updates) => {
    if (!selectedElement) return;
    const updateState = (setter) => {
      setter(prev => prev.map(item => 
        item.id === selectedElement.id ? { ...item, ...updates } : item
      ));
    };
    switch (selectedType) {
      case 'pc': updateState(setTempPcs); break;
      case 'usuario': updateState(setTempUsuarios); break;
      case 'pantalla': updateState(setTempPantallas); break;
      case 'hdd': updateState(setTempHdds); break;
      case 'portatil': updateState(setTempPortatiles); break;
      case 'impresora': updateState(setTempImpresoras); break;
      case 'estanteria': updateState(setTempEstanterias); break;
      case 'armario': updateState(setTempArmarios); break;
      case 'actividad': updateState(setTempActividades); break;
      case 'proyecto': updateState(setTempProyectos); break;
      default: break;
    }
    setSelectedElement(prev => ({ ...prev, ...updates }));
  };
  
  const handleDeleteElement = () => {
    if (!selectedElement) return;
    const deleteFromState = (setter) => {
      setter(prev => prev.filter(item => item.id !== selectedElement.id));
    };
    switch (selectedType) {
      case 'pc': deleteFromState(setTempPcs); break;
      case 'usuario': deleteFromState(setTempUsuarios); break;
      case 'pantalla': deleteFromState(setTempPantallas); break;
      case 'hdd': deleteFromState(setTempHdds); break;
      case 'portatil': deleteFromState(setTempPortatiles); break;
      case 'impresora': deleteFromState(setTempImpresoras); break;
      case 'estanteria': deleteFromState(setTempEstanterias); break;
      case 'armario': deleteFromState(setTempArmarios); break;
      case 'actividad': deleteFromState(setTempActividades); break;
      case 'proyecto': deleteFromState(setTempProyectos); break;
      default: break;
    }
    setSelectedElement(null);
    setSelectedType(null);
  };
  
  const buttonStyle = (color) => ({
    padding: '6px 12px',
    background: `rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.15)`,
    border: `1px solid ${color}`,
    borderRadius: '20px',
    color: color,
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 'bold',
  });
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050510' }}>
      
      {/* Panel de control TEST */}
      {room === 'SALATEST' && (
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
          background: 'rgba(0,0,0,0.85)', padding: '8px 16px', borderRadius: '30px',
        }}>
          <button onClick={handleAddPC} style={buttonStyle('#00ff88')}>🖥️ + PC ({tempPcs.length}/{MAX_PCS})</button>
          <button onClick={handleAddUsuario} style={buttonStyle('#00d4ff')}>👤 + Usuario ({tempUsuarios.length}/{MAX_USUARIOS})</button>
          <button onClick={handleAddPantalla} style={buttonStyle('#2d8cff')}>🖵 + Pantalla</button>
          <button onClick={handleAddHDD} style={buttonStyle('#ff4444')}>💾 + HDD</button>
          <button onClick={handleAddPortatil} style={buttonStyle('#a855f7')}>💻 + Portátil</button>
          <button onClick={handleAddImpresora} style={buttonStyle('#9ba3ad')}>🖨️ + Impresora</button>
          <button onClick={handleAddEstanteria} style={buttonStyle('#4dabff')}>📚 + Estantería</button>
          <button onClick={handleAddArmario} style={buttonStyle('#3a7abf')}>🗄️ + Armario</button>
          <button onClick={handleAddActividad} style={buttonStyle('#ffaa44')}>📘 + Actividad</button>
          <button onClick={handleAddProyecto} style={buttonStyle('#00d4ff')}>🏗️ + Proyecto</button>
          <button onClick={handleClearAll} style={buttonStyle('#ff4444')}>🗑️ Limpiar</button>
          <button onClick={() => setShowMenuFlotante(!showMenuFlotante)} style={buttonStyle('#ffaa44')}>📋 Menú</button>
        </div>
      )}
      
      {/* Menú flotante */}
      {showMenuFlotante && room === 'SALATEST' && (
        <MenuFlotante
          onClose={() => setShowMenuFlotante(false)}
          onInsertarPC={handleAddPC}
          onInsertarUsuario={handleAddUsuario}
          onInsertarEstanteria={handleAddEstanteria}
          onInsertarArmario={handleAddArmario}
          onInsertarPantalla={handleAddPantalla}
          onInsertarHDD={handleAddHDD}
          onInsertarPortatil={handleAddPortatil}
          onInsertarImpresora={handleAddImpresora}
          onInsertarCuboActividad={handleAddActividad}
          onInsertarPiramideProyecto={handleAddProyecto}
          usuariosCount={tempUsuarios.length}
          maxUsuarios={MAX_USUARIOS}
          pcsCount={tempPcs.length}
          maxPcs={MAX_PCS}
        />
      )}
      
      {/* Menú contextual */}
      {selectedElement && selectedType !== 'mesa' && (
        <MenuElemento
          elemento={selectedElement}
          tipo={selectedType}
          onUpdate={handleUpdateElement}
          onDelete={handleDeleteElement}
          position={menuPosition}
        />
      )}
      
      {/* ESCENA 3D */}
      <Canvas camera={{ position: [3, 2, 3], fov: 45 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 8, 5]} intensity={0.8} />
        <directionalLight position={[3, 5, 2]} intensity={0.5} />
        
        <GridSuelo />
        
        <Mesa3D 
          isSelected={selectedType === 'mesa'}
          onClick={() => setSelectedType('mesa')}
          pcsCount={tempPcs.length}
          usuariosCount={tempUsuarios.length}
        />
        
        {/* Renderizar todos los elementos 3D */}
        {positionedEstanterias.map((est) => (
          <Estanteria3D key={`est-${est.id}`} estanteria={est} position={est.renderPosition} />
        ))}
        
        {positionedArmarios.map((arm) => (
          <Armario3D key={`arm-${arm.id}`} armario={arm} position={arm.renderPosition} />
        ))}
        
        {positionedUsers.map((user) => (
          <Usuario3D
            key={`user-${user.id}`}
            user={user}
            position={user.renderPosition}
            isActive={user.isActive}
            isSelected={selectedType === 'usuario' && selectedElement?.id === user.id}
            onClick={(u, e) => handleSelectElement(u, 'usuario', e)}
          />
        ))}
        
        {positionedPcs.map((pc) => (
          <Pc3D
            key={`pc-${pc.id}`}
            pc={pc}
            position={pc.renderPosition}
            isSelected={selectedType === 'pc' && selectedElement?.id === pc.id}
            onClick={(p, e) => handleSelectElement(p, 'pc', e)}
          />
        ))}
        
        {positionedPantallas.filter(p => p.visible).map((pantalla, idx) => (
          <Pantalla3D
            key={`pantalla-${pantalla.id}`}
            pantalla={pantalla}
            position={pantalla.renderPosition}
            indice={idx % 2}
            isSelected={selectedType === 'pantalla' && selectedElement?.id === pantalla.id}
            onClick={(p, e) => handleSelectElement(p, 'pantalla', e)}
          />
        ))}
        
        {positionedHdds.filter(h => h.visible).map((hdd, idx) => (
          <Hdd3D
            key={`hdd-${hdd.id}`}
            hdd={hdd}
            position={hdd.renderPosition}
            indice={idx % 2}
            isSelected={selectedType === 'hdd' && selectedElement?.id === hdd.id}
            onClick={(h, e) => handleSelectElement(h, 'hdd', e)}
          />
        ))}
        
        {tempPortatiles.map((portatil, idx) => (
          <Portatil3D
            key={`portatil-${portatil.id}`}
            portatil={portatil}
            position={DEFAULT_NEW_ELEMENT_POSITIONS[(idx + 6) % DEFAULT_NEW_ELEMENT_POSITIONS.length]}
            isSelected={selectedType === 'portatil' && selectedElement?.id === portatil.id}
            onClick={(p, e) => handleSelectElement(p, 'portatil', e)}
          />
        ))}
        
        {tempImpresoras.map((impresora, idx) => (
          <Impresora3D
            key={`impresora-${impresora.id}`}
            impresora={impresora}
            position={DEFAULT_NEW_ELEMENT_POSITIONS[(idx + 9) % DEFAULT_NEW_ELEMENT_POSITIONS.length]}
            isSelected={selectedType === 'impresora' && selectedElement?.id === impresora.id}
            onClick={(i, e) => handleSelectElement(i, 'impresora', e)}
          />
        ))}
        
        {positionedActividades.map((actividad) => (
          <CuboActividad3D
            key={`act-${actividad.id}`}
            actividad={actividad}
            position={actividad.renderPosition}
            isSelected={selectedType === 'actividad' && selectedElement?.id === actividad.id}
            onClick={(a, e) => handleSelectElement(a, 'actividad', e)}
          />
        ))}
        
        {positionedProyectos.map((proyecto) => (
          <PiramideProyecto3D
            key={`proy-${proyecto.id}`}
            proyecto={proyecto}
            position={proyecto.renderPosition}
            isSelected={selectedType === 'proyecto' && selectedElement?.id === proyecto.id}
            onClick={(p, e) => handleSelectElement(p, 'proyecto', e)}
          />
        ))}
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          enableDamping
          dampingFactor={0.08}
          autoRotate={false}
          target={[0, 0.8, 0]}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
};

export default Mapa3D;