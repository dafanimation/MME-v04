// ============================================================
// ARCHIVO: src/pages/CajaHerramientasView.jsx
// DESCRIPCIÓN: Vista dedicada para la caja de herramientas con gestión de inventario
// RUTAS: /caja-herramientas → Vista interactiva de la caja de herramientas
// VERSIÓN: 2.0
// FECHA: 2026-06-08
// ============================================================
// CAMBIOS VERSIÓN 2.0:
// - Escala unificada: 1 unidad = 40cm (como AulaTaller3D)
// - GridSuelo ahora visible correctamente
// - Dimensiones y etiquetas coherentes con el resto del sistema
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import { GridSuelo } from '../components/3d/core/GridSuelo';
import { CajaHerramientas3D } from '../components/3d/entities/CajaHerramientas3D';
import { MenuCajaHerramientas } from '../components/menus/MenuCajaHerramientas';
import { getUser, isAdmin } from '../services/auth';
import MenuAdmin from '../components/menus/MenuAdmin';
import { TILE_SIZE, unitsToCm } from '../components/3d/core/config';

// Herramientas por defecto
const DEFAULT_HERRAMIENTAS = [
  { id: 1, nombre: 'Martillo', tipo: 'golpe', cantidad: 1 },
  { id: 2, nombre: 'Destornillador Phillips', tipo: 'giro', cantidad: 2 },
  { id: 3, nombre: 'Destornillador plano', tipo: 'giro', cantidad: 2 },
  { id: 4, nombre: 'Llave inglesa', tipo: 'ajuste', cantidad: 1 },
  { id: 5, nombre: 'Alicates', tipo: 'presión', cantidad: 1 },
  { id: 6, nombre: 'Cinta métrica', tipo: 'medida', cantidad: 1 },
  { id: 7, nombre: 'Nivel', tipo: 'medida', cantidad: 1 },
  { id: 8, nombre: 'Taladro', tipo: 'motor', cantidad: 1, requiereBateria: true },
];

// Configuración de escala (1 unidad = 40cm)
const CELL_SIZE_CM = 40;
const GRID_CELLS = 16;        // 16 x 16 celdas = 6.4m x 6.4m
const GRID_SIZE_UNITS = GRID_CELLS * TILE_SIZE;  // 16 * 0.4 = 6.4 unidades

const CajaHerramientasView = () => {
  const navigate = useNavigate();
  const user = getUser();
  const userIsAdmin = isAdmin();
  const [herramientas, setHerramientas] = useState([]);
  const [isAbierta, setIsAbierta] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 100, y: 100 });
  const [mensaje, setMensaje] = useState('');

  // Cargar herramientas desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('caja_herramientas_contenido');
    if (saved) {
      setHerramientas(JSON.parse(saved));
    } else {
      setHerramientas(DEFAULT_HERRAMIENTAS);
    }
  }, []);

  // Guardar herramientas
  const guardarHerramientas = (nuevas) => {
    setHerramientas(nuevas);
    localStorage.setItem('caja_herramientas_contenido', JSON.stringify(nuevas));
    mostrarMensaje('✅ Inventario guardado', 'success');
  };

  // Añadir herramienta
  const handleAgregarHerramienta = (nombre, tipo, cantidad = 1) => {
    const nueva = {
      id: Date.now(),
      nombre,
      tipo,
      cantidad,
    };
    guardarHerramientas([...herramientas, nueva]);
  };

  // Eliminar herramienta
  const handleEliminarHerramienta = (id) => {
    guardarHerramientas(herramientas.filter(h => h.id !== id));
  };

  // Actualizar cantidad
  const handleActualizarCantidad = (id, delta) => {
    const nuevas = herramientas.map(h =>
      h.id === id ? { ...h, cantidad: Math.max(1, (h.cantidad || 1) + delta) } : h
    );
    guardarHerramientas(nuevas);
  };

  const mostrarMensaje = (texto, tipo = 'info') => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 2500);
  };

  // Información de escala (mostrada en UI)
  const gridInfoText = `Grid: ${GRID_CELLS} x ${GRID_CELLS} celdas (${GRID_CELLS * CELL_SIZE_CM} x ${GRID_CELLS * CELL_SIZE_CM} cm)`;
  
  // Dimensiones de la caja en cm (convertidas desde unidades)
  const cajaAnchoCm = unitsToCm(0.9);
  const cajaAltoCm = unitsToCm(isAbierta ? 0.2 : 0.4);
  const cajaFondoCm = unitsToCm(0.4);
  const cajaInfoText = `Caja: ${cajaAnchoCm} x ${cajaAltoCm} x ${cajaFondoCm} cm`;

  const handleCajaClick = (id, event) => {
    setShowMenu(true);
    setMenuPosition({ x: event.clientX + 10, y: event.clientY - 50 });
  };

  // Posición Y para los textos del grid (justo encima del suelo)
  const textYPosition = -0.15;

  return (
    <div>
      <MenuAdmin />
      <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', background: '#050510' }}>
        {/* Header */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid rgba(0,212,255,0.3)',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ color: '#00d4ff', margin: 0 }}>🔧 Caja de Herramientas</h2>
            <p style={{ fontSize: '11px', color: '#aaa', margin: '4px 0 0' }}>
              {herramientas.length} herramientas | Estado: {isAbierta ? 'Abierta' : 'Cerrada'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setIsAbierta(!isAbierta)}
              style={{
                padding: '6px 12px',
                background: isAbierta ? 'rgba(255,170,0,0.2)' : 'rgba(0,212,255,0.2)',
                border: `1px solid ${isAbierta ? '#ffaa44' : '#00d4ff'}`,
                borderRadius: '6px',
                color: isAbierta ? '#ffaa44' : '#00d4ff',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {isAbierta ? '🔒 Cerrar caja' : '📦 Abrir caja'}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              ← Volver
            </button>
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
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
          }}>
            {mensaje}
          </div>
        )}

        {/* Área 3D */}
        <div style={{ flex: 1, position: 'relative' }}>
        {/* Iluminación ambiental fuerte (no depende de distancia) */}
          <Canvas camera={{ position: [3, 2.5, 3], fov: 45 }}>
            <ambientLight intensity={0.8} />
            
            {/* Luz principal desde arriba (siempre ilumina el centro) */}
            <directionalLight 
            position={[0, 10, 0]} 
            intensity={1.2} 
            target-position={[0, 0, 0]}
            />
            
            {/* Luz de relleno desde los lados */}
            <pointLight position={[5, 3, 5]} intensity={0.6} />
            <pointLight position={[-5, 3, -5]} intensity={0.4} />
            
            {/* Luz específica para la caja (sigue al centro) */}
            <spotLight
            position={[0, 5, 3]}
            intensity={0.8}
            angle={0.5}
            penumbra={0.3}
            target-position={[0, 0, 0]}
            />
            {/* Suelo con grid - AHORA VISIBLE Y ESCALA CORRECTA */}
            <GridSuelo 
                width={16}
                depth={16}
                cellSize={0.4}
            />
            
            {/* Texto de información del grid (en el suelo) */}
            <Text 
              position={[0, textYPosition + 0.05, -GRID_SIZE_UNITS / 2 + 0.8]} 
              fontSize={0.1} 
              color="#7fd7ff" 
              anchorX="center"
            >
              {gridInfoText}
            </Text>
            
            {/* Texto de información de la caja */}
            <Text 
              position={[0, textYPosition + 0.05, GRID_SIZE_UNITS / 2 - 0.8]} 
              fontSize={0.1} 
              color="#ffcc55" 
              anchorX="center"
            >
              {cajaInfoText}
            </Text>
            
            {/* Caja de herramientas centrada en (0,0,0) - Escala 1:1 con config */}
            <CajaHerramientas3D
              id={1}
              position={{ x: 0, y: 0, z: 0 }}
              isAbierta={isAbierta}
              herramientas={herramientas}
              onClick={handleCajaClick}
              onHerramientaClick={(herramienta, idx) => {
                console.log('Herramienta clickeada:', herramienta);
                mostrarMensaje(`🔧 ${herramienta.nombre} seleccionada`, 'info');
              }}
            />
            
            {/* Controles de cámara */}
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
              maxPolarAngle={Math.PI / 2.2}
            />
          </Canvas>
        </div>

        {/* Menú de gestión */}
        {showMenu && userIsAdmin && (
          <MenuCajaHerramientas
            herramientas={herramientas}
            onAgregar={handleAgregarHerramienta}
            onEliminar={handleEliminarHerramienta}
            onActualizarCantidad={handleActualizarCantidad}
            position={menuPosition}
            onClose={() => setShowMenu(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CajaHerramientasView;